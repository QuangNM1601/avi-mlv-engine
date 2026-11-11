#!/usr/bin/env python3
"""Giọng đọc cho video map-location-video v3 (chạy trên máy người dùng).

Dùng:  python tts.py <thư mục dự án>
Đọc   <thư mục>/script.json
Ghi   <thư mục>/voice.mp3  (đã xếp đúng mốc cảnh, 48 kHz stereo)
      <thư mục>/words.json (T, poiDur, caps: [{t0, t1, text}])
In ra 1 dòng JSON: {"ok", "poiDur", "T", "voice", "words", "warn"} — truyền poiDur vào CFG.

script.json:
{
  "voice": "vi-VN-NamMinhNeural",   # hoặc vi-VN-HoaiMyNeural
  "rate": "+0%",
  "brand": true,                    # false khi brandMode 'none'
  "intro": "câu mở",
  "pois": ["1 câu / tiện ích", "..."],   # đúng thứ tự pois trong CFG
  "outro": "câu chốt"
}

Cần: Python 3.9+, gói edge-tts (pip install edge-tts), ffmpeg + ffprobe trong PATH, mạng internet.
"""
import asyncio, json, re, subprocess, sys, tempfile
from pathlib import Path

POI_MIN, POI_MAX = 5.5, 9.0
LEAD_POI = 0.6      # giây sau đầu cảnh tiện ích thì bắt đầu đọc
TAIL_POI = 0.3      # khoảng trống trước cảnh kế tiếp
LEAD_INTRO, LEAD_OUT, TAIL_END = 0.3, 0.5, 0.3
CAP_WORDS = 7


def die(msg, **extra):
    print(json.dumps({"ok": False, "err": msg, **extra}, ensure_ascii=False))
    sys.exit(2)


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode:
        die("Lệnh lỗi: " + " ".join(cmd[:3]) + " … " + r.stderr.strip()[-300:])
    return r.stdout


def duration(path):
    return float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)]).strip())


async def synth(text, voice, rate, out):
    import edge_tts
    try:
        comm = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary")
    except TypeError:  # edge-tts < 7 không có tham số boundary (mặc định WordBoundary)
        comm = edge_tts.Communicate(text, voice, rate=rate)
    words = []
    with open(out, "wb") as f:
        async for ch in comm.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                words.append((ch["offset"] / 1e7, (ch["offset"] + ch["duration"]) / 1e7, ch["text"]))
    return words


