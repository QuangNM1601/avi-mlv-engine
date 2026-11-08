# avi-mlv-engine

Engine dựng video vị trí dự án trên ảnh vệ tinh cho skill `map-location-video` của AVI Realty (xuất MP4 9:16, 16:9, 1:1).

## Bản phát hành

| Phiên bản | File | SHA-256 |
|---|---|---|
| 2.2.0 | `mlv-engine-2.2.0.js` | `3dcfcab2c64352e812303ceb3191d3fa36ba1fd11c49278b5eac2426e2bed12f` |
| 2.1.0 | `mlv-engine-2.1.0.js` | `b2a61c4048df419c346b56de86c8ffb9e137e75c0bdb21d86f88b5778db1b3e5` |

Địa chỉ dùng trong skill: `https://cdn.jsdelivr.net/gh/QuangNM1601/avi-mlv-engine@<mã commit>/mlv-engine-<phiên bản>.js` (ghim theo commit, không đổi được; mã commit hiện hành ghi trong SKILL.md).

Thư mục `assets/<tên-dự-án>/`: logo, ảnh phối cảnh, nhạc riêng của từng dự án do skill tự đẩy lên khi làm clip (công khai qua jsDelivr; chỉ đặt nhạc có bản quyền sử dụng).

## Quy tắc
- Không sửa file đã phát hành. Bản mới = file mới (`mlv-engine-<phiên bản>.js`) trong commit mới, rồi cập nhật URL (theo mã commit) và SHA-256 trong SKILL.md.
- Logo AVI Realty nhúng trong file là tài sản thương hiệu của AVI Realty, chỉ dùng cho nội dung của AVI Realty.
- Dựa trên skill map-location-video của mktvantamland. Gói kèm mp4-muxer và webm-muxer (MIT, Vanilagy); giấy phép ở đầu file engine.
- Ảnh vệ tinh Esri/Maxar, dữ liệu OpenStreetMap và tuyến đường OSRM dùng theo điều khoản của từng nhà cung cấp.
