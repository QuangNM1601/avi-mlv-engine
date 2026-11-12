# avi-mlv-engine

Engine dựng video vị trí dự án trên ảnh vệ tinh cho skill `map-location-video` của AVI Realty (xuất MP4 9:16, 16:9, 1:1).

## Bản phát hành

| Phiên bản | File | SHA-256 |
|---|---|---|
| 3.6.0 | `mlv-engine-3.6.0.js` | `4ea9ce52570d5cc2673b8d72cc5c596a7417f3d4cd109c7d60d5e4103a960809` |
| 3.5.0 | `mlv-engine-3.5.0.js` | `e8226a0952e95669b4cee7ffc608bdcf84ad8a7cd2eef2d1e5210099e0731cb2` |
| 3.4.0 | `mlv-engine-3.4.0.js` | `0651fa033b05a2ca902352b9e590c65da2d0098fbcd0040233941033459c17ad` |
| 3.3.0 | `mlv-engine-3.3.0.js` | `465aae93193cad7455f377d88610dee3b88321754698f67bb5910798a06ea7c9` |
| 3.2.0 | `mlv-engine-3.2.0.js` | `00d0f01b528189f36283477ecfb1ea80c1840bf9ae43789a884b4e93d5743f83` |
| 3.1.2 | `mlv-engine-3.1.2.js` | `029fa54598a9af952b2d55c2a3187df2931efb9f0b08a3d260f828a1338d37f7` |
| 3.1.1 | `mlv-engine-3.1.1.js` | `68f4f8794f781cecb11e85bb86b8b112c25910b0acbfe92ad800586913a8c544` |
| 3.1.0 | `mlv-engine-3.1.0.js` | `a9998d2c95cac87c9fb99bd41e450893f4e72dec97b78b4b96b4acd8b279de9e` |
| 3.0.2 | `mlv-engine-3.0.2.js` | `0c4ce7f52c3c30fe1e4ce4cc2b88f32db20706d9d59dcd76d531b0b13c597bf1` |
| 3.0.1 | `mlv-engine-3.0.1.js` | `8fdcaf3f5bb60970e9cbe322b38c92802b4aa4a71c07b24bc1bc040824e6ea1e` |
| 3.0.0 | `mlv-engine-3.0.0.js` | `66010c903d8300f8a062d7bdecd876c3395a204bcb441fd5a86f57676ef971d5` |
| 2.2.0 | `mlv-engine-2.2.0.js` | `3dcfcab2c64352e812303ceb3191d3fa36ba1fd11c49278b5eac2426e2bed12f` |
| 2.1.0 | `mlv-engine-2.1.0.js` | `b2a61c4048df419c346b56de86c8ffb9e137e75c0bdb21d86f88b5778db1b3e5` |

Địa chỉ dùng trong skill: `https://cdn.jsdelivr.net/gh/QuangNM1601/avi-mlv-engine@<mã commit>/mlv-engine-<phiên bản>.js` (ghim theo commit, không đổi được; mã commit hiện hành ghi trong SKILL.md).

## 3.6.0
| CFG | Làm gì |
|---|---|
| `beat` (giây/phách; `mlv.py run` tự lấy từ `words.json`) | Nhãn + ảnh tiện ích bật đúng phách gần 3,45 s nhất của mỗi cảnh, tiếng "pop" trùng lúc đó |

`scripts/music.py`: `find` — bài Mixkit (Mixkit Free License: thương mại, quảng cáo online, không cần ghi nguồn) theo tâm trạng motivational / uplifting / hopeful / corporate, đo BPM, độ đều và độ mạnh phách (librosa), xếp hạng; `prep <id>` — cắt để phách mạnh đầu tiên rơi đúng 0 s, ghi `music.mp3` + `beats.json`.
`scripts/tts.py`: `speed` (mặc định 1.25, rubberband giữ cao độ); có `beats.json` → độ dài cảnh mở / tiện ích / kết làm tròn theo ô nhịp, `hookDur` theo phách; VieNeu: bảng cách đọc (GO! → Gâu, AVI → A Vi, viết tắt tiếng Việt → chữ), in `g2p` (phiên âm tên tiếng Anh, viết tắt) và cờ đọc sai trước khi đọc, nghe lại bằng whisper tiếng Việt + tiếng Anh, đọc lại tối đa 6 lần. `tools/patch_360.py`: bản vá 3.5.0 → 3.6.0.

