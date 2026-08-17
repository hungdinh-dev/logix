# 📋 CHECKLIST DỰ ÁN LMS-BAHUNG — SPRINT 1
> **Trọng tâm Sprint 1:** Core Auth & RBAC, Sơ đồ Tổ chức (Cửa hàng & Xưởng), Quản lý Khóa học & Học liệu (SOP), Auto-Assign Rules theo Vị trí, Ghi danh & Player Học tập.  
> **Tổng số chức năng:** **33 Chức năng LMS-xxx** + **Hạ tầng Core Auth & Sơ đồ Tổ chức (ERP-v2 1-to-1)**  
> **Dựa trên thiết kế DB:** [LMS-Unified-Function-and-DB-Context.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/LMS-Unified-Function-and-DB-Context.md)  
> **Tài liệu kiểm thử & luồng code:** [Auth_Sprint1_Testing_and_Code_Walkthrough.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/Sprint1_LMS_BaHung/Auth_Sprint1_Testing_and_Code_Walkthrough.md)

---

## 📊 BẢNG TỔNG HỢP TIẾN ĐỘ THI CÔNG SPRINT 1

| Nhóm Hạng Mục | Phạm vi & Mã CN | DB Schema | Backend API | Frontend UI | Đánh giá hoàn thiện | Trạng thái |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **Nhóm 0: Hạ tầng Core Auth & RBAC** | Core Auth, UserAccount, Roles, Permissions, Cache, Middlewares | 100% | 100% | 100% | **100%** | ✅ **HOÀN THÀNH** |
| **Nhóm 1: Sơ đồ Tổ chức (Org)** | Stores, Departments, Positions, Job Levels, Custom Fields | 100% | 85% | 80% | **85%** | 🔄 **In Progress** |
| **Nhóm 2: Quản lý Khóa học & Danh mục** | LMS-001 đến LMS-012 (12 CN) | 100% | 100% | 100% | **100%** | ✅ **HOÀN THÀNH** |
| **Nhóm 3: Quản lý Học liệu & SOP** | LMS-013 đến LMS-021 (9 CN) | 100% | 35% | 40% (Mock) | **40%** | 🔄 **In Progress** |
| **Nhóm 4: Học viên, Ghi danh & Player** | LMS-044 đến LMS-055 (12 CN) | 100% | 40% | 40% (Mock) | **45%** | 🔄 **In Progress** |
| **TỔNG THỂ SPRINT 1** | **33 Chức năng + Hạ tầng Core** | **100%** | **~75%** | **~75%** | **~76%** | 🟡 **Đang triển khai** |

---

## 📅 BÁO CÁO CÁC HẠNG MỤC ĐÃ HOÀN THÀNH 100%

