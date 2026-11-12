#!/usr/bin/env python3
"""Sửa SKILL.md v3.4 → v3.5. Dùng: skill_edits_350.py <SKILL v3.4> <out> <mã commit>  (in edits JSON cho propose_skills)"""
import json, sys
from pathlib import Path

src = Path(sys.argv[1]).read_text(encoding="utf-8")
H = sys.argv[3]
E = []


def e(old, new):
    E.append({"old_string": old, "new_string": new})


e("## 3b. Ảnh phối cảnh và câu móc (3 giây đầu)", "## 3b. Ảnh phối cảnh")
e("# Video vị trí dự án trên ảnh vệ tinh — AVI Realty (v3.4)", "# Video vị trí dự án trên ảnh vệ tinh — AVI Realty (v3.5)")

e("""Mặc định: 1:1 · nhạc Năng động · giọng nam, ngữ điệu "song-dong" · thương hiệu Dự án + AVI · độ sáng 1 · tên đường bật · phụ đề bật · 3 giây đầu là ảnh phối cảnh sáng rõ + câu móc, cảnh kết có ảnh phối cảnh sau thẻ hotline · cự ly xe máy · 1080p.""",
  """Mặc định: 1:1 · nhạc Năng động · giọng VieNeu "Đức Trí" (nam, miền Nam) · thương hiệu Dự án + AVI · độ sáng 1 · tên đường bật · phụ đề bật · lời đọc kể chuyện theo 1 khung truyện · 3 giây đầu là cảnh bản đồ chứng minh câu móc (tuyến + ảnh tiện ích) + câu móc, cảnh kết có ảnh phối cảnh sau thẻ hotline · cự ly xe máy · 1080p.""")

e("""- Giai đoạn 1: ≤ 3 lượt tìm web dự án + 1 lượt tìm hạ tầng + trang web dự án; `gpoi` 1 lần, `poi` 1 lần; 2 ảnh mỗi tiện ích; xem ảnh 4 lần (logo, lưới ảnh phối cảnh, lưới ảnh tiện ích, tờ khung hình) + 1 lần sau khi sửa theo câu trả lời; 1 doc.""",
  """- Giai đoạn 1: ≤ 3 lượt tìm web dự án + 1 lượt tìm hạ tầng + 1 lượt tìm giá và đối thủ + trang web dự án; `gpoi` 1 lần, `poi` 1 lần; 2 ảnh mỗi tiện ích; xem ảnh 5 lần (logo, lưới ảnh phối cảnh, lưới ảnh tiện ích, tờ 3 câu móc, tờ khung hình) + 1 lần sau khi sửa theo câu trả lời; 1 doc.""")

e("git -C $M checkout -q 1db65b26633d3a145f61166af615b61621f409a5", f"git -C $M checkout -q {H}")

e("""- Thư mục làm việc `~/mlv-work/<slug>/` (`<slug>` = tên dự án không dấu, nối gạch). Mọi lệnh `python3 $M/scripts/mlv.py …` chạy trong thư mục này.""",
  """- Thư mục làm việc `~/mlv-work/<slug>/` (`<slug>` = tên dự án không dấu, nối gạch). Mọi lệnh `python3 $M/scripts/mlv.py …` chạy trong thư mục này.
- Giọng VieNeu (miễn phí, Apache-2.0, chạy CPU): cài nền ngay (`run_in_background`, ≈ 3 phút, 1 lần mỗi phiên): `[ -x ~/mlv-tts/bin/python ] || { python3 -m venv ~/mlv-tts && ~/mlv-tts/bin/pip install -q vieneu "onnxruntime==1.22.1"; }`. Lỗi → bỏ qua, tts.py tự dùng giọng Edge.""")

