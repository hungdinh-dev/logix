# ĐIỀU LỆ DỰ ÁN (PROJECT CHARTER)
### **Dự án: Triển khai Hệ thống Quản trị Doanh nghiệp Horeca / LogiX**
**Mã dự án:** `LOGIX-HORECA-2026` | **Ngày ban hành:** 20/08/2026 | **Phiên bản:** `v1.0`

---

## 1. MỤC ĐÍCH & BỐI CẢNH DỰ ÁN (PROJECT BACKGROUND & PURPOSE)

- **Bối cảnh:** Doanh nghiệp đang mở rộng chuỗi cung ứng và điểm bán nhưng các khâu Mua hàng – Kho, Bán hàng – Doanh thu và Quản trị Nhân sự còn vận hành rời rạc trên nhiều công cụ (Excel, phần mềm cũ, sổ sách), dẫn đến số liệu chậm trễ, khó kiểm soát thất thoát và chi phí.
- **Mục tiêu chiến lược:**
  1. Xây dựng hệ thống phần mềm quản trị tập trung (All-in-one ERP/LogiX) kết nối xuyên suốt các phòng ban.
  2. Tự động hóa luồng phê duyệt (PR/PO, Nghỉ phép, Chiết khấu) và giảm thời gian chốt số liệu cuối tháng từ 7 ngày xuống còn 1 ngày.
  3. Cung cấp báo cáo P&L quản trị theo thời gian thực (Real-time) cho từng điểm bán / chi nhánh.

---

## 2. PHẠM VI DỰ ÁN (PROJECT SCOPE)

### 2.1. Trong phạm vi (In-Scope — Giai đoạn 1)
- **Chuỗi Mua hàng – Kho – Sản xuất (SCM & FIN):** Quy trình đề xuất mua hàng (PR), đơn đặt hàng (PO), nhập/xuất kho, quản lý hạn sử dụng (FEFO/FIFO), định mức BOM và đối soát công nợ NCC.
- **Chuỗi Bán hàng – Doanh thu (CRM & POS & FIN):** Quản lý khách hàng B2B, báo giá/hợp đồng, POS bán lẻ tại quầy, xuất hóa đơn điện tử E-Invoice, báo cáo doanh thu & P&L.
- **Vòng đời Nhân sự cốt lõi (HRM):** Quản lý hồ sơ nhân viên, phân ca làm việc, đồng bộ máy chấm công/App GPS, quản lý nghỉ phép, bảng lương (Payroll) và hoa hồng doanh số.

### 2.2. Ngoài phạm vi Giai đoạn 1 (Out-of-Scope — Chuyển GD2 / GD3)
- Tuyển dụng chuyên sâu & Đánh giá năng lực 360 độ (HRM mở rộng).
- Hệ thống E-Learning & Đào tạo nội bộ (LMS).
- Điều phối đội xe giao hàng chuyên sâu (LOG nâng cao & FSM).
- Nhắn tin nội bộ MES và tích hợp AI phân tích hành vi tiêu dùng.

---

## 3. CÁC MỐC TIẾN ĐỘ QUAN TRỌNG (KEY MILESTONES & TIMELINE)

| Giai đoạn | Mốc công việc (Milestone) | Thời gian dự kiến | Đầu ra bắt buộc (Deliverables) |
|:---:|---|:---:|---|
| **Phase 1** | Khởi tạo dự án & Kick-off | Tuần 1 (20/08 – 25/08) | Project Charter, RACI, Timeline đã ký |
| **Phase 2** | Khảo sát nghiệp vụ & Đặc tả chi tiết | Tuần 2 – Tuần 3 | Bộ Phiếu đặc tả, Change Log, MOM |
| **Phase 3** | Thiết kế hệ thống & Phê duyệt SRS | Tuần 4 – Tuần 5 | SRS, ERD Database, Wireframe/UI Mockup |
| **Phase 4** | Phát triển (Sprint Dev) & Kiểm thử (QA) | Tuần 6 – Tuần 13 | Hệ thống phần mềm, Test Case Log |
| **Phase 5** | Đào tạo, UAT & Go-Live nghiệm thu | Tuần 14 – Tuần 16 | Biên bản UAT, User Manual, Nghiệm thu |

---

## 4. CƠ CẤU TỔ CHỨC & MA TRẬN TRÁCH NHIỆM DỰ ÁN

```
                    [ BAN CHỈ ĐẠO DỰ ÁN (STEERING COMMITTEE) ]
                    (Đại diện Ban Giám đốc Khách hàng & Đơn vị Triển khai)
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
    [ PROJECT MANAGER - KHÁCH HÀNG ]              [ PROJECT MANAGER - ĐƠN VỊ TRIỂN KHAI ]
              │                                               │
   ┌──────────┴──────────┐                         ┌──────────┴──────────┐
   ▼                     ▼                         ▼                     ▼
[Key Users / Trưởng PB] [IT & Hạ tầng]         [Lead BA & Design]    [Tech Lead & Dev/QA]
(Kho, Bán hàng, KT, HR)
```

- **Quyền hạn phê duyệt thay đổi (Change Authority):**
  - Thay đổi logic nghiệp vụ không tăng man-days: `Lead BA` và `Key User` đồng thuận.
  - Thay đổi phạm vi tính năng / phát sinh man-days < 10%: `PM hai bên` phê duyệt.
  - Thay đổi ngân sách / tiến độ tổng thể > 10%: `Ban chỉ đạo dự án (Steering Committee)` phê duyệt.

---

## 5. RỦI RO CHÍNH & PHƯƠNG ÁN GIẢM THIỂU (RISK MANAGEMENT)

| Rủi ro tiềm ẩn | Mức độ | Phương án phòng ngừa & Xử lý |
|---|:---:|---|
| **Scope Creep (Phình phạm vi):** Khách hàng liên tục đòi hỏi tính năng mới ngoài GD1. | **Cao** | Bắt buộc áp dụng quy trình Change Request (CR) có đánh giá tác động chi phí/tiến độ. |
| **Trễ dữ liệu đầu vào:** Khách hàng chậm bàn giao bảng giá, file Excel chấm công/lương mẫu. | **TB** | Gán deadline cụ thể cho từng Key User; báo cáo escalate lên PM Khách hàng nếu trễ > 2 ngày. |
| **Kháng cự thay đổi (User Resistance):** Nhân viên quen dùng giấy tờ/Excel, ngại nhập phần mềm. | **Cao** | Đào tạo từng nhóm nhỏ theo kịch bản thực tế; thiết kế giao diện POS/HRM tối giản, thân thiện. |

---

## 6. PHÊ DUYỆT & HIỆU LỰC ĐIỀU LỆ

<br>

| ĐẠI DIỆN BAN GIÁM ĐỐC KHÁCH HÀNG | ĐẠI DIỆN ĐƠN VỊ PHÁT TRIỂN / TRIỂN KHAI |
|:---:|:---:|
| *(Ký, ghi rõ họ tên và đóng dấu)* <br><br><br><br> .................................................................................... | *(Ký, ghi rõ họ tên và đóng dấu)* <br><br><br><br> .................................................................................... |
