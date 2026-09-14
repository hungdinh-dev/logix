export const departmentSwagger = {
  tags: [
    { name: 'Departments', description: 'Quản lý Phòng ban & Cây sơ đồ tổ chức' },
  ],
  schemas: {
    CreateDepartmentRequest: {
      type: 'object',
      required: ['code', 'name'],
      properties: {
        code: { type: 'string', example: 'FNB-DEV' },
        name: { type: 'string', example: 'Phòng Phát triển F&B' },
        parentId: { type: 'string', nullable: true, example: null },
        orderIndex: { type: 'integer', example: 1 },
        description: { type: 'string', example: 'Bộ phận nghiên cứu và phát triển sản phẩm F&B' },
      },
    },
    UpdateDepartmentRequest: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Phòng Phát triển Thực đơn & Đồ uống' },
        parentId: { type: 'string', nullable: true },
        orderIndex: { type: 'integer', example: 2 },
        description: { type: 'string', example: 'Cập nhật mô tả' },
      },
    },
  },
  paths: {
    '/api/departments': {
      get: {
        tags: ['Departments'],
        summary: 'Lấy danh sách phòng ban (Phẳng)',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Danh sách phòng ban' } },
      },
      post: {
        tags: ['Departments'],
        summary: 'Tạo phòng ban mới',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateDepartmentRequest' } } },
        },
        responses: { 201: { description: 'Tạo phòng ban thành công' } },
      },
    },
    '/api/departments/tree': {
      get: {
        tags: ['Departments'],
        summary: 'Lấy cây sơ đồ tổ chức phòng ban (Org Chart Tree)',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Cấu trúc lồng nhau cha-con của phòng ban' } },
      },
    },
    '/api/departments/{id}': {
      put: {
        tags: ['Departments'],
        summary: 'Cập nhật thông tin phòng ban',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateDepartmentRequest' } } },
        },
        responses: { 200: { description: 'Cập nhật thành công' } },
      },
      delete: {
        tags: ['Departments'],
        summary: 'Xóa mềm phòng ban (Soft Delete)',
        security: [{ BearerAuth: [] }],
        description: 'Đánh dấu isActive = false, ẩn phòng ban khỏi giao diện Frontend mà vẫn bảo lưu dữ liệu nhân viên.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Xóa mềm phòng ban thành công' }, 404: { description: 'Không tìm thấy phòng ban' } },
      },
    },
    '/api/departments/{departmentId}/members': {
      get: {
        tags: ['Departments'],
        summary: 'Lấy danh sách nhân sự thuộc phòng ban',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'departmentId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Danh sách nhân viên' } },
      },
    },
  },
}
