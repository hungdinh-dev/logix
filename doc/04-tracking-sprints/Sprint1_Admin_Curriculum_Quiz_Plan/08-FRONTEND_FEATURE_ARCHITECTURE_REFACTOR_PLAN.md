# KẾ HOẠCH MỞ RỘNG SPRINT 1: ADMIN-COURSE CURRICULUM & QUIZ BUILDER
## 08. ĐÁNH GIÁ & KẾ HOẠCH TÁI CẤU TRÚC KIẾN TRÚC FRONTEND FEATURES (ARCHITECTURE REFACTOR PLAN)
### *(Dựa trên Tiêu chuẩn Kiến trúc Phần mềm Senior Software Architect - Pattern Feature-Driven Modular)*

> **Tài liệu tham chiếu:** `.agents/agents/architect.md`  
> **Thư mục:** `Practice/LogiX/doc/04-tracking-sprints/Sprint1_Admin_Curriculum_Quiz_Plan/`  

---

## 1. ĐÁNH GIÁ KIẾN TRÚC HIỆN TẠI (CURRENT STATE ANALYSIS)

### 1.1. Hiện trạng Thư mục `frontend/src/features/`
Hiện tại thư mục `features/` đang tồn tại 5 thư mục:
- `features/auth/`: Đã được tổ chức rất chuẩn mực theo pattern Feature Module (`components`, `hooks`, `pages`, `schemas`, `services`, `types`).
- `features/admin/`: Chuyên về System Admin & HRM (Roles, Permissions, Departments, Employees, JobLevels...).
- `features/lms/`: **Đang mắc lỗi kiến trúc "God Feature / Big Ball of Mud"**:
  - Trộn lẫn 100% giao diện của **Học viên (Learner)**: `lesson-player`, `quiz` (làm bài), `course-detail` (xem thông tin), `catalog`...
  - Trộn lẫn với giao diện của **Quản trị Khóa học (Admin-Course / Trainer)**: `editor`, `CurriculumTree`, `QuizBuilder`, `LearnerProgressTable`...
  - Thư mục `components/` phình to với 9 thư mục con, không có sự tách bạch về `types`, `services`, `schemas` riêng cho Admin-Course.

### 1.2. Hậu quả Kiến trúc (Architectural Smells & Technical Debt)
1. **Vi phạm Nguyên lý Đơn trách nhiệm (SRP - Single Responsibility Principle):** Một feature `lms` vừa phục vụ người học vừa phục vụ giảng viên/admin.
2. **Khó Tracking & Đo lường:** Không thể đếm chính xác phân hệ Quản trị Khóa học (Admin-Course) gồm bao nhiêu trang, bao nhiêu hooks, bao nhiêu schemas.
3. **Nguy cơ Regression cao:** Khi sửa đổi logic soạn thảo của Admin (như thêm YouTube parser, Drag & drop), rất dễ gây lỗi tiềm ẩn sang màn hình học bài của Học viên.
4. **Bundle Bloat:** Client của Học viên phải tải kèm các thư viện/types nặng của Admin (WYSIWYG, DnD context...) nếu không tách module.

---

## 2. QUYẾT ĐỊNH KIẾN TRÚC (ARCHITECTURE DECISION RECORD - ADR)

```markdown
# ADR-002: Tách Phân hệ Đào tạo thành `admin-courses` và `lms-learner` theo Chuẩn Feature-Driven

## Bối cảnh (Context)
LogiX là hệ thống ERP tổng thể chuỗi F&B Ba Hưng. Trách nhiệm của Super Admin (Quản trị hệ thống/HRM) và Admin-Course (Giảng viên / L&D Studio) là độc lập hoàn toàn. Phân hệ đào tạo cần được cấu trúc lại để dễ dàng mở rộng và tracking tính năng.

## Quyết định (Decision)
Tái cấu trúc thư mục `frontend/src/features/` thành 4 Feature Modules độc lập, tuân thủ cấu trúc chuẩn 6 tầng (Standard 6-Layer Architecture):
1. `features/auth/`: Xác thực & Phân quyền.
2. `features/admin/`: Quản trị Hệ thống ERP & HRM (Super Admin).
3. `features/admin-courses/`: Phân hệ Quản trị Khóa học, Studio Soạn giáo trình & Đề thi Quiz (Admin-Course / Trainer).
4. `features/lms/` (hoặc `features/lms-learner/`): Phân hệ Trải nghiệm Học tập dành cho Nhân sự/Học viên (Learner Portal).

## Hệ quả tích cực (Positive Consequences)
- Phân định rõ ràng trách nhiệm theo đúng mô hình ERP RBAC.
- Dễ dàng tracking 100% số lượng Pages, Components, Hooks, Schemas, Services của Admin-Course.
- Mã nguồn gọn gàng, độ kết dính cao (High Cohesion), độ phụ thuộc thấp (Low Coupling).
- Sẵn sàng mở rộng Sprint 2, Sprint 3 (AI Quiz Generator, Chấm điểm tự luận, Chứng chỉ nâng cao) mà không ảnh hưởng code người học.
```

