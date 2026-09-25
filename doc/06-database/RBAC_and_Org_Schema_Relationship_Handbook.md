# 🗃️ Cẩm Nang Chuyên Sâu: Cấu Trúc Bảng & Mô Hình Phân Quyền RBAC trong Prisma (LogiX LMS)

> **Tài liệu tham khảo nghiệp vụ & kỹ thuật:** Phân tích chi tiết từng bảng dữ liệu (Table), từng trường thuộc tính (Field), mục đích sử dụng và mối quan hệ liên kết (Relationships) giữa các bảng trong hệ thống Xác thực (Auth), Cơ cấu tổ chức (Org Structure), và Phân quyền theo vai trò (RBAC) của dự án LogiX.

---

## 📌 1. BỨC TRANH TỔNG THỂ: SƠ ĐỒ QUAN HỆ THỰC THỂ (ERD)

```mermaid
erDiagram
    org_stores ||--o{ auth_users : "1 Cửa hàng có nhiều Nhân viên"
    org_departments ||--o{ auth_users : "1 Phòng ban có nhiều Nhân viên"
    org_positions ||--o{ auth_users : "1 Chức vụ có nhiều Nhân viên"

    auth_users ||--o| auth_user_accounts : "1-to-1: 1 Nhân sự có 1 Tài khoản đăng nhập"
    
    auth_users ||--o{ auth_user_roles : "1 Nhân sự được gán nhiều Vai trò (N-N)"
    auth_roles ||--o{ auth_user_roles : "1 Vai trò gán cho nhiều Nhân sự"

    auth_roles ||--o{ auth_role_permissions : "1 Vai trò gom nhiều Quyền hạn (N-N)"
    auth_permissions ||--o{ auth_role_permissions : "1 Quyền hạn thuộc nhiều Vai trò"

    auth_users {
        string id PK "UUID"
        string employeeCode UK "Mã nhân viên (EMP-xxx)"
        string fullName "Họ và tên"
        string email UK "Email nhân sự"
        string status "ACTIVE | LOCKED | PENDING"
        boolean isActive "Xóa mềm user"
        string userType "EMPLOYEE | CUSTOMER | SYSTEM_ADMIN"
        string employmentStatus "PROBATION | OFFICIAL | RESIGNED"
        string storeId FK "Cửa hàng"
        string departmentId FK "Phòng ban"
        string positionId FK "Chức vụ"
    }

    auth_user_accounts {
        string id PK "UUID"
        string userId FK_UK "1-to-1 với User"
        string loginEmail UK "Email đăng nhập"
        string passwordHash "Bcrypt Hash"
        boolean isLocked "Tự khóa khi sai 5 lần"
        int failedLoginCount "Đếm số lần sai mật khẩu"
        string refreshToken "JWT Refresh Token"
        datetime refreshTokenExpiresAt "Hạn Refresh Token"
        datetime lastLoginAt "Lần đăng nhập cuối"
    }

    auth_roles {
        string id PK "UUID"
        string roleName UK "Mã vai trò (ADMIN, STUDENT)"
        string displayName "Tên hiển thị"
        boolean isSystemRole "Không thể xóa Role hệ thống"
        boolean bypassDataScope "Bỏ qua giới hạn chi nhánh"
        boolean isActive "Xóa mềm role"
    }

    auth_permissions {
        string id PK "UUID"
        string permissionCode UK "Mã quyền (USER.READ, ROLE.MANAGE)"
        string permissionName "Tên quyền giải thích"
        string module "HRM | SYSTEM | LMS | ATTP"
        string action "READ | CREATE | UPDATE | MANAGE"
        string resource "USER | ROLE | DEPARTMENT"
        boolean isActive "Trạng thái quyền"
    }

    auth_user_roles {
        string id PK "UUID"
        string userId FK "ID User"
        string roleId FK "ID Role"
        datetime assignedAt "Ngày gán"
        datetime expiresAt "Ngày hết hạn vai trò"
        datetime revokedAt "Ngày thu hồi"
        boolean isActive "Trạng thái kích hoạt"
    }

    auth_role_permissions {
        string id PK "UUID"
        string roleId FK "ID Role"
        string permissionId FK "ID Permission"
        datetime assignedAt "Ngày gán"
    }

    org_stores {
        string id PK "UUID"
        string storeCode UK "Mã cửa hàng (CH-QUAN1)"
        string storeName "Tên cửa hàng"
        string region "MIEN_NAM"
        string storeType "RETAIL_STORE | CENTRAL_FACTORY"
        boolean isActive "Xóa mềm cửa hàng"
    }

    org_departments {
        string id PK "UUID"
        string deptCode UK "Mã phòng ban (PB-BANHANG)"
        string deptName "Tên phòng ban"
        boolean isFactoryDept "Phòng thuộc xưởng"
        boolean isActive "Xóa mềm phòng ban"
    }

    org_positions {
        string id PK "UUID"
        string positionCode UK "Mã chức danh (QLCH)"
        string positionName "Tên chức danh"
        int levelRank "Cấp bậc xếp hạng (1, 2, 3, 4)"
        boolean isActive "Xóa mềm chức danh"
    }
```

