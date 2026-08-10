# 🎨 PHÂN TÍCH MODULE "TỔ CHỨC & PHÂN QUYỀN" — FRONTEND (FE)

> **Dự án tham chiếu:** `erp-corporation-fe-v2` (React + TypeScript + Vite + TailwindCSS + Shadcn UI)  
> **Phạm vi phân tích:** Giao diện Quản trị Cơ cấu Tổ chức và Ma trận Phân quyền (Admin Feature)  
> **Đường dẫn lưu:** `doc/module/FE_Organization_Permission_Analysis.md`

---

## 1. TỔNG QUAN MODULE FRONTEND

Module Frontend **Tổ chức & Phân quyền** nằm trong thư mục `src/features/admin` của dự án `erp-corporation-fe-v2`, cung cấp giao diện quản trị trực quan, hiện đại cho Quản trị viên (Admin).

### Cấu trúc Thư mục Module Admin FE:
```text
src/features/admin/
├── components/
│   ├── RolesPage/          # Tabs, Table, Dialogs, Matrix Sheet phân quyền
│   ├── DepartmentsPage/    # Sơ đồ Cây Tổ chức Org Tree & Danh sách Phòng ban
│   ├── JobLevelsPage/      # Quản lý Cấp bậc công việc
│   ├── EmployeesPage/      # Quản lý Nhân sự & Gán tài khoản
│   └── RoleHierarchyPage/  # Sơ đồ Phân cấp thứ bậc Vai trò
├── pages/
│   ├── RolesPage.tsx
│   ├── PermissionsPage.tsx
│   ├── RoleHierarchyPage.tsx
│   ├── DepartmentsPage.tsx
│   ├── JobLevelsPage.tsx
│   └── EmployeesPage.tsx
├── services/
│   ├── roles.service.ts
│   ├── permissions.service.ts
│   ├── departments.service.ts
│   ├── job-levels.service.ts
│   └── users.service.ts
└── schemas/                # Zod Form Validation Schemas
```

---

## 2. PHÂN TÍCH CHI TIẾT 4 CỤM CHỨC NĂNG NỔI BẬT

### 2.1. Cụm 1: Quản lý Vai Trò & Ma Trận Phân Quyền (`RolesPage`)

Cụm giao diện phức tạp và giàu tính năng nhất trong Admin Module:

1. **`RolesTable.tsx` & `SortableRoleRow.tsx`**:
   * Hiển thị danh sách Vai trò (`RoleName`, `DisplayName`, Số lượng thành viên được gán).
   * Tích hợp `@dnd-kit` cho phép kéo thả sắp xếp thứ tự ưu tiên của các Vai trò.
   * Các nút thao tác nhanh: **Phân quyền (Permissions)**, **Gán nhân sự (Assign Users)**, **Sửa**, **Xóa**.

2. **Ma Trận Phân Quyền Hạt Mịn (`PermissionsSheet.tsx`)**:
   * Dạng Slide-over Drawer bên phải màn hình.
   * Hiển thị bảng Ma trận giao thoa giữa **Module** (HRM, LMS, Payroll, System...) và **Hành động (Action)** (Create, Read, Update, Delete, Approve, Export...).
   * Hỗ trợ Checkbox thông minh: Toggle chọn nhanh toàn bộ Action của 1 Module hoặc chọn từng quyền riêng lẻ.

3. **Gán Nhân Sự Vào Vai Trò (`AssignUsersSheet.tsx`)**:
   * Drawer cho phép chọn danh sách Nhân sự để gán vào Vai trò.
   * Có ô chọn **Ngày hết hạn vai trò (`expiresAt`)** để quản lý các quyền tạm thời.

4. **Sơ Đồ Thứ Bậc Vai Trò (`RoleHierarchyPage.tsx`)**:
   * Giao diện trực quan mô tả thứ bậc vai trò từ cao xuống thấp (VD: Admin $\rightarrow$ Manager $\rightarrow$ Leader $\rightarrow$ Staff).

