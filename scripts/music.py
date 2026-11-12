#!/usr/bin/env python3
"""Nhạc nền truyền cảm hứng từ kho nhạc miễn phí + lưới phách để cắt cảnh đúng nhịp.

Nguồn: Mixkit (Mixkit Free License: dùng thương mại, quảng cáo online, không cần ghi nguồn; không bán lại file nhạc rời).

  music.py find  [--mood motivational,uplifting,hopeful,corporate] [--n 6]
        → tải thử ≤ 12 bài hợp tâm trạng, đo BPM / độ rõ phách / năng lượng, in JSON xếp hạng
  music.py prep <id Mixkit | URL mp3 | file> [--out music.mp3] [--skip 0]
        → cắt nhạc để phách mạnh đầu tiên rơi đúng 0 s, ghi music.mp3 + beats.json
           {bpm, beat, bar, offset, src:{title, author, url, page, license}}
tts.py đọc beats.json (cùng thư mục) để làm tròn độ dài cảnh theo ô nhịp; CFG: "music":{"url":"music.mp3"}.
"""
import argparse, html, json, os, re, ssl, subprocess, sys, tempfile, urllib.request
from pathlib import Path

PAGES = {
    "motivational": "https://mixkit.co/free-stock-music/tag/motivational/",
    "uplifting": "https://mixkit.co/free-stock-music/mood/uplifting/",
    "hopeful": "https://mixkit.co/free-stock-music/mood/hopeful/",
    "positive": "https://mixkit.co/free-stock-music/mood/positive/",
    "corporate": "https://mixkit.co/free-stock-music/tag/corporate/",
}
GOOD = {"motivational": 3, "uplifting": 3, "inspiring": 3, "inspirational": 3, "hopeful": 2, "corporate": 2, "corporate-music": 2,
        "optimistic": 2, "success": 2, "confident": 1, "positive": 1, "driving": 1, "propulsive": 1, "energetic": 1, "bright": 1,
        "epic": 1, "upbeat": 1, "business": 1}
BAD = {"sad", "dark", "horror", "scary", "romantic", "relaxation", "slow", "meditative", "christmas", "holiday",
       "spooky", "melancholic", "suspense", "tense", "lo-fi", "lofi", "children", "funny", "comedy", "wedding"}
LICENSE = "Mixkit Free License (thương mại, quảng cáo online, không cần ghi nguồn)"
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36"}


def ctx():
    ca = os.environ.get("SSL_CERT_FILE") or ("/root/.ccr/ca-bundle.crt" if os.path.exists("/root/.ccr/ca-bundle.crt") else None)
    return ssl.create_default_context(cafile=ca) if ca else ssl.create_default_context()


def get(url, binary=False, timeout=30):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), context=ctx(), timeout=timeout) as r:
        b = r.read()
    return b if binary else b.decode("utf-8", "replace")


def parse(page_html, page_url):
    out = []
    for m in re.finditer(r'data-audio-player-preview-url-value="([^"]+\.mp3)"[^>]*?data-audio-player-item-id-value="(\d+)"', page_html, re.S):
        seg = page_html[m.end():m.end() + 4000]
        t = re.search(r'item-grid-card__title[^>]*>\s*([^<]+?)\s*<', seg)
        a = re.search(r'item-grid-music-preview__author[^>]*>\s*by\s+([^<]+?)\s*<', seg)
        d = re.search(r'data-test-id="duration">\s*(\d+):(\d\d)', seg)
        tags = [x.lower() for x in re.findall(r'meta-links__link"[^>]*href="/free-stock-music/(?:mood|tag|instrument)?/?([^/"]+)/"', seg[:2500])]
        if not t or not d:
            continue
        out.append({"id": m.group(2), "title": html.unescape(t.group(1)), "author": html.unescape(a.group(1)) if a else "",
                    "sec": int(d.group(1)) * 60 + int(d.group(2)), "tags": tags, "url": m.group(1), "page": page_url})
    return out


