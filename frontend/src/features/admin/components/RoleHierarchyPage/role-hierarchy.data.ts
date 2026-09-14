import type { RoleNode } from '../../types/admin.types'

// ponytail: mock tree — replace with rolesService.hierarchy() once BE endpoint exists
export const ROLE_TREE: RoleNode = {
  id: 'super-admin',
  roleName: 'SUPER_ADMIN',
  displayName: 'Super Administrator',
  description: 'Toàn quyền hệ thống. Quản lý tất cả tài nguyên, người dùng và cấu hình.',
  isSystemRole: true,
  permissionCount: 48,
  permissions: [],
  children: [
    {
      id: 'hr-admin',
      roleName: 'HR_ADMIN',
      displayName: 'HR Administrator',
      description: 'Quản lý nhân sự, bảng lương, chấm công và cấu trúc tổ chức.',
      isSystemRole: true,
      permissionCount: 24,
      permissions: [],
      children: [
        {
          id: 'employee',
          roleName: 'EMPLOYEE',
          displayName: 'Employee',
          description: 'Nhân viên nội bộ. Xem thông tin cá nhân, bảng lương và khóa học.',
          isSystemRole: true,
          permissionCount: 8,
          permissions: [],
          children: [],
        },
      ],
    },
    {
      id: 'customer',
      roleName: 'CUSTOMER',
      displayName: 'Customer',
      description: 'Khách hàng bên ngoài. Truy cập cổng mua hàng và theo dõi đơn hàng.',
      isSystemRole: false,
      permissionCount: 4,
      permissions: [],
      children: [],
    },
  ],
}

export const DEFAULT_EXPANDED_ROLE_IDS = new Set(['super-admin', 'hr-admin'])