| # | Hạng mục đã hoàn thành | Chi tiết & Kết quả thực thi | Trạng thái |
|---|---|---|:---:|
| 1 | **Tài liệu hóa Context & DB Design** | Tạo [LMS-Unified-Function-and-DB-Context.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/LMS-Unified-Function-and-DB-Context.md) (111 CN BaHung vs 61 CN Horeca) & [LMS-BaHung List Function.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/LMS-BaHung%20List%20Function.md). | ✅ **100% DONE** |
| 2 | **Hạ tầng Core Auth 1-to-1 ERP-v2** | Cấu hình Prisma Schema 15 models (`User`, `UserAccount`, `Role`, `Permission`, `UserRole`, `RolePermission`, `Department`, `Position`, `Store`, `Category`, `Course`, `CourseModule`, `Lesson`, `CourseEnrollment`, `LessonProgress`). | ✅ **100% DONE** |
| 3 | **Đồng bộ Supabase Database Cloud** | `pnpm prisma db push` lên Supabase PostgreSQL Pooler + Chạy Seed Data khởi tạo 2 Roles (`ADMIN`, `STUDENT`), Super Admin & Học viên mẫu. | ✅ **100% DONE** |
| 4 | **Bảo mật Auth & Phân quyền Hạt mịn** | Backend Express hỗ trợ JWT, đếm sai mật khẩu tự khóa tài khoản (`isLocked = true` khi sai $\ge 5$ lần), Permission Service có In-Memory Cache (TTL 10 phút). | ✅ **100% DONE** |
| 5 | **Auth & Permission Middlewares** | `authenticateToken` giải mã JWT, kiểm tra tài khoản còn tồn tại & chưa bị khóa; `requirePermission(code)` kiểm tra quyền từ RAM Cache. | ✅ **100% DONE** |
| 6 | **Tích hợp Admin UI từ erp-corporation-fe-v2** | Import toàn bộ Admin UI (Roles, Permissions, Departments, Employees, Job Levels, Custom Fields, Role Hierarchy) sang `frontend/src/features/admin`. | ✅ **100% DONE** |
| 7 | **Định tuyến Next.js App Router** | Tạo toàn bộ App Router Pages tại `src/app/(protected)/admin/*` (`/admin/roles`, `/admin/permissions`, `/admin/departments`, `/admin/employees`, v.v...). | ✅ **100% DONE** |
| 8 | **Sidebar App Navigation & Guards** | Cập nhật `AppSidebar.tsx` tách biệt mục **Quản trị Admin** độc lập; tạo component `PermissionGuard` ẩn/hiện UI theo mã quyền. | ✅ **100% DONE** |
| 9 | **Tài liệu Hướng dẫn Test & Luồng Code** | Tạo [Auth_Sprint1_Testing_and_Code_Walkthrough.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/Sprint1_LMS_BaHung/Auth_Sprint1_Testing_and_Code_Walkthrough.md) chi tiết kịch bản kiểm thử và phân tích luồng code. | ✅ **100% DONE** |
| 10 | **Fix Proxy & Prisma Monorepo** | Cấu hình `output` Prisma Client trong `schema.prisma` và `NEXT_PUBLIC_API_URL` / `rewrites` trong Next.js `next.config.ts`. Biên dịch TypeScript 0 lỗi (0 type error). | ✅ **100% DONE** |
| 11 | **Hoàn tất 100% Nhóm 2: Quản lý Khóa học & Danh mục (LMS-001 $\rightarrow$ LMS-012)** | Triển khai trọn vẹn 12 chức năng Khóa học, Danh mục, Clone course, Toggle Status, Rule Auto-Assign (Chức danh/Loại nhân sự/Cửa hàng/Xưởng), Cấu hình Bắt buộc, Deadline & Pass Score. Cập nhật 6 file BE, 7 file FE, đồng bộ DB Supabase Cloud. | ✅ **100% DONE** |

---

## 🗂️ CHI TIẾT CHECKLIST THI CÔNG & REVIEW TỪNG MODULE SPRINT 1

---

### 🔑 NHÓM 0: HẠ TẦNG DB & AUTHENTICATION (Chuẩn 1-to-1 erp-corporation-api-v2)

- [x] **[INFRA-001]** Khởi tạo Prisma Schema chuẩn ERP `User` & `UserAccount`:
  - [x] Model `User` (`employeeCode`, `fullName`, `email`, `status`, `isActive`, `employmentStatus`, `userType`)
  - [x] Model `UserAccount` (`userId` 1-1, `loginEmail`, `passwordHash`, `isLocked`, `failedLoginCount`, `refreshToken`, `refreshTokenExpiresAt`, `lastLoginAt`)
  - [x] Model `Role` (`roleName`, `displayName`, `isSystemRole`, `bypassDataScope`, `isActive`)
  - [x] Model `Permission` (`permissionCode`, `permissionName`, `module`, `action`, `resource`, `isActive`)
  - [x] Model `UserRole` (`userId`, `roleId`, `assignedAt`, `expiresAt`, `revokedAt`, `isActive`)
  - [x] Model `RolePermission` (`roleId`, `permissionId`, `assignedAt`)
- [x] **[INFRA-002]** Chạy PostgreSQL Migration & Seed Data ban đầu:
  - [x] Push schema sang Supabase PostgreSQL Cloud (`pnpm prisma db push`)
  - [x] Seed Permission catalogue (`USER.READ`, `USER.CREATE`, `USER.LOCK`, `ROLE.MANAGE`, `COURSE.READ`, `COURSE.CREATE`, `ATTP.VIEW`)
  - [x] Seed System Roles (`ADMIN`, `TRAINER`, `STUDENT`) & Map RolePermissions
  - [x] Seed Super Admin `User` + `UserAccount` (`admin@bahung.com` / `Password123`)
  - [x] Seed Học viên mẫu `User` + `UserAccount` (`alex@logix.com` / `Password123`)