def analyze(path):
    """BPM + lưới phách khớp toàn bài (librosa ước lượng thô, rồi dò BPM ±4 % bước 0,01 và pha bước 4 ms cho tổng
    độ mạnh onset tại các phách lớn nhất — tránh trôi phách); phách mạnh đầu ô nhịp = pha có onset mạnh nhất ở bước 4 phách."""
    import numpy as np, librosa
    hop = 128
    y, sr = librosa.load(path, sr=22050, mono=True, duration=75)
    o = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
    fr = sr / hop
    T = len(o) / fr
    tempo, beats = librosa.beat.beat_track(onset_envelope=o, sr=sr, hop_length=hop, units="time")
    b0 = float(np.atleast_1d(tempo)[0])
    while b0 < 85:
        b0 *= 2
    while b0 > 170:
        b0 /= 2
    best = (-1, b0, 0.0)
    for bpm in np.arange(b0 * .96, b0 * 1.04, 0.01):
        bt = 60 / bpm
        ph = np.arange(0, bt, 0.004)
        g = ph[:, None] + np.arange(0, T - bt, bt)[None, :]
        sc = o[np.clip(np.round(g * fr).astype(int), 0, len(o) - 1)].mean(1)
        k = int(np.argmax(sc))
        if sc[k] > best[0]:
            best = (float(sc[k]), float(bpm), float(ph[k]))
    sc_, bpm, ph = best
    bt = 60 / bpm
    grid = np.arange(ph, T, bt)
    gi = np.clip(np.round(grid * fr).astype(int), 0, len(o) - 1)
    fit = float(sc_ / (o.mean() + 1e-6))  # > 1,5: phách rõ, đều
    rms = librosa.feature.rms(y=y, hop_length=hop)[0]
    lead = float(np.argmax(rms > 0.25 * rms.max()) / fr)
    bars = [float(o[gi[k::4]].mean()) for k in range(4)]
    k0 = int(np.argmax(bars))
    down = float(grid[k0])
    while down + 4 * bt < lead:  # bỏ đoạn lặng đầu bài, giữ đúng pha ô nhịp
        down += 4 * bt
    energy = float(np.mean(rms[: len(rms) // 2]) / (rms.max() + 1e-6))
    return {"bpm": round(bpm, 2), "steady": round(min(1.0, fit / 2), 2), "strength": round(fit, 2), "lead": round(lead, 2),
            "downbeat": round(down, 3), "energy": round(energy, 2)}


def cmd_find(a):
    moods = [m.strip() for m in a.mood.split(",") if m.strip()]
    seen, items = set(), []
    for m in moods:
        url = PAGES.get(m) or f"https://mixkit.co/free-stock-music/tag/{m}/"
        try:
            for it in parse(get(url), url):
                if it["id"] not in seen:
                    seen.add(it["id"]); items.append(it)
        except Exception as e:
            print(json.dumps({"warn": f"{url}: {e}"}, ensure_ascii=False), file=sys.stderr)
    for it in items:
        tg = set(it["tags"])
        it["fit"] = sum(GOOD.get(t, 0) for t in tg) - 3 * len(tg & BAD) + (1 if 70 <= it["sec"] <= 240 else -2)
    items = [i for i in items if i["fit"] > 0 and i["sec"] >= 60]
    items.sort(key=lambda i: -i["fit"])
    tmp = Path(tempfile.mkdtemp(prefix="mlv_music_"))
    res = []
    for it in items[:12]:
        f = tmp / f"{it['id']}.mp3"
        try:
            f.write_bytes(get(it["url"], binary=True, timeout=60))
            it.update(analyze(str(f)))
        except Exception as e:
            it["err"] = str(e)[:120]; continue
        # điểm: hợp tâm trạng + phách đều, rõ + nhịp 95–135 + vào nhạc nhanh
        it["score"] = round(2 * it["fit"] + 3 * it["steady"] + min(3, it["strength"] / 2) + (2 if 95 <= it["bpm"] <= 135 else 0) - min(2, it["lead"]) + it["energy"], 2)
        res.append(it)
    res.sort(key=lambda i: -i["score"])
    print(json.dumps({"ok": bool(res), "license": LICENSE, "tracks": [{k: v for k, v in r.items() if k in
          ("id", "title", "author", "sec", "bpm", "steady", "strength", "lead", "energy", "score", "tags", "url")} for r in res[:a.n]]}, ensure_ascii=False))


def cmd_prep(a):
    src = a.src
    meta = {"license": LICENSE}
    if re.fullmatch(r"\d+", src):
        meta.update(url=f"https://assets.mixkit.co/music/{src}/{src}.mp3", page=f"https://mixkit.co/free-stock-music/ (id {src})")
        src = meta["url"]
    if src.startswith("http"):
        tmp = Path(tempfile.mkdtemp(prefix="mlv_music_")) / "in.mp3"
        tmp.write_bytes(get(src, binary=True, timeout=90))
        meta.setdefault("url", src)
        local = str(tmp)
    else:
        local = src
        meta = {"file": src, "license": "người dùng xác nhận có quyền sử dụng"}
    for k in ("title", "author"):
        if getattr(a, k):
            meta[k] = getattr(a, k)
    an = analyze(local)
    beat = 60.0 / an["bpm"]
    start = max(0.0, an["downbeat"] + a.skip * 4 * beat)
    out = Path(a.out)
    r = subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{start:.3f}", "-i", local, "-ac", "2", "-ar", "48000",
                        "-af", "afade=t=in:d=0.03", "-b:a", "192k", str(out)], capture_output=True, text=True)
    if r.returncode:
        print(json.dumps({"ok": False, "err": r.stderr[-300:]}, ensure_ascii=False)); sys.exit(2)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(out)],
                               capture_output=True, text=True).stdout.strip() or 0)
    bj = {"bpm": an["bpm"], "beat": round(beat, 4), "bar": round(4 * beat, 4), "offset": 0.0, "dur": round(dur, 2),
          "trimmed": round(start, 3), "src": meta}
    out.with_name("beats.json").write_text(json.dumps(bj, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps({"ok": True, "music": str(out), "beats": str(out.with_name("beats.json")), **{k: bj[k] for k in ("bpm", "beat", "bar", "dur", "trimmed")}}, ensure_ascii=False))


def main():
    p = argparse.ArgumentParser()
    sp = p.add_subparsers(dest="cmd", required=True)
    f = sp.add_parser("find"); f.add_argument("--mood", default="motivational,uplifting,hopeful,corporate"); f.add_argument("--n", type=int, default=6)
    q = sp.add_parser("prep"); q.add_argument("src"); q.add_argument("--out", default="music.mp3"); q.add_argument("--skip", type=int, default=0)
    q.add_argument("--title", default=""); q.add_argument("--author", default="")
    a = p.parse_args()
    {"find": cmd_find, "prep": cmd_prep}[a.cmd](a)


if __name__ == "__main__":
    main()
