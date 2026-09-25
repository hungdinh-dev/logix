# KẾ HOẠCH MỞ RỘNG SPRINT 1: ADMIN CURRICULUM & QUIZ BUILDER (COURSERA-STYLE)
## 01. TỔNG QUAN VÀ PHẠM VI DỰ ÁN (OVERVIEW & SCOPE)

> **Mục tiêu:** Nâng cấp và mở rộng Sprint 1 thêm 1 tuần để hoàn thiện 100% phân hệ **Admin Quản trị Chương trình Đào tạo & Soạn thảo Bài kiểm tra (Curriculum & Quiz Builder)** theo chuẩn Coursera.  
> **Dự án:** LMS-BaHung (Đào tạo F&B Chuỗi & Xưởng)  
> **Thư mục tài liệu:** `Practice/LogiX/doc/04-tracking-sprints/Sprint1_Admin_Curriculum_Quiz_Plan/`  

---

## 1. BỐI CẢNH & QUYẾT ĐỊNH ĐIỀU CHỈNH SPRINT 1

### 1.1. Vấn đề thực tế
- Trong quy trình đào tạo F&B (vận hành cửa hàng, xưởng bánh, an toàn thực phẩm ATTP), một khóa học **không thể chỉ có Video và Chữ** mà **bắt buộc phải có Bài kiểm tra đánh giá (Quiz)** để xác nhận nhân viên đã hiểu quy trình trước khi được cấp chứng chỉ hoặc xếp ca làm việc.
- Ban đầu, tính năng Quiz (`LMS-056` $\rightarrow$ `LMS-070`) được xếp ở **Sprint 3**. Tuy nhiên, nếu chờ đến Sprint 3 mới làm Quiz:
  1. Admin không thể tạo được một khóa học hoàn chỉnh (End-to-End).
  2. Database `Lesson` và `CourseModule` ở Sprint 1 sẽ phải đập đi sửa lại (Breaking Changes) ở Sprint 3.
  3. Màn hình quản trị Khóa học (Admin Curriculum) bị phân mảnh, Trainer không có công cụ soạn bài thi.

### 1.2. Quyết định Chiến lược
- **Gia hạn Sprint 1 thêm 1 tuần** (Sprint 1 Extension).
- **Ưu tiên tập trung hoàn thiện toàn bộ phân hệ ADMIN trước**:
  - Admin Course Management (Đã xong 100% ở tuần trước).
  - Admin Curriculum Builder (Quản lý Chương/Module & Bài học/Lesson).
  - Admin Lesson Editor: Video (YouTube & Tự Upload + Mô tả), Article (Rich Text), PDF Document.
  - Admin Quiz Builder MVP: Soạn bài kiểm tra trắc nghiệm gắn trực tiếp vào vị trí bài học trong chương trình.
- **Phần Học viên làm bài thi (Learner Quiz Taking UI & Grading Engine nâng cao)** sẽ được phát triển liền kề ở giai đoạn sau của Sprint 1 hoặc đầu Sprint 2 sau khi Admin đã có đầy đủ dữ liệu bài giảng & đề thi.

---

## 2. KIẾN TRÚC MÔ HÌNH HỌC LIỆU (COURSERA-STYLE HIERARCHY)

```
📦 COURSE (Khóa học - LMS-001..012)
 ├── 🏷️ Category, Target Rules, Pass Score, Due Date
 └── 📑 COURSE MODULE / CHAPTER (Chương học - LMS-017)
      ├── Sort Order, Module Title
      └── 📝 LESSON / LEARNING ITEM (Đơn vị học tập)
           │
           ├── 🎥 DẠNG 1: VIDEO LESSON (LMS-013)
           │    ├── Nguồn: YouTube Embed URL HOẶC File MP4 Tự Upload (Supabase Storage / Local CDN)
           │    ├── Metadata: Thời lượng (Duration Seconds), Mô tả bài học (Description / Summary)
           │    └── Đính kèm: SOP Code, SOP Type (Store / Factory)
           │
           ├── 📄 DẠNG 2: ARTICLE / READING LESSON (LMS-014, LMS-015)
           │    ├── Nội dung: Rich Text (HTML / Markdown) cho bài đọc quy trình
           │    ├── Đính kèm: File PDF / Slide tài liệu nghiệp vụ
           │    └── Metadata: Thời gian đọc ước tính (Estimated Read Time Minutes)
           │
           └── 🧪 DẠNG 3: QUIZ LESSON (LMS-057, LMS-061, LMS-062, LMS-063)
                ├── Đóng vai trò là một Bài học dạng QUIZ trong danh sách bài học
                ├── Cấu hình Quiz: Pass Score (%), Max Attempts, Time Limit (phút), Shuffle
                └── Danh sách Câu hỏi (Quiz Questions) & Các lựa chọn đáp án (Options + IsCorrect)
```

---

## 3. DANH SÁCH MÃ CHỨC NĂNG SPRINT 1 (KÈM MỞ RỘNG)

