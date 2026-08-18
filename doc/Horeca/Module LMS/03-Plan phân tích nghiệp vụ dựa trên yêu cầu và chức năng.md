# MA TRẬN PHÂN TÍCH NGHIỆP VỤ & PHẠM VI (SCOPE MATRIX) - MODULE LMS

> **Mục đích:** Đối soát giữa **Chức năng Hợp đồng (01)** và **Mong muốn Khách hàng (02)** nhằm xác định rõ **Phạm vi triển khai Giai đoạn 1 (In-Scope)**, **Các tính năng ngoài hợp đồng (Out-of-Scope / Giai đoạn 2)**, và **Các điểm kỹ thuật trọng yếu cần làm rõ**.

---

## 1. BẢNG ĐỐI SOÁT PHẠM VI (GAP ANALYSIS & SCOPE CLASSIFICATION)

| STT | Nhóm nghiệp vụ | Yêu cầu từ Khách hàng (File 02) | Tình trạng trong Hợp đồng (File 01) | Phân loại & Quyết định phạm vi | Ghi chú xử lý với khách |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Xác thực & Tài khoản** | Đăng ký/Đăng nhập Email, SĐT, Google, Facebook | Có (Mục 0, 10, 19) | ✅ **IN-SCOPE (P1)** | Chuẩn hóa đăng nhập Email/SĐT; Google OAuth làm chuẩn. |
| **2** | **Thương mại & Bán khóa học** | Xem khóa học, Giỏ hàng, Thanh toán VNPay/Momo/Bank, Voucher, Hóa đơn | Có trong luồng tổng thể LMS/CRM | ✅ **IN-SCOPE (P1)** | Tập trung cổng CK & VNPay tự động kích hoạt. |
| **3** | **Kích hoạt khóa học** | Tự động sau thanh toán / Nhập mã kích hoạt (Voucher) | Có (Mục 18) | ✅ **IN-SCOPE (P1)** | Tự động mở khóa ngay khi Webhook thanh toán báo thành công. |
| **4** | **Trải nghiệm Học tập (Player)** | Xem video đa thiết bị, PDF đính kèm, ghi nhớ điểm dừng, hoàn thành bài | Có (Mục 0, 2, 7, 8) | ✅ **IN-SCOPE (P1)** | Resume video, lưu % tiến độ theo từng giây xem. |
| **5** | **Kiểm tra & Đánh giá** | Quiz trắc nghiệm sau bài/chương, bài thi cuối khóa, chấm điểm tự động | Có (Mục 0, 7, 14) | ✅ **IN-SCOPE (P1)** | Hỗ trợ trắc nghiệm (Single/Multi-choice), tính % điểm đạt. |
| **6** | **Cấp Chứng nhận (Certificate)** | Cấp chứng nhận online tự động, Mã xác thực + QR Code, Tải file PDF | Có (Mục 6, 10) | ✅ **IN-SCOPE (P1)** | Tạo template mẫu, tự điền tên & sinh mã QR tra cứu. |
| **7** | **Tương tác & Q&A** | Bình luận dưới bài giảng, Giảng viên trả lời Q&A | Có (Mục 0 - Hệ thống học) | ✅ **IN-SCOPE (P1)** | Thread hỏi đáp dưới video bài học. |
| **8** | **Đào tạo Nội bộ & Phân quyền** | Phân quyền theo Chức danh / Phòng ban (Barista, Thu ngân, Cửa hàng trưởng) | Có (Mục 4, 5, 10) | ✅ **IN-SCOPE (P1)** | Gán khóa học bắt buộc theo Role từ HRM. |
| **9** | **Webinar / Lớp học trực tuyến** | Học trực tiếp qua Zoom / Google Meet tích hợp | Có (Mục 3) | ✅ **IN-SCOPE (P1)** | Nhúng link/tích hợp Zoom API tạo lịch học. |
| **10** | **Chống chia sẻ tài khoản & Bảo mật** | Chặn xem đồng thời, giới hạn thiết bị (1-2 thiết bị), Watermark tên học viên | Có trong yêu cầu bảo mật video (Mục 2) | ✅ **IN-SCOPE (P1)** | - Single Session login.<br>- Watermark mờ số ĐT/User ID chạy trên player.<br>- Chống tải video (HLS/DASH streaming). |
| **11** | **Chuyển đổi dữ liệu cũ (MIGRATION)** | Chuyển toàn bộ User cũ, Khóa học, Bài học, Tiến độ học sang web mới | **CỰC KỲ QUAN TRỌNG** (Mục 11 đến 24 - 14 chức năng) | ✅ **TRỌNG TÂM GIAI ĐOẠN 1** | Cần lấy DB backup web cũ, quy tắc map ID, reset mật khẩu qua OTP. |
| **12** | **Tính năng AI (Trợ lý, AI Quiz, Tóm tắt)** | AI Assistant, AI sinh Quiz tự động, AI tóm tắt bài giảng | ❌ **KHÔNG CÓ TRONG HỢP ĐỒNG** | ⛔ **OUT-OF-SCOPE (Đưa vào Giai đoạn 2)** | Thông báo với khách: "Hệ thống chuẩn bị sẵn kiến trúc API, sẽ triển khai ở Phase 2 sau khi dữ liệu ổn định". |
| **13** | **Hệ thống Blog / Tin tức nâng cao** | Quản trị bài viết, tối ưu SEO, phân mục tin tức | Thuộc Module SYS / Portal chung | ⚠️ **THỐNG NHẤT LẠI** | Cung cấp CMS bài viết cơ bản; tính năng SEO chuyên sâu đưa vào Phase 2. |

