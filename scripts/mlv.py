#!/usr/bin/env python3
"""map-location-video v3.1 — chạy trên máy chủ của Claude (Python + Playwright + Chrome).

Lệnh (mọi lệnh in 1 dòng JSON ra stdout):
  geo    "tên 1" ["tên 2"...] --near LAT,LON        tọa độ qua Photon → Nominatim (MLV.geo)
  gmaps  "<link Google Maps | tên địa điểm>"...     tọa độ đọc từ Google Maps
  poi    LAT LON [--km 3] [--dist]                   ứng viên tiện ích (MLV.poi) [+ km/phút]
  dist   LAT LON --pois pois.json                    km/phút đường lái xe (OSRM Table)
  brand  <url web dự án> --out DIR                   màu, font (tải file), logo (logo.png)
  images "<từ khóa>" --out DIR --prefix p1 [--n 2]   tìm + tải ảnh web, giữ n ảnh tốt nhất
  run    cfg.json --out DIR [--frames auto|"4.5,10.6"] [--video] [--set k=v ...]
                                                     dựng: khung hình mẫu (JPEG) và/hoặc MP4 (tiếng AAC)
                                                     --frames auto: khung mở + 1 khung/tiện ích + khung kết
                                                     --set bright=0.5: ghi đè CFG không sửa file
  compose out.jpg "a.jpg|Nhãn A" "b.jpg|Nhãn B"... [--h 480] [--cols 4]   ghép ảnh có nhãn (lưới)

File cục bộ trong cfg.json (pois[].photo, markerUrl, brand.logo, brand.fontUrl, voice.url,
voice.wordsUrl, music.url) được phục vụ cùng nguồn với trang engine, không cần đưa lên CDN;
ảnh/logo/font là URL web được tải trước về <out>/_cache.
Có voice.wordsUrl cục bộ (words.json của tts.py) → tự điền poiDur, introDur, outroDur còn thiếu trong cfg.
"""
import argparse, asyncio, base64, hashlib, io, json, mimetypes, os, re, shutil, subprocess, sys, time, urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENGINE_FILE = ROOT / "mlv-engine-3.1.0.js"
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
    return cfg, files


async def fetch_remote(cfg, ctx, cache):
    """Tải trước ảnh tiện ích, logo, font, ảnh ghim là URL web về cache (tránh lỗi CORS); lỗi thì giữ URL."""
    slots = [(poi, "photo") for poi in cfg.get("pois", [])]
    if isinstance(cfg.get("brand"), dict):
        slots += [(cfg["brand"], "logo"), (cfg["brand"], "fontUrl")]
    slots.append((cfg, "markerUrl"))
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


async def cmd_poi(a, ctx):
    pg = await engine_page(ctx)
    P = {"lat": a.lat, "lon": a.lon}
    c = await pg.evaluate("([p, o]) => MLV.poi(p, o)", [P, {"km": a.km}])
    if isinstance(c, dict) and c.get("err"):
        out({"ok": False, **c}, 2)
    if a.dist:
        c = await pg.evaluate("([p, l]) => MLV.dist(p, l)", [P, c])
    out({"ok": True, "src": await pg.evaluate("MLV.st.poiSrc"), "pois": c})


async def cmd_dist(a, ctx):
    pg = await engine_page(ctx)
    pois = json.loads(Path(a.pois).read_text(encoding="utf-8"))
    r = await pg.evaluate("([p, l]) => MLV.dist(p, l)", [{"lat": a.lat, "lon": a.lon}, pois])
    out({"ok": True, "pois": r})


FONT_FACE = re.compile(r"@font-face\s*{([^}]*)}", re.I | re.S)


