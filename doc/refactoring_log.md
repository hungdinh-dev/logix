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

---
*(Quá trình refactor toàn bộ trang Dashboard đã hoàn tất thành công)*
