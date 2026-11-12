#!/usr/bin/env python3
"""map-location-video v3.1 — chạy trên máy chủ của Claude (Python + Playwright + Chrome).

Lệnh (mọi lệnh in 1 dòng JSON ra stdout):
  geo    "tên 1" ["tên 2"...] --near LAT,LON        tọa độ qua Photon → Nominatim (MLV.geo)
  gmaps  "<link Google Maps | tên địa điểm>"...     tọa độ đọc từ Google Maps
  gpoi   LAT LON [--km 8] [--per 3] [--dist]          tiện ích nổi bật theo Google Maps (11 loại, xếp theo số đánh giá)
  poi    LAT LON [--km 3] [--dist]                   ứng viên tiện ích (MLV.poi) [+ km/phút]
  dist   LAT LON --pois pois.json [--travel moto|car] km/phút xe máy (mặc định, 25–30 km/h) hoặc ô tô (OSRM)
  brand  <url web dự án> --out DIR                   màu, font (tải file), logo (logo.png); trang nặng → tự đọc HTML/CSS
  images "<từ khóa>" --out DIR --prefix p1 [--n 2] [--place "<tên, tỉnh>"]
                                                     tìm + tải ảnh web (Bing, ảnh địa điểm Google Maps, DDG), giữ n ảnh
  renders <url web dự án> --out DIR [--n 6]         ảnh phối cảnh lớn (≥1100 px, ngang) cho cảnh mở/kết
  run    cfg.json --out DIR [--frames auto|"4.5,10.6"] [--video] [--set k=v ...]
                                                     dựng: khung hình mẫu (JPEG) và/hoặc MP4 (tiếng AAC)
                                                     --frames auto: (khung 0 giây khi có hero/hook) + khung mở + 1 khung/tiện ích + khung kết
                                                     --set bright=0.5: ghi đè CFG không sửa file
  compose out.jpg "a.jpg|Nhãn A" "b.jpg|Nhãn B"... [--h 480] [--cols 4]   ghép ảnh có nhãn (lưới)

File cục bộ trong cfg.json (pois[].photo, markerUrl, brand.logo, brand.fontUrl, voice.url,
voice.wordsUrl, music.url, hero.intro, hero.outro) được phục vụ cùng nguồn với trang engine, không cần đưa lên CDN;
ảnh/logo/font là URL web được tải trước về <out>/_cache.
Có voice.wordsUrl cục bộ (words.json của tts.py) → tự điền poiDur, introDur, outroDur còn thiếu trong cfg; hookDur (khớp phách nhạc) → hero.dur.
"""
import argparse, asyncio, base64, hashlib, io, json, mimetypes, os, re, shutil, subprocess, sys, time, urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENGINE_FILE = ROOT / "mlv-engine-3.6.0.js"
ORIGIN = "https://server.arcgisonline.com"
PAGE = ORIGIN + "/__mlv/index.html"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/131.0.0.0 Safari/537.36")
BRAND_JS = (ROOT / "tools" / "brand-snippet.js")


def out(obj, code=0):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    print(json.dumps(obj, ensure_ascii=False))
    sys.exit(code)


async def open_browser(p):
    kw = {"args": ["--ignore-certificate-errors", "--use-gl=swiftshader", "--enable-unsafe-swiftshader",
                   "--autoplay-policy=no-user-gesture-required", "--lang=vi-VN"]}
    for c in ("/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"):
        if os.path.exists(c):
            kw["executable_path"] = c
            break
    px = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    if px:
        kw["proxy"] = {"server": px}
    b = await p.chromium.launch(**kw)
    ctx = await b.new_context(ignore_https_errors=True, user_agent=UA, locale="vi-VN",
                              viewport={"width": 1280, "height": 900})
    return b, ctx


async def engine_page(ctx, files=None):
    files = files or {}
    page = await ctx.new_page()

    async def handler(route):
        u = route.request.url.split("?")[0]
        if u == PAGE:
            return await route.fulfill(status=200, content_type="text/html",
                                       body='<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>')
        name = u.rsplit("/", 1)[-1]
        if name in files:
            ct = mimetypes.guess_type(name)[0] or "application/octet-stream"
            return await route.fulfill(status=200, content_type=ct, body=files[name].read_bytes(),
                                       headers={"Access-Control-Allow-Origin": "*"})
        return await route.fulfill(status=404, body="not found")

    await page.route(ORIGIN + "/__mlv/**", handler)
    await page.goto(PAGE)
    await page.add_script_tag(content=ENGINE_FILE.read_text(encoding="utf-8"))
    return page


