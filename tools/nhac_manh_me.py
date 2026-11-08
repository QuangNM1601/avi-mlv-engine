# Nhạc nền "mạnh mẽ" tự tạo (không dùng mẫu/âm thanh có bản quyền).
# 128 BPM, Rê thứ, vòng Dm–Bb–F–C; trống four-on-the-floor, bass 8 nốt nén theo kick,
# hợp âm supersaw, arp 16 nốt, fill tom + crash mỗi 8 nhịp, mở đầu dồn 2 nhịp rồi "drop".
import numpy as np, sys
from scipy.signal import butter, sosfilt

SR = 48000; BPM = 128; BEAT = 60 / BPM; BAR = 4 * BEAT
BARS = int(sys.argv[2]) if len(sys.argv) > 2 else 24
N = int(SR * (BARS * BAR + 2.5))
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)
mtof = lambda m: 440 * 2 ** ((m - 69) / 12)

def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def add(sig, t, gl=1.0, gr=None):
    i = int(t * SR); gr = gl if gr is None else gr
    if i >= N: return
    n = min(len(sig), N - i); L[i:i+n] += sig[:n] * gl; R[i:i+n] += sig[:n] * gr
def env(n, a, d):  # attack/decay theo giây
    t = np.arange(n) / SR; e = np.minimum(1, t / max(a, 1e-4)); return e * np.exp(-t / d)
def saw(f, n, ph=0):
    t = np.arange(n) / SR; x = (t * f + ph) % 1; return 2 * x - 1

# ---- nhạc cụ ----
def kick(peak=1.0):
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 45 + 95 * np.exp(-t / 0.035); ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.22); click = rng.standard_normal(n) * np.exp(-t / 0.004) * 0.25
    return np.tanh(1.8 * (body + click)) * peak
def snare(peak=0.6):
    n = int(0.35 * SR); t = np.arange(n) / SR
    nz = bp(rng.standard_normal(n), 900, 6500) * np.exp(-t / 0.11)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.06)
    clap = sum(bp(rng.standard_normal(n), 1000, 3000) * np.exp(-np.maximum(t - d, 0) / 0.02) * (t >= d) for d in (0, 0.011, 0.023))
    return np.tanh(1.5 * (nz * 0.9 + tone * 0.5 + clap * 0.35)) * peak
def hat(peak=0.12, dec=0.035):
    n = int(0.12 * SR); t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7500) * np.exp(-t / dec) * peak
def crash(peak=0.28):
    n = int(2.2 * SR); t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 4500) * env(n, 0.002, 0.7) * peak
def tom(f0, peak=0.5):
    n = int(0.4 * SR); t = np.arange(n) / SR; f = f0 * (1 + 0.6 * np.exp(-t / 0.03))
    return np.tanh(1.4 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.18)) * peak
def riser(dur, peak=0.25):
    n = int(dur * SR); t = np.arange(n) / SR; x = rng.standard_normal(n); out = np.zeros(n); seg = int(0.05 * SR)
    for s in range(0, n, seg):  # quét bandpass đi lên
        fc = 300 * (40 ** (s / n)); out[s:s+seg] = bp(x[max(0, s-2048):s+seg], fc * 0.7, min(fc * 1.4, 20000))[-len(x[s:s+seg]):]
    return out * (t / dur) ** 2 * peak
def impact(peak=0.9):
    n = int(2.5 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(30 + 60 * np.exp(-t / 0.08)) / SR) * np.exp(-t / 0.9)
    out = np.tanh(1.5 * boom) * peak; c = crash(0.3); out[:len(c)] += c[:n]; return out

CHORDS = [  # (gốc bass, nốt hợp âm) — Dm, Bb, F, C
    (38, [62, 65, 69, 74]), (34, [58, 62, 65, 70]), (41, [60, 65, 69, 72]), (36, [60, 64, 67, 72])]

def supersaw(notes, dur, peak, cutoff, a=0.01):
    n = int(dur * SR); l = np.zeros(n); r = np.zeros(n)
    for m in notes:
        for k, det in enumerate((-14, -7, -2, 2, 7, 14)):
            s = saw(mtof(m) * 2 ** (det / 1200), n, rng.random()); pan = 0.5 + (k - 2.5) / 7
            l += s * (1 - pan); r += s * pan
    e = env(n, a, 50) * np.clip((dur - np.arange(n) / SR) / 0.08, 0, 1)
    return lp(l, cutoff) * e * peak, lp(r, cutoff) * e * peak
def bass_note(m, dur, peak=0.32):
    n = int(dur * SR); t = np.arange(n) / SR
    s = lp(np.tanh(2.2 * saw(mtof(m), n)), 700) * 0.7 + np.sin(2 * np.pi * mtof(m - 12) * t) * 0.32
    return s * env(n, 0.004, 0.5) * np.clip((dur - t) / 0.02, 0, 1) * peak
