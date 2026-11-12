#!/usr/bin/env python3
"""mlv-engine 3.5.0 -> 3.6.0
- CFG beat (giây/phách, từ words.json của tts.py khi có beats.json): nhãn + ảnh tiện ích bật đúng phách gần 3,45 s nhất
  của mỗi cảnh, tiếng "pop" trùng lúc đó. Không có beat → như 3.5.0.
Dùng: patch_360.py mlv-engine-3.5.0.js mlv-engine-3.6.0.js
"""
import sys
from pathlib import Path

out = Path(sys.argv[1]).read_text(encoding="utf-8")


def rep(old, new, count=1):
    global out
    n = out.count(old)
    if n != count:
        sys.exit(f"pattern found {n}x (need {count}): {old[:90]!r}")
    out = out.replace(old, new)


rep("/*! mlv-engine 3.5.0", "/*! mlv-engine 3.6.0")
rep('"3.5.0"', '"3.6.0"')
rep("        hookPoi: Math.max(", "        beat: +e.beat > .2 && +e.beat < 1.5 ? +e.beat : 0,\n        hookPoi: Math.max(")
# mốc bật ảnh/nhãn trong cảnh tiện ích
rep("    function Pp(q, c, m, w, y, pr) {", "    const Pt = () => i.beat ? Math.round(3.45 / i.beat) * i.beat : 3.45;\n\n    function Pp(q, c, m, w, y, pr) {")
rep("ye((w - 3.5) / .35)", "ye((w - Pt() - .05) / .35)", 2)
rep("Ma = ye((l - $ - 3.4) / .35)", "Ma = ye((l - $ - Pt() + .05) / .35)")
rep('"pop", W + 3.4', '"pop", W + (e.beat ? Math.round(3.45 / e.beat) * e.beat : 3.45) - .05')
Path(sys.argv[2]).write_text(out, encoding="utf-8")
print("ok")
