BỘ SOURCE SYNC ADMIN <-> USER
==============================

File gồm:
- index.html
- script.js
- style.css
- shop-shield.js (lớp bảo vệ nhúng phía client)
- server.mjs (backend xác thực admin và lưu state trung tâm)
- .env.example (mẫu cấu hình production)

Luồng sync chính:
1. USER tạo yêu cầu nạp tiền -> MQTT deposit_request/<requestId> (retain QoS 1).
2. ADMIN subscribe wildcard deposit_request/+ -> nhận yêu cầu và đưa vào danh sách chờ duyệt.
3. ADMIN duyệt -> cập nhật balance/totalDeposit/VIP/history local -> MQTT deposit_approved (QoS 1).
4. USER nhận deposit_approved -> cập nhật balance/totalDeposit/VIP/history.
5. ADMIN mới được phát full_state; USER không được phát full_state để tránh ghi đè dữ liệu.
6. Có chống xử lý trùng requestId.
7. index.html nhúng shop-shield.js trước script.js để kiểm tra can thiệp phía client.
8. Backend cấp token admin, lưu revision state và chỉ cho admin đã xác thực ghi state.

 CÀI ĐẶT:
- Đặt cả 5 file trong cùng một thư mục.
- Chạy server bằng `node server.mjs`.
- Mở `http://127.0.0.1:8000/` hoặc cổng được đặt trong biến môi trường `PORT`.
- Local mặc định dùng `tdung123321`; production bắt buộc đặt `ADMIN_PASSWORD` qua biến môi trường.
- Production nên đặt `HOST=0.0.0.0`, `ADMIN_PASSWORD` dài/ngẫu nhiên và `ALLOWED_ORIGIN` đúng domain.
- Có thể bật TLS bằng `HTTPS_KEY_FILE` và `HTTPS_CERT_FILE`; khuyến nghị dùng Nginx/Caddy làm reverse proxy HTTPS.
- Xóa cache/Hard Reload (Ctrl+Shift+R) sau khi upload.
- Đăng nhập 1 tab ADMIN và 1 tab USER để test.

LƯU Ý:
- MQTT broker/topicBase trong script.js phải giống nhau giữa ADMIN và USER.
- Dữ liệu quyền admin và full state hiện được xác thực/lưu qua backend; MQTT chỉ còn dùng cho các thông báo tương thích cũ.
- `server-state.json` là dữ liệu runtime, cần sao lưu và không công khai khi triển khai thật.
- Không upload `.env`, certificate/key hoặc `server-state.json` lên hosting tĩnh.
