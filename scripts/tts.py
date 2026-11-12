#!/usr/bin/env python3
"""Giọng đọc cho video map-location-video v3.5 (chạy trên workspace của Claude).

Dùng:  python tts.py <thư mục dự án>
Đọc   <thư mục>/script.json
Ghi   <thư mục>/voice.mp3  (đã xếp đúng mốc cảnh, 48 kHz stereo)
      <thư mục>/words.json (T, poiDur, caps: [{t0, t1, text}])
In ra 1 dòng JSON: {"ok", "poiDur", "T", "voice", "words", "warn"} — truyền poiDur vào CFG.

script.json:
{
  "engine": "vieneu",               # vieneu (mặc định: VieNeu-TTS v3 Turbo, Apache-2.0, chạy CPU) | edge
  "voice": "Đức Trí",               # vieneu: Đức Trí (nam, miền Nam, kể chuyện) · Adam · Thục Đoan (nữ) …; edge: vi-VN-NamMinhNeural | vi-VN-HoaiMyNeural
  "rate": "+0%",
  "brand": true,                    # false khi brandMode 'none'
  "intro": "câu mở",
  "pois": ["1 câu / tiện ích", "..."],   # đúng thứ tự pois trong CFG
  "outro": "câu chốt",
  "say": {"Green Skyline": "Grin Xờ cai lai"},   # tùy chọn: cách đọc từ nước ngoài (phụ đề giữ chữ gốc)
  "style": "song-dong"              # edge: song-dong (đổi cao độ, tốc độ theo câu) | deu
}

vieneu: cần ~/mlv-tts (python3 -m venv ~/mlv-tts && ~/mlv-tts/bin/pip install vieneu "onnxruntime==1.22.1");
        đọc thẳng tên tiếng Anh (không dùng bảng LEXICON, chỉ dùng "say"); mốc từ cho phụ đề lấy bằng faster-whisper.
        Thiếu ~/mlv-tts → tự chuyển sang edge, ghi warn.
edge:   gói edge-tts, mạng internet. Cần ffmpeg + ffprobe.
"""
import asyncio, json, os, re, subprocess, sys, tempfile
from pathlib import Path

POI_MIN, POI_MAX = 5.5, 9.0
SCENE_MAX = 8.0     # cảnh mở/kết dài nhất
LEAD_POI = 0.6      # giây sau đầu cảnh tiện ích thì bắt đầu đọc
TAIL_POI = 0.3      # khoảng trống trước cảnh kế tiếp
LEAD_INTRO, LEAD_OUT, TAIL_END = 0.3, 0.5, 0.3
CAP_WORDS = 7
# Cách đọc mặc định cho từ tiếng Anh / viết tắt hay gặp (khớp nguyên từ, phân biệt hoa thường); script.json "say" ghi đè
LEXICON = {
    "TBS Land": "Ti bi ét Len", "TBS": "Ti bi ét", "AVI Realty": "A vi Ri ồ ti", "AVI": "A vi",
    "metro": "mê trô", "Metro": "Mê trô", "GO!": "Gâu", "Skyline": "Xờ cai lai", "Green": "Grin",
    "Mall": "Mo", "mall": "mo", "Land": "Len", "Park": "Pác", "City": "Xi ti", "Center": "Xen tơ",
    "Central": "Xen trồ", "Garden": "Ga đần", "View": "Viu", "Tower": "Tao ơ", "Sky": "Xờ cai",
}
# Ngữ điệu "song-dong": mỗi câu một mức cao độ / tốc độ khác nhau để giọng bớt đều đều
STYLE = {
    "intro": ("+8%", "+8Hz"),
    "poi": [("+5%", "+6Hz"), ("+3%", "+1Hz"), ("+6%", "+4Hz"), ("+4%", "-1Hz"), ("+5%", "+5Hz"), ("+3%", "+2Hz")],
    "outro": ("+0%", "+5Hz"),
}


def spoken(text, lex):
    """Thay từ theo bảng cách đọc (cụm dài trước); trả chuỗi để đọc."""
    import re as _re
    for k in sorted(lex, key=len, reverse=True):
        text = _re.sub(r"(?<![\wÀ-ỹ])" + _re.escape(k) + r"(?![\wÀ-ỹ])", lex[k], text)
    return text


def is_en(w):
    """Từ ASCII không theo chính tả tiếng Việt (tên tiếng Anh, viết tắt) → cần kiểm cách đọc."""
    if re.fullmatch(r"[A-Z]{2,}", w):
        return True
    w = w.lower()
    return bool(re.search(r"[fjwz]|ee|oo|ea", w) or re.match(r"(bl|br|cl|cr|dr|fl|fr|gl|gr|pl|pr|sc|sk|sl|sm|sn|sp|st|sw|tw|wh|sh)", w)
                or re.search(r"[bdklrsvx]$", w))


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


VIENEU_PY = Path(os.environ.get("MLV_TTS_PY", str(Path.home() / "mlv-tts" / "bin" / "python")))
TRIM = "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse"


