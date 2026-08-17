# 📋 NHẬT KÝ & CHECKLIST THỰC HIỆN — NGÀY 12/08/2026

> **Dự án:** LogiX LMS — Phân hệ Ba Hưng F&B (Sprint 1: Core Auth & Quản lý Khóa học)  
> **Người thực hiện:** Antigravity AI Assistant & Ba Hưng  
> **Ngày thực hiện:** 12/08/2026  
> **Nhiệm vụ trọng tâm:** Hoàn tất 100% Nhóm 2: Quản lý Khóa học & Danh mục đào tạo (`LMS-001` $\rightarrow$ `LMS-012`) trên cả 3 tầng (Database Schema, Backend API, Frontend UI).

---

## 📌 1. TỔNG QUAN TIẾN ĐỘ HOÀN THÀNH NGÀY 12/08/2026

| STT | Mã Chức Năng | Tên Chức Năng / Hạng Mục | Tầng Xử Lý | Trạng Thái |
| :---: | :---: | :--- | :---: | :---: |
| 1 | **LMS-001** | Tạo danh mục chương trình đào tạo (Onboarding, ATTP, Nghiệp vụ CH, SX...) | DB + BE + FE | ✅ **Hoàn thành 100%** |
| 2 | **LMS-002** | Tạo khóa học mới (với mã, tên, slug, loại, mô tả, ảnh đại diện) | DB + BE + FE | ✅ **Hoàn thành 100%** |
| 3 | **LMS-003** | Sao chép khóa học (Clone course & modules & lessons) | BE + FE | ✅ **Hoàn thành 100%** |
| 4 | **LMS-004** | Ngưng / kích hoạt khóa học (Toggle DRAFT / PUBLISHED / ARCHIVED) | DB + BE + FE | ✅ **Hoàn thành 100%** |
| 5 | **LMS-005** | Gán khóa học tự động theo Chức danh (Rule Engine Position) | DB + BE + FE | ✅ **Hoàn thành 100%** |
| 6 | **LMS-006** | Gán khóa học tự động theo Loại nhân sự (Học việc / Chính thức) | DB + BE + FE | ✅ **Hoàn thành 100%** |
| 7 | **LMS-007** | Gán khóa học tự động theo Cửa hàng (Store-based auto-enroll) | DB + BE + FE | ✅ **Hoàn thành 100%** |
| 8 | **LMS-008** | Gán khóa học tự động theo Bộ phận sản xuất (Factory Dept khâu xưởng) | DB + BE + FE | ✅ **Hoàn thành 100%** |
| 9 | **LMS-009** | Đặt khóa học bắt buộc (`isMandatory = true` + Badge đỏ) | DB + BE + FE | ✅ **Hoàn thành 100%** |
| 10 | **LMS-010** | Đặt khóa học tùy chọn (`isMandatory = false` + Badge Tùy chọn) | DB + BE + FE | ✅ **Hoàn thành 100%** |
| 11 | **LMS-011** | Cấu hình thời hạn hoàn thành khóa học (`durationDays` $\rightarrow$ `dueDate`) | DB + BE + FE | ✅ **Hoàn thành 100%** |
| 12 | **LMS-012** | Cấu hình điểm đạt khóa học (`passScore` chuẩn hóa) | DB + BE + FE | ✅ **Hoàn thành 100%** |
| 13 | **INFRA** | Đồng bộ Schema Supabase + Sinh Prisma Client + Seed Data Khóa học | DB + Seed | ✅ **Hoàn thành 100%** |
| 14 | **ADMIN-UI** | Xây dựng Giao diện Quản trị Khóa học cho Admin/Trainer | Frontend UI | ✅ **Hoàn thành 100%** |

---

## 🛠️ 2. CHI TIẾT THAY ĐỔI THEO TỪNG TẦNG KIẾN TRÚC

### 🗄️ A. Database Schema & Supabase Cloud (1 Update DB)
* **File:** [backend/prisma/schema.prisma](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/prisma/schema.prisma)
  * **Model `Category` (`crs_categories`):** Bổ sung trường `description String?`, `isActive Boolean @default(true)`.
  * **Model `Course` (`crs_courses`):** Bổ sung các trường gán rule tự động:
    * `targetPositionId String?` $\rightarrow$ Khóa ngoại liên kết `Position`
    * `targetDepartmentId String?` $\rightarrow$ Khóa ngoại liên kết `Department`
    * `targetStoreId String?` $\rightarrow$ Khóa ngoại liên kết `Store`
    * `targetEmploymentStatus String?` ('PROBATION', 'OFFICIAL', 'TEMPORARY', 'ALL')
    * `isActive Boolean @default(true)` hỗ trợ Xóa mềm (Soft delete).
  * **Relations ngược:** Cập nhật `targetCourses Course[]` trong các bảng `org_stores`, `org_departments`, `org_positions`.
  * **Đồng bộ:** Chạy `npx prisma db push` lên Supabase PostgreSQL Pooler và `npx prisma generate` thành công.