---

## 3. CẤU TRÚC THƯ MỤC CHUẨN SAU REFACTOR (TARGET DIRECTORY TREE)

```
frontend/src/features/
├── auth/                               # [Xác thực & Session] (Đã chuẩn)
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── schemas/
│   ├── services/
│   └── types/
│
├── admin/                              # [Super Admin: Hệ thống & HRM]
│   ├── components/                     # RolesPage, PermissionsPage, DepartmentsPage...
│   ├── hooks/
│   ├── pages/
│   ├── schemas/
│   ├── services/
│   └── types/
│
├── admin-courses/                      # 🎓 [Admin-Course / Trainer: Quản Trị Đào Tạo & Studio]
│   ├── components/                     # Các UI Component chuyên biệt của Admin-Course
│   │   ├── catalog/
│   │   │   ├── CourseCatalogTable.tsx  # Bảng danh sách khóa học kèm Status Badge
│   │   │   ├── CourseFilterToolbar.tsx # Toolbar tìm kiếm, lọc danh mục, trạng thái
│   │   │   └── CourseActionMenu.tsx    # Menu tác vụ (Studio, Sửa, Clone, Xóa)
│   │   ├── create/
│   │   │   └── CreateCourseForm.tsx    # Form tạo khóa học mới & chọn phòng ban
│   │   ├── studio/
│   │   │   ├── CurriculumTree.tsx      # Cây Chương học Accordion kéo thả
│   │   │   ├── ModuleAccordionItem.tsx # Item từng Chương học kèm menu ...
│   │   │   ├── LessonRowItem.tsx       # Từng dòng bài học [VIDEO], [ARTICLE], [QUIZ]
│   │   │   ├── CourseSettingsPane.tsx  # Pane cấu hình nhanh bên phải
│   │   │   └── AddLessonPopover.tsx    # Menu chọn nhanh dạng bài học
│   │   ├── modals/
│   │   │   ├── VideoLessonModal.tsx    # Modal cấu hình Video (YouTube + Upload MP4)
│   │   │   ├── ArticleLessonModal.tsx  # Modal soạn thảo Rich Text & Đính kèm PDF
│   │   │   ├── QuizBuilderModal.tsx    # Modal soạn đề thi & Question Builder
│   │   │   ├── QuestionCardEditor.tsx  # Thẻ soạn 1 câu hỏi + options A/B/C/D
│   │   │   └── QuizPreviewDrawer.tsx   # Drawer xem trước đề thi thực tế
│   │   └── progress/
│   │       ├── LearnerProgressTable.tsx# Bảng theo dõi tiến độ nhân sự theo khóa
│   │       └── ProgressFilterBar.tsx   # Thanh lọc báo cáo đào tạo theo cửa hàng
│   ├── hooks/                          # Custom Hooks quản lý Business Logic & State
│   │   ├── useAdminCourses.ts          # CRUD khóa học, clone, publish, filter
│   │   ├── useCurriculum.ts            # Quản lý Cây chương trình học & kéo thả Reorder
│   │   ├── useLessonEditor.ts          # Quản lý Form bài học & YouTube URL parser
│   │   ├── useQuizBuilder.ts           # Quản lý State danh sách câu hỏi & options
│   │   └── useTrainingReports.ts       # Tải báo cáo tiến độ học viên & xuất Excel
│   ├── pages/                          # Các Trang giao diện chính của Admin-Course
│   │   ├── CourseCatalogAdminPage.tsx  # [Trang 1] Quản lý Danh mục Khóa học
│   │   ├── CreateCourseAdminPage.tsx   # [Trang 2] Tạo mới Khóa học
│   │   ├── CourseStudioAdminPage.tsx   # [Trang 3] Studio Soạn Giáo trình & Đề thi
│   │   └── TrainingReportsAdminPage.tsx# [Trang 4] Báo cáo Tiến độ & Chứng nhận
│   ├── schemas/                        # Zod Schemas validate Form Frontend
│   │   ├── course-form.schema.ts       # Validate Form tạo/sửa khóa học
│   │   ├── lesson-form.schema.ts       # Validate Form bài giảng Video / Article
│   │   └── quiz-builder.schema.ts      # Validate Đề thi, Câu hỏi & Options
│   ├── services/                       # API Services gọi Backend RESTful
│   │   ├── course-admin.service.ts     # Gọi /api/courses, /api/courses/modules
│   │   ├── lesson-admin.service.ts     # Gọi /api/lessons, /api/lessons/parse-youtube
│   │   ├── quiz-admin.service.ts       # Gọi /api/quizzes, /api/quizzes/questions
│   │   └── report-admin.service.ts     # Gọi /api/courses/:id/enrollments
│   └── types/                          # TypeScript Interfaces & Enums cho Admin
│       ├── course-admin.types.ts       # Course, Category, CourseStatus
│       ├── curriculum.types.ts         # CourseModule, Lesson, LessonType
│       ├── quiz-builder.types.ts       # Quiz, Question, Option, QuestionType
│       └── report-admin.types.ts       # EnrollmentReport, CompletionStat
│
└── lms/                                # 👤 [Learner: Phân Hệ Học Tập Của Nhân Sự]
    ├── components/                     # lesson-player, quiz-taker, catalog, dashboard
    ├── hooks/                          # useCourseDetail, useLessonPlayer, useQuizAttempt
    ├── pages/                          # LMSDashboardPage, CourseCatalogPage, LessonPlayerPage
    ├── services/                       # lms.service.ts, progress.service.ts
    └── types/                          # lms.types.ts
```

