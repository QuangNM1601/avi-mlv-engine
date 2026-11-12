---
name: "map-location-video"
description: "Làm video vị trí và kết nối dự án bất động sản trên ảnh vệ tinh Esri nghiêng 3D, 2 giai đoạn: (1) gõ tên dự án → tự nghiên cứu (CĐT, quy mô, tiến độ, hạ tầng, giá và đối thủ), tọa độ Google Maps, thương hiệu, tiện ích + km/phút xe máy, 2 ảnh mỗi tiện ích, khung truyện + 3 câu móc có khung đầu, lời đọc kể chuyện → storyboard Claude Docs, hỏi từng vấn đề rồi sửa; (2) nhắn 'dựng' → MP4 9:16 / 1:1 / 16:9 mở bằng cảnh bản đồ chứng minh câu móc, giọng VieNeu miễn phí, phụ đề, nhạc, logo AVI ở góc và khung kết, gửi vào chat. Chạy hết trên workspace của Claude. Không dùng cho mô phỏng thi công metro."
---

# Video vị trí dự án trên ảnh vệ tinh — AVI Realty (v3.5)

Giai đoạn 1: nghiên cứu + storyboard trên Claude Docs để người dùng sửa. Giai đoạn 2: dựng MP4 theo storyboard đã sửa. Mọi lệnh chạy trên workspace của Claude; không cần máy người dùng, không dùng trình duyệt tích hợp.

Không hỏi trước khi làm. Mặc định: 1:1 · nhạc Năng động · giọng VieNeu "Đức Trí" (nam, miền Nam) · thương hiệu Dự án + AVI · độ sáng 1 · tên đường bật · phụ đề bật · lời đọc kể chuyện theo 1 khung truyện · 3 giây đầu là cảnh bản đồ chứng minh câu móc (tuyến + ảnh tiện ích) + câu móc, cảnh kết có ảnh phối cảnh sau thẻ hotline · cự ly xe máy · 1080p. Thiếu dữ kiện → ghi "cần xác nhận" trên storyboard, hỏi ở bước 9 (sau khi có storyboard). Trả lời người dùng bằng tiếng Việt.

Không chép mã engine, script hay trang web thô vào hội thoại; chỉ đọc dòng JSON các lệnh in ra.

## Ngân sách
- Giai đoạn 1: ≤ 3 lượt tìm web dự án + 1 lượt tìm hạ tầng + 1 lượt tìm giá và đối thủ + trang web dự án; `gpoi` 1 lần, `poi` 1 lần; 2 ảnh mỗi tiện ích; xem ảnh 5 lần (logo, lưới ảnh phối cảnh, lưới ảnh tiện ích, tờ 3 câu móc, tờ khung hình) + 1 lần sau khi sửa theo câu trả lời; 1 doc.
- Giai đoạn 2: đọc doc 1 lần, dựng 1 lần; chỉ xem khung khi `viol` > 0.
- Dự án đã có storyboard → dùng lại doc đó, chỉ đổi phần người dùng yêu cầu, sang giai đoạn 2.

## 0. Chuẩn bị (mỗi phiên)
```bash
M=~/mlv; [ -d $M ] || git clone -q https://github.com/QuangNM1601/avi-mlv-engine $M; git -C $M fetch -q origin; git -C $M checkout -q 24f434549d3a77d78fc2c9b9e49bd00a3c707082
python3 -c "import edge_tts, faster_whisper" 2>/dev/null || pip install -q --break-system-packages edge-tts faster-whisper
for h in server.arcgisonline.com router.project-osrm.org www.bing.com www.google.com; do printf "%s " $h; curl -s -o /dev/null -m 10 -w "%{http_code}\n" https://$h/; done
```
- Host nào ra `000` → workspace chưa mở mạng: dừng, nhắn người dùng: "Vào claude.ai → Settings → Capabilities, cho phép workspace truy cập mọi tên miền (All domains), rồi mở cuộc trò chuyện mới và gọi lại skill."
- Thư mục làm việc `~/mlv-work/<slug>/` (`<slug>` = tên dự án không dấu, nối gạch). Mọi lệnh `python3 $M/scripts/mlv.py …` chạy trong thư mục này.
- Giọng VieNeu (miễn phí, Apache-2.0, chạy CPU): cài nền ngay (`run_in_background`, ≈ 3 phút, 1 lần mỗi phiên): `[ -x ~/mlv-tts/bin/python ] || { python3 -m venv ~/mlv-tts && ~/mlv-tts/bin/pip install -q vieneu "onnxruntime==1.22.1"; }`. Lỗi → bỏ qua, tts.py tự dùng giọng Edge.

