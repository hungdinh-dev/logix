# 📋 CHECKLIST DỰ ÁN LMS-BAHUNG — SPRINT 1
> **Trọng tâm Sprint 1:** Core Auth & RBAC, Sơ đồ Tổ chức (Cửa hàng & Xưởng), Quản lý Khóa học & Học liệu (SOP), Auto-Assign Rules theo Vị trí, Ghi danh & Player Học tập.  
> **Tổng số chức năng:** **33 Chức năng LMS-xxx** + **Hạ tầng Core Auth & Sơ đồ Tổ chức**  
> **Dựa trên thiết kế DB:** [BaHung-DB-Design.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/BaHung-DB-Design.md)  
> **Tài liệu kiểm thử & luồng code:** [Auth_Sprint1_Testing_and_Code_Walkthrough.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/Sprint1_LMS_BaHung/Auth_Sprint1_Testing_and_Code_Walkthrough.md)

---

## 📅 BÁO CÁO CÔNG VIỆC HOÀN THÀNH HÔM NAY (TODAY'S WORK REPORT — 07/08/2026)

| # | Hạng mục đã hoàn thành | Chi tiết & Kết quả thực thi | Trạng thái |
|---|---|---|:---:|
| 1 | **Tài liệu hóa Context & DB Design** | Tạo `LMS-Unified-Function-and-DB-Context.md` (111 CN BaHung vs 61 CN Horeca) & `BaHung-DB-Design.md` phục vụ mở rộng tương lai. | ✅ **100% DONE** |
| 2 | **Checklist Sprint 1** | Lập bản kế hoạch `Checklist-BaHung-Sprint1.md` chia 5 Nhóm thi công chi tiết. | ✅ **100% DONE** |
| 3 | **Hạ tầng Core Auth 1-to-1 ERP-v2** | Cấu hình Prisma Schema 15 models (`User`, `UserAccount`, `Role`, `Permission`, `UserRole`, `RolePermission`, `Department`, `Position`, `Store`, `Course`...). | ✅ **100% DONE** |
| 4 | **Bảo mật Auth & Phân quyền Hạt mịn** | Backend Express hỗ trợ JWT, đếm sai mật khẩu tự khóa tài khoản (`isLocked = true`), Permission Service có In-Memory Cache (TTL 10 phút). | ✅ **100% DONE** |
| 5 | **Đồng bộ Supabase Database Cloud** | `pnpm prisma db push` lên Supabase PostgreSQL Pooler + Chạy Seed Data khởi tạo 2 Roles (`ADMIN`, `STUDENT`), Super Admin & Học viên mẫu. | ✅ **100% DONE** |
| 6 | **Tích hợp Admin UI từ erp-corporation-fe-v2** | Sao chép toàn bộ Admin UI (Roles, Permissions, Departments, Employees, Job Levels, Custom Fields, Role Hierarchy) sang `frontend/src/features/admin`. | ✅ **100% DONE** |
| 7 | **Định tuyến Next.js App Router** | Tạo toàn bộ App Router Pages tại `src/app/(protected)/admin/*` (`/admin/roles`, `/admin/permissions`, `/admin/departments`, `/admin/employees`, v.v...). | ✅ **100% DONE** |
| 8 | **Sidebar App Navigation** | Cập nhật `AppSidebar.tsx` tách biệt mục **Quản trị Admin** thành Group riêng biệt bên dưới các tính năng LMS. | ✅ **100% DONE** |
| 9 | **Fix Proxy & Prisma Monorepo** | Cấu hình `output` Prisma Client trong `schema.prisma` và `NEXT_PUBLIC_API_URL` / `rewrites` trong Next.js `next.config.ts`. Sửa 100% lỗi build TS. | ✅ **100% DONE** |

---

## 📊 THỐNG KÊ DANH SÁCH CHỨC NĂNG SPRINT 1

| Nhóm Module | Mã Chức Năng (LMS-xxx) | Số lượng | Trạng thái |
|---|---|:---:|:---:|
| **Hạ tầng & RBAC** | Core Auth, User & Admin UI | 4 Core | ✅ **HOÀN THÀNH** |
| **Sơ đồ Tổ chức** | NHÓM 1: Stores, Depts, Positions | 3 Core | 🔄 In Progress |
| **Danh mục & Khóa học** | LMS-001 đến LMS-012 | 12 CN | ⚪ Pending |
| **Quản lý Học liệu & SOP** | LMS-013 đến LMS-021 | 9 CN | ⚪ Pending |
| **Học viên & Ghi danh** | LMS-044 đến LMS-055 | 12 CN | ⚪ Pending |

---

## 🗂️ CHI TIẾT CHECKLIST THI CÔNG SPRINT 1

### 🔑 NHÓM 0: HẠ TẦNG DB & AUTHENTICATION (Chuẩn 1-to-1 erp-corporation-api-v2)

- [x] **[INFRA-001]** Khởi tạo Prisma Schema chuẩn ERP `User` & `UserAccount`:
  - [x] Model `User` (`employeeCode`, `fullName`, `email`, `status`, `isActive`)
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
- [x] **[INFRA-003]** Backend API & Auth/Permission Middlewares:
  - [x] `POST /api/auth/login`: Validate `loginEmail` + `password`, kiểm tra `isLocked`, đếm `failedLoginCount` (khóa khi >= 5 lần sai), sinh `accessToken` & `refreshToken`
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
  - [ ] API CRUD Cửa hàng & Xưởng sản xuất (`GET`, `POST`, `PUT`, `DELETE /api/org/stores`)
  - [ ] UI Giao diện Quản lý danh sách Cửa hàng/Xưởng cho Admin
- [ ] **[ORG-002]** Quản lý Bộ phận & Khâu sản xuất (`org_departments`):
  - [ ] API CRUD Bộ phận xưởng (`GET`, `POST`, `PUT`, `DELETE /api/departments`)
  - [ ] Cờ phân loại `is_factory_dept` (Nhận diện khâu làm kem/cắt/bao)
- [ ] **[ORG-003]** Quản lý Chức danh (`org_positions`):
  - [ ] API CRUD Chức danh công việc (`GET`, `POST`, `PUT`, `DELETE /api/org/positions`)

---

### 📚 NHÓM 2: QUẢN LÝ DẠNH MỤC & KHÓA HỌC (LMS-001 đến LMS-012)
*(Tiếp tục thi công ở giai đoạn tiếp theo)*
