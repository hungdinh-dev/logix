# Hướng Dẫn Kiểm Thử Tính Năng Ngân Hàng Câu Hỏi & Đồng Bộ Google Sheets (User Testing Guide)

> **Mô-đun**: LMS Admin - Ngân hàng Câu hỏi & Semantic Audit Trail  
> **Địa chỉ URL kiểm thử**: [http://localhost:3000/lms/admin/question-banks](http://localhost:3000/lms/admin/question-banks)  
> **Tài liệu kiến trúc**: [[Question_Bank_And_Sync_Audit_Architecture]]

---

## 1. Chuẩn Bị & Môi Trường Kiểm Thử

Đảm bảo hai dịch vụ đang chạy:
- **Backend API**: `http://localhost:5000` (Đang chạy nền qua lệnh `pnpm run dev:be`)
- **Frontend App**: `http://localhost:3000` (Đang chạy nền qua lệnh `pnpm run dev:fe`)

Truy cập thanh điều hướng bên trái (Sidebar) -> mục **LMS Admin** -> nhấp vào **Ngân hàng Câu hỏi** (Biểu tượng dấu chấm hỏi `HelpCircle`).

---

## 2. Kịch Bản 1: Tạo Ngân Hàng Câu Hỏi Mới

1. Tại trang danh sách [http://localhost:3000/lms/admin/question-banks](http://localhost:3000/lms/admin/question-banks), bấm nút **`+ Tạo ngân hàng`** ở góc phải thanh công cụ.
2. Điền thông tin vào form:
   - **Mã ngân hàng**: `QB_JS_ADVANCED` *(Viết hoa, không dấu)*
   - **Danh mục khóa học**: Chọn một danh mục có sẵn (hoặc để trống)
   - **Tên ngân hàng câu hỏi**: `Ngân hàng câu hỏi Lập trình JavaScript Chuyên Sâu`
   - **Mô tả mục đích sử dụng**: `Kho lưu trữ 200 câu hỏi phục vụ kiểm tra giữa kỳ và thi cuối khóa`
   - **Liên kết Google Sheets (Tùy chọn)**: Dán link Google Sheet (nếu có sẵn) hoặc để trống.
3. Bấm **`Tạo ngân hàng`**:
   - Hệ thống hiển thị thông báo toast màu xanh: *"Đã tạo ngân hàng câu hỏi thành công!"*
   - Danh sách bảng lập tức xuất hiện dòng ngân hàng mới với thẻ `Phiên bản v1` và `0 câu hỏi`.

---

## 3. Kịch Bản 2: Kiểm Thử Đồng Bộ 1-Click Từ Google Sheets

### Bước 3.1: Chuẩn bị bảng Google Sheet mẫu
Hệ thống chấp nhận bất kỳ file Google Sheets nào được chia sẻ ở chế độ **"Bất kỳ ai có đường liên kết đều có thể xem" (Anyone with the link can view)** với cấu trúc 12 cột sau:

| code | question | type | difficulty | points | option_a | option_b | option_c | option_d | correct_answer | explanation | tags |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `Q_JS_01` | Kết quả của typeof NaN trong JS là gì? | SINGLE_CHOICE | EASY | 1 | number | NaN | undefined | object | A | NaN là giá trị thuộc kiểu dữ liệu number trong chuẩn ECMAScript | js, types |
| `Q_JS_02` | Phương thức nào dùng để gộp 2 mảng? | SINGLE_CHOICE | MEDIUM | 1 | push() | concat() | slice() | splice() | B | concat() trả về một mảng mới gồm các phần tử của cả hai mảng | js, array |
| `Q_JS_03` | Closure trong Javascript cho phép truy cập biến từ scope nào? | SINGLE_CHOICE | HARD | 2 | Chỉ scope toàn cục | Scope cha bao bọc nó | Không truy cập được | Chỉ scope con | B | Closure cho phép hàm con truy cập biến của hàm cha ngay cả khi hàm cha đã kết thúc thực thi | js, closure, scope |

> 💡 **Mẹo test nhanh**: Bạn có thể tạo 1 file Google Sheet mới tại [sheet.new](https://sheet.new), copy bảng 12 cột trên dán vào, sau đó bấm nút **Chia sẻ** -> chọn **Bất kỳ ai có đường liên kết** (Xem) -> Copy link.

### Bước 3.2: Thực hiện đồng bộ 1-Click
1. Trên dòng ngân hàng vừa tạo, nhấp vào menu hành động (ba chấm `...`) -> Chọn **`Đồng bộ Google Sheets`** (hoặc mở trang chi tiết ngân hàng và bấm nút màu xanh **`Đồng bộ Google Sheets`**).
2. Dán đường link Google Sheets vào ô nhập.
3. Nhấp nút **`Bắt đầu đồng bộ`**:
   - Hệ thống hiển thị biểu tượng xoay `Loader2` trong khi tải dữ liệu từ Google Sheets.
   - Khi hoàn tất, bảng thông báo tóm tắt màu xanh hiển thị kết quả:
     - `+ 3 câu hỏi mới`
     - `~ 0 câu hỏi cập nhật`
     - `- 0 câu vô hiệu hóa`
     - `Tổng 3 câu hỏi trong file`
4. Bấm **`Đóng`**:
   - Số lượng câu hỏi trên giao diện tự động cập nhật từ `0` lên `3 câu hỏi`.

### Bước 3.3: Thử nghiệm Semantic Delta (Sửa câu hỏi trên Google Sheet và đồng bộ lại)
1. Trên file Google Sheet, sửa nội dung câu hỏi `Q_JS_01` thành: `[Đã sửa] Kết quả của typeof NaN là gì?`.
2. Thêm 1 câu hỏi mới `Q_JS_04`.
3. Bấm lại nút **`Đồng bộ Google Sheets`** -> Bấm **`Bắt đầu đồng bộ`**:
   - Hệ thống phát hiện chính xác:
     - `+ 1 câu hỏi mới` (cho câu `Q_JS_04`)
     - `~ 1 câu hỏi cập nhật` (cho câu `Q_JS_01`)
     - `- 0 câu vô hiệu hóa`

---

## 4. Kịch Bản 3: Tải File Mẫu CSV & Import File Excel / CSV

1. Tại thanh công cụ của trang Ngân hàng Câu hỏi, nhấp nút **`Tải file mẫu (.csv)`**:
   - Trình duyệt tự động tải về file `question_bank_template.csv` định dạng chuẩn UTF-8 (có sẵn BOM chống lỗi font tiếng Việt trong Excel).
2. Mở file CSV bằng Excel hoặc Notepad, thêm 1-2 câu hỏi mới tuân theo cấu trúc các cột.
3. Trên dòng ngân hàng, bấm menu hành động `...` -> chọn **`Import Excel / CSV`** (hoặc bấm nút ở trang chi tiết).
4. Kéo thả file CSV vừa lưu vào ô tải lên.
5. Nhấp **`Tiến hành Import`**:
   - Hệ thống xử lý trực tiếp và báo kết quả số lượng câu thêm mới / cập nhật thành công.

---

## 5. Kịch Bản 4: Quản Lý Câu Hỏi Thủ Công (Chi Tiết Ngân Hàng)

1. Nhấp vào tên ngân hàng câu hỏi hoặc nút **`Xem chi tiết`** trên bảng để điều hướng sang trang `http://localhost:3000/lms/admin/question-banks/[id]`.
2. Quan sát thẻ tổng quan Hero Card:
   - Hiển thị Mã, Tên, Phiên bản, Trạng thái hoạt động, Link Google Sheet nguồn.
   - Thống kê phân bổ: Số câu Dễ / Trung bình / Khó và mốc thời gian đồng bộ gần nhất.
3. **Thêm câu hỏi thủ công**:
   - Bấm **`+ Thêm câu hỏi`**.
   - Nhập: Mã câu (`Q_JS_MANUAL_01`), Độ khó (Khó), Điểm (2 pt), Nội dung câu hỏi.
   - Nhập 4 phương án lựa chọn A, B, C, D và tích vào nút tròn màu xanh để chọn đáp án đúng.
   - Bấm **`Lưu vào ngân hàng`** -> Câu hỏi mới xuất hiện trên bảng.
4. **Chỉnh sửa câu hỏi**:
   - Nhấp vào biểu tượng cây bút `Edit` ở cuối dòng câu hỏi để mở modal sửa nội dung/đáp án.
5. **Xóa câu hỏi**:
   - Nhấp biểu tượng thùng rác `Trash2` -> Hộp thoại xác nhận hiển thị cảnh báo -> Bấm **`Xác nhận xóa`**.

---

## 6. Kịch Bản 5: Kiểm Tra Lịch Sử Thay Đổi (Audit Log Side Peek)

Đây là tính năng theo dõi lịch sử (Tracking & Semantic Changelog) đồng bộ theo kiến trúc doanh nghiệp:

1. Tại góc phải của trang chi tiết ngân hàng câu hỏi, nhấp vào nút **`Lịch sử thay đổi (Audit Log)`** (Biểu tượng đồng hồ xoay `History`).
2. Quan sát ngăn kéo Side Peek trượt ra từ bên phải màn hình:
   - **Thống kê**: Hiển thị số lượng sự kiện thay đổi đã ghi nhận.
   - **Timeline**:
     - Sự kiện `TẠO MỚI`: Ghi nhận người tạo ban đầu và mốc thời gian.
     - Sự kiện `ĐỒNG BỘ GOOGLE SHEETS` (Badge xanh lá): Hiển thị tóm tắt Semantic Delta dạng:
       $$\text{+ Thêm 3 câu • ~ Cập nhật 1 câu • - Vô hiệu hóa 0 câu}$$
     - Sự kiện `IMPORT CSV/EXCEL` (Badge xanh dương): Hiển thị chi tiết số câu nhập từ file.
     - Sự kiện `CHỈNH SỬA / XÓA`: Ghi nhận thao tác sửa nội dung câu hỏi thủ công.
3. Thử nghiệm tìm kiếm trong Side Peek:
   - Nhập từ khóa (VD: `Google`, `Q_JS`, hoặc tên người thực hiện) vào ô tìm kiếm trên Side Peek để lọc các sự kiện tương ứng.

---

## 7. Bảng Tổng Kết Trạng Thái Kiểm Thử

| # | Kịch bản kiểm thử | Hành động chính | Kết quả mong đợi |
| :-: | :--- | :--- | :--- |
| **1** | Tạo ngân hàng mới | Form Dialog `CreateBankModal` | Tạo thành công, xuất hiện trên bảng với v1 |
| **2** | Đồng bộ Google Sheets | 1-Click Sync qua link chia sẻ | Tự động phân tích CSV stream, tính Semantic Delta (+ / ~ / -) |
| **3** | Tải file mẫu & Import CSV | Tải CSV UTF-8, upload file | Parse đúng định dạng tiếng Việt, cập nhật câu hỏi |
| **4** | CRUD câu hỏi thủ công | Modal `QuestionDetailModal` | Thêm, sửa đáp án, chọn đáp án đúng, xóa có xác nhận |
| **5** | Kiểm tra Audit Log | Side Peek `EntityAuditSidePeek` | Hiển thị đầy đủ timeline, ai sửa, lúc nào, thay đổi những gì |