---

## 4. MA TRẬN TRACKING TÍNH NĂNG & TRANG (FEATURE TRACKING MATRIX)

Nhờ cấu trúc tái cấu trúc này, ta có thể kiểm soát và tracking 100% các thành phần của phân hệ `admin-courses`:

| STT | Trang / Tính năng | File Page Component | File Service / Hook | REST API Tương Ứng |
|---|---|---|---|---|
| **1** | **Quản lý Danh mục Khóa học** | `CourseCatalogAdminPage.tsx` | `useAdminCourses`<br>`course-admin.service.ts` | `GET /api/courses`<br>`DELETE /api/courses/:id`<br>`POST /api/courses/:id/clone` |
| **2** | **Tạo mới Khóa học** | `CreateCourseAdminPage.tsx` | `course-form.schema.ts`<br>`course-admin.service.ts` | `POST /api/courses` |
| **3** | **Studio Soạn Giáo trình (Curriculum)** | `CourseStudioAdminPage.tsx`<br>`CurriculumTree.tsx` | `useCurriculum`<br>`course-admin.service.ts` | `GET /api/courses/:id/curriculum`<br>`POST /api/courses/:id/modules`<br>`POST /api/courses/:id/modules/reorder` |
| **4** | **Soạn Bài học Video (YouTube/Upload)** | `VideoLessonModal.tsx` | `useLessonEditor`<br>`lesson-admin.service.ts` | `POST /api/lessons/modules/:id`<br>`PUT /api/lessons/:id`<br>`POST /api/lessons/parse-youtube` |
| **5** | **Soạn Bài học Bài viết & PDF SOP** | `ArticleLessonModal.tsx` | `useLessonEditor`<br>`lesson-admin.service.ts` | `POST /api/lessons/modules/:id`<br>`PUT /api/lessons/:id` |
| **6** | **Soạn Đề thi Quiz & Ngân hàng Câu hỏi** | `QuizBuilderModal.tsx`<br>`QuestionCardEditor.tsx` | `useQuizBuilder`<br>`quiz-admin.service.ts` | `GET /api/quizzes/lessons/:id`<br>`PUT /api/quizzes/:id`<br>`POST /api/quizzes/:id/questions`<br>`GET /api/quizzes/:id/preview` |
| **7** | **Báo cáo Đào tạo & Tiến độ Nhân viên** | `TrainingReportsAdminPage.tsx`<br>`LearnerProgressTable.tsx` | `useTrainingReports`<br>`report-admin.service.ts` | `GET /api/courses/:id/enrollments`<br>`GET /api/progress/reports` |

---

## 5. KẾ HOẠCH THỰC THI REFACTOR TỪNG BƯỚC (STEP-BY-STEP MIGRATION)

Để đảm bảo không làm gián đoạn hệ thống đang chạy:

1. **Bước 1 (Tạo Scaffolding):** Khởi tạo thư mục `frontend/src/features/admin-courses/` với đầy đủ 6 tầng (`components`, `hooks`, `pages`, `schemas`, `services`, `types`).
2. **Bước 2 (Types & Schemas & Services):** Định nghĩa toàn bộ TypeScript Interfaces, Zod Validation Schemas và Axios/Fetch API Services chuẩn RESTful kết nối Backend.
3. **Bước 3 (Components & Modals):** Xây dựng các UI Components theo Design Tokens LogiX (`Terracotta Orange #e8784a`, `Warm Canvas #faf9f5`):
   - `CurriculumTree.tsx`, `ModuleAccordionItem.tsx`, `LessonRowItem.tsx`.
   - `VideoLessonModal.tsx`, `ArticleLessonModal.tsx`, `QuizBuilderModal.tsx`, `QuestionCardEditor.tsx`, `QuizPreviewDrawer.tsx`.
4. **Bước 4 (Pages & Routing):** Tạo các Page Components và kết nối vào App Router Next.js (`app/(protected)/admin/courses/...`).
5. **Bước 5 (Dọn dẹp `features/lms/`):** Tách bỏ các file thừa khỏi `features/lms/`, giữ `features/lms/` chỉ phục vụ trải nghiệm của Học viên (Learner Portal).
