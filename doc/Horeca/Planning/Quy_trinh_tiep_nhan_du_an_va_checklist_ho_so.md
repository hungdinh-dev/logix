# QUY TRÌNH CHUYÊN NGHIỆP TIẾP NHẬN & TRIỂN KHAI DỰ ÁN DOANH NGHIỆP
### Kèm bộ checklist hồ sơ bắt buộc theo từng giai đoạn

---

## TỔNG QUAN 5 GIAI ĐOẠN

1. **Tiếp nhận & Khởi tạo dự án** — từ lúc ký hợp đồng đến kick-off
2. **Khảo sát nghiệp vụ (BA)** — như buổi 20/8 của bạn
3. **Thiết kế & Lập kế hoạch** — biến nghiệp vụ thành đặc tả kỹ thuật
4. **Phát triển & Kiểm thử** — team dev/QA thực thi
5. **Triển khai & Bàn giao** — go-live, đào tạo, và bước vào giai đoạn bảo trì (lặp lại nếu có phase tiếp theo hoặc issue phát sinh)

Nguyên tắc xuyên suốt: **mỗi giai đoạn đều phải có Input rõ ràng, Output rõ ràng, và ít nhất 1 tài liệu được khách hàng ký xác nhận trước khi chuyển giai đoạn tiếp theo.** Đây là thứ giúp bạn tránh việc "lăn tăn" giữa chừng — vì mọi quyết định đều có giấy trắng mực đen, không phải nhớ miệng.

---

## GIAI ĐOẠN 1 — TIẾP NHẬN & KHỞI TẠO DỰ ÁN

**Mục tiêu:** Chuyển giao thông tin từ Sales/Kinh doanh sang team Triển khai một cách đầy đủ, không bị "tam sao thất bản".

**Hoạt động chính:**
- Nhận bàn giao từ Sales: hợp đồng, phạm vi đã chốt, kỳ vọng khách hàng
- Thành lập team dự án, phân vai trò (dùng khung RACI có sẵn trong file Tổng quan của bạn)
- Họp kick-off nội bộ (team dự án) trước khi họp với khách hàng
- Họp kick-off với khách hàng: giới thiệu team, thống nhất kênh liên lạc, lịch trình tổng thể

**Hồ sơ BẮT BUỘC phải có trước khi kết thúc giai đoạn này:**

| # | Tên tài liệu | Mục đích | Template sẵn sàng trong thư mục | Ai giữ/tạo |
|---|---|---|---|---|
| 1 | Hợp đồng + Phụ lục phạm vi (SOW) | Căn cứ pháp lý, phạm vi đã chốt | Lưu trữ bản ký | PM |
| 2 | Project Charter (Điều lệ dự án) | Mục tiêu, phạm vi, ràng buộc, stakeholder, tiêu chí thành công | [06_Project_Charter_Dieu_Le_Du_An.md](06_Project_Charter_Dieu_Le_Du_An.md) | PM |
| 3 | Danh sách chức năng đã chốt theo module (file Excel bạn đang có) | Cơ sở đối chiếu xuyên suốt dự án | File Excel gốc / Tổng hợp | BA |
| 4 | Timeline tổng thể theo giai đoạn (GD1/GD2/GD3) | Khách hàng và team cùng nhìn 1 mốc thời gian | Tích hợp trong Charter | PM |
| 5 | Bảng phân vai trò RACI & Tiếp nhận quy chế | Ai quyết, ai làm, tránh đùn đẩy trách nhiệm | [05_Ma_Tran_RACI_Va_Thu_Thap_Chung_Tu_Mau.md](05_Ma_Tran_RACI_Va_Thu_Thap_Chung_Tu_Mau.md) & [07_Ke_Hoach_KickOff_Va_Thong_Nhat_Quy_Che.md](07_Ke_Hoach_KickOff_Va_Thong_Nhat_Quy_Che.md) | PM |
| 6 | NDA (nếu chưa ký trong hợp đồng) | Bảo mật dữ liệu nghiệp vụ khách hàng | Ban hành theo mẫu | PM/Pháp chế |
| 7 | Biên bản kick-off (MOM mẫu) | Ghi nhận thống nhất ban đầu | [03_Bien_Ban_Khao_Sat_Va_Diem_Danh_MOM.md](03_Bien_Ban_Khao_Sat_Va_Diem_Danh_MOM.md) | BA/PM |

> **Điểm hay bị bỏ sót:** Nhiều đội triển khai bỏ qua Project Charter vì nghĩ "đã có hợp đồng rồi". Nhưng hợp đồng là văn bản pháp lý, còn Charter là văn bản vận hành — nó trả lời câu "thành công là gì, ai quyết định gì" một cách thực tế hơn hợp đồng. Không có Charter là nguyên nhân phổ biến khiến BA/PM tranh cãi phạm vi giữa chừng dự án.

