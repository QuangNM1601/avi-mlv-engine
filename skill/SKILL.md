---
name: map-location-video
description: "Làm video vị trí và kết nối dự án bất động sản trên ảnh vệ tinh Esri nghiêng 3D, 2 giai đoạn: (1) gõ tên dự án → tự nghiên cứu (CĐT, quy mô, tiến độ), tọa độ Google Maps, thương hiệu dự án (màu, font, logo), tiện ích + km/phút, 2 ảnh web mỗi tiện ích, lời đọc → storyboard Claude Docs để sửa lời, chọn ảnh, độ sáng, tên đường; (2) nhắn 'dựng' → MP4 9:16 / 1:1 / 16:9 có giọng đọc, phụ đề, nhạc, ảnh tiện ích bật cạnh ghim, logo AVI ở góc và khung kết, gửi vào chat. Chạy hết trên workspace của Claude. Không dùng cho mô phỏng thi công metro."
---

# Video vị trí dự án trên ảnh vệ tinh — AVI Realty (v3.1)

Giai đoạn 1: nghiên cứu + storyboard trên Claude Docs để người dùng sửa. Giai đoạn 2: dựng MP4 theo storyboard đã sửa. Mọi lệnh chạy trên workspace của Claude; không cần máy người dùng, không dùng trình duyệt tích hợp.

Không hỏi trước khi làm. Mặc định: 1:1 · nhạc Năng động · giọng nam · thương hiệu Dự án + AVI · độ sáng 1 · tên đường bật · phụ đề bật · 1080p. Người dùng đổi trên storyboard. Thiếu dữ kiện → ghi "cần xác nhận" trên storyboard, không dừng lại hỏi.

Không chép mã engine, script hay trang web thô vào hội thoại; chỉ đọc dòng JSON các lệnh in ra.

## Ngân sách
- Giai đoạn 1: ≤ 3 lượt tìm web + trang web dự án; `poi` 1 lần; 2 ảnh mỗi tiện ích; xem ảnh 3 lần (logo, lưới ảnh tiện ích, tờ khung hình); 1 doc.
- Giai đoạn 2: đọc doc 1 lần, dựng 1 lần; chỉ xem khung khi `viol` > 0.
- Dự án đã có storyboard → dùng lại doc đó, chỉ đổi phần người dùng yêu cầu, sang giai đoạn 2.

## 0. Chuẩn bị (mỗi phiên)
```bash
M=~/mlv; [ -d $M ] || git clone -q https://github.com/QuangNM1601/avi-mlv-engine $M; git -C $M fetch -q origin; git -C $M checkout -q 92065cb687aba9f816e045702ac032f0c436be7a
python3 -c "import edge_tts" 2>/dev/null || pip install -q --break-system-packages edge-tts
for h in server.arcgisonline.com router.project-osrm.org www.bing.com www.google.com; do printf "%s " $h; curl -s -o /dev/null -m 10 -w "%{http_code}\n" https://$h/; done
```
- Host nào ra `000` → workspace chưa mở mạng: dừng, nhắn người dùng: "Vào claude.ai → Settings → Capabilities, cho phép workspace truy cập mọi tên miền (All domains), rồi mở cuộc trò chuyện mới và gọi lại skill."
- Thư mục làm việc `~/mlv-work/<slug>/` (`<slug>` = tên dự án không dấu, nối gạch). Mọi lệnh `python3 $M/scripts/mlv.py …` chạy trong thư mục này.

# GIAI ĐOẠN 1 — Nghiên cứu và storyboard

## 1. Hồ sơ dự án
- Có hồ sơ "00-thong-so-du-an" (skill real-estate-project-research) trong Project hoặc Drive → đọc, không tìm lại.
- Chưa có → ≤ 3 lượt WebSearch, mở trang chính thức của dự án + ≤ 1 trang tin (WebFetch). Ghi: `name`, `developer`, `address`, `scale` (ha, số căn, số tháp), `status` (tiến độ), `website`, `sources` (≤ 3 link).
- Hạ tầng chưa xong (metro, cầu, cao tốc) chỉ dùng khi có nguồn ≤ 12 tháng, ghi "theo quy hoạch".

## 2. Tọa độ dự án
- Người dùng gửi link Google Maps → `mlv.py gmaps "<link>"`. Không có → `mlv.py gmaps "<tên dự án>, <phường/xã>, <tỉnh/thành>"`.
- Lỗi → `mlv.py geo "<tên dự án>, <quận>" --near LAT,LON` (tọa độ gần đúng của quận). Vẫn không chắc → dùng kết quả tốt nhất, ghi "cần xác nhận".