# GIAI ĐOẠN 1 — Nghiên cứu và storyboard

## 1. Hồ sơ dự án
- Có hồ sơ "00-thong-so-du-an" (skill real-estate-project-research) trong Project hoặc Drive → đọc, không tìm lại.
- Chưa có → ≤ 3 lượt WebSearch, mở trang chính thức của dự án + ≤ 1 trang tin (WebFetch). Ghi: `name`, `developer`, `address`, `scale` (ha, số căn, số tháp), `status` (tiến độ), `website`, `sources` (≤ 3 link).
- Hạ tầng: 1 lượt WebSearch riêng "hạ tầng giao thông <phường/tuyến đường cạnh dự án> <năm hiện tại>". Hạng mục chưa xong (metro, cầu, cao tốc, nút giao) chỉ dùng khi có nguồn ≤ 12 tháng, ghi "theo quy hoạch"; đưa lên storyboard để hỏi ở bước 9.

## 2. Tọa độ dự án
- Người dùng gửi link Google Maps → `mlv.py gmaps "<link>"`. Không có → `mlv.py gmaps "<tên dự án>, <phường/xã>, <tỉnh/thành>"`.
- Lỗi → `mlv.py geo "<tên dự án>, <quận>" --near LAT,LON` (tọa độ gần đúng của quận). Vẫn không chắc → dùng kết quả tốt nhất, ghi "cần xác nhận".

## 3. Thương hiệu dự án
- `mlv.py brand <website dự án> --out brand` → `{name, primary, accent, colors, font, logoFile, fontFile, logos, plate?}` (đọc CSS: màu theo tần suất, bỏ màu mặc định thư viện; font chính + file; logo nhìn rõ nhất trên nền trắng; chỉ mở trang khi không thấy logo).
- Màu trông sai (đỏ cảnh báo, xám) → chọn màu khác trong `colors`. Xem `brand/logo.png` 1 lần; méo, bị cắt hoặc không phải logo → chọn file khác trong `logos` hoặc bỏ logo. Có `plate` (logo trắng) → CFG `brand.plate` = giá trị đó.
- Có logo → `brandMode:'project'` (dự án là chính; logo AVI ở góc và khung kết), `marker:'logo'`. Không có website hoặc logo → `brandMode:'avi'`, `marker:'pin'`.
- CFG `brand`: `{name, primary, accent, font, logo:'brand/logo.png', fontUrl:'brand/font.woff2' (khi có fontFile), website}`.
- Người dùng gửi logo PNG → lưu vào thư mục làm việc, `marker:'logo'`, `markerUrl:'<file>'`. `role` (vd "Đại lý phân phối") chỉ ghi khi người dùng xác nhận.

## 3b. Ảnh phối cảnh
- `mlv.py renders <website dự án> --out hero --n 6` → `hero/h1.jpg`… (ảnh ngang ≥ 1100 px từ img, srcset, nền CSS). Người dùng gửi ảnh phối cảnh → dùng ảnh đó trước.
- `mlv.py compose hero/grid.jpg "hero/h1.jpg|h1" … --cols 4 --h 280`, xem 1 lần. `hero.intro` = ảnh sáng nhất, trời xanh, thấy trọn các tháp, không chữ lớn; `hero.outro` = một ảnh khác (ngoại cảnh). Bỏ ảnh nền trơn, mặt bằng, nội thất. Không có ảnh đạt → bỏ `hero` (câu móc vẫn chạy trên bản đồ), ghi "cần ảnh phối cảnh".
- Câu móc làm ở bước 4b (cần cự ly). Ảnh phối cảnh dùng cho cảnh kết; cho 3 giây đầu chỉ khi câu móc nói về chính dự án.
- Ảnh phối cảnh của CĐT chỉ dùng khi AVI là đại lý được ủy quyền; ghi nguồn trên storyboard.