## 3.5.0
| CFG | Làm gì |
|---|---|
| `hookBg:'map'` + `hookPoi:i` | 3 giây đầu là cảnh bản đồ của tiện ích `i` (tuyến đã vẽ, ảnh, nhãn) làm bằng chứng cho câu móc; chữ ở trên (9:16) hoặc dưới ghim dự án (1:1, 16:9); ảnh và nhãn né vùng chữ; đẩy zoom 0,5 s; chớp trắng khi sang cảnh mở. `hookBg:'hero'` (mặc định cũ) giữ ảnh phối cảnh. Không có `hero` vẫn chạy (`hookDur`, mặc định 3) |
| `pois[].tag` | Nhãn lợi ích trên thẻ tiện ích thay tên loại (vd "7:00 · CON ĐI HỌC") |
| Âm thanh | Có câu móc: tiếng "pop" ở 0,08 s, "whoosh" lúc cắt; tiếng vào ngay (fade-in 0,04 s) |

`scripts/tts.py`: `engine:'vieneu'` (mặc định) — VieNeu-TTS v3 Turbo (Apache-2.0) chạy CPU trong `~/mlv-tts`, đọc thẳng tên tiếng Anh, mốc phụ đề bằng faster-whisper; thiếu `~/mlv-tts` → tự dùng Edge. Phụ đề chia theo vế câu, không cắt giữa số và đơn vị. `scripts/vieneu_say.py`: đọc nhiều câu, nạp mô hình 1 lần. `tools/patch_350.py`: bản vá 3.4.0 → 3.5.0.

## 3.4.0
- Dựng nhanh gấp khoảng 12 lần: bộ lọc độ sáng áp 1 lần cho mỗi ô ảnh vệ tinh khi giải mã, không áp lại mỗi khung (1080p 1:1, 47 giây: 14 phút → 73 giây trên máy 2 nhân).
- Nhãn tiện ích thêm 5 vị trí (dưới ghim, chéo trên, chéo dưới) cho điểm sát dự án; hết chồng nhãn ở 9:16.
- Câu móc co theo khung: 16:9 không bị cắt dòng trên, 9:16 chữ lớn hơn.

`scripts/mlv.py`: `gpoi` (tiện ích nổi bật theo Google Maps, 11 loại, xếp theo số đánh giá); `brand` đọc CSS trước (màu theo tần suất, bỏ màu mặc định thư viện; font chính + file; logo nhìn rõ nhất trên nền trắng, logo trắng → `plate` = màu chính), trình duyệt chỉ để chụp logo khi thiếu.

## 3.3.0
| CFG | Làm gì |
|---|---|
| `hero:{intro, outro, dur:3}` | Ảnh phối cảnh dự án sáng, rõ: toàn khung từ khung hình đầu tiên (`dur` giây, zoom chậm), rồi chuyển sang bản đồ; `outro` hiện sau phần tóm tắt tuyến ở cảnh kết, dưới thẻ hotline |
| `hook:[dòng lớn, dòng nền màu, dòng nhỏ]` | Câu móc 3 giây đầu trên ảnh `hero.intro` (vd "1 PHÚT" / "TỚI BỆNH VIỆN & SIÊU THỊ" / "TÊN DỰ ÁN · CĐT · NHẬN NHÀ"); có hook thì bỏ màn logo mở đầu, ẩn phụ đề trong 3 giây đầu, tên dự án hiện sau |
| `bgBlur` | Mặc định 0 (không làm mờ) |

`scripts/mlv.py renders <url>`: lấy ảnh phối cảnh lớn trên web dự án (img, srcset, nền CSS).

## 3.2.0
| CFG | Làm gì |
|---|---|
| `travel:'moto'` | Tuyến xe máy (OSRM hồ sơ xe đạp: không cao tốc, được băng qua đường), thời gian giao thông bình thường 25 km/h trong 8 km đầu, 30 km/h phần sau; thẻ ghi "phút xe máy" |
| `pois[].km`, `pois[].min` | Ghi đè cự ly, thời gian trên thẻ |
| `pois[].route:'line'` | Vẽ đường thẳng thay tuyến đường |
| `bgBlur` 0–1 | Làm mờ, giảm màu nền vệ tinh ở cảnh mở và cảnh kết; tắt lớp tên đường ở hai cảnh này |

`scripts/tts.py`: bảng cách đọc từ tiếng Anh/viết tắt (`say` trong script.json ghi đè, phụ đề giữ chữ gốc); `style:'song-dong'` đổi cao độ, tốc độ theo từng câu.
`scripts/mlv.py dist|poi --dist`: mặc định `--travel moto`.