e("""- `hook` 3 dòng, hiện ngay từ khung hình đầu: dòng 1 ≤ 10 ký tự = con số / lợi thế mạnh nhất có nguồn (vd "1 PHÚT", "MẶT TIỀN QL1K"); dòng 2 ≤ 28 ký tự giải thích (vd "TỚI BỆNH VIỆN & SIÊU THỊ"); dòng 3 = "TÊN DỰ ÁN · CĐT · NHẬN NHÀ <quý/năm>". Chọn từ: tiện ích gần nhất (phút xe máy), vị trí mặt tiền, tiến độ, quy mô. Không dùng giá khi chưa có nguồn.""",
  """- Câu móc làm ở bước 4b (cần cự ly). Ảnh phối cảnh dùng cho cảnh kết; cho 3 giây đầu chỉ khi câu móc nói về chính dự án.""")

e("""Không có ảnh đạt → bỏ `hero`, `hook` (mở đầu trên bản đồ như cũ), ghi "cần ảnh phối cảnh".""",
  """Không có ảnh đạt → bỏ `hero` (câu móc vẫn chạy trên bản đồ), ghi "cần ảnh phối cảnh".""")

e("## 5. Ảnh tiện ích (2 ảnh mỗi tiện ích)", """## 4b. Câu chuyện và câu móc
Làm sau bước 4. Mục tiêu: 2 giây đầu người xem hiểu "ở đây được gì"; các cảnh sau nối thành 1 câu chuyện, không liệt kê.
1. Dữ kiện: 1 lượt WebSearch "giá căn hộ <phường/quận> <năm hiện tại>" → giá khu vực + 2–3 dự án cạnh tranh gần đó và điều họ quảng cáo. Từ hồ sơ (giá, loại căn) ghi **Khách chính** (gia đình ở thật · người đi làm KCN/KCNC · nhà đầu tư cho thuê) và **Điểm khác biệt** (điều dự án nói được, đối thủ gần đó không nói được), kèm nguồn.
2. **Khung truyện** — chọn 1, ghi thêm 1 khung dự phòng:

| Khung | Dùng khi | Thứ tự cảnh |
|---|---|---|
| Một ngày ở <dự án> | ≥ 2 điểm ≤ 3 phút + nơi học/làm ≤ 20 phút | sáng (trường, nơi làm) → trưa (trung tâm, metro) → chiều (mua sắm) → khi cần (y tế) → cuối tuần (sân bay, giải trí) |
| Vòng bán kính | tiện ích trải đều cự ly | 1 phút → 5 → 15 → 30+ phút; mỗi vòng 1 nhu cầu |
| Ai sẽ thuê nhà bạn? | khách chính là nhà đầu tư; gần ĐH, KCN lớn | nguồn khách thuê (số sinh viên, lao động có nguồn) → kết nối → tiện ích |
| Trước và sau <hạ tầng> | hạ tầng lớn xong trong ≤ 24 tháng, nguồn ≤ 12 tháng | hôm nay X phút → khi xong Y phút → tiện ích hiện có |

3. **Thông điệp chính** ≤ 12 từ (vd "Thiết yếu trong 1 phút, đi làm dưới 20 phút"): câu móc nêu, các cảnh chứng minh, câu kết nhắc lại.
4. **3 câu móc**, mỗi câu 1 kiểu:

| Kiểu | Chữ trên hình (dòng 1 · dòng 2) | Câu nói 3 giây đầu |
|---|---|---|
| A Con số | 1 PHÚT · TỚI SIÊU THỊ & BỆNH VIỆN | "Một phút tới siêu thị, một phút tới bệnh viện." |
| B Nhu cầu | 17 PHÚT · TỚI KHU CÔNG NGHỆ CAO | "Làm ở Khu Công nghệ cao? Về nhà chỉ mười bảy phút." |
| C Tình huống | NỬA ĐÊM CON SỐT? · BỆNH VIỆN CÁCH 1 PHÚT | "Nửa đêm con sốt? Bệnh viện chỉ cách một phút." |
| D So sánh (chỉ khi giá có nguồn) | CÁCH <khu đắt> <N> PHÚT · GIÁ <mức> | "Cách <khu> <N> phút, giá chỉ <mức>." |

Dòng 1 ≤ 16 ký tự, dòng 2 ≤ 28, dòng 3 = "TÊN DỰ ÁN · CĐT · NHẬN NHÀ <quý/năm>". Câu nói ≤ 10 từ, cùng ý với chữ. Mỗi câu móc ghi `hookPoi` = tiện ích chứng minh (tuyến + ảnh hiện ở khung đầu).
5. Chấm 6 tiêu chí, bỏ câu trượt tiêu chí 1: (1) đúng, có số đo hoặc nguồn; (2) có con số hoặc tình huống cụ thể; (3) tắt tiếng vẫn hiểu trong 2 giây; (4) khung đầu thấy bằng chứng; (5) đối thủ gần đó không nói được; (6) nói nhu cầu, không gọi nhóm người ("dành cho gia đình trẻ"). Chọn sẵn câu đạt nhiều nhất.
6. Khung đầu: `hookBg:'map'` (mặc định). `hookBg:'hero'` chỉ khi câu móc nói về chính dự án (thiết kế, tầm nhìn, quy mô).

## 5. Ảnh tiện ích (2 ảnh mỗi tiện ích)""")