---

## GIAI ĐOẠN 2 — KHẢO SÁT NGHIỆP VỤ (BA)

*(Đây là giai đoạn bạn đang chuẩn bị cho ngày 20/8)*

**Mục tiêu:** Chuyển từ "danh sách chức năng" (cái gì) sang "nghiệp vụ chi tiết" (làm như thế nào).

**Hoạt động chính:** Đã trình bày chi tiết trong plan Ngày 1 — workshop theo quy trình xuyên suốt, playback xác nhận, ghi Change Log.

**Hồ sơ BẮT BUỘC mang theo khi đi họp với doanh nghiệp:**

| # | Tên tài liệu | Mục đích | Template sẵn sàng trong thư mục | Chuẩn bị trước hay tại chỗ |
|---|---|---|---|---|
| 1 | Agenda buổi họp (kèm mục tiêu, phạm vi rõ ràng) | Quản lý kỳ vọng, dẫn dắt buổi họp | [Kế hoạch khảo sát nghiệp vụ.md](K%E1%BA%BF%20ho%E1%BA%A1ch%20kh%E1%BA%A3o%20s%C3%A1t%20nghi%E1%BB%87p%20v%E1%BB%A5.md) | Trước |
| 2 | Danh sách chức năng đã chốt (bản in/PDF) | Đối chiếu trực tiếp với khách hàng | File tổng hợp theo module | Trước |
| 3 | Bảng ưu tiên theo GD1/GD2/GD3 | Giải thích vì sao chọn khảo sát phần này trước | Mục 2 trong Kế hoạch khảo sát | Trước |
| 4 | Template phiếu đặc tả chức năng (Business Rule Spec) | Ghi nhận ngay tại chỗ, chuẩn hoá cho dev | [01_Phieu_Dac_Ta_Chuc_Nang_In_An.md](01_Phieu_Dac_Ta_Chuc_Nang_In_An.md) | Trước, in 15–20 bản điền tại chỗ |
| 5 | Bộ câu hỏi khai thác nghiệp vụ (5W1H đã chuẩn bị) | Không bị "đứng hình" không biết hỏi gì | [02_Bo_Cau_Hoi_Khao_Sat_3_Quy_Trinh_Loi.md](02_Bo_Cau_Hoi_Khao_Sat_3_Quy_Trinh_Loi.md) | Trước |
| 6 | Mẫu Biên bản họp & Điểm danh (MOM template) | Gửi lại khách hàng trong 24h & ký chốt ngày | [03_Bien_Ban_Khao_Sat_Va_Diem_Danh_MOM.md](03_Bien_Ban_Khao_Sat_Va_Diem_Danh_MOM.md) | Trước, ký tại chỗ, hoàn thiện sau |
| 7 | Mẫu Change Log (đề xuất điều chỉnh phạm vi) | Ghi nhận phát sinh mà không cam kết tại chỗ | [04_Phieu_Ghi_Nhan_Thay_Doi_Pham_Vi_ChangeLog.md](04_Phieu_Ghi_Nhan_Thay_Doi_Pham_Vi_ChangeLog.md) | Trước, điền tại chỗ |
| 8 | Ma trận RACI & Checklist thu thập chứng từ mẫu | Thu thập file Excel mẫu, mẫu hóa đơn, bảng công/lương | [05_Ma_Tran_RACI_Va_Thu_Thap_Chung_Tu_Mau.md](05_Ma_Tran_RACI_Va_Thu_Thap_Chung_Tu_Mau.md) | Trước & ký giao nhận |
| 9 | Sổ ghi chú/laptop + máy ghi âm (đã xin phép) | Không bỏ sót chi tiết | Bản in các form trên | Tại chỗ |
| 10| Hồ sơ năng lực công ty / portfolio dự án tương tự (nếu là buổi đầu gặp gỡ sâu) | Tăng uy tín, tạo niềm tin | Portfolio / Slide giới thiệu | Trước |

**Output bắt buộc sau giai đoạn này:**
- Bộ phiếu đặc tả cho từng chức năng đã khảo sát (đủ chi tiết để dev đọc hiểu)
- Change Log đã được khách hàng xác nhận
- Biên bản họp đã gửi và được khách hàng đồng thuận nội dung

---

## GIAI ĐOẠN 3 — THIẾT KẾ & LẬP KẾ HOẠCH

**Mục tiêu:** Biến đặc tả nghiệp vụ thành tài liệu kỹ thuật để team dev triển khai được, và có kế hoạch/ước lượng được khách hàng phê duyệt.

