# avi-mlv-engine

Engine dựng video vị trí dự án trên ảnh vệ tinh cho skill `map-location-video` của AVI Realty (xuất MP4 9:16, 16:9, 1:1).

## Bản phát hành

| Phiên bản | File | SHA-256 |
|---|---|---|
| 3.0.2 | `mlv-engine-3.0.2.js` | `0c4ce7f52c3c30fe1e4ce4cc2b88f32db20706d9d59dcd76d531b0b13c597bf1` |
| 3.0.1 | `mlv-engine-3.0.1.js` | `8fdcaf3f5bb60970e9cbe322b38c92802b4aa4a71c07b24bc1bc040824e6ea1e` |
| 3.0.0 | `mlv-engine-3.0.0.js` | `66010c903d8300f8a062d7bdecd876c3395a204bcb441fd5a86f57676ef971d5` |
| 2.2.0 | `mlv-engine-2.2.0.js` | `3dcfcab2c64352e812303ceb3191d3fa36ba1fd11c49278b5eac2426e2bed12f` |
| 2.1.0 | `mlv-engine-2.1.0.js` | `b2a61c4048df419c346b56de86c8ffb9e137e75c0bdb21d86f88b5778db1b3e5` |

Địa chỉ dùng trong skill: `https://cdn.jsdelivr.net/gh/QuangNM1601/avi-mlv-engine@<mã commit>/mlv-engine-<phiên bản>.js` (ghim theo commit, không đổi được; mã commit hiện hành ghi trong SKILL.md).

## 3.0.2
- `MLV.poi`: Overpass trước (chờ tối đa 15 giây); chỉ khi Overpass không trả gì mới gọi Photon, tuần tự 8 truy vấn cách nhau 1,1 giây, dừng sau 2 lỗi liên tiếp (tránh bị Photon chặn vì gọi dồn).
- `MLV.geo`: Photon lỗi thì tự chuyển sang Nominatim (cần quyền nominatim.openstreetmap.org).

## 3.0.1
- `MLV.poi` chạy song song Overpass (overpass-api.de, overpass.private.coffee; chờ tối đa 15 giây) và Photon (12 truy vấn theo loại, 2 luồng); gộp, bỏ trùng, lọc trong bán kính ×3. Overpass công khai thường quá tải: khi đó kết quả chỉ từ Photon. `MLV.st.poiSrc` cho biết số kết quả mỗi nguồn.
- `MLV.dist` có giới hạn chờ 15 giây.

## 3.0.0 — thêm so với 2.2.0

| API / CFG | Làm gì |
|---|---|
| `MLV.poi({lat,lon}, {km, cats, perCat, max})` | Overpass + Photon (3.0.1), trả ≤ 20 tiện ích có tên theo 8 loại: `{cat, name, lat, lon, km, kind}` |
| `MLV.dist(project, pois)` | 1 lệnh OSRM Table: gắn `km`, `min` đường lái xe, xếp theo phút (`est: "chim bay"` khi không có tuyến) |
| CFG `brandMode` | `'avi'` (mặc định, như 2.2) · `'project'` (màu, font, logo chủ đầu tư từ `brand:{name, primary, accent, font, logo, website}`) · `'none'` |
| CFG `voice:{url, wordsUrl}`, `captions`, `poiDur` | Trộn giọng đọc (nhạc tự hạ xuống), phụ đề theo `words.json`, độ dài mỗi cảnh tiện ích 5,5–9 giây |
| Loại tiện ích | 8 loại: Y TẾ, MUA SẮM, KẾT NỐI, GIÁO DỤC, CÔNG VIÊN, HÀNH CHÍNH, THỂ THAO, KCN; icon Maki; `pois[].icon` đổi icon riêng (`MLV.ICONS`) |
| Logo không có CORS | Tự thử lại qua `wsrv.nl` (logo chủ đầu tư, `markerUrl`) |
| `MLV.wait()` | Thêm `warn` (logo/font/phụ đề không tải được), `font` |

Cấu hình kiểu 2.2 chạy y như cũ.

## Script đi kèm

| File | Chạy ở đâu | Việc |
|---|---|---|
| `tools/brand-snippet.js` | Tab web chủ đầu tư (javascript_tool) | Trả JSON màu, font, logo; bản một dòng nằm trong SKILL.md |
| `scripts/tts.py <thư mục>` | Máy người dùng (Python + edge-tts + ffmpeg) | `script.json` → `voice.mp3` + `words.json`, in `poiDur` |
| `scripts/push_assets.sh <slug> <file...>` | Workspace của Claude | Đẩy logo/nhạc/giọng vào `assets/<slug>/`, in URL jsDelivr |
| `scripts/merge_th.mjs <map.mp4> <talking.mp4>` | Máy người dùng (Node + ffmpeg) | Talking head mở → bản đồ → talking head chốt, −14 LUFS |

Thư mục `assets/<tên-dự-án>/`: logo, ảnh phối cảnh, nhạc riêng, giọng đọc của từng dự án do skill tự đẩy lên khi làm clip (công khai qua jsDelivr; chỉ đặt nhạc có bản quyền sử dụng).

## Quy tắc
- Không sửa file đã phát hành. Bản mới = file mới (`mlv-engine-<phiên bản>.js`) trong commit mới, rồi cập nhật URL (theo mã commit) và SHA-256 trong SKILL.md.
- Logo AVI Realty nhúng trong file là tài sản thương hiệu của AVI Realty, chỉ dùng cho nội dung của AVI Realty.
- Dựa trên skill map-location-video của mktvantamland. Gói kèm mp4-muxer và webm-muxer (MIT, Vanilagy); giấy phép ở đầu file engine. Icon Maki (CC0, Mapbox).
- Ảnh vệ tinh Esri/Maxar, dữ liệu OpenStreetMap (Overpass), tuyến đường OSRM, giọng Microsoft Edge (edge-tts) dùng theo điều khoản của từng nhà cung cấp.