---

## 🏢 2. NHÓM BẢNG CƠ CẤU TỔ CHỨC (ORG STRUCTURE)

### 2.1 Bảng `Store` (Tên bảng DB: `org_stores`)
* **Mục đích nghiệp vụ:** Quản lý điểm kinh doanh bán lẻ, chuỗi cửa hàng F&B hoặc nhà máy sản xuất bánh/kem.
* **Chi tiết các trường:**
  - `id` (`String @id @default(uuid())`): Khóa chính UUID.
  - `storeCode` (`String @unique`): Mã định danh duy nhất (VD: `CH-QUAN1`, `XUONG-KEM`).
  - `storeName` (`String`): Tên cửa hàng đầy đủ (VD: `"Cửa hàng Ba Hưng - Quận 1"`).
  - `region` (`String @default("MIEN_NAM")`): Khu vực địa lý phân vùng hoạt động.
  - `storeType` (`String @default("RETAIL_STORE")`): Phân loại điểm bán (`RETAIL_STORE` = Cửa hàng bán lẻ, `CENTRAL_FACTORY` = Xưởng sản xuất trung tâm).
  - `isActive` (`Boolean @default(true)`): Cờ trạng thái hoạt động (Phục vụ Xóa mềm).

### 2.2 Bảng `Department` (Tên bảng DB: `org_departments`)
* **Mục đích nghiệp vụ:** Quản lý phòng ban hành chính và chuyên môn trong doanh nghiệp.
* **Chi tiết các trường:**
  - `id` (`String @id @default(uuid())`): Khóa chính UUID.
  - `deptCode` (`String @unique`): Mã phòng ban (VD: `PB-BANHANG`, `PB-LAMKEM`).
  - `deptName` (`String`): Tên phòng ban (VD: `"Phòng Bán hàng & Dịch vụ khách hàng"`).
  - `isFactoryDept` (`Boolean @default(false)`): Đánh dấu phòng ban chuyên môn sản xuất trong nhà máy.
  - `isActive` (`Boolean @default(true)`): Xóa mềm phòng ban.

### 2.3 Bảng `Position` (Tên bảng DB: `org_positions`)
* **Mục đích nghiệp vụ:** Quản lý chức danh nghề nghiệp và cấp bậc chuyên môn (Rank) của nhân viên.
* **Chi tiết các trường:**
  - `id` (`String @id @default(uuid())`): Khóa chính UUID.
  - `positionCode` (`String @unique`): Mã chức danh (VD: `QLCH` = Quản lý cửa hàng, `NV-BAN-HANG` = Nhân viên bán hàng).
  - `positionName` (`String`): Tên chức vụ hiển thị.
  - `levelRank` (`Int @default(1)`): Cấp bậc quản lý (Rank 1: Nhân viên, Rank 2: Trưởng ca, Rank 3: Quản lý, Rank 4: Ban giám đốc).
  - `isActive` (`Boolean @default(true)`): Xóa mềm chức vụ.

---

## 👥 3. NHÓM HỒ SƠ NHÂN SỰ & TÀI KHOẢN (USER & USER ACCOUNT)

> [!NOTE]
> **Tại sao tách riêng `User` và `UserAccount` thành 2 bảng?**
> - `User`: Là **Hồ sơ nhân sự ngoài đời thực** (tên tuổi, mã nhân viên, phòng ban, chức vụ). Một nhân viên vừa được tuyển vào làm thử việc có thể chưa cần cấp tài khoản phần mềm ngay.
> - `UserAccount`: Là **Tài khoản đăng nhập vào app** (email login, mật khẩu băm, token). Tách riêng giúp đảm bảo an toàn bảo mật, tách biệt thông tin cá nhân khỏi thông tin xác thực.

