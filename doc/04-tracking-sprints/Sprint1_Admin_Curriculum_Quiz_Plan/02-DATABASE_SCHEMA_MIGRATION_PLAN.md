# KẾ HOẠCH MỞ RỘNG SPRINT 1: ADMIN CURRICULUM & QUIZ BUILDER
## 02. KẾ HOẠCH DATABASE SCHEMA VÀ MIGRATION (DATABASE SPECIFICATION)

> **Mục tiêu:** Định nghĩa chính xác cấu trúc Prisma Schema cho phân hệ Course, Curriculum (Module/Lesson đa dạng) và Quiz Engine theo chuẩn `database-reviewer.md`.  
> **Thư mục:** `Practice/LogiX/doc/04-tracking-sprints/Sprint1_Admin_Curriculum_Quiz_Plan/`  

---

## 1. THAY ĐỔI SCHEMA CHI TIẾT & GIẢI THÍCH MỤC ĐÍCH TỪNG TRƯỜNG

### 1.1. Bổ sung Enums cho Tính chặt chẽ (Type Safety)
```prisma
// Phân loại định dạng bài học: Mỗi Lesson chỉ thuộc 1 loại duy nhất
enum LessonType {
  VIDEO      // Bài giảng xem video (YouTube hoặc upload trực tiếp)
  ARTICLE    // Bài viết đọc văn bản Rich Text / HTML / Markdown
  QUIZ       // Bài kiểm tra trắc nghiệm / tự luận đánh giá kiến thức
  PDF        // Tài liệu đọc dạng file PDF đính kèm
  CHECKLIST  // Bài học dạng danh sách checklist quy trình thực hành
}

// Nguồn phát video bài giảng
enum VideoProvider {
  YOUTUBE       // Nhúng video từ link YouTube công khai hoặc unlisted
  DIRECT_UPLOAD // File video MP4 tự upload trực tiếp lên Storage (S3 / Supabase)
  EXTERNAL_URL  // Link video trực tiếp từ máy chủ CDN bên ngoài
}

// Định dạng câu hỏi kiểm tra
enum QuestionType {
  SINGLE_CHOICE   // Trắc nghiệm chọn 1 đáp án đúng duy nhất (Radio)
  MULTIPLE_CHOICE // Trắc nghiệm chọn nhiều đáp án đúng (Checkbox)
  TRUE_FALSE      // Câu hỏi Đúng / Sai
  SHORT_ANSWER    // Câu hỏi tự luận ngắn / điền từ
}
```

### 1.2. Nâng cấp Model `Lesson` (Bài học)
Mỗi bản ghi đại diện cho 1 Bài học cụ thể nằm trong 1 Chương (`CourseModule`):

