# 📚 TỪ ĐIỂN DỮ LIỆU TOÀN DIỆN (DATA DICTIONARY) - PRISMA SCHEMA LOGIX LMS

> **Vị trí file gốc (Source of Truth):** [`backend/prisma/schema.prisma`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/prisma/schema.prisma)  
> **Dự án:** LMS-BaHung / LogiX (Hệ thống Đào tạo F&B & Quản lý Học tập)  
> **Cập nhật:** Tháng 09/2026 (Đồng bộ 100% với 14 Models & 4 Enums)  
> **Mục tiêu:** Diễn giải chi tiết từng Model, từng trường thuộc tính (Field), kiểu dữ liệu, ràng buộc và **lý do nghiệp vụ (Business Rationale)** field đó được tạo ra.

---

## 📑 MỤC LỤC

1. [Phân Nhóm 1: Xác Thực & Phân Quyền (Auth & RBAC)](#1-auth--rbac-module)
   - [User (`auth_users`)](#11-user-auth_users)
   - [UserAccount (`auth_user_accounts`)](#12-useraccount-auth_user_accounts)
   - [Role (`auth_roles`)](#13-role-auth_roles)
   - [Permission (`auth_permissions`)](#14-permission-auth_permissions)
   - [UserRole (`auth_user_roles`)](#15-userrole-auth_user_roles)
   - [RolePermission (`auth_role_permissions`)](#16-rolepermission-auth_role_permissions)
2. [Phân Nhóm 2: Sơ Đồ Tổ Chức F&B (Org Structure)](#2-org-structure-module)
   - [Store (`org_stores`)](#21-store-org_stores)
   - [Department (`org_departments`)](#22-department-org_departments)
   - [Position (`org_positions`)](#23-position-org_positions)
3. [Phân Nhóm 3: Khóa Học & Học Liệu (Course & Curriculum)](#3-course--curriculum-module)
   - [Category (`crs_categories`)](#31-category-crs_categories)
   - [Course (`crs_courses`)](#32-course-crs_courses)
   - [CourseModule (`crs_modules`)](#33-coursemodule-crs_modules)
   - [Lesson (`crs_lessons`)](#34-lesson-crs_lessons)
4. [Phân Nhóm 4: Bài Kiểm Tra & Trắc Nghiệm (Quiz & Assessment)](#4-quiz--assessment-module)
   - [Quiz (`quiz_quizzes`)](#41-quiz-quiz_quizzes)
   - [QuizQuestion (`quiz_questions`)](#42-quizquestion-quiz_questions)
   - [QuizQuestionOption (`quiz_question_options`)](#43-quizquestionoption-quiz_question_options)
   - [QuizAttempt (`quiz_attempts`)](#44-quizattempt-quiz_attempts)
   - [QuizAttemptAnswer (`quiz_attempt_answers`)](#45-quizattemptanswer-quiz_attempt_answers)
5. [Phân Nhóm 5: Ghi Danh & Tiến Độ (Enrollment & Progress)](#5-enrollment--progress-module)
   - [CourseEnrollment (`enr_course_enrollments`)](#51-courseenrollment-enr_course_enrollments)
   - [LessonProgress (`enr_lesson_progress`)](#52-lessonprogress-enr_lesson_progress)
6. [Phân Nhóm 6: Định Nghĩa Các Enum Hệ Thống](#6-enums-hệ-thống)

---

## 1. AUTH & RBAC MODULE

### 1.1. `User` (`auth_users`)
> **Mục đích:** Lưu thông tin hồ sơ nhân sự/người dùng tổng thể (Master Profile). Đóng vai trò thực thể trung tâm liên kết với HRM, cơ cấu tổ chức và LMS.

| Tên Field          | Kiểu dữ liệu & Ràng buộc                 | Lý do tạo ra & Mục đích nghiệp vụ                                                                                                                                                          | Giá trị mẫu / Mặc định |
| ------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| `id`               | `String` (UUID), `@id`                   | Khóa chính duy nhất định danh người dùng trên toàn hệ thống.                                                                                                                               | `uuid()`               |
| `employeeCode`     | `String?`, `@unique`                     | Mã định danh nhân viên nội bộ (đồng bộ từ ERP/HRM). Phục vụ tra cứu bảng lương, chấm công và xếp ca.                                                                                       | `EMP-0012`             |
| `fullName`         | `String`                                 | Họ và tên hiển thị của nhân viên/người dùng trên giao diện LMS, chứng chỉ và báo cáo đào tạo.                                                                                              | `"Nguyễn Văn A"`       |
| `email`            | `String?`, `@unique`                     | Email liên hệ cá nhân/công việc của nhân sự (dùng nhận thông báo đào tạo).                                                                                                                 | `user@company.com`     |
| `status`           | `String`, `@default("ACTIVE")`           | Trạng thái hoạt động cấp nhân sự (`ACTIVE`: đang làm việc, `LOCKED`: bị khóa, `PENDING`: chờ kích hoạt).                                                                                   | `"ACTIVE"`             |
| `isActive`         | `Boolean`, `@default(true)`              | Cờ xóa mềm (Soft delete). Giúp ẩn nhân viên mà không làm mất lịch sử học tập/chứng chỉ cũ.                                                                                                 | `true`                 |
| `userType`         | `String`, `@default("EMPLOYEE")`         | Phân loại phân hệ người dùng (`EMPLOYEE`: nhân viên chuỗi/xưởng, `CUSTOMER`: học viên ngoài mua khóa học B2C, `SYSTEM_ADMIN`: quản trị viên).                                              | `"EMPLOYEE"`           |
| `employmentStatus` | `String`, `@default("PROBATION")`        | Tình trạng hợp đồng nhân sự (`PROBATION`: thử việc/học việc, `OFFICIAL`: chính thức, `TEMPORARY`: thời vụ, `RESIGNED`: đã nghỉ việc). Dùng để **tự động gán lộ trình đào tạo Onboarding**. | `"PROBATION"`          |
| `storeId`          | `String?`, FK $\rightarrow$ `Store`      | Khóa ngoại chỉ định cửa hàng/chi nhánh nhân viên đang trực thuộc. Dùng lọc dữ liệu theo cơ sở.                                                                                             | `uuid()` / `null`      |
| `departmentId`     | `String?`, FK $\rightarrow$ `Department` | Khóa ngoại chỉ định phòng ban/khâu sản xuất (ví dụ: Khâu Kem, Khâu Bột, Marketing, Kế toán).                                                                                               | `uuid()` / `null`      |
| `positionId`       | `String?`, FK $\rightarrow$ `Position`   | Khóa ngoại chỉ định chức vụ nhân viên (ví dụ: Quản lý cửa hàng, Thu ngân, Thợ làm kem). Dùng để **auto-assign khóa học bắt buộc theo chức danh**.                                          | `uuid()` / `null`      |
| `createdAt`        | `DateTime`, `@default(now())`            | Thời điểm hồ sơ nhân sự được khởi tạo.                                                                                                                                                     | `2026-08-11 08:00:00`  |
| `updatedAt`        | `DateTime`, `@updatedAt`                 | Thời điểm thông tin hồ sơ được cập nhật gần nhất.                                                                                                                                          | `now()`                |

---

### 1.2. `UserAccount` (`auth_user_accounts`)
> **Mục đích:** Tách biệt hồ sơ cá nhân (`User`) và thông tin đăng nhập/bảo mật (`UserAccount`) theo nguyên lý phân tách trách nhiệm (Separation of Concerns).

| Tên Field | Kiểu dữ liệu & Ràng buộc | Lý do tạo ra & Mục đích nghiệp vụ | Giá trị mẫu / Mặc định |
|---|---|---|---|
| `id` | `String` (UUID), `@id` | Khóa chính tài khoản xác thực. | `uuid()` |
| `userId` | `String`, `@unique`, FK $\rightarrow$ `User` | Quan hệ 1-1 với `User` (`onDelete: Cascade`). Khi xóa User thì tự động xóa credential. | `uuid()` |
| `loginEmail` | `String`, `@unique` | Tài khoản dùng để đăng nhập vào Web/App LMS. | `admin@digifnb.vn` |
| `passwordHash` | `String` | Mật khẩu đã được băm (Bcrypt / Argon2), tuyệt đối không lưu plain text. | `$2b$10$...` |
| `isLocked` | `Boolean`, `@default(false)` | Cờ khóa bảo mật. Tự động bật `true` khi người dùng nhập sai mật khẩu quá 5 lần để phòng chống tấn công Brute-force. | `false` |
| `failedLoginCount` | `Int`, `@default(0)` | Bộ đếm số lần đăng nhập sai liên tiếp. Reset về 0 khi đăng nhập thành công. | `0` |
| `refreshToken` | `String?` | Lưu chuỗi Refresh Token được cấp phát để gia hạn Access Token phiên làm việc. | `jwt_refresh_token` |
| `refreshTokenExpiresAt` | `DateTime?` | Thời điểm hết hạn của Refresh Token. | `2026-09-10 00:00:00` |
| `lastLoginAt` | `DateTime?` | Ghi nhận thời điểm đăng nhập thành công gần nhất phục vụ kiểm toán bảo mật (Audit log). | `2026-08-28 14:30:00` |

---

### 1.3. `Role` (`auth_roles`)
> **Mục đích:** Định nghĩa các vai trò trong hệ thống (RBAC).

| Tên Field | Kiểu dữ liệu & Ràng buộc | Lý do tạo ra & Mục đích nghiệp vụ | Giá trị mẫu / Mặc định |
|---|---|---|---|
| `id` | `String` (UUID), `@id` | Khóa chính vai trò. | `uuid()` |
| `roleName` | `String`, `@unique` | Mã định danh vai trò dạng hằng số code (dùng trong middleware kiểm tra quyền `requireRole()`). | `"ADMIN"`, `"STUDENT"`, `"STORE_MANAGER"` |
| `displayName` | `String` | Tên hiển thị thân thiện trên UI Admin phân quyền. | `"Quản trị viên"`, `"Quản lý cửa hàng"` |
| `isSystemRole` | `Boolean`, `@default(false)` | Đánh dấu vai trò mặc định của hệ thống. Ngăn chặn người dùng xóa nhầm các Role cốt lõi (như Super Admin). | `true` / `false` |
| `bypassDataScope` | `Boolean`, `@default(false)` | Cho phép người mang vai trò này xem toàn bộ dữ liệu toàn chuỗi mà không bị giới hạn phạm vi theo cửa hàng (`storeId`). | `true` (cho Admin), `false` (cho Store Manager) |
| `isActive` | `Boolean`, `@default(true)` | Cho phép tạm ngưng hiệu lực vai trò mà không cần xóa khỏi DB. | `true` |

---

### 1.4. `Permission` (`auth_permissions`)
> **Mục đích:** Lưu trữ các quyền hạn nguyên tử (Granular Permissions) theo ma trận Resource - Action.

| Tên Field | Kiểu dữ liệu & Ràng buộc | Lý do tạo ra & Mục đích nghiệp vụ | Giá trị mẫu / Mặc định |
|---|---|---|---|
| `id` | `String` (UUID), `@id` | Khóa chính quyền hạn. | `uuid()` |
| `permissionCode` | `String`, `@unique` | Mã kiểm tra quyền duy nhất trong code logic. | `"COURSE.CREATE"`, `"USER.VIEW"`, `"QUIZ.GRADE"` |
| `permissionName` | `String` | Tên diễn giải quyền trên giao diện cấu hình phân quyền. | `"Tạo mới khóa học"`, `"Chấm điểm bài thi"` |
| `module` | `String` | Nhóm chức năng lớn (để hiển thị theo nhóm trên UI). | `"COURSE"`, `"USER"`, `"QUIZ"`, `"ORG"` |
| `action` | `String` | Hành động thực hiện. | `"CREATE"`, `"READ"`, `"UPDATE"`, `"DELETE"`, `"APPROVE"` |
| `resource` | `String` | Đối tượng tác động. | `"COURSE"`, `"LESSON"`, `"USER_ACCOUNT"` |
| `isActive` | `Boolean`, `@default(true)` | Bật/tắt quyền hạn. | `true` |

---

### 1.5. `UserRole` (`auth_user_roles`) & 1.6. `RolePermission` (`auth_role_permissions`)
> **Mục đích:** Bảng trung gian giải quyết quan hệ nhiều - nhiều (N-N) giữa `User` $\leftrightarrow$ `Role` và `Role` $\leftrightarrow$ `Permission`. Hỗ trợ gán vai trò có thời hạn (`expiresAt`) hoặc thu hồi (`revokedAt`).

---

## 2. ORG STRUCTURE MODULE

### 2.1. `Store` (`org_stores`)
> **Mục đích:** Quản lý danh sách các điểm bán lẻ, cửa hàng nhượng quyền hoặc xưởng trung tâm trong chuỗi F&B.

| Tên Field | Kiểu dữ liệu & Ràng buộc | Lý do tạo ra & Mục đích nghiệp vụ | Giá trị mẫu / Mặc định |
|---|---|---|---|
| `id` | `String` (UUID), `@id` | Khóa chính cửa hàng/cơ sở. | `uuid()` |
| `storeCode` | `String`, `@unique` | Mã định danh cửa hàng (theo ERP). | `"STORE-Q1"`, `"FACTORY-BD"` |
| `storeName` | `String` | Tên đầy đủ của cửa hàng/chi nhánh. | `"Chi nhánh Quận 1 - Ba Hưng"` |
| `region` | `String`, `@default("MIEN_NAM")` | Phân vùng địa lý (`MIEN_NAM`, `MIEN_BAC`, `MIEN_TRUNG`) phục vụ báo cáo và phân bổ chính sách đào tạo theo vùng. | `"MIEN_NAM"` |
| `storeType` | `String`, `@default("RETAIL_STORE")` | Phân loại cơ sở (`RETAIL_STORE`: cửa hàng bán lẻ, `CENTRAL_FACTORY`: xưởng sản xuất trung tâm). | `"RETAIL_STORE"` |
| `isActive` | `Boolean`, `@default(true)` | Trạng thái hoạt động của cơ sở. | `true` |

---

### 2.2. `Department` (`org_departments`)
> **Mục đích:** Quản lý phòng ban nghiệp vụ khối văn phòng hoặc các khâu/dây chuyền sản xuất chuyên biệt tại xưởng F&B.

| Tên Field | Kiểu dữ liệu & Ràng buộc | Lý do tạo ra & Mục đích nghiệp vụ | Giá trị mẫu / Mặc định |
|---|---|---|---|
| `id` | `String` (UUID), `@id` | Khóa chính phòng ban. | `uuid()` |
| `deptCode` | `String`, `@unique` | Mã định danh phòng ban/khâu sản xuất. | `"KEM"`, `"BOT"`, `"MARKETING"`, `"QA"` |
| `deptName` | `String` | Tên phòng ban/dây chuyền. | `"Khâu Sản Xuất Kem Tiệt Trùng"`, `"Bộ phận Thu Ngân"` |
| `isFactoryDept` | `Boolean`, `@default(false)` | Cờ đánh dấu đây là khâu thuộc xưởng sản xuất F&B. Dùng để kích hoạt các bộ quy tắc SOP xưởng và tiêu chuẩn ATTP nghiêm ngặt. | `true` / `false` |
| `isActive` | `Boolean`, `@default(true)` | Trạng thái phòng ban. | `true` |

---

### 2.3. `Position` (`org_positions`)
> **Mục đích:** Quản lý cấp bậc, chức danh chức vụ của nhân viên trong chuỗi F&B.

| Tên Field | Kiểu dữ liệu & Ràng buộc | Lý do tạo ra & Mục đích nghiệp vụ | Giá trị mẫu / Mặc định |
|---|---|---|---|
| `id` | `String` (UUID), `@id` | Khóa chính chức danh. | `uuid()` |
| `positionCode` | `String`, `@unique` | Mã chức vụ chuẩn hóa. | `"STORE_MANAGER"`, `"BARISTA"`, `"ICE_CREAM_TECH"` |
| `positionName` | `String` | Tên chức vụ. | `"Quản lý Cửa Hàng"`, `"Kỹ thuật viên Làm Kem"` |
| `levelRank` | `Int`, `@default(1)` | Cấp bậc/thứ bậc chức danh (Level 1: Nhân viên, Level 2: Trưởng ca, Level 3: Cửa hàng trưởng...). Phục vụ phân cấp ma trận quyền lực và lộ trình thăng tiến. | `1`, `2`, `3` |
| `isActive` | `Boolean`, `@default(true)` | Trạng thái chức danh. | `true` |

---

## 3. COURSE & CURRICULUM MODULE

### 3.1. `Category` (`crs_categories`)
> **Mục đích:** Phân loại khóa học thành các chủ đề lớn (ví dụ: Quy trình SOP, An toàn Vệ sinh Thực phẩm, Đào tạo Hội nhập, Kỹ năng Bán hàng).

| Tên Field | Kiểu dữ liệu & Ràng buộc | Lý do tạo ra & Mục đích nghiệp vụ | Giá trị mẫu / Mặc định |
|---|---|---|---|
| `id` | `String` (UUID), `@id` | Khóa chính danh mục. | `uuid()` |
| `code` | `String`, `@unique` | Mã danh mục ngắn gọn. | `"ATTP"`, `"ONBOARDING"`, `"SOP_STORE"` |
| `name` | `String` | Tên hiển thị của danh mục. | `"An toàn Vệ sinh Thực phẩm 2026"` |
| `description` | `String?` | Mô tả phạm vi và mục tiêu của nhóm khóa học. | `"Tập hợp các khóa đào tạo ATTP bắt buộc..."` |
| `sortOrder` | `Int`, `@default(0)` | Thứ tự ưu tiên hiển thị danh mục trên menu/catalog. | `0`, `1`, `2` |
| `isActive` | `Boolean`, `@default(true)` | Ẩn/hiện danh mục trên giao diện người học. | `true` |

---

### 3.2. `Course` (`crs_courses`)
> **Mục đích:** Thực thể cốt lõi của LMS, lưu trữ toàn bộ thông tin khóa đào tạo, quy tắc gán tự động cho nhân sự (Auto-assign rules) và cấu hình điều kiện hoàn thành.

| Tên Field | Kiểu dữ liệu & Ràng buộc | Lý do tạo ra & Mục đích nghiệp vụ | Giá trị mẫu / Mặc định |
|---|---|---|---|
| `id` | `String` (UUID), `@id` | Khóa chính khóa học (dùng trong quan hệ DB và API nội bộ). | `uuid()` |
| `code` | `String`, `@unique` | Mã khóa học duy nhất dùng trong quản lý nghiệp vụ và đồng bộ chứng chỉ. | `"CRS-2026-ATTP01"` |
| `title` | `String` | Tên đầy đủ của khóa đào tạo. | `"Quy trình Vận hành Tiệt trùng Khâu Làm Kem"` |
| `slug` | `String`, `@unique` | Chuỗi ký tự chuẩn hóa URL (SEO-friendly / Human-readable link) cho phép mở khóa học qua đường dẫn thân thiện (ví dụ: `/courses/an-toan-thuc-pham-2026`). | `"quy-trinh-van-hanh-tiet-trung-khau-lam-kem"` |
| `description` | `String?` | Mô tả tóm tắt mục tiêu, nội dung và đối tượng học. | `"Khóa học hướng dẫn chi tiết các bước vệ sinh..."` |
| `thumbnailUrl` | `String?` | Đường dẫn ảnh đại diện (Cover/Banner) khóa học. | `"https://s3.../cover-attp.png"` |
| `categoryId` | `String`, FK $\rightarrow$ `Category` | Khóa ngoại gắn khóa học vào danh mục tương ứng. | `uuid()` |
| `courseType` | `String`, `@default("STANDARD")` | Loại khóa học (`ATTP`: An toàn thực phẩm có thời hạn, `ONBOARDING`: Hội nhập nhân viên mới, `STANDARD`: Khóa chuyên môn thông thường). | `"ATTP"`, `"ONBOARDING"`, `"STANDARD"` |
| `isMandatory` | `Boolean`, `@default(false)` | Cờ khóa học bắt buộc (`true`: nhân sự trong đối tượng bắt buộc phải hoàn thành, `false`: học tự nguyện/nâng cao). | `true` / `false` |
| `durationDays` | `Int?`, `@default(30)` | Số ngày tối đa học viên phải hoàn thành khóa kể từ thời điểm được ghi danh (dùng để tự động tính deadline `dueDate` trong Enrollment). | `30` (ngày) |
| `progressionMode` | `ProgressionMode`, `@default(LINEAR_LESSON)` | Chế độ mở khóa bài học (`FREE`: học tự do tùy chọn bài, `LINEAR_LESSON`: phải học tuần tự từng bài, `LINEAR_MODULE`: phải hoàn thành hết chương trước mới mở chương sau). | `LINEAR_LESSON` |
| `targetPositionId` | `String?`, FK $\rightarrow$ `Position` | **Quy tắc Auto-assign (LMS-005):** Nếu thiết lập, bất kỳ nhân sự nào thuộc chức danh này sẽ tự động được ghi danh vào khóa học. | `uuid()` / `null` |
| `targetDepartmentId` | `String?`, FK $\rightarrow$ `Department` | **Quy tắc Auto-assign (LMS-008):** Tự động gán khóa học cho toàn bộ nhân sự thuộc phòng ban/khâu sản xuất này. | `uuid()` / `null` |
| `targetStoreId` | `String?`, FK $\rightarrow$ `Store` | **Quy tắc Auto-assign (LMS-007):** Tự động gán khóa học cho toàn bộ nhân sự thuộc chi nhánh/cửa hàng này. | `uuid()` / `null` |
| `targetEmploymentStatus`| `String?` | **Quy tắc Auto-assign (LMS-006):** Gán khóa học theo tình trạng nhân sự (`PROBATION`: chỉ nhân viên thử việc, `OFFICIAL`: chỉ nhân viên chính thức, `ALL`: tất cả). | `"PROBATION"` |
| `isCommercial` | `Boolean`, `@default(false)` | Cờ đánh dấu khóa học thương mại (bán ra ngoài cho đối tác/học viên ngoài hệ thống F&B). | `false` |
| `isInternal` | `Boolean`, `@default(true)` | Cờ đánh dấu khóa đào tạo nội bộ của chuỗi Ba Hưng. | `true` |
| `status` | `String`, `@default("DRAFT")` | Trạng thái phát hành (`DRAFT`: đang soạn thảo, `PUBLISHED`: đã xuất bản cho học viên, `ARCHIVED`: lưu trữ/hết hạn áp dụng). | `"PUBLISHED"` |
| `isActive` | `Boolean`, `@default(true)` | Cờ xóa mềm khóa học. | `true` |

---

### 3.3. `CourseModule` (`crs_modules`)
> **Mục đích:** Chia nhỏ khóa học thành các Module/Chương/Học phần logic (ví dụ: Chương 1: Giới thiệu chung, Chương 2: Thực hành quy trình, Chương 3: Kiểm tra cuối khóa).

| Tên Field | Kiểu dữ liệu & Ràng buộc | Lý do tạo ra & Mục đích nghiệp vụ | Giá trị mẫu / Mặc định |
|---|---|---|---|
| `id` | `String` (UUID), `@id` | Khóa chính chương học. | `uuid()` |
| `courseId` | `String`, FK $\rightarrow$ `Course` | Khóa ngoại xác định chương thuộc khóa học nào (`onDelete: Cascade`). | `uuid()` |
| `title` | `String` | Tiêu đề của chương/module. | `"Chương 1: Tiêu chuẩn vệ sinh dụng cụ chế biến"` |
| `sortOrder` | `Int`, `@default(1)` | Thứ tự sắp xếp các chương trong khóa học (kéo thả sắp xếp trên Admin). | `1`, `2`, `3` |

---

### 3.4. `Lesson` (`crs_lessons`)
> **Mục đích:** Lưu trữ nội dung bài học chi tiết đa định dạng (Video, Bài đọc, PDF, Checklist SOP, Bài kiểm tra).

| Tên Field | Kiểu dữ liệu & Ràng buộc | Lý do tạo ra & Mục đích nghiệp vụ | Giá trị mẫu / Mặc định |
|---|---|---|---|
| `id` | `String` (UUID), `@id` | Khóa chính bài học. | `uuid()` |
| `moduleId` | `String`, FK $\rightarrow$ `CourseModule` | Khóa ngoại liên kết bài học vào chương (`onDelete: Cascade`). | `uuid()` |
| `title` | `String` | Tiêu đề bài học. | `"Quy trình 5 bước rửa tay khử trùng trước ca làm"` |
| `description` | `String?` | Tóm tắt nội dung bài học hoặc hướng dẫn người học cần chú ý. | `"Nội dung bắt buộc trước khi bước vào phòng lạnh..."` |
| `lessonType` | `LessonType`, `@default(VIDEO)` | Loại bài học (`VIDEO`, `ARTICLE`, `QUIZ`, `PDF`, `CHECKLIST`). Giao diện người học sẽ render player tương ứng theo loại này. | `VIDEO` |
| `videoProvider` | `VideoProvider?`, `@default(YOUTUBE)` | Nguồn cung cấp video (`YOUTUBE`: nhúng link YouTube, `DIRECT_UPLOAD`: file upload lên S3/MinIO/Cloudinary, `EXTERNAL_URL`: link CDN bên ngoài). | `YOUTUBE` |
| `videoUrl` | `String?` | Đường dẫn URL phát video (YouTube URL hoặc direct link). | `"https://youtube.com/watch?v=..."` |
| `videoStoragePath` | `String?` | Đường dẫn lưu trữ file trên Object Storage (S3 bucket key) khi upload trực tiếp. | `"/videos/sop/handwash-2026.mp4"` |
| `videoDuration` | `Int`, `@default(0)` | Thời lượng video tính bằng **giây**. Dùng để tính toán % thời gian học thực tế và chặn tua video nếu bắt buộc. | `180` (giây = 3 phút) |
| `bodyHtml` | `String?` | Nội dung bài viết định dạng Rich Text (HTML) cho bài học dạng `ARTICLE`. | `"<p>Bước 1: Làm ướt tay bằng nước sạch...</p>"` |
| `documentUrl` | `String?` | Link file tài liệu PDF/Slide đính kèm cho bài học dạng `PDF`. | `"https://storage.../sop-attp-v1.pdf"` |
| `estimatedReadTime`| `Int`, `@default(5)` | Thời gian đọc ước tính tính bằng **phút** để học viên chủ động thời gian. | `5` (phút) |
| `checklistItems` | `String?` | Chuỗi JSON chứa danh sách các đầu việc/hành động kiểm tra thực tế (dành cho bài dạng `CHECKLIST`). | `'[{"id": 1, "task": "Đeo găng tay"}]'` |
| `sopCode` | `String?` | Mã tài liệu Quy chuẩn vận hành chuẩn hóa (SOP Code liên kết với thư viện tài liệu vận hành chuỗi). | `"SOP-STORE-04"`, `"SOP-FAC-012"` |
| `sopType` | `String?` | Phân loại SOP (`STORE_SOP`: Quy trình vận hành tại cửa hàng, `FACTORY_SOP`: Quy trình kỹ thuật tại xưởng sản xuất). | `"STORE_SOP"` |
| `requiresSignature`| `Boolean`, `@default(false)` | Bắt buộc nhân viên phải ký xác nhận cam kết điện tử sau khi đọc xong quy trình SOP (phục vụ bằng chứng kiểm tra pháp lý ATTP). | `true` / `false` |
| `allowDownload` | `Boolean`, `@default(false)` | Cho phép người học tải tài liệu PDF/video về máy cá nhân hay chỉ được xem trực tuyến. | `false` (bảo mật học liệu nội bộ) |
| `isVisible` | `Boolean`, `@default(true)` | Ẩn/hiện bài học với học viên mà không cần xóa bài. | `true` |
| `sortOrder` | `Int`, `@default(1)` | Thứ tự sắp xếp của bài học bên trong chương. | `1`, `2`, `3` |

---

## 4. QUIZ & ASSESSMENT MODULE

### 4.1. `Quiz` (`quiz_quizzes`)
> **Mục đích:** Cấu hình bài thi trắc nghiệm đánh giá kiến thức gắn liền với bài học (`Lesson` dạng `QUIZ`).

| Tên Field | Kiểu dữ liệu & Ràng buộc | Lý do tạo ra & Mục đích nghiệp vụ | Giá trị mẫu / Mặc định |
|---|---|---|---|
| `id` | `String` (UUID), `@id` | Khóa chính bài thi. | `uuid()` |
| `lessonId` | `String`, `@unique`, FK $\rightarrow$ `Lesson` | Quan hệ 1-1 với `Lesson` chứa bài quiz (`onDelete: Cascade`). | `uuid()` |
| `title` | `String` | Tiêu đề bài kiểm tra trắc nghiệm. | `"Bài kiểm tra Quy chuẩn An toàn Vệ sinh Thực phẩm"` |
| `description` | `String?` | Hướng dẫn làm bài, quy định điểm đạt và số lần thi. | `"Bạn cần đạt từ 80% điểm để được tính là hoàn thành..."` |
| `passScore` | `Int`, `@default(80)` | Tỷ lệ phần trăm điểm tối thiểu để đạt bài thi (ví dụ: 80%). | `80` |
| `maxAttempts` | `Int`, `@default(3)` | Số lần tối đa học viên được phép làm lại bài thi (`0`: không giới hạn). | `3` |
| `timeLimitMinutes` | `Int?`, `@default(30)` | Thời gian làm bài tối đa tính bằng **phút** (`null`: không giới hạn thời gian đếm ngược). | `15` (phút) |
| `shuffleQuestions` | `Boolean`, `@default(true)` | Tự động xáo trộn thứ tự câu hỏi mỗi lần học viên bắt đầu lượt thi mới để chống gian lận/chép bài. | `true` |
| `showAnswerFeedback`| `Boolean`, `@default(true)` | Cho phép học viên xem giải thích đúng/sai sau khi nộp bài để củng cố kiến thức. | `true` |

---

### 4.2. `QuizQuestion` (`quiz_questions`)
> **Mục đích:** Lưu trữ nội dung câu hỏi thi và trọng số điểm.

| Tên Field | Kiểu dữ liệu & Ràng buộc | Lý do tạo ra & Mục đích nghiệp vụ | Giá trị mẫu / Mặc định |
|---|---|---|---|
| `id` | `String` (UUID), `@id` | Khóa chính câu hỏi. | `uuid()` |
| `quizId` | `String`, FK $\rightarrow$ `Quiz` | Khóa ngoại liên kết câu hỏi vào bài quiz (`onDelete: Cascade`). | `uuid()` |
| `questionText` | `String` | Nội dung câu hỏi trắc nghiệm hoặc câu hỏi ngắn. | `"Nhiệt độ tối ưu để bảo quản kem lạnh trong tủ đông là bao nhiêu?"` |
| `questionType` | `QuestionType`, `@default(SINGLE_CHOICE)` | Kiểu câu hỏi (`SINGLE_CHOICE`: 1 đáp án đúng, `MULTIPLE_CHOICE`: nhiều đáp án đúng, `TRUE_FALSE`: Đúng/Sai, `SHORT_ANSWER`: điền từ). | `SINGLE_CHOICE` |
| `points` | `Float`, `@default(1.0)` | Trọng số điểm của câu hỏi này trong đề thi. | `1.0`, `2.0` |
| `explanation` | `String?` | Giải thích lý do vì sao đáp án đúng và trích dẫn quy trình liên quan. | `"Theo tiêu chuẩn HACCP, nhiệt độ tủ đông phải luôn dưới -18°C..."` |
| `sortOrder` | `Int`, `@default(1)` | Thứ tự câu hỏi mặc định trong đề. | `1`, `2`, `3` |

---

### 4.3. `QuizQuestionOption` (`quiz_question_options`)
> **Mục đích:** Lưu các phương án lựa chọn (A, B, C, D) cho từng câu hỏi.

| Tên Field | Kiểu dữ liệu & Ràng buộc | Lý do tạo ra & Mục đích nghiệp vụ | Giá trị mẫu / Mặc định |
|---|---|---|---|
| `id` | `String` (UUID), `@id` | Khóa chính đáp án lựa chọn. | `uuid()` |
| `questionId` | `String`, FK $\rightarrow$ `QuizQuestion` | Khóa ngoại gắn đáp án vào câu hỏi tương ứng (`onDelete: Cascade`). | `uuid()` |
| `optionText` | `String` | Nội dung hiển thị của phương án lựa chọn. | `"-18°C đến -22°C"` |
| `isCorrect` | `Boolean`, `@default(false)` | Đánh dấu phương án này là đáp án chính xác (`true`) hay sai (`false`). | `true` |
| `sortOrder` | `Int`, `@default(1)` | Thứ tự hiển thị phương án. | `1`, `2`, `3`, `4` |

---

### 4.4. `QuizAttempt` (`quiz_attempts`)
> **Mục đích:** Lưu lịch sử từng lượt làm bài thi của học viên (bao gồm thời gian bắt đầu, kết thúc, điểm số và kết quả Đạt/Không đạt).

| Tên Field | Kiểu dữ liệu & Ràng buộc | Lý do tạo ra & Mục đích nghiệp vụ | Giá trị mẫu / Mặc định |
|---|---|---|---|
| `id` | `String` (UUID), `@id` | Khóa chính lượt làm bài. | `uuid()` |
| `quizId` | `String`, FK $\rightarrow$ `Quiz` | Khóa ngoại xác định làm bài thi nào. | `uuid()` |
| `userId` | `String`, FK $\rightarrow$ `User` | Khóa ngoại xác định học viên nào thực hiện bài thi. | `uuid()` |
| `attemptNumber` | `Int`, `@default(1)` | Số thứ tự lần thi (Lần 1, Lần 2, Lần 3) để so sánh với `maxAttempts`. | `1`, `2` |
| `score` | `Float`, `@default(0.0)` | Điểm số đạt được (% điểm từ 0.0 đến 100.0). | `85.5` |
| `isPassed` | `Boolean`, `@default(false)` | Kết quả lượt thi (`true` nếu `score >= passScore`, `false` nếu trượt). | `true` |
| `startedAt` | `DateTime`, `@default(now())` | Thời điểm bắt đầu mở đề làm bài (dùng tính thời gian đếm ngược giới hạn). | `2026-08-28 10:00:00` |
| `submittedAt` | `DateTime?` | Thời điểm học viên bấm nộp bài hoặc hệ thống tự động thu bài khi hết giờ. | `2026-08-28 10:14:32` |

---

### 4.5. `QuizAttemptAnswer` (`quiz_attempt_answers`)
> **Mục đích:** Chi tiết từng câu trả lời mà học viên đã chọn/nhập trong một lượt làm bài thi cụ thể (Audit log chấm thi).

| Tên Field | Kiểu dữ liệu & Ràng buộc | Lý do tạo ra & Mục đích nghiệp vụ | Giá trị mẫu / Mặc định |
|---|---|---|---|
| `id` | `String` (UUID), `@id` | Khóa chính câu trả lời chi tiết. | `uuid()` |
| `attemptId` | `String`, FK $\rightarrow$ `QuizAttempt` | Thuộc lượt làm bài nào (`onDelete: Cascade`). | `uuid()` |
| `questionId` | `String`, FK $\rightarrow$ `QuizQuestion` | Câu hỏi được trả lời. | `uuid()` |
| `selectedOptionId`| `String?` | ID đáp án mà học viên đã chọn (với câu hỏi trắc nghiệm `SINGLE_CHOICE`, `MULTIPLE_CHOICE`). | `uuid()` |
| `textAnswer` | `String?` | Nội dung văn bản học viên nhập vào (với câu hỏi dạng `SHORT_ANSWER`). | `"dưới -18 độ C"` |
| `isCorrect` | `Boolean?` | Kết quả chấm câu này đúng (`true`) hay sai (`false`). | `true` |
| `earnedPoints` | `Float`, `@default(0.0)` | Điểm đạt được cho câu trả lời này. | `1.0` |

---

## 5. ENROLLMENT & PROGRESS MODULE

### 5.1. `CourseEnrollment` (`enr_course_enrollments`)
> **Mục đích:** Ghi nhận mối quan hệ học tập giữa Học viên $\leftrightarrow$ Khóa học, theo dõi hạn chót hoàn thành và tiến độ tổng thể của khóa.

| Tên Field | Kiểu dữ liệu & Ràng buộc | Lý do tạo ra & Mục đích nghiệp vụ | Giá trị mẫu / Mặc định |
|---|---|---|---|
| `id` | `String` (UUID), `@id` | Khóa chính bản ghi ghi danh. | `uuid()` |
| `userId` | `String`, FK $\rightarrow$ `User` | Học viên được ghi danh. Ràng buộc `@@unique([userId, courseId])` chống ghi danh trùng lặp. | `uuid()` |
| `courseId` | `String`, FK $\rightarrow$ `Course` | Khóa học được ghi danh. | `uuid()` |
| `enrollmentSource`| `String`, `@default("MANUAL")` | Nguồn gốc tạo lượt ghi danh (`AUTO_RULE`: hệ thống tự gán theo phòng ban/vị trí, `MANUAL`: Admin gán tay, `PURCHASE`: mua trực tuyến). | `"AUTO_RULE"` |
| `status` | `String`, `@default("ENROLLED")` | Trạng thái học tập (`ENROLLED`: mới ghi danh chưa học, `IN_PROGRESS`: đang học dở, `COMPLETED`: đã hoàn thành toàn bộ bài và quiz, `CANCELLED`: bị hủy). | `"IN_PROGRESS"` |
| `dueDate` | `DateTime?` | Hạn chót phải hoàn thành khóa học (tự động tính = `enrolledAt + durationDays`). Dùng cho cảnh báo quá hạn đào tạo. | `2026-09-30 23:59:59` |
| `completionPercentage`| `Float`, `@default(0.0)` | Phần trăm tiến độ hoàn thành khóa học (0.0% $\rightarrow$ 100.0%) tính theo tỷ lệ bài học đã hoàn tất. | `75.0` (%) |
| `isPassed` | `Boolean`, `@default(false)` | Đánh giá tổng kết đạt khóa học (đạt yêu cầu tiến độ và vượt qua toàn bộ Quiz bắt buộc). Căn cứ để cấp chứng chỉ ATTP/Hoàn thành Onboarding. | `true` / `false` |
| `enrolledAt` | `DateTime`, `@default(now())` | Ngày giờ chính thức ghi danh vào khóa học. | `now()` |
| `completedAt` | `DateTime?` | Thời điểm học viên hoàn tất toàn bộ yêu cầu của khóa học. | `2026-08-29 16:45:00` |

---

### 5.2. `LessonProgress` (`enr_lesson_progress`)
> **Mục đích:** Theo dõi chi tiết tiến độ học tập của từng bài học cụ thể (vị trí video đang xem dở, điểm quiz cao nhất, trạng thái hoàn thành bài).

| Tên Field | Kiểu dữ liệu & Ràng buộc | Lý do tạo ra & Mục đích nghiệp vụ | Giá trị mẫu / Mặc định |
|---|---|---|---|
| `id` | `String` (UUID), `@id` | Khóa chính bản ghi tiến độ bài học. | `uuid()` |
| `enrollmentId` | `String`, FK $\rightarrow$ `CourseEnrollment` | Thuộc lượt ghi danh khóa học nào (`onDelete: Cascade`). | `uuid()` |
| `userId` | `String`, FK $\rightarrow$ `User` | Học viên tương ứng. Ràng buộc `@@unique([userId, lessonId])` đảm bảo mỗi học viên chỉ có 1 bản ghi tiến độ cho 1 bài học. | `uuid()` |
| `lessonId` | `String`, FK $\rightarrow$ `Lesson` | Bài học cụ thể đang được theo dõi. | `uuid()` |
| `isCompleted` | `Boolean`, `@default(false)` | Đánh dấu bài học này đã hoàn thành (`true`) hay chưa (`false`). Điều kiện tiên quyết để mở bài học kế tiếp nếu chạy chế độ `LINEAR_LESSON`. | `true` |
| `lastPositionSeconds`| `Int`, `@default(0)` | Vị trí giây dừng lại cuối cùng khi xem video (Resume Playback). Học viên quay lại sẽ phát tiếp đúng vị trí này mà không phải xem lại từ đầu. | `125` (giây) |
| `quizHighestScore` | `Float?` | Điểm số cao nhất học viên đạt được nếu bài học này là bài kiểm tra `LessonType.QUIZ`. | `90.0` |
| `completedAt` | `DateTime?` | Thời điểm hoàn thành bài học này. | `2026-08-28 11:20:00` |

---

## 6. ENUMS HỆ THỐNG

### 6.1. `LessonType` (Loại hình bài giảng)
* `VIDEO`: Bài giảng dạng video (YouTube hoặc upload).
* `ARTICLE`: Bài giảng dạng bài viết hướng dẫn Rich Text HTML.
* `QUIZ`: Bài kiểm tra trắc nghiệm đánh giá kiến thức.
* `PDF`: Tài liệu hướng dẫn, cẩm nang dạng file PDF/Slide.
* `CHECKLIST`: Danh sách các bước kiểm tra thực hành SOP tại chỗ.

### 6.2. `VideoProvider` (Nguồn lưu trữ & phát Video)
* `YOUTUBE`: Nhúng video trực tiếp từ YouTube URL (tiết kiệm băng thông, phát nhanh).
* `DIRECT_UPLOAD`: Video tải trực tiếp lên Object Storage riêng (S3/Cloudinary/MinIO) đảm bảo bản quyền nội bộ.
* `EXTERNAL_URL`: Phát video qua link CDN bên ngoài.

### 6.3. `QuestionType` (Hình thái câu hỏi trắc nghiệm)
* `SINGLE_CHOICE`: Trắc nghiệm chọn 1 đáp án đúng duy nhất (Radio).
* `MULTIPLE_CHOICE`: Trắc nghiệm chọn nhiều đáp án đúng (Checkbox).
* `TRUE_FALSE`: Trắc nghiệm dạng Đúng / Sai.
* `SHORT_ANSWER`: Câu hỏi ngắn yêu cầu học viên gõ câu trả lời dạng chữ/số.

### 6.4. `ProgressionMode` (Quy chế kiểm soát luồng học tập)
* `FREE`: Học viên được tự do click xem bất kỳ bài học nào mà không bắt buộc theo thứ tự.
* `LINEAR_LESSON`: Phải hoàn thành xong bài học hiện tại (xem hết video / vượt qua quiz) mới được mở khóa bài học kế tiếp.
* `LINEAR_MODULE`: Phải hoàn thành tất cả các bài trong Chương trước mới được mở khóa Chương sau.
