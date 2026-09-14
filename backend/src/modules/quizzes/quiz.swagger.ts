export const quizSwagger = {
  tags: [
    { name: 'Quizzes', description: 'Bài kiểm tra đánh giá & Trắc nghiệm' },
  ],
  schemas: {},
  paths: {
    '/api/quizzes': {
      get: {
        tags: ['Quizzes'],
        summary: 'Lấy danh sách bài kiểm tra trắc nghiệm',
        responses: { 200: { description: 'Danh sách quiz' } },
      },
    },
  },
}