def localize(cfg, base):
    """Đổi đường dẫn file cục bộ trong cfg thành URL cùng nguồn; trả (cfg, files)."""
    files = {}

    def m(v):
        if not isinstance(v, str) or re.match(r"^(https?:|data:)", v):
            return v
        p = (base / v).resolve() if not os.path.isabs(v) else Path(v)
        if not p.exists():
            raise SystemExit(json.dumps({"ok": False, "err": f"Không thấy file: {v}"}, ensure_ascii=False))
        key = hashlib.sha1(str(p).encode()).hexdigest()[:10] + p.suffix.lower()
        files[key] = p
        return f"{ORIGIN}/__mlv/f/{key}"

    cfg = json.loads(json.dumps(cfg))
    wu = (cfg.get("voice") or {}).get("wordsUrl") if isinstance(cfg.get("voice"), dict) else None
    if wu and not re.match(r"^(https?:|data:)", wu):  # lấy poiDur/introDur/outroDur từ words.json của tts.py
        try:
            w = json.loads(((base / wu) if not os.path.isabs(wu) else Path(wu)).read_text(encoding="utf-8"))
            for k in ("poiDur", "introDur", "outroDur"):
                if k in w and k not in cfg:
                    cfg[k] = w[k]
            if w.get("hookDur") and cfg.get("hook"):  # cắt câu móc đúng phách nhạc
                if isinstance(cfg.get("hero"), dict):
                    cfg["hero"]["dur"] = w["hookDur"]
                cfg["hookDur"] = w["hookDur"]
            if w.get("beat") and "beat" not in cfg:  # bật ảnh/nhãn tiện ích đúng phách
                cfg["beat"] = w["beat"]
        except Exception:
            pass
    if "markerUrl" in cfg:
        cfg["markerUrl"] = m(cfg["markerUrl"])
    if isinstance(cfg.get("brand"), dict):
        for k in ("logo", "fontUrl"):
            if cfg["brand"].get(k):
                cfg["brand"][k] = m(cfg["brand"][k])
    if isinstance(cfg.get("voice"), dict):
        for k in ("url", "wordsUrl"):
            if cfg["voice"].get(k):
                cfg["voice"][k] = m(cfg["voice"][k])
    if isinstance(cfg.get("music"), dict) and cfg["music"].get("url"):
        cfg["music"]["url"] = m(cfg["music"]["url"])
    for poi in cfg.get("pois", []):
        if poi.get("photo"):
            poi["photo"] = m(poi["photo"])
    if isinstance(cfg.get("hero"), str):
        cfg["hero"] = m(cfg["hero"])
    elif isinstance(cfg.get("hero"), dict):
        for k in ("intro", "outro", "url"):
            if cfg["hero"].get(k):
                cfg["hero"][k] = m(cfg["hero"][k])
    return cfg, files


async def fetch_remote(cfg, ctx, cache):
    """Tải trước ảnh tiện ích, logo, font, ảnh ghim là URL web về cache (tránh lỗi CORS); lỗi thì giữ URL."""
    slots = [(poi, "photo") for poi in cfg.get("pois", [])]
    if isinstance(cfg.get("brand"), dict):
        slots += [(cfg["brand"], "logo"), (cfg["brand"], "fontUrl")]
    slots.append((cfg, "markerUrl"))
    if isinstance(cfg.get("hero"), dict):
        slots += [(cfg["hero"], "intro"), (cfg["hero"], "outro")]
    warn = []
    for obj, k in slots:
        u = obj.get(k)
        if not (isinstance(u, str) and u.startswith("http")):
            continue
        ext = (os.path.splitext(urllib.parse.urlparse(u).path)[1] or ".bin")[:6].lower()
        f = cache / (hashlib.sha1(u.encode()).hexdigest()[:12] + ext)
        if not f.exists():
            try:
                r = await ctx.request.get(u, headers={"User-Agent": UA}, timeout=15000)
                if not r.ok:
                    raise RuntimeError(f"HTTP {r.status}")
                cache.mkdir(parents=True, exist_ok=True); f.write_bytes(await r.body())
            except Exception as e:
                warn.append(f"{k}: {u[:80]} ({e})"); continue
        obj[k] = str(f)
    return warn


# ---------- lệnh ----------
async def cmd_geo(a, ctx):
    lat, lon = map(float, a.near.split(","))
    pg = await engine_page(ctx)
    r = await pg.evaluate("([n, p]) => MLV.geo(n, p)", [a.names, {"lat": lat, "lon": lon}])
    out({"ok": True, "geo": r})


def _coords_from_url(u):
    m = re.search(r"!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)", u) or re.search(r"@(-?\d+\.\d+),(-?\d+\.\d+)", u)
    return (float(m.group(1)), float(m.group(2))) if m else None


async def cmd_gmaps(a, ctx):
    pg = await ctx.new_page()
    res = []
    for q in a.items:
        url = q if re.match(r"^https?://", q) else "https://www.google.com/maps/search/" + urllib.parse.quote(q)
        item = {"q": q}
        try:
            await pg.goto(url, wait_until="domcontentloaded", timeout=30000)
            if "consent." in pg.url:  # chọn phương án ít chia sẻ dữ liệu nhất
                for t in ("Reject all", "Từ chối tất cả"):
                    b = pg.get_by_role("button", name=t)
                    if await b.count():
                        await b.first.click()
                        break
            deadline = time.time() + 15
            c = None
            while time.time() < deadline:
                c = _coords_from_url(pg.url)
                if c and ("/place/" in pg.url or "!3d" in pg.url):
                    break
                # danh sách kết quả: mở kết quả đầu
                first = pg.locator('a[href*="/maps/place/"]').first
                if "/search/" in pg.url and await first.count():
                    href = await first.get_attribute("href")
                    c2 = _coords_from_url(href or "")
                    if c2:
                        c = c2
                        item["name"] = (await first.get_attribute("aria-label")) or ""
                        break
                await pg.wait_for_timeout(700)
            if c:
                item.update({"lat": round(c[0], 7), "lon": round(c[1], 7)})
                m = re.search(r"/maps/place/([^/@]+)", pg.url)
                if m and not item.get("name"):
                    item["name"] = urllib.parse.unquote_plus(m.group(1))
            else:
                item["err"] = "không đọc được tọa độ"
        except Exception as e:
            item["err"] = str(e)[:120]
        res.append(item)
    out({"ok": True, "gmaps": res})