async def cmd_brand(a, ctx):
    d = Path(a.out); d.mkdir(parents=True, exist_ok=True)
    pg = await ctx.new_page()
    await pg.goto(a.url, wait_until="domcontentloaded", timeout=45000)
    try:
        await pg.wait_for_load_state("networkidle", timeout=15000)
    except Exception:
        pass
    js = BRAND_JS.read_text(encoding="utf-8")
    info = json.loads(await pg.evaluate(js))
    res = {"ok": True, **info, "logoFile": None, "fontFile": None}
    # logo: chụp đúng phần tử logo, nền trong suốt
    sel = ('header img,nav img,a[href="/"] img,[class*=logo] img,img[class*=logo],img[alt*=logo i],img[src*=logo i],'
           'header svg,[class*=logo] svg')
    for el in await pg.query_selector_all(sel):
        try:
            bb = await el.bounding_box()
            if not bb or bb["width"] < 40 or bb["height"] < 12 or bb["width"] / bb["height"] > 8:
                continue
            await el.scroll_into_view_if_needed()
            await el.screenshot(path=str(d / "logo.png"), omit_background=True, scale="device")
            res["logoFile"] = str(d / "logo.png")
            break
        except Exception:
            continue
    # font: tìm @font-face cùng tên trong CSS của trang, tải file (ưu tiên woff2, đậm)
    fam = (info.get("font") or "").lower()
    if fam:
        sheets = await pg.evaluate("[...document.styleSheets].map(s => s.href).filter(Boolean)")
        inline = await pg.evaluate("[...document.querySelectorAll('style')].map(s => s.textContent).join('\\n')")
        texts = [(pg.url, inline)]
        for h in sheets[:15]:
            try:
                r = await ctx.request.get(h, timeout=15000)
                if r.ok:
                    texts.append((h, await r.text()))
            except Exception:
                pass
        best = None
        for base, css in texts:
            for blk in FONT_FACE.findall(css):
                fm = re.search(r"font-family\s*:\s*['\"]?([^;'\"]+)", blk, re.I)
                if not fm or fm.group(1).strip().lower() != fam:
                    continue
                w = re.search(r"font-weight\s*:\s*(\d+)", blk)
                w = int(w.group(1)) if w else 400
                for u in re.findall(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)", blk):
                    if u.startswith("data:"):
                        continue
                    sc = (100 - abs(700 - w) / 10) + (20 if ".woff2" in u else 10 if ".woff" in u else 0)
                    if not best or sc > best[0]:
                        best = (sc, urllib.parse.urljoin(base, u))
        if best:
            try:
                r = await ctx.request.get(best[1], timeout=20000)
                if r.ok:
                    ext = Path(urllib.parse.urlparse(best[1]).path).suffix or ".woff2"
                    (d / ("font" + ext)).write_bytes(await r.body())
                    res["fontFile"] = str(d / ("font" + ext))
            except Exception:
                pass
    out(res)


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
    cands = await _search_bing(ctx, a.query)
    src = "bing"
    if len(cands) < 4:
        cands += await _search_ddg(ctx, a.query); src = "bing+ddg"
    seen, kept, tried = set(), [], 0
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
            if w < 600 or h < 380 or not (1.05 <= w / h <= 2.3):
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
    for k in kept:
        k.pop("_h", None)
    out({"ok": bool(kept), "query": a.query, "src": src, "images": kept, **({} if kept else {"err": "không tìm được ảnh phù hợp"})}, 0 if kept else 2)


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
            ts = [round(i0 * .75, 1)] + [round(i0 + pd * k + pd - .7, 1) for k in range(len(cfg.get("pois", [])))] + ([round(T - 1.2, 1)] if T else [])
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
    g = sp.add_parser("dist"); g.add_argument("lat", type=float); g.add_argument("lon", type=float); g.add_argument("--pois", required=True)
    g = sp.add_parser("brand"); g.add_argument("url"); g.add_argument("--out", required=True)
    g = sp.add_parser("images"); g.add_argument("query"); g.add_argument("--out", required=True)
    g.add_argument("--prefix", required=True); g.add_argument("--n", type=int, default=2)
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
                await {"geo": cmd_geo, "gmaps": cmd_gmaps, "poi": cmd_poi, "dist": cmd_dist, "brand": cmd_brand,
                       "images": cmd_images, "run": cmd_run}[a.cmd](a, ctx)
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
