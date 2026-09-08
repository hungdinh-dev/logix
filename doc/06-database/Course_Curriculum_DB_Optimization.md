# TỐI ƯU HÓA DATABASE SCHEMA: COURSE & CURRICULUM MODULE (COURSERA-STYLE ARCHITECTURE)

> **Tài liệu:** Đánh giá, So khớp Nghiệp vụ & Đề xuất Tối ưu Cơ sở Dữ liệu Module Khóa học & Bài học  
> **Áp dụng chuẩn:** PostgreSQL Database Specialist (`.agents/agents/database-reviewer.md`)  
> **Dự án:** LMS-BaHung (F&B Chain & Factory Training)  
> **Vị trí lưu trữ:** `Practice/LogiX/doc/06-database/Course_Curriculum_DB_Optimization.md`  

---

## 1. TỔNG QUAN & SO KHỚP YÊU CẦU NGHIỆP VỤ (GAP ANALYSIS)

### 1.1. Yêu cầu Nghiệp vụ theo Mô hình Coursera
Khóa học được cấu trúc phân cấp chuẩn hóa:
```
Course (Khóa học)
 └── CourseModule / Chapter (Chương học)
      └── Lesson / Learning Item (Bài học / Đơn vị học tập)
           ├── Dạng 1: VIDEO (YouTube URL hoặc Tự Upload file trực tiếp + Mô tả bài học)
           ├── Dạng 2: ARTICLE / TEXT (Bài đọc Rich Text / Markdown / PDF đính kèm)
           └── Dạng 3: QUIZ / ASSESSMENT (Bài kiểm tra trắc nghiệm / tự luận với điểm đạt, số lần thử)
```

### 1.2. Đánh giá Schema Prisma Hiện Tại (`prisma/schema.prisma`)

| Hạng mục | Hiện trạng Schema Prisma | Đáp ứng yêu cầu? | Nhận định & Khoảng trống (Gaps) |
|---|---|:---:|---|
| **Cấu trúc Khóa học -> Chương -> Bài** | `Course` -> `CourseModule` -> `Lesson` | ✅ **ĐẠT** | Phân cấp 1-N rõ ràng, có `sortOrder` sắp xếp thứ tự. |
| **Dạng 1: Video (YouTube vs Upload + Mô tả)** | Có `videoUrl`, thiếu `videoProvider`, thiếu `description`/`summary` | ⚠️ **CHƯA ĐỦ** | Chỉ có 1 trường `videoUrl: String?`. Chưa phân biệt nguồn (`YOUTUBE`, `LOCAL_STORAGE`, `S3`), chưa có trường lưu metadata như `videoStoragePath`, `videoDuration`, và **thiếu mô tả bài giảng** (`description`). |
| **Dạng 2: Bài viết (Đọc text/PDF)** | Có `bodyHtml`, `documentUrl` | 🟡 **TƯƠNG ĐỐI** | Đã có `bodyHtml` (Rich Text) và `documentUrl` (PDF), nhưng chưa có ước tính thời gian đọc (`estimatedReadTimeMinutes`). |
| **Dạng 3: Quiz như một Lesson** | **Chưa có trong Prisma** | ❌ **CHƯA ĐẠT** | Trong `schema.prisma` **hoàn toàn chưa có các bảng Quiz**. Trong file draft cũ `BaHung-DB-Design.md`, Quiz lại gắn trực tiếp vào `Course` (`course_id`) thay vì gắn vào `Lesson`/`Module`, khiến không thể tạo Quiz ở cuối từng Chương (Chapter Quiz) theo chuẩn Coursera. |
| **Theo dõi Tiến độ (Progress Tracking)** | `LessonProgress` (`isCompleted`, `lastPositionSeconds`) | ⚠️ **CHƯA ĐỦ CHO QUIZ** | `LessonProgress` mới chỉ hỗ trợ `lastPositionSeconds` (video), chưa lưu điểm số Quiz cao nhất (`quizHighestScore`), số lần đã làm (`attemptsCount`), trạng thái đạt (`isPassed`). |
| **Index & Hiệu năng Query** | Thiếu Foreign Key Indexing | ⚠️ **CHƯA TỐI ƯU** | Prisma không tự động tạo index cho foreign key trên PostgreSQL (`moduleId`, `courseId`, `userId`), gây Seq Scan khi tải danh sách bài học. |