| Nhóm | Mã CN | Tên Chức Năng | Phạm vi Sprint 1 Mở Rộng | Trạng thái hiện tại |
|---|---|---|---|:---:|
| **Khóa học** | `LMS-001` $\rightarrow$ `LMS-012` | Quản lý Danh mục, Khóa học, Target Rules | Admin CRUD, Toggle Status, Clone, Auto-Assign | ✅ Đã hoàn thành 100% |
| **Chương học** | `LMS-017` | Quản lý Chương (Course Modules) & Sắp xếp | Admin Thêm/Sửa/Xóa Module, Drag & Drop Reorder | ⏳ Triển khai trong đợt này |
| **Bài giảng Video** | `LMS-013` | Bài giảng Video (YouTube & Upload + Mô tả) | Admin Nhập YouTube link, Upload MP4, Preview, Mô tả | ⏳ Triển khai trong đợt này |
| **Bài giảng Đọc** | `LMS-014`, `LMS-015` | Bài giảng PDF & Bài viết Rich Text | Admin Soạn Rich Text, Upload PDF, Gắn mã SOP | ⏳ Triển khai trong đợt này |
| **Bài kiểm tra (Admin)** | `LMS-057` | Tạo câu hỏi trắc nghiệm 1 đáp án / nhiều đáp án | Soạn câu hỏi, thêm các option, chọn đáp án đúng | ⏳ Triển khai trong đợt này |
| **Bài kiểm tra (Admin)** | `LMS-061` | Tạo bài Quiz gắn trực tiếp vào vị trí Lesson | Cấu hình pass score, max attempts, time limit | ⏳ Triển khai trong đợt này |
| **Bài kiểm tra (Admin)** | `LMS-062..064`| Cấu hình số lần làm lại, thời gian, đảo câu hỏi | Admin Toggle settings cho Quiz | ⏳ Triển khai trong đợt này |
| **Phân quyền** | `LMS-102`, `LMS-103`| Phân quyền Admin LMS & Trainer tạo bài | RBAC Permission Guard (`COURSE.MANAGE`, `LESSON.MANAGE`) | ✅ Sẵn sàng |

---

## 4. BỘ TÀI LIỆU CHI TIẾT TRONG FOLDER

1. [`01-OVERVIEW_AND_SCOPE.md`](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/Sprint1_Admin_Curriculum_Quiz_Plan/01-OVERVIEW_AND_SCOPE.md) *(Tài liệu hiện tại)*: Bối cảnh, mục tiêu và phạm vi mở rộng.
2. [`02-DATABASE_SCHEMA_MIGRATION_PLAN.md`](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/Sprint1_Admin_Curriculum_Quiz_Plan/02-DATABASE_SCHEMA_MIGRATION_PLAN.md): Chi tiết Schema Prisma, Enums, Khóa ngoại, Indexing & Seed Data.
3. [`03-BACKEND_API_SPECIFICATION.md`](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/Sprint1_Admin_Curriculum_Quiz_Plan/03-BACKEND_API_SPECIFICATION.md): Đặc tả kỹ thuật toàn bộ REST API cho Module, Lesson (Video/Text) và Quiz Builder.
4. [`04-FRONTEND_ADMIN_UI_UX_PLAN.md`](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/Sprint1_Admin_Curriculum_Quiz_Plan/04-FRONTEND_ADMIN_UI_UX_PLAN.md): Thiết kế giao diện Studio (Curriculum Tree, Lesson Modals, Quiz Builder Drawer).
5. [`05-SPRINT1_CHECKLIST_AND_TIMELINE.md`](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/Sprint1_Admin_Curriculum_Quiz_Plan/05-SPRINT1_CHECKLIST_AND_TIMELINE.md): Bảng lộ trình chi tiết từng ngày, checklist nghiệm thu và ma trận phân công.
6. [`06-BUSINESS_RULES_AND_VALIDATION_MATRIX.md`](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/Sprint1_Admin_Curriculum_Quiz_Plan/06-BUSINESS_RULES_AND_VALIDATION_MATRIX.md): Toàn bộ Quy tắc Nghiệp vụ (Business Rules), Điều kiện Ràng buộc (Validation) và Ma trận Hoàn thành khóa học.
7. [`07-API_TESTING_AND_VERIFICATION_GUIDE.md`](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/Sprint1_Admin_Curriculum_Quiz_Plan/07-API_TESTING_AND_VERIFICATION_GUIDE.md): Kịch bản kiểm thử API chi tiết, bộ lệnh cURL / Postman, script test tự động và hướng dẫn đối chiếu trên Supabase Cloud.
8. [`08-FRONTEND_FEATURE_ARCHITECTURE_REFACTOR_PLAN.md`](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/Sprint1_Admin_Curriculum_Quiz_Plan/08-FRONTEND_FEATURE_ARCHITECTURE_REFACTOR_PLAN.md): Đánh giá kiến trúc phần mềm, ADR tách phân hệ `admin-courses` theo Feature-Driven Modular Architecture (chuẩn Architect).
9. [`09-LMS_FEATURE_SEPARATION_AND_INVENTORY_ANALYSIS.md`](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/Sprint1_Admin_Curriculum_Quiz_Plan/09-LMS_FEATURE_SEPARATION_AND_INVENTORY_ANALYSIS.md): Bảng kiểm kê toàn bộ kho file hiện tại và bản đồ tách bạch 2 phân hệ `features/admin-courses` & `features/lms`.




