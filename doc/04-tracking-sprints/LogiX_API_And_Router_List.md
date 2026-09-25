# 🗺️ LogiX LMS - Tổng Hợp Toàn Bộ Backend APIs & Frontend Routers

> **Tài liệu tham chiếu:** Danh sách đầy đủ các Endpoint Backend và Đường dẫn Router Frontend trong hệ thống LogiX LMS.  
> **Cập nhật:** 2026-08-28

---

## 1. Backend REST APIs (Express.js)

* **Base URL:** `http://localhost:5000`
* **Tài liệu tương tác:** Swagger UI tại `http://localhost:5000/api-docs` (hoặc truy cập `/` để tự động chuyển hướng sang Swagger)
* **Quy ước phản hồi:** Chuẩn hóa theo `ApiResponse<T>` (`{ success: boolean, data?: T, message?: string, error?: any }`)

---

### 🔑 1.1. Authentication & Authorization (`/api/auth`)

| Method | Endpoint | Yêu cầu Token | Quyền hạn (Permission) | Chức năng chi tiết | File Controller / Service |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `POST` | `/api/auth/login` | ❌ | - | Đăng nhập tài khoản, trả về `accessToken` & `refreshToken` | `auth.controller.ts` |
| `POST` | `/api/auth/refresh` | ❌ | - | Cấp lại `accessToken` mới từ `refreshToken` | `auth.controller.ts` |
| `GET` | `/api/auth/me` | 🔒 | - | Lấy thông tin chi tiết user đang đăng nhập (kèm role & permissions) | `auth.controller.ts` |
| `POST` | `/api/auth/logout` | 🔒 | - | Đăng xuất và vô hiệu hóa phiên | `auth.controller.ts` |

---

### 👥 1.2. Roles & Permissions (`/api/roles`, `/api/permissions`)

| Method | Endpoint | Yêu cầu Token | Quyền hạn (Permission) | Chức năng chi tiết | File Controller / Service |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/api/roles` | 🔒 | - | Lấy danh sách tất cả các vai trò | `role.controller.ts` |
| `GET` | `/api/roles/:id` | 🔒 | - | Lấy chi tiết thông tin một vai trò | `role.controller.ts` |
| `POST` | `/api/roles` | 🔒 | `ROLE.MANAGE` | Tạo mới một vai trò | `role.controller.ts` |
| `PUT` | `/api/roles/:id` | 🔒 | `ROLE.MANAGE` | Cập nhật tên/mô tả vai trò | `role.controller.ts` |
| `DELETE` | `/api/roles/:id` | 🔒 | `ROLE.MANAGE` | Xóa vai trò | `role.controller.ts` |
| `PUT` | `/api/roles/:id/permissions` | 🔒 | `ROLE.MANAGE` | Gán danh sách quyền (Permissions) cho vai trò | `role.controller.ts` |
| `GET` | `/api/roles/:roleId/permissions` | 🔒 | - | Lấy danh sách quyền hiện tại của vai trò | `role.controller.ts` |
| `GET` | `/api/roles/:roleId/users` | 🔒 | - | Lấy danh sách người dùng được gán vai trò này | `role.controller.ts` |
| `PUT` | `/api/roles/:roleId/users` | 🔒 | `ROLE.MANAGE` | Đồng bộ danh sách người dùng thuộc vai trò | `role.controller.ts` |
| `GET` | `/api/permissions` | 🔒 | - | Lấy toàn bộ danh mục Permission của hệ thống | `permission.controller.ts` |

---

### 🏢 1.3. Departments & Organization (`/api/departments`)

| Method | Endpoint | Yêu cầu Token | Quyền hạn (Permission) | Chức năng chi tiết | File Controller / Service |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/api/departments` | 🔒 | - | Lấy danh sách phòng ban (phẳng) | `department.controller.ts` |
| `GET` | `/api/departments/tree` | 🔒 | - | Lấy cấu trúc cây phòng ban phân cấp | `department.controller.ts` |
| `POST` | `/api/departments` | 🔒 | - | Tạo phòng ban mới | `department.controller.ts` |
| `PUT` | `/api/departments/:id` | 🔒 | - | Cập nhật phòng ban | `department.controller.ts` |
| `DELETE` | `/api/departments/:id` | 🔒 | - | Xóa phòng ban | `department.controller.ts` |
| `GET` | `/api/departments/:departmentId/members` | 🔒 | - | Lấy danh sách nhân viên thuộc phòng ban | `department.controller.ts` |