def pluck(m, peak=0.08):
    n = int(0.25 * SR); t = np.arange(n) / SR
    s = (saw(mtof(m), n) + 0.5 * np.sign(np.sin(2 * np.pi * mtof(m + 12) * t)))
    return lp(s, 3800) * np.exp(-t / 0.09) * peak

# ---- dàn bài ----
DROP = 2  # 2 nhịp dồn (~3,75 s) rồi vào phần chính đúng lúc clip chuyển sang tiện ích đầu tiên
END = BARS - 2  # 2 nhịp cuối: hợp âm ngân + đánh kết
pump = np.ones(N)  # nén theo kick (sidechain)
for bar in range(BARS):
    t0 = bar * BAR; root, notes = CHORDS[bar % 4]
    if bar < DROP:  # mở đầu: pad lọc mở dần, trống dồn
        l, r = supersaw(notes, BAR, 0.035, 900 + 1800 * bar, a=0.4); add(l, t0); add(r, t0, 0, 1)
        for b in range(4): add(tom(110 - 12 * b + 30 * bar, 0.35), t0 + b * BEAT)
        if bar == DROP - 1:
            for k in range(8): add(snare(0.18 + 0.05 * k), t0 + 2 * BEAT + k * BEAT / 4)
            add(riser(BAR), t0)
        continue
    if bar == DROP or (bar - DROP) % 8 == 0: add(crash(), t0); add(kick(1.1), t0)
    if bar >= END:  # kết: hợp âm lớn ngân + đánh mạnh
        if bar == END:
            for k in (0, 1.5, 3): add(kick(1.0), t0 + k * BEAT)
            l, r = supersaw(CHORDS[0][1] + [50], 2 * BAR, 0.06, 3200); add(l, t0); add(r, t0, 0, 1)
            add(bass_note(26, 2 * BAR, 0.4), t0); add(crash(0.32), t0); add(impact(0.7), t0 + 3 * BEAT)
        continue
    for b in range(4):
        tb = t0 + b * BEAT; add(kick(0.72), tb)
        i = int(tb * SR); n = int(0.18 * SR); pump[i:i+n] = np.minimum(pump[i:i+n], 0.35 + 0.65 * np.linspace(0, 1, n) ** 0.6)
        if b in (1, 3): add(snare(0.75), tb)
        for h in range(4): add(hat(0.13 if h == 2 else 0.07), tb + h * BEAT / 4, 0.8, 1.0)
    for e in range(8): add(bass_note(root if e % 4 != 3 else root + 7, BEAT / 2 * 0.92), t0 + e * BEAT / 2)
    l, r = supersaw(notes, BAR, 0.085, 2800 if (bar - DROP) % 8 < 4 else 3600); add(l, t0); add(r, t0, 0, 1)
    arp = [notes[0] + 12, notes[1] + 12, notes[2] + 12, notes[3] + 12, notes[2] + 12, notes[1] + 12]
    for k in range(16): add(pluck(arp[k % len(arp)], 0.11), t0 + k * BEAT / 4, 0.7 if k % 2 else 1.0, 1.0 if k % 2 else 0.7)
    if (bar - DROP) % 8 == 7:  # fill trước mỗi đoạn mới
        for k, f in enumerate((180, 150, 120, 95)): add(tom(f, 0.5), t0 + 2 * BEAT + k * BEAT / 2)
        add(riser(BAR / 2, 0.2), t0 + BAR / 2)

# áp sidechain cho phần nhạc (ước lượng: toàn mix trừ kick đã cộng; đơn giản hóa bằng nhân toàn bộ rồi cộng lại kick)
# -> cách đơn giản: pump nhẹ toàn mix
L *= 0.6 + 0.4 * pump; R *= 0.6 + 0.4 * pump
# reverb ngắn (delay khuếch tán)
for d, g in ((0.031, 0.18), (0.047, 0.15), (0.071, 0.12), (0.113, 0.09), (0.167, 0.06)):
    k = int(d * SR); L[k:] += R[:-k] * g; R[k:] += L[:-k] * g * 0.9
mix = np.stack([L, R]); mix = hp(mix, 30); mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(1.6 * mix) / np.tanh(1.6) * 0.95  # nén/clip mềm cho chắc tiếng
fade = int(1.2 * SR); mix[:, -fade:] *= np.linspace(1, 0, fade)
from scipy.io import wavfile
wavfile.write(sys.argv[1], SR, (mix.T * 32767).astype(np.int16))
print('ok', BARS, 'bars', round(N / SR, 2), 's')
