 BƯỚC 1: KIỂM TRA CẤU HÌNH & MÔI TRƯỜNG (CONFIG & ENVIRONMENT)
Mục tiêu: Đảm bảo biến môi trường, proxy kết nối và TypeScript hoàn toàn sạch lỗi.

1.1. File cấu hình Backend: backend/.env
Kiểm tra DATABASE_URL và DIRECT_URL: Kết nối tới Supabase Cloud qua Pooler port 6543 và direct port 5432.
Kiểm tra JWT_SECRET: Khóa bí mật ký token.
Port: Mặc định PORT=5000.
1.2. File cấu hình Frontend: frontend/.env & next.config.ts
NEXT_PUBLIC_API_URL: Trỏ về backend API http://localhost:5000.
File 

next.config.ts
: Kiểm tra khối rewrites() chuyển tiếp /api/:path* $\rightarrow$ http://localhost:5000/api/:path* để tránh lỗi CORS.
1.3. File Axios Interceptor: 

axios.ts
Kiểm tra dòng đọc accessToken và đính kèm vào Header Authorization: Bearer <token>.
Kiểm tra cơ chế tự động gửi refreshToken khi gặp mã lỗi 401 Unauthorized.
1.4. Lệnh kiểm tra nhanh:
bash
# Kiểm tra TypeScript toàn bộ monorepo (FE + BE)
pnpm -r build  # Hoặc: npx tsc --noEmit (phải đạt 0 lỗi)\

🗄️ BƯỚC 2: KIỂM TRA THIẾT KẾ CƠ SỞ DỮ LIỆU (DATABASE SCHEMA & SEED)
Mục tiêu: Kiểm tra 15 Models chuẩn ERP-v2 tương thích với cả LMS Ba Hưng và LMS Horeca trong tương lai.

2.1. File Schema: 

schema.prisma
Auth & RBAC Core (1-to-1 ERP-v2):
User (auth_users): Lưu thông tin nhân viên (employeeCode, fullName, email, status, employmentStatus, userType).
UserAccount (auth_user_accounts): Quan hệ 1-1 với User, lưu loginEmail, passwordHash, isLocked, failedLoginCount, refreshToken.
Role, Permission, UserRole, RolePermission: Hỗ trợ gán quyền hạt mịn, có trường expiresAt (quyền có thời hạn) và revokedAt (quyền bị thu hồi).
Sơ đồ Tổ chức (Org Structure):
Store (org_stores): Cửa hàng & Xưởng trung tâm (storeType).
Department (org_departments): Phòng ban & Khâu sản xuất (isFactoryDept).
Position (org_positions): Chức danh công việc & cấp bậc (levelRank).
Khóa học & Học liệu SOP (Curriculum):
Category, Course (cờ isMandatory, durationDays, passScore), CourseModule.
Lesson (hỗ trợ VIDEO, PDF, RICHTEXT, CHECKLIST, cờ sopType, requiresSignature, allowDownload).
Ghi danh & Tiến độ (Enrollment & Progress):
CourseEnrollment (lưu nguồn gán enrollmentSource, % completionPercentage, status).
LessonProgress (lưu vị trí xem video lastPositionSeconds, isCompleted).
2.2. File Seed Data: 

seed.ts
Khởi tạo 2 Roles: ADMIN (Super Admin), STUDENT (Học viên).
Khởi tạo 7 Permissions: USER.READ, USER.CREATE, USER.LOCK, ROLE.MANAGE, COURSE.READ, COURSE.CREATE, ATTP.VIEW.
Tài khoản mẫu:
Super Admin: admin@bahung.com / Password123 (Full quyền quản trị).
Học viên mẫu: alex@logix.com / Password123 (Quyền học tập COURSE.READ).

🛡️ BƯỚC 3: KIỂM TRA HẠ TẦNG AUTH, BẢO MẬT & VALIDATION
Mục tiêu: Đánh giá luồng xử lý xác thực, bảo vệ tấn công Brute-Force và phân quyền động.

3.1. DTO Validation: 

auth.dto.ts
Sử dụng thư viện zod để validate chặt chẽ request body (loginEmail, password).
3.2. Auth Service: 

auth.service.ts
Xác thực Mật khẩu & Phòng thủ Brute-force:
So sánh mật khẩu bằng bcrypt.compare.
Nếu mật khẩu sai: Tăng failedLoginCount + 1. Khi failedLoginCount >= 5, tự động set isLocked = true và khóa tài khoản ngay lập tức.
Nếu mật khẩu đúng: Reset failedLoginCount = 0, cập nhật lastLoginAt.
Cấp phát JWT: Sinh Access Token (15 phút) và Refresh Token (7 ngày).
3.3. Permission Service & In-Memory Cache: 

permission.service.ts
getUserPermissions(userId): Lưu bộ nhớ đệm RAM với TTL 10 phút, tránh query DB lặp lại.
invalidatePermissionCacheForRole(roleId): Tự động xóa cache ngay lập tức khi Admin cập nhật quyền của Role.
3.4. Middlewares Bảo vệ API:


auth.middleware.ts
 (authenticateToken): Xác thực JWT Header, kiểm tra tức thì nếu tài khoản bị khóa (isLocked == true) thì trả về HTTP 403.


permission.middleware.ts
 (requirePermission(code)): Kiểm tra User có mã quyền yêu cầu hay không trước khi cho phép Controller thực thi.
 
🖥️ BƯỚC 4: KIỂM TRA TÍCH HỢP FRONTEND & ADMIN UI
Mục tiêu: Đảm bảo giao diện quản trị phân quyền ERP-v2 đã hoạt động mượt mà trên Next.js App Router.