e("""- `script.json`: `{"voice":"vi-VN-NamMinhNeural", "brand":true, "intro", "pois":[1 câu mỗi tiện ích, đúng thứ tự CFG], "outro"}`. Giọng nữ: `vi-VN-HoaiMyNeural`. `brand:false` khi `brandMode:'none'`.""",
  """- `script.json`: `{"engine":"vieneu", "voice":"Đức Trí", "brand":true, "intro", "pois":[1 câu mỗi tiện ích, đúng thứ tự CFG], "outro"}`. Giọng: Đức Trí (nam, mặc định) · Adam (nam) · Thục Đoan (nữ), đều miền Nam. Giọng Edge: `"engine":"edge"`, `vi-VN-NamMinhNeural` / `vi-VN-HoaiMyNeural`. `brand:false` khi `brandMode:'none'`.""")

e("""- `intro` ≤ 16 từ: mở bằng nội dung câu móc (vd "Một phút tới bệnh viện, siêu thị!"), rồi tên dự án + điểm mạnh vị trí. Mỗi câu tiện ích ≤ 14 từ: tên + km hoặc phút xe máy + lợi ích. `outro` ≤ 16 từ: tiến độ hoặc điểm nhấn + lời mời. Số đọc bằng chữ, khớp số liệu ("ba phẩy bốn ki lô mét", "khoảng năm phút").""",
  """- Lời đọc kể theo khung truyện (bước 4b), không liệt kê:
  - `intro`: câu nói 3 giây của câu móc + 1 câu dẫn vào khung truyện (vd "Đây là một ngày sống ở Green Skyline.").
  - `pois`: xếp lại `pois` trong CFG theo khung truyện. Mỗi câu ≤ 14 từ = [mốc giờ / tình huống] + [con số] + [việc làm được] (vd "Bảy giờ sáng, con tới Làng Đại học chỉ mười phút xe máy." · "Nửa đêm con sốt? Bệnh viện Hoàn Mỹ ngay sát bên."). Câu sau nối câu trước (sáng → chiều → cuối tuần; gần → xa). Xưng "bạn".
  - `outro`: nhắc lại thông điệp chính + mời 1 việc cụ thể (vd "Tiện trong một phút, đi làm dưới hai mươi phút. Green Skyline, mời bạn xem nhà thật!"); tên tiếng Anh không đặt cuối câu.
  - `pois[].tag` ≤ 20 ký tự theo mạch truyện (vd "7:00 · CON ĐI HỌC", "NỬA ĐÊM · KHI CẦN") — hiện trên thẻ thay tên loại.
  - Bỏ từ rỗng khi không kèm số: đẳng cấp, hàng đầu, thuận tiện, tiện lợi, dễ dàng, nhanh chóng, lý tưởng, tuyệt vời, sầm uất. Không nói điều chưa kiểm được ("không kẹt xe", giá, quy hoạch không nguồn).
  - Số đọc bằng chữ, khớp số liệu ("mười bảy phút", "ba phẩy bốn ki lô mét").""")

