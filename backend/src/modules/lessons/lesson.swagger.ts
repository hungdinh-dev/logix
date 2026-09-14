export const lessonSwagger = {
  tags: [
    { name: 'Lessons', description: 'Bài giảng & Chi tiết bài học LMS' },
  ],
  schemas: {},
  paths: {
    '/api/lessons/{id}': {
      get: {
        tags: ['Lessons'],
        summary: 'Lấy chi tiết nội dung bài học theo ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Chi tiết bài học' }, 404: { description: 'Không tìm thấy' } },
      },
    },
  },
}
