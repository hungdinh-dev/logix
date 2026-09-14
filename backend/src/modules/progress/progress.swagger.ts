export const progressSwagger = {
  tags: [
    { name: 'Progress', description: 'Tiến độ học tập & Thống kê Dashboard' },
  ],
  schemas: {
    UpdateLessonProgressRequest: {
      type: 'object',
      required: ['lessonId', 'status'],
      properties: {
        lessonId: { type: 'string', example: 'lesson-uuid-here' },
        status: { type: 'string', enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'], example: 'COMPLETED' },
        lastPositionSeconds: { type: 'integer', example: 350 },
      },
    },
  },
  paths: {
    '/api/progress/dashboard': {
      get: {
        tags: ['Progress'],
        summary: 'Lấy tổng hợp tiến độ học tập cho Dashboard học viên',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Dữ liệu thống kê tiến độ học viên' } },
      },
    },
    '/api/progress/admin-dashboard': {
      get: {
        tags: ['Progress'],
        summary: 'Lấy toàn bộ số liệu thống kê tổng hợp cho Admin Dashboard LMS',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Số liệu học viên, tiến độ, top khóa học và hoạt động gần đây' } },
      },
    },
    '/api/progress/lesson': {
      post: {
        tags: ['Progress'],
        summary: 'Cập nhật tiến độ học một bài học',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateLessonProgressRequest' } } },
        },
        responses: { 200: { description: 'Cập nhật tiến độ thành công' } },
      },
    },
  },
}