e("""- Đọc chuẩn từ nước ngoài: tts.py có sẵn cách đọc cho TBS, AVI, metro, Green, Skyline, Park, City, Mall…; tên tiếng Anh khác (tên dự án, TTTM, thương hiệu) → thêm vào `script.json` `"say": {"<chữ gốc>": "<cách đọc theo âm tiếng Việt, cách nhau dấu cách>"}` (vd "Green Skyline": "Grin Xờ cai lai"). Phụ đề giữ chữ gốc.""",
  """- Tên tiếng Anh: VieNeu đọc thẳng; tts.py tự nghe lại từng câu có tên tiếng Anh bằng whisper, sai thì đọc lại (tối đa 3 lần). Giọng Edge: tts.py có sẵn cách đọc cho TBS, AVI, metro, Green, Skyline, Park, City, Mall…; tên khác → `"say": {"<chữ gốc>": "<cách đọc theo âm tiếng Việt>"}` (vd "Green Skyline": "Grin Xờ cai lai"). Phụ đề giữ chữ gốc.""")

e("""- `python3 $M/scripts/tts.py .` → `voice.mp3`, `words.json` (độ dài cảnh tự tính; ngữ điệu "song-dong" đổi cao độ, tốc độ theo từng câu). `ok:false` + `long` → rút gọn đúng câu đó, chạy lại; không tăng tốc giọng.""",
  """- `python3 $M/scripts/tts.py .` (≈ 1,5 phút) → `voice.mp3`, `words.json` (độ dài cảnh tự tính, mốc phụ đề theo từng từ), in `engine`. Ra `"engine":"edge"` khi muốn VieNeu → lệnh cài nền ở bước 0 chưa xong: chờ rồi chạy lại. `warn` có tên chưa nghe đúng → thêm `say` cho tên đó. `ok:false` + `long` → rút gọn đúng câu đó, chạy lại; không tăng tốc giọng. Cảnh mở, cảnh kết đọc tối đa 6,6 giây.""")

e(""" "pois":[{"cat":"","name":"","lat":0,"lon":0,"icon":"airport","photo":"img/p1_A.jpg"}],""",
  """ "pois":[{"cat":"","name":"","lat":0,"lon":0,"icon":"airport","photo":"img/p1_A.jpg","tag":"7:00 · CON ĐI HỌC"}],""")

e(""" "hook":["1 PHÚT","TỚI BỆNH VIỆN & SIÊU THỊ","TÊN DỰ ÁN · CĐT · NHẬN NHÀ Q4/2026"]}""",
  """ "hook":["1 PHÚT","TỚI SIÊU THỊ & BỆNH VIỆN","TÊN DỰ ÁN · CĐT · NHẬN NHÀ Q4/2026"], "hookBg":"map", "hookPoi":3}""")

e("""`poiDur`, `introDur`, `outroDur` tự lấy từ `words.json`.""",
  """`pois` xếp theo khung truyện; `hookPoi` = chỉ số (từ 0) của tiện ích chứng minh câu móc. `poiDur`, `introDur`, `outroDur` tự lấy từ `words.json`.""")

e("""Khung 0 giây phải sáng, rõ, câu móc đọc được ngay; không đạt → đổi ảnh `hero.intro` hoặc rút ngắn câu móc.""",
  """Khung 0 giây: chữ đọc được ngay, thấy ghim dự án, ghim + ảnh tiện ích chứng minh; không đạt → rút ngắn câu móc hoặc đổi `hookPoi`.
   3 câu móc: mỗi phương án X `mlv.py run cfg.json --out hk<X> --frames 0 --set res=720 --set hookPoi=<i> --set 'hook=["…","…","…"]'` (phương án phối cảnh thêm `--set hookBg=hero`) → `mlv.py compose hooks.jpg "hkA/frame_<khung>_0.jpg|A · <kiểu>" … --h 640`, xem 1 lần.""")