## 4. Tiện ích và cự ly
1. Địa danh đã lưu: `git -C $M show origin/main:data/landmarks.json` → có sẵn thì dùng tọa độ đó.
2. `mlv.py gpoi LAT LON --km 8 --per 3 --dist` (≈ 1 phút) → tiện ích nổi bật theo Google Maps cho 11 loại, xếp theo số đánh giá, kèm km/phút xe máy. Nguồn chính để chọn tiện ích; rút gọn tên dài (vd "Go" → "GO! Dĩ An").
   Bổ sung: `mlv.py poi LAT LON --km 3 --dist` (ngoại thành `--km 8`, dữ liệu OpenStreetMap) khi `gpoi` thiếu loại nào. Mỗi lệnh chạy 1 lần mỗi dự án.
   Cự ly mặc định là xe máy: tuyến không đi cao tốc, được băng qua đường (điểm đối diện = 1 phút); thời gian giao thông bình thường 25 km/h trong 8 km đầu, 30 km/h phần sau. Người dùng muốn ô tô → `--travel car` và CFG `travel:'car'`.
3. Điểm lớn ngoài bán kính (sân bay, trung tâm, ga metro, KCN lớn) chưa có trong landmarks → `mlv.py gmaps "<tên 1>, <tỉnh>" "<tên 2>, <tỉnh>"`, ghi `pois.json`, rồi `mlv.py dist LAT LON --pois pois.json`.
4. Chọn 4–6 điểm: mỗi loại ≤ 2, ưu tiên có tiếng và gần; bỏ phòng khám nhỏ, trường mầm non. Loại: Y TẾ · MUA SẮM · KẾT NỐI · GIÁO DỤC · CÔNG VIÊN · HÀNH CHÍNH · THỂ THAO · KCN. Sân bay thêm `icon:'airport'`.
5. `gpoi` và `poi` đều lỗi → 1 lượt WebSearch "tiện ích gần <dự án>", lấy 4–6 tên → `gmaps` → `dist`.

## 4b. Câu chuyện và câu móc
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

## 5. Ảnh tiện ích (2 ảnh mỗi tiện ích)
1. Tuần tự với từng tiện ích i: `mlv.py images "<tên tiện ích> <tỉnh/thành>" --place "<tên trên Google Maps>, <tỉnh/thành>" --out img --prefix p<i> --n 2` → `img/p<i>_A.jpg`, `img/p<i>_B.jpg` (ảnh địa điểm Google Maps trước, rồi Bing), mỗi ảnh kèm `img` (URL ảnh) và `page` (trang nguồn). Lưu kết quả JSON vào `img/p<i>.json`.
2. Thiếu ảnh → thử 1 từ khóa khác (tên tiếng Anh, tên viết tắt). Vẫn thiếu → tiện ích đó không ảnh.
3. `mlv.py compose img/grid.jpg "img/p1_A.jpg|1A" "img/p1_B.jpg|1B" … --cols 4 --h 300`, xem 1 lần. Chọn mỗi tiện ích 1 ảnh: đúng địa điểm, sáng, không chữ, logo hay watermark lớn, không người cận mặt. Cả 2 không đạt → không ảnh.

## 6. Lời đọc và giọng
- `script.json`: `{"engine":"vieneu", "voice":"Đức Trí", "brand":true, "intro", "pois":[1 câu mỗi tiện ích, đúng thứ tự CFG], "outro"}`. Giọng: Đức Trí (nam, mặc định) · Adam (nam) · Thục Đoan (nữ), đều miền Nam. Giọng Edge: `"engine":"edge"`, `vi-VN-NamMinhNeural` / `vi-VN-HoaiMyNeural`. `brand:false` khi `brandMode:'none'`.
- Lời đọc kể theo khung truyện (bước 4b), không liệt kê:
  - `intro`: câu nói 3 giây của câu móc + 1 câu dẫn vào khung truyện (vd "Đây là một ngày sống ở Green Skyline.").
  - `pois`: xếp lại `pois` trong CFG theo khung truyện. Mỗi câu ≤ 14 từ = [mốc giờ / tình huống] + [con số] + [việc làm được] (vd "Bảy giờ sáng, con tới Làng Đại học chỉ mười phút xe máy." · "Nửa đêm con sốt? Bệnh viện Hoàn Mỹ ngay sát bên."). Câu sau nối câu trước (sáng → chiều → cuối tuần; gần → xa). Xưng "bạn".
  - `outro`: nhắc lại thông điệp chính + mời 1 việc cụ thể (vd "Tiện trong một phút, đi làm dưới hai mươi phút. Green Skyline, mời bạn xem nhà thật!"); tên tiếng Anh không đặt cuối câu.
  - `pois[].tag` ≤ 20 ký tự theo mạch truyện (vd "7:00 · CON ĐI HỌC", "NỬA ĐÊM · KHI CẦN") — hiện trên thẻ thay tên loại.
  - Bỏ từ rỗng khi không kèm số: đẳng cấp, hàng đầu, thuận tiện, tiện lợi, dễ dàng, nhanh chóng, lý tưởng, tuyệt vời, sầm uất. Không nói điều chưa kiểm được ("không kẹt xe", giá, quy hoạch không nguồn).
  - Số đọc bằng chữ, khớp số liệu ("mười bảy phút", "ba phẩy bốn ki lô mét").