```prisma
model Lesson {
  id                String        @id @default(uuid()) // Khóa chính định danh duy nhất bài học
  moduleId          String                             // Khóa ngoại liên kết với Chương học (CourseModule)
  module            CourseModule  @relation(fields: [moduleId], references: [id], onDelete: Cascade) // Xóa Chương sẽ tự xóa các bài học bên trong
  title             String                             // Tiêu đề hiển thị của bài học (VD: "Quy trình rửa tay 6 bước")
  description       String?                            // Mô tả chi tiết / Tóm tắt nội dung video / Hướng dẫn lưu ý trước khi học
  lessonType        LessonType    @default(VIDEO)      // Phân loại dạng bài học (VIDEO, ARTICLE, QUIZ, PDF, CHECKLIST)
  
  // 1. DÀNH CHO BÀI HỌC DẠNG VIDEO (lessonType == VIDEO)
  videoProvider     VideoProvider? @default(YOUTUBE)  // Xác định nguồn video (YOUTUBE, DIRECT_UPLOAD, EXTERNAL_URL)
  videoUrl          String?                           // Đường dẫn URL video (Link YouTube hoặc link CDN)
  videoStoragePath  String?                           // Đường dẫn lưu trữ file gốc trên Cloud Storage (nếu tự upload MP4)
  videoDuration     Int           @default(0)         // Thời lượng video tính bằng giây (để hiển thị badge thời lượng và tính % xem)
  
  // 2. DÀNH CHO BÀI HỌC DẠNG ARTICLE / PDF / QUY TRÌNH (lessonType == ARTICLE / PDF / CHECKLIST)
  bodyHtml          String?                           // Nội dung văn bản bài viết (hỗ trợ Rich Text HTML, hình ảnh nhúng, bảng biểu)
  documentUrl       String?                           // Đường dẫn file PDF / Slide tài liệu học tập đính kèm
  estimatedReadTime Int           @default(5)         // Thời gian đọc ước tính tính bằng phút (hiển thị badge "5 phút đọc" cho học viên)
  checklistItems    String?                           // Dữ liệu JSON danh sách các đầu việc quy trình cần tick chọn
  
  // 3. QUY TRÌNH TIÊU CHUẨN SOP & TUÂN THỦ DOANH NGHIỆP F&B
  sopCode           String?                           // Mã quy trình chuẩn SOP (VD: "SOP-CH-01", "SOP-XUONG-ATTP-03")
  sopType           String?                           // Phân loại khối áp dụng SOP: 'STORE_SOP' (Cửa hàng) hoặc 'FACTORY_SOP' (Xưởng bánh)
  requiresSignature Boolean       @default(false)     // Cờ bắt buộc học viên phải ký xác nhận điện tử đã hiểu quy trình SOP
  
  // 4. CÀI ĐẶT HIỂN THỊ & PHÂN QUYỀN HỌC
  allowDownload     Boolean       @default(false)     // Cho phép học viên tải tài liệu/video về máy hay không
  isVisible         Boolean       @default(true)      // Bật/tắt hiển thị bài học (Trainer có thể ẩn bài đang biên tập dở)
  sortOrder         Int           @default(1)         // Thứ tự hiển thị của bài học trong Chương (1, 2, 3...)

  // 5. QUAN HỆ VỚI CÁC MODULE KHÁC
  quiz              Quiz?                             // Liên kết 1-1 với Bài kiểm tra (nếu bài học này có lessonType == QUIZ)
  progressRecords   LessonProgress[]                  // Lịch sử theo dõi tiến độ học của từng học viên trên bài này

  createdAt         DateTime      @default(now())      // Thời điểm tạo bài học
  updatedAt         DateTime      @default(now()) @updatedAt // Thời điểm cập nhật nội dung gần nhất

  @@index([moduleId, sortOrder])                      // Tối ưu tốc độ query danh sách bài học theo thứ tự trong Chương
  @@map("crs_lessons")                                // Ánh xạ tên bảng vật lý trong PostgreSQL
}
```

### 1.3. Bổ sung các Models Quiz Engine (Bộ công cụ Soạn & Làm bài thi)

#### Model `Quiz` (Cấu hình Bài kiểm tra gắn với Bài học)
```prisma
model Quiz {
  id                 String         @id @default(uuid()) // Khóa chính bài kiểm tra
  lessonId           String         @unique              // Khóa ngoại 1-1 liên kết trực tiếp với Bài học (Lesson)
  lesson             Lesson         @relation(fields: [lessonId], references: [id], onDelete: Cascade) // Xóa Lesson thì tự động xóa Quiz
  
  title              String                              // Tiêu đề bài kiểm tra (VD: "Kiểm tra kiến thức ATTP Chương 1")
  description        String?                             // Hướng dẫn làm bài thi (VD: "Đề thi gồm 10 câu, cần đạt 80% để pass")
  passScore          Int            @default(80)         // Tỷ lệ % điểm số tối thiểu để được tính là Đạt (mặc định 80%)
  maxAttempts        Int            @default(3)          // Số lần tối đa học viên được phép làm lại bài (0 = không giới hạn số lần)
  timeLimitMinutes   Int?           @default(30)         // Thời gian làm bài tính bằng phút (null = làm bài tự do không đếm ngược)
  shuffleQuestions   Boolean        @default(true)       // Tự động đảo lộn thứ tự câu hỏi để chống gian lận
  showAnswerFeedback Boolean        @default(true)       // Hiển thị giải thích đúng/sai ngay sau khi nộp bài

  questions          QuizQuestion[]                      // Danh sách các câu hỏi nằm trong đề thi này
  attempts           QuizAttempt[]                       // Lịch sử các lần học viên vào làm bài thi

  createdAt          DateTime       @default(now())      // Thời điểm tạo đề thi
  updatedAt          DateTime       @default(now()) @updatedAt // Thời điểm cập nhật đề thi gần nhất

  @@map("quiz_quizzes")                                  // Ánh xạ tên bảng vật lý trong PostgreSQL
}
```

