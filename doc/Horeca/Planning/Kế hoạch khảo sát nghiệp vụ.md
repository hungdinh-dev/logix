 # KẾ HOẠCH KHẢO SÁT NGHIỆP VỤ — NGÀY 1 (20/08/2026)
### Workshop phân tích quy trình nghiệp vụ tại doanh nghiệp khách hàng
### *(Bản cập nhật — sau khi HRM và LOG được gán lại Giai đoạn)*

> **Thay đổi so với bản trước:** HRM tăng từ GD1=0 → **GD1=19** (nhảy lên vị trí ưu tiên thứ 2, ngang LMS). LOG tăng từ GD1=0 → **GD1=4** (vẫn thấp, giữ nguyên quyết định dời sang phiên sau). Việc HRM nhảy vào GD1 làm thay đổi đáng kể chiến lược ngày 1 — cần đọc kỹ mục 2 và mục 3 mới bên dưới.

---

## 1. MỤC TIÊU BUỔI LÀM VIỆC

| Mục tiêu | Kết quả cần đạt được cuối ngày |
|---|---|
| Khai thác nghiệp vụ chủ chốt | Mô tả chi tiết luồng xử lý, quy tắc nghiệp vụ (business rule) cho các chức năng ưu tiên |
| Chuẩn hoá lại phạm vi | Danh sách "giữ nguyên / bổ sung / gộp / tách / loại bỏ" so với danh sách đã chốt hợp đồng |
| Tài liệu hoá cho Dev | Mỗi chức năng ưu tiên có 1 phiếu đặc tả đủ để dev không phải hỏi lại nghiệp vụ |
| Xây uy tín & quan hệ | Khách hàng cảm nhận được sự chuyên nghiệp, có phương pháp, kiểm soát được phạm vi 1 ngày |

**Nguyên tắc bắt buộc phải nói rõ với khách hàng ngay đầu buổi:**
> "Với khối lượng gần 130 chức năng thuộc Giai đoạn 1 trải trên nhiều phòng ban, chúng tôi sẽ không thể đi hết toàn bộ nghiệp vụ trong 1 ngày. Hôm nay chúng ta sẽ tập trung vào 3 nhóm quy trình lõi ảnh hưởng nhiều nhất đến vận hành: **Mua hàng–Kho–Sản xuất**, **Bán hàng–Doanh thu**, và **Nhân sự cốt lõi**. Các phần còn lại (Tuyển dụng chuyên sâu, Logistics, LMS, FSM, MES...) sẽ được lên lịch khảo sát tiếp theo."

---

## 2. CẬP NHẬT BẢNG ƯU TIÊN THEO GD1

| Module | GD1 (mới) | GD1 (cũ) | Thay đổi | Ghi chú ưu tiên |
|---|---|---|---|---|
| **SCM** – Kho/Mua hàng/Sản xuất | 29 | 29 | — | Ưu tiên #1 — khai thác sâu như cũ |
| **HRM** – Nhân sự | **19** | 0 | 🔺 +19 | **Ưu tiên mới — bắt buộc đưa vào Ngày 1** |
| **LMS** – Đào tạo | 19 | 19 | — | Cao, nhưng khác nhóm stakeholder (phòng L&D) → vẫn nên tách phiên riêng nếu người phụ trách LMS không có mặt cùng buổi hôm nay |
| **CRM** – Bán hàng/Khách hàng | 17 | 17 | — | Ưu tiên #2 — khai thác sâu như cũ |
| **FIN** – Tài chính kế toán | 13 | 13 | — | Xuyên suốt các quy trình khác, khai thác lồng ghép |
| **POS** – Bán lẻ | 8 | 8 | — | Gộp chung luồng CRM (điểm cuối bán hàng) |
| **FSM** – Dịch vụ kỹ thuật | 8 | 8 | — | Trung bình, dời sang Ngày 2 |
| **MES** – Nhắn tin nội bộ | 8 | 8 | — | Ít business logic phức tạp, hỏi nhanh cuối buổi hoặc qua email |
| **SYS** – Hệ thống nền tảng | 4 | 4 | — | Thấp, do IT nội bộ trả lời |
| **LOG** – Giao hàng | **4** | 0 | 🔺 +4 | Vẫn thấp — **giữ nguyên quyết định dời sang phiên sau**, có thể hỏi nhanh 15 phút nếu còn dư thời gian cuối ngày |

**→ Kết luận phạm vi Ngày 1 (đã cập nhật):** Từ 2 quy trình lõi tăng lên **3 quy trình lõi**:
- **Quy trình A – "Mua hàng → Nhập kho → Công nợ NCC → Sản xuất"** (SCM là chính, có chạm FIN)
- **Quy trình B – "Khách hàng → Bán hàng → Thu tiền → Ghi nhận doanh thu"** (CRM + POS là chính, có chạm FIN)
- **Quy trình C (MỚI) – "Vòng đời nhân sự cốt lõi: Chấm công → Nghỉ phép → Tính lương, và Cấu trúc tổ chức"** (HRM)

