---
name: "map-location-video"
description: "Làm video giới thiệu vị trí và kết nối của dự án bất động sản trên nền ảnh vệ tinh Esri nghiêng 3D: gõ tên dự án là chạy — tự lập hồ sơ dự án, tự tìm tiện ích quanh dự án (Overpass) và đo km/phút (OSRM), thương hiệu AVI Realty hoặc màu/font/logo của chủ đầu tư, giọng đọc tiếng Việt + phụ đề, nhạc nền, ghép video môi giới nói (talking head); khung 9:16 / 16:9 / 1:1, MP4 1080p, dựng trong trình duyệt tích hợp của app Claude desktop. Không dùng cho mô phỏng thi công metro."
---

# Video vị trí dự án trên ảnh vệ tinh — AVI Realty (v3.0)

Engine `MLV` 3.0.2 đặt sẵn ở URL tại bước 3. Không chép mã engine, script hay trang web thô vào hội thoại; chỉ gửi lệnh và CFG, chỉ đọc JSON engine trả về.

## Ngân sách mỗi video
- Nghiên cứu: ≤ 3 lượt tìm, mở ≤ 2 trang. Không chụp màn hình khi chờ. 1 cổng duyệt duy nhất (bước 7).
- Dự án đã có `project.json` đã duyệt (bước 7) → bỏ bước 2, 4, 5, 6; chỉ đổi phần người dùng yêu cầu rồi dựng lại.
- Thư mục dự án trên máy: `D:/CLAUDE COWORK/map-video/<slug>/` (hoặc nơi người dùng chỉ định); `<slug>` = tên dự án không dấu, nối gạch.

## 1. Chọn phương án (1 lượt)
AskUserQuestion một lần, 4 câu (không có công cụ thì hỏi bằng chữ đúng 4 câu):
1. "Xuất khung hình nào?" · header "Khung hình" · multiSelect: `9:16 (Reels, TikTok, Shorts)` · `1:1 (Facebook, Instagram feed)` · `16:9 (YouTube, website)`
2. "Nhạc nền?" · header "Nhạc": `Không nhạc` · `Sang trọng (chậm, nhẹ)` · `Năng động (nhịp nhanh)` · `Nhạc riêng (gửi file có bản quyền)`
3. "Giọng đọc thuyết minh?" · header "Giọng": `Giọng nam` · `Giọng nữ` · `Không giọng đọc`
4. "Thương hiệu trên video?" · header "Thương hiệu": `AVI Realty` · `Theo chủ đầu tư (gửi link web)` · `Không thương hiệu`

Quy đổi: `formats` · `music`: `'none'` | `'sang-trong'` | `'nang-dong'` | `{url}` · giọng: `vi-VN-NamMinhNeural` | `vi-VN-HoaiMyNeural` | không · `brandMode`: `'avi'` | `'project'` | `'none'`.

## 2. Hồ sơ dự án
1. Có hồ sơ "00-thong-so-du-an" (skill real-estate-project-research) trong Project hoặc Drive → đọc, không tìm lại.
2. Chưa có → tìm ≤ 3 lượt, mở ≤ 2 trang; chỉ ghi 8 trường: `name`, `developer`, `address`, `lat`, `lon`, `scale` (ha / số căn), `status`, `sources` (≤ 3 link).
3. Không bịa tọa độ. Thiếu → `MLV.geo(['tên dự án, quận'], {lat, lon gần đúng})` ở bước 5; vẫn không chắc → hỏi người dùng.
4. Hạ tầng chưa xong (metro, cầu, cao tốc) chỉ dùng khi có nguồn ≤ 12 tháng; ghi "theo quy hoạch".

## 3. Mở trình duyệt, nạp engine
1. Gọi enable__mcp__remote-devices__Claude_Browser, nạp tool bằng một lệnh ToolSearch tiền tố `mcp__remote-devices__Claude_Browser__`, đọc skill built-in-browser.
2. request_access (scope site) một lần: `server.arcgisonline.com`, `cdn.jsdelivr.net`, `overpass-api.de`, `overpass.private.coffee`, `router.project-osrm.org`, `photon.komoot.io`, `nominatim.openstreetmap.org`; thêm `wsrv.nl`, `fonts.googleapis.com`, `fonts.gstatic.com` khi thương hiệu theo chủ đầu tư.
3. preview_start `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/10/450/820` (tab bản đồ). Mọi lệnh MLV chạy trong tab này bằng javascript_tool (javascript_exec).
4. Nạp engine (gửi nguyên văn), kết quả phải là `3.0.2`:
```js
(async()=>{const U='https://cdn.jsdelivr.net/gh/QuangNM1601/avi-mlv-engine@1211e9da5ac9f3dc46134f1798f53e37a4bfbb56/mlv-engine-3.0.2.js',H='0c4ce7f52c3c30fe1e4ce4cc2b88f32db20706d9d59dcd76d531b0b13c597bf1',V='3.0.2';if(!(window.MLV&&MLV.version===V)){const b=await(await fetch(U)).arrayBuffer();const d=[...new Uint8Array(await crypto.subtle.digest('SHA-256',b))].map(x=>x.toString(16).padStart(2,'0')).join('');if(d!==H)throw new Error('engine sai SHA-256');(0,eval)(new TextDecoder().decode(b));}return MLV.version})()
```
Lỗi mạng: request_access cho host rồi chạy lại. Lỗi SHA-256: dừng, báo người dùng.