---

## 2. ĐÁNH GIÁ TỐI ƯU THEO TIÊU CHUẨN DATABASE REVIEWER

Dựa trên nguyên tắc thiết kế từ `.agents/agents/database-reviewer.md`:

### 2.1. Query Performance (Hiệu năng Truy vấn)
- **Thiếu Foreign Key Indexes**: Mối quan hệ `CourseModule -> Course`, `Lesson -> CourseModule`, `LessonProgress -> Lesson` cần có explicit indexes (`@@index([moduleId])`, `@@index([courseId])`). Khi số lượng bài học và tiến độ học viên tăng lên hàng triệu bản ghi, việc truy vấn màn hình học sẽ bị **Sequential Scan** nếu thiếu index.
- **Tối ưu hóa Truy vấn Trang Học (Course Player Query)**:
  - Khi học viên vào học 1 Module: Query cần lấy danh sách Lesson kèm trạng thái hoàn thành từ `LessonProgress` của đúng User đó.
  - Cần Composite Index: `LessonProgress(userId, lessonId)` (đã có `@unique([userId, lessonId])` làm composite index).

### 2.2. Schema Design & Data Integrity
- **Chuẩn hóa Lesson Type**: Sử dụng Prisma `enum LessonType` thay cho `String` tự do để tránh dữ liệu rác:
  ```prisma
  enum LessonType {
    VIDEO
    ARTICLE
    QUIZ
    PDF
    CHECKLIST
  }
  ```
- **Hỗ trợ Video Đa nguồn**:
  ```prisma
  enum VideoProvider {
    YOUTUBE
    DIRECT_UPLOAD // File MP4 lưu trữ trên S3 / Supabase Storage / Local
    VIMEO
    EXTERNAL_URL
  }
  ```
- **Mô hình Quiz theo Chuẩn Coursera**:
  - Tách bạch: `Lesson` đóng vai trò là Learning Node trong Curriculum.
  - Nếu `lessonType == 'QUIZ'`, Lesson sẽ liên kết 1-1 với `Quiz` (hoặc nhúng trực tiếp cấu hình Quiz vào `Quiz` metadata table).
  - Điều này giúp:
    1. Một Chapter có thể chứa 3 Video Lessons + 1 Reading Lesson + 1 Graded Quiz Lesson.
    2. Điều kiện hoàn thành Lesson Quiz: Điểm thi >= `passScore`.
    3. Điều kiện hoàn thành Khóa học: 100% Lessons (bao gồm cả Quiz) đều đạt `isCompleted = true`.

### 2.3. Concurrency & Data Locking
- Khi hàng trăm nhân viên cùng nộp bài Quiz hoặc lưu `lastPositionSeconds` video, cần transaction ngắn gọn, tránh Lock toàn bảng.
- Dùng cú pháp `upsert` trên `@@unique([userId, lessonId])` để đảm bảo idempotent khi network retry.

---

## 3. THIẾT KẾ SCHEMA PRISMA ĐỀ XUẤT (OPTIMIZED PRISMA CODE)

Dưới đây là thiết kế chuẩn hóa cho Module 3 (Course & Curriculum) và Module 4 (Quiz & Assessment) đáp ứng 100% mô hình Coursera:

