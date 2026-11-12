#!/usr/bin/env python3
"""mlv-engine 3.4.0 -> 3.5.0
- hookBg:'map' : 3 giây đầu là cảnh bản đồ của tiện ích hookPoi (tuyến đã vẽ, ảnh, nhãn) + câu móc, đẩy zoom 0,5 s, chớp trắng khi cắt sang cảnh mở
- pois[].tag    : nhãn lợi ích thay cho tên loại trên thẻ tiện ích (vd "7:00 · CON ĐI HỌC")
- âm mở đầu     : có hook → 'pop' tại 0,08 s, 'whoosh' tại lúc cắt; tiếng vào ngay (fade-in 0,04 s)
"""
import sys, re
from pathlib import Path

src = Path(sys.argv[1]).read_text(encoding="utf-8")
out = src


def rep(old, new, count=1):
    global out
    n = out.count(old)
    if n != count:
        sys.exit(f"pattern found {n}x (need {count}): {old[:90]!r}")
    out = out.replace(old, new)


rep("/*! mlv-engine 3.4.0", "/*! mlv-engine 3.5.0")
rep('"3.4.0"', '"3.5.0"')

# --- cấu hình
rep("""        hook: Array.isArray(e.hook) && e.hook.some(Boolean) ? e.hook.slice(0, 3) : null,
        hero: e.hero ? {""",
    """        hook: Array.isArray(e.hook) && e.hook.some(Boolean) ? e.hook.slice(0, 3) : null,
        hookBg: e.hookBg === "map" ? "map" : "hero",
        hookPoi: Math.max(0, Math.min(o.length - 1, Math.round(+e.hookPoi || 0))),
        hero: e.hero || e.hookBg === "map" ? e.hero ? {""")
rep("""            dur: fi(+(e.hero.dur || 3), 2, 5)
        } : null,""",
    """            dur: fi(+(e.hero.dur || 3), 2, 5)
        } : {
            intro: "",
            outro: "",
            dur: fi(+(e.hookDur || 3), 2, 5)
        } : null,""")

# --- cờ "đang có câu móc" (ảnh phối cảnh hoặc bản đồ)
rep("if (l >= zt || i.hook && i.heroIn) {", "if (l >= zt || Hy()) {")
rep("let m = (i.hook && i.heroIn ? ye(", "let m = (Hy() ? ye(")
rep("if (i.hook && i.heroIn && l < i.hero.dur) return null;", "if (Hq || Hy() && l < i.hero.dur) return null;")
rep("let Ti = 1, Bq = 0, Ha = 0;", "let Ti = 1, Bq = 0, Ha = 0, Hq = 0;\n    const Hy = () => !!(i.hook && (i.heroIn || i.hookBg === \"map\") && i.hero), Hb = () => Hy() && i.hookBg === \"map\";")

# --- ảnh phối cảnh mở đầu không dùng khi câu móc nằm trên bản đồ
rep("if (Ha = 0, i.heroIn && l < i.hero.dur + .6) B = i.heroIn",
    "if (Ha = 0, i.heroIn && !Hb() && l < i.hero.dur + .6) B = i.heroIn")

# --- thẻ tiện ích: nhãn lợi ích
rep("s.fillText(`${w.cat} \\xB7 0${c+1}/0${H}`, R, _ + 26);",
    "s.fillText(`${w.tag ? String(w.tag).toUpperCase() : w.cat} \\xB7 0${c+1}/0${H}`, R, _ + 26);")
# ẩn thẻ khi đang vẽ khung câu móc
rep("            On(q, z, (l - $ - 1) / .5)\n", "            Hq || On(q, z, (l - $ - 1) / .5)\n")

# --- khung câu móc trên bản đồ: render(t) -> render cảnh tiện ích hookPoi gần cuối cảnh
rep("    function os(l, c = !0) {\n        Ji = [],",
    """    function Hm(l) {
        let k = Math.min(H - 1, i.hookPoi || 0);
        return X + Ce * k + Math.min(Ce - .25, 4.3 + .8 * l / i.hero.dur)
    }

    function Hz(l) {
        let z = 1 + .14 * (1 - ye(l / .5));
        z > 1.001 && (s.save(), s.setTransform(1, 0, 0, 1, 0, 0), s.drawImage(s.canvas, b / 2 * (1 - z), x / 2 * (1 - z), b * z, x * z), s.restore());
        s.setTransform(T, 0, 0, T, 0, 0);
        let v0 = f > o * 1.2,
            g = v0 ? s.createLinearGradient(0, 0, 0, f * .58) : s.createLinearGradient(0, f, 0, f * .4);
        g.addColorStop(0, "rgba(0,0,0,.5)"), g.addColorStop(1, "rgba(0,0,0,0)"), s.fillStyle = g, v0 ? s.fillRect(0, 0, o, f * .58) : s.fillRect(0, f * .4, o, f * .6)
    }

    function os(l, c = !0) {
        if (Hb() && l < i.hero.dur) {
            Hq = 1;
            try {
                Os0(Hm(l), c)
            } finally {
                Hq = 0
            }
            Hz(l), Hk(l), s.setTransform(1, 0, 0, 1, 0, 0);
            return
        }
        Os0(l, c);
        if (Hb() && l < i.hero.dur + .3) s.save(), s.setTransform(1, 0, 0, 1, 0, 0), s.fillStyle = `rgba(255,255,255,${(.5*(1-(l-i.hero.dur)/.3)).toFixed(3)})`, s.fillRect(0, 0, b, x), s.restore()
    }

    function Os0(l, c = !0) {
        Ji = [],""")