- Tên tiếng Anh: VieNeu đọc thẳng; tts.py tự nghe lại từng câu có tên tiếng Anh bằng whisper, sai thì đọc lại (tối đa 3 lần). Giọng Edge: tts.py có sẵn cách đọc cho TBS, AVI, metro, Green, Skyline, Park, City, Mall…; tên khác → `"say": {"<chữ gốc>": "<cách đọc theo âm tiếng Việt>"}` (vd "Green Skyline": "Grin Xờ cai lai"). Phụ đề giữ chữ gốc.
- `python3 $M/scripts/tts.py .` (≈ 1,5 phút) → `voice.mp3`, `words.json` (độ dài cảnh tự tính, mốc phụ đề theo từng từ), in `engine`. Ra `"engine":"edge"` khi muốn VieNeu → lệnh cài nền ở bước 0 chưa xong: chờ rồi chạy lại. `warn` có tên chưa nghe đúng → thêm `say` cho tên đó. `ok:false` + `long` → rút gọn đúng câu đó, chạy lại; không tăng tốc giọng. Cảnh mở, cảnh kết đọc tối đa 6,6 giây.
- Kiểm tra cách đọc: `python3 $M/scripts/check_voice.py voice.mp3 "<tên tiếng Anh 1>" "<tên 2>"` → tên nào `false` thì đổi `say` cho tên đó, chạy lại tts.py (tối đa 2 lần). Chỉ kiểm tra tên tiếng Anh; tên tiếng Việt hay bị nhận dạng lệch dấu, bỏ qua.

## 7. CFG và khung hình mẫu
`cfg.json` (đường dẫn cục bộ, tương đối với thư mục làm việc):
```json
{"name":"", "area":"PHƯỜNG · TỈNH", "intro":["DÒNG 1","DÒNG 2"], "subtitle":"quy mô · CĐT", "tagline":"≤ 4 loại tiện ích",
 "hotline":"0965.909.339", "project":{"lat":0,"lon":0},
 "pois":[{"cat":"","name":"","lat":0,"lon":0,"icon":"airport","photo":"img/p1_A.jpg","tag":"7:00 · CON ĐI HỌC"}],
 "formats":["1:1"], "music":"nang-dong", "marker":"logo", "res":1080,
 "brandMode":"project", "brand":{}, "voice":{"url":"voice.mp3","wordsUrl":"words.json"}, "captions":true, "bright":1, "roads":true,
 "travel":"moto", "hero":{"intro":"hero/h1.jpg","outro":"hero/h3.jpg","dur":3},
 "hook":["1 PHÚT","TỚI SIÊU THỊ & BỆNH VIỆN","TÊN DỰ ÁN · CĐT · NHẬN NHÀ Q4/2026"], "hookBg":"map", "hookPoi":3}
```
`pois` xếp theo khung truyện; `hookPoi` = chỉ số (từ 0) của tiện ích chứng minh câu móc. `poiDur`, `introDur`, `outroDur` tự lấy từ `words.json`. Điểm cần vẽ đường thẳng: `pois[].route:'line'`; cần số khác trên thẻ: `pois[].km`, `pois[].min`.
1. `mlv.py run cfg.json --out sb --frames auto --set res=720` → khung 0 giây (câu móc), khung mở, 1 khung mỗi tiện ích, khung kết (`times` theo thứ tự đó). Khung 0 giây: chữ đọc được ngay, thấy ghim dự án, ghim + ảnh tiện ích chứng minh; không đạt → rút ngắn câu móc hoặc đổi `hookPoi`.
   3 câu móc: mỗi phương án X `mlv.py run cfg.json --out hk<X> --frames 0 --set res=720 --set hookPoi=<i> --set 'hook=["…","…","…"]'` (phương án phối cảnh thêm `--set hookBg=hero`) → `mlv.py compose hooks.jpg "hkA/frame_<khung>_0.jpg|A · <kiểu>" … --h 640`, xem 1 lần.
