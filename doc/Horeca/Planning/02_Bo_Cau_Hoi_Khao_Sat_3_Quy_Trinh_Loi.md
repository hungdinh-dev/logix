# BỘ CÂU HỎI & CHECKLIST KHẢO SÁT 3 QUY TRÌNH NGHIỆP VỤ LÕI
### *Tài liệu phỏng vấn & ghi chép trực tiếp tại chỗ (Ngày 20/08/2026)*

> **Hướng dẫn sử dụng khi in ra:**  
> BA mang tài liệu này trong suốt các phiên phỏng vấn để bám sát sườn câu hỏi, đánh dấu tích chọn `[x]` các nghiệp vụ khách hàng đã xác nhận và ghi chép nhanh các Business Rules vào các dòng kẻ chấm.

---

## 🏛️ PHẦN 1: TỔNG QUAN DOANH NGHIỆP & MÔ HÌNH VẬN HÀNH (08:20 – 08:45)

- [ ] **Mô hình chuỗi / Chi nhánh:**
  - Số lượng điểm bán / Cửa hàng / Kho trung tâm hiện tại: ............................................................................................
  - Mô hình pháp lý: `[  ]` 1 Pháp nhân chia nhiều chi nhánh hạch toán phụ thuộc `[  ]` Nhiều công ty con độc lập
- [ ] **Phần mềm & Hệ thống hiện tại đang sử dụng (As-Is):**
  - Kế toán: `[  ]` Misa `[  ]` Fast `[  ]` Bravo `[  ]` Excel `[  ]` Khác: .................................................................................
  - Bán hàng/POS: `[  ]` KiotViet `[  ]` iPOS `[  ]` CukCuk `[  ]` Tự phát triển `[  ]` Khác: ...............................................
  - Chấm công / Nhân sự: `[  ]` Máy vân tay/Khuôn mặt `[  ]` App chấm công `[  ]` Excel `[  ]` Khác: .............................

---

## 📦 PHẦN 2: QUY TRÌNH A — MUA HÀNG ➔ NHẬP KHO ➔ CÔNG NỢ NCC ➔ SẢN XUẤT (08:45 – 10:55)
*(Phạm vi: SCM-001 ➔ SCM-038 & FIN-009 ➔ FIN-016)*

### A1. Yêu cầu Mua hàng & Đơn đặt hàng NCC (SCM-001 ➔ SCM-014)
- **1. Ai lập Phiếu đề nghị mua hàng (PR)?** `[  ]` Quản lý kho `[  ]` Cửa hàng trưởng `[  ]` Bộ phận Bếp/Sản xuất  
  - *Trigger lập PR:* `[  ]` Tồn kho chạm ngưỡng tối thiểu `[  ]` Theo định mức kế hoạch `[  ]` Đặt đột xuất
- **2. Quy trình phê duyệt PR / PO như thế nào?**
  - Hạn mức duyệt theo giá trị: Dưới .................. triệu: ................. duyệt; Trên .................. triệu: ................. duyệt.
  - Có áp dụng duyệt nhiều cấp trên điện thoại / App không? `[  ]` Có `[  ]` Không
- **3. Nhà cung cấp & Bảng giá:**
  - Có hợp đồng nguyên tắc / Bảng giá cố định theo thời kỳ không? `[  ]` Có `[  ]` Giá biến động theo ngày
  - Quản lý công nợ NCC: `[  ]` Trả ngay `[  ]` Công nợ gối đầu (theo hạn mức ......... triệu / thời hạn ......... ngày).

### A2. Nghiệp vụ Nhập - Xuất - Kiểm kê & Quản lý Tồn kho (SCM-011 ➔ SCM-038)
- **1. Quy trình giao nhận & Kiểm tra chất lượng (QC) đầu vào:**
  - Khi hàng về kho: Ai kiểm tra số lượng/chất lượng? ..............................................................................................
  - Xử lý khi hàng lỗi / thừa / thiếu so với PO: `[  ]` Lập biên bản từ chối nhận `[  ]` Nhận hàng thực tế & điều chỉnh PO
- **2. Quản lý Lô (Batch/Lot) & Hạn sử dụng (Exp Date):**
  - Nguyên tắc xuất kho: `[  ]` FIFO (Nhập trước xuất trước) `[  ]` FEFO (Hết hạn trước xuất trước) `[  ]` LIFO
  - Cảnh báo cận date trước bao nhiêu ngày? ..............................................................................................................
- **3. Chuyển kho nội bộ & Cân đối điều phối:**
  - Luồng chuyển kho giữa Kho tổng ➔ Cửa hàng / Giữa các Cửa hàng với nhau: .....................................................
  - Ai là người duyệt xuất kho chuyển và ai xác nhận nhập kho đến? .......................................................................
