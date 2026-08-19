# KẾ HOẠCH KIỂM THỬ & KHUNG TEST CASE CHUẨN (TEST PLAN & TEST CASES)
### **Dự án: Hệ thống Quản trị Doanh nghiệp LogiX / Horeca**
**Phân hệ áp dụng:** SCM, CRM, POS, FIN, HRM (Giai đoạn 1) | **Phiên bản:** `v1.0`

---

## 1. MỤC TIÊU & CHIẾN LƯỢC KIỂM THỬ (TEST STRATEGY)

- **Mục tiêu:** Đảm bảo hệ thống vận hành chính xác 100% theo các Business Rules đã chốt trong SRS v1.0, không phát sinh lỗi nghiêm trọng (Critical/Blocker) trước khi bàn giao sang môi trường UAT cho khách hàng.
- **Các cấp độ kiểm thử áp dụng:**
  1. **Unit Testing (Dev):** Kiểm thử mức hàm, component, công thức tính toán (Lương, Thuế, BOM, Tồn kho).
  2. **Integration Testing (QA):** Kiểm thử liên phân hệ (POS bán hàng ➔ Trừ kho NVL ➔ Ghi nhận doanh thu FIN ➔ Đẩy KPI tính lương HRM).
  3. **System & Security Testing (QA/Sec):** Kiểm thử phân quyền RBAC, kiểm thử tải (Stress test), kiểm thử bảo mật dữ liệu.
  4. **User Acceptance Testing (UAT):** Khách hàng trực tiếp thao tác thử nghiệm theo dữ liệu thật.

---

## 2. TIÊU CHÍ CHẤP NHẬN CHẤT LƯỢNG (QUALITY GATES)

| Cấp độ lỗi (Severity) | Định nghĩa | Tiêu chí để chuyển sang UAT / Go-Live |
|:---:|---|:---:|
| **Critical / Blocker** | Lỗi làm sập hệ thống, mất dữ liệu, sai lệch tiền bạc/công nợ/lương, tắc nghẽn luồng chính. | **Bắt buộc 0 lỗi (0 unresolved)** |
| **Major** | Lỗi chức năng chính không chạy đúng, nhưng có giải pháp tạm thời (workaround). | **<= 2 lỗi (Được PM duyệt cam kết fix)** |
| **Minor / Cosmetic** | Lỗi giao diện, sai chính tả, căn lề chưa đẹp, font chữ chưa đồng bộ. | **Được phép tồn tại và fix trong Sprint kế tiếp** |

---

## 3. MẪU BẢNG ĐẶC TẢ TEST CASE CHI TIẾT (TEST CASE TEMPLATE)

### Phân hệ: Chuỗi cung ứng & Kho (SCM)

| Test Case ID | Tên kịch bản kiểm thử | Dữ liệu đầu vào (Input Data) | Các bước thực hiện (Test Steps) | Kết quả kỳ vọng (Expected Result) | Kết quả thực tế (Pass/Fail) | Người test & Ngày test |
|:---:|---|---|---|---|:---:|:---:|
| **TC-SCM-001** | Tạo đề xuất mua hàng (PR) tự động khi tồn kho dưới min | Mặt hàng: "Thịt bò Úc", Tồn thực tế: 5kg, Tồn min: 10kg | 1. Đăng nhập Quản lý kho<br>2. Mở màn hình gợi ý PR<br>3. Kiểm tra danh sách | Hệ thống tự động hiển thị dòng mặt hàng "Thịt bò Úc" với số lượng đề xuất đặt là 5kg. | `[ ]` Pass <br> `[ ]` Fail | QA: ................... <br> Ngày: ...../..... |
| **TC-SCM-002** | Chặn xuất kho vượt quá số lượng tồn thực tế (Âm kho) | Mặt hàng: "Rượu Vang", Tồn kho: 2 chai, Xuất: 3 chai | 1. Mở phiếu Xuất kho<br>2. Chọn mã hàng "Rượu Vang"<br>3. Nhập số lượng 3<br>4. Nhấn "Lưu & Xuất" | Hệ thống báo lỗi đỏ: "Số lượng tồn kho không đủ (Tồn: 2), không thể xuất âm". Chặn không cho lưu. | `[ ]` Pass <br> `[ ]` Fail | QA: ................... <br> Ngày: ...../..... |
| **TC-SCM-003** | Cảnh báo lô hàng cận hạn sử dụng theo chuẩn FEFO | Lô L01 (HSD: 3 ngày nữa), Lô L02 (HSD: 30 ngày) | 1. Mở màn hình Xuất nguyên liệu<br>2. Chọn món chế biến | Hệ thống tự động ưu tiên gợi ý xuất Lô L01 trước; hiển thị cảnh báo màu vàng "Lô hàng cận date". | `[ ]` Pass <br> `[ ]` Fail | QA: ................... <br> Ngày: ...../..... |