### 3.1 Bảng `User` (Tên bảng DB: `auth_users`)
* **Mục đích:** Lưu trữ hồ sơ nhân viên trong công ty.
* **Chi tiết các trường:**
  - `id` (`String @id @default(uuid())`): Khóa chính.
  - `employeeCode` (`String? @unique`): Mã nhân viên (VD: `EMP-001`).
  - `fullName` (`String`): Họ và tên đầy đủ.
  - `email` (`String? @unique`): Email liên hệ công việc.
  - `status` (`String @default("ACTIVE")`): Trạng thái nhân sự (`ACTIVE`, `LOCKED`, `PENDING`).
  - `isActive` (`Boolean @default(true)`): Xóa mềm nhân viên.
  - `userType` (`String @default("EMPLOYEE")`): Loại người dùng (`EMPLOYEE` = Nhân viên nội bộ, `CUSTOMER` = Khách hàng, `SYSTEM_ADMIN` = Quản trị viên).
  - `employmentStatus` (`String @default("PROBATION")`): Loại hợp đồng (`PROBATION` = Thử việc, `OFFICIAL` = Chính thức, `RESIGNED` = Đã thôi việc).
  - **3 Khóa ngoại liên kết cơ cấu tổ chức:**
    - `storeId` (`Store?`): Thuộc cửa hàng/chi nhánh nào.
    - `departmentId` (`Department?`): Thuộc phòng ban nào.
    - `positionId` (`Position?`): Giữ chức danh gì.

### 3.2 Bảng `UserAccount` (Tên bảng DB: `auth_user_accounts`)
* **Mục đích:** Xử lý xác thực đăng nhập, mã hóa mật khẩu và token.
* **Quan hệ:** **1-to-1** duy nhất với bảng `User` (`userId @unique`).
* **Chi tiết các trường:**
  - `userId` (`String @unique`): Liên kết sang `User.id` (Xóa cascade theo User).
  - `loginEmail` (`String @unique`): Tên đăng nhập (Email).
  - `passwordHash` (`String`): Mật khẩu đã được băm an toàn bằng thuật toán `bcrypt` (10 rounds).
  - `failedLoginCount` (`Int @default(0)`): Bộ đếm số lần gõ sai mật khẩu liên tiếp.
  - `isLocked` (`Boolean @default(false)`): Khóa tài khoản khi `failedLoginCount >= 5` để chống brute-force.
  - `refreshToken` (`String?`): Lưu chuỗi Refresh Token để cấp lại Access Token khi hết hạn 15 phút.
  - `refreshTokenExpiresAt` (`DateTime?`): Thời hạn sống của Refresh Token (7 ngày).
  - `lastLoginAt` (`DateTime?`): Dấu vết thời gian đăng nhập lần cuối.

---

## 🔑 4. NHÓM PHÂN QUYỀN THEO VAI TRÒ (RBAC MODULE)

> **Mô hình RBAC (Role-Based Access Control) hoạt động như thế nào?**
> 1. Định nghĩa các **Permission** (Quyền hạn nguyên tử nhỏ nhất: Xem, Thêm, Sửa, Xóa).
> 2. Đóng gói nhiều Permission vào một **Role** (Vai trò / Chức vụ phần mềm: Admin, Quản lý, Học viên).
> 3. Gán Role đó cho **User**.

```
    [ User: Nguyễn Văn A ]
               │
               ▼ (gán Role)
    [ Role: STORE_MANAGER ]
               │
               ├──> Permission 1: USER.READ   (Xem nhân viên)
               ├──> Permission 2: USER.CREATE (Tạo nhân viên)
               └──> Permission 3: ATTP.VIEW   (Xem chứng chỉ ATTP)
```

### 4.1 Bảng `Permission` (Tên bảng DB: `auth_permissions`)
* **Mục đích:** Viên gạch nhỏ nhất định nghĩa một hành động được phép trong hệ thống.
* **Chi tiết các trường:**
  - `id` (`String @id @default(uuid())`): Khóa chính UUID.
  - `permissionCode` (`String @unique`): Mã quyền viết hoa dạng `<RESOURCE>.<ACTION>` (VD: `USER.READ`, `USER.CREATE`, `ROLE.MANAGE`, `COURSE.READ`, `COURSE.CREATE`, `ATTP.VIEW`).
  - `permissionName` (`String`): Tên quyền tiếng Việt (VD: `"Xem thông tin nhân sự"`).
  - `module` (`String`): Phân hệ chức năng (`HRM`, `SYSTEM`, `LMS`, `ATTP`).
  - `action` (`String`): Hành động (`READ`, `CREATE`, `UPDATE`, `MANAGE`).
  - `resource` (`String`): Đối tượng (`USER`, `ROLE`, `COURSE`, `DEPARTMENT`).
  - `isActive` (`Boolean @default(true)`): Trạng thái hoạt động của quyền.