```prisma
// ==========================================
// ENUMS FOR LESSON & VIDEO TYPES
// ==========================================

enum LessonType {
  VIDEO
  ARTICLE
  QUIZ
  PDF
  CHECKLIST
}

enum VideoProvider {
  YOUTUBE
  DIRECT_UPLOAD
  EXTERNAL_URL
}

enum QuestionType {
  SINGLE_CHOICE
  MULTIPLE_CHOICE
  TRUE_FALSE
  SHORT_ANSWER
}

// ==========================================
// 3. COURSE & CURRICULUM MODULE
// ==========================================

model Category {
  id          String   @id @default(uuid())
  code        String   @unique
  name        String
  description String?
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  courses     Course[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @default(now()) @updatedAt

  @@map("crs_categories")
}

model Course {
  id           String   @id @default(uuid())
  code         String   @unique
  title        String
  slug         String   @unique
  description  String?
  thumbnailUrl String?
  categoryId   String
  category     Category @relation(fields: [categoryId], references: [id])

  courseType   String   @default("STANDARD") // 'ATTP', 'ONBOARDING', 'STANDARD'
  isMandatory  Boolean  @default(false)
  durationDays Int?     @default(30)
  passScore    Int      @default(80)

  // Target fields for auto-assign rules (LMS-005 -> LMS-008)
  targetPositionId       String?
  targetPosition         Position?   @relation(fields: [targetPositionId], references: [id])
  targetDepartmentId     String?
  targetDepartment       Department? @relation(fields: [targetDepartmentId], references: [id])
  targetStoreId          String?
  targetStore            Store?      @relation(fields: [targetStoreId], references: [id])
  targetEmploymentStatus String?

  isCommercial Boolean  @default(false)
  isInternal   Boolean  @default(true)
  status       String   @default("DRAFT") // 'DRAFT', 'PUBLISHED', 'ARCHIVED'
  isActive     Boolean  @default(true)

  modules     CourseModule[]
  enrollments CourseEnrollment[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @default(now()) @updatedAt

  @@index([categoryId])
  @@index([status, isActive])
  @@map("crs_courses")
}

model CourseModule {
  id        String   @id @default(uuid())
  courseId  String
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  title     String
  sortOrder Int      @default(1)
  lessons   Lesson[]

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@index([courseId, sortOrder])
  @@map("crs_modules")
}

model Lesson {
  id                String        @id @default(uuid())
  moduleId          String
  module            CourseModule  @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  title             String
  description       String?       // Mô tả bài học / tóm tắt nội dung video / hướng dẫn làm bài
  lessonType        LessonType    @default(VIDEO)
  
  // 1. VIDEO CONTENT
  videoProvider     VideoProvider? @default(YOUTUBE)
  videoUrl          String?       // URL YouTube hoặc URL CDN Storage
  videoStoragePath  String?       // Path file gốc nếu tự upload lên Supabase/S3
  videoDuration     Int           @default(0) // Thời lượng video tính bằng giây
  
  // 2. ARTICLE & DOCUMENT CONTENT
  bodyHtml          String?       // Nội dung bài viết (Rich Text / HTML / Markdown)
  documentUrl       String?       // URL tài liệu PDF đính kèm
  estimatedReadTime Int           @default(5) // Thời gian đọc ước tính (phút)
  checklistItems    String?       // JSON checklist nếu là dạng quy trình SOP
  
  // SOP / Compliance Fields
  sopCode           String?
  sopType           String?       // 'STORE_SOP', 'FACTORY_SOP'
  requiresSignature Boolean       @default(false)
  
  // Settings
  allowDownload     Boolean       @default(false)
  isVisible         Boolean       @default(true)
  sortOrder         Int           @default(1)

  // 3. QUIZ CONTENT LINK (Coursera Style: Lesson 1-1 với Quiz)
  quiz              Quiz?
  
  progressRecords   LessonProgress[]

  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @default(now()) @updatedAt

  @@index([moduleId, sortOrder])
  @@map("crs_lessons")
}

// ==========================================
// 4. QUIZ & ASSESSMENT ENGINE (Coursera-Ready)
// ==========================================

model Quiz {
  id                 String         @id @default(uuid())
  lessonId           String         @unique // Gắn trực tiếp vào Lesson dạng QUIZ
  lesson             Lesson         @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  title              String
  description        String?
  passScore          Int            @default(80) // % điểm đạt để pass lesson (VD: 80%)
  maxAttempts        Int            @default(3)  // Số lần tối đa được làm lại (0 = không giới hạn)
  timeLimitMinutes   Int?           @default(30) // Giới hạn thời gian làm bài (phút), null = không giới hạn
  shuffleQuestions   Boolean        @default(true)
  showAnswerFeedback Boolean        @default(true)

  questions          QuizQuestion[]
  attempts           QuizAttempt[]

  createdAt          DateTime       @default(now())
  updatedAt          DateTime       @default(now()) @updatedAt

  @@map("quiz_quizzes")
}

model QuizQuestion {
  id           String             @id @default(uuid())
  quizId       String
  quiz         Quiz               @relation(fields: [quizId], references: [id], onDelete: Cascade)
  
  questionText String
  questionType QuestionType       @default(SINGLE_CHOICE)
  points       Float              @default(1.0)
  explanation  String?            // Giải thích đáp án sau khi nộp bài
  sortOrder    Int                @default(1)
  
  options      QuizQuestionOption[]
  answers      QuizAttemptAnswer[]

  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @default(now()) @updatedAt

  @@index([quizId, sortOrder])
  @@map("quiz_questions")
}

model QuizQuestionOption {
  id          String       @id @default(uuid())
  questionId  String
  question    QuizQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)
  
  optionText  String
  isCorrect   Boolean      @default(false)
  sortOrder   Int          @default(1)

  @@index([questionId])
  @@map("quiz_question_options")
}

model QuizAttempt {
  id           String              @id @default(uuid())
  quizId       String
  quiz         Quiz                @relation(fields: [quizId], references: [id], onDelete: Cascade)
  userId       String
  user         User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  attemptNumber Int                @default(1)
  score        Float               @default(0.0) // Điểm số đạt được (%)
  isPassed     Boolean             @default(false)
  startedAt    DateTime            @default(now())
  submittedAt  DateTime?

  answers      QuizAttemptAnswer[]

  createdAt    DateTime            @default(now())
  updatedAt    DateTime            @default(now()) @updatedAt

  @@index([quizId, userId])
  @@map("quiz_attempts")
}

model QuizAttemptAnswer {
  id             String             @id @default(uuid())
  attemptId      String
  attempt        QuizAttempt        @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  questionId     String
  question       QuizQuestion       @relation(fields: [questionId], references: [id], onDelete: Cascade)
  
  selectedOptionId String?          // Option ID được chọn
  textAnswer     String?            // Câu trả lời tự luận
  isCorrect      Boolean?           // Kết quả đúng/sai (chấm tự động hoặc thủ công)
  earnedPoints   Float              @default(0.0)

  createdAt      DateTime           @default(now())

  @@index([attemptId])
  @@map("quiz_attempt_answers")
}

// ==========================================
// 5. ENROLLMENT & PROGRESS TRACKING
// ==========================================

model CourseEnrollment {
  id               String   @id @default(uuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId         String
  course           Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  enrollmentSource String   @default("MANUAL") // 'AUTO_RULE', 'MANUAL', 'PURCHASE'
  status           String   @default("ENROLLED") // 'ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
  dueDate          DateTime?
  completionPercentage Float @default(0.0)
  isPassed         Boolean  @default(false)

  enrolledAt       DateTime @default(now())
  completedAt      DateTime?

  lessonProgress   LessonProgress[]

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@unique([userId, courseId])
  @@index([userId, status])
  @@map("enr_course_enrollments")
}

model LessonProgress {
  id                  String           @id @default(uuid())
  enrollmentId        String
  enrollment          CourseEnrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  userId              String
  user                User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  lessonId            String
  lesson              Lesson           @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  isCompleted         Boolean          @default(false)
  lastPositionSeconds Int              @default(0)    // Dành cho Video
  quizHighestScore    Float?           // Điểm thi cao nhất (nếu là bài Quiz)
  completedAt         DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@unique([userId, lessonId])
  @@index([enrollmentId])
  @@map("enr_lesson_progress")
}
```