---

### 🎖️ 1.4. Job Levels (`/api/job-levels`)

| Method | Endpoint | Yêu cầu Token | Quyền hạn (Permission) | Chức năng chi tiết | File Controller / Service |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/api/job-levels` | 🔒 | - | Lấy danh sách các cấp bậc công việc | `job-level.controller.ts` |
| `POST` | `/api/job-levels` | 🔒 | - | Tạo cấp bậc mới | `job-level.controller.ts` |
| `PUT` | `/api/job-levels/:id` | 🔒 | - | Cập nhật thông tin cấp bậc | `job-level.controller.ts` |
| `DELETE` | `/api/job-levels/:id` | 🔒 | - | Xóa cấp bậc | `job-level.controller.ts` |

---

### 👤 1.5. Users & Custom Fields (`/api/users`, `/api/custom-field-definitions`)

| Method | Endpoint | Yêu cầu Token | Quyền hạn (Permission) | Chức năng chi tiết | File Controller / Service |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/api/users` | 🔒 | - | Danh sách tất cả người dùng / nhân viên | `user.controller.ts` |
| `POST` | `/api/users` | 🔒 | - | Tạo người dùng mới | `user.controller.ts` |
| `GET` | `/api/custom-field-definitions` | 🔒 | - | Lấy định nghĩa các trường dữ liệu tùy chỉnh động | `custom-field.controller.ts` |

---

### 📚 1.6. Categories & Courses Management (`/api/courses`)

| Method | Endpoint | Yêu cầu Token | Quyền hạn (Permission) | Chức năng chi tiết | Mã Function |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/api/courses/categories` | ❌ | - | Lấy danh mục khóa học | LMS-001 |
| `GET` | `/api/courses/categories/:id` | ❌ | - | Lấy chi tiết một danh mục khóa học | LMS-001 |
| `POST` | `/api/courses/categories` | 🔒 | `COURSE.CREATE` | Tạo danh mục khóa học mới | LMS-001 |
| `PUT` | `/api/courses/categories/:id` | 🔒 | `COURSE.CREATE` | Cập nhật danh mục | LMS-001 |
| `DELETE` | `/api/courses/categories/:id` | 🔒 | `COURSE.CREATE` | Xóa danh mục | LMS-001 |
| `GET` | `/api/courses` | ❌ | - | Lấy danh sách khóa học (Tìm kiếm, lọc) | LMS-002 |
| `GET` | `/api/courses/:id` | ❌ | - | Chi tiết khóa học | LMS-002 |
| `POST` | `/api/courses` | 🔒 | `COURSE.CREATE` | Tạo khóa học mới | LMS-002 |
| `PUT` | `/api/courses/:id` | 🔒 | `COURSE.CREATE` | Cập nhật khóa học | LMS-002 |
| `POST` | `/api/courses/:id/clone` | 🔒 | `COURSE.CREATE` | Nhân bản khóa học | LMS-003 |
| `PATCH` | `/api/courses/:id/status` | 🔒 | `COURSE.CREATE` | Chuyển đổi trạng thái Bật / Tắt khóa học | LMS-004 |
| `DELETE` | `/api/courses/:id` | 🔒 | `COURSE.CREATE` | Xóa khóa học | LMS-002 |
| `POST` | `/api/courses/:id/assign-position` | 🔒 | `COURSE.CREATE` | Gán khóa học theo chức danh / vị trí | LMS-005 |
| `POST` | `/api/courses/:id/assign-employment-status` | 🔒 | `COURSE.CREATE` | Gán khóa học theo loại nhân sự | LMS-006 |
| `POST` | `/api/courses/:id/assign-store` | 🔒 | `COURSE.CREATE` | Gán khóa học theo cửa hàng / chi nhánh | LMS-007 |
| `POST` | `/api/courses/:id/assign-department` | 🔒 | `COURSE.CREATE` | Gán khóa học theo bộ phận sản xuất | LMS-008 |
| `POST` | `/api/courses/:id/enroll` | 🔒 | - | Ghi danh cá nhân vào khóa học | LMS-011, LMS-044 |

---

### 📑 1.7. Curriculum & Modules (`/api/courses`)

| Method | Endpoint | Yêu cầu Token | Quyền hạn (Permission) | Chức năng chi tiết | Mã Function |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/api/courses/:id/curriculum` | ❌ | - | Lấy toàn bộ cây Chương & Bài học (kèm Quiz) | LMS-017 |
| `POST` | `/api/courses/:id/modules` | 🔒 | `COURSE.CREATE` | Thêm chương học mới vào khóa | LMS-017 |
| `PUT` | `/api/courses/modules/:moduleId` | 🔒 | `COURSE.CREATE` | Cập nhật thông tin chương học | LMS-017 |
| `DELETE` | `/api/courses/modules/:moduleId` | 🔒 | `COURSE.CREATE` | Xóa chương học | LMS-017 |
| `POST` | `/api/courses/:id/modules/reorder` | 🔒 | `COURSE.CREATE` | Sắp xếp lại thứ tự các chương học | LMS-017 |