# --- nạp ô ảnh cho khung câu móc
rep("""    async function ka(l) {
        await n.ensure(ba(l)), i.rd && await i.rd.ensure(ba(l))
    }""",
    """    async function ka(l) {
        Hb() && l < i.hero.dur && (l = Hm(l)), await n.ensure(ba(l)), i.rd && await i.rd.ensure(ba(l))
    }""")

# --- âm thanh mở đầu
rep("    t.MK !== \"pin\" && It(n, o, d, \"pop\", t.INTRO + .05),",
    "    e.hook && e.hero && (It(n, o, d, \"pop\", .08), It(n, o, d, \"whoosh\", e.hero.dur - .12)), t.MK !== \"pin\" && It(n, o, d, \"pop\", t.INTRO + .05),")
rep("        T = Math.round(.3 * ue),\n        O = Math.round(1.5 * ue);",
    "        T = Math.round((e.hook ? .04 : .3) * ue),\n        O = Math.round(1.5 * ue);")

# --- khung câu móc trên bản đồ: chữ cao hơn, ảnh/nhãn né vùng chữ
rep("let [h1, h2, h3] = i.hook, z = 1 + .06 * (1 - ye(l / .45)), cx = o / 2, W = o * .86, Bs = Math.min(o, f * 1.05), cy = f * .3;",
    "let [h1, h2, h3] = i.hook, z = 1 + .06 * (1 - ye(l / .45)), cx = o / 2, W = o * .86, Bs = Math.min(o, f * 1.05), cy = f * (Hb() ? .22 : .3);")
rep("let b1 = h1 ? ae(h1, 900, Math.round(Bs * (f > o * 1.2 ? .25 : .19)), Math.round(Bs * .08), W) : 0;",
    "let b1 = h1 ? ae(h1, 900, Math.round(Bs * (f > o * 1.2 ? Hb() ? .22 : .25 : Hb() ? .16 : .19)), Math.round(Bs * .08), W) : 0;")
rep("""    function Hm(l) {""", """    function Hr() {
        let [h1, h2, h3] = i.hook, W = o * .86, Bs = Math.min(o, f * 1.05), cy = f * .22,
            b1 = h1 ? ae(h1, 900, Math.round(Bs * (f > o * 1.2 ? .22 : .16)), Math.round(Bs * .08), W) : 0;
        cy = Math.max(cy, (a.labelTop || 60) + b1 * .62 + Bs * .075);
        let b3 = h3 ? ae(h3, 700, Math.round(Bs * .03), 10, W - 30) : 0,
            b2 = h2 ? ae(h2, 800, Math.round(Bs * (f > o * 1.2 ? .07 : .058)), 12, W - 40) : 0;
        return {
            x0: o * .04,
            y0: cy - b1 * .62 - b3 * 2 - 8,
            x1: o * .96,
            y1: cy + b1 * .55 + b2 * 1.8 + 10
        }
    }

    function Hm(l) {""")
rep("""            Hq = 1;
            try {""", """            Hq = Hr();
            try {""")
rep("L = Sa(g[0], g[1], C, i.name, [R, ...Qc ? [Qc.r] : []]),", "L = Sa(g[0], g[1], C, i.name, [R, ...Qc ? [Qc.r] : [], ...Hq ? [Hq] : []]),")
rep("Qf = Sa(me[0], me[1], Qu, q.p.name, [...ee, _, R, ...Qc ? [Qc.r] : []]);", "Qf = Sa(me[0], me[1], Qu, q.p.name, [...ee, _, R, ...Qc ? [Qc.r] : [], ...Hq ? [Hq] : []]);")
rep("Ph = Pp(q, me, Qu, l - $, [...ee, _, R, ...U ? [] : [L.rect], ...Qc ? [Qc.r] : [], Qf.rect], _)", "Ph = Pp(q, me, Qu, l - $, [...ee, _, R, ...U ? [] : [L.rect], ...Qc ? [Qc.r] : [], Qf.rect, ...Hq ? [Hq] : []], _)")
rep("let ft = Sa(me[0], me[1], Ue, q.p.name, [...ee, _, R, ...Qc ? [Qc.r] : [], ...Ph ? [Ph.r] : []]);", "let ft = Sa(me[0], me[1], Ue, q.p.name, [...ee, _, R, ...Qc ? [Qc.r] : [], ...Ph ? [Ph.r] : [], ...Hq ? [Hq] : []]);")

# --- 1:1 và 16:9: chữ câu móc nằm dưới ghim dự án (ghim ở giữa khung)
rep("""        cy = Math.max(cy, (a.labelTop || 60) + b1 * .62 + Bs * .075);
        if (h3) {""", """        cy = Math.max(cy, (a.labelTop || 60) + b1 * .62 + Bs * .075);
        Hb() && f <= o * 1.2 && (cy = u + 26 + b1 * .62 + (h3 ? Math.round(Bs * .03) * 2 : 0));
        if (h3) {""")
rep("""        cy = Math.max(cy, (a.labelTop || 60) + b1 * .62 + Bs * .075);
        let b3 = h3""", """        cy = Math.max(cy, (a.labelTop || 60) + b1 * .62 + Bs * .075);
        f <= o * 1.2 && (cy = u + 26 + b1 * .62 + (h3 ? Math.round(Bs * .03) * 2 : 0));
        let b3 = h3""")

Path(sys.argv[2]).write_text(out, encoding="utf-8")
print("ok", len(src), "->", len(out))