def vieneu_lines(items, voice, tmp):
    """items: [(key, text)] → {key: wav đã cắt lặng 2 đầu}. Nạp mô hình 1 lần cho cả kịch bản."""
    spec = {"voice": voice, "lines": [{"text": t, "out": str(tmp / f"{k}.raw.wav")} for k, t in items]}
    sp = tmp / "vieneu.json"
    sp.write_text(json.dumps(spec, ensure_ascii=False), encoding="utf-8")
    r = subprocess.run([str(VIENEU_PY), str(Path(__file__).with_name("vieneu_say.py")), str(sp)],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    line = next((l for l in r.stdout.splitlines()[::-1] if l.startswith("{")), "")
    if r.returncode or not line or not json.loads(line).get("ok"):
        die("VieNeu lỗi", detail=(line or r.stderr.strip()[-400:]))
    out = {}
    for k, _ in items:
        f = tmp / f"{k}.wav"
        run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp / f"{k}.raw.wav"), "-af", TRIM, "-ar", "48000", str(f)])
        out[k] = f
    return out


_WM = None


def align(path):
    """Mốc từng từ bằng faster-whisper (small, CPU); [] khi không có gói."""
    global _WM
    try:
        import numpy as np
        from faster_whisper import WhisperModel
    except ImportError:
        return []
    if _WM is None:
        _WM = WhisperModel("small", device="cpu", compute_type="int8")
    pcm = np.frombuffer(subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", "16000", "-"],
                                       capture_output=True).stdout, np.float32)
    segs, _ = _WM.transcribe(pcm, language="vi", beam_size=5, word_timestamps=True, vad_filter=False)
    return [(w.start, w.end, w.word.strip()) for sg in segs for w in (sg.words or []) if w.word.strip()]