## 3.1.2
- Ảnh tiện ích: không đặt ở vùng giữa khung (36–64% ngang, 30–70% vùng bản đồ), không che vùng quanh ghim và logo dự án; cỡ 0,85 / 0,7 / 0,6 × cỡ cũ.

## 3.1.1
- Website AVI Realty: avirealty.com → avirealty.vn.
- `mlv.py images`: thêm nguồn ảnh địa điểm Google Maps (`--place`), Bing/DDG lỗi không làm dừng lệnh.

## 3.1.0
| CFG / API | Làm gì |
|---|---|
| `bright` 0–1 | Ảnh vệ tinh sáng hơn (brightness, contrast, saturate), giảm lớp phủ tối và viền tối. 0 = như 3.0 |
| `roads` | Lớp tên đường Esri World Transportation phủ lên ảnh vệ tinh |
| `pois[].photo` | Ảnh tiện ích bật lên cạnh ghim (khung trắng bo góc), tự né nhãn, ghim, thẻ, phụ đề |
| `brandMode:'project'` | Thương hiệu tách đôi: màu, font, logo dự án là chính; logo AVI ở góc và khung kết. `'project-only'`: không có AVI |
| `brand.fontUrl` | Font dự án từ file (FontFace), không cần Google Fonts |
| `introDur` 3–8, `outroDur` 3,5–8 | Cảnh mở / kết dài theo giọng đọc (tts.py tính sẵn) |
| `noVideo` | Chỉ dựng để xem khung (storyboard), không mã hóa video |
| `MLV.wait()` | Thêm `photos` (số ảnh tiện ích tải được), `roads` |

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
| `scripts/mlv.py <lệnh>` | Workspace của Claude (Python + Playwright + Chrome) | Cả quy trình không cần máy người dùng: `gmaps`, `geo`, `poi`, `dist`, `brand`, `images`, `run` (khung storyboard / MP4), `compose`. Xem đầu file |
| `scripts/check_voice.py voice.mp3 "tên"...` | Workspace của Claude (faster-whisper) | Nghe lại giọng đọc, báo tên tiếng Anh nào chưa đọc đúng |
| `tools/brand-snippet.js` | Tab web chủ đầu tư (javascript_tool) | Trả JSON màu, font, logo; bản một dòng nằm trong SKILL.md |
| `scripts/tts.py <thư mục>` | Workspace của Claude (VieNeu trong `~/mlv-tts`, hoặc edge-tts) + ffmpeg | `script.json` → `voice.mp3` + `words.json`, in `poiDur`, `introDur`, `outroDur` |
| `scripts/vieneu_say.py spec.json` | `~/mlv-tts/bin/python` | Đọc các câu bằng VieNeu-TTS v3 Turbo (gọi từ tts.py); `--g2p` phiên âm |
| `scripts/music.py find / prep` | Workspace của Claude (librosa + ffmpeg) | Nhạc truyền cảm hứng Mixkit + lưới phách `beats.json` |
| `scripts/push_assets.sh <slug> <file...>` | Workspace của Claude | Đẩy logo/nhạc/giọng vào `assets/<slug>/`, in URL jsDelivr |
| `scripts/merge_th.mjs <map.mp4> <talking.mp4>` | Máy người dùng (Node + ffmpeg) | Talking head mở → bản đồ → talking head chốt, −14 LUFS |

Thư mục `assets/<tên-dự-án>/`: logo, ảnh phối cảnh, nhạc riêng, giọng đọc của từng dự án do skill tự đẩy lên khi làm clip (công khai qua jsDelivr; chỉ đặt nhạc có bản quyền sử dụng).

## Quy tắc
- Không sửa file đã phát hành. Bản mới = file mới (`mlv-engine-<phiên bản>.js`) trong commit mới, rồi cập nhật URL (theo mã commit) và SHA-256 trong SKILL.md.
- Logo AVI Realty nhúng trong file là tài sản thương hiệu của AVI Realty, chỉ dùng cho nội dung của AVI Realty.
- Dựa trên skill map-location-video của mktvantamland. Gói kèm mp4-muxer và webm-muxer (MIT, Vanilagy); giấy phép ở đầu file engine. Icon Maki (CC0, Mapbox).
- Ảnh vệ tinh Esri/Maxar, dữ liệu OpenStreetMap (Overpass), tuyến đường OSRM, giọng Microsoft Edge (edge-tts), VieNeu-TTS (Apache-2.0, có watermark âm thanh mặc định), nhạc Mixkit (Mixkit Free License) dùng theo điều khoản của từng nhà cung cấp.