**Hoạt động chính:**
- Viết SRS (Software Requirements Specification) hoàn chỉnh từ các phiếu đặc tả
- Thiết kế kiến trúc hệ thống, lựa chọn công nghệ
- Thiết kế cơ sở dữ liệu (ERD)
- Thiết kế UI/UX (wireframe → mockup)
- Ước lượng effort, lập backlog, chia sprint
- Trình khách hàng phê duyệt trước khi code

**Hồ sơ BẮT BUỘC:**

| # | Tên tài liệu | Mục đích | Template sẵn sàng trong thư mục |
|---|---|---|---|
| 1 | SRS (Software Requirements Specification) | Tài liệu gốc mọi bên tham chiếu | [08_Template_SRS_Dac_Ta_Yeu_Cau_Phan_Mem.md](08_Template_SRS_Dac_Ta_Yeu_Cau_Phan_Mem.md) |
| 2 | Sơ đồ ERD (thiết kế cơ sở dữ liệu) | Dev backend dựa vào đây | Khung thiết kế ERD trong SRS |
| 3 | Wireframe/Mockup UI | Dev frontend + khách hàng duyệt giao diện | Bộ màn hình Figma/Mockup |
| 4 | Kiến trúc hệ thống (Architecture diagram) | Tech Lead, DevOps tham chiếu | Kiến trúc tầng trong SRS |
| 5 | Product Backlog + Sprint Plan | Quản lý tiến độ dev | Bảng WBS Sprint Plan |
| 6 | Bảng ước lượng effort (theo độ khó đã cập nhật ở GD khảo sát) | Cơ sở tính thời gian/chi phí | Tổng hợp theo độ khó Use Case |
| 7 | Biên bản phê duyệt thiết kế (khách hàng ký) | Tránh việc khách hàng đổi ý giữa chừng mà không qua CR | [09_Bien_Ban_Phe_Duyet_Thiet_Ke_SignOff.md](09_Bien_Ban_Phe_Duyet_Thiet_Ke_SignOff.md) |

> **Lưu ý:** Đây là nơi Change Log từ Giai đoạn 2 được chính thức "hợp thức hoá" vào SRS — sau bước này, mọi thay đổi thêm phải đi qua quy trình Change Request chính thức (không còn là "ghi nhận" nữa mà là "yêu cầu thay đổi" có ảnh hưởng chi phí/thời gian).

---

## GIAI ĐOẠN 4 — PHÁT TRIỂN & KIỂM THỬ

**Mục tiêu:** Team dev/QA thực thi theo SRS đã duyệt, kiểm soát chất lượng chặt chẽ.

**Hoạt động chính:** Coding theo sprint, code review, viết test case, kiểm thử chức năng/hiệu năng, sửa lỗi.

**Hồ sơ BẮT BUỘC:**

| # | Tên tài liệu | Mục đích | Template sẵn sàng trong thư mục |
|---|---|---|---|
| 1 | Coding convention / quy chuẩn code | Đồng nhất chất lượng code toàn team | Tài liệu nội bộ Tech Lead |
| 2 | Test Plan & Test Case | QA kiểm thử có căn cứ, không bỏ sót | [10_Test_Plan_Va_Kich_Ban_Kiem_Thu_TestCases.md](10_Test_Plan_Va_Kich_Ban_Kiem_Thu_TestCases.md) |
| 3 | Bug tracking log | Theo dõi lỗi, trạng thái xử lý | Biểu mẫu Bug Tracking trong file Test Plan |
| 4 | Báo cáo tiến độ sprint định kỳ (gửi khách hàng) | Minh bạch tiến độ, giữ niềm tin khách hàng | Dashboard theo quy chế làm việc |
| 5 | Change Request log (nếu phát sinh thay đổi trong lúc dev) | Kiểm soát scope creep | [04_Phieu_Ghi_Nhan_Thay_Doi_Pham_Vi_ChangeLog.md](04_Phieu_Ghi_Nhan_Thay_Doi_Pham_Vi_ChangeLog.md) |

---

## GIAI ĐOẠN 5 — TRIỂN KHAI & BÀN GIAO

**Mục tiêu:** Đưa hệ thống vào vận hành thực tế, đào tạo người dùng, nghiệm thu chính thức, và chuyển sang giai đoạn bảo trì.

**Hoạt động chính:**
- Thiết lập môi trường Production, CI/CD
- UAT (User Acceptance Testing) cùng khách hàng
- Đào tạo người dùng cuối
- Nghiệm thu, ký biên bản bàn giao
- Thiết lập kênh hỗ trợ bảo trì (SLA)

**Hồ sơ BẮT BUỘC:**

