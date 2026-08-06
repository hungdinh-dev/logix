# Nhật ký Refactor Giao diện LMS sang Shadcn UI & Tailwind v4

Tài liệu này ghi chép từng bước thay đổi cấu trúc mã nguồn giao diện của dự án LogiX LMS. Việc này giúp đảm bảo không bỏ sót dòng code nào và hỗ trợ bạn hiểu rõ bản chất của các cải tiến.

---

## Danh sách các file được refactor
*   `[x]` [LmsPageHeader.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/shared/LmsPageHeader.tsx) — Header dùng chung của LMS
*   `[x]` [DashboardHeader.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/dashboard/DashboardHeader.tsx) — Phần Header Dashboard (nút tìm kiếm)
*   `[x]` [DashboardCards.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/dashboard/DashboardCards.tsx) — Thẻ bài giảng, tiến trình học và các đề xuất
*   `[x]` [LMSDashboardPage.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/pages/LMSDashboardPage.tsx) — Trang Dashboard chính

---

## Chi tiết các bước thay đổi

### Bước 1: Khởi tạo nhật ký refactor
*   **Hành động**: Tạo file log `doc/refactoring_log.md` này để theo dõi tiến độ.
*   **Trạng thái**: Hoàn thành.

### Bước 2: Refactor `LmsPageHeader.tsx`
*   **Tập tin**: [LmsPageHeader.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/shared/LmsPageHeader.tsx)
*   **Nội dung thay đổi**:
    *   **Loại bỏ import**: Xóa `import { LMS_PALETTE } from './lms-palette'`.
    *   **Loại bỏ Inline Style**: Chuyển `style={{ backgroundColor: LMS_PALETTE.canvas, borderBottom: ... }}` thành class Tailwind v4 `bg-background border-border border-b`.
    *   **Loại bỏ JS Event Handlers**: Xóa bỏ các sự kiện hover dùng mã JavaScript (`onMouseEnter`, `onMouseLeave`) của các nút Bell và Menu tài khoản, chuyển thành class utility Tailwind `hover:bg-card` và `text-muted-foreground`.
    *   **Sử dụng UI Kit Component**: Thay thế thẻ `<span>` tự vẽ vòng tròn avatar bằng component `<Avatar>` và `<AvatarFallback>` chuẩn của Shadcn UI.
*   **Trạng thái**: Hoàn thành.

### Bước 3: Refactor `DashboardHeader.tsx`
*   **Tập tin**: [DashboardHeader.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/dashboard/DashboardHeader.tsx)
*   **Nội dung thay đổi**:
    *   **Loại bỏ import**: Xóa `import { LMS_PALETTE } from '../shared/lms-palette'`.
    *   **Loại bỏ Inline Style**: Chuyển `style={{ backgroundColor: LMS_PALETTE.surfaceSoft, color: LMS_PALETTE.muted }}` của nút tìm kiếm thành các class Tailwind v4 `bg-secondary text-muted-foreground hover:bg-muted/80`.
*   **Trạng thái**: Hoàn thành.

### Bước 4: Refactor `DashboardCards.tsx`
*   **Tập tin**: [DashboardCards.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/dashboard/DashboardCards.tsx)
*   **Nội dung thay đổi**:
    *   **Sử dụng UI Kit Components**:
        *   Thay thế các thẻ `div` bọc ngoài của các card bài giảng và card đề xuất bằng component `<Card>` của Shadcn UI.
        *   Thay thế nút bấm tĩnh `Enroll` bằng component `<Button>` của Shadcn UI.
    *   **Loại bỏ JS Event Handlers**:
        *   Xóa bỏ các sự kiện hover dùng mã JavaScript (`onMouseEnter`, `onMouseLeave`) ở các dòng của Upcoming Deadlines, đổi thành class Tailwind `hover:bg-secondary/50`.
        *   Ở nút `Resume`, thay thế JS hovers bằng việc truyền biến CSS tùy biến `--hover-bg` trực tiếp vào thuộc tính `style` và khai báo class Tailwind `hover:bg-[var(--hover-bg)]`.
    *   **Thay đổi hệ màu**: Chuyển đổi toàn bộ việc trỏ màu từ đối tượng JS `LMS_PALETTE` thành các biến màu CSS tiêu chuẩn (như `text-foreground`, `text-muted-foreground`, `bg-background`, `border-border`, `bg-muted`...).