2. Kiểm tra `summary`: `map` = "Esri World Imagery (vệ tinh)", `tiles.failed` = 0, `out[].viol` = 0, `photos` = số ảnh đã chọn, `warn` rỗng. `viol` > 0 → xem khung lỗi, sửa (tên ngắn hơn, bỏ điểm sát nhau), chạy lại. Kiểm `viol` cho mọi khung sẽ xuất: `--set 'formats=["9:16","1:1","16:9"]' --frames ""` (≈ 20 giây mỗi khung).
3. So độ sáng: `mlv.py run cfg.json --out sb05 --frames "<times[1]>" --set res=720 --set bright=0.5`.
4. Ghép: mỗi tiện ích `mlv.py compose sb/c<i>.jpg "sb/frame_1x1_<t>.jpg|Cảnh <i>" "img/p<i>_A.jpg|A" "img/p<i>_B.jpg|B" --h 420`; độ sáng `mlv.py compose sb/sang.jpg "sb05/frame_…|Sáng 0,5" "sb/frame_…|Sáng 1" --h 420`. Xem 1 tờ tổng (`compose` các khung `--cols 4`) trước khi đưa lên doc.

## 8. Storyboard trên Claude Docs
Làm theo hướng dẫn của docs connector (`guide` topic.index, topic.uploads). Tên doc: "Storyboard video vị trí — <Dự án>". Mục:
1. Câu đầu: "<n> cảnh · <T> giây · <khung>. Sửa lời đọc, chọn ảnh, đổi thiết lập ngay trên doc rồi nhắn **dựng**."
2. **Thiết lập** — bảng `Mục | Chọn`; mỗi dòng 1 enum + 1 ô chọn (dropdown), chọn sẵn mặc định:
   Khung hình (1:1 · 9:16 · 16:9 · 1:1 + 9:16 · Cả 3) · Nhạc (Năng động · Sang trọng · Không nhạc) · Giọng (Đức Trí – nam · Adam – nam · Thục Đoan – nữ · Edge nam · Edge nữ · Không giọng) · Thương hiệu (Dự án + AVI · Chỉ AVI · Chỉ dự án · Không) · Độ sáng ảnh vệ tinh (0,5 · 1) · Tên đường (Bật · Tắt) · Phụ đề (Bật · Tắt). Dưới bảng: ảnh so sánh độ sáng.