---

## 3. VẤN ĐỀ QUAN TRỌNG: 1 NGÀY KHÔNG THỂ ĐỦ SÂU CHO CẢ 3 QUY TRÌNH — CHỌN 1 TRONG 2 PHƯƠNG ÁN

Tổng GD1 của SCM+CRM+FIN+HRM = 29+17+13+19 = **78 chức năng** — quá lớn để khai thác sâu (5-7 phút/chức năng) trong 1 ngày làm việc thực tế (~7 tiếng làm việc). Bạn cần chọn 1 trong 2 phương án sau **trước khi đi họp**:

### Phương án A — 1 BA duy nhất (mặc định nếu bạn đi một mình)
Giữ 3 quy trình nhưng **giảm độ sâu của HRM**: chỉ khai thác kỹ nhóm *"Chấm công – Nghỉ phép – Chốt lương – Cấu trúc tổ chức"* (đây là nhóm vận hành lặp lại hàng tháng, ảnh hưởng toàn bộ nhân viên, và có điểm chạm dữ liệu với module khác — ví dụ Payroll cần dữ liệu KPI bán hàng từ CRM/POS). Phần **Tuyển dụng (Recruitment)** dù thuộc GD1 nhưng là quy trình khép kín, ít phụ thuộc module khác → **dời sang phiên khảo sát riêng với phòng Tuyển dụng**, không đưa vào Ngày 1 dù đã lên GD1.

### Phương án B — Có 2 người đi khảo sát (đề xuất nếu khả thi)
Chạy **song song 2 track cùng lúc, khác phòng họp**:
- **Track 1 (bạn):** Quy trình A + Quy trình B (SCM, CRM, POS, FIN) — theo agenda gốc
- **Track 2 (đồng nghiệp/BA phụ):** Quy trình C toàn bộ (HRM: Tuyển dụng, Chấm công, Nghỉ phép, Lương, Tài sản, Cấu trúc tổ chức) — làm việc riêng với Trưởng phòng HR

→ Đây là kỹ thuật workshop chuyên nghiệp (parallel breakout), giúp khai thác được nhiều hơn trong cùng 1 ngày mà không giảm chất lượng. Nếu công ty bạn có thể cử thêm 1 người dù chỉ ghi chép, nên chọn phương án này.

**Agenda bên dưới được xây theo Phương án A (1 người). Nếu chọn Phương án B, dùng agenda A cho Track 1 và mở 1 track HRM riêng chạy song song theo khung giờ tương tự.**

---

## 4. CHUẨN BỊ TRƯỚC NGÀY 20/8 (checklist gửi cho khách hàng trước 1–2 ngày)

- [ ] Xác nhận **danh sách người tham dự bắt buộc** — đã cập nhật thêm HR:
  - Trưởng phòng Mua hàng/Kho (Quy trình A)
  - Trưởng phòng Kinh doanh/Sale (Quy trình B)
  - Kế toán trưởng hoặc kế toán tổng hợp (chạm cả A, B)
  - **Trưởng phòng Nhân sự / phụ trách C&B** (Quy trình C — **mới bổ sung**)
- [ ] Gửi trước **agenda** + phạm vi dự kiến để khách hàng chuẩn bị số liệu thực tế (mẫu phiếu nhập kho, mẫu báo giá, mẫu hoá đơn, **bảng chấm công/bảng lương mẫu**, quy trình duyệt hiện tại nếu có văn bản)
- [ ] Nếu chọn Phương án B: xác nhận nhân sự đi cùng, chia rõ ai phụ trách track nào trước khi đến
- [ ] Chuẩn bị bản in/PDF danh sách chức năng đã chốt theo từng module — mang theo để đối chiếu trực tiếp
- [ ] Chuẩn bị công cụ ghi nhận: laptop + template đặc tả (mục 7), giấy note/whiteboard hoặc Miro
- [ ] Chuẩn bị sẵn khung RACI (đã có sẵn trong sheet Tổng quan) để tham chiếu khi hỏi "ai duyệt, ai thực hiện"
- [ ] Máy ghi âm (xin phép trước)

---

## 5. AGENDA CHI TIẾT NGÀY 20/8 (Phương án A — 1 BA)