GPOI_CATS = [
    ("Y TẾ", "bệnh viện"), ("MUA SẮM", "trung tâm thương mại"), ("MUA SẮM", "siêu thị"),
    ("GIÁO DỤC", "trường đại học"), ("GIÁO DỤC", "trường quốc tế"), ("KẾT NỐI", "ga metro"),
    ("KẾT NỐI", "bến xe"), ("CÔNG VIÊN", "công viên"), ("THỂ THAO", "sân golf"),
    ("HÀNH CHÍNH", "ủy ban nhân dân"), ("KCN", "khu công nghiệp"),
]


def _km(lat1, lon1, lat2, lon2):
    import math
    return math.hypot((lat2 - lat1) * 111.2, (lon2 - lon1) * 111.2 * math.cos(math.radians(lat1)))


async def cmd_gpoi(a, ctx):
    """Tiện ích nổi bật quanh dự án theo Google Maps (tìm theo loại quanh tọa độ, xếp theo số đánh giá)."""
    pg = await ctx.new_page()
    found = {}
    for cat, q in GPOI_CATS:
        try:
            await pg.goto(f"https://www.google.com/maps/search/{urllib.parse.quote(q)}/@{a.lat},{a.lon},14z?hl=vi",
                          wait_until="domcontentloaded", timeout=30000)
            if "consent." in pg.url:  # chọn phương án ít chia sẻ dữ liệu nhất
                for t in ("Reject all", "Từ chối tất cả"):
                    b = pg.get_by_role("button", name=t)
                    if await b.count():
                        await b.first.click(); break
            await pg.wait_for_selector('a[href*="/maps/place/"]', timeout=12000)
            await pg.wait_for_timeout(1200)
            items = await pg.eval_on_selector_all('a[href*="/maps/place/"]', """els => els.map(e => {
                const card = e.closest('[role=article]') || e.parentElement;
                return {name: e.getAttribute('aria-label') || '', href: e.href, text: card ? card.innerText.slice(0, 300) : ''};
            })""")
        except Exception:
            items = []
        for it in items:
            c = _coords_from_url(it["href"])
            if not c or not it["name"] or re.search(r"[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]", it["name"]):
                continue
            km = _km(a.lat, a.lon, c[0], c[1])
            if km > a.km:
                continue
            m = re.search(r"(\d[,.]\d)\s*\(([\d.,]+)\)", it["text"])
            reviews = int(re.sub(r"[.,]", "", m.group(2))) if m else 0
            key = it["name"].lower()
            if key not in found or reviews > found[key]["reviews"]:
                found[key] = {"cat": cat, "name": it["name"], "lat": round(c[0], 7), "lon": round(c[1], 7),
                              "line": round(km, 1), "rating": float(m.group(1).replace(",", ".")) if m else None,
                              "reviews": reviews, "q": q}
        await pg.wait_for_timeout(800)
    res = sorted(found.values(), key=lambda x: -x["reviews"])
    per, outl = {}, []
    for r in res:
        if per.get(r["cat"], 0) < a.per:
            per[r["cat"]] = per.get(r["cat"], 0) + 1; outl.append(r)
    if a.dist and outl:
        outl = await moto_dist(ctx, a.lat, a.lon, outl)
    out({"ok": bool(outl), "pois": outl, **({} if outl else {"err": "Google Maps không trả kết quả"})}, 0 if outl else 2)


async def cmd_poi(a, ctx):
    pg = await engine_page(ctx)
    P = {"lat": a.lat, "lon": a.lon}
    c = await pg.evaluate("([p, o]) => MLV.poi(p, o)", [P, {"km": a.km}])
    if isinstance(c, dict) and c.get("err"):
        out({"ok": False, **c}, 2)
    if a.dist:
        c = await moto_dist(ctx, a.lat, a.lon, c) if a.travel == "moto" else await pg.evaluate("([p, l]) => MLV.dist(p, l)", [P, c])
    out({"ok": True, "src": await pg.evaluate("MLV.st.poiSrc"), "pois": c})


def moto_min(km):
    """Phút đi xe máy, giao thông bình thường: 25 km/h trong 8 km đầu, 30 km/h phần sau (giống engine)."""
    return max(1, km / 25 * 60 if km <= 8 else 19.2 + (km - 8) / 30 * 60)


async def moto_dist(ctx, lat, lon, pois):
    """Tuyến xe máy theo hồ sơ xe đạp OSRM (không cao tốc, được băng qua đường), tuần tự."""
    res = []
    for p in pois:
        q = dict(p)
        u = (f"https://routing.openstreetmap.de/routed-bike/route/v1/driving/{lon},{lat};{p['lon']},{p['lat']}"
             "?overview=false")
        try:
            r = await ctx.request.get(u, timeout=20000)
            km = (await r.json())["routes"][0]["distance"] / 1000
        except Exception:
            import math
            km = math.hypot((p["lat"] - lat) * 111.2, (p["lon"] - lon) * 111.2 * math.cos(math.radians(lat))) * 1.3
            q["est"] = "chim bay x1,3"
        q["km"], q["min"] = round(km, 1), round(moto_min(km))
        res.append(q)
        await asyncio.sleep(0.4)
    return sorted(res, key=lambda x: x["min"])


