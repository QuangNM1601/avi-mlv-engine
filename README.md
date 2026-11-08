# avi-mlv-engine

Engine dựng video vị trí dự án trên ảnh vệ tinh cho skill `map-location-video` của AVI Realty (xuất MP4 9:16, 16:9, 1:1).

## Bản phát hành

| Phiên bản | File | SHA-256 |
|---|---|---|
| 2.1.0 | `mlv-engine-2.1.0.js` | `b2a61c4048df419c346b56de86c8ffb9e137e75c0bdb21d86f88b5778db1b3e5` |

Địa chỉ dùng trong skill:
`https://cdn.jsdelivr.net/gh/QuangNM1601/avi-mlv-engine@v2.1.0/mlv-engine-2.1.0.js`

## Quy tắc
- Không sửa file đã phát hành. Bản mới = file mới (`mlv-engine-<phiên bản>.js`) + tag mới (`v<phiên bản>`), rồi cập nhật URL và SHA-256 trong SKILL.md.
- Logo AVI Realty nhúng trong file là tài sản thương hiệu của AVI Realty, chỉ dùng cho nội dung của AVI Realty.
- Dựa trên skill map-location-video của mktvantamland. Gói kèm mp4-muxer và webm-muxer (MIT, Vanilagy); giấy phép ở đầu file engine.
- Ảnh vệ tinh Esri/Maxar, dữ liệu OpenStreetMap và tuyến đường OSRM dùng theo điều khoản của từng nhà cung cấp.