*   **Trạng thái**: Hoàn thành.

### Bước 5: Refactor `LMSDashboardPage.tsx`
*   **Tập tin**: [LMSDashboardPage.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/pages/LMSDashboardPage.tsx)
*   **Nội dung thay đổi**:
    *   **Loại bỏ import**: Xóa `import { LMS_PALETTE } from '../components/shared/lms-palette'`.
    *   **Chuyển đổi các thẻ bọc ngoài**: Thay đổi `style={{ backgroundColor: LMS_PALETTE.canvas }}` của trang Dashboard chính và `style={{ backgroundColor: LMS_PALETTE.surfaceCard, borderColor: LMS_PALETTE.border }}` của bảng "Good morning" và grid thống kê thành các class Tailwind v4 chuẩn `bg-background`, `bg-card`, `border-border`, `border` và hiệu ứng hover tinh tế `hover:bg-muted/30`.
    *   **Đồng bộ văn bản**: Thay các thẻ `span` và `p` dùng inline style thành các class chữ chuẩn `text-foreground`, `text-muted-foreground`, `text-primary`.
*   **Trạng thái**: Hoàn thành.

### Bước 6: Phát triển tính năng chạy mã nguồn trực tuyến (Interactive Playground)
*   **Tập tin mới**: [CodePlayground.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/lesson-player/CodePlayground.tsx)
*   **Tập tin thay đổi**: [LessonPlayerPage.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/pages/LessonPlayerPage.tsx)
*   **Nội dung thay đổi**:
    *   **Thêm component CodePlayground**: Tạo một giao diện chỉnh sửa mã nguồn mini bắt chước giao diện VS Code, cho phép người dùng thay đổi trực tiếp các khối code mẫu trong giáo trình và bấm nút **Run Code**.
    *   **Cơ chế thực thi**: Sử dụng phương thức an toàn `new Function()` để chạy mã độc lập ngay trên trình duyệt client, ghi đè tạm thời các hàm `console.log` và `window.alert` để thu thập dữ liệu đầu ra và in trực tiếp xuống bảng terminal màu xanh giả lập phía dưới.
    *   **Bộ phân tích HTML thông minh**: Thêm hàm `parseHtmlWithPlaygrounds` vào trang phát bài học. Hàm này tự động quét qua nội dung văn bản giáo trình, trích xuất tất cả các khối thẻ `<pre><code>...</code></pre>` chuẩn và tự động chèn component `CodePlayground` vào đó một cách hoàn hảo.
*   **Trạng thái**: Hoàn thành.

### Bước 7: Khôi phục thanh Header và Tính toán chiều cao linh hoạt
*   **Tập tin thay đổi**: [layout.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/app/%28protected%29/layout.tsx), [LessonPlayerPage.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/pages/LessonPlayerPage.tsx)
*   **Nội dung thay đổi**:
    *   **Khôi phục Header**: Thay đổi tệp layout để giữ lại thanh Header chính ở trên cùng (phục vụ đổi ngôn ngữ, đổi giao diện sáng/tối và xem profile) và chỉ loại bỏ Sidebar chính (`AppSidebar`) trên đường dẫn bài học `/lms/lessons`.
    *   **Tính toán chiều cao linh hoạt**: Đổi class chiều cao của container bài học từ `h-screen` (luôn bắt cứng 100vh) sang `h-full` (co giãn theo vùng hiển thị của thẻ cha), kết hợp thuộc tính `overflow-hidden` ở thẻ `<main>` cha. Điều này loại bỏ hoàn toàn việc bị tràn chiều cao trang khi có sự xuất hiện của Header.
*   **Trạng thái**: Hoàn thành.