- **4. Kiểm kê kho & Xử lý hao hụt / Mất mát:**
  - Chu kỳ kiểm kê: `[  ]` Hàng ngày `[  ]` Hàng tuần `[  ]` Cuối tháng.
  - Tỷ lệ hao hụt cho phép (nếu có): ...................%. Thẩm quyền phê duyệt xử lý chênh lệch kiểm kê: ......................

### A3. Sản xuất / Chế biến & Định mức Nguyên vật liệu BOM (SCM-030 ➔ SCM-038)
- [ ] Có quản lý BOM (Bill of Materials) cho món ăn / combo / thành phẩm không? `[  ]` Có `[  ]` Không
- [ ] Trừ kho theo phương thức nào? `[  ]` Trừ kho NVL ngay khi bán món (Real-time) `[  ]` Trừ kho theo Lệnh sản xuất chốt cuối ngày
- [ ] Ghi chép cách tính giá thành thành phẩm: .............................................................................................................

### A4. Điểm chạm Kế toán - FIN (FIN-009 ➔ FIN-016)
- [ ] Đối soát 3 bên: Hóa đơn NCC vs Đơn mua hàng (PO) vs Phiếu nhập kho (GRN) thực hiện ở phòng nào?
  - `[  ]` Bộ phận Mua hàng đối soát trước ➔ Chuyển Kế toán thanh toán
  - `[  ]` Kế toán trực tiếp đối soát trên phần mềm
- [ ] Hình thức thanh toán NCC: `[  ]` Chuyển khoản `[  ]` Tiền mặt qua quỹ

---

## 👥 PHẦN 3: QUY TRÌNH C — VÒNG ĐỜI NHÂN SỰ CỐT LÕI (11:15 – 13:40)
*(Phạm vi: HRM-010, 011, 012, 038, 039, 042, 043, 046, 047, 048, 049, 008, 036)*

### C1. Cấu trúc Tổ chức & Hồ sơ Nhân sự (HRM-008, HRM-036)
- **1. Sơ đồ tổ chức & Phân cấp:** Khối Văn phòng, Khối Cửa hàng/Chi nhánh, Khối Kho/Vận hành.
- **2. Quản lý loại hợp đồng:** `[  ]` Thử việc `[  ]` Chính thức (Xác định / Không xác định thời hạn) `[  ]` Thời vụ / Part-time
- **3. Hồ sơ điện tử:** Lưu trữ CMND/CCCD, bằng cấp, hợp đồng, người phụ thuộc, lịch sử lương/khen thưởng/kỷ luật.

### C2. Phân ca & Chấm công (HRM-010, 011, 012, 038, 039)
- **1. Loại hình ca làm việc:**
  - Văn phòng: Giờ hành chính cố định (Từ ............... đến ...............).
  - Khối Cửa hàng / Điểm bán: Xoay ca / Gãy ca (Mô tả các ca: .................................................................................)
  - Nhân viên Part-time: Đăng ký ca linh hoạt theo tuần? `[  ]` Có `[  ]` Không
- **2. Hình thức chấm công thực tế:**
  - `[  ]` Máy chấm công (Vân tay/FaceID) ➔ Cần cơ chế đồng bộ dữ liệu tự động về Server/Cloud.
  - `[  ]` Chấm công qua App di động (GPS + Định vị Wi-Fi tại cửa hàng + Chụp ảnh khuôn mặt).
- **3. Quy tắc tính đi muộn / về sớm / tăng ca (OT):**
  - Đi muộn cho phép trong vòng: ................. phút. Khung phạt / trừ công đi muộn: .................................................
  - Tăng ca (OT): Có cần gửi Đơn đăng ký phê duyệt trước không? `[  ]` Bắt buộc duyệt trước `[  ]` Tự động tính theo giờ máy

### C3. Quản lý Nghỉ phép & Đơn từ điện tử (HRM-046, 047)
- **1. Chính sách Phép năm:** Số ngày phép tiêu chuẩn/năm: ................. ngày. Quy chế chuyển phép tồn sang năm sau: ............
- **2. Quy trình duyệt đơn (Nghỉ phép, Công tác, Giải trình chấm công quên check-in/out):**
  - Luồng duyệt: Nhân viên ➔ ........................................................ ➔ ........................................................ ➔ Nhân sự chốt.
  - Thời hạn gửi đơn giải trình: Trước ngày chốt công ................. hàng tháng.

### C4. Tính Lương (Payroll), Hoa hồng & Phúc lợi (HRM-042, 043, 048, 049)
- **1. Chu kỳ tính lương & Ngày chi trả:**
  - Chu kỳ tính công: Từ ngày ........... tháng này đến ngày ........... tháng sau.
  - Ngày thanh toán lương: Ngày ........... hàng tháng.