---

## 4. PHÂN TÍCH SPRINT TRACKING (`LMS-BaHung List Function.md`) & ĐỀ XUẤT ĐIỀU CHỈNH

### 4.1. Hiện trạng phân bổ Sprint trong `LMS-BaHung List Function.md`

| Nhóm chức năng | Mã chức năng | Tên nghiệp vụ | Sprint hiện tại | Mức ưu tiên |
|---|---|---|:---:|:---:|
| **Khóa học & Danh mục** | `LMS-001` -> `LMS-012` | Tạo danh mục, tạo khóa học, clone, gán rule, pass score... | **Sprint 1** | Bắt buộc (Phase 1) |
| **Học liệu (Lessons)** | `LMS-013` -> `LMS-021` | Bài giảng Video, PDF, Rich text, Checklist, Thứ tự bài... | **Sprint 1** | Bắt buộc / Cao |
| **Học viên & Tiến độ** | `LMS-044` -> `LMS-055` | Ghi danh, xem khóa của tôi, mở bài học, lưu tiến độ... | **Sprint 1** | Bắt buộc / Cao |
| **Lộ trình Onboarding** | `LMS-033` -> `LMS-043` | Lộ trình theo chức danh, tự gán học việc/chính thức... | **Sprint 2** | Bắt buộc (Phase 1) |
| **Quiz & Đánh giá** | `LMS-056` -> `LMS-070` | Ngân hàng câu hỏi, Quiz gắn khóa học, làm bài, chấm điểm... | **Sprint 3** | Bắt buộc (Phase 1) |
| **ATTP & Chứng chỉ** | `LMS-022` -> `LMS-032` | Khóa ATTP bắt buộc, cấp chứng chỉ, chặn xếp ca... | **Sprint 3** | Bắt buộc (Phase 1) |

