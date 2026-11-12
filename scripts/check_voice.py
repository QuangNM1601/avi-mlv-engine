#!/usr/bin/env python3
"""Nghe lại giọng đọc bằng nhận dạng tiếng nói (faster-whisper, tiếng Việt) để kiểm tra cách đọc tên riêng.

Dùng:  python3 check_voice.py voice.mp3 "Green Skyline" "TBS Land" ...
In 1 dòng JSON: {"ok", "text": [{t, s}], "names": {"<tên>": true/false}}
- names[x] = true khi bản nghe lại có chứa x (không phân biệt hoa thường, bỏ dấu câu).
- false → đổi cách đọc trong script.json "say" (viết theo âm tiếng Việt, cách nhau dấu cách) rồi chạy lại tts.py.
Cần: pip install --break-system-packages faster-whisper; ffmpeg. Lần đầu tải mô hình "small" (~460 MB).
"""
import json, re, subprocess, sys, unicodedata


def norm(s):
    s = unicodedata.normalize("NFC", s.lower())
    return re.sub(r"[^\w\s]", " ", s).split()


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    if len(sys.argv) < 2:
        print(json.dumps({"ok": False, "err": "Dùng: check_voice.py voice.mp3 [tên ...]"}, ensure_ascii=False)); sys.exit(2)
    import numpy as np
    from faster_whisper import WhisperModel
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
                         capture_output=True).stdout
    audio = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    m = WhisperModel("small", device="cpu", compute_type="int8")
    segs = list(m.transcribe(audio, language="vi", beam_size=5)[0])
    text = [{"t": round(s.start, 1), "s": s.text.strip()} for s in segs]
    heard = " " + " ".join(norm(" ".join(x["s"] for x in text))) + " "
    names = {n: (" " + " ".join(norm(n)) + " ") in heard for n in sys.argv[2:]}
    print(json.dumps({"ok": True, "names": names, "text": text}, ensure_ascii=False))


if __name__ == "__main__":
    main()