#### Model `QuizQuestion` (Câu hỏi trong Đề thi)
```prisma
model QuizQuestion {
  id           String             @id @default(uuid()) // Khóa chính câu hỏi
  quizId       String                                  // Khóa ngoại liên kết với Bài thi (Quiz)
  quiz         Quiz               @relation(fields: [quizId], references: [id], onDelete: Cascade) // Xóa Quiz sẽ tự xóa các câu hỏi bên trong
  
  questionText String                                  // Nội dung câu hỏi (VD: "Nhiệt độ bảo quản bánh kem tiêu chuẩn là bao nhiêu?")
  questionType QuestionType       @default(SINGLE_CHOICE) // Định dạng câu hỏi (SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_FALSE...)
  points       Float              @default(1.0)        // Trọng số điểm của câu hỏi (VD: 1 điểm hoặc 2 điểm)
  explanation  String?                                 // Lời giải thích tại sao đáp án đó đúng (hiển thị sau khi học viên nộp bài)
  sortOrder    Int                @default(1)          // Thứ tự sắp xếp của câu hỏi trong đề thi

  options      QuizQuestionOption[]                    // Danh sách các lựa chọn đáp án A, B, C, D
  answers      QuizAttemptAnswer[]                     // Lịch sử câu trả lời của học viên đối với câu hỏi này

  createdAt    DateTime           @default(now())      // Thời điểm tạo câu hỏi
  updatedAt    DateTime           @default(now()) @updatedAt // Thời điểm cập nhật câu hỏi

  @@index([quizId, sortOrder])                         // Tối ưu query tải danh sách câu hỏi theo thứ tự đề thi
  @@map("quiz_questions")                              // Ánh xạ tên bảng vật lý trong PostgreSQL
}
```

#### Model `QuizQuestionOption` (Lựa chọn đáp án của Câu hỏi)
```prisma
model QuizQuestionOption {
  id          String       @id @default(uuid()) // Khóa chính đáp án
  questionId  String                            // Khóa ngoại liên kết với Câu hỏi (QuizQuestion)
  question    QuizQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade) // Xóa câu hỏi sẽ tự xóa các đáp án
  
  optionText  String                            // Nội dung văn bản của đáp án (VD: "Từ 2°C đến 6°C")
  isCorrect   Boolean      @default(false)      // Đánh dấu đây có phải là đáp án ĐÚNG hay không (true = đáp án đúng)
  sortOrder   Int          @default(1)          // Thứ tự hiển thị của đáp án (A, B, C, D...)

  @@index([questionId])                         // Tối ưu query lấy danh sách đáp án theo câu hỏi
  @@map("quiz_question_options")                // Ánh xạ tên bảng vật lý trong PostgreSQL
}
```

#### Model `QuizAttempt` (Lần làm bài thi của Học viên)
```prisma
model QuizAttempt {
  id            String              @id @default(uuid()) // Khóa chính định danh lần làm bài
  quizId        String                                   // Khóa ngoại liên kết với Đề thi (Quiz)
  quiz          Quiz                @relation(fields: [quizId], references: [id], onDelete: Cascade)
  userId        String                                   // Khóa ngoại liên kết với Học viên (User)
  user          User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  attemptNumber Int                 @default(1)          // Số thứ tự lần làm bài (Lần 1, Lần 2, Lần 3...)
  score         Float               @default(0.0)        // Điểm số học viên đạt được (tính theo %, VD: 85.0%)
  isPassed      Boolean             @default(false)      // Đánh dấu lần thi này ĐẠT hay KHÔNG ĐẠT (dựa trên passScore)
  startedAt     DateTime            @default(now())      // Thời điểm học viên bấm bắt đầu làm bài
  submittedAt   DateTime?                                // Thời điểm học viên bấm nộp bài (null nếu đang làm dở)

  answers       QuizAttemptAnswer[]                      // Chi tiết các câu trả lời của học viên trong lần thi này

  createdAt     DateTime            @default(now())      // Thời điểm tạo bản ghi
  updatedAt     DateTime            @default(now()) @updatedAt

  @@index([quizId, userId])                            // Tối ưu truy vấn lịch sử thi và đếm số lần làm bài của học viên
  @@map("quiz_attempts")                               // Ánh xạ tên bảng vật lý trong PostgreSQL
}
```