- [x] **[INFRA-003]** Backend API & Auth/Permission Middlewares:
  - [x] `POST /api/auth/login`: Validate `loginEmail` + `password`, kiểm tra `isLocked`, đếm `failedLoginCount` (khóa khi $\ge 5$ lần sai), sinh `accessToken` & `refreshToken`
  - [x] `POST /api/auth/refresh`: Refresh token handler
  - [x] `GET /api/auth/me`: Trả về thông tin User, UserAccount, Roles & Permissions list
  - [x] Middleware `authenticateToken`: Verify JWT access token & gán `req.user`
  - [x] Middleware `requirePermission(permissionCode)`: Kiểm tra quyền động với Permission Service & Cache
  - [x] API Admin Role Management (`GET/POST /api/roles`, `PUT /api/roles/:id/permissions`, `PUT /api/roles/:id/users`, `GET /api/permissions`, `GET /api/departments`)
- [x] **[INFRA-004]** Frontend Next.js Integration (`src/features/auth` & `src/features/admin`):
  - [x] Cập nhật `auth.service.ts` khớp DTO `loginEmail` & `refreshToken`
  - [x] Cập nhật `use-auth.ts` Zustand store lưu `user`, `accessToken`, `permissions`
  - [x] Tạo `PermissionGuard` component ẩn/hiện UI theo `permissionCode`
  - [x] Tích hợp Admin UI (`RolesPage`, `PermissionsPage`, `DepartmentsPage`, `EmployeesPage`, `JobLevelsPage`, `CustomFieldsPage`, `RoleHierarchyPage`)
  - [x] Định tuyến Next.js App Router Pages tại `src/app/(protected)/admin/*`
  - [x] Cập nhật AppSidebar thêm nhóm **Quản trị Admin** tách biệt với LMS

---

### 📦 NHÓM 1: MÔ HÌNH TỔ CHỨC CỬA HÀNG & XƯỞNG (Nền tảng Auto-Assign)

- [ ] **[ORG-001]** Quản lý Cửa hàng & Chi nhánh (`org_stores`):
  - [x] Schema `Store` (`storeCode`, `storeName`, `region`, `storeType`, `isActive`, quan hệ `targetCourses`)
  - [ ] API CRUD Cửa hàng & Xưởng sản xuất (`GET`, `POST`, `PUT`, `DELETE /api/org/stores`)
  - [ ] UI Giao diện Quản lý danh sách Cửa hàng/Xưởng cho Admin
- [x] **[ORG-002]** Quản lý Bộ phận & Khâu sản xuất (`org_departments`):
  - [x] Schema `Department` (`deptCode`, `deptName`, `isFactoryDept`, quan hệ `targetCourses`)
  - [x] API CRUD Bộ phận xưởng (`GET`, `POST`, `PUT`, `DELETE /api/departments`)
  - [x] UI Quản lý phòng ban & Sơ đồ cây tổ chức `DepartmentsPage.tsx` (`OrgChartTree`)
- [ ] **[ORG-003]** Quản lý Chức danh (`org_positions`):
  - [x] Schema `Position` (`positionCode`, `positionName`, `levelRank`, quan hệ `targetCourses`)
  - [ ] API CRUD Chức danh công việc (`GET`, `POST`, `PUT`, `DELETE /api/org/positions`)
  - [x] UI Quản lý Job Levels `JobLevelsPage.tsx`

---

### 📚 NHÓM 2: QUẢN LÝ DANH MỤC & KHÓA HỌC (LMS-001 đến LMS-012) — ✅ 100% HOÀN THÀNH

- [x] **[LMS-001] Tạo danh mục chương trình đào tạo:**
  - [x] DB Schema: Model `Category` (`code`, `name`, `description`, `sortOrder`, `isActive`)
  - [x] Backend API: CRUD Categories (`GET /api/courses/categories`, `POST`, `PUT`, `DELETE /api/courses/categories/:id`)
  - [x] Frontend UI: Component `CategoryPillTabs.tsx` động & Tab Danh mục trên Admin Courses
- [x] **[LMS-002] Tạo khóa học mới:**
  - [x] DB Schema: Model `Course` (`code`, `title`, `slug`, `description`, `thumbnailUrl`, `categoryId`, `courseType`)
  - [x] Backend API: `POST /api/courses` với `CreateCourseDto` validation Zod & `requirePermission('COURSE.CREATE')`
  - [x] Frontend UI: Dialog Form tạo khóa học mới cho Admin/Trainer tại `CoursesAdminPage.tsx`
- [x] **[LMS-003] Sao chép khóa học (Clone course):**
  - [x] Backend API: `POST /api/courses/:id/clone` (sao chép trọn vẹn Course, Modules, Lessons sang DRAFT)
  - [x] Frontend UI: Nút thao tác `Copy` trực tiếp trên từng dòng khóa học tại `CoursesAdminPage.tsx`
