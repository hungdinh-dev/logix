# KỊCH BẢN KIỂM THỬ UAT, BIÊN BẢN NGHIỆM THU & BÀN GIAO
### **(USER ACCEPTANCE TESTING & FINAL PROJECT ACCEPTANCE)**
**Dự án:** Triển khai Hệ thống Quản trị Doanh nghiệp (LogiX / Horeca)  
**Phạm vi nghiệm thu:** Giai đoạn 1 (78 Use Cases thuộc SCM, CRM, POS, FIN, HRM)

---

# PHẦN 1: BẢNG KỊCH BẢN KIỂM THỬ CHẤP NHẬN NGƯỜI DÙNG (UAT SCRIPT)
*(Khách hàng trực tiếp thao tác trên môi trường UAT / Staging với dữ liệu thực tế)*

### Phân hệ 1: Chuỗi Mua hàng – Kho – Kế toán Công nợ (SCM & FIN)
- [ ] **Kịch bản UAT-SCM-01:** Lập đề nghị mua hàng (PR) ➔ Cấp trên nhận thông báo duyệt trên App ➔ Tự động chuyển sang Đơn mua hàng (PO).  
  *Người thực hiện kiểm thử (Bên A):* ................................................................ | *Kết quả:* `[  ]` Đạt `[  ]` Chưa đạt  
  *Ý kiến phản hồi:* ....................................................................................................................................................
- [ ] **Kịch bản UAT-SCM-02:** Nhập kho theo PO ➔ In phiếu nhập ➔ Hệ thống tự động ghi nhận công nợ NCC vào phân hệ Kế toán (FIN).  
  *Người thực hiện kiểm thử (Bên A):* ................................................................ | *Kết quả:* `[  ]` Đạt `[  ]` Chưa đạt  
  *Ý kiến phản hồi:* ....................................................................................................................................................
- [ ] **Kịch bản UAT-SCM-03:** Xuất kho nguyên vật liệu chế biến theo định mức BOM ➔ Hệ thống tự động tính giá thành thành phẩm.  
  *Người thực hiện kiểm thử (Bên A):* ................................................................ | *Kết quả:* `[  ]` Đạt `[  ]` Chưa đạt  
  *Ý kiến phản hồi:* ....................................................................................................................................................

### Phân hệ 2: Nhân sự – Phân ca – Chấm công – Tính lương (HRM)
- [ ] **Kịch bản UAT-HRM-01:** Xếp ca làm việc cho nhân viên chi nhánh ➔ Nhân viên check-in thành công qua App bằng Wi-Fi/GPS.  
  *Người thực hiện kiểm thử (Bên A):* ................................................................ | *Kết quả:* `[  ]` Đạt `[  ]` Chưa đạt  
  *Ý kiến phản hồi:* ....................................................................................................................................................
- [ ] **Kịch bản UAT-HRM-02:** Nhân viên nộp đơn xin nghỉ phép trên App ➔ Quản lý duyệt ➔ Hệ thống tự động trừ quỹ phép năm.  
  *Người thực hiện kiểm thử (Bên A):* ................................................................ | *Kết quả:* `[  ]` Đạt `[  ]` Chưa đạt  
  *Ý kiến phản hồi:* ....................................................................................................................................................
- [ ] **Kịch bản UAT-HRM-03:** Tự động chốt bảng lương tháng kèm hoa hồng từ POS ➔ Xuất phiếu lương điện tử (Payslip) về máy nhân viên.  
  *Người thực hiện kiểm thử (Bên A):* ................................................................ | *Kết quả:* `[  ]` Đạt `[  ]` Chưa đạt  
  *Ý kiến phản hồi:* ....................................................................................................................................................

### Phân hệ 3: Bán hàng B2B / Bán lẻ POS – Doanh thu – Xuất Hóa đơn (CRM, POS & FIN)
- [ ] **Kịch bản UAT-POS-01:** Mở ca bán lẻ POS ➔ Order món ➔ In bếp KDS ➔ Thanh toán bằng mã VietQR động ➔ In Bill.  
  *Người thực hiện kiểm thử (Bên A):* ................................................................ | *Kết quả:* `[  ]` Đạt `[  ]` Chưa đạt  
  *Ý kiến phản hồi:* ....................................................................................................................................................
- [ ] **Kịch bản UAT-POS-02:** Phát hành Hóa đơn điện tử (E-Invoice) từ đơn hàng POS ➔ Đồng bộ doanh thu vào Báo cáo P&L theo cửa hàng.  
  *Người thực hiện kiểm thử (Bên A):* ................................................................ | *Kết quả:* `[  ]` Đạt `[  ]` Chưa đạt  
  *Ý kiến phản hồi:* ....................................................................................................................................................

---

# PHẦN 2: BIÊN BẢN NGHIỆM THU & BÀN GIAO CHÍNH THỨC (FINAL HANDOVER CERTIFICATE)

- **Thời gian:** Ngày ....... tháng ....... năm 2026
- **Địa điểm:** Văn phòng Doanh nghiệp Khách hàng

### 1. Danh mục bàn giao hoàn chỉnh
1. **Hệ thống phần mềm:** Toàn bộ mã nguồn/bản cài đặt trên môi trường Production, Database, Domain, SSL.
2. **Bộ tài liệu bàn giao:**
   - Bộ Tài liệu hướng dẫn sử dụng cho người dùng cuối (User Manual) dạng PDF & Video clip.
   - Tài liệu Hướng dẫn Quản trị Hệ thống & Vận hành (Deployment Guide, Backup & Recovery Runbook).
   - Tài liệu Thiết kế Kỹ thuật (SRS, ERD, API Swagger Documentation).
3. **Đào tạo người dùng:** Đã hoàn thành đào tạo 100% cho đội ngũ Quản lý Kho, Thu ngân POS, Kế toán và Cán bộ Nhân sự HR.

### 2. Kết luận nghiệm thu
- Hai bên cùng thống nhất: Hệ thống **LogiX ERP Giai đoạn 1** đã đáp ứng đầy đủ các yêu cầu theo Hợp đồng và Tài liệu đặc tả SRS v1.0.
- Khách hàng (Bên A) chính thức **ĐỒNG Ý NGHIỆM THU** và đưa hệ thống vào vận hành chính thức (Go-Live).
- Hệ thống chính thức chuyển sang giai đoạn **Bảo hành & Hỗ trợ kỹ thuật (SLA)** trong thời gian ............ tháng kể từ ngày ký biên bản.

---

## CAM KẾT HỖ TRỢ DỊCH VỤ & BẢO HÀNH (SLA TERMS)

- **Kênh tiếp nhận hỗ trợ:** Hotline kỹ thuật: ....................................... | Email: .......................................
- **Thời gian phản hồi sự cố khẩn cấp (Sập hệ thống, Lỗi POS bán hàng):** Trong vòng **30 – 60 phút** (24/7).
- **Thời gian phản hồi sự cố thông thường (Lỗi thao tác, hỏi nghiệp vụ):** Trong vòng **02 – 04 giờ làm việc** (Giờ hành chính).

---

## KÝ DUYỆT NGHIỆM THU VÀ BÀN GIAO CHÍNH THỨC

<br>

| ĐẠI DIỆN KHÁCH HÀNG (BÊN A) <br> *(Ký, ghi rõ họ tên và đóng dấu)* | ĐẠI DIỆN ĐƠN VỊ TRIỂN KHAI (BÊN B) <br> *(Ký, ghi rõ họ tên và đóng dấu)* |
|:---:|:---:|
| <br><br><br><br> ....................................................................................... | <br><br><br><br> ....................................................................................... |