| Giờ | Nội dung | Mục tiêu cụ thể |
|---|---|---|
| 08:00–08:20 | Khai mạc, giới thiệu team, thống nhất mục tiêu & phạm vi 3 quy trình | Quản lý kỳ vọng ngay từ đầu |
| 08:20–08:45 | Tổng quan mô hình kinh doanh & sơ đồ tổ chức hiện tại (as-is) | Hiểu bối cảnh trước khi đào sâu |
| 08:45–10:00 | **Quy trình A**: Yêu cầu mua hàng → Duyệt → Đặt NCC → Nhập kho → Đối soát hoá đơn/công nợ | SCM-001→014, FIN-009→016 |
| 10:00–10:10 | Giải lao | |
| 10:10–10:55 | **Quy trình A (tiếp)**: Tồn kho, hạn sử dụng, điểm đặt hàng lại; sản xuất/giá thành nếu có | SCM-011→038 |
| 10:55–11:15 | Playback nhanh Quy trình A để xác nhận hiểu đúng | Chốt lại trước khi đổi phòng ban |
| 11:15–12:00 | **Quy trình C (HRM) — phần 1**: Chấm công & xếp ca, Nghỉ phép | HRM-010,011,012,038,039,046,047 |
| 12:00–13:00 | Nghỉ trưa | |
| 13:00–13:40 | **Quy trình C (HRM) — phần 2**: Chốt lương tháng, Cấu trúc tổ chức/chức danh, Hồ sơ điện tử | HRM-042,043,048,049,008,036 |
| 13:40–13:50 | Playback nhanh Quy trình C | Chốt lại trước khi chuyển chủ đề |
| 13:50–15:10 | **Quy trình B**: Lead/Khách hàng mới → Chăm sóc → Chốt đơn (CRM) → Bán tại quầy/chuỗi (POS) | CRM-001→024, POS-001→008 |
| 15:10–15:20 | Giải lao | |
| 15:20–16:10 | **Quy trình B (tiếp)**: Ghi nhận doanh thu, đối soát, báo cáo P&L theo cửa hàng/kênh (FIN) | FIN-001→008, FIN-024→028 |
| 16:10–16:25 | (Nếu còn dư thời gian) Hỏi nhanh LOG — 4 chức năng cốt lõi: kho xe ship, phân loại phương tiện, đối tác vận chuyển, trạng thái giao hàng | LOG-001→004 |
| 16:25–16:50 | Tổng hợp toàn bộ, playback lại danh sách thay đổi (bổ sung/gộp/bỏ), thống nhất bước tiếp theo | Chốt biên bản |
| 16:50–17:00 | Kết thúc, cảm ơn, hẹn lịch phiên tiếp theo | Giữ momentum dự án |
| Sau buổi | Gửi Biên bản họp (MOM) + lịch phiên tiếp theo cho Tuyển dụng chi tiết, LMS, LOG chi tiết, FSM, MES trong vòng 24h | Củng cố uy tín |

> **Lưu ý:** So với bản gốc, mỗi quy trình bị rút ngắn khoảng 20-25% thời gian để có chỗ cho HRM. Nếu thực tế Quy trình A hoặc B kéo dài hơn dự kiến, **cắt bớt phần Cấu trúc tổ chức/chức danh trong HRM trước** (đây là phần ít phức tạp về business rule, có thể hỏi nhanh qua email sau) — không cắt phần Chấm công/Lương vì đây là phần phức tạp nhất và cần xác nhận trực tiếp.

---

## 6. KỸ THUẬT KHAI THÁC NGHIỆP VỤ (bộ câu hỏi dùng trong từng chức năng)

Với mỗi chức năng/nhóm chức năng, hỏi theo khung sau:

1. **Ai** thực hiện thao tác này? Ai là người duyệt cuối cùng?
2. **Khi nào / điều kiện gì** thì nghiệp vụ này phát sinh? (trigger)
3. **Đầu vào** cần những thông tin/chứng từ gì? Lấy từ đâu (thủ công hay hệ thống khác)?
4. **Quy tắc/ràng buộc** nào bắt buộc phải tuân thủ? (VD: không cho xuất âm tồn, hạn mức duyệt, công thức tính lương)
5. **Trường hợp ngoại lệ / lỗi** thường gặp là gì? Hiện tại xử lý thế nào?
6. **Đầu ra** là gì? Ai nhận được thông báo/kết quả tiếp theo?
7. Có **liên kết với module/phòng ban khác** không? (VD: HRM-026 lấy KPI bán hàng từ POS/CRM để tính hoa hồng — câu hỏi này cực kỳ quan trọng với HRM vì nhiều chức năng payroll phụ thuộc dữ liệu từ module khác)
8. Hiện tại đang làm **thủ công hay đã có phần mềm** hỗ trợ một phần? Điểm nghẽn là gì?
9. Có **KPI/số liệu** nào cần hệ thống tự tính hoặc báo cáo ra không?