async def cmd_dist(a, ctx):
    pois = json.loads(Path(a.pois).read_text(encoding="utf-8"))
    if a.travel == "moto":
        return out({"ok": True, "travel": "xe máy", "pois": await moto_dist(ctx, a.lat, a.lon, pois)})
    pg = await engine_page(ctx)
    r = await pg.evaluate("([p, l]) => MLV.dist(p, l)", [{"lat": a.lat, "lon": a.lon}, pois])
    out({"ok": True, "travel": "ô tô", "pois": r})


FONT_FACE = re.compile(r"@font-face\s*{([^}]*)}", re.I | re.S)


ICON_FONTS = re.compile(r"awesome|icon|glyph|dashicons|swiper|slick|eicons|material|inherit|initial|sans-serif|serif|monospace|system-ui|-apple-system|segoe|arial|helvetica|roboto|times", re.I)


def _hue(rgb):
    import colorsys
    h, l, sat = colorsys.rgb_to_hls(*[x / 255 for x in rgb])
    return h * 360, l, sat


async def _brand_static(a, ctx, d):
    """Không mở được trang (quá thời gian): đọc HTML + CSS, lấy màu, font, logo không cần dựng trang."""
    from PIL import Image
    import collections
    r = await ctx.request.get(a.url, headers={"User-Agent": UA}, timeout=30000)
    html = await r.text()
    texts = [html] + re.findall(r"<style[^>]*>(.*?)</style>", html, re.S)
    for h in re.findall(r"""href=["']([^"']+\.css[^"']*)["']""", html)[:15]:
        try:
            rr = await ctx.request.get(urllib.parse.urljoin(a.url, h), timeout=15000)
            rr.ok and texts.append(await rr.text())
        except Exception:
            pass
    css = "\n".join(texts)
    cnt = collections.Counter(c.upper() for c in re.findall(r"#[0-9a-fA-F]{6}\b", css))
    colors = []
    for c, n in cnt.most_common(40):
        rgb = tuple(int(c[i:i + 2], 16) for i in (1, 3, 5))
        h, l, sat = _hue(rgb)
        if c in ("#0000EE", "#0000FF", "#551A8B") or sat < .18 or not (.12 <= l <= .8) or (195 <= h <= 225 and sat > .9):
            continue
        if True:  # bỏ xám, trắng, đen, xanh mặc định của thư viện
            colors.append(c)
    primary = colors[0] if colors else None
    accent = next((c for c in colors[1:] if abs(_hue(tuple(int(c[i:i + 2], 16) for i in (1, 3, 5)))[0] - _hue(tuple(int(primary[i:i + 2], 16) for i in (1, 3, 5)))[0]) > 40), colors[1] if len(colors) > 1 else None) if primary else None
    fams = collections.Counter(f.strip().strip("'\"") for f in re.findall(r"font-family\s*:\s*['\"]?([^;,'\"}]+)", css))
    font = next((f for f, _ in fams.most_common() if not ICON_FONTS.search(f)), "")
    res = {"ok": True, "mode": "static", "site": urllib.parse.urlparse(a.url).hostname, "name": "", "primary": primary,
           "accent": accent, "colors": colors[:6], "font": font, "logoFile": None, "fontFile": None, "logos": []}
    m = re.search(r"<title>(.*?)</title>", html, re.S)
    res["name"] = re.split(r"[|\-–—]", m.group(1))[0].strip() if m else ""
    # logo: mọi ảnh có chữ "logo"; ưu tiên ảnh không trắng, lớn nhất; chỉ có logo trắng → dùng trên nền màu chính
    urls = []
    for u in re.findall(r"""(?:src|data-src|srcset|href)=["']([^"']+)["']""", html):
        whole = re.sub(r"https?://sp-ao\.shortpixel\.ai/client/[^/]*/", "", u)
        for part in re.split(r",\s+", whole):
            v = part.strip().split(" ")[0]
            if re.search(r"logo", v, re.I) and re.search(r"\.(png|jpe?g|webp|svg)(\?|$)", v, re.I):
                v = urllib.parse.urljoin(a.url, v)
                v not in urls and urls.append(v)
    best = None
    for i, u in enumerate(urls[:12]):
        try:
            rr = await ctx.request.get(u, headers={"User-Agent": UA, "Referer": a.url}, timeout=15000)
            if not rr.ok or u.lower().endswith(".svg"):
                continue
            im = Image.open(io.BytesIO(await rr.body())).convert("RGBA")
            w, h = im.size
            if w < 60 or w / h > 8:
                continue
            px = [p for p in im.resize((48, round(48 * h / w) or 1)).getdata() if p[3] > 128]
            vf = sum(1 for p in px if (p[0] + p[1] + p[2]) / 3 < 200) / max(1, len(px))  # phần nhìn rõ trên nền trắng
            light = vf < .85
            f = d / f"logo_{i}.png"; im.save(f)
            res["logos"].append({"file": str(f), "w": w, "h": h, "light": light, "visible": round(vf, 2), "url": u})
            score = w * h * vf ** 3
            if not best or score > best[0]:
                best = (score, f, light)
        except Exception:
            continue
    if best:
        import shutil as _sh
        _sh.copy(best[1], d / "logo.png"); res["logoFile"] = str(d / "logo.png")
        if best[2] and primary:
            res["plate"] = primary  # logo trắng: đặt trên nền màu chính (CFG brand.plate)
    # font: file @font-face của họ font chính, ưu tiên đậm 600–700
    bestf = None
    for blk in FONT_FACE.findall(css):
        fm = re.search(r"font-family\s*:\s*['\"]?([^;'\"]+)", blk, re.I)
        if not fm or fm.group(1).strip().lower() != font.lower():
            continue
        wt = re.search(r"font-weight\s*:\s*(\d+)", blk); wt = int(wt.group(1)) if wt else 400
        if re.search(r"font-style\s*:\s*italic", blk, re.I) or re.search(r"italic", blk, re.I):
            continue
        for u in re.findall(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)", blk):
            if u.startswith("data:"):
                continue
            sc = 100 - abs(650 - wt) / 10 + (20 if ".woff2" in u else 10 if ".woff" in u else 0)
            if not bestf or sc > bestf[0]:
                bestf = (sc, urllib.parse.urljoin(a.url, u))
    if bestf:
        try:
            rr = await ctx.request.get(bestf[1], timeout=30000)
            if rr.ok:
                ext = Path(urllib.parse.urlparse(bestf[1]).path).suffix or ".woff2"
                (d / ("font" + ext)).write_bytes(await rr.body()); res["fontFile"] = str(d / ("font" + ext))
        except Exception:
            pass
    return res


