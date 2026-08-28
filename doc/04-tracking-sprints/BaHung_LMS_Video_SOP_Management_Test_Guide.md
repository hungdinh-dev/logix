# 📘 HƯỚNG DẪN KIỂM TRA & TEST CÁC CHỨC NĂNG (DOMAIN: QUẢN LÝ VIDEO ĐÀO TẠO & HỌC LIỆU SOP) - BA HÙNG LMS

> **Mã Domain:** Quản lý học liệu & Video đào tạo (Training Media & SOP Management)  
> **Phạm vi chức năng:** `LMS-013` $\rightarrow$ `LMS-021`  
> **Kiến trúc áp dụng:** Monorepo LogiX (Next.js 15 App Router + Express TypeScript + PostgreSQL/Prisma)  
> **Tài liệu tham chiếu:** [Checklist-BaHung-Sprint1.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/Sprint1_LMS_BaHung/Checklist-BaHung-Sprint1.md) & [LMS-Unified-Function-and-DB-Context.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/LMS-Unified-Function-and-DB-Context.md)

---

## 📑 MỤC LỤC TỔNG QUAN

1. [LMS-013: Tạo bài giảng dạng Video (YouTube & Direct Upload)](#1-lms-013-tạo-bài-giảng-dạng-video-youtube--upload)
2. [LMS-014: Tạo bài giảng dạng Tài liệu PDF / Slide](#2-lms-014-tạo-bài-giảng-dạng-tài-liệu-pdf--slide)
3. [LMS-015: Tạo bài giảng dạng Trang văn bản (Rich Text SOP)](#3-lms-015-tạo-bài-giảng-dạng-trang-văn-bản-rich-text-sop)
4. [LMS-016: Tạo bài giảng dạng Hình ảnh & Checklist Quy trình](#4-lms-016-tạo-bài-giảng-dạng-hình-ảnh--checklist-quy-trình)
5. [LMS-017: Cấu trúc & Sắp xếp thứ tự Chương & Bài học (Curriculum & Reorder)](#5-lms-017-cấu-trúc--sắp-xếp-thứ-tự-chương--bài-học-curriculum--reorder)
6. [LMS-018: Ẩn / Hiện bài giảng (Lesson Visibility Control)](#6-lms-018-ẩn--hiện-bài-giảng-lesson-visibility-control)
7. [LMS-019: Gắn tài liệu SOP Vận hành Cửa hàng (Store SOP)](#7-lms-019-gắn-tài-liệu-sop-vận-hành-cửa-hàng-store-sop)
8. [LMS-020: Gắn tài liệu SOP Khối Sản xuất (Factory SOP)](#8-lms-020-gắn-tài-liệu-sop-khối-sản-xuất-factory-sop)
9. [LMS-021: Phiên bản hóa học liệu & Quản lý siêu dữ liệu (Versioning & Metadata)](#9-lms-021-phiên-bản-hóa-học-liệu--quản-lý-siêu-dữ-liệu-versioning--metadata)
10. [Bảng Checklist Tổng hợp Kiểm tra Nhanh (Quick Smoke Test)](#-bảng-checklist-tổng-hợp-kiểm-tra-nhanh-quick-smoke-test)

---

## 🛠️ THIẾT LẬP MÔI TRƯỜNG KIỂM THỬ

### 1. Khởi động Backend API
```bash
cd Practice/LogiX/backend
npm run dev
# Swagger UI: http://localhost:5000/api-docs
```

### 2. Khởi động Frontend Web App
```bash
cd Practice/LogiX/frontend
npm run dev
# App URL: http://localhost:3000
```

### 3. Tài khoản kiểm thử
* **Quản trị viên (Admin/Trainer):** `admin@bahung.vn` / `Admin@123456` (Có quyền `COURSE.CREATE`)
* **Học viên mẫu (Learner):** `alex@logix.com` / `Password123`

---

---

## 1. LMS-013: TẠO BÀI GIẢNG DẠNG VIDEO (YOUTUBE & UPLOAD)

> **Mô tả:** Hỗ trợ tạo bài giảng truyền tải qua Video. Hệ thống tích hợp công cụ phân tích link YouTube (`parse-youtube`) tự động trích xuất `videoId`, `thumbnailUrl`, `embedUrl` và cho phép lưu trữ video tải trực tiếp (`DIRECT_UPLOAD`).

### 📌 1.1. Điều kiện cần (Prerequisites)
* Đã có sẵn Khóa học (Course) và ít nhất 1 Chương học (CourseModule).
* Tài khoản có quyền `COURSE.CREATE`.

### 📂 1.2. Luồng mở file Backend (BE)
1. **Model Database:** [`backend/prisma/schema.prisma`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/prisma/schema.prisma) $\rightarrow$ Model `Lesson` (Dòng ~273):
   * `lessonType: LessonType @default(VIDEO)`
   * `videoProvider: VideoProvider? @default(YOUTUBE)` (`YOUTUBE`, `DIRECT_UPLOAD`, `EXTERNAL_URL`)
   * `videoUrl: String?`
   * `videoDuration: Int @default(0)` (thời lượng tính bằng giây)
2. **DTO & Schema Validation:** [`backend/src/modules/lessons/lesson.dto.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/lessons/lesson.dto.ts)
   * `createLessonSchema` $\rightarrow$ Validate `lessonType: 'VIDEO'`, `videoUrl`, `videoProvider`.
   * `parseYoutubeSchema` $\rightarrow$ Validate URL regex YouTube.
3. **Business Logic & Service:** [`backend/src/modules/lessons/lesson.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/lessons/lesson.service.ts)
   * `parseYoutubeUrl(dto)`: Bóc tách Video ID từ các định dạng link (`watch?v=`, `youtu.be/`, `embed/`).
   * `createLesson(moduleId, dto)`: Lưu bài học video vào DB.
4. **Controller & Routes:**
   * Controller: [`backend/src/modules/lessons/lesson.controller.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/lessons/lesson.controller.ts)
   * Routes: [`backend/src/modules/lessons/lesson.routes.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/lessons/lesson.routes.ts)
     * `POST /api/lessons/parse-youtube`
     * `POST /api/lessons/modules/:moduleId`

### 🖥️ 1.3. Luồng mở file Frontend (FE)
1. **Player Component:** [`frontend/src/features/lms/components/lesson-player/LessonVideoPlayer.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/lesson-player/LessonVideoPlayer.tsx) $\rightarrow$ Render iframe YouTube Player chuẩn 16:9 kèm nút Play/Pause, tua thời gian, thanh tiến độ.
2. **Trang Học viên:** [`frontend/src/features/lms/pages/LessonPlayerPage.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/pages/LessonPlayerPage.tsx) $\rightarrow$ Giao diện phát video kèm danh sách bài học bên phải.
3. **Service API:** [`frontend/src/features/lms/services/course.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/services/course.service.ts)

### 🧪 1.4. Các bước Test trên UI & Swagger
1. **Test API Parse YouTube:**
   * Gửi `POST /api/lessons/parse-youtube` với body: `{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}`
   * $\rightarrow$ Trả về `{ videoId: "dQw4w9WgXcQ", embedUrl: "...", thumbnailUrl: "..." }`.
2. **Test Xem Video trên Frontend:**
   * Mở trình duyệt: `http://localhost:3000/lms/lessons/1` (hoặc ID bài học video).
   * Video hiển thị với kích thước chuẩn, tự động load đúng video từ YouTube.
   * Nút Play/Pause, âm lượng và fullscreen hoạt động trơn tru.

---

---

## 2. LMS-014: TẠO BÀI GIẢNG DẠNG TÀI LIỆU PDF / SLIDE

> **Mô tả:** Đính kèm tài liệu học tập, slide thuyết trình chuẩn định dạng PDF. Học viên có thể xem trực tiếp trên nền web hoặc tải về theo cấu hình `allowDownload`.

### 📌 2.1. Điều kiện cần
* Đường dẫn file PDF (`documentUrl`) hợp lệ.

### 📂 2.2. Luồng mở file Backend (BE)
1. **Model Database:** [`schema.prisma`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/prisma/schema.prisma) $\rightarrow$ Model `Lesson`:
   * `lessonType: 'PDF'`
   * `documentUrl: String?`
   * `allowDownload: Boolean @default(false)`
   * `estimatedReadTime: Int @default(5)` (số phút ước tính)
2. **DTO & Service:** [`lesson.dto.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/lessons/lesson.dto.ts) & [`lesson.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/lessons/lesson.service.ts).

### 🖥️ 2.3. Luồng mở file Frontend (FE)
1. **Content Component:** [`frontend/src/features/lms/components/lesson-player/LessonContentTabs.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/lesson-player/LessonContentTabs.tsx) $\rightarrow$ Tab "Tài liệu PDF" hiển thị khung nhúng PDF viewer kèm nút tải xuống nếu `allowDownload = true`.
2. **Trang Player:** [`frontend/src/features/lms/pages/LessonPlayerPage.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/pages/LessonPlayerPage.tsx).

### 🧪 2.4. Các bước Test trên UI
1. Tạo bài học chọn loại **PDF** với `documentUrl: "https://example.com/tailieu.pdf"` và `allowDownload: true`.
2. Vào giao diện học viên mở bài học này $\rightarrow$ Khung đọc tài liệu PDF xuất hiện.
3. Nút **"Tải tài liệu PDF"** hiển thị rõ ràng và cho phép học viên tải file về máy.

---

---

## 3. LMS-015: TẠO BÀI GIẢNG DẠNG TRANG VĂN BẢN (RICH TEXT SOP)

> **Mô tả:** Soạn thảo văn bản quy trình thao tác chuẩn (SOP), tài liệu đào tạo nội dung phong phú với hình ảnh, bảng biểu, danh sách chỉ dẫn bước làm trực quan dạng HTML.

### 📂 3.1. Luồng mở file Backend (BE)
1. **Model Database:** [`schema.prisma`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/prisma/schema.prisma) $\rightarrow$ Model `Lesson`:
   * `lessonType: 'ARTICLE'`
   * `bodyHtml: String?` (Lưu nội dung HTML rich text)
   * `estimatedReadTime: Int` (Thời gian đọc ước tính)
2. **Service & DTO:** [`lesson.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/lessons/lesson.service.ts) $\rightarrow$ Xử lý lưu chuỗi HTML sanitized an toàn.

### 🖥️ 3.2. Luồng mở file Frontend (FE)
1. **Editor Soạn thảo:** [`frontend/src/features/lms/components/editor/LessonRichEditor.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/editor/LessonRichEditor.tsx) $\rightarrow$ Bộ công cụ định dạng Bold, Italic, List, Code, Table, chèn Link.
2. **Trình hiển thị Nội dung:** [`frontend/src/features/lms/components/lesson-player/LessonContentTabs.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/lesson-player/LessonContentTabs.tsx) $\rightarrow$ Render chuẩn Typography prose sạch sẽ, dễ đọc trên mobile và desktop.

### 🧪 3.3. Các bước Test trên UI
1. Mở trình soạn thảo bài học $\rightarrow$ Nhập nội dung văn bản quy trình kèm tiêu đề H2, danh sách chấm tròn và ảnh minh họa.
2. Bấm Lưu $\rightarrow$ Vào giao diện học viên xem bài học.
3. Toàn bộ định dạng HTML hiển thị chính xác, có ước tính thời gian đọc (VD: `⏱️ 5 phút đọc`).

---

---

## 4. LMS-016: TẠO BÀI GIẢNG DẠNG HÌNH ẢNH & CHECKLIST QUY TRÌNH

> **Mô tả:** Tạo bài giảng tương tác dưới dạng Checklist các bước kiểm tra thực tế (ví dụ: *Checklist mở ca cửa hàng*, *Checklist vệ sinh máy ép*, *Quy trình 5S xưởng sản xuất*) được lưu dưới dạng chuỗi JSON `checklistItems`.

### 📂 4.1. Luồng mở file Backend (BE)
1. **Model Database:** [`schema.prisma`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/prisma/schema.prisma) $\rightarrow$ Model `Lesson`:
   * `lessonType: 'CHECKLIST'`
   * `checklistItems: String?` (JSON cấu trúc `{ id, text, isCompleted }[]`)
2. **Service & DTO:** [`lesson.dto.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/lessons/lesson.dto.ts) $\rightarrow$ `createLessonSchema`.

### 🖥️ 4.2. Luồng mở file Frontend (FE)
1. **Component Hiển thị:** [`frontend/src/features/lms/components/lesson-player/LessonContentTabs.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/lesson-player/LessonContentTabs.tsx) $\rightarrow$ Render danh sách các ô checkbox tương tác.

### 🧪 4.3. Các bước Test trên UI
1. Tạo bài học dạng Checklist với 4 bước kiểm tra.
2. Học viên mở bài học $\rightarrow$ Tích chọn từng bước hoàn thành $\rightarrow$ Tiến độ checklist cập nhật `4/4 bước đã hoàn tất`.

---

---

## 5. LMS-017: CẤU TRÚC & SẮP XẾP THỨ TỰ CHƯƠNG & BÀI HỌC (CURRICULUM & REORDER)

> **Mô tả:** Xây dựng toàn bộ cây chương trình đào tạo bao gồm nhiều Chương (Modules) và nhiều Bài học (Lessons). Cho phép sắp xếp thứ tự hiển thị bằng thao tác Reorder (`sortOrder`).

### 📂 5.1. Luồng mở file Backend (BE)
1. **Model Database:**
   * `CourseModule`: `courseId`, `title`, `sortOrder: Int @default(1)`
   * `Lesson`: `moduleId`, `title`, `sortOrder: Int @default(1)`
2. **Service Methods:** [`backend/src/modules/courses/course.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.service.ts) & [`lesson.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/lessons/lesson.service.ts):
   * `getCourseCurriculum(courseId)`: Trả về cây Modules $\rightarrow$ Lessons (kèm Quiz) sắp xếp theo `sortOrder asc`.
   * `createModule(courseId, dto)`: Tạo chương mới.
   * `reorderModules(courseId, dto)`: Cập nhật hàng loạt vị trí các chương trong một transaction.
   * `reorderLessons(moduleId, dto)`: Cập nhật vị trí các bài học trong chương.
3. **Endpoints:**
   * `GET /api/courses/:id/curriculum`
   * `POST /api/courses/:id/modules`
   * `POST /api/courses/:id/modules/reorder`
   * `POST /api/lessons/modules/:moduleId/reorder`

### 🖥️ 5.2. Luồng mở file Frontend (FE)
1. **Accordion Chương trình:** [`frontend/src/features/lms/components/course-detail/CourseContentAccordion.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/course-detail/CourseContentAccordion.tsx) $\rightarrow$ Hiển thị cây chương & bài học mở rộng/thu gọn.
2. **Sidebar Danh sách Bài học:** [`frontend/src/features/lms/components/lesson-player/LessonOutlinePanel.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/lesson-player/LessonOutlinePanel.tsx) $\rightarrow$ Cột danh sách bài học phân theo từng chương khi đang học.
3. **Trang Chi tiết Khóa học:** [`frontend/src/features/lms/pages/CourseDetailPage.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/pages/CourseDetailPage.tsx).

### 🧪 5.3. Các bước Test trên UI
1. Mở trang chi tiết khóa học: `http://localhost:3000/lms/courses/:id`.
2. Kiểm tra phần **"Nội dung khóa học"** $\rightarrow$ Các chương được đánh số `Chương 1`, `Chương 2` và các bài học hiển thị đúng theo thứ tự đã sắp xếp.
3. Bấm vào bài học bất kỳ $\rightarrow$ Chuyển thẳng đến màn hình học của bài đó.

---

---

## 6. LMS-018: ẨN / HIỆN BÀI GIẢNG (LESSON VISIBILITY CONTROL)

> **Mô tả:** Cho phép quản trị viên/giảng viên tạm ẩn một bài học đang trong quá trình cập nhật nội dung (`isVisible = false`) mà không cần xóa bài học khỏi hệ thống.

### 📂 6.1. Luồng mở file Backend (BE)
1. **Model Database:** `Lesson.isVisible: Boolean @default(true)`.
2. **Service Logic:** [`lesson.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/lessons/lesson.service.ts):
   * `updateLesson(id, { isVisible: false })` $\rightarrow$ Cập nhật cờ ẩn/hiện.
3. **Endpoint:** `PUT /api/lessons/:id`.

### 🖥️ 6.2. Luồng mở file Frontend (FE)
* Quản lý trạng thái trên bảng điều khiển Admin và ẩn bài học khỏi Outline của học viên thông thường khi `isVisible = false`.

### 🧪 6.3. Các bước Test trên UI
1. Gửi request `PUT /api/lessons/:id` với `isVisible: false`.
2. Đăng nhập với tài khoản học viên $\rightarrow$ Bài học bị ẩn không còn xuất hiện trong danh sách học.
3. Đổi lại `isVisible: true` $\rightarrow$ Bài học lập tức xuất hiện trở lại.

---

---

## 7. LMS-019: GẮN TÀI LIỆU SOP VẬN HÀNH CỬA HÀNG (STORE SOP)

> **Mô tả:** Gắn tài liệu Quy trình thao tác chuẩn dành riêng cho khối Cửa hàng (FOH/BOH, pha chế, phục vụ, đóng/mở ca) với mã tài liệu `sopCode` và phân loại `sopType = 'STORE_SOP'`. Hỗ trợ bật yêu cầu ký xác nhận quy trình `requiresSignature`.

### 📂 7.1. Luồng mở file Backend (BE)
1. **Model Database:** [`schema.prisma`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/prisma/schema.prisma) $\rightarrow$ Model `Lesson`:
   * `sopCode: String?` (VD: `SOP-CH-01: Quy trình mở ca`)
   * `sopType: String?` (`STORE_SOP`)
   * `requiresSignature: Boolean @default(false)`
2. **DTO:** `createLessonSchema` trong [`lesson.dto.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/lessons/lesson.dto.ts).

### 🖥️ 7.2. Luồng mở file Frontend (FE)
1. **Badge & Banner:** [`frontend/src/features/lms/components/lesson-player/LessonContentTabs.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/lesson-player/LessonContentTabs.tsx) $\rightarrow$ Hiển thị Badge xanh dương `SOP CỬA HÀNG` và mã `sopCode`.

### 🧪 7.3. Các bước Test trên UI
1. Tạo bài học có `sopCode: "SOP-STORE-001"`, `sopType: "STORE_SOP"`.
2. Học viên vào học bài này $\rightarrow$ Đầu trang hiển thị rõ ràng nhãn nhận diện **"SOP Cửa hàng - Mã: SOP-STORE-001"**.

---

---

## 8. LMS-020: GẮN TÀI LIỆU SOP KHỐI SẢN XUẤT (FACTORY SOP)

> **Mô tả:** Gắn tài liệu Quy trình chuẩn dành riêng cho các khâu Xưởng sản xuất (Khâu trộn bột, khâu nướng bánh, khâu bơm kem, khâu cắt lát & đóng gói) với `sopCode` và `sopType = 'FACTORY_SOP'`.

### 📂 8.1. Luồng mở file Backend (BE)
1. **Model Database:** `Lesson.sopCode`, `Lesson.sopType = 'FACTORY_SOP'`, `Lesson.requiresSignature`.
2. **Service:** [`lesson.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/lessons/lesson.service.ts).

### 🖥️ 8.2. Luồng mở file Frontend (FE)
1. **Badge & Banner:** [`frontend/src/features/lms/components/lesson-player/LessonContentTabs.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/lesson-player/LessonContentTabs.tsx) $\rightarrow$ Hiển thị Badge cam/nâu `SOP SẢN XUẤT - XƯỞNG`.

### 🧪 8.3. Các bước Test trên UI
1. Tạo bài học chọn `sopType: "FACTORY_SOP"`, `sopCode: "SOP-XUONG-KEM-03"`.
2. Học viên khối sản xuất vào học $\rightarrow$ Hiển thị đúng nhãn phân loại chuyên biệt cho xưởng.

---

---

## 9. LMS-021: PHIÊN BẢN HÓA HỌC LIỆU & QUẢN LÝ SIÊU DỮ LIỆU (VERSIONING & METADATA)

> **Mô tả:** Quản lý lịch sử chỉnh sửa bài giảng (`createdAt`, `updatedAt`), tính toán tự động tổng thời lượng học (`videoDuration`, `estimatedReadTime`) để học viên và người đào tạo dễ dàng nắm bắt quy mô bài học.

### 📂 9.1. Luồng mở file Backend (BE)
1. **Model Database:**
   * `Lesson.createdAt: DateTime @default(now())`
   * `Lesson.updatedAt: DateTime @updatedAt`
   * `Lesson.videoDuration: Int` (thời lượng giây)
   * `Lesson.estimatedReadTime: Int` (thời lượng phút)
2. **Service Logic:** [`lesson.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/lessons/lesson.service.ts) $\rightarrow$ Trả về metadata chi tiết khi gọi `getLessonById(id)`.

### 🖥️ 9.2. Luồng mở file Frontend (FE)
1. **Thanh Thông tin Bottom Bar:** [`frontend/src/features/lms/components/lesson-player/LessonBottomBar.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/lesson-player/LessonBottomBar.tsx) $\rightarrow$ Hiển thị thời lượng bài học và nút chuyển bài trước/sau.
2. **Outline Sidebar:** [`frontend/src/features/lms/components/lesson-player/LessonOutlinePanel.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/lesson-player/LessonOutlinePanel.tsx) $\rightarrow$ Hiển thị thời lượng bên cạnh từng bài học (VD: `12:30`, `5 phút`).

### 🧪 9.3. Các bước Test trên UI
1. Mở giao diện học viên $\rightarrow$ Quan sát danh sách bài học bên tay phải.
2. Từng bài học đều hiển thị rõ icon loại bài (Video 🎥, Bài đọc 📄, Quiz ❓) và thời lượng dự kiến.
3. Khi cập nhật nội dung bài học, `updatedAt` tự động được làm mới chính xác.

---

---

## 🎯 BẢNG CHECKLIST TỔNG HỢP KIỂM TRA NHANH (QUICK SMOKE TEST)

| STT | Mã CN | Tên Chức năng | Điểm kiểm tra Backend (BE) | Điểm kiểm tra Frontend (FE) | Kết quả mong đợi |
| :---: | :---: | :--- | :--- | :--- | :--- |
| 1 | **LMS-013** | Bài giảng Video | `POST /api/lessons/parse-youtube` & `POST /api/lessons/modules/:id` | `LessonVideoPlayer.tsx` | Parse link Youtube & Phát video 16:9 chuẩn |
| 2 | **LMS-014** | Bài giảng PDF/Slide | `Lesson.lessonType = 'PDF'`, `documentUrl` | `LessonContentTabs.tsx` (PDF Viewer) | Hiển thị tài liệu PDF & Nút Download |
| 3 | **LMS-015** | Bài giảng Rich Text | `Lesson.lessonType = 'ARTICLE'`, `bodyHtml` | `LessonRichEditor.tsx` & Prose View | Render chuẩn HTML format, ảnh, bảng |
| 4 | **LMS-016** | Checklist quy trình | `Lesson.lessonType = 'CHECKLIST'`, `checklistItems` | Checkbox items trong `LessonContentTabs.tsx` | Tích chọn hoàn thành từng bước quy trình |
| 5 | **LMS-017** | Sắp xếp Chương & Bài | `POST /api/courses/:id/modules/reorder`, `/lessons/.../reorder` | `CourseContentAccordion.tsx`, `LessonOutlinePanel.tsx` | Reorder thứ tự bài học trong khóa trơn tru |
| 6 | **LMS-018** | Ẩn/Hiện bài học | `PUT /api/lessons/:id` (`isVisible: boolean`) | Outline filter & Badge Draft | Bài học ẩn không hiển thị cho học viên |
| 7 | **LMS-019** | SOP Vận hành Cửa hàng | `Lesson.sopType = 'STORE_SOP'`, `sopCode` | Badge `SOP Cửa Hàng` trên Player | Đánh dấu chuẩn quy trình khối Cửa hàng |
| 8 | **LMS-020** | SOP Khối Sản xuất | `Lesson.sopType = 'FACTORY_SOP'`, `sopCode` | Badge `SOP Sản Xuất` trên Player | Đánh dấu chuẩn quy trình khối Xưởng SX |
| 9 | **LMS-021** | Metadata & Thời lượng | Cột `videoDuration`, `estimatedReadTime`, `updatedAt` | `LessonOutlinePanel.tsx`, `LessonBottomBar.tsx` | Hiển thị thời lượng bài học và ngày cập nhật |