---

### 🎬 1.8. Lessons (`/api/lessons`)

| Method | Endpoint | Yêu cầu Token | Quyền hạn (Permission) | Chức năng chi tiết | Mã Function |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `POST` | `/api/lessons/parse-youtube` | ❌ | - | Trích xuất thông tin video YouTube (Video ID, Duration) | Tiện ích |
| `GET` | `/api/lessons/:id` | ❌ | - | Lấy chi tiết nội dung bài học | LMS-021 |
| `POST` | `/api/lessons/modules/:moduleId` | 🔒 | `COURSE.CREATE` | Thêm bài học mới vào chương | LMS-021 |
| `PUT` | `/api/lessons/:id` | 🔒 | `COURSE.CREATE` | Cập nhật nội dung bài học | LMS-021 |
| `DELETE` | `/api/lessons/:id` | 🔒 | `COURSE.CREATE` | Xóa bài học | LMS-021 |
| `POST` | `/api/lessons/modules/:moduleId/reorder` | 🔒 | `COURSE.CREATE` | Sắp xếp lại thứ tự bài học trong chương | LMS-021 |

---

### ❓ 1.9. Quizzes & Questions (`/api/quizzes`)

| Method | Endpoint | Yêu cầu Token | Quyền hạn (Permission) | Chức năng chi tiết | Mã Function |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/api/quizzes/:id/take` | 🔒 | - | Học viên lấy đề thi làm bài (Bảo mật ẩn `isCorrect` & `explanation`) | LMS-065 |
| `POST` | `/api/quizzes/:id/submit` | 🔒 | - | Học viên nộp bài thi, tự động chấm điểm, lưu `QuizAttempt` & cập nhật `LessonProgress` | LMS-066 |
| `GET` | `/api/quizzes/:id/attempts` | 🔒 | - | Học viên xem lịch sử các lần thi và điểm số | LMS-069 |
| `GET` | `/api/quizzes/lessons/:lessonId` | ❌ | - | Lấy Quiz theo Lesson (Tự động khởi tạo nếu chưa có) | LMS-061 |
| `GET` | `/api/quizzes/:id` | ❌ | - | Lấy chi tiết Quiz theo ID | LMS-061 |
| `GET` | `/api/quizzes/:id/preview` | ❌ | - | Xem trước đề thi (Preview Mode cho Admin/Giảng viên) | LMS-064 |
| `PUT` | `/api/quizzes/:id` | 🔒 | `COURSE.CREATE` | Cập nhật cấu hình bài kiểm tra (Thời gian làm, Điểm đạt) | LMS-062 |
| `POST` | `/api/quizzes/:quizId/questions` | 🔒 | `COURSE.CREATE` | Thêm câu hỏi mới vào Quiz | LMS-056 |
| `PUT` | `/api/quizzes/questions/:questionId` | 🔒 | `COURSE.CREATE` | Cập nhật câu hỏi và danh sách đáp án | LMS-057 |
| `DELETE` | `/api/quizzes/questions/:questionId` | 🔒 | `COURSE.CREATE` | Xóa câu hỏi khỏi Quiz | LMS-058 |
| `POST` | `/api/quizzes/:quizId/questions/reorder` | 🔒 | `COURSE.CREATE` | Sắp xếp thứ tự các câu hỏi | LMS-060 |

---

### 📈 1.10. Progress & System (`/api/progress`, `/api/health`)

| Method | Endpoint | Yêu cầu Token | Quyền hạn (Permission) | Chức năng chi tiết |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/progress/dashboard` | 🔒 | - | Lấy số liệu tổng quan tiến độ học tập của người dùng |
| `POST` | `/api/progress/lesson` | 🔒 | - | Cập nhật trạng thái hoàn thành bài học |
| `GET` | `/api/health` | ❌ | - | Kiểm tra trạng thái máy chủ (Health Check) |

