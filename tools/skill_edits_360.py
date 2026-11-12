#!/usr/bin/env python3
"""SKILL.md v3.5 → v3.6 (đọc nhanh 25 %, phát âm tiếng Anh, nhạc truyền cảm hứng Mixkit, cắt cảnh đúng phách).
Dùng: skill_edits_360.py <SKILL v3.5> <out> <mã commit>"""
import re, sys
from pathlib import Path

s = Path(sys.argv[1]).read_text(encoding="utf-8")
H = sys.argv[3]


def rep(old, new):
    global s
    n = s.count(old)
    if n != 1:
        sys.exit(f"{n}x: {old[:80]!r}")
    s = s.replace(old, new)


s = re.sub(r"git -C \$M checkout -q [0-9a-f]{40}", f"git -C $M checkout -q {H}", s)
rep("— AVI Realty (v3.5)", "— AVI Realty (v3.6)")
rep("Mặc định: 1:1 · nhạc Năng động · giọng VieNeu \"Đức Trí\" (nam, miền Nam) ·",
    "Mặc định: 1:1 · nhạc truyền cảm hứng từ Mixkit, cảnh cắt đúng phách · giọng VieNeu \"Đức Trí\" (nam, miền Nam), đọc nhanh 25 % ·")
rep("python3 -c \"import edge_tts, faster_whisper\" 2>/dev/null || pip install -q --break-system-packages edge-tts faster-whisper",
    "python3 -c \"import edge_tts, faster_whisper, librosa\" 2>/dev/null || pip install -q --break-system-packages edge-tts faster-whisper librosa")
rep("## 6. Lời đọc và giọng", """## 5b. Nhạc nền (trước lời đọc)
1. `python3 $M/scripts/music.py find` (≈ 20 giây) → bài Mixkit theo tâm trạng motivational · uplifting · hopeful · corporate, đã đo BPM, độ đều phách, độ mạnh phách, xếp theo `score`. Chọn bài đầu (BPM 95–135, `lead` < 1 s); 2 bài kế ghi làm phương án trên storyboard.
2. `python3 $M/scripts/music.py prep <id> --title "<tên bài>" --author "<tác giả>"` → `music.mp3` (phách mạnh đầu tiên rơi đúng 0 s) + `beats.json` (bpm, phách, ô nhịp, nguồn). CFG `music:{url:'music.mp3'}`.
3. Giấy phép Mixkit Free License: dùng thương mại, quảng cáo online, không cần ghi nguồn; không bán lại file nhạc rời. Ghi tên bài, tác giả, link vào mục Nguồn của storyboard.
4. Người dùng gửi nhạc và xác nhận có quyền → `music.py prep <file>`. Muốn nhạc tự tạo của engine → xóa `beats.json`, CFG `music:'nang-dong'` | `'sang-trong'`.

## 6. Lời đọc và giọng""")
rep("- Tên tiếng Anh: VieNeu đọc thẳng; tts.py tự nghe lại từng câu có tên tiếng Anh bằng whisper, sai thì đọc lại (tối đa 3 lần).",
    "- Nhịp đọc: `script.json` `\"speed\"` mặc định 1.25 (nhanh hơn 25 %, giữ cao độ; người dùng muốn 20–30 % → 1.2–1.3).\n"
    "- Phát âm tên tiếng Anh lẫn trong câu Việt (kiểm kỹ):\n"
    "  1. Bảng cách đọc VieNeu tự đổi: GO! → Gâu, AVI → A Vi; viết tắt tiếng Việt → chữ đầy đủ (KCN, KCNC, BV, ĐHQG, TP.HCM, CĐT). Viết tắt khác → ghi chữ đầy đủ trong lời đọc.\n"
    "  2. tts.py in `g2p` = phiên âm mọi tên tiếng Anh, viết tắt trước khi đọc. Mỗi tên tiếng Anh phải ra phiên âm tiếng Anh (vd Green Skyline → ɡɹˈiːn skˈaɪlaɪn). `warn` \"đọc kiểu tiếng Việt\" hoặc \"đọc từng chữ cái tiếng Anh\" → sửa `say`, chạy lại.\n"
    "  3. Câu có tên tiếng Anh: whisper tiếng Việt rồi tiếng Anh nghe lại, sai thì đọc lại (tối đa 6 lần), giữ bản nghe đúng.")