- [x] **[LMS-004] Ngưng / kích hoạt khóa học:**
  - [x] DB Schema: Cột `status` ('DRAFT', 'PUBLISHED', 'ARCHIVED') và `isActive`
  - [x] Backend API: `PATCH /api/courses/:id/status` & `DELETE /api/courses/:id` (xóa mềm)
  - [x] Frontend UI: Badge trạng thái interactive (Click toggle chuyển đổi giữa Đang phát hành và Bản nháp)
- [x] **[LMS-005] Gán khóa học theo chức danh:**
  - [x] DB Schema: Trường `targetPositionId` và quan hệ FK với `Position`
  - [x] Backend API: `POST /api/courses/:id/assign-position` (tự động ghi danh toàn bộ User thuộc Position)
  - [x] Frontend UI: Dialog gán khóa học tự động theo chức danh công việc
- [x] **[LMS-006] Gán khóa học theo loại nhân sự (Học việc / Chính thức):**
  - [x] DB Schema: Trường `targetEmploymentStatus` trong `Course` ('PROBATION', 'OFFICIAL', 'TEMPORARY', 'ALL')
  - [x] Backend API: `POST /api/courses/:id/assign-employment-status` (tự động ghi danh theo trạng thái nhân sự)
  - [x] Frontend UI: Lựa chọn phân loại Học việc/Chính thức/Tăng cường trong Dialog Gán khóa
- [x] **[LMS-007] Gán khóa học theo cửa hàng:**
  - [x] DB Schema: Trường `targetStoreId` và quan hệ FK với `Store`
  - [x] Backend API: `POST /api/courses/:id/assign-store` (tự động ghi danh cho toàn bộ nhân sự tại Cửa hàng)
  - [x] Frontend UI: Lựa chọn theo Store ID trong Dialog Gán khóa
- [x] **[LMS-008] Gán khóa học theo bộ phận sản xuất (Khâu kem/bao/cắt...):**
  - [x] DB Schema: Trường `targetDepartmentId` và quan hệ FK với `Department` (`isFactoryDept`)
  - [x] Backend API: `POST /api/courses/:id/assign-department` (tự động ghi danh theo khâu xưởng)
  - [x] Frontend UI: Lựa chọn theo Department ID trong Dialog Gán khóa
- [x] **[LMS-009] Đặt khóa học bắt buộc:**
  - [x] DB Schema: Cờ `isMandatory` (Boolean)
  - [x] Backend API: Lưu & trả về cờ `isMandatory` trong `CourseDto`, hỗ trợ query filter `?isMandatory=true`
  - [x] Frontend UI: Badge đỏ `Bắt buộc` nổi bật trên `CourseCard.tsx` và Switch toggle trên Form tạo khóa
- [x] **[LMS-010] Đặt khóa học tùy chọn:**
  - [x] DB Schema: Hỗ trợ cấu hình `isMandatory = false`
  - [x] Frontend UI: Badge `Tùy chọn` và bộ lọc Phân loại trên `CourseCatalog.tsx`
- [x] **[LMS-011] Cấu hình thời hạn hoàn thành khóa học (Deadline):**
  - [x] DB Schema: Trường `durationDays` (mặc định 30 ngày)
  - [x] Backend API: Tự động tính `dueDate = now + durationDays` khi ghi danh (`enrollCourse` & `bulkEnrollUsers`)
  - [x] Frontend UI: Hiển thị thời hạn trên thẻ khóa học và Form cấu hình số ngày hoàn thành
- [x] **[LMS-012] Cấu hình điểm đạt khóa học (Pass score):**
  - [x] DB Schema: Trường `passScore` (mặc định 80 điểm)
  - [x] Backend API: Validate điểm đạt chuẩn hóa từ 0-100
  - [x] Frontend UI: Hiển thị điểm đạt yêu cầu màu xanh lục trên thẻ khóa học và Form tạo khóa

---

### 📖 NHÓM 3: QUẢN LÝ HỌC LIỆU & SOP (LMS-013 đến LMS-021)

- [ ] **[LMS-013] Tạo bài giảng dạng video:**
  - [x] DB Schema: Model `Lesson` với `lessonType = 'VIDEO'`, `videoUrl`
  - [ ] Backend API: CRUD Video lesson
  - [x] Frontend UI: Video Player component (`LessonVideoPlayer.tsx`)
