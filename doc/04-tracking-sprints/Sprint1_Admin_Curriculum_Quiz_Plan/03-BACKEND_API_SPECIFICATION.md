# KẾ HOẠCH MỞ RỘNG SPRINT 1: ADMIN CURRICULUM & QUIZ BUILDER
## 03. ĐẶC TẢ KỸ THUẬT BACKEND REST API (BACKEND SPECIFICATION)

> **Mục tiêu:** Xây dựng bộ RESTful APIs cho Admin quản lý Chương (Module), Bài học (Lesson: Video, Article, PDF) và Soạn đề thi (Quiz & Questions Builder).  
> **Thư mục:** `Practice/LogiX/doc/04-tracking-sprints/Sprint1_Admin_Curriculum_Quiz_Plan/`  

---

## 1. QUẢN LÝ CHƯƠNG HỌC (COURSE MODULES API)

Prefix: `/api/admin/courses/:courseId/modules`

| Method | Endpoint | Mô tả | Request Body | Response (200/201) |
|---|---|---|---|---|
| `GET` | `/` | Lấy toàn bộ Chương & Bài học của Khóa học (Curriculum Tree) | None | `{ success: true, data: [ { id, title, sortOrder, lessons: [...] } ] }` |
| `POST` | `/` | Tạo Chương mới | `{ title: string, sortOrder?: number }` | `{ success: true, data: { id, title, sortOrder } }` |
| `PUT` | `/:moduleId` | Cập nhật tên/thứ tự Chương | `{ title?: string, sortOrder?: number }` | `{ success: true, data: Module }` |
| `DELETE` | `/:moduleId` | Xóa Chương (Cascade xóa bài học bên trong) | None | `{ success: true, message: 'Deleted' }` |
| `POST` | `/reorder` | Sắp xếp lại thứ tự các Chương | `{ moduleOrders: [ { id: string, sortOrder: number } ] }` | `{ success: true, message: 'Reordered' }` |

---

## 2. QUẢN LÝ BÀI HỌC (LESSONS API)

Prefix: `/api/admin/modules/:moduleId/lessons`

### 2.1. Endpoints chính
| Method | Endpoint | Mô tả | Request Body |
|---|---|---|---|
| `POST` | `/` | Tạo Bài học mới (Video / Article / PDF / Checklist / Quiz) | Chi tiết DTO bên dưới |
| `GET` | `/:lessonId` | Lấy chi tiết bài học (Kèm nội dung Quiz nếu là QUIZ) | None |
| `PUT` | `/:lessonId` | Cập nhật thông tin bài học | Partial DTO |
| `DELETE` | `/:lessonId` | Xóa bài học (Cascade xóa Quiz & Options) | None |
| `POST` | `/reorder` | Sắp xếp lại thứ tự bài học trong Chương | `{ lessonOrders: [ { id: string, sortOrder: number } ] }` |

### 2.2. DTO Tạo/Sửa Bài học (`CreateLessonDTO`)
```typescript
interface CreateLessonDTO {
  title: string;
  description?: string; // Mô tả bài học / Video overview
  lessonType: 'VIDEO' | 'ARTICLE' | 'PDF' | 'CHECKLIST' | 'QUIZ';
  
  // Dành cho VIDEO
  videoProvider?: 'YOUTUBE' | 'DIRECT_UPLOAD' | 'EXTERNAL_URL';
  videoUrl?: string; // Link YouTube hoặc Link file upload
  videoStoragePath?: string;
  videoDuration?: number; // Giây
  
  // Dành cho ARTICLE / PDF / SOP
  bodyHtml?: string; // Rich Text / HTML
  documentUrl?: string; // PDF URL
  estimatedReadTime?: number; // Phút
  checklistItems?: string;
  sopCode?: string;
  sopType?: 'STORE_SOP' | 'FACTORY_SOP';
  requiresSignature?: boolean;
  
  // Cài đặt chung
  allowDownload?: boolean;
  isVisible?: boolean;
  sortOrder?: number;
}
```

---

## 3. SOẠN THẢO BÀI KIỂM TRA (QUIZ & QUESTION BUILDER API)

Prefix: `/api/admin/lessons/:lessonId/quiz`

| Method | Endpoint | Mô tả | Request Body / Query |
|---|---|---|---|
| `GET` | `/` | Lấy thông tin Quiz và toàn bộ Câu hỏi/Đáp án của Lesson | None |
| `POST` | `/` | Khởi tạo / Cập nhật cấu hình Quiz cho Lesson | `{ title: string, description?: string, passScore: number, maxAttempts: number, timeLimitMinutes?: number, shuffleQuestions: boolean }` |
| `POST` | `/questions` | Thêm câu hỏi mới vào Quiz | `{ questionText: string, questionType: QuestionType, points: number, explanation?: string, options: [ { optionText: string, isCorrect: boolean } ] }` |
| `PUT` | `/questions/:questionId` | Sửa câu hỏi & danh sách đáp án | Tương tự DTO thêm câu hỏi |
| `DELETE` | `/questions/:questionId` | Xóa câu hỏi khỏi Quiz | None |
| `POST` | `/questions/reorder` | Sắp xếp lại thứ tự câu hỏi | `{ questionOrders: [ { id: string, sortOrder: number } ] }` |

---

## 4. XỬ LÝ MEDIA & FILE UPLOAD (MEDIA API)

Prefix: `/api/admin/media`

| Method | Endpoint | Mô tả | Request | Response |
|---|---|---|---|---|
| `POST` | `/upload-video` | Upload video MP4/WebM trực tiếp lên Storage | `multipart/form-data` (file: Video) | `{ success: true, data: { fileUrl: string, storagePath: string, durationSeconds: number, fileName: string } }` |
| `POST` | `/upload-document` | Upload tài liệu PDF/Slide đính kèm | `multipart/form-data` (file: PDF) | `{ success: true, data: { fileUrl: string, fileName: string } }` |
| `POST` | `/parse-youtube` | Kiểm tra và trích xuất Video ID, thumbnail từ YouTube URL | `{ url: string }` | `{ success: true, data: { videoId: string, embedUrl: string, defaultThumbnail: string } }` |