## 3. Thương hiệu dự án
- `mlv.py brand <website dự án> --out brand` → `{name, primary, accent, colors, font, logoFile, fontFile}`.
- Màu trông sai (đỏ cảnh báo, xám) → chọn màu khác trong `colors`. Xem `brand/logo.png` 1 lần; méo, bị cắt hoặc không phải logo → bỏ logo.
- Có logo → `brandMode:'project'` (dự án là chính; logo AVI ở góc và khung kết), `marker:'logo'`. Không có website hoặc logo → `brandMode:'avi'`, `marker:'pin'`.
- CFG `brand`: `{name, primary, accent, font, logo:'brand/logo.png', fontUrl:'brand/font.woff2' (khi có fontFile), website}`.
- Người dùng gửi logo PNG hoặc ảnh phối cảnh → lưu vào thư mục làm việc, `marker:'logo'`, `markerUrl:'<file>'`. `role` (vd "Đại lý phân phối") chỉ ghi khi người dùng xác nhận.

## 4. Tiện ích và cự ly
1. Địa danh đã lưu: `git -C $M show origin/main:data/landmarks.json` → có sẵn thì dùng tọa độ đó.
2. `mlv.py poi LAT LON --km 3 --dist` (ngoại thành `--km 8`) → ≤ 20 ứng viên `{cat, name, lat, lon, km, min}`. Chỉ chạy 1 lần mỗi dự án.
3. Điểm lớn ngoài bán kính (sân bay, trung tâm, ga metro, KCN lớn) chưa có trong landmarks → `mlv.py gmaps "<tên 1>, <tỉnh>" "<tên 2>, <tỉnh>"`, ghi `pois.json`, rồi `mlv.py dist LAT LON --pois pois.json`.
4. Chọn 4–6 điểm: mỗi loại ≤ 2, ưu tiên có tiếng và gần; bỏ phòng khám nhỏ, trường mầm non. Loại: Y TẾ · MUA SẮM · KẾT NỐI · GIÁO DỤC · CÔNG VIÊN · HÀNH CHÍNH · THỂ THAO · KCN. Sân bay thêm `icon:'airport'`.
5. `poi` lỗi → 1 lượt WebSearch "tiện ích gần <dự án>", lấy 4–6 tên → `gmaps` → `dist`.

## 5. Ảnh tiện ích (2 ảnh mỗi tiện ích)
1. Tuần tự với từng tiện ích i: `mlv.py images "<tên tiện ích> <tỉnh/thành>" --out img --prefix p<i> --n 2` → `img/p<i>_A.jpg`, `img/p<i>_B.jpg`, mỗi ảnh kèm `img` (URL ảnh) và `page` (trang nguồn).
2. Thiếu ảnh → thử 1 từ khóa khác (tên tiếng Anh, tên viết tắt). Vẫn thiếu → tiện ích đó không ảnh.
3. `mlv.py compose img/grid.jpg "img/p1_A.jpg|1A" "img/p1_B.jpg|1B" … --cols 4 --h 300`, xem 1 lần. Chọn mỗi tiện ích 1 ảnh: đúng địa điểm, sáng, không chữ, logo hay watermark lớn, không người cận mặt. Cả 2 không đạt → không ảnh.

## 6. Lời đọc và giọng
- `script.json`: `{"voice":"vi-VN-NamMinhNeural", "brand":true, "intro", "pois":[1 câu mỗi tiện ích, đúng thứ tự CFG], "outro"}`. Giọng nữ: `vi-VN-HoaiMyNeural`. `brand:false` khi `brandMode:'none'`.
- `intro` ≤ 18 từ: tên dự án + CĐT hoặc quy mô + điểm mạnh vị trí. Mỗi câu tiện ích ≤ 14 từ: tên + km hoặc phút + lợi ích. `outro` ≤ 18 từ: tiến độ hoặc điểm nhấn + mời nhận bảng giá. Số đọc bằng chữ, khớp số liệu ("ba phẩy bốn ki lô mét", "khoảng năm phút").
- `python3 $M/scripts/tts.py .` → `voice.mp3`, `words.json` (độ dài cảnh tự tính). `ok:false` + `long` → rút gọn đúng câu đó, chạy lại; không tăng tốc giọng.