2b. **Câu chuyện và câu móc** — dòng "Khung truyện: <tên> · Thông điệp: <1 câu>" + ô chọn khung (4 khung ở bước 4b); dòng "Khách chính · Điểm khác biệt · Đối thủ" kèm nguồn; bảng `Phương án | Kiểu | Chữ trên hình | Câu nói 3 giây | Cảnh chứng minh | Đạt (x/6)` + ô chọn phương án (chọn sẵn phương án đạt nhiều nhất); ảnh `hooks.jpg`.
3. **Kịch bản** — bảng 1 dòng mỗi cảnh: `# | Cảnh | Loại | Nhãn thẻ | Cự ly (xe máy) | Lời đọc | Ảnh | Giữ | Nguồn ảnh`. `Ảnh` = ô chọn (A · B · Không ảnh), chọn sẵn ảnh đã chọn ở bước 5; `Giữ` = ô chọn (Giữ · Bỏ); `Nguồn ảnh` = `[A](page) · [B](page)`. Cảnh mở, cảnh kết: `Ảnh` "—", `Giữ` "Giữ" (chữ thường).
4. **Hình từng cảnh** — mỗi cảnh 1 dòng "Cảnh i — <tên> · <km> km · <phút> phút" + ảnh ghép [khung | A | B]; cảnh mở, cảnh kết: khung hình.
5. **Hồ sơ dự án** — bảng: CĐT, địa chỉ, tọa độ + nguồn, quy mô, tiến độ, màu, font, logo (ảnh).
6. **Dữ liệu dựng** — ghi đầy đủ `{slug, project, cfg (bỏ voice; pois[].photoSrc = {A:{img,page}, B:{img,page}}), brand (thêm site), script}` vào `assets/<slug>/storyboard.json` trong repo (add_repo push, commit, push); trên doc: link tới file đó + khối ```json rút gọn (tọa độ, tiện ích, ảnh đã chọn).
7. **Nguồn** — link đã mở.

Thứ tự: tạo doc (khung mục) → điền từng mục → tải ảnh sau cùng: Artifact publish `asset:true`, `file_paths` = mọi ảnh ghép + logo, `url` = link doc → 1 `batch` tạo blob → 1 `update` chèn `![…](blob/<id>)` sau từng dòng chú thích.

## 9. Hỏi từng vấn đề trên storyboard
Ngay sau khi doc xong, hỏi bằng AskUserQuestion, mỗi lượt ≤ 4 câu, mỗi câu tự đủ ngữ cảnh (nêu nguồn, số liệu):
1. Lượt 1: mọi mục "cần xác nhận" (tiến độ / ngày nhận nhà, địa chỉ, tọa độ) · thương hiệu (Dự án + AVI chỉ khi AVI được ủy quyền) · câu móc (3 phương án, tả khung đầu bằng chữ, nêu điểm x/6) · khung truyện (chọn sẵn + 1 dự phòng).
2. Lượt 2–3: ảnh từng cảnh — lựa chọn A / B / Không ảnh, mô tả bằng chữ nội dung từng ảnh, ghi "đang chọn sẵn".
3. Lượt cuối: giữ / thay tiện ích (thay bằng điểm nào) · khung, nhạc, giọng · lời kết.
Câu trả lời có yêu cầu mới (vd "ảnh không đặt giữa khung") → làm theo, nếu là quy tắc chung thì sửa engine. Sau đó: áp vào CFG + script.json, chạy lại tts.py và bước 7, cập nhật doc (thiết lập, kịch bản, chú thích, ảnh ghép mới), cập nhật `storyboard.json`.
Kết thúc: 1 dòng "Storyboard đã cập nhật theo câu trả lời; kiểm tra rồi nhắn **dựng**." Giữ nguyên thư mục làm việc. Chạy không người trông → bỏ bước này, giữ "cần xác nhận" trên doc.

# GIAI ĐOẠN 2 — Dựng chính thức
Bắt đầu khi người dùng nhắn "dựng" / "duyệt" (hoặc gửi link storyboard + "dựng").
1. Đọc doc (`mcp__Claude_Docs__read`, nạp schema qua ToolSearch): bảng Thiết lập, bảng Kịch bản, khối Dữ liệu dựng. Thư mục làm việc còn → dùng. Mất → bước 0, tạo lại `cfg.json`, `script.json` từ `assets/<slug>/storyboard.json` (`photo` = URL `img` của ảnh đã chọn, tự tải khi `run`), chạy lại `mlv.py brand`.
2. Áp vào CFG: Câu móc → `hook`, `hookPoi`, `hookBg` (+ câu đầu của `script.intro`) · Khung truyện đổi → viết lại lời đọc, xếp lại `pois`, `tag` theo bước 4b · Khung hình → `formats` · Nhạc → `music` (`nang-dong` | `sang-trong` | `none`; nhạc riêng người dùng gửi và xác nhận có quyền → `ffmpeg -i in -t 60 -ac 2 -b:a 128k music.mp3`, `music:{url:'music.mp3'}`) · Giọng → `script.engine` + `script.voice`, hoặc bỏ `voice` + `captions:false` · Thương hiệu → `brandMode` (`project` | `avi` | `project-only` | `none`) · Độ sáng → `bright` · Tên đường → `roads` · Phụ đề → `captions` · cảnh "Bỏ" → xóa khỏi `pois` và `script.pois` · Ảnh A / B / Không ảnh → `pois[].photo` · lời đọc đã sửa → `script.json`.
3. Lời đọc, giọng hoặc số cảnh đổi → chạy lại `tts.py` + `check_voice.py`.
4. `mlv.py run cfg.json --out out --video` (timeout 10 phút; 1080p ≈ 1,5 phút cho 1:1, ≈ 2 phút cho 9:16 mỗi 50 giây video). Nhiều khung hoặc video dài → chạy nền (`run_in_background`), chờ thông báo, không thăm dò.
5. Kiểm tra như bước 7.2, thêm: `out[].audio` có tiếng; `routes[].est` = "chim bay" → báo người dùng; `fetchWarn` → ảnh nào không tải được.
6. SendUserFile từng MP4 (`<slug>_1x1.mp4`, …). Máy người dùng đã liên kết → ghi thêm vào `~/Videos/map-video/<slug>/`.
7. Địa danh lớn mới (sân bay, ga, TTTM, bệnh viện lớn, KCN, sân golf) → thêm vào `data/landmarks.json`: add_repo `QuangNM1601/avi-mlv-engine` (push), commit, push. Không có quyền ghi → bỏ qua.
8. Báo 1–2 dòng: khung, độ dài, dung lượng, lưu ý.
9. Người dùng góp ý sau khi xem video → sửa đúng phần đó (lời, cách đọc, tiện ích, kiểu hiển thị), xem lại khung liên quan trước khi dựng, dựng lại, báo dạng "cũ → mới"; góp ý áp dụng cho mọi video → sửa engine/script trong repo + cập nhật skill.
10. Talking head (người dùng gửi video môi giới nói): `node $M/scripts/merge_th.mjs out/<slug>_9x16.mp4 <talking.mp4> [--open 0-5] [--close a-b|none]` → gửi `<…>_th.mp4` (talking head mở → bản đồ → talking head chốt, −14 LUFS). Chỉ nhận video người xuất hiện đã đồng ý dùng cho quảng cáo.

## Quy tắc giữ nguyên
- Kịch bản: 3 giây đầu cảnh bản đồ của tiện ích chứng minh câu móc (tuyến, ảnh, nhãn) + câu móc, đẩy zoom 0,5 giây, tiếng "pop" (không màn logo, không phụ đề; `hookBg:'hero'` → ảnh phối cảnh) → chớp trắng sang bản đồ: tên dự án + dòng phụ → logo dự án tại ghim → mỗi tiện ích `poiDur` giây (5,5–9), ảnh tiện ích bật cạnh ghim từ giây 3,5 của cảnh, không đặt giữa khung, không che ghim và logo dự án → khung kết: tóm tắt tuyến trên bản đồ, rồi ảnh phối cảnh phía sau thẻ (tên dự án, số tiện ích + bán kính, logo AVI, hotline, website). Cảnh mở, kết dài theo giọng (3–8 giây).
- Nhạc: chỉ nhạc tự tạo của engine hoặc file người dùng có quyền sử dụng; có giọng thì nhạc tự hạ. Chuẩn −14 LUFS.
- Logo AVI Realty luôn trên nền kem, không đổi màu, không kéo méo. Thương hiệu dự án chỉ dùng khi AVI là đại lý được ủy quyền.
- Ảnh tiện ích lấy từ web để minh họa vị trí; trước khi chạy quảng cáo trả phí, kiểm tra quyền dùng ảnh theo cột Nguồn ảnh.
- Dòng "Ảnh vệ tinh: Esri, Maxar · Đường: © OpenStreetMap · Số liệu ước tính" luôn hiện; chỉ xóa khi người dùng yêu cầu rõ. Quảng cáo thương mại: nhắc kiểm tra điều khoản ảnh Esri.
- km/phút là tuyến xe máy (OSRM hồ sơ xe đạp), thời gian giao thông bình thường, mang tính ước tính; thẻ ghi "phút xe máy".
- Không làm mờ nền (`bgBlur` 0). Khung hình đầu tiên phải sáng, rõ, có câu móc đọc được ngay.
- Lời đọc, câu móc chỉ nói điều kiểm được (số đo, nguồn). Giọng VieNeu: chỉ dùng giọng có sẵn; không nhân bản giọng người thật khi chưa có đồng ý bằng văn bản.
- Overpass, Photon, Nominatim, Google, Bing: gọi tuần tự, không tự viết vòng gọi song song, không gọi `poi` lặp lại.
- Không sao chép thương hiệu, tên kênh, watermark của video mẫu người khác.
- Bố cục, vùng an toàn, đặt nhãn, ảnh tiện ích nằm trong engine. Đổi thì sửa engine trong repo, tăng phiên bản, cập nhật mã commit ở bước 0.