#### Model `QuizAttemptAnswer` (Chi tiết câu trả lời của Học viên)
```prisma
model QuizAttemptAnswer {
  id               String       @id @default(uuid()) // Khóa chính câu trả lời
  attemptId        String                            // Khóa ngoại liên kết với Lần làm bài (QuizAttempt)
  attempt          QuizAttempt  @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  questionId       String                            // Khóa ngoại liên kết với Câu hỏi (QuizQuestion)
  question         QuizQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)
  
  selectedOptionId String?                           // ID đáp án mà học viên đã chọn (dành cho câu trắc nghiệm)
  textAnswer       String?                           // Nội dung câu trả lời bằng chữ (dành cho câu hỏi tự luận ngắn)
  isCorrect        Boolean?                          // Kết quả câu trả lời: Đúng (true) hoặc Sai (false)
  earnedPoints     Float        @default(0.0)        // Điểm số học viên đạt được ở câu này

  createdAt        DateTime     @default(now())      // Thời điểm ghi nhận câu trả lời

  @@index([attemptId])                               // Tối ưu truy vấn bảng điểm chi tiết của lần thi
  @@map("quiz_attempt_answers")                      // Ánh xạ tên bảng vật lý trong PostgreSQL
}
```

### 1.4. Nâng cấp Model `LessonProgress` (Tiến độ học tập từng bài)
```prisma
model LessonProgress {
  id                  String           @id @default(uuid()) // Khóa chính tiến độ bài học
  enrollmentId        String                                // Khóa ngoại liên kết với Đợt ghi danh khóa học (CourseEnrollment)
  enrollment          CourseEnrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  userId              String                                // Khóa ngoại liên kết với Học viên (User)
  user                User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  lessonId            String                                // Khóa ngoại liên kết với Bài học (Lesson)
  lesson              Lesson           @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  isCompleted         Boolean          @default(false)      // Đánh dấu học viên đã HOÀN THÀNH bài học này chưa (true = đã xong)
  lastPositionSeconds Int              @default(0)          // Lưu giây phát video dở gần nhất (để học viên bấm vào xem tiếp từ vị trí cũ)
  quizHighestScore    Float?                                // Lưu điểm số cao nhất của học viên nếu bài học này là bài QUIZ
  completedAt         DateTime?                             // Thời điểm học viên được hệ thống xác nhận hoàn thành bài học

  createdAt           DateTime         @default(now())      // Thời điểm bắt đầu học bài này
  updatedAt           DateTime         @default(now()) @updatedAt // Thời điểm cập nhật tiến độ gần nhất

  @@unique([userId, lessonId])                              // Một học viên chỉ có 1 bản ghi tiến độ duy nhất cho mỗi bài học
  @@index([enrollmentId])                                   // Tối ưu tính toán % hoàn thành tổng thể của Khóa học
  @@map("enr_lesson_progress")                              // Ánh xạ tên bảng vật lý trong PostgreSQL
}
```

---

## 2. QUY TRÌNH MIGRATION & SEEDING

1. **Thao tác Migration**:
   - Cập nhật file `backend/prisma/schema.prisma`.
   - Chạy lệnh `pnpm prisma db push` để apply thay đổi lên cơ sở dữ liệu Supabase PostgreSQL Cloud.
   - Chạy lệnh `pnpm prisma generate` để cập nhật TypeScript types cho Backend & Frontend.
2. **Seed Data Khởi tạo**:
   - Tạo mẫu 1 Khóa học: *"Nghiệp vụ Vận hành Cửa hàng F&B"*
   - Tạo 2 Chương (Modules):
     - *Chương 1: Quy định chung & Vệ sinh an toàn thực phẩm*
       - Bài 1 (Video YouTube): Giới thiệu văn hóa BaHung (+ Mô tả bài học).
       - Bài 2 (Video Upload MP4): Quy trình rửa tay 6 bước (+ Mô tả + SOP Store).
       - Bài 3 (Article Rich Text): Hướng dẫn bảo quản nguyên liệu bánh.
       - Bài 4 (Quiz): Bài kiểm tra trắc nghiệm Chương 1 (5 câu hỏi trắc nghiệm, Pass score 80%).
     - *Chương 2: Quy trình Phục vụ & Thu ngân*
       - Bài 5 (PDF Slide): Sổ tay giao tiếp khách hàng.
       - Bài 6 (Quiz): Bài kiểm tra kết thúc khóa học (10 câu hỏi).