## 7. CFG và khung hình mẫu
`cfg.json` (đường dẫn cục bộ, tương đối với thư mục làm việc):
```json
{"name":"", "area":"PHƯỜNG · TỈNH", "intro":["DÒNG 1","DÒNG 2"], "subtitle":"quy mô · CĐT", "tagline":"≤ 4 loại tiện ích",
 "hotline":"0965.909.339", "project":{"lat":0,"lon":0},
 "pois":[{"cat":"","name":"","lat":0,"lon":0,"icon":"airport","photo":"img/p1_A.jpg"}],
 "formats":["1:1"], "music":"nang-dong", "marker":"logo", "res":1080,
 "brandMode":"project", "brand":{}, "voice":{"url":"voice.mp3","wordsUrl":"words.json"}, "captions":true, "bright":1, "roads":true}
```
`poiDur`, `introDur`, `outroDur` tự lấy từ `words.json`.
1. `mlv.py run cfg.json --out sb --frames auto --set res=720` → khung mở, 1 khung mỗi tiện ích, khung kết (`times` theo thứ tự đó).
2. Kiểm tra `summary`: `map` = "Esri World Imagery (vệ tinh)", `tiles.failed` = 0, `out[].viol` = 0, `photos` = số ảnh đã chọn, `warn` rỗng. `viol` > 0 → xem khung lỗi, sửa (tên ngắn hơn, bỏ điểm sát nhau), chạy lại.
3. So độ sáng: `mlv.py run cfg.json --out sb05 --frames "<times[1]>" --set res=720 --set bright=0.5`.
4. Ghép: mỗi tiện ích `mlv.py compose sb/c<i>.jpg "sb/frame_1x1_<t>.jpg|Cảnh <i>" "img/p<i>_A.jpg|A" "img/p<i>_B.jpg|B" --h 420`; độ sáng `mlv.py compose sb/sang.jpg "sb05/frame_…|Sáng 0,5" "sb/frame_…|Sáng 1" --h 420`. Xem 1 tờ tổng (`compose` các khung `--cols 4`) trước khi đưa lên doc.

## 8. Storyboard trên Claude Docs
Làm theo hướng dẫn của docs connector (`guide` topic.index, topic.uploads). Tên doc: "Storyboard video vị trí — <Dự án>". Mục:
1. Câu đầu: "<n> cảnh · <T> giây · <khung>. Sửa lời đọc, chọn ảnh, đổi thiết lập ngay trên doc rồi nhắn **dựng**."
2. **Thiết lập** — bảng `Mục | Chọn`; mỗi dòng 1 enum + 1 ô chọn (dropdown), chọn sẵn mặc định:
   Khung hình (1:1 · 9:16 · 16:9 · 1:1 + 9:16 · Cả 3) · Nhạc (Năng động · Sang trọng · Không nhạc) · Giọng (Nam · Nữ · Không giọng) · Thương hiệu (Dự án + AVI · Chỉ AVI · Chỉ dự án · Không) · Độ sáng ảnh vệ tinh (0,5 · 1) · Tên đường (Bật · Tắt) · Phụ đề (Bật · Tắt). Dưới bảng: ảnh so sánh độ sáng.