### 4.2. Nhận định về việc dịch chuyển Quiz & Quản lý Khóa học

1. **Về Schema Database (Khuyến nghị làm NGAY ở Sprint 1 / Hiện tại)**:
   - Dù tính năng Quiz nằm ở Sprint 3, **cấu trúc bảng `Lesson` (hỗ trợ `QUIZ`, `VIDEO` 2 nguồn, `description`) và các bảng `Quiz` liên quan nên được đồng bộ vào Prisma Schema ngay từ bây giờ**.
   - **Lý do**: Tránh việc sang Sprint 3 phải chạy migration sửa đổi phá vỡ (breaking changes) bảng `Lesson` và `LessonProgress` đang chạy dữ liệu thực tế.

2. **Về Tiến độ Phát triển Tính năng (Feature Development)**:
   - **Phương án A (Giữ nguyên phân kỳ Sprint hiện tại)**:
     - **Sprint 1**: Tập trung hoàn thiện CRUD Category, Course, Module, Lesson (Video YouTube/Upload, Rich Text, PDF), Enrollment và lưu Progress xem bài.
     - **Sprint 3**: Triển khai trọn vẹn Quiz Engine (Ngân hàng câu hỏi, giao diện làm bài, chấm điểm tự động và liên kết hoàn thành Course).
   - **Phương án B (Đưa Quiz MVP vào Sprint 1 - Nếu ưu tiên bài kiểm tra là điều kiện bắt buộc của khóa học ngay từ đầu)**:
     - Đưa chức năng `LMS-057` (Trắc nghiệm 1 đáp án), `LMS-061` (Tạo Quiz gắn bài học), `LMS-065` (Học viên làm quiz), `LMS-066` (Chấm điểm tự động) lên **Sprint 1** dưới dạng **Quiz Lesson MVP**.
     - Giữ các tính năng nâng cao (Xáo trộn câu hỏi, Ngân hàng câu hỏi dùng chung, câu hỏi tự luận thủ công) ở **Sprint 3**.

---

## 5. BẢNG CHECKLIST KIỂM ĐỊNH THEO DATABASE REVIEWER

- [x] **WHERE/JOIN Columns Indexed**: Bổ sung `@@index([moduleId, sortOrder])`, `@@index([courseId])`, `@@index([quizId])`.
- [x] **Composite Indexes in Correct Column Order**: `@@index([courseId, sortOrder])` cho Module và `@@index([moduleId, sortOrder])` cho Lesson (Equality -> Range).
- [x] **Proper Data Types**: Sử dụng `enum LessonType`, `enum VideoProvider`, `Int` cho seconds/duration, `Float` cho score/points.
- [x] **Foreign Keys with Cascade Integrity**: Đảm bảo `onDelete: Cascade` từ `Course -> CourseModule -> Lesson -> Quiz -> QuizQuestion -> QuizQuestionOption`.
- [x] **Coursera-Style Compliance**: Hỗ trợ 3 dạng bài học (Video 2 nguồn + mô tả, Article/Text đọc, Quiz kiểm tra đánh giá gắn trực tiếp vào luồng chương trình).