### Bước 8: Tùy biến thanh cuộn (Custom Scrollbars) toàn hệ thống
*   **Tập tin thay đổi**: [index.css](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/app/index.css)
*   **Nội dung thay đổi**:
    *   **Tùy biến thanh cuộn Webkit**: Khai báo các thuộc tính `::-webkit-scrollbar`, `::-webkit-scrollbar-thumb`, và `::-webkit-scrollbar-track` trong lớp `@layer base` của Tailwind. Chuyển đổi thanh cuộn thô mặc định của hệ điều hành sang dạng thanh mảnh dẹt (`6px`), bo tròn các góc (`rounded-full`) và sử dụng màu của biến CSS `--border` để thích ứng mượt mà giữa chế độ sáng/tối.
    *   **Hỗ trợ Firefox**: Khai báo các thuộc tính chuẩn hóa W3C `scrollbar-width: thin` và `scrollbar-color` để đảm bảo độ tương thích đồng bộ trên Firefox.
*   **Trạng thái**: Hoàn thành.

### Bước 9: Phát triển chức năng cấu hình cỡ chữ học tập linh hoạt
*   **Tập tin thay đổi**: [Header.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/components/shared/Header.tsx), [index.css](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/app/index.css), [LessonPlayerPage.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/pages/LessonPlayerPage.tsx), [CodePlayground.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/lesson-player/CodePlayground.tsx)
*   **Nội dung thay đổi**:
    *   **Dropdown cấu hình cỡ chữ**: Thêm một nút cấu hình cỡ chữ hình chữ `Type` ở thanh Header cạnh nút chuyển Theme. Menu thả xuống cho phép chọn 4 kích cỡ (Nhỏ: 14px, Vừa: 16px, Lớn: 18px, Rất lớn: 20px). Lựa chọn của người dùng được lưu trữ lại trong `localStorage` để giữ nguyên trạng thái khi chuyển bài học hoặc tải lại trang.
    *   **CSS Variables điều phối đồng bộ**: Khai báo các biến CSS `--lms-reader-font-size` và `--lms-code-font-size` toàn hệ thống. Khi cỡ chữ bài đọc thay đổi, cỡ chữ trong khung gõ mã nguồn CodePlayground cũng được co giãn đồng bộ tương ứng (12px, 13px, 14px, 15px) đảm bảo tỷ lệ hiển thị cân đối và mượt mà.
*   **Trạng thái**: Hoàn thành.

### Bước 10: Phát triển Sidebar Outline thu gọn & Tối ưu Responsive trên thiết bị di động
*   **Tập tin thay đổi**: [LessonOutlinePanel.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/lesson-player/LessonOutlinePanel.tsx), [LessonPlayerPage.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/pages/LessonPlayerPage.tsx)
*   **Nội dung thay đổi**:
    *   **Nút thu gọn Sidebar trái**: Thêm callback `onClose` và nút bấm đóng (`ChevronLeft`) vào phần Header của Sidebar Outline. Khi bấm đóng, Sidebar co chiều rộng về 0 với hiệu ứng trượt mượt mà.
    *   **Nút nổi mở rộng**: Bố trí nút mở rộng (`ChevronRight`) ở mép trái màn hình, tự động ẩn/hiện và trượt float đồng bộ với trạng thái đóng mở của Sidebar.
    *   **Tự động ẩn trên màn hình nhỏ (Responsive Auto-Collapse)**: Thêm hook `useEffect` kiểm tra kích thước màn hình thiết bị khi tải trang. Nếu chiều rộng màn hình nhỏ hơn `1024px` (điện thoại, máy tính bảng), hệ thống tự động thu gọn cả Sidebar trái (Outline) và Sidebar phải (Discussion) để nhường toàn bộ không gian cho bài giảng, giúp giao diện không bị co ép hẹp.
*   **Trạng thái**: Hoàn thành.