def chunks(text, words, start, dur):
    """Cắt câu thành đoạn ≤ CAP_WORDS từ, ưu tiên ngắt ở dấu câu; trả [{t0,t1,text}] theo giờ video."""
    toks = text.split()
    if words and len(words) == len(toks):  # khớp từng từ: giữ chữ gốc có dấu câu
        units = [(a, b, t) for (a, b, _), t in zip(words, toks)]
    elif words and len(words) >= max(1, len(toks) // 2):
        units = list(words)
    else:  # không có mốc từ: chia đều theo số từ
        n = max(1, len(toks)); step = dur / n
        units = [(i * step, (i + 1) * step, w) for i, w in enumerate(toks)]
    out, cur = [], []
    for u in units:
        cur.append(u)
        if len(cur) >= CAP_WORDS or re.search(r"[,.;:!?…]$", u[2]):
            out.append(cur); cur = []
    if cur:
        out.append(cur)
    merged = []  # gộp đoạn 1–2 từ vào đoạn liền kề để phụ đề không nhảy quá nhanh
    for g in out:
        if merged and (len(g) <= 2 or len(merged[-1]) <= 2) and len(merged[-1]) + len(g) <= CAP_WORDS + 2:
            merged[-1] = merged[-1] + g
        else:
            merged.append(g)
    out = merged
    caps = []
    for g in out:
        t0 = start + g[0][0]; t1 = start + g[-1][1] + 0.25
        txt = " ".join(w for _, _, w in g)
        caps.append({"t0": round(t0, 2), "t1": round(t1, 2), "text": txt})
    for a, b in zip(caps, caps[1:]):
        a["t1"] = min(a["t1"], b["t0"])
    return caps


async def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    if len(sys.argv) < 2:
        die("Dùng: python tts.py <thư mục dự án>")
    d = Path(sys.argv[1]).expanduser().resolve()
    sp = d / "script.json"
    if not sp.exists():
        die(f"Không thấy {sp}")
    s = json.loads(sp.read_text(encoding="utf-8"))
    voice, rate = s.get("voice", "vi-VN-NamMinhNeural"), s.get("rate", "+0%")
    brand = s.get("brand", True)
    pois = [p.strip() for p in s.get("pois", []) if p and p.strip()]
    if not (1 <= len(pois) <= 6):
        die("script.json cần 1–6 câu tiện ích")
    intro_len, outro_len = (4.0, 5.0) if brand else (3.5, 3.5)
    try:
        import edge_tts  # noqa: F401
    except ImportError:
        die("Thiếu gói edge-tts: pip install edge-tts")

    tmp = Path(tempfile.mkdtemp(prefix="mlv_tts_"))
    lines = [("intro", s.get("intro", ""))] + [(f"poi{i+1}", t) for i, t in enumerate(pois)] + [("outro", s.get("outro", ""))]
    res = {}
    for key, text in lines:
        if not text.strip():
            continue
        f = tmp / f"{key}.mp3"
        words, err = [], ""
        for attempt in range(4):
            try:
                words = await synth(text.strip(), voice, rate, f)
                if f.stat().st_size > 1000:
                    break
            except Exception as e:  # mạng chập chờn: thử lại
                err = str(e)
            await asyncio.sleep(1.5 * (attempt + 1))
        else:
            die(f"Không tạo được giọng cho '{key}'", detail=err)
        res[key] = {"file": f, "dur": duration(f), "words": words, "text": text.strip()}

    warn, too_long = [], []
    poi_need = max([res[k]["dur"] + LEAD_POI + TAIL_POI for k in res if k.startswith("poi")] + [POI_MIN])
    if poi_need > POI_MAX:
        too_long += [f"{k}: {res[k]['dur']:.1f}s (tối đa {POI_MAX - LEAD_POI - TAIL_POI:.1f}s)" for k in res
                     if k.startswith("poi") and res[k]["dur"] + LEAD_POI + TAIL_POI > POI_MAX]
    poi_dur = round(min(POI_MAX, max(POI_MIN, poi_need)) + 0.049, 1)
    if "intro" in res and LEAD_INTRO + res["intro"]["dur"] > intro_len + 0.5:
        too_long.append(f"intro: {res['intro']['dur']:.1f}s (tối đa {intro_len + 0.2:.1f}s)")
    if "outro" in res and LEAD_OUT + res["outro"]["dur"] > outro_len - TAIL_END:
        too_long.append(f"outro: {res['outro']['dur']:.1f}s (tối đa {outro_len - LEAD_OUT - TAIL_END:.1f}s)")
    if too_long:
        die("Câu quá dài, rút gọn rồi chạy lại (không tăng tốc giọng)", long=too_long)

    T = intro_len + poi_dur * len(pois) + outro_len
    starts = {"intro": LEAD_INTRO, "outro": intro_len + poi_dur * len(pois) + LEAD_OUT}
    for i in range(len(pois)):
        starts[f"poi{i+1}"] = intro_len + poi_dur * i + LEAD_POI

    keys = [k for k, _ in lines if k in res]
    cmd = ["ffmpeg", "-v", "error", "-y"]
    for k in keys:
        cmd += ["-i", str(res[k]["file"])]
    parts = [f"[{i}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={int(starts[k]*1000)}|{int(starts[k]*1000)}[a{i}]" for i, k in enumerate(keys)]
    mix = "".join(f"[a{i}]" for i in range(len(keys)))
    filt = ";".join(parts) + f";{mix}amix=inputs={len(keys)}:normalize=0:dropout_transition=0,apad=whole_dur={T:.2f},atrim=0:{T:.2f}[out]"
    out_mp3 = d / "voice.mp3"
    r = subprocess.run(cmd + ["-filter_complex", filt, "-map", "[out]", "-ar", "48000", "-ac", "2", "-b:a", "128k", str(out_mp3)],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode:  # ffmpeg cũ chưa có normalize=0: amix chia đều → bù lại bằng volume
        filt = filt.replace(":normalize=0", "").replace(",apad=", f",volume={len(keys)},apad=")
        run(cmd + ["-filter_complex", filt, "-map", "[out]", "-ar", "48000", "-ac", "2", "-b:a", "128k", str(out_mp3)])

    caps = []
    for k in keys:
        caps += chunks(res[k]["text"], res[k]["words"], starts[k], res[k]["dur"])
    (d / "words.json").write_text(json.dumps({"T": round(T, 2), "poiDur": poi_dur, "caps": caps}, ensure_ascii=False), encoding="utf-8")
    if not any(res[k]["words"] for k in keys):
        warn.append("Không có mốc từ từ edge-tts; phụ đề chia đều theo số từ")
    print(json.dumps({"ok": True, "poiDur": poi_dur, "T": round(T, 2), "voice": str(out_mp3), "words": str(d / "words.json"), "warn": warn}, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())