rep("- `python3 $M/scripts/tts.py .` (≈ 1,5 phút) → `voice.mp3`, `words.json` (độ dài cảnh tự tính, mốc phụ đề theo từng từ), in `engine`.",
    "- `python3 $M/scripts/tts.py .` (≈ 1,5–2,5 phút) → `voice.mp3`, `words.json` (độ dài cảnh tự tính, mốc phụ đề theo từng từ), in `engine`, `g2p`. Có `beats.json` → độ dài cảnh mở, tiện ích, kết làm tròn theo ô nhịp, `hookDur` theo phách (`beatSync:true`); `mlv.py run` tự áp `hookDur`, `beat` (ảnh và nhãn tiện ích bật đúng phách).")
rep("`ok:false` + `long` → rút gọn đúng câu đó, chạy lại; không tăng tốc giọng.", "`ok:false` + `long` → rút gọn đúng câu đó, chạy lại; không tăng tốc thêm.")
rep(""" "formats":["1:1"], "music":"nang-dong", "marker":"logo", "res":1080,""", """ "formats":["1:1"], "music":{"url":"music.mp3"}, "marker":"logo", "res":1080,""")
rep("· Nhạc (Năng động · Sang trọng · Không nhạc) ·", "· Nhạc (<bài 1> · <bài 2> · <bài 3> từ bước 5b · Nhạc tự tạo · Không nhạc) · Tốc độ đọc (1,0 · 1,15 · 1,25 · 1,3) ·")
rep("Nhạc → `music` (`nang-dong` | `sang-trong` | `none`; nhạc riêng người dùng gửi và xác nhận có quyền → `ffmpeg -i in -t 60 -ac 2 -b:a 128k music.mp3`, `music:{url:'music.mp3'}`)",
    "Nhạc → bài Mixkit: `music.py prep <id>` (rồi chạy lại tts.py để cảnh khớp phách mới); nhạc tự tạo → xóa `beats.json`, `music:'nang-dong'` | `'sang-trong'`; không nhạc → `music:'none'`; nhạc riêng người dùng có quyền → `music.py prep <file>` · Tốc độ đọc → `script.speed`")
rep("3. Lời đọc, giọng hoặc số cảnh đổi → chạy lại `tts.py` + `check_voice.py`.", "3. Lời đọc, giọng, tốc độ, nhạc hoặc số cảnh đổi → chạy lại `tts.py` + `check_voice.py`.")
rep("- Nhạc: chỉ nhạc tự tạo của engine hoặc file người dùng có quyền sử dụng; có giọng thì nhạc tự hạ. Chuẩn −14 LUFS.",
    "- Nhạc: bài Mixkit (Mixkit Free License) qua `music.py`, nhạc tự tạo của engine, hoặc file người dùng có quyền sử dụng; không lấy nhạc từ nguồn khác khi chưa kiểm giấy phép dùng thương mại. Có giọng thì nhạc tự hạ. Chuẩn −14 LUFS. Có `beats.json` → mọi điểm cắt cảnh rơi đúng ô nhịp.")
desc = ("Làm video vị trí và kết nối dự án bất động sản trên ảnh vệ tinh Esri nghiêng 3D, 2 giai đoạn: (1) gõ tên dự án → tự nghiên cứu "
        "(CĐT, quy mô, tiến độ, hạ tầng, giá và đối thủ), tọa độ Google Maps, thương hiệu, tiện ích + km/phút xe máy, 2 ảnh mỗi tiện ích, "
        "khung truyện + 3 câu móc có khung đầu, nhạc truyền cảm hứng miễn phí (Mixkit), lời đọc kể chuyện → storyboard Claude Docs, hỏi từng vấn đề rồi sửa; "
        "(2) nhắn 'dựng' → MP4 9:16 / 1:1 / 16:9 mở bằng cảnh bản đồ chứng minh câu móc, cảnh cắt đúng phách nhạc, giọng VieNeu đọc nhanh, "
        "kiểm kỹ phát âm tên tiếng Anh, phụ đề, logo AVI ở góc và khung kết, gửi vào chat. Chạy hết trên workspace của Claude. Không dùng cho mô phỏng thi công metro.")
s = re.sub(r'^description: ".*?"$', 'description: "' + desc + '"', s, count=1, flags=re.M)
Path(sys.argv[2]).write_text(s, encoding="utf-8")
print("ok", len(s.splitlines()), "lines; desc", len(desc))
