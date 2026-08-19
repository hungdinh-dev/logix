# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SOFTWARE REQUIREMENTS SPECIFICATION - SRS)
### **Dự án: Hệ thống Quản trị Doanh nghiệp Tập trung (LogiX / Horeca)**
**Tài liệu tham chiếu:** SRS-LOGIX-GD1 | **Phiên bản:** `v1.0` | **Tác giả:** Đội ngũ BA & Tech Lead

---

## 1. GIỚI THIỆU TỔNG QUAN (INTRODUCTION)

### 1.1. Mục đích tài liệu
Tài liệu này đặc tả chi tiết toàn bộ yêu cầu chức năng (Functional Requirements), yêu cầu phi chức năng (Non-Functional Requirements), cấu trúc luồng dữ liệu, quy tắc nghiệp vụ và giao diện người dùng của hệ thống **LogiX ERP Giai đoạn 1**. Đây là căn cứ kỹ thuật duy nhất để:
- Đội ngũ Lập trình (Dev) xây dựng Backend, Frontend, Database, API.
- Đội ngũ Kiểm thử (QA) viết Test Cases và kịch bản kiểm thử.
- Khách hàng và Ban Quản lý dự án đối chiếu, nghiệm thu tính năng.

### 1.2. Phạm vi hệ thống Giai đoạn 1 (GD1 System Scope)
Giai đoạn 1 tập trung vào 3 phân hệ lõi với tổng cộng **78 Use Cases**:
1. **Phân hệ Chuỗi Cung Ứng & Sản Xuất (SCM & FIN):** Quản lý NCC, Đề xuất mua hàng (PR), Đơn mua hàng (PO), Quản lý Kho đa điểm, Kiểm kê, Quản lý Hạn sử dụng (FEFO/FIFO), Định mức món ăn (BOM), Giá thành và Công nợ phải trả NCC.
2. **Phân hệ Bán hàng & Doanh thu (CRM & POS & FIN):** Quản lý khách hàng B2B, Báo giá, Hợp đồng, Điểm bán lẻ POS tại cửa hàng, In bếp KDS, Tích điểm thành viên, Cổng thanh toán VietQR/Thẻ, Xuất HĐĐT E-Invoice, Doanh thu & P&L.
3. **Phân hệ Quản trị Nhân sự Lõi (HRM):** Hồ sơ nhân sự điện tử, Sơ đồ tổ chức, Xếp ca xoay/gãy, Tích hợp máy chấm công & GPS, Đơn từ online (Nghỉ phép/Công tác), Bảng lương tự động tính hoa hồng từ POS/CRM.

---

## 2. KIẾN TRÚC TỔNG THỂ & THIẾT KẾ CƠ SỞ DỮ LIỆU (SYSTEM ARCHITECTURE & ERD)

### 2.1. Sơ đồ kiến trúc tầng (Multi-tier Architecture)
- **Frontend Layer:** Web Admin (React/Next.js), Mobile App Nhân viên (Flutter/React Native), POS Client.
- **Backend API Layer:** RESTful / GraphQL API, Microservices / Modular Monolith, JWT Authentication & RBAC.
- **Data Layer:** PostgreSQL (Dữ liệu quan hệ, ACID hạch toán), Redis (Cache dữ liệu tồn kho, phân ca & phiên POS).

### 2.2. Thiết kế Cơ sở Dữ liệu Tổng thể (ERD Core Entities)
- `Users`, `Roles`, `Permissions`, `Departments`, `Employees`
- `Suppliers`, `Purchase_Requests`, `Purchase_Orders`, `Goods_Receipt_Notes`, `Warehouses`, `Inventory_Stocks`, `Stock_Batches`
- `Customers`, `Leads`, `Sales_Orders`, `POS_Sessions`, `POS_Orders`, `Order_Items`, `Invoices`
- `Work_Shifts`, `Attendance_Logs`, `Leave_Requests`, `Salary_Structures`, `Payrolls`

---

## 3. ĐẶC TẢ CHI TIẾT CÁC YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)

*(Cấu trúc chuẩn đặc tả từng Use Case được tổng hợp từ Phiếu khảo sát thực tế)*