* **File:** [backend/src/seed.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/seed.ts)
  * Khởi tạo 4 danh mục đào tạo: `ONBOARDING`, `ATTP`, `STORE_OPS`, `FACTORY_PROD`.
  * Khởi tạo 3 khóa học mẫu chuẩn thực tế:
    * `BH-ONB-01` (Quy trình SOP Vận hành Cửa hàng Hàng ngày - Bắt buộc Onboarding)
    * `BH-ATTP-01` (Tiêu chuẩn Vệ sinh & An toàn Thực phẩm 2026 - Bắt buộc)
    * `BH-SX-01` (Quy trình Sản xuất & Tiệt trùng Khâu Làm Kem - Tùy chọn khâu xưởng)

---

### ⚙️ B. Backend API & Modules (6 Files Thay Đổi / Mới)

1. [backend/src/modules/courses/course.dto.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.dto.ts):
   * Thêm schema validate Zod: `createCategorySchema`, `updateCategorySchema`, `createCourseSchema`, `updateCourseSchema`, `updateCourseStatusSchema`, `assignPositionSchema`, `assignEmploymentStatusSchema`, `assignStoreSchema`, `assignDepartmentSchema`.
2. [backend/src/modules/courses/course.service.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.service.ts):
   * `getAllCategories()`, `getCategoryById()`, `createCategory()`, `updateCategory()`, `deleteCategory()` (CRUD Danh mục - LMS-001).
   * `getAllCourses()`, `getCourseById()`, `createCourse()`, `updateCourse()`, `deleteCourse()` (CRUD Khóa học - LMS-002, 009, 010, 011, 012).
   * `cloneCourse(id)`: Sao chép toàn bộ khóa học, modules, bài học sang bản sao DRAFT (LMS-003).
   * `updateCourseStatus(id, dto)`: Toggle phát hành/nháp/lưu trữ (LMS-004).
   * `assignToPosition()`, `assignToEmploymentStatus()`, `assignToStore()`, `assignToDepartment()`: Rule Engine tự động ghi danh nhân sự theo tiêu chí (LMS-005 $\rightarrow$ LMS-008).
   * `enrollCourse(userId, courseId)`: Tự động tính hạn hoàn thành `dueDate = now + durationDays` (LMS-011, 044).
3. [backend/src/modules/courses/course.controller.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.controller.ts):
   * Khai báo toàn bộ handlers cho Categories, Courses, Clone, Status, Auto-Assign.
4. [backend/src/modules/courses/course.routes.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.routes.ts):
   * Khai báo 12 route endpoints, bảo vệ với `authenticateToken`, `requirePermission('COURSE.CREATE')` và middleware validation Zod.
5. [backend/src/modules/courses/course.swagger.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.swagger.ts):
   * Đặc tả OpenAPI 3.0 cho toàn bộ 12 endpoints kèm Request/Response schemas đầy đủ.

---

### 💻 C. Frontend UI & Integration (8 Files Thay Đổi / Mới)

1. [frontend/src/config/api-routes.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/config/api-routes.ts):
   * Thêm toàn bộ endpoints API `courses.base`, `courses.byId`, `courses.clone`, `courses.status`, `courses.categories`, `courses.assignPosition`, `courses.assignStore`, `courses.assignDepartment`, `courses.assignEmploymentStatus`.
2. [frontend/src/config/route-path.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/config/route-path.ts):
   * Bổ sung route `adminCourses: '/admin/courses'`.
3. [frontend/src/features/lms/types/course.types.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/types/course.types.ts):
   * Mở rộng interfaces `BackendCourse`, `BackendCategory`, `BackendCourseModule`, `BackendLesson` khớp 100% với Prisma Model.
4. [frontend/src/features/lms/services/course.service.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/services/course.service.ts):
   * Xây dựng `courseApiService` gọi các endpoints backend thông qua Axios Instance (hỗ trợ JWT & auto-refresh).
5. [frontend/src/features/lms/hooks/use-courses.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/hooks/use-courses.ts):
   * Custom hook `useCourses` quản lý state danh sách khóa học, danh mục, tải lại dữ liệu, clone và cập nhật trạng thái.