e("""Giọng (Nam · Nữ · Không giọng)""", """Giọng (Đức Trí – nam · Adam – nam · Thục Đoan – nữ · Edge nam · Edge nữ · Không giọng)""")

e("""Dưới bảng: ảnh so sánh độ sáng.""",
  """Dưới bảng: ảnh so sánh độ sáng.
2b. **Câu chuyện và câu móc** — dòng "Khung truyện: <tên> · Thông điệp: <1 câu>" + ô chọn khung (4 khung ở bước 4b); dòng "Khách chính · Điểm khác biệt · Đối thủ" kèm nguồn; bảng `Phương án | Kiểu | Chữ trên hình | Câu nói 3 giây | Cảnh chứng minh | Đạt (x/6)` + ô chọn phương án (chọn sẵn phương án đạt nhiều nhất); ảnh `hooks.jpg`.""")

e("""`# | Cảnh | Loại | Cự ly (xe máy) | Lời đọc | Ảnh | Giữ | Nguồn ảnh`""", """`# | Cảnh | Loại | Nhãn thẻ | Cự ly (xe máy) | Lời đọc | Ảnh | Giữ | Nguồn ảnh`""")

e("""· câu móc (2–3 phương án) · ảnh mở đầu (mô tả bằng chữ).""",
  """· câu móc (3 phương án, tả khung đầu bằng chữ, nêu điểm x/6) · khung truyện (chọn sẵn + 1 dự phòng).""")

e("""2. Áp vào CFG: Câu móc → `hook` (+ câu đầu của `script.intro`) · """,
  """2. Áp vào CFG: Câu móc → `hook`, `hookPoi`, `hookBg` (+ câu đầu của `script.intro`) · Khung truyện đổi → viết lại lời đọc, xếp lại `pois`, `tag` theo bước 4b · """)

e("""Giọng → `script.voice` hoặc bỏ `voice` + `captions:false`""", """Giọng → `script.engine` + `script.voice`, hoặc bỏ `voice` + `captions:false`""")

e("""- Kịch bản: 3 giây đầu ảnh phối cảnh toàn khung + câu móc (không màn logo, không phụ đề) → bản đồ:""",
  """- Kịch bản: 3 giây đầu cảnh bản đồ của tiện ích chứng minh câu móc (tuyến, ảnh, nhãn) + câu móc, đẩy zoom 0,5 giây, tiếng "pop" (không màn logo, không phụ đề; `hookBg:'hero'` → ảnh phối cảnh) → chớp trắng sang bản đồ:""")

e("""- Không làm mờ nền (`bgBlur` 0). Khung hình đầu tiên phải sáng, rõ, có câu móc đọc được ngay.""",
  """- Không làm mờ nền (`bgBlur` 0). Khung hình đầu tiên phải sáng, rõ, có câu móc đọc được ngay.
- Lời đọc, câu móc chỉ nói điều kiểm được (số đo, nguồn). Giọng VieNeu: chỉ dùng giọng có sẵn; không nhân bản giọng người thật khi chưa có đồng ý bằng văn bản.""")

out = src
for x in E:
    n = out.count(x["old_string"])
    if n != 1:
        sys.exit(f"{n}x: {x['old_string'][:80]!r}")
    out = out.replace(x["old_string"], x["new_string"])
Path(sys.argv[2]).write_text(out, encoding="utf-8")
Path(sys.argv[2] + ".edits.json").write_text(json.dumps(E, ensure_ascii=False), encoding="utf-8")
print("ok", len(E), "edits", len(src.splitlines()), "->", len(out.splitlines()), "lines")
