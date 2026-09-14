export const roleSwagger = {
  tags: [
    { name: 'Roles', description: 'Quản lý Vai trò & Phân quyền RBAC cho vai trò' },
  ],
  schemas: {
    CreateRoleRequest: {
      type: 'object',
      required: ['code', 'name'],
      properties: {
        code: { type: 'string', example: 'BRANCH_MANAGER' },
        name: { type: 'string', example: 'Quản lý chi nhánh' },
        description: { type: 'string', example: 'Quản lý toàn bộ hoạt động của chi nhánh' },
        isSystem: { type: 'boolean', example: false },
      },
    },
    UpdateRoleRequest: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Quản lý chi nhánh Cấp cao' },
        description: { type: 'string', example: 'Cập nhật mô tả vai trò' },
      },
    },
    AssignPermissionsRequest: {
      type: 'object',
      required: ['permissionIds'],
      properties: {
        permissionIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['perm-id-1', 'perm-id-2'],
        },
      },
    },
    SyncRoleUsersRequest: {
      type: 'object',
      required: ['userIds'],
      properties: {
        userIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['user-id-1', 'user-id-2'],
        },
      },
    },
  },
  paths: {
    '/api/roles': {
      get: {
        tags: ['Roles'],
        summary: 'Lấy danh sách tất cả các Vai trò (Roles)',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Danh sách vai trò kèm số lượng user & permissions' } },
      },
      post: {
        tags: ['Roles'],
        summary: 'Tạo vai trò mới',
        security: [{ BearerAuth: [] }],
        description: 'Yêu cầu quyền: **ROLE.MANAGE**',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateRoleRequest' } } },
        },
        responses: {
          201: { description: 'Tạo vai trò thành công' },
          400: { description: 'Mã role đã tồn tại hoặc dữ liệu lỗi' },
          403: { description: 'Không có quyền truy cập' },
        },
      },
    },
    '/api/roles/{id}': {
      get: {
        tags: ['Roles'],
        summary: 'Chi tiết một vai trò theo ID',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Chi tiết vai trò' }, 404: { description: 'Không tìm thấy vai trò' } },
      },
      put: {
        tags: ['Roles'],
        summary: 'Cập nhật thông tin vai trò',
        security: [{ BearerAuth: [] }],
        description: 'Yêu cầu quyền: **ROLE.MANAGE**',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateRoleRequest' } } },
        },
        responses: { 200: { description: 'Cập nhật thành công' } },
      },
      delete: {
        tags: ['Roles'],
        summary: 'Xóa mềm vai trò (Soft Delete)',
        security: [{ BearerAuth: [] }],
        description: 'Yêu cầu quyền: **ROLE.MANAGE**. Thực hiện xóa mềm (đánh dấu isActive = false), ẩn khỏi danh sách Frontend và tức thì thu hồi quyền hạn của user nhưng vẫn bảo lưu dữ liệu lịch sử. Không thể xóa vai trò hệ thống.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Xóa mềm vai trò thành công' },
          400: { description: 'Không thể xóa vai trò hệ thống mặc định' },
          404: { description: 'Không tìm thấy vai trò hoặc vai trò đã bị xóa' },
        },
      },
    },
    '/api/roles/{id}/permissions': {
      get: {
        tags: ['Roles'],
        summary: 'Lấy danh sách quyền được gán cho vai trò',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Danh sách permission ID' } },
      },
      put: {
        tags: ['Roles'],
        summary: 'Gán mảng quyền (Permissions) cho vai trò',
        security: [{ BearerAuth: [] }],
        description: 'Yêu cầu quyền: **ROLE.MANAGE**',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignPermissionsRequest' } } },
        },
        responses: { 200: { description: 'Phân quyền thành công' } },
      },
    },
    '/api/roles/{roleId}/users': {
      get: {
        tags: ['Roles'],
        summary: 'Lấy danh sách người dùng thuộc vai trò',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'roleId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Danh sách user' } },
      },
      put: {
        tags: ['Roles'],
        summary: 'Đồng bộ danh sách người dùng vào vai trò',
        security: [{ BearerAuth: [] }],
        description: 'Yêu cầu quyền: **ROLE.MANAGE**',
        parameters: [{ name: 'roleId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/SyncRoleUsersRequest' } } },
        },
        responses: { 200: { description: 'Đồng bộ người dùng vào vai trò thành công' } },
      },
    },
  },
}