### Bước 11: Triển khai trình soạn thảo Tiptap Rich Text & Trang Quản trị tạo bài học (Lesson Creator)
*   **Tập tin mới**: [LessonRichEditor.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/editor/LessonRichEditor.tsx), [page.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/app/%28protected%29/lms/lessons/create/page.tsx)
*   **Nội dung thay đổi**:
    *   **Tích hợp thư viện Tiptap WYSIWYG**: Cài đặt các gói thư viện chuẩn và hiện đại `@tiptap/react`, `@tiptap/starter-kit`, và `@tiptap/pm` tương thích đầy đủ với React 19. Phát triển component `LessonRichEditor` với thanh công cụ định dạng trực quan (Bold, Italic, Strike, Heading, List) và chèn khối Code Block chuyên nghiệp.
    *   **Thiết lập trang tạo bài học mới**: Xây dựng trang `/lms/lessons/create` cung cấp giao diện nhập thông tin metadata (Tiêu đề, loại bài học, thời lượng).
    *   **Chức năng Live Student Viewport Preview**: Tích hợp màn hình xem trước hiển thị trực quan giáo trình của học viên ở cạnh bên. Khi người dùng nhập nội dung hay chèn Code Block ở ô soạn thảo, màn hình Preview sẽ ngay lập tức biên dịch mã nguồn và tự động chuyển đổi các khối code tĩnh thành **Interactive Code Playground** có khả năng gõ và chạy code tương tác trực tiếp theo thời gian thực.
    *   **Nạp nội dung mẫu**: Tích hợp nút nạp dữ liệu mẫu nhanh cho chương "Objects" và chương "Functions" giúp đơn giản hóa việc thử nghiệm và kiểm tra giao diện.
*   **Trạng thái**: Hoàn thành.

### Bước 12: Tách cấu trúc Mock Database & Bổ sung toàn bộ Chương 5 (Data types) từ 5.1 - 5.12
*   **Tập tin mới**: [data-types.content.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/mocks/lessons/data-types.content.ts), [l11.content.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/mocks/lessons/l11.content.ts), [l12.content.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/mocks/lessons/l12.content.ts), [index.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/mocks/lessons/index.ts)
*   **Tập tin thay đổi**: [javascript-info.mock.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/mocks/javascript-info.mock.ts)
*   **Nội dung thay đổi**:
    *   **Tách nhỏ Mock Data**: Tạo thư mục riêng `mocks/lessons/` để lưu trữ các bài học có nội dung văn bản dài. Di chuyển nội dung của các bài học cũ `l11` (Objects) và `l12` (Object Copying) ra các tệp riêng, giúp tệp cấu trúc `javascript-info.mock.ts` nhẹ đi đáng kể và dễ theo dõi.
    *   **Bổ sung Chương 5 (Data types)**: Viết toàn bộ nội dung HTML bài đọc kèm các ví dụ gõ code chạy thực tế cho 12 bài học từ 5.1 đến 5.12 định dạng chuẩn của JavaScript.info (gồm số, chuỗi, mảng, Map & Set, WeakMap, Destructuring, Date, JSON).
    *   **Áp dụng dữ liệu nháp của người dùng**: Chuyển đổi và tinh chỉnh phần ghi chú nháp của người dùng về Map & Set thành nội dung giảng dạy trực quan cùng khối chạy code trong bài học 5.7.
*   **Trạng thái**: Hoàn thành.

### Bước 13: Tích hợp trang đọc báo cáo dự án động (Reports Reader Dashboard)
*   **Tập tin mới**: [page.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/app/%28protected%29/lms/reports/page.tsx)
*   **Tập tin thay đổi**: [AppSidebar.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/components/shared/AppSidebar.tsx), [common.json (vi & en)](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/public/locales/vi/common.json)
*   **Nội dung thay đổi**:
    *   **Cài đặt thư viện biên dịch Markdown**: Thêm thư viện `marked` để hỗ trợ phân tích và hiển thị trực tiếp các tệp tài liệu Markdown trên web.
    *   **Xây dựng trang Reports Reader**: Thiết lập trang `/lms/reports` dưới dạng Next.js Server Component. Ứng dụng tự động truy xuất thư mục `/doc` ở mức gốc (root), liệt kê toàn bộ các tệp `.md` (báo cáo, ghi chú, nhật ký phát triển) kèm theo các siêu dữ liệu động (dung lượng tệp, thời gian cập nhật gần nhất) và chuyển ngữ nội dung Markdown sang HTML để kết xuất trên trình duyệt.
    *   **Tích hợp thanh Sidebar**: Thêm nút điều hướng tiện ích "Báo cáo & Nhật ký" (Reports & Logs) vào menu chính của thanh `AppSidebar`, đồng bộ hóa nhãn hiển thị đa ngôn ngữ (Tiếng Anh và Tiếng Việt).
*   **Trạng thái**: Hoàn thành.

---
*(Quá trình tối ưu hóa trải nghiệm học tập và tinh chỉnh UI LogiX LMS đã hoàn tất thành công)*