## 4. Thương hiệu chủ đầu tư (chỉ khi chọn)
1. preview_start `<link web chủ đầu tư>` (tab 2), javascript_exec nguyên văn:
```js
(()=>{const t=t=>{const[e,n,r]=t.map(t=>t/255),o=Math.max(e,n,r),a=o-Math.min(e,n,r);if(!a)return 0;return(60*(o===e?(n-r)/a%6:o===n?(r-e)/a+2:(e-n)/a+4)+360)%360},e={},n=(t,n)=>{const r=(t=>{const e=String(t).match(/[\d.]+/g);return e&&e.length>=3?e.slice(0,3).map(Number):null})(t);if(!r||(t=>{const e=String(t).match(/[\d.]+/g);return e&&e.length>=4?+e[3]:1})(t)<.5||(t=>Math.max(...t)-Math.min(...t))(r)<40)return;const o=(t=>"#"+t.map(t=>Math.round(t).toString(16).padStart(2,"0")).join("").toUpperCase())(r);e[o]=(e[o]||0)+n};[...document.querySelectorAll("header,nav,header *,nav *,a,button,.btn,[class*=btn],[class*=Btn],h1,h2,h3,footer")].slice(0,900).forEach(t=>{const e=getComputedStyle(t),r=t.matches("button,.btn,[class*=btn],[class*=Btn]");n(e.backgroundColor,r?6:2),n(e.color,t.matches("h1,h2,h3")?3:1),n(e.borderTopColor,1)});const r=Object.entries(e).sort((t,e)=>e[1]-t[1]).map(t=>t[0]),o=r[0]||null,a=t=>t.slice(1).match(/../g).map(t=>parseInt(t,16)),c=o&&r.find(e=>((e,n)=>{const r=Math.abs(t(a(e))-t(a(n)));return Math.min(r,360-r)})(e,o)>40)||r[1]||null,l=getComputedStyle(document.querySelector("h1,h2")||document.body).fontFamily.split(",")[0].replace(/["']/g,"").trim(),s=[...document.querySelectorAll('header img,nav img,a[href="/"] img,[class*=logo] img,img[class*=logo],img[alt*=logo i],img[src*=logo i]')].find(t=>t.naturalWidth>=40&&t.naturalWidth/Math.max(1,t.naturalHeight)<=8),i=document.querySelector('meta[property="og:site_name"]');return JSON.stringify({site:location.hostname,name:i&&i.content||document.title.split(/[|\-\u2013\u2014]/)[0].trim(),primary:o,accent:c,colors:r.slice(0,4),font:l,logo:s?/^data:/.test(s.currentSrc||s.src)?"inline":s.currentSrc||s.src:null})})()
```
2. Kết quả `{name, primary, accent, colors, font, logo}`. Màu trông sai (vd đỏ cảnh báo) → chọn màu khác trong `colors`. `logo` là `null` hoặc `'inline'` → xin người dùng file logo PNG (đưa lên CDN ở bước 8) hoặc chuyển về AVI Realty.
3. Đóng tab 2. CFG: `brandMode:'project'`, `brand:{name, primary, accent, font, logo, website}`. `role` (vd "Đại lý phân phối") chỉ ghi khi người dùng xác nhận.

## 5. Tiện ích và cự ly (tab bản đồ)
1. `window.__p = MLV.poi({lat, lon}, {km: 3})` (nội đô 3 km, ngoại thành 8 km), lệnh sau `await window.__p` (mất 5–30 giây) → ≤ 20 ứng viên `{cat, name, lat, lon, km, kind}`. Chỉ gọi 1 lần mỗi dự án (Overpass, Photon giới hạn tần suất).
   `{err}` → 1 lượt tìm web "tiện ích gần <dự án>" lấy 4–6 tên → `MLV.geo`; `MLV.geo` cũng lỗi → xin người dùng link Google Maps hoặc tọa độ.
