export const jobLevelSwagger = {
  tags: [
    { name: 'Job Levels', description: 'Quản lý Cấp bậc / Chức danh chuyên môn' },
  ],
  schemas: {
    CreateJobLevelRequest: {
      type: 'object',
      required: ['code', 'name', 'levelRank'],
      properties: {
        code: { type: 'string', example: 'LV-03' },
        name: { type: 'string', example: 'Senior Staff' },
        levelRank: { type: 'integer', example: 3 },
        description: { type: 'string', example: 'Cấp bậc nhân viên có thâm niên' },
      },
    },
    UpdateJobLevelRequest: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Senior Staff V2' },
        levelRank: { type: 'integer', example: 4 },
        description: { type: 'string', example: 'Cập nhật cấp bậc' },
      },
    },
  },
  paths: {
    '/api/job-levels': {
      get: {
        tags: ['Job Levels'],
        summary: 'Lấy danh sách các cấp bậc chuyên môn',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Danh sách cấp bậc' } },
      },
      post: {
        tags: ['Job Levels'],
        summary: 'Tạo cấp bậc mới',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateJobLevelRequest' } } },
        },
        responses: { 201: { description: 'Tạo cấp bậc thành công' } },
      },
    },
    '/api/job-levels/{id}': {
      put: {
        tags: ['Job Levels'],
        summary: 'Cập nhật cấp bậc',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateJobLevelRequest' } } },
        },
        responses: { 200: { description: 'Cập nhật thành công' } },
      },
      delete: {
        tags: ['Job Levels'],
        summary: 'Xóa mềm cấp bậc (Soft Delete)',
        security: [{ BearerAuth: [] }],
        description: 'Đánh dấu isActive = false, ẩn cấp bậc khỏi danh sách Frontend mà không xóa mất thông tin của nhân viên.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Xóa mềm cấp bậc thành công' }, 404: { description: 'Không tìm thấy cấp bậc' } },
      },
    },
  },
}