---

### 2.2. Cụm 2: Quản lý Cơ cấu Tổ chức & Phòng Ban (`DepartmentsPage`)

Tích hợp **2 chế độ xem linh hoạt (View Switcher)**:

1. **Chế độ Bảng danh sách (`DeptListView`)**:
   * Bảng danh sách các Phòng ban kèm thông tin Trưởng phòng (`Manager`), Phòng ban cấp trên (`Parent Department`), số lượng nhân sự.
2. **Chế độ Sơ đồ Cây Tổ chức (`OrgHierarchyView`)**:
   * Hiển thị cây cơ cấu tổ chức doanh nghiệp dạng sơ đồ nhánh trực quan (Tree Chart).
3. **Form Thêm/Sửa Phòng Ban (`DepartmentDialog.tsx`)**:
   * Dialog form với các trường: Tên phòng ban, Mã phòng ban, Select chọn Phòng ban cha (`parentId`) và Select chọn Trưởng phòng (`managerId`).

---

### 2.3. Cụm 3: Quản lý Cấp Bậc Công Việc (`JobLevelsPage`)

* Quản lý danh mục Cấp bậc (VD: Level 1 - Junior, Level 2 - Senior, Level 3 - Lead, Level 4 - Manager, Level 5 - Director).
* Định hình khung năng lực và phân cấp nhân sự trong toàn hệ thống.

---

### 2.4. Cụm 4: Quản lý Nhân Sự & Tài Khoản (`EmployeesPage`)

* Danh sách nhân viên toàn công ty.
* Bộ lọc đa chiều: Lọc theo Phòng ban, Lọc theo Cấp bậc, Lọc theo Trạng thái làm việc (`Active`, `Probation`, `Inactive`).
* Nút thao tác nhanh: Cấp tài khoản đăng nhập, Khóa tài khoản, Gán vai trò.

---

## 3. STATE MANAGEMENT & DỊCH VỤ GỌI API (SERVICES LAYER)

* **Axios Interceptor**: Cấu hình tự động đính kèm Token xác thực:
  ```typescript
  // Authorization: Bearer <AccessToken>
  ```
  Tự động xử lý khi Token hết hạn (HTTP 401) để Refresh Token hoặc điều hướng về `/login`.
* **Services Layer**: Các file service (`roles.service.ts`, `departments.service.ts`...) đóng gói hàm gọi API vô cùng gọn gàng:
  ```typescript
  export const rolesService = {
    getAll: () => api.get<Role[]>('/api/roles'),
    updatePermissions: (roleId: string, permissionIds: string[]) => 
      api.put(`/api/roles/${roleId}/permissions`, { permissionIds }),
    assignUsers: (roleId: string, data: AssignUsersPayload) => 
      api.post(`/api/roles/${roleId}/assign`, data),
  };
  ```
* **Form Validation**: Sử dụng `react-hook-form` kết hợp `zod` schema giúp validate dữ liệu ngay tại Client trước khi gửi API.

---

## 4. KHẢ NĂNG TÁI SỬ DỤNG CHO DỰ ÁN LOGIX FRONTEND

1. **Tái sử dụng Component Ma Trận Phân Quyền (`PermissionsSheet`)**: Đây là UI pattern cực kỳ đáng giá, có thể bê nguyên sang dự án LogiX để phân quyền cho Giảng viên, Học viên, Admin LMS.
2. **Tái sử dụng Tree Hierarchy View (`OrgHierarchyView`)**: Áp dụng tốt cho cả việc hiển thị Cơ cấu phòng ban lẫn Danh mục khóa học nhiều cấp (Category Tree) trong LogiX.
3. **Kiến trúc Feature-driven Modular**: Tổ chức mã nguồn theo từng Feature độc lập (`features/admin`, `features/lms`, `features/auth`) giúp dự án LogiX dễ mở rộng và bảo trì.