async def synth(text, voice, rate, out, pitch="+0Hz"):
    import os
    ca = os.environ.get("SSL_CERT_FILE") or ("/root/.ccr/ca-bundle.crt" if os.path.exists("/root/.ccr/ca-bundle.crt") else "")
    if ca:  # proxy giải mã TLS (máy chủ Claude): edge-tts dùng certifi, trỏ certifi sang bundle của proxy
        import certifi
        certifi.where = lambda: ca
    import edge_tts
    kw = {"rate": rate, "pitch": pitch}
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    if proxy:  # aiohttp không tự dùng biến proxy của hệ thống
        kw["proxy"] = proxy
    try:
        comm = edge_tts.Communicate(text, voice, boundary="WordBoundary", **kw)
    except TypeError:  # edge-tts < 7 không có tham số boundary (mặc định WordBoundary)
        comm = edge_tts.Communicate(text, voice, **kw)
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
    elif words:  # số từ đọc khác số từ gốc (đã đổi cách đọc): chia mốc theo tỉ lệ, phụ đề vẫn là chữ gốc
        n, m = len(toks), len(words)
        units = []
        for j, t in enumerate(toks):
            a = words[min(m - 1, j * m // n)][0]
            b = words[min(m - 1, max(j * m // n, (j + 1) * m // n - 1))][1]
            units.append((a, b, t))
    else:  # không có mốc từ: chia đều theo số từ
        n = max(1, len(toks)); step = dur / n
        units = [(i * step, (i + 1) * step, w) for i, w in enumerate(toks)]
    clauses, cur = [], []  # tách theo dấu câu, vế dài chia đều (không cắt "mười | phút")
    for u in units:
        cur.append(u)
        if re.search(r"[,.;:!?…]$", u[2]):
            clauses.append(cur); cur = []
    if cur:
        clauses.append(cur)
    out = []
    for c in clauses:
        k = -(-len(c) // CAP_WORDS)
        for j in range(k):
            out.append(c[j * len(c) // k:(j + 1) * len(c) // k])
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
    engine = s.get("engine", "vieneu")
    warn = []
    if engine == "vieneu" and not VIENEU_PY.exists():
        engine = "edge"
        warn.append("Chưa có ~/mlv-tts (VieNeu) → dùng giọng Edge")
    voice = s.get("voice") or ("Đức Trí" if engine == "vieneu" else "vi-VN-NamMinhNeural")
    if engine == "edge" and not voice.startswith("vi-VN-"):
        voice = "vi-VN-HoaiMyNeural" if voice in ("Thục Đoan", "Mỹ Duyên", "Kim Thanh", "Thùy Dung") else "vi-VN-NamMinhNeural"
    rate = s.get("rate", "+0%")
    brand = s.get("brand", True)
    lex = {**(LEXICON if engine == "edge" else {}), **(s.get("say") or {})}
    lively = s.get("style", "song-dong") != "deu"
    pois = [p.strip() for p in s.get("pois", []) if p and p.strip()]
    if not (1 <= len(pois) <= 6):
        die("script.json cần 1–6 câu tiện ích")
    intro_len, outro_len = (4.0, 5.0) if brand else (3.5, 3.5)
    if engine == "edge":
        try:
            import edge_tts  # noqa: F401
        except ImportError:
            die("Thiếu gói edge-tts: pip install edge-tts")

    tmp = Path(tempfile.mkdtemp(prefix="mlv_tts_"))
    lines = [("intro", s.get("intro", ""))] + [(f"poi{i+1}", t) for i, t in enumerate(pois)] + [("outro", s.get("outro", ""))]
    res = {}
    if engine == "vieneu":
        # VieNeu đọc ngẫu nhiên đôi chút: câu có tên tiếng Anh mà whisper nghe sai thì đọc lại (tối đa 3 lần), giữ bản nghe đúng
        names = set(s.get("check") or []) | {m for m in re.findall(r"(?<![\wÀ-ỹ])[A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*(?![\wÀ-ỹ])", " ".join(t for _, t in lines))
                                             if any(is_en(w) for w in m.split())}
        norm = lambda x: re.sub(r"[^a-z0-9]", "", x.lower())
        todo = [(k, spoken(t.strip(), lex)) for k, t in lines if t.strip()]
        for rnd in range(3):
            rd = tmp / f"r{rnd}"
            rd.mkdir()
            files = vieneu_lines(todo, voice, rd)
            miss = []
            for k, sp_ in todo:
                w = align(files[k])
                heard = norm(" ".join(x[2] for x in w))
                bad = [n for n in names if n in dict(lines)[k] and norm(n) not in heard]
                if k not in res or not bad:
                    res[k] = {"file": files[k], "dur": duration(files[k]), "words": w, "text": dict(lines)[k].strip(), "bad": bad}
                if bad:
                    miss.append((k, sp_))
            todo = miss
            if not todo:
                break
        for k in todo:
            warn.append(f"{k[0]}: whisper chưa nghe đúng {res[k[0]]['bad']} sau 3 lần đọc — nghe lại hoặc thêm \"say\"")
    for key, text in lines:
        if not text.strip() or engine != "edge":
            continue
        f = tmp / f"{key}.mp3"
        words, err = [], ""
        r, ptch = rate, "+0Hz"
        if lively:
            r, ptch = STYLE["intro"] if key == "intro" else STYLE["outro"] if key == "outro" else STYLE["poi"][(int(key[3:]) - 1) % len(STYLE["poi"])]
            if rate not in ("+0%", "0%"):
                r = rate
        for attempt in range(4):
            try:
                words = await synth(spoken(text.strip(), lex), voice, r, f, ptch)
                if f.stat().st_size > 1000:
                    break
            except Exception as e:  # mạng chập chờn: thử lại
                err = str(e)
            await asyncio.sleep(1.5 * (attempt + 1))
        else:
            die(f"Không tạo được giọng cho '{key}'", detail=err)
        res[key] = {"file": f, "dur": duration(f), "words": words, "text": text.strip()}

    too_long = []
    poi_need = max([res[k]["dur"] + LEAD_POI + TAIL_POI for k in res if k.startswith("poi")] + [POI_MIN])
    if poi_need > POI_MAX:
        too_long += [f"{k}: {res[k]['dur']:.1f}s (tối đa {POI_MAX - LEAD_POI - TAIL_POI:.1f}s)" for k in res
                     if k.startswith("poi") and res[k]["dur"] + LEAD_POI + TAIL_POI > POI_MAX]
    poi_dur = round(min(POI_MAX, max(POI_MIN, poi_need)) + 0.049, 1)
    # cảnh mở/kết tự dài ra theo giọng (engine nhận introDur/outroDur), tối đa SCENE_MAX
    if "intro" in res:
        intro_len = max(intro_len, round(LEAD_INTRO + res["intro"]["dur"] + 0.6 + 0.049, 1))
        if intro_len > SCENE_MAX:
            too_long.append(f"intro: {res['intro']['dur']:.1f}s (tối đa {SCENE_MAX - LEAD_INTRO - 0.6:.1f}s)")
    if "outro" in res:
        outro_len = max(outro_len, round(LEAD_OUT + res["outro"]["dur"] + TAIL_END + 0.6 + 0.049, 1))
        if outro_len > SCENE_MAX:
            too_long.append(f"outro: {res['outro']['dur']:.1f}s (tối đa {SCENE_MAX - LEAD_OUT - TAIL_END - 0.6:.1f}s)")
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
    (d / "words.json").write_text(json.dumps({"T": round(T, 2), "poiDur": poi_dur, "introDur": intro_len, "outroDur": outro_len, "caps": caps}, ensure_ascii=False), encoding="utf-8")
    if not any(res[k]["words"] for k in keys):
        warn.append("Không có mốc từ; phụ đề chia đều theo số từ")
    print(json.dumps({"ok": True, "engine": engine, "voiceName": voice, "poiDur": poi_dur, "introDur": intro_len, "outroDur": outro_len, "T": round(T, 2), "voice": str(out_mp3), "words": str(d / "words.json"), "warn": warn}, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())
