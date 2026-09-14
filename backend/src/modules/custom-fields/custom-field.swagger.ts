export const customFieldSwagger = {
  tags: [
    { name: 'Custom Fields', description: 'Trường dữ liệu động mở rộng' },
  ],
  schemas: {},
  paths: {
    '/api/custom-field-definitions': {
      get: {
        tags: ['Custom Fields'],
        summary: 'Lấy định nghĩa các trường dữ liệu tùy biến',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Danh sách định nghĩa trường tùy biến' } },
      },
    },
  },
}
