export const authSwagger = {
  tags: [
    { name: 'Auth', description: 'Xác thực, Đăng nhập, Token JWT & Tài khoản' },
  ],
  schemas: {
    LoginRequest: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email', example: 'admin@bahung.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
    RefreshTokenRequest: {
      type: 'object',
      required: ['refreshToken'],
      properties: {
        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...' },
      },
    },
  },
  paths: {
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng nhập hệ thống (Email + Password)',
        description: 'Xác thực tài khoản người dùng, trả về Access Token, Refresh Token, thông tin User và danh sách Permissions.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: {
          200: { description: 'Đăng nhập thành công' },
          400: { description: 'Sai mật khẩu hoặc dữ liệu không hợp lệ' },
          403: { description: 'Tài khoản bị khóa do đăng nhập sai quá 5 lần' },
          404: { description: 'Tài khoản không tồn tại' },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Làm mới Access Token',
        description: 'Sử dụng refreshToken để lấy lại accessToken mới khi token cũ hết hạn.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RefreshTokenRequest' } } },
        },
        responses: {
          200: { description: 'Cấp mới accessToken thành công' },
          401: { description: 'RefreshToken không hợp lệ hoặc đã hết hạn' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Lấy thông tin người dùng hiện tại (Profile)',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Lấy profile thành công' },
          401: { description: 'Chưa đăng nhập hoặc Token không hợp lệ' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng xuất khỏi hệ thống',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Đăng xuất thành công, đã hủy refreshToken' },
          401: { description: 'Chưa đăng nhập' },
        },
      },
    },
  },
}