2. Điểm lớn ngoài bán kính (sân bay, trung tâm Quận 1, ga metro, KCN lớn) → `MLV.geo(['tên 1','tên 2'], {lat, lon})`; có `warn` thì đưa `alt` cho người dùng chọn.
3. `MLV.dist({lat, lon}, [ứng viên])` → thêm `km`, `min` đường lái xe, xếp theo phút.
4. Chọn 4–6 điểm: mỗi loại ≤ 2, ưu tiên nơi có tiếng và gần; bỏ phòng khám nhỏ, trường mầm non. Loại: Y TẾ · MUA SẮM · KẾT NỐI · GIÁO DỤC · CÔNG VIÊN · HÀNH CHÍNH · THỂ THAO · KCN. Đổi icon riêng: `icon` thuộc `MLV.ICONS` (vd `airport` cho sân bay).

## 6. Lời đọc (khi có giọng) — viết 1 lượt
`script.json`: `{"voice", "brand": brandMode !== 'none', "intro", "pois": [1 câu/tiện ích, đúng thứ tự CFG], "outro"}`.
- `intro` ≤ 16 từ: tên dự án + điểm mạnh vị trí. Mỗi câu tiện ích ≤ 14 từ: tên + số km hoặc phút + lợi ích. `outro` ≤ 16 từ: lời mời nhận bảng giá.
- Số đọc bằng chữ, khớp phiếu duyệt ("ba phẩy bốn ki lô mét", "khoảng năm phút"). Hạ tầng chưa xong: "theo quy hoạch".

## 7. Cổng duyệt (bắt buộc, 1 lần)
Gửi 1 phiếu: tên, địa chỉ, tọa độ + nguồn · bảng tiện ích (loại | tên | km | phút | ước tính?) · hạ tầng quy hoạch + nguồn · lời đọc · thương hiệu (màu, logo) · khung, nhạc, giọng. Chờ người dùng duyệt hoặc sửa; không dựng khi chưa duyệt (chạy không người trông: dừng ở đây). Duyệt xong → ghi `project.json` (8 trường + `pois` + `brand` + lời đọc) vào thư mục dự án.

## 8. Giọng đọc và đưa file lên CDN
1. Có tool `mcp__remote-devices__device_bash` (máy đã liên kết): trong thư mục dự án ghi `script.json`, rồi
   `curl -sL -o tts.py https://cdn.jsdelivr.net/gh/QuangNM1601/avi-mlv-engine@1211e9da5ac9f3dc46134f1798f53e37a4bfbb56/scripts/tts.py && python tts.py .` (máy Mac: `python3`; thiếu gói: `pip install edge-tts`; cần ffmpeg).
   Kết quả `ok:true` → lấy `poiDur`. `ok:false` + `long` → rút gọn đúng câu đó, chạy lại; không tăng tốc giọng.
   Không có máy liên kết → làm video không giọng, báo người dùng.
2. Đưa `voice.mp3`, `words.json` và file người dùng gửi (logo PNG cạnh dài ≤ 800px, phối cảnh JPG, nhạc `ffmpeg -i in -t 60 -ac 2 -b:a 128k music.mp3`; nhạc chỉ nhận khi người dùng xác nhận có quyền) vào workspace (stage qua bridge).
3. add_repo `QuangNM1601/avi-mlv-engine` (access push), rồi
   `git clone -q --depth 1 https://github.com/QuangNM1601/avi-mlv-engine ~/.mlv-assets 2>/dev/null; cp ~/.mlv-assets/scripts/push_assets.sh /tmp/pa.sh && bash /tmp/pa.sh <slug> <file...>` → `urls` jsDelivr. Engine báo không tải được → đợi 1 phút chạy lại, hoặc dùng `raw` + request_access raw.githubusercontent.com.
4. Báo người dùng: file nằm trong repo công khai, ai có địa chỉ đều xem được.

## 9. Dựng
`MLV.run(CFG)`, CFG JSON: `{name, area, intro:[l1,l2], subtitle, tagline, hotline, role, project:{lat,lon}, pois:[{cat,name,lat,lon,icon?}], formats:['9:16'], music:'none', marker:'pin', markerUrl:'', res:1080, brandMode:'avi', brand:{…}, voice:{url, wordsUrl}, captions:true, poiDur}`.
- Luôn truyền `hotline` (mặc định `'0965.909.339'`). `marker:'logo'` khi có logo chủ đầu tư (không cần `markerUrl`) hoặc logo/phối cảnh người dùng gửi (`markerUrl` = URL jsDelivr).
- Có giọng: `voice` = URL jsDelivr của `voice.mp3` và `words.json`, `poiDur` từ tts.py, `captions:true` trừ khi người dùng không muốn phụ đề.
- `res:720` khi cần nhẹ. Sau đó gọi `MLV.wait(25)` lặp lại đến khi có `done:true` hoặc `err`.