- [ ] **[LMS-014] Tạo bài giảng dạng tài liệu PDF / Slide:**
  - [x] DB Schema: Model `Lesson` với `lessonType = 'PDF'`, `documentUrl`
  - [ ] Frontend UI: PDF Viewer tích hợp
- [ ] **[LMS-015] Tạo bài giảng dạng trang văn bản (Rich text SOP):**
  - [x] DB Schema: Model `Lesson` với `lessonType = 'RICHTEXT'`, `bodyHtml`
  - [x] Frontend UI: Render HTML Content & Code Playground
- [ ] **[LMS-016] Tạo bài giảng dạng hình ảnh / checklist quy trình:**
  - [x] DB Schema: Model `Lesson` với `lessonType = 'CHECKLIST'`, `checklistItems` (JSON)
- [ ] **[LMS-017] Sắp xếp thứ tự bài giảng trong khóa:**
  - [x] DB Schema: Trường `sortOrder` trong `CourseModule` và `Lesson`
  - [x] Backend API: Sắp xếp tự động `orderBy: { sortOrder: 'asc' }`
- [ ] **[LMS-018] Ẩn / hiện bài giảng:**
  - [x] DB Schema: Cờ `isVisible` (Boolean)
  - [x] Backend API: Filter chỉ lấy `isVisible = true` cho học viên
- [ ] **[LMS-019] Gắn tài liệu SOP vận hành cửa hàng:**
  - [x] DB Schema: Trường `sopCode`, `sopType = 'STORE_SOP'`
- [ ] **[LMS-020] Gắn tài liệu SOP sản xuất:**
  - [x] DB Schema: Trường `sopCode`, `sopType = 'FACTORY_SOP'`
- [ ] **[LMS-021] Phiên bản hóa học liệu:**
  - [x] DB Schema: `createdAt`, `updatedAt` tự động trên Prisma Model

---

### 🎓 NHÓM 4: HỌC VIÊN, GHI DANH & PLAYER HỌC TẬP (LMS-044 đến LMS-055)

- [ ] **[LMS-044] Ghi danh học viên thủ công vào khóa học:**
  - [x] DB Schema: Model `CourseEnrollment` (`userId`, `courseId`, `status`)
  - [x] Backend API: `POST /api/courses/enroll` trong `CourseService.enrollCourse`
- [ ] **[LMS-045] Ghi danh hàng loạt theo cửa hàng:**
  - [ ] Backend API: Bulk enrollment theo `storeId`
- [ ] **[LMS-046] Ghi danh hàng loạt theo bộ phận sản xuất:**
  - [ ] Backend API: Bulk enrollment theo `departmentId`
- [ ] **[LMS-047] Hủy ghi danh học viên (Unenroll):**
  - [ ] Backend API: `DELETE /api/courses/:courseId/enrollments/:userId`
- [ ] **[LMS-048] Xem danh sách khóa học của tôi (My Courses):**
  - [x] Backend API: `GET /api/progress/dashboard` (trả về danh sách khóa đã ghi danh & % hoàn thành)
  - [x] Frontend UI: `LMSDashboardPage.tsx`
- [ ] **[LMS-049] Mở bài giảng để học:**
  - [x] Backend API: `GET /api/lessons/:id`
  - [x] Frontend UI: `LessonPlayerPage.tsx`
- [ ] **[LMS-050] Đánh dấu hoàn thành bài giảng:**
  - [x] DB Schema: Model `LessonProgress` (`isCompleted`, `completedAt`)
  - [x] Backend API: `POST /api/progress/lesson` (tự động tính lại % hoàn thành khóa học)
- [ ] **[LMS-051] Lưu tiến độ học dở (Resume learning):**
  - [x] DB Schema: Trường `lastPositionSeconds` trong `LessonProgress`
  - [x] Backend API: `POST /api/progress/lesson` lưu timestamp video
- [ ] **[LMS-052] Học trên Web:**
  - [x] Frontend UI: Web Desktop Learning Portal responsive
- [ ] **[LMS-053] Học trên APP di động:**
  - [x] Frontend UI: Giao diện Mobile-responsive tự co giãn panels
- [ ] **[LMS-054] Tải tài liệu học (nếu được phép):**
  - [x] DB Schema: Cờ `allowDownload` trong `Lesson`
- [ ] **[LMS-055] Ghi nhận thời gian học (Learning time):**
  - [x] DB Schema: `durationSeconds` & `lastPositionSeconds`