### 4.2 Bảng `Role` (Tên bảng DB: `auth_roles`)
* **Mục đích:** Đại diện cho một vai trò/chức vụ phần mềm (Chùm chìa khóa chứa nhiều quyền).
* **Chi tiết các trường:**
  - `id` (`String @id @default(uuid())`): Khóa chính UUID.
  - `roleName` (`String @unique`): Mã vai trò viết hoa (VD: `ADMIN`, `STUDENT`, `STORE_MANAGER`).
  - `displayName` (`String`): Tên hiển thị (VD: `"Quản trị viên Hệ thống"`, `"Quản lý Cửa hàng"`).
  - `isSystemRole` (`Boolean @default(false)`): Nếu là `true` (như role `ADMIN`), hệ thống **cấm xóa**, bảo vệ app khỏi sập.
  - `bypassDataScope` (`Boolean @default(false)`): Cờ Super Admin (bỏ qua phạm vi chi nhánh, xem toàn bộ hệ thống).
  - `isActive` (`Boolean @default(true)`): Xóa mềm vai trò.

---

## 🔗 5. CÁC BẢNG TRUNG GIAN (JUNCTION TABLES)

Do mối quan hệ giữa **User ↔ Role** là **Nhiều - Nhiều** và **Role ↔ Permission** là **Nhiều - Nhiều**, Prisma sử dụng 2 bảng trung gian:

### 5.1 Bảng `UserRole` (Tên bảng DB: `auth_user_roles`)
* **Mục đích:** Cầu nối liên kết: *User này đang nắm giữ những Role nào?*
* **Chi tiết các trường:**
  - `userId` (`String`): ID của User.
  - `roleId` (`String`): ID của Role.
  - `assignedAt` (`DateTime @default(now())`): Thời điểm được gán vai trò.
  - `expiresAt` (`DateTime?`): Thời điểm hết hạn vai trò (Phù hợp trao quyền tạm thời).
  - `revokedAt` (`DateTime?`): Thời điểm bị thu hồi vai trò (nếu bị kỷ luật).
  - `isActive` (`Boolean @default(true)`): Trạng thái bật/tắt vai trò của user.

### 5.2 Bảng `RolePermission` (Tên bảng DB: `auth_role_permissions`)
* **Mục đích:** Cầu nối liên kết: *Role này chứa những Permission nào?*
* **Chi tiết các trường:**
  - `roleId` (`String`): ID của Role.
  - `permissionId` (`String`): ID của Permission.
  - `assignedAt` (`DateTime @default(now())`): Thời điểm gán quyền vào vai trò.
  - `@@unique([roleId, permissionId])`: Khóa phức hợp bảo đảm không thể gán trùng 1 permission vào 1 role 2 lần.

---

## ⚡ 6. LUỒNG TRUY VẤN DỮ LIỆU THỰC TẾ TRONG CODE

Khi nhân viên đăng nhập, hàm `getUserPermissions(userId)` trong [backend/src/services/permission.service.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/services/permission.service.ts) thực hiện tra cứu theo dây chuyền:

```
1. Tra cứu `auth_user_roles`
   -> Lấy danh sách roleId đang Active của User (chưa hết hạn expiresAt, chưa bị revokedAt).

2. Tra cứu `auth_roles`
   -> Đảm bảo các Role đó có `isActive: true`.

3. Tra cứu `auth_role_permissions` kết hợp `auth_permissions`
   -> Lấy toàn bộ các permissionCode có `isActive: true`.

4. Lưu kết quả vào In-Memory Cache (RAM) trong 10 phút.
   -> Trả về Set mã quyền: ['USER.READ', 'USER.CREATE', 'ROLE.MANAGE', ...]
```

---

## 📚 TÀI LIỆU LIÊN QUAN TRONG DỰ ÁN

- [doc/07-workflow/Auth_and_RBAC_Workflow.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/07-workflow/Auth_and_RBAC_Workflow.md) — Sơ đồ Sequence và luồng code Login/RBAC.
- [doc/03-tech-stack/Cookies_vs_LocalStorage_Auth_Handbook.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/03-tech-stack/Cookies_vs_LocalStorage_Auth_Handbook.md) — Cẩm nang Cookies vs LocalStorage & Middleware.
- [doc/04-tracking-sprints/Sprint1_LMS_BaHung/Checklist_11-8-2026.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/Sprint1_LMS_BaHung/Checklist_11-8-2026.md) — Checklist tiến độ Sprint 1.
