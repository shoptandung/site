BỘ SOURCE SYNC ADMIN <-> USER
==============================

File gồm:
- index.html
- script.js
- style.css

Luồng sync chính:
1. USER tạo yêu cầu nạp tiền -> MQTT deposit_request/<requestId> (retain QoS 1).
2. ADMIN subscribe wildcard deposit_request/+ -> nhận yêu cầu và đưa vào danh sách chờ duyệt.
3. ADMIN duyệt -> cập nhật balance/totalDeposit/VIP/history local -> MQTT deposit_approved (QoS 1).
4. USER nhận deposit_approved -> cập nhật balance/totalDeposit/VIP/history.
5. ADMIN mới được phát full_state; USER không được phát full_state để tránh ghi đè dữ liệu.
6. Có chống xử lý trùng requestId.
7. index.html dùng cache-bust script.js?v=sync-v3 để tránh trình duyệt giữ JS cũ.

CÀI ĐẶT:
- Đặt cả 3 file trong cùng một thư mục.
- Upload đè 3 file lên hosting.
- Xóa cache/Hard Reload (Ctrl+Shift+R) sau khi upload.
- Đăng nhập 1 tab ADMIN và 1 tab USER để test.

LƯU Ý:
- MQTT broker/topicBase trong script.js phải giống nhau giữa ADMIN và USER.
- Đây vẫn là kiến trúc client-side localStorage + MQTT, không phải ledger server-side. Không dùng cho tiền thật nếu chưa có backend/database giao dịch.