async def cmd_brand(a, ctx):
    """Màu, font từ CSS (đếm tần suất, bỏ màu mặc định thư viện); logo từ ảnh có chữ "logo",
    không có thì mở trang chụp phần tử logo."""
    d = Path(a.out); d.mkdir(parents=True, exist_ok=True)
    try:
        res = await _brand_static(a, ctx, d)
    except Exception as e:
        res = {"ok": False, "err": f"không đọc được web: {str(e)[:120]}", "logos": []}
    if not res.get("logoFile"):
        pg = await ctx.new_page()
        try:
            await pg.goto(a.url, wait_until="domcontentloaded", timeout=40000)
            sel = ('header img,nav img,a[href="/"] img,[class*=logo] img,img[class*=logo],img[alt*=logo i],img[src*=logo i],'
                   'header svg,[class*=logo] svg')
            for el in await pg.query_selector_all(sel):
                bb = await el.bounding_box()
                if not bb or bb["width"] < 40 or bb["height"] < 12 or bb["width"] / bb["height"] > 8:
                    continue
                await el.scroll_into_view_if_needed()
                await el.screenshot(path=str(d / "logo.png"), omit_background=True, scale="device")
                res["logoFile"] = str(d / "logo.png"); res["ok"] = True
                break
        except Exception:
            pass
    out(res, 0 if res.get("ok") else 2)

BAD_IMG = re.compile(r"logo|icon|avatar|sodo|so-do|ban-do|bando|banner|map[-_.]|qr", re.I)


def _ahash(im):
    g = im.convert("L").resize((8, 8))
    px = list(g.getdata()); m = sum(px) / 64
    return sum(1 << i for i, v in enumerate(px) if v > m)


async def _search_bing(ctx, q):
    r = await ctx.request.get("https://www.bing.com/images/search?" + urllib.parse.urlencode(
        {"q": q, "form": "HDRSC2", "first": 1, "qft": "+filterui:imagesize-large", "setlang": "vi"}),
        headers={"User-Agent": UA, "Accept-Language": "vi,en;q=0.8"}, timeout=20000)
    html = (await r.text()) if r.ok else ""
    res = []
    for blob in re.findall(r'class="iusc"[^>]*\sm="([^"]+)"', html):
        try:
            j = json.loads(blob.replace("&quot;", '"').replace("&amp;", "&"))
            res.append({"img": j.get("murl"), "page": j.get("purl"), "title": j.get("t", "")})
        except Exception:
            pass
    return res


async def _search_gmaps(ctx, q):
    """Ảnh của địa điểm trên Google Maps (ảnh đại diện + ảnh trong khung xem ảnh), cỡ lớn."""
    pg = await ctx.new_page()
    res = []
    try:
        await pg.goto("https://www.google.com/maps/search/" + urllib.parse.quote(q) + "?hl=vi", wait_until="domcontentloaded", timeout=30000)
        if "consent." in pg.url:  # chọn phương án ít chia sẻ dữ liệu nhất
            for t in ("Reject all", "Từ chối tất cả"):
                b = pg.get_by_role("button", name=t)
                if await b.count():
                    await b.first.click(); break
        await pg.wait_for_timeout(5000)
        if "/maps/place/" not in pg.url:
            first = pg.locator('a[href*="/maps/place/"]').first
            if await first.count():
                await first.click(); await pg.wait_for_timeout(4500)
        page = pg.url.split("/data=")[0] if "/maps/place/" in pg.url else pg.url
        grab = "els => els.filter(e => (e.naturalWidth||0) >= 120).map(e => e.src).filter(u => /googleusercontent\\.com|ggpht\\.com/.test(u) && !u.includes('/a-/') && !u.includes('/a/'))"
        urls = await pg.eval_on_selector_all("img", grab)
        hero = pg.locator('button[aria-label^="Ảnh của"], button[aria-label^="Photo of"]').first
        if await hero.count():
            try:
                await hero.click(); await pg.wait_for_timeout(4000)
                urls += await pg.eval_on_selector_all("img", grab)
                bg = await pg.eval_on_selector_all("[style*='googleusercontent']", "els => els.map(e => (e.getAttribute('style').match(/url\\([\"']?([^\"')]+)/)||[])[1]).filter(Boolean)")
                urls += [u for u in bg if "/a-/" not in u]
            except Exception:
                pass
        seen = set()
        for u in urls:
            big = re.sub(r"=[swh]\d+[^/?#]*$", "=w1600-h1200-k-no", u.split("?")[0]) if "=" in u else u + "=w1600-h1200-k-no"
            key = big.split("=")[0]
            if key in seen:
                continue
            seen.add(key)
            res.append({"img": big, "page": page, "title": q, "src": "gmaps"})
    except Exception:
        pass
    finally:
        await pg.close()
    return res