3. **Kịch bản** — bảng 1 dòng mỗi cảnh: `# | Cảnh | Loại | Cự ly | Lời đọc | Ảnh | Giữ | Nguồn ảnh`. `Ảnh` = ô chọn (A · B · Không ảnh), chọn sẵn ảnh đã chọn ở bước 5; `Giữ` = ô chọn (Giữ · Bỏ); `Nguồn ảnh` = `[A](page) · [B](page)`. Cảnh mở, cảnh kết: `Ảnh` "—", `Giữ` "Giữ" (chữ thường).
4. **Hình từng cảnh** — mỗi cảnh 1 dòng "Cảnh i — <tên> · <km> km · <phút> phút" + ảnh ghép [khung | A | B]; cảnh mở, cảnh kết: khung hình.
5. **Hồ sơ dự án** — bảng: CĐT, địa chỉ, tọa độ + nguồn, quy mô, tiến độ, màu, font, logo (ảnh).
6. **Dữ liệu dựng** — khối ```json: `{slug, project, cfg (bỏ voice; pois[].photoSrc = {A:{img,page}, B:{img,page}}), brand (thêm site), script}` để giai đoạn 2 dựng lại khi workspace đã mất.
7. **Nguồn** — link đã mở.

Thứ tự: tạo doc (khung mục) → điền từng mục → tải ảnh sau cùng: Artifact publish `asset:true`, `file_paths` = mọi ảnh ghép + logo, `url` = link doc → 1 `batch` tạo blob → 1 `update` chèn `![…](blob/<id>)` sau từng dòng chú thích.
Kết thúc: 1 dòng "Storyboard đã xong: sửa lời đọc ở bảng Kịch bản, chọn ảnh A/B, đổi thiết lập; xong nhắn **dựng**." Giữ nguyên thư mục làm việc.

# GIAI ĐOẠN 2 — Dựng chính thức
Bắt đầu khi người dùng nhắn "dựng" / "duyệt" (hoặc gửi link storyboard + "dựng").
1. Đọc doc (`mcp__Claude_Docs__read`, nạp schema qua ToolSearch): bảng Thiết lập, bảng Kịch bản, khối Dữ liệu dựng. Thư mục làm việc còn → dùng. Mất → bước 0, tạo lại `cfg.json`, `script.json` từ khối dữ liệu (`photo` = URL `img` của ảnh đã chọn, tự tải khi `run`), chạy lại `mlv.py brand`.
2. Áp vào CFG: Khung hình → `formats` · Nhạc → `music` (`nang-dong` | `sang-trong` | `none`; nhạc riêng người dùng gửi và xác nhận có quyền → `ffmpeg -i in -t 60 -ac 2 -b:a 128k music.mp3`, `music:{url:'music.mp3'}`) · Giọng → `script.voice` hoặc bỏ `voice` + `captions:false` · Thương hiệu → `brandMode` (`project` | `avi` | `project-only` | `none`) · Độ sáng → `bright` · Tên đường → `roads` · Phụ đề → `captions` · cảnh "Bỏ" → xóa khỏi `pois` và `script.pois` · Ảnh A / B / Không ảnh → `pois[].photo` · lời đọc đã sửa → `script.json`.
3. Lời đọc, giọng hoặc số cảnh đổi → chạy lại `tts.py`.
4. `mlv.py run cfg.json --out out --video` chạy nền (`run_in_background`, timeout 40 phút); chờ thông báo, không thăm dò.
5. Kiểm tra như bước 7.2, thêm: `out[].audio` có tiếng; `routes[].est` = "chim bay" → báo người dùng; `fetchWarn` → ảnh nào không tải được.
6. SendUserFile từng MP4 (`<slug>_1x1.mp4`, …). Máy người dùng đã liên kết → ghi thêm vào `~/Videos/map-video/<slug>/`.
7. Địa danh lớn mới (sân bay, ga, TTTM, bệnh viện lớn, KCN, sân golf) → thêm vào `data/landmarks.json`: add_repo `QuangNM1601/avi-mlv-engine` (push), commit, push. Không có quyền ghi → bỏ qua.
8. Báo 1–2 dòng: khung, độ dài, dung lượng, lưu ý.
9. Talking head (người dùng gửi video môi giới nói): `node $M/scripts/merge_th.mjs out/<slug>_9x16.mp4 <talking.mp4> [--open 0-5] [--close a-b|none]` → gửi `<…>_th.mp4` (talking head mở → bản đồ → talking head chốt, −14 LUFS). Chỉ nhận video người xuất hiện đã đồng ý dùng cho quảng cáo.

## Quy tắc giữ nguyên
- Kịch bản: logo mở đầu → tên dự án + dòng phụ → logo dự án tại ghim → mỗi tiện ích `poiDur` giây (5,5–9), ảnh tiện ích bật cạnh ghim từ giây 3,5 của cảnh → khung kết (tên dự án, số tiện ích + bán kính, logo AVI, hotline, website). Cảnh mở, kết dài theo giọng (3–8 giây).
- Nhạc: chỉ nhạc tự tạo của engine hoặc file người dùng có quyền sử dụng; có giọng thì nhạc tự hạ. Chuẩn −14 LUFS.
- Logo AVI Realty luôn trên nền kem, không đổi màu, không kéo méo. Thương hiệu dự án chỉ dùng khi AVI là đại lý được ủy quyền.
- Ảnh tiện ích lấy từ web để minh họa vị trí; trước khi chạy quảng cáo trả phí, kiểm tra quyền dùng ảnh theo cột Nguồn ảnh.
- Dòng "Ảnh vệ tinh: Esri, Maxar · Đường: © OpenStreetMap · Số liệu ước tính" luôn hiện; chỉ xóa khi người dùng yêu cầu rõ. Quảng cáo thương mại: nhắc kiểm tra điều khoản ảnh Esri.
- km/phút là đường lái xe OSRM, mang tính ước tính.
- Overpass, Photon, Nominatim, Google, Bing: gọi tuần tự, không tự viết vòng gọi song song, không gọi `poi` lặp lại.
- Không sao chép thương hiệu, tên kênh, watermark của video mẫu người khác.
- Bố cục, vùng an toàn, đặt nhãn, ảnh tiện ích nằm trong engine. Đổi thì sửa engine trong repo, tăng phiên bản, cập nhật mã commit ở bước 0.