- **2. Cấu trúc bảng lương:**
  - `[  ]` Lương cơ bản đóng BHXH + Phụ cấp cố định (Ăn trưa, Xăng xe, Điện thoại, Trách nhiệm)
  - `[  ]` Lương KPI / Hoa hồng doanh số (Lấy trực tiếp từ dữ liệu bán hàng POS/CRM)
  - `[  ]` Lương làm thêm giờ OT (Hệ số ngày thường: 1.5, Ngày nghỉ: 2.0, Lễ Tết: 3.0)
  - `[  ]` Các khoản giảm trừ: BHXH (10.5%), Thuế TNCN, Tạm ứng, Phạt vi phạm / Đi muộn.
- **3. Quy trình chốt lương:** Bảng chấm công ➔ Bảng tính lương dự thảo ➔ Kế toán trưởng / Giám đốc duyệt ➔ Gửi Phiếu lương điện tử (Payslip qua App/Email).

---

## 💰 PHẦN 4: QUY TRÌNH B — BÁN HÀNG ➔ THU TIỀN ➔ GHI NHẬN DOANH THU (13:50 – 16:10)
*(Phạm vi: CRM-001 ➔ CRM-024, POS-001 ➔ POS-008 & FIN-001 ➔ FIN-008, FIN-024 ➔ FIN-028)*

### B1. Bán hàng B2B / Đại lý & Quản lý Khách hàng CRM (CRM-001 ➔ CRM-024)
- **1. Luồng tiếp nhận Lead & Phân bổ Sale:**
  - Kênh phát sinh: `[  ]` Hotline `[  ]` Fanpage/Zalo `[  ]` Giới thiệu `[  ]` Đội ngũ thị trường trực tiếp
  - Quy tắc phân bổ Lead cho nhân viên sale: `[  ]` Tự động xoay vòng `[  ]` Theo khu vực địa lý `[  ]` Quản lý gán tay
- **2. Báo giá, Đơn đặt hàng (SO) & Duyệt chiết khấu:**
  - Chính sách giá/chiết khấu: Hạn mức Sale được tự giảm giá: .............%. Nếu vượt quá cần ai phê duyệt? .................
  - Quản lý Hợp đồng & Công nợ Phải thu khách hàng: Hạn mức nợ (Credit Limit), cảnh báo nợ quá hạn.

### B2. Bán lẻ tại Điểm / Chuỗi Cửa hàng POS (POS-001 ➔ POS-008)
- **1. Thao tác bán lẻ & Giao dịch tại quầy:**
  - Mở ca / Khai báo số dư tiền mặt đầu ca ➔ Bán hàng ➔ Kết ca / Bàn giao tiền mặt & chốt doanh thu.
  - Tốc độ xử lý: Yêu cầu order món, in bill, in bếp (KDS/Kitchen Printer) như thế nào? .............................................
- **2. Chương trình Khuyến mãi / Thẻ thành viên (Loyalty):**
  - Tích điểm / Đổi quà / Voucher / Giảm giá theo nhóm khách VIP / Mã QR Code: ....................................................
- **3. Hình thức thanh toán tại quầy:**
  - `[  ]` Tiền mặt `[  ]` Thẻ ngân hàng (POS máy quẹt) `[  ]` VietQR động sinh mã theo đơn `[  ]` Ví điện tử `[  ]` Ghi nợ

### B3. Ghi nhận Doanh thu & Báo cáo Tài chính FIN (FIN-001 ➔ FIN-008, FIN-024 ➔ FIN-028)
- [ ] **Hóa đơn điện tử (E-Invoice):** Tích hợp phát hành HĐĐT từ phần mềm nào? `[  ]` VNPT `[  ]` Viettel `[  ]` M-Invoice `[  ]` Khác.
  - Cơ chế xuất hóa đơn: `[  ]` Từng đơn lẻ `[  ]` Gom bảng kê cuối ngày.
- [ ] **Báo cáo P&L (Lãi/Lỗ) quản trị:** Khách hàng cần xem P&L theo:
  - `[  ]` Toàn công ty `[  ]` Từng chi nhánh / Cửa hàng `[  ]` Từng kênh bán (B2B, B2C, Online) `[  ]` Từng ngành hàng.

---

## 🚚 PHẦN 5: DỰ PHÒNG — LOGISTICS & ĐIỀU PHỐI GIAO HÀNG (16:10 – 16:25)
*(Phạm vi nhanh: LOG-001 ➔ LOG-004)*

- [ ] Phương thức vận chuyển: `[  ]` Đội xe nội bộ tự giao `[  ]` Thuê bên thứ 3 (Ahamove, Grab, GHTK, ViettelPost)
- [ ] Quản lý đội xe: Biển số xe, tải trọng, tài xế, định mức nhiên liệu, lịch bảo dưỡng.
- [ ] Quy trình giao hàng & Đối soát COD: Ai thu tiền COD? Nộp lại quỹ vào thời điểm nào? .......................................

---
**Ghi chú tổng kết của BA:** ...................................................................................................................................................
.....................................................................................................................................................................................................