async def _search_ddg(ctx, q):
    r = await ctx.request.get("https://duckduckgo.com/?" + urllib.parse.urlencode({"q": q, "iax": "images", "ia": "images"}),
                              headers={"User-Agent": UA}, timeout=20000)
    m = re.search(r"vqd=['\"]?([\d-]+)", await r.text()) if r.ok else None
    if not m:
        return []
    r = await ctx.request.get("https://duckduckgo.com/i.js?" + urllib.parse.urlencode(
        {"l": "vn-vi", "o": "json", "q": q, "vqd": m.group(1), "f": ",,,", "p": "1"}),
        headers={"User-Agent": UA, "Referer": "https://duckduckgo.com/"}, timeout=20000)
    try:
        return [{"img": x.get("image"), "page": x.get("url"), "title": x.get("title", "")} for x in (await r.json()).get("results", [])]
    except Exception:
        return []


async def cmd_images(a, ctx):
    from PIL import Image
    d = Path(a.out); d.mkdir(parents=True, exist_ok=True)
    async def safe(f, q):
        try:
            return await f(ctx, q)
        except Exception:
            return []
    srcs = [("bing", _search_bing, a.query), ("gmaps", _search_gmaps, a.place or a.query), ("ddg", _search_ddg, a.query)]
    if a.place:  # có tên địa điểm Google Maps: ảnh đúng địa điểm trước
        srcs = [srcs[1], srcs[0], srcs[2]]
    used, seen, kept, tried = [], set(), [], 0
    for name, f, q in srcs:
        if len(kept) >= a.n:
            break
        cands = await safe(f, q)
        if not cands:
            continue
        used.append(name); tried = 0
        await _keep_images(ctx, a, d, cands, seen, kept, tried)
    src = "+".join(used)
    for k in kept:
        k.pop("_h", None)
    out({"ok": bool(kept), "query": a.query, "src": src, "images": kept, **({} if kept else {"err": "không tìm được ảnh phù hợp"})}, 0 if kept else 2)


async def _keep_images(ctx, a, d, cands, seen, kept, tried):
    from PIL import Image
    for c in cands:
        if len(kept) >= a.n or tried >= 14:
            break
        u = c.get("img") or ""
        if not u.startswith("http") or BAD_IMG.search(u) or u in seen:
            continue
        seen.add(u); tried += 1
        try:
            r = await ctx.request.get(u, headers={"User-Agent": UA, "Referer": c.get("page") or ""}, timeout=12000)
            if not r.ok:
                continue
            im = Image.open(io.BytesIO(await r.body())); im.load()
            w, h = im.size
            if w < 600 or h < 380 or not ((1.0 if c.get("src") == "gmaps" else 1.05) <= w / h <= 2.3):
                continue
            hsh = _ahash(im)
            if any(bin(hsh ^ k["_h"]).count("1") <= 10 for k in kept):
                continue
            im = im.convert("RGB")
            if w > 1600:
                im = im.resize((1600, round(h * 1600 / w)), Image.LANCZOS)
            label = "AB"[len(kept)] if a.n <= 2 else str(len(kept) + 1)
            f = d / f"{a.prefix}_{label}.jpg"
            im.save(f, "JPEG", quality=88)
            kept.append({"file": str(f), "w": w, "h": h, "img": u, "page": c.get("page"), "title": c.get("title", "")[:80], "_h": hsh})
        except Exception:
            continue


RENDER_BAD = re.compile(r"logo|icon|favicon|doitac|partner|avatar|whatsapp|zalo|messenger|qr|sprite|bg-?(green|yellow)|background-yellow", re.I)


