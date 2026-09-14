export const userSwagger = {
  tags: [
    { name: 'Users', description: 'Quản lý Người dùng & Nhân sự' },
  ],
  schemas: {
    CreateUserRequest: {
      type: 'object',
      required: ['fullName', 'email', 'password'],
      properties: {
        fullName: { type: 'string', example: 'Nguyễn Văn A' },
        email: { type: 'string', format: 'email', example: 'nguyenvana@bahung.com' },
        password: { type: 'string', example: 'password123' },
        employeeCode: { type: 'string', example: 'BH-NV-005' },
        departmentId: { type: 'string', nullable: true },
        positionId: { type: 'string', nullable: true },
        userType: { type: 'string', enum: ['EMPLOYEE', 'CUSTOMER', 'SYSTEM_ADMIN'], example: 'EMPLOYEE' },
        employmentStatus: { type: 'string', enum: ['PROBATION', 'OFFICIAL', 'TEMPORARY', 'RESIGNED'], example: 'OFFICIAL' },
      },
    },
  },
  paths: {
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Lấy danh sách người dùng / nhân sự',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Danh sách người dùng kèm phòng ban & vai trò' } },
      },
      post: {
        tags: ['Users'],
        summary: 'Tạo tài khoản người dùng mới',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateUserRequest' } } },
        },
        responses: { 201: { description: 'Tạo người dùng thành công' } },
      },
    },
  },
}
