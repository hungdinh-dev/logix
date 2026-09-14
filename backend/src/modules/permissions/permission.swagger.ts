export const permissionSwagger = {
  tags: [
    { name: 'Permissions', description: 'Danh mục Quyền hệ thống' },
  ],
  schemas: {},
  paths: {
    '/api/permissions': {
      get: {
        tags: ['Permissions'],
        summary: 'Lấy toàn bộ danh mục Quyền hạn hệ thống',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Danh sách tất cả các permission' } },
      },
    },
  },
}
