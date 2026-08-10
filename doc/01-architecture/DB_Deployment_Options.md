# ☁️ PHÂN TÍCH ĐỘ ỔN ĐỊNH & CÁC OPTION DEPLOY DATABASE FREE

> **Mục đích:** Đánh giá độ ổn định của Supabase Free Tier và so sánh tất cả các nền tảng Host Database Free tốt nhất hiện nay (Neon, Supabase, Turso, Render...).  
> **Đường dẫn lưu:** `doc/DB_Deployment_Options.md`  
> **Tham chiếu:** [[Supabase_Database_Analysis]] · [[Backend_Setup_Guide]] · [[Database_Design_Document]]

---

## 1. ĐÁNH GIÁ ĐỘ ỔN ĐỊNH CỦA SUPABASE FREE TIER

### 1.1. Supabase Free Tier có ổn định không?
* **Cực kỳ ổn định (Chuẩn Production)**: Supabase chạy trên hạ tầng đám mây của AWS (Amazon Web Services), độ khả dụng (Uptime) đạt **99.9%**.
* **Dung lượng Free**: 
  * **500MB Database PostgreSQL**: Thoải mái lưu trữ hàng trăm nghìn đến hàng triệu dòng dữ liệu cho dự án học tập/demo/sản phẩm nhỏ.
  * **1GB Storage**: Lưu trữ file, ảnh, tài liệu.
  * **5GB Băng thông (Egress) / tháng**.

### 1.2. Lưu ý quan trọng về chính sách "Pause Project" của Supabase:
* Nếu dự án của bạn **không có bất kỳ HTTP Request nào truy cập DB trong 7 ngày liên tiếp**, Supabase sẽ chuyển DB sang trạng thái **Tạm dừng (Pause)** để tiết kiệm tài nguyên Cloud.
* **Cách khắc phục:** Dữ liệu **KHÔNG bị mất**. Bạn chỉ cần mở Supabase Dashboard bấm nút **"Restore Project"**, DB sẽ hoạt động trở lại bình thường sau 1 - 2 phút.

---

## ⚡ 2. CÁC OPTION DEPLOY DATABASE FREE TỐT NHẤT HIỆN NAY

Dưới đây là 4 lựa chọn hàng đầu cho việc Deploy Database Free, được cộng đồng lập trình viên thế giới tin dùng:

### 🏆 1. Neon Postgres (Neon.tech) — Lựa chọn Hàng Đầu cho Prisma
* **Loại DB**: Serverless PostgreSQL thuần túy.
* **Dung lượng Free**: 500MB Storage.
* **Ưu điểm vượt trội**:
  * **Auto-Resume (Tự động thức giấc)**: Khi dự án lâu không dùng, Neon sẽ đi ngủ (Sleep). Nhưng ngay khi có 1 Request API gửi tới, Neon sẽ **tự động thức giấc trong < 1 giây** mà bạn không cần phải vào trang chủ bấm Restore như Supabase!
  * **Tích hợp sâu với Prisma ORM**: Neon có plugin `@neondatabase/serverless` tối ưu kết nối mượt mà cho Prisma.
  * **Database Branching**: Cho phép tạo nhánh DB riêng để test như `git branch`.

---

### 🥈 2. Supabase (Supabase.com) — Lựa chọn Toàn Diện
* **Loại DB**: Managed PostgreSQL + Auth + Storage.
* **Dung lượng Free**: 500MB DB + 1GB Storage.
* **Ưu điểm**: Cung cấp cả Cloud File Storage để upload Video/Ảnh bài học mà các dịch vụ khác không có.
* **Nhược điểm**: Bị Pause dự án sau 7 ngày không có request (Phải vào Dashboard bấm Restore thủ công).

---

### 🥉 3. Turso (Turso.tech) — Khủng Nhất Cho SQLite
* **Loại DB**: Serverless SQLite (libSQL).
* **Dung lượng Free**: **9GB Storage** + 1 tỷ lượt đọc/tháng (Dung lượng lớn nhất trong tất cả các dịch vụ Free!).
* **Ưu điểm**: Nếu dự án LogiX ban đầu dùng SQLite (`provider = "sqlite"` trong Prisma), bạn chỉ cần đổi URL kết nối sang Turso là xong. Không bị Pause hay xóa DB.

---

### ⚠️ 4. Render.com PostgreSQL (Nên Tránh Cho Lâu Dài)
* **Loại DB**: Managed PostgreSQL.
* **Dung lượng Free**: 1GB DB.
* **Hạn chế LỚN**: DB Free của Render sẽ **TỰ ĐỘNG XÓA VĨNH VIỄN (Expire) sau 90 ngày** nếu không nâng cấp trả phí ($7/tháng). Chỉ thích hợp cho đồ án môn học nộp tuần tới.

---

## 📊 BẢNG SO SÁNH TỔNG HỢP CÁC OPTION DEPLOY DB FREE

| Nền tảng | Loại DB | Dung lượng | Tự động khôi phục (Auto-resume)? | Đánh giá phù hợp dự án LogiX |
| :--- | :--- | :---: | :---: | :--- |
| **Neon.tech** | PostgreSQL | 500MB | **✅ Có (Tự thức giấc trong 1s)** | **⭐ Hạng 1 (Tốt nhất cho Prisma + Node.js)** |
| **Supabase** | PostgreSQL | 500MB | ❌ Không (Cần bấm Restore thủ công) | **⭐ Hạng 2 (Cần thiết nếu dùng File Storage)** |
| **Turso** | SQLite | 9GB | **✅ Có (Chạy liên tục không ngủ)** | **⭐ Hạng 3 (Dành cho SQLite)** |
| **Render** | PostgreSQL | 1GB | ❌ Xóa vĩnh viễn sau 90 ngày | ❌ KHÔNG NÊN DÙNG LÂU DÀI |

---

## 🎯 ĐỀ XUẤT LỰA CHỌN CHO BẠN

1. **Nếu bạn chỉ cần Database Postgres chạy mượt với Prisma & Node.js, không sợ bị pause dự án**: 
   👉 **Dùng Neon.tech**. Cực kỳ nhẹ nhàng, đăng nhập bằng GitHub, copy chuỗi `DATABASE_URL` dán vào `.env` là xong.

2. **Nếu bạn muốn vừa có DB Postgres vừa muốn có chỗ Upload Video/Ảnh làm web LMS**:
   👉 **Dùng Supabase**.
