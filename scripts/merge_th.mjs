#!/usr/bin/env node
// Ghép talking head với video bản đồ (map-location-video v3) — chạy trên máy người dùng, cần ffmpeg + ffprobe trong PATH.
//
// Dùng: node merge_th.mjs <map.mp4> <talking.mp4> [--open 0-5] [--close <a>-<b>] [--out <file>]
//   --open   đoạn talking head mở đầu, giây "a-b" (mặc định 0-5)
//   --close  đoạn talking head chốt (mặc định 5 giây cuối của talking.mp4); "none" = bỏ
//   --out    file ra (mặc định <map>_th.mp4 cạnh file bản đồ)
// Kết quả: talking head mở → video bản đồ → talking head chốt, khung và fps theo video bản đồ, âm thanh chuẩn −14 LUFS.
// In 1 dòng JSON: {"ok", "out", "sec", "size"}.
import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import path from "node:path";

const die = (msg) => { console.log(JSON.stringify({ ok: false, err: msg })); process.exit(2); };
const sh = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 1 << 26 });
  if (r.error) die(`Không chạy được ${cmd}: ${r.error.message} (cài ffmpeg và thêm vào PATH)`);
  if (r.status !== 0) die(`${cmd} lỗi: ${(r.stderr || "").trim().slice(-400)}`);
  return r.stdout;
};
const probe = (f) => JSON.parse(sh("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=codec_type,width,height,r_frame_rate", "-of", "json", f]));
const range = (s, def) => {
  if (!s) return def;
  if (s === "none") return null;
  const m = /^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/.exec(s);
  if (!m || +m[2] <= +m[1]) die(`Khoảng thời gian sai: ${s} (dạng a-b, giây)`);
  return [+m[1], +m[2]];
};

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : undefined; };
const openR = opt("--open"), closeR = opt("--close"), outArg = opt("--out");
const [mapF, thF] = args;
if (!mapF || !thF) die("Dùng: node merge_th.mjs <map.mp4> <talking.mp4> [--open 0-5] [--close a-b|none] [--out file]");
for (const f of [mapF, thF]) if (!existsSync(f)) die(`Không thấy file: ${f}`);

const pm = probe(mapF), pt = probe(thF);
const vm = pm.streams.find((s) => s.codec_type === "video");
if (!vm) die("Video bản đồ không có hình");
const W = vm.width, H = vm.height;
const [fn, fd] = String(vm.r_frame_rate || "30/1").split("/").map(Number);
const FPS = Math.round(fn / (fd || 1)) || 30;
const thDur = +pt.format.duration;
const mapHasA = pm.streams.some((s) => s.codec_type === "audio");
const thHasA = pt.streams.some((s) => s.codec_type === "audio");
const o = range(openR, [0, Math.min(5, thDur)]);
const c = range(closeR, thDur > 10 ? [thDur - 5, thDur] : null);
for (const r of [o, c]) if (r && r[1] > thDur + 0.05) die(`Đoạn ${r.join("-")} vượt độ dài talking head (${thDur.toFixed(1)}s)`);
if (!o && !c) die("Cần ít nhất một đoạn talking head (--open hoặc --close)");

const out = outArg || path.join(path.dirname(mapF), path.basename(mapF, path.extname(mapF)) + "_th.mp4");
const V = `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},fps=${FPS},format=yuv420p,setsar=1`;
const A = "aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo";
const f = [], segs = [];
const thSeg = (r, tag) => {
  f.push(`[1:v]trim=${r[0]}:${r[1]},setpts=PTS-STARTPTS,${V},fade=t=in:st=0:d=0.2,fade=t=out:st=${(r[1] - r[0] - 0.2).toFixed(2)}:d=0.2[v${tag}]`);
  f.push(thHasA ? `[1:a]atrim=${r[0]}:${r[1]},asetpts=PTS-STARTPTS,${A}[a${tag}]` : `anullsrc=r=48000:cl=stereo,atrim=0:${r[1] - r[0]}[a${tag}]`);
  segs.push(tag);
};
if (o) thSeg(o, "o");
f.push(`[0:v]${V}[vm]`);
f.push(mapHasA ? `[0:a]${A}[am]` : `anullsrc=r=48000:cl=stereo,atrim=0:${(+pm.format.duration).toFixed(2)}[am]`);
segs.push("m");
if (c) thSeg(c, "c");
f.push(`${segs.map((s) => `[v${s}][a${s}]`).join("")}concat=n=${segs.length}:v=1:a=1[v][a0]`);
f.push(`[a0]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]`);

sh("ffmpeg", ["-v", "error", "-y", "-i", mapF, "-i", thF, "-filter_complex", f.join(";"), "-map", "[v]", "-map", "[a]",
  "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", out]);
const po = probe(out);
console.log(JSON.stringify({ ok: true, out: path.resolve(out), sec: +(+po.format.duration).toFixed(1), size: `${W}x${H}`, MB: +(statSync(out).size / 1e6).toFixed(1) }));