| # | Tên tài liệu | Mục đích | Template sẵn sàng trong thư mục |
|---|---|---|---|
| 1 | Kịch bản UAT + kết quả UAT (khách hàng ký từng mục) | Căn cứ nghiệm thu, tránh tranh chấp | [11_Kich_Ban_UAT_Va_Bien_Ban_Nghiem_Thu.md](11_Kich_Ban_UAT_Va_Bien_Ban_Nghiem_Thu.md) (Phần 1) |
| 2 | Tài liệu hướng dẫn sử dụng (User Manual) | Người dùng cuối vận hành hệ thống | User Manual / Video Clip |
| 3 | Biên bản nghiệm thu & bàn giao chính thức | Chốt trách nhiệm, chuyển sang bảo hành | [11_Kich_Ban_UAT_Va_Bien_Ban_Nghiem_Thu.md](11_Kich_Ban_UAT_Va_Bien_Ban_Nghiem_Thu.md) (Phần 2) |
| 4 | Tài liệu kỹ thuật vận hành (Deployment guide, runbook) | Đội vận hành/DevOps sau này tham chiếu | Runbook & Deployment Guide |
| 5 | Hợp đồng/Phụ lục bảo trì (SLA hỗ trợ sau bàn giao) | Rõ ràng nghĩa vụ hai bên giai đoạn hậu dự án | Cam kết SLA trong file Nghiệm thu |

---

## BỘ FILE "MANG THEO TÚI" CHO MỌI BUỔI HỌP VỚI DOANH NGHIỆP (checklist nhanh)

Dù họp ở giai đoạn nào, đây là nhóm file nên có sẵn trong laptop/túi hồ sơ để không bao giờ bị động:

- [ ] Hợp đồng + phạm vi đã chốt (tham chiếu nhanh khi khách hàng hỏi "cái này có trong hợp đồng không")
- [ ] Agenda buổi họp hôm đó (in giấy, không chỉ trên máy — tạo cảm giác chuẩn bị kỹ)
- [ ] Timeline tổng thể dự án (khách hàng hay hỏi "bao giờ xong")
- [ ] Danh sách chức năng/module đã chốt, có đánh số phiên bản (v1, v2...) để biết đang nói về bản nào
- [ ] Template biên bản họp (MOM) — điền ngay cuối buổi, đọc lại cho khách hàng nghe trước khi rời phòng
- [ ] Template Change Request — để không phải hứa suông khi có phát sinh
- [ ] Danh thiếp / hồ sơ năng lực công ty — với khách hàng mới hoặc buổi họp có thêm người tham dự lần đầu
- [ ] Sổ tay ghi chú dự phòng (khi máy hết pin/lỗi — không bao giờ để buổi họp phụ thuộc 100% vào thiết bị)

---

## TỔ CHỨC THƯ MỤC HỒ SƠ DỰ ÁN (đề xuất cấu trúc lưu trữ)

```
[Tên dự án]/
├── 01_Hop_dong_va_phap_ly/
│   ├── Hop_dong_goc.pdf
│   ├── Phu_luc_pham_vi.xlsx
│   └── NDA.pdf
├── 02_Khoi_tao_du_an/
│   ├── Project_Charter.docx
│   ├── RACI_Matrix.xlsx
│   └── Timeline_tong_the.xlsx
├── 03_Khao_sat_nghiep_vu/
│   ├── Agenda_theo_buoi/
│   ├── Phieu_dac_ta_chuc_nang/
│   ├── Bien_ban_hop_MOM/
│   └── Change_Log.xlsx
├── 04_Thiet_ke/
│   ├── SRS.docx
│   ├── ERD.png
│   ├── Wireframe_Mockup/
│   └── Kien_truc_he_thong.png
├── 05_Phat_trien/
│   ├── Sprint_Plan.xlsx
│   └── Bug_Tracking_Log.xlsx
├── 06_Trien_khai_ban_giao/
│   ├── UAT_Ket_qua.xlsx
│   ├── User_Manual.pdf
│   └── Bien_ban_nghiem_thu.pdf
└── 00_Tong_hop/
    └── Danh_sach_chuc_nang_va_giai_doan.xlsx   ← file gốc bạn đang dùng, luôn cập nhật mới nhất tại đây
```

> Đặt file gốc "Danh sách chức năng và giai đoạn" ở thư mục `00_Tổng hợp` và luôn coi đây là **nguồn chân lý duy nhất (single source of truth)** — mọi bản cập nhật GD/UC (như việc HRM/LOG vừa được gán lại GD1) đều update vào đây trước, rồi mới lan toả xuống các phiếu đặc tả chi tiết. Tránh tình trạng có 3-4 bản Excel khác nhau trôi nổi trong email, dẫn đến hiểu nhầm số liệu — đây chính là nguyên nhân phổ biến nhất gây "lăn tăn" khi ngồi họp.
