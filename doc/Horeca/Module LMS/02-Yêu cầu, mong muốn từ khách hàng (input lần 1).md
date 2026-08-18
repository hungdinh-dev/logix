# ĐỀ ÁN & TÀI LIỆU YÊU CẦU TÍNH NĂNG HỆ THỐNG LMS (HỌC TRỰC TUYẾN F&B)

> **Lưu ý trọng tâm:** Quan trọng nhất là phần chuyển dữ liệu từ web cũ sang.  
> **Định hướng hệ thống:** Mô hình đào tạo online về pha chế, vận hành quán, quản lý F&B; xây dựng theo hướng **LMS (Learning Management System)** chuyên nghiệp thay vì chỉ là website bán khóa học đơn thuần.  
> *(Tham khảo: Nhi Vinbar)*

---

## 1. Tính năng dành cho học viên

### A. Đăng ký & tài khoản
* Đăng ký bằng Email/SĐT
* Đăng nhập, quên mật khẩu
* Đăng nhập Google/Facebook (tùy chọn)
* Hồ sơ cá nhân
* Quản lý khóa học đã mua

### B. Mua khóa học
* **Thông tin khóa học:**
  * Danh sách khóa học
  * Trang giới thiệu chi tiết khóa học
  * Nội dung học
  * Giảng viên
  * Thời lượng
  * Học viên phù hợp
  * Chứng chỉ sau khóa học
* **Thanh toán online:**
  * Chuyển khoản
  * VNPay
  * MoMo
  * Thẻ tín dụng
* Xuất hóa đơn (nếu cần)

### C. Kích hoạt khóa học
* Tự động mở khóa sau thanh toán  
* *hoặc* Nhập mã kích hoạt (Voucher/Code)

### D. Học tập
* Xem video trực tuyến
* Xem trên điện thoại, máy tính
* Tài liệu PDF đính kèm
* Download giáo trình (nếu cho phép)
* Đánh dấu bài học đã hoàn thành
* Tiếp tục học từ vị trí đang xem dở

### E. Theo dõi tiến độ
* % hoàn thành khóa học
* Tổng thời gian đã học
* Số bài đã hoàn thành
* Lịch sử học tập
* Nhắc nhở học tiếp
* **Ví dụ trực quan:**
  > **Khóa học Barista Chuyên nghiệp**  
  > Tiến độ: `75%`  
  > ▶ *Bài 4 đang học*

### F. Kiểm tra & đánh giá
* Quiz sau mỗi chương
* Bài kiểm tra cuối khóa
* Chấm điểm tự động
* Điều kiện đạt chứng chỉ

### G. Chứng nhận
* Tự động cấp chứng nhận khi hoàn thành
* **Chứng nhận bao gồm:**
  * Họ tên
  * Mã chứng nhận
  * QR xác thực
  * Ngày cấp
  * Tải PDF

### H. Tương tác cộng đồng
* Bình luận dưới từng bài học
* Đặt câu hỏi
* Giảng viên trả lời
* Like câu trả lời hữu ích
* Thông báo khi được phản hồi

### I. Đánh giá khóa học
* **Sau khi học xong:**
  * ⭐⭐⭐⭐⭐ Đánh giá sao
  * Nhận xét
  * Góp ý nội dung

---

## 2. Tính năng dành cho giảng viên

### Quản lý khóa học
* Tạo khóa học
* Chỉnh sửa khóa học
* Phân loại khóa học

### Upload nội dung
* Video
* PDF
* PPT
* Hình ảnh
* File Excel

### Cấu trúc khóa học
```text
Khóa học
└── Chương
    └── Bài học
```

### Quản lý học viên
* Danh sách học viên
* Tiến độ học
* Điểm kiểm tra
* Chứng chỉ đã cấp

---

## 3. Tính năng dành cho quản trị viên (Admin)

### Dashboard tổng quan
* **Hiển thị:**
  * Tổng doanh thu
  * Tổng học viên
  * Số khóa học
  * Tỷ lệ hoàn thành
  * Tỷ lệ mua khóa học

### Quản lý đơn hàng
* Đơn hàng
* Thanh toán
* Hoàn tiền
* Mã giảm giá

### Quản lý chứng chỉ
* Tạo mẫu chứng chỉ
* Thu hồi chứng chỉ
* Tra cứu chứng chỉ

### Báo cáo
* Doanh thu theo tháng
* Doanh thu theo khóa học
* Tỷ lệ hoàn thành
* Video được xem nhiều nhất
* Bài học bị bỏ dở nhiều nhất

---

## 4. Tính năng chống chia sẻ tài khoản
*(Vì khóa học có giá trị cao nên cần có các giải pháp bảo vệ bản quyền:)*
* Giới hạn số thiết bị đăng nhập
* Không cho xem đồng thời nhiều thiết bị
* Ghi nhận IP
* Watermark tên học viên trên video
* Chống tải video
* Video streaming bảo mật

---

## 5. Tính năng AI nên có (Giai đoạn 2)
> *Đây là điểm khác biệt giúp nền tảng nổi bật hơn các LMS thông thường.*
* **AI Trợ lý học tập**
* **AI Quiz:** Sinh câu hỏi tự động từ bài giảng
* **AI Tóm tắt bài học**
* **AI Gợi ý khóa học tiếp theo**

---

## 6. Kiến trúc khóa học phù hợp với HORECAVN
* **Nhóm 1:** Pha chế
* **Nhóm 2:** Vận hành

---

## 7. Yêu cầu giao diện Website

### A. Trang chủ
* Banner/Slider giới thiệu khóa học
  * Slide tự động chạy
  * Hình ảnh đẹp, chuyên nghiệp
  * CTA (Call To Action) rõ ràng
* Khu vực Khóa học nổi bật (HOT)
* Giới thiệu giảng viên
* Video review
* Popup khuyến mại

---

## 8. Blog chia sẻ kiến thức
* Các bài viết chia sẻ
* Nội dung tối ưu SEO