---

## 2. Frontend Routers (Next.js App Router)

* **Thư mục gốc:** `frontend/src/app`
* **Route Path Config:** `frontend/src/config/route-path.ts`
* **Middleware Auth Guard:** `frontend/middleware.ts`

---

### 🌐 2.1. Public & Auth Pages

| URL Route | File Path | Yêu cầu xác thực | Mô tả giao diện |
| :--- | :--- | :---: | :--- |
| `/` | `frontend/src/app/page.tsx` | Public | Trang chủ / Landing Page |
| `/login` | `frontend/src/app/(auth)/login/page.tsx` | Guest (Redirect dashboard nếu đã login) | Màn hình đăng nhập |
| `/forbidden` | `frontend/src/app/forbidden/page.tsx` | Public | Trang thông báo lỗi 403 (Không đủ quyền truy cập) |
| `/onboarding` | `frontend/src/app/onboarding/page.tsx` | 🔒 Logged in | Quy trình làm quen hệ thống cho nhân sự mới |

---

### 🛡️ 2.2. Admin Management Pages (`/admin/*`)

| URL Route | File Path | Mục đích sử dụng |
| :--- | :--- | :--- |
| `/admin` | `frontend/src/app/(protected)/admin/page.tsx` | Trang tổng quan quản trị (Admin Dashboard) |
| `/admin/roles` | `frontend/src/app/(protected)/admin/roles/page.tsx` | Quản lý danh sách vai trò (Roles) |
| `/admin/permissions` | `frontend/src/app/(protected)/admin/permissions/page.tsx` | Quản lý ma trận phân quyền hệ thống |
| `/admin/role-hierarchy` | `frontend/src/app/(protected)/admin/role-hierarchy/page.tsx` | Sơ đồ phân cấp vai trò |
| `/admin/departments` | `frontend/src/app/(protected)/admin/departments/page.tsx` | Quản lý phòng ban & tổ chức |
| `/admin/employees` | `frontend/src/app/(protected)/admin/employees/page.tsx` | Quản lý hồ sơ nhân viên |
| `/admin/job-levels` | `frontend/src/app/(protected)/admin/job-levels/page.tsx` | Quản lý cấp bậc chuyên môn |
| `/admin/custom-fields` | `frontend/src/app/(protected)/admin/custom-fields/page.tsx` | Quản lý cấu hình trường dữ liệu mở rộng |
| `/admin/courses` | `frontend/src/app/(protected)/admin/courses/page.tsx` | Quản lý toàn bộ danh sách khóa học (Admin View) |

---

### 🎓 2.3. LMS Learner & Training Pages (`/lms/*`)

| URL Route | File Path | Mục đích sử dụng |
| :--- | :--- | :--- |
| `/lms/dashboard` | `frontend/src/app/(protected)/lms/dashboard/page.tsx` | Bảng điều khiển học tập cá nhân (Dashboard) |
| `/lms/courses` | `frontend/src/app/(protected)/lms/courses/page.tsx` | Danh mục khóa học & tìm kiếm khóa học |
| `/lms/courses/[id]` | `frontend/src/app/(protected)/lms/courses/[id]/page.tsx` | Chi tiết khóa học, lộ trình học & đăng ký khóa |
| `/lms/lessons/create` | `frontend/src/app/(protected)/lms/lessons/create/page.tsx` | Màn hình tạo bài học mới |
| `/lms/lessons/[id]` | `frontend/src/app/(protected)/lms/lessons/[id]/page.tsx` | Giao diện học bài (Video Player / Tài liệu) |
| `/lms/quizzes/[id]` | `frontend/src/app/(protected)/lms/quizzes/[id]/page.tsx` | Giao diện làm bài kiểm tra trắc nghiệm / Xem trước đề |
| `/lms/progress` | `frontend/src/app/(protected)/lms/progress/page.tsx` | Lịch sử & tiến độ hoàn thành các khóa học |
| `/lms/reports` | `frontend/src/app/(protected)/lms/reports/page.tsx` | Báo cáo đào tạo & thống kê kết quả học tập |