async def cmd_renders(a, ctx):
    """Ảnh phối cảnh lớn trên web dự án (img, srcset, nền CSS) cho cảnh mở đầu / kết thúc."""
    from PIL import Image
    d = Path(a.out); d.mkdir(parents=True, exist_ok=True)
    r = await ctx.request.get(a.url, headers={"User-Agent": UA}, timeout=30000)
    html = await r.text()
    texts = [html]
    for h in re.findall(r"""href=["']([^"']+\.css[^"']*)["']""", html)[:15]:
        try:
            rr = await ctx.request.get(urllib.parse.urljoin(a.url, h), timeout=15000)
            rr.ok and texts.append(await rr.text())
        except Exception:
            pass
    cands = []
    for t in texts:
        for u in re.findall(r"""(?:src|data-src|data-lazy-src|href|srcset|data-bg)=["']([^"']+)["']|url\(\s*["']?([^"')]+)""", t):
            whole = re.sub(r"https?://sp-ao\.shortpixel\.ai/client/[^/]*/", "", u[0] or u[1])  # bỏ lớp CDN ShortPixel
            for part in re.split(r",\s+", whole):
                v = part.strip().split(" ")[0]
                if not re.search(r"\.(jpe?g|png|webp)(\?|$)", v, re.I) or RENDER_BAD.search(v):
                    continue
                v = re.sub(r"-\d{2,4}x\d{2,4}(\.\w+)$", r"\1", v)  # bỏ hậu tố ảnh thu nhỏ WordPress
                v = urllib.parse.urljoin(a.url, v)
                v not in cands and cands.append(v)
    kept = []
    for u in cands:
        if len(kept) >= a.n:
            break
        try:
            rr = await ctx.request.get(u, headers={"User-Agent": UA, "Referer": a.url}, timeout=30000)
            if not rr.ok:
                continue
            im = Image.open(io.BytesIO(await rr.body())); im.load()
            w, h = im.size
            if w < 1100 or not (1.15 <= w / h <= 2.4):
                continue
            px = im.convert("L").resize((32, 32))
            lo, hi = px.getextrema()
            if hi - lo < 90:  # nền trơn, họa tiết
                continue
            hsh = _ahash(im)
            if any(bin(hsh ^ k["_h"]).count("1") <= 10 for k in kept):
                continue
            im = im.convert("RGB")
            if w > 2400:
                im = im.resize((2400, round(h * 2400 / w)), Image.LANCZOS)
            f = d / f"h{len(kept) + 1}.jpg"
            im.save(f, "JPEG", quality=90)
            kept.append({"file": str(f), "w": w, "h": h, "img": u, "_h": hsh})
        except Exception:
            continue
    for k in kept:
        k.pop("_h", None)
    out({"ok": bool(kept), "renders": kept, **({} if kept else {"err": "không thấy ảnh phối cảnh lớn"})}, 0 if kept else 2)


async def cmd_run(a, ctx):
    d = Path(a.out); d.mkdir(parents=True, exist_ok=True)
    cfg_path = Path(a.cfg)
    raw = json.loads(cfg_path.read_text(encoding="utf-8"))
    for kv in a.set or []:  # --set bright=0.5 --set roads=false
        k, _, v = kv.partition("=")
        try:
            raw[k] = json.loads(v)
        except ValueError:
            raw[k] = v
    fetch_warn = await fetch_remote(raw, ctx, d / "_cache")
    cfg, files = localize(raw, cfg_path.parent)
    if not a.video:
        cfg["noVideo"] = True
        cfg["music"] = cfg.get("music") if isinstance(cfg.get("music"), str) else "none"
    pg = await engine_page(ctx, files)
    t0 = time.time()
    started = await pg.evaluate("c => MLV.run(c)", cfg)
    s = {}
    while time.time() - t0 < 1500:
        s = await pg.evaluate("MLV.wait(20)")
        if s.get("done") or s.get("err"):
            break
    s["wallSec"] = round(time.time() - t0)
    res = {"ok": bool(s.get("done")), "run": started, "summary": s, "frames": [], "videos": []}
    if fetch_warn:
        res["fetchWarn"] = fetch_warn
    if s.get("done") and a.frames:
        if a.frames == "auto":  # 1 khung mở, 1 khung/tiện ích (lúc ảnh + tuyến đã hiện), 1 khung kết
            i0 = float(cfg.get("introDur") or (3.5 if cfg.get("brandMode") == "none" else 4))
            pd = float(started.get("poiDur") or cfg.get("poiDur") or 6)
            T = float(started.get("T") or 0)
            ts = ([0.0] if cfg.get("hero") or cfg.get("hook") else []) + [round(i0 * .75, 1)] + [round(i0 + pd * k + pd - .7, 1) for k in range(len(cfg.get("pois", [])))] + ([round(T - 1.2, 1)] if T else [])
        else:
            ts = [float(x) for x in a.frames.split(",") if x.strip()]
        res["times"] = ts
        for fmt in cfg.get("formats", ["9:16"]):
            for t in ts:
                data = await pg.evaluate(
                    "async ([f, t]) => { const r = MLV.R[f]; await r.prepare(t); r.render(t); return r.canvas.toDataURL('image/jpeg', .88) }",
                    [fmt, t])
                f = d / f"frame_{fmt.replace(':', 'x')}_{t:g}.jpg"
                f.write_bytes(base64.b64decode(data.split(",", 1)[1]))
                res["frames"].append(str(f))
    if s.get("done") and a.video:
        n = await pg.evaluate("MLV.results.length")
        for i in range(n):
            meta = await pg.evaluate(f"({{file: MLV.results[{i}].file, size: MLV.results[{i}].blob.size}})")
            f = d / meta["file"]
            with open(f, "wb") as fh:
                step = 6 << 20
                for off in range(0, meta["size"], step):
                    b64 = await pg.evaluate(
                        "async ([i, o, n]) => { const b = new Uint8Array(await MLV.results[i].blob.slice(o, o + n).arrayBuffer()); let s = ''; for (let k = 0; k < b.length; k += 32768) s += String.fromCharCode(...b.subarray(k, k + 32768)); return btoa(s) }",
                        [i, off, step])
                    fh.write(base64.b64decode(b64))
            if shutil.which("ffmpeg"):  # tiếng opus → AAC cho mọi trình phát / mạng xã hội; hình giữ nguyên
                tmp = f.with_suffix(".aac.mp4")
                r = subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(f), "-c:v", "copy", "-c:a", "aac", "-b:a", "160k",
                                    "-movflags", "+faststart", str(tmp)], capture_output=True)
                if r.returncode == 0 and tmp.exists() and tmp.stat().st_size > 1000:
                    tmp.replace(f)
                else:
                    tmp.unlink(missing_ok=True)
            res["videos"].append(str(f))
    out(res, 0 if res["ok"] else 2)