---

## 2. PHÂN TÍCH RỦI RO & BÀI TOÁN NGHIỆP VỤ CỐT LÕI (CORE BUSINESS CHALLENGES)

### 📌 Thách thức 1: Bài toán chuyển đổi dữ liệu (Data Migration từ Web cũ)
* **Hiện trạng rủi ro:** Hệ thống cũ cấu trúc dữ liệu không đồng nhất, mật khẩu được mã hóa một chiều (không chuyển dạng plain-text được), một số học viên thiếu Email hoặc SĐT.
* **Giải pháp đề xuất:**
  1. Xây dựng **Công cụ ETL (Extract - Transform - Load)** tự động làm sạch dữ liệu.
  2. Cơ chế **Kích hoạt tài khoản lần đầu**: Khi học viên cũ đăng nhập số điện thoại -> Hệ thống gửi OTP xác thực để tạo mật khẩu mới trên hệ sinh thái mới mà không mất khóa học đã mua.
  3. Bảng **Mapping Tiến độ học**: Map trực tiếp các bài học cũ tương ứng bài mới, đảm bảo học viên không bị học lại từ đầu.

### 📌 Thách thức 2: Phân tách 2 nhóm đối tượng đào tạo (Khách hàng B2B/B2C vs Nội bộ Nhân sự)
* **Đối tượng 1 - Khách hàng / Học viên ngoài:** Mua khóa học qua cổng thanh toán, tự do học, nhận chứng nhận hoàn thành.
* **Đối tượng 2 - Nhân viên nội bộ (Đào tạo nghề F&B):** Được phân quyền tự động theo phòng ban/vị trí từ HRM, có KPI thời hạn hoàn thành bắt buộc, kết quả học ảnh hưởng đến đánh giá nhân sự.

---

## 3. TỔNG HỢP PHẠM VI FUNCTION DỰ ÁN CHO MODULE LMS

```
TỔNG SỐ CHỨC NĂNG HỢP ĐỒNG: 25 Nhóm chức năng lớn (tương đương ~45 - 50 Sub-functions chi tiết)
├── 1. Phân hệ Học viên (Learner Portal): 12 Chức năng
├── 2. Phân hệ Giảng viên / Đào tạo (Instructor): 8 Chức năng
├── 3. Phân hệ Quản trị & Báo cáo (Admin/HRM): 10 Chức năng
├── 4. Phân hệ Chống sao chép & Bảo mật Video: 4 Chức năng
└── 5. Phân hệ Chuyển đổi & Đồng bộ Dữ liệu cũ (Migration Engine): 14 Chức năng
```