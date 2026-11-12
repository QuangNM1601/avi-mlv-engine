#!/usr/bin/env python3
"""Đọc nhiều câu bằng VieNeu-TTS v3 Turbo (Apache-2.0, chạy CPU). Gọi từ tts.py bằng python của ~/mlv-tts.

Dùng:  ~/mlv-tts/bin/python vieneu_say.py spec.json
       ~/mlv-tts/bin/python vieneu_say.py --g2p '["Green Skyline","AVI"]'   → phiên âm từng cụm
spec:  {"voice": "Đức Trí", "lines": [{"text": "...", "out": "/tmp/a.wav"}, ...], "temperature": 0.8}
In:    1 dòng JSON {"ok": true, "files": [...]}
"""
import json, sys, os

if sys.argv[1] == "--g2p":  # phiên âm từng cụm (kiểm tra cách đọc tiếng Anh trước khi đọc)
    from sea_g2p import G2P
    g = G2P("vi")
    toks = json.loads(sys.argv[2])
    print(json.dumps({t: g.convert(t) for t in toks}, ensure_ascii=False))
    sys.exit(0)
spec = json.load(open(sys.argv[1], encoding="utf-8"))
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")
from vieneu import Vieneu  # noqa: E402

tts = Vieneu()
voice = spec.get("voice") or "Đức Trí"
if not tts.resolve_voice_name(voice):
    print(json.dumps({"ok": False, "err": f"Không có giọng {voice}", "voices": [v for _, v in tts.list_preset_voices()]}, ensure_ascii=False))
    sys.exit(2)
files = []
for ln in spec["lines"]:
    a = tts.infer(ln["text"], voice=voice, temperature=float(spec.get("temperature", 0.8)))
    tts.save(a, ln["out"])
    files.append(ln["out"])
print(json.dumps({"ok": True, "files": files}, ensure_ascii=False))