**Mẹo tạo uy tín:** Playback lại bằng lời của mình sau mỗi nhóm chức năng ("Vậy quy trình sẽ là: A → B → C, đúng không anh/chị?").

---

## 7. TEMPLATE ĐẶC TẢ CHỨC NĂNG (dùng để bàn giao cho Dev)

```
Mã CN (tham chiếu):      [VD: HRM-042]
Tên chức năng:           
Module / Nhóm:           
Trạng thái so với hợp đồng:  [ ] Giữ nguyên  [ ] Bổ sung mới  [ ] Gộp với CN khác  [ ] Tách nhỏ  [ ] Đề xuất loại bỏ
Actor (vai trò thực hiện):    
Actor duyệt (nếu có):         
Trigger (điều kiện phát sinh):

Input (dữ liệu/chứng từ đầu vào):
  -
  -

Luồng xử lý chính (step-by-step):
  1.
  2.
  3.

Quy tắc nghiệp vụ / ràng buộc (business rules):
  -
  -

Trường hợp ngoại lệ (exception handling):
  -

Output (kết quả, thông báo, ai nhận):
  -

Liên kết module khác (integration points):
  -

Độ khó đánh giá lại (1–10):     [so sánh với độ khó cũ trong file gốc]
Ghi chú / câu hỏi mở còn tồn:
```

**Cách dùng thực tế:** in sẵn 15–20 phiếu giấy A4 theo mẫu trên (tăng số lượng so với bản trước vì giờ có thêm HRM), điền tay khi khách hàng nói, chụp lại cuối ngày.

---

## 8. XỬ LÝ THAY ĐỔI SỐ LƯỢNG CHỨC NĂNG (tăng/giảm/gộp/tách)

1. Trong buổi họp: chỉ **ghi nhận** phát sinh vào phiếu đặc tả, **không cam kết** thay đổi số lượng/phạm vi với khách hàng ngay tại chỗ.
2. Sau buổi họp: tổng hợp thành **"Change Log — Đề xuất điều chỉnh phạm vi"** gồm 3 cột: *Chức năng gốc | Đề xuất thay đổi | Lý do phát sinh từ thực tế nghiệp vụ*.
3. Trình PM/khách hàng ký xác nhận thay đổi theo đúng quy trình change management.
4. Chỉ sau khi được xác nhận mới cập nhật lại file "Tổng quan" (số lượng UC, tổng độ khó, độ khó trung bình theo từng GD) và giao việc chi tiết cho dev.

> Câu nói chuyên nghiệp nên dùng với khách hàng cuối buổi: *"Qua buổi khảo sát hôm nay, có một số điểm nghiệp vụ chi tiết hơn hoặc khác so với mô tả ban đầu trên hợp đồng — đặc biệt là phần Nhân sự vừa được bổ sung vào Giai đoạn 1. Chúng tôi sẽ tổng hợp thành bản đề xuất điều chỉnh phạm vi để anh/chị xem và xác nhận trước khi đội dev triển khai."*

---

## 9. CHECKLIST TẠO ĐỘ UY TÍN CHUYÊN NGHIỆP TRONG BUỔI HỌP

- Mở đầu bằng **agenda rõ ràng + quản lý kỳ vọng** về phạm vi 1 ngày — đặc biệt giải thích rõ vì sao thêm HRM vào hôm nay (dựa trên số liệu GD1 vừa cập nhật, không phải ngẫu hứng)
- Luôn **dẫn dắt bằng số liệu có sẵn** (bảng GD1 mục 2) thay vì hỏi lan man
- **Playback lại** sau mỗi phần
- Không để buổi họp lệch hướng quá sâu vào 1 case nhỏ — ghi nhận và hẹn xử lý riêng
- Kết thúc bằng **bước tiếp theo cụ thể**: gửi MOM trong 24h, lịch phiên tiếp theo cho Tuyển dụng/LMS/LOG chi tiết/FSM/MES, thời hạn khách hàng xác nhận Change Log
- Gửi **thư cảm ơn + biên bản họp** ngay trong ngày hoặc sáng hôm sau

---

## 10. VIỆC CẦN LÀM SAU BUỔI HỌP (trong 24–48h)

1. Hoàn thiện toàn bộ phiếu đặc tả (mục 7) cho các chức năng đã khai thác (SCM, CRM, POS, FIN, HRM)
2. Tổng hợp Change Log (mục 8) trình khách hàng xác nhận
3. Cập nhật lại file "Tổng quan" (số lượng UC, độ khó) sau khi có xác nhận
4. Đóng gói bộ đặc tả theo module, bàn giao cho Tech Lead để chia việc cho Dev
5. Lên lịch các phiên khảo sát tiếp theo cho: **Tuyển dụng (HRM chi tiết)**, LMS, **LOG chi tiết**, FSM, MES