6. [frontend/src/features/lms/components/course-catalog/CategoryPillTabs.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/course-catalog/CategoryPillTabs.tsx):
   * Hỗ trợ render linh hoạt danh mục động từ Backend API thay vì danh sách tĩnh cứng.
7. [frontend/src/features/lms/components/course-catalog/CourseCard.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/course-catalog/CourseCard.tsx):
   * Nâng cấp giao diện hiển thị: Badge Bắt buộc/Tùy chọn (LMS-009/010), Hạn hoàn thành (LMS-011), Điểm đạt yêu cầu (LMS-012), Số bài học và nút Ghi danh / Xem chi tiết.
8. [frontend/src/features/lms/pages/CourseCatalog.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/pages/CourseCatalog.tsx):
   * Kết nối Real API `useCourses`, lọc theo Danh mục động, Search debounce, lọc Bắt buộc/Tùy chọn, Sắp xếp mới nhất / ghi danh nhiều.
9. [frontend/src/features/admin/pages/CoursesAdminPage.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/admin/pages/CoursesAdminPage.tsx):
   * Giao diện Quản trị Khóa học Admin toàn diện:
     * Bảng danh sách khóa học kèm bộ lọc và tìm kiếm.
     * Nút **Tạo Khóa Học Mới** (Modal Form đầy đủ cấu hình thời hạn, điểm đạt, bắt buộc).
     * Nút **Sao chép Khóa học** (Clone - LMS-003).
     * Toggle **Ngưng / Kích hoạt** phát hành (LMS-004).
     * Modal **Gán Khóa Học Tự Động** (Auto-assign theo Chức danh / Học việc / Cửa hàng / Bộ phận - LMS-005 $\rightarrow$ LMS-008).
     * Nút **Xóa mềm** (Soft delete).
10. [frontend/src/app/(protected)/admin/courses/page.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/app/(protected)/admin/courses/page.tsx):
    * Next.js App Router Page kết nối trang quản trị `/admin/courses`.
11. [frontend/src/components/shared/AppSidebar.tsx](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/components/shared/AppSidebar.tsx):
    * Bổ sung mục menu **Quản lý Khóa học** vào nhóm Quản trị Admin.

---

## 🎯 3. HƯỚNG DẪN KIỂM THỬ TRỰC TIẾP (TESTING GUIDE)

### Cách 1: Kiểm thử trực tiếp trên Swagger UI (Backend)
1. Khởi động Backend: `cd Practice/LogiX/backend && npm run dev`
2. Mở trình duyệt: `http://localhost:5000` (hoặc `http://localhost:5000/api-docs`).
3. Đăng nhập tại `POST /api/auth/login` (`admin@bahung.com` / `password123`) $\rightarrow$ Authorize Token.
4. Mở nhóm **Courses**:
   * `GET /api/courses/categories`: Kiểm tra 4 danh mục đào tạo.
   * `POST /api/courses`: Tạo khóa học mới.
   * `POST /api/courses/{id}/clone`: Thử sao chép khóa học.
   * `PATCH /api/courses/{id}/status`: Đổi trạng thái khóa sang `PUBLISHED` / `DRAFT`.
   * `POST /api/courses/{id}/assign-position`: Gán khóa cho chức danh và kiểm tra kết quả tự động ghi danh.

### Cách 2: Kiểm thử trên Giao diện Web (Frontend)
1. Khởi động Frontend: `cd Practice/LogiX/frontend && npm run dev`
2. Đăng nhập tài khoản Super Admin: `admin@bahung.com` / `Password123` tại `http://localhost:3000/login`.
3. Truy cập Menu Sidebar **Quản trị Admin $\rightarrow$ Quản lý Khóa học** (`http://localhost:3000/admin/courses`):
   * Thử bấm nút **Tạo Khóa Học Mới** $\rightarrow$ Điền thông tin $\rightarrow$ Khóa xuất hiện ngay trên bảng.
   * Thử bấm nút **Sao chép (Copy)** trên một dòng $\rightarrow$ Khóa bản sao được tạo tức thì.
   * Bấm vào Badge **Đang phát hành / Bản nháp** để bật tắt trạng thái.
   * Bấm nút **Gán tự động (Icon Users)** để gán khóa theo Chức danh hoặc Cửa hàng.
4. Mở trang Danh mục Khóa học của Học viên (`http://localhost:3000/lms/courses`):
   * Thấy danh sách khóa học thực từ Supabase DB.
   * Lọc theo các Tab danh mục (Onboarding, ATTP, Nghiệp vụ...).
   * Thấy badge **Bắt buộc** và thông số Deadline / Pass score hiển thị rõ ràng.
