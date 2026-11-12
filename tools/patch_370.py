#!/usr/bin/env python3
"""mlv-engine 3.6.0 -> 3.7.0
- câu móc trên bản đồ: chữ đặt phía đối diện tiện ích (tiện ích nằm trên ghim dự án → chữ dưới ghim, và ngược lại)
- travel 'moto': tuyến xe máy (hồ sơ xe đạp) dài hơn 1,6 lần tuyến ô tô → dùng tuyến ô tô (hồ sơ xe đạp hay kẹt ở
  đại lộ cấm xe đạp, ra đường vòng 25–30 km); thời gian vẫn tính theo tốc độ xe máy. pois[].route:'car' → luôn tuyến ô tô.
Dùng: patch_370.py mlv-engine-3.6.0.js mlv-engine-3.7.0.js
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
rep("/*! mlv-engine 3.6.0", "/*! mlv-engine 3.7.0")
rep('"3.6.0"', '"3.7.0"')
rep("""                        let W = (await (await fetch(t.travel === "moto" ? Tm(t.project, u) : To(t.project, u))).json()).routes[0];
                        b = W.geometry.coordinates,""", """                        let W = (await (await fetch(t.travel === "moto" && u.route !== "car" ? Tm(t.project, u) : To(t.project, u))).json()).routes[0];
                        if (t.travel === "moto" && u.route !== "car") try {
                            let C = (await (await fetch(To(t.project, u))).json()).routes[0];
                            C && C.distance * 1.6 < W.distance && (W = C, u.viaCar = 1)
                        } catch {}
                        b = W.geometry.coordinates,""")
# --- câu móc trên bản đồ: chữ đặt ở chỗ trống — phía đối diện tiện ích, dưới ghim thấp hơn, trên ghim cao hơn, hoặc nửa trái/phải (1:1, 16:9)
rep("let Ti = 1, Bq = 0, Ha = 0, Hq = 0;", "let Ti = 1, Bq = 0, Ha = 0, Hq = 0, Hpl = {};")
rep("let [h1, h2, h3] = i.hook, z = 1 + .06 * (1 - ye(l / .45)), cx = o / 2, W = o * .86, Bs = Math.min(o, f * 1.05), cy = f * (Hb() ? .22 : .3);",
    "let [h1, h2, h3] = i.hook, z = 1 + .06 * (1 - ye(l / .45)), cx = Hb() && Hpl.cx || o / 2, W = Hb() && Hpl.W || o * .86, Bs = Math.min(o, f * 1.05), cy = f * (Hb() ? .22 : .3);")
rep("""        Hb() && f <= o * 1.2 && (cy = u + 26 + b1 * .62 + (h3 ? Math.round(Bs * .03) * 2 : 0));""",
    """        Hb() && Hpl.below && (cy = Hpl.below + 26 + b1 * .62 + (h3 ? Math.round(Bs * .03) * 2 : 0)), Hb() && Hpl.cy && (cy = Hpl.cy);""")
rep("""        let [h1, h2, h3] = i.hook, W = o * .86, Bs = Math.min(o, f * 1.05), cy = f * .22,""",
    """        let [h1, h2, h3] = i.hook, W = Hpl.W || o * .86, cx = Hpl.cx || o / 2, Bs = Math.min(o, f * 1.05), cy = f * .22,""")
rep("""        f <= o * 1.2 && (cy = u + 26 + b1 * .62 + (h3 ? Math.round(Bs * .03) * 2 : 0));""",
    """        Hpl.below && (cy = Hpl.below + 26 + b1 * .62 + (h3 ? Math.round(Bs * .03) * 2 : 0)), Hpl.cy && (cy = Hpl.cy);""")
rep("""            x0: o * .04,
            y0: cy - b1 * .62 - b3 * 2 - 8,
            x1: o * .96,""", """            x0: cx - W / 2 - 8,
            y0: cy - b1 * .62 - b3 * 2 - 8,
            x1: cx + W / 2 + 8,""")
rep("""            Hq = Hr();""", """            {
                let w0 = ua(ga(Hm(l))), q0 = mi[Math.min(H - 1, i.hookPoi || 0)], e0 = w0(q0.end[0], q0.end[1]),
                    vt = f > o * 1.2, nd = Math.min(o, f * 1.05) * (vt ? .42 : .36), lo = Math.max(u, e0[1]), hi = Math.min(u, e0[1]) - 70;
                Hpl = {};
                if (e0[1] < u - 30) Hpl.below = u;
                else if (!vt) {
                    if (lo + 40 + nd < f - 60) Hpl.below = lo + 10;
                    else if (hi - nd < (a.labelTop || 60)) {
                        let Wd = o * .42, y0 = f * .42 - nd / 2, y1 = f * .42 + nd / 2,
                            pins = [[S - o * .07, u - f * .2, S + o * .07, u + 4], [e0[0] - o * .05, e0[1] - f * .1, e0[0] + o * .05, e0[1] + 4]],
                            ov = x0 => pins.reduce((t, r) => t + Math.max(0, Math.min(x0 + Wd, r[2]) - Math.max(x0, r[0])) * Math.max(0, Math.min(y1, r[3]) - Math.max(y0, r[1])), 0);
                        Hpl.W = Wd, Hpl.cx = ov(o * .03) <= ov(o * .97 - Wd) ? o * .03 + Wd / 2 : o * .97 - Wd / 2, Hpl.cy = f * .42
                    }
                }
            }
            Hq = Hr();""")

rep("let b1 = h1 ? ae(h1, 900, Math.round(Bs * (f > o * 1.2 ? Hb() ? .22 : .25 : Hb() ? .16 : .19)), Math.round(Bs * .08), W) : 0;",
    "let b1 = h1 ? ae(h1, 900, Math.round(Bs * (f > o * 1.2 ? Hb() ? .22 : .25 : Hb() ? .16 : .19)), Math.round(Bs * (Hb() && Hpl.W ? .045 : .08)), W) : 0;")
rep("b1 = h1 ? ae(h1, 900, Math.round(Bs * (f > o * 1.2 ? .22 : .16)), Math.round(Bs * .08), W) : 0;",
    "b1 = h1 ? ae(h1, 900, Math.round(Bs * (f > o * 1.2 ? .22 : .16)), Math.round(Bs * (Hpl.W ? .045 : .08)), W) : 0;")

Path(sys.argv[2]).write_text(out, encoding="utf-8")
print("ok")