### Phân hệ: Nhân sự & Tính lương (HRM)

| Test Case ID | Tên kịch bản kiểm thử | Dữ liệu đầu vào (Input Data) | Các bước thực hiện (Test Steps) | Kết quả kỳ vọng (Expected Result) | Kết quả thực tế (Pass/Fail) | Người test & Ngày test |
|:---:|---|---|---|---|:---:|:---:|
| **TC-HRM-001** | Chấm công qua App bằng định vị GPS & Wi-Fi | Tọa độ GPS thực tế tại cửa hàng, Wi-Fi cửa hàng | 1. Mở App trên điện thoại<br>2. Bấm "Check-in"<br>3. Chụp ảnh xác thực | Hệ thống ghi nhận công thành công, hiển thị chính xác giờ vào ca và tên chi nhánh. | `[ ]` Pass <br> `[ ]` Fail | QA: ................... <br> Ngày: ...../..... |
| **TC-HRM-002** | Tự động tính phạt đi muộn quá số phút cho phép | Quy chế: Đi muộn > 15p phạt 50k. Nhân viên đi muộn 20p | 1. Chốt bảng công tháng<br>2. Xem dòng nhân viên A | Cột "Phạt đi muộn" tự động cộng 50.000 VNĐ vào danh sách các khoản giảm trừ lương. | `[ ]` Pass <br> `[ ]` Fail | QA: ................... <br> Ngày: ...../..... |
| **TC-HRM-003** | Lấy doanh số bán hàng từ POS tính hoa hồng nhân viên | Nhân viên Sale B chốt đơn POS trị giá 100tr, % HH = 2% | 1. Chạy bảng tính lương<br>2. Kiểm tra cột hoa hồng | Cột "Lương hoa hồng" hiển thị chính xác 2.000.000 VNĐ được đồng bộ từ module POS/CRM. | `[ ]` Pass <br> `[ ]` Fail | QA: ................... <br> Ngày: ...../..... |

---

## 4. BIỂU MẪU THEO DÕI & XỬ LÝ LỖI (BUG TRACKING LOG)

| Bug ID | Test Case ID liên quan | Tên lỗi & Mô tả ngắn gọn | Mức độ (Severity) | Module | Người phát hiện | Dev phụ trách | Trạng thái (Open / Fixed / Re-test / Closed) |
|:---:|:---:|---|:---:|:---:|:---:|:---:|:---:|
| **BUG-01** | TC-SCM-002 | Vẫn cho lưu phiếu xuất khi gõ số lượng âm (-5) | **Critical** | SCM | QA An | Dev Bình | `[  ]` Fixed `[  ]` Closed |
| **BUG-02** | TC-HRM-003 | Bảng lương chưa cộng tiền hoa hồng bán hàng online | **Major** | HRM | QA Lan | Dev Cường | `[  ]` Open `[  ]` Re-test |
| **BUG-03** | N/A | Nút in hóa đơn POS bị lệch 5px so với mockup | **Minor** | POS | QA An | Dev Dũng | `[  ]` Fixed `[  ]` Closed |

---

## 5. XÁC NHẬN KẾT QUẢ KIỂM THỬ NỘI BỘ (QA SIGN-OFF TRƯỚC UAT)

<br>

| LEAD QA / TESTER (Xác nhận kiểm thử) | TECH LEAD / PM (Xác nhận bàn giao UAT) |
|:---:|:---:|
| *(Ký và ghi rõ họ tên)* <br><br><br><br> .................................................................................... | *(Ký và ghi rõ họ tên)* <br><br><br><br> .................................................................................... |