def cmd_compose(a):
    from PIL import Image, ImageDraw, ImageFont
    H = a.h
    font = None
    for fp in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "C:/Windows/Fonts/arialbd.ttf"):
        if os.path.exists(fp):
            font = ImageFont.truetype(fp, max(16, H // 18)); break
    tiles = []
    for it in a.items:
        p, _, lab = it.partition("|")
        if p.lower() == "none" or not os.path.exists(p):
            im = Image.new("RGB", (int(H * 1.33), H), (60, 60, 60))
        else:
            im = Image.open(p).convert("RGB")
            im = im.resize((round(im.width * H / im.height), H), Image.LANCZOS)
        if lab:
            dr = ImageDraw.Draw(im)
            tw = dr.textlength(lab, font=font) if font else len(lab) * 8
            dr.rectangle([0, 0, tw + 24, (H // 18) + 18], fill=(0, 0, 0))
            dr.text((12, 8), lab, fill=(255, 255, 255), font=font)
        tiles.append(im)
    cols = a.cols or len(tiles)
    rows = [tiles[i:i + cols] for i in range(0, len(tiles), cols)]
    W = max(sum(t.width for t in r) + 12 * (len(r) - 1) for r in rows)
    sheet = Image.new("RGB", (W, H * len(rows) + 12 * (len(rows) - 1)), (255, 255, 255))
    for j, r in enumerate(rows):
        x = 0
        for t in r:
            sheet.paste(t, (x, j * (H + 12))); x += t.width + 12
    if sheet.width > 2400:
        sheet = sheet.resize((2400, round(sheet.height * 2400 / sheet.width)), Image.LANCZOS)
    sheet.save(a.out, "JPEG", quality=85)
    out({"ok": True, "file": a.out, "size": sheet.size})


def main():
    ap = argparse.ArgumentParser()
    sp = ap.add_subparsers(dest="cmd", required=True)
    g = sp.add_parser("geo"); g.add_argument("names", nargs="+"); g.add_argument("--near", required=True)
    g = sp.add_parser("gmaps"); g.add_argument("items", nargs="+")
    g = sp.add_parser("poi"); g.add_argument("lat", type=float); g.add_argument("lon", type=float)
    g.add_argument("--km", type=float, default=3); g.add_argument("--dist", action="store_true")
    g.add_argument("--travel", default="moto", choices=["moto", "car"])
    g = sp.add_parser("gpoi"); g.add_argument("lat", type=float); g.add_argument("lon", type=float)
    g.add_argument("--km", type=float, default=8); g.add_argument("--per", type=int, default=3); g.add_argument("--dist", action="store_true")
    g = sp.add_parser("dist"); g.add_argument("lat", type=float); g.add_argument("lon", type=float); g.add_argument("--pois", required=True)
    g.add_argument("--travel", default="moto", choices=["moto", "car"])
    g = sp.add_parser("brand"); g.add_argument("url"); g.add_argument("--out", required=True)
    g = sp.add_parser("images"); g.add_argument("query"); g.add_argument("--out", required=True)
    g.add_argument("--prefix", required=True); g.add_argument("--n", type=int, default=2)
    g.add_argument("--place", default="", help="tên địa điểm trên Google Maps: lấy ảnh của địa điểm trước")
    g = sp.add_parser("renders"); g.add_argument("url"); g.add_argument("--out", required=True); g.add_argument("--n", type=int, default=6)
    g = sp.add_parser("run"); g.add_argument("cfg"); g.add_argument("--out", required=True)
    g.add_argument("--frames", default=""); g.add_argument("--video", action="store_true")
    g.add_argument("--set", action="append", help="ghi đè CFG, vd --set bright=0.5 --set roads=false")
    g = sp.add_parser("compose"); g.add_argument("out"); g.add_argument("items", nargs="+"); g.add_argument("--h", type=int, default=480)
    g.add_argument("--cols", type=int, default=0, help="số ảnh mỗi hàng (mặc định 1 hàng)")
    a = ap.parse_args()
    if a.cmd == "compose":
        return cmd_compose(a)

    async def go():
        from playwright.async_api import async_playwright
        async with async_playwright() as p:
            b, ctx = await open_browser(p)
            try:
                await {"geo": cmd_geo, "gmaps": cmd_gmaps, "gpoi": cmd_gpoi, "poi": cmd_poi, "dist": cmd_dist, "brand": cmd_brand,
                       "images": cmd_images, "renders": cmd_renders, "run": cmd_run}[a.cmd](a, ctx)
            finally:
                await b.close()
    try:
        asyncio.run(go())
    except SystemExit:
        raise
    except Exception as e:
        out({"ok": False, "err": f"{type(e).__name__}: {str(e)[:300]}"}, 2)


if __name__ == "__main__":
    main()