### 3.1. Phân hệ SCM (Chuỗi cung ứng & Kho)
```markdown
#### [UC-SCM-001]: Lập và Phê duyệt Phiếu đề nghị mua hàng (Purchase Request - PR)
- **Actor:** Quản lý kho / Bếp trưởng (Tạo) -> Trưởng phòng Mua hàng / Ban Giám đốc (Duyệt).
- **Trigger:** Tồn kho chạm ngưỡng min hoặc phát sinh đơn hàng lớn.
- **Input Data:** Mã nguyên vật liệu, Tên hàng, Số lượng cần, Ngày cần hàng, Đơn vị đề xuất, Lý do.
- **Main Flow:**
  1. Actor vào menu Mua hàng -> Chọn "Tạo đề xuất mua hàng".
  2. Hệ thống tự động gợi ý danh sách hàng dưới ngưỡng an toàn (Safety Stock).
  3. Actor điều chỉnh số lượng và nhấn "Gửi duyệt".
  4. Hệ thống kiểm tra hạn mức giá trị:
     - Giá trị < 20 triệu: Gửi thông báo đến Trưởng phòng duyệt.
     - Giá trị >= 20 triệu: Gửi thông báo đến Ban Giám đốc duyệt.
  5. Cấp duyệt nhận thông báo trên App/Web và chọn "Phê duyệt" hoặc "Từ chối" (kèm lý do).
- **Business Rules:**
  - [BR-SCM-01]: Không cho phép gửi đề nghị mua hàng nếu mã hàng đang bị khóa ngừng kinh doanh.
  - [BR-SCM-02]: Thời gian phê duyệt tối đa 24h; nếu quá hạn, hệ thống tự động nhắc nhở (Reminder).
- **Output:** PR đổi trạng thái `APPROVED` -> Tự động chuyển sang danh sách chờ tạo PO của bộ phận Mua hàng.
```

### 3.2. Phân hệ HRM (Nhân sự & Chấm công - Lương)
```markdown
#### [UC-HRM-042]: Tự động tổng hợp dữ liệu Bảng lương (Payroll Calculation)
- **Actor:** Chuyên viên C&B / Trưởng phòng Nhân sự.
- **Trigger:** Đến ngày chốt lương hàng tháng (sau khi đã chốt Bảng chấm công).
- **Input Data:** Dữ liệu chấm công thực tế, Bảng doanh số bán hàng từ POS/CRM, Danh sách thưởng/phạt, Hồ sơ lương nhân viên.
- **Main Flow:**
  1. C&B chọn tháng tính lương và nhấn "Tạo bảng lương mới".
  2. Hệ thống tự động tính toán theo công thức:
     `Tổng thu nhập = Lương cơ bản/Ngày công chuẩn * Ngày công thực tế + Phụ cấp + Lương OT + Hoa hồng POS/CRM - Giảm trừ (BHXH + Thuế + Phạt)`.
  3. C&B rà soát, điều chỉnh thủ công nếu có ngoại lệ và gửi Trưởng phòng HR & Kế toán trưởng duyệt.
  4. Sau khi duyệt, hệ thống tự động sinh Phiếu lương điện tử (Payslip) gửi về App từng nhân viên.
- **Business Rules:**
  - [BR-HRM-01]: Trích đóng BHXH 10.5% trên mức lương tham gia bảo hiểm theo luật định.
  - [BR-HRM-02]: Sau khi Bảng lương chuyển trạng thái `LOCKED`, không ai được chỉnh sửa trừ khi có phê duyệt mở lại từ CEO.
```

### 3.3. Phân hệ CRM & POS & FIN (Bán hàng & Doanh thu)
```markdown
#### [UC-POS-003]: Thanh toán hóa đơn bằng mã VietQR động & In Bill
- **Actor:** Nhân viên thu ngân tại quầy.
- **Input Data:** Danh sách món ăn/sản phẩm đã order, Mã voucher/khuyến mãi, Thông tin khách VIP.
- **Main Flow:**
  1. Thu ngân chọn hình thức "Chuyển khoản QR".
  2. Hệ thống sinh mã VietQR động chứa chính xác số tiền cần thanh toán và mã hóa đơn.
  3. Khách hàng quét mã thanh toán qua ứng dụng ngân hàng.
  4. Hệ thống nhận Webhook/IPN xác nhận tiền về tài khoản trong 2-3 giây -> Tự động đánh dấu `PAID` và in Bill thanh toán.
  5. Dữ liệu trừ tồn kho nguyên vật liệu tương ứng (BOM) và ghi nhận doanh thu vào ca bán hàng.
```

---

## 4. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS - NFR)

- **Hiệu năng (Performance):** Thời gian phản hồi API < 500ms; Tốc độ in bill POS và sinh mã QR < 2s.
- **Khả năng chịu tải (Scalability):** Hệ thống đáp ứng đồng thời ít nhất 200 điểm bán hoạt động cùng lúc không giật lag.
- **Bảo mật (Security):** Mã hóa mật khẩu chuẩn Bcrypt; Mã hóa đường truyền SSL/TLS; Phân quyền chặt chẽ theo vai trò (RBAC) và lưu vết truy vết toàn bộ thao tác (Audit Log).
- **Tính khả dụng (Availability):** Cam kết Uptime 99.5%; Tự động sao lưu dữ liệu (Backup) định kỳ hàng ngày vào 02:00 sáng.

---

## 5. BIỂU MẪU KÝ DUYỆT TÀI LIỆU SRS (SIGN-OFF)

<br>

| ĐẠI DIỆN KHÁCH HÀNG (Duyệt nghiệp vụ) | ĐẠI DIỆN ĐƠN VỊ TRIỂN KHAI (Tech Lead / BA) |
|:---:|:---:|
| *(Ký, ghi rõ họ tên và đóng dấu)* <br><br><br><br> .................................................................................... | *(Ký, ghi rõ họ tên và đóng dấu)* <br><br><br><br> .................................................................................... |