## 10. Đọc kết quả `MLV.wait`
- `map` phải là "Esri World Imagery (vệ tinh)" và `tiles.failed` = 0. `err` "Thiếu ảnh vệ tinh" → kiểm tra quyền server.arcgisonline.com, chạy lại; không giao video.
- `err` có "logo/ảnh dự án" hoặc "giọng đọc" → kiểm tra URL ở bước 8.
- `warn`: logo chủ đầu tư không tải được (video đã chuyển sang không thương hiệu), font không tải được, phụ đề lỗi → báo người dùng.
- `tiles.fallback` > 0: vài ô dùng ảnh cấp thấp hơn → báo người dùng.
- `out[].viol` phải = 0. Nếu > 0: `MLV.sheet('<khung>')`, chụp pane 1 lần, sửa CFG (tên ngắn hơn, bớt điểm sát nhau, câu lời đọc ngắn hơn) rồi chạy lại.
- `out[].audio`: có nhạc/giọng mà ghi "không xuất được tiếng" → báo người dùng. Codec `opus` thay vì `mp4a`: MP4 vẫn dùng bình thường.
- `routes[].est` = 'chim bay': không lấy được tuyến OSRM → báo người dùng. `codec` có `(realtime)`: xuất WebM không tiếng; `late` > 0 → giữ pane hiển thị, chạy lại.

## 11. Giao video, ghép talking head
1. `MLV.show()` hiện video từng khung kèm nút tải (`<slug>_9x16.mp4`). Báo: khung, độ phân giải, dung lượng, nhạc/giọng, lưu ý ở bước 10. Xem 1 khung: `MLV.view('<khung>', giây)`.
2. Talking head (khi người dùng gửi video môi giới nói): người dùng tải MP4 bản đồ về thư mục dự án, rồi trên máy:
   `curl -sL -o merge_th.mjs https://cdn.jsdelivr.net/gh/QuangNM1601/avi-mlv-engine@1211e9da5ac9f3dc46134f1798f53e37a4bfbb56/scripts/merge_th.mjs && node merge_th.mjs <map.mp4> <talking.mp4> [--open 0-5] [--close a-b|none]`
   → `<map>_th.mp4`: talking head mở → bản đồ → talking head chốt, −14 LUFS. Chỉ nhận video người xuất hiện đã đồng ý dùng cho quảng cáo.

## Quy tắc giữ nguyên
- Kịch bản: logo thương hiệu mở đầu (0–1,3s) → tên dự án + dòng phụ (đến 4s) → logo/ảnh dự án bật lên tại ghim (giây 4, nếu chọn) → mỗi tiện ích `poiDur` giây (5,5–9) → khung kết 5s (tên dự án, số tiện ích + bán kính, logo, tagline, nút hotline, website). Thời lượng = 4 + poiDur × số điểm + 5 giây (không thương hiệu: 3,5 + … + 3,5).
- Nhạc: chỉ nhạc tự tạo của engine hoặc file người dùng có quyền sử dụng; có giọng thì nhạc tự hạ xuống. Chuẩn độ lớn −14 LUFS.
- Logo AVI Realty luôn trên nền kem, không đổi màu, không kéo méo. Thương hiệu chủ đầu tư chỉ dùng khi là đại lý được ủy quyền.
- Dòng nguồn "Ảnh vệ tinh: Esri, Maxar · Đường: © OpenStreetMap · Số liệu ước tính" luôn hiện; chỉ xoá khi người dùng yêu cầu rõ.
- km/phút là đường lái xe OSRM, mang tính ước tính. Dùng cho quảng cáo thương mại: nhắc người dùng kiểm tra điều khoản ảnh Esri.
- Overpass, Photon, Nominatim công khai giới hạn tần suất: không gọi `MLV.poi` lặp lại, không tự viết vòng gọi song song; dùng lại `project.json` thay vì tìm lại.
- Không sao chép thương hiệu, tên kênh, watermark của video mẫu người khác.
- Bố cục, vùng an toàn, cách đặt nhãn nằm trong engine (`MLV.LAYOUTS`). Đổi thì sửa engine trong repo, tăng phiên bản, cập nhật URL + SHA-256 ở bước 3.