4.1. Zustand Auth Store: 

use-auth.ts
Quản lý trạng thái đăng nhập, lưu user, accessToken, permissions.
Cung cấp hàm hasPermission(permissionCode) để kiểm tra quyền trên UI.
4.2. Component Kiểm soát UI: 

PermissionGuard.tsx
Dùng để bọc các nút bấm hoặc chức năng nhạy cảm. Người dùng không có quyền sẽ không thấy nút xuất hiện.
4.3. Các trang Quản trị Admin (Next.js App Router):
/admin/roles: 

RolesPage.tsx
 — Quản lý vai trò, phân quyền kéo thả, gán user.
/admin/permissions: 

PermissionsPage.tsx
 — Danh mục quyền theo từng module.
/admin/departments: 

DepartmentsPage.tsx
 — Quản lý phòng ban & sơ đồ cây tổ chức (OrgChartTree).
/admin/employees: 

EmployeesPage.tsx
 — Danh sách nhân viên từ Supabase DB.
/admin/job-levels, /admin/custom-fields, /admin/role-hierarchy.
📚 BƯỚC 5: KIỂM TRA CÁC MODULE LMS CORE (BACKEND & UI)
Mục tiêu: Đánh giá các API và UI Khóa học, Bài học và Tiến độ đã sẵn sàng.

Course Module: 

course.service.ts
 — Đầy đủ getAllCourses (hỗ trợ filter/search), getCourseById, enrollCourse, createCourse.
Lesson Module: 

lesson.service.ts
 — API getLessonById phục vụ trình phát học tập.
Progress Module: 

progress.service.ts
 — API getDashboardProgress (thống kê) và updateLessonProgress (lưu vị trí video lastPositionSeconds, tự tính lại % completionPercentage của khóa học).
Frontend LMS Pages:


CourseCatalog.tsx
 — Danh mục khóa học.


LMSDashboardPage.tsx
 — Dashboard học viên.


LessonPlayerPage.tsx
 — Trình phát bài học video/văn bản/slide.
🧪 BƯỚC 6: KỊCH BẢN THỰC THI KIỂM THỬ TRỰC TIẾP (HANDS-ON TEST)
Bạn có thể mở Terminal tại thư mục Practice/LogiX và chạy:

bash
pnpm dev
(Frontend tại http://localhost:3000 | Backend tại http://localhost:5000)

🧪 Test Case 1: Đăng nhập Super Admin & Kiểm tra Phân quyền
Truy cập http://localhost:3000/login.
Đăng nhập: admin@bahung.com / Password123.
Kết quả kỳ vọng:
Đăng nhập thành công, chuyển hướng vào Dashboard.
Menu Sidebar hiển thị nhóm Quản trị Admin.
Truy cập /admin/roles và /admin/employees thấy dữ liệu thực từ Supabase DB.
🧪 Test Case 2: Đăng nhập Học viên & Kiểm tra Ẩn Menu
Đăng xuất hoặc mở tab ẩn danh.
Đăng nhập: alex@logix.com / Password123.
Kết quả kỳ vọng:
Đăng nhập thành công với vai trò Học viên (STUDENT).
Menu Quản trị Admin bị ẩn hoàn toàn (nhờ PermissionGuard).
🧪 Test Case 3: Thử nghiệm Cơ chế Tự Động Khóa Tài Khoản (Brute-Force Lock)
Tại trang Đăng nhập, nhập email alex@logix.com và gõ sai mật khẩu liên tiếp 5 lần.
Kết quả kỳ vọng:
Lần 1 ➔ 4: Báo mật khẩu sai và cảnh báo số lần thử còn lại.
Lần 5: Thông báo tài khoản đã bị khóa tự động.
Trên Supabase DB, cột isLocked của tài khoản chuyển thành true. Lần thứ 6 dù nhập đúng mật khẩu vẫn bị chặn.
📋 Sơ đồ Luồng Tổng Thể (Mermaid Architecture Flow)
mermaid
flowchart TD
    subgraph Client [Frontend - Next.js]
        A["/login Page"] --> B["Zustand Auth Store (Token, User, Perms)"]
        B --> C["PermissionGuard / Protected Routes"]
        C --> D["Admin Pages (/admin/*)"]
        C --> E["LMS Pages (/lms/*)"]
    end
    subgraph Server [Backend - Express API]
        F["POST /api/auth/login"] --> G{"Check Brute-force & Password"}
        G -- "Sai >= 5 lần" --> H["Lock Account (isLocked=true)"]
        G -- "Hợp lệ" --> I["Generate JWT (Access & Refresh)"]
        
        J["API Request with Bearer Token"] --> K["Middleware authenticateToken"]
        K --> L["Middleware requirePermission(code)"]
        L --> M["In-Memory Permission Cache (TTL 10m)"]
        M --> N["Controllers (Courses, Lessons, Progress, Admin)"]
    end
    subgraph CloudDB [Database - Supabase Cloud]
        O[("auth_users & auth_user_accounts")]
        P[("auth_roles & auth_permissions")]
        Q[("crs_courses & crs_lessons")]
        R[("enr_course_enrollments & enr_lesson_progress")]
    end
    G <--> O
    I <--> P
    N <--> Q
    N <--> R
Toàn bộ hướng dẫn chi tiết theo từng dòng code cũng có thể xem tại 

Auth_Sprint1_Testing_and_Code_Walkthrough.md
. Bạn có thể bắt đầu review từ Bước 1 đến Bước 6 theo quy trình trên.