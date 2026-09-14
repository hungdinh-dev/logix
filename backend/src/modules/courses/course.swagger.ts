export const courseSwagger = {
  tags: [
    { name: 'Courses', description: 'Quản lý Khóa học, Danh mục & Auto-Assign Rules LMS (LMS-001 -> LMS-012)' },
  ],
  schemas: {
    CreateCategoryRequest: {
      type: 'object',
      required: ['code', 'name'],
      properties: {
        code: { type: 'string', example: 'ONBOARDING' },
        name: { type: 'string', example: 'Chương trình Hội nhập Onboarding' },
        description: { type: 'string', example: 'Khóa học bắt buộc cho nhân sự mới' },
        sortOrder: { type: 'integer', example: 1 },
      },
    },
    UpdateCategoryRequest: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Chương trình Hội nhập 2026' },
        description: { type: 'string', example: 'Cập nhật nội dung' },
        sortOrder: { type: 'integer', example: 1 },
        isActive: { type: 'boolean', example: true },
      },
    },
    CreateCourseRequest: {
      type: 'object',
      required: ['code', 'title', 'slug', 'categoryId'],
      properties: {
        code: { type: 'string', example: 'ATTP-2026' },
        title: { type: 'string', example: 'An Toàn Vệ Sinh Thực Phẩm Ba Hưng 2026' },
        slug: { type: 'string', example: 'an-toan-ve-sinh-thuc-pham-2026' },
        categoryId: { type: 'string', example: 'uuid-category' },
        description: { type: 'string', example: 'Khóa đào tạo tiêu chuẩn ATTP bắt buộc' },
        thumbnailUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d' },
        courseType: { type: 'string', enum: ['STANDARD', 'ATTP', 'ONBOARDING'], example: 'ATTP' },
        isMandatory: { type: 'boolean', example: true },
        durationDays: { type: 'integer', example: 30 },
        progressionMode: { type: 'string', enum: ['FREE', 'LINEAR_LESSON', 'LINEAR_MODULE'], example: 'LINEAR_LESSON' },
        targetPositionId: { type: 'string', example: 'uuid-position' },
        targetDepartmentId: { type: 'string', example: 'uuid-department' },
        targetStoreId: { type: 'string', example: 'uuid-store' },
        targetEmploymentStatus: { type: 'string', enum: ['PROBATION', 'OFFICIAL', 'TEMPORARY', 'ALL'], example: 'PROBATION' },
      },
    },
    UpdateCourseStatusRequest: {
      type: 'object',
      required: ['status'],
      properties: {
        status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], example: 'PUBLISHED' },
      },
    },
    AssignPositionRequest: {
      type: 'object',
      required: ['positionId'],
      properties: {
        positionId: { type: 'string', example: 'uuid-position' },
      },
    },
    AssignEmploymentStatusRequest: {
      type: 'object',
      required: ['employmentStatus'],
      properties: {
        employmentStatus: { type: 'string', enum: ['PROBATION', 'OFFICIAL', 'TEMPORARY', 'ALL'], example: 'PROBATION' },
      },
    },
    AssignStoreRequest: {
      type: 'object',
      required: ['storeId'],
      properties: {
        storeId: { type: 'string', example: 'uuid-store' },
      },
    },
    AssignDepartmentRequest: {
      type: 'object',
      required: ['departmentId'],
      properties: {
        departmentId: { type: 'string', example: 'uuid-department' },
      },
    },
  },
  paths: {
    '/api/courses/categories': {
      get: {
        tags: ['Courses'],
        summary: '[LMS-001] Lấy danh mục chương trình đào tạo',
        responses: { 200: { description: 'Danh sách danh mục kèm số khóa học' } },
      },
      post: {
        tags: ['Courses'],
        summary: '[LMS-001] Tạo danh mục chương trình đào tạo mới',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCategoryRequest' } } },
        },
        responses: { 201: { description: 'Tạo danh mục thành công' } },
      },
    },
    '/api/courses/categories/{id}': {
      get: {
        tags: ['Courses'],
        summary: '[LMS-001] Chi tiết danh mục',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Chi tiết danh mục' } },
      },
      put: {
        tags: ['Courses'],
        summary: '[LMS-001] Cập nhật danh mục đào tạo',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateCategoryRequest' } } },
        },
        responses: { 200: { description: 'Cập nhật danh mục thành công' } },
      },
      delete: {
        tags: ['Courses'],
        summary: '[LMS-001] Xóa danh mục đào tạo (Soft delete)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Xóa danh mục thành công' } },
      },
    },
    '/api/courses': {
      get: {
        tags: ['Courses'],
        summary: 'Lấy danh sách khóa học (Lọc theo Search, Danh mục, Trạng thái, Bắt buộc)',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'categoryId', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] } },
          { name: 'isMandatory', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: { 200: { description: 'Danh sách khóa học' } },
      },
      post: {
        tags: ['Courses'],
        summary: '[LMS-002, 009, 010, 011, 012] Tạo khóa học mới',
        security: [{ BearerAuth: [] }],
        description: 'Yêu cầu quyền: **COURSE.CREATE**',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCourseRequest' } } },
        },
        responses: { 201: { description: 'Tạo khóa học thành công' } },
      },
    },
    '/api/courses/{id}': {
      get: {
        tags: ['Courses'],
        summary: 'Lấy chi tiết khóa học kèm danh sách modules và bài giảng',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Chi tiết khóa học' } },
      },
      put: {
        tags: ['Courses'],
        summary: 'Cập nhật thông tin khóa học',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCourseRequest' } } },
        },
        responses: { 200: { description: 'Cập nhật khóa học thành công' } },
      },
      delete: {
        tags: ['Courses'],
        summary: 'Xóa khóa học (Soft delete)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Xóa thành công' } },
      },
    },
    '/api/courses/{id}/clone': {
      post: {
        tags: ['Courses'],
        summary: '[LMS-003] Sao chép khóa học (Clone course & modules & lessons)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 201: { description: 'Sao chép khóa học thành công' } },
      },
    },
    '/api/courses/{id}/status': {
      patch: {
        tags: ['Courses'],
        summary: '[LMS-004] Ngưng / Kích hoạt khóa học (DRAFT, PUBLISHED, ARCHIVED)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateCourseStatusRequest' } } },
        },
        responses: { 200: { description: 'Cập nhật trạng thái thành công' } },
      },
    },
    '/api/courses/{id}/assign-position': {
      post: {
        tags: ['Courses'],
        summary: '[LMS-005] Gán khóa học tự động theo Chức danh',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignPositionRequest' } } },
        },
        responses: { 200: { description: 'Gán theo chức danh thành công' } },
      },
    },
    '/api/courses/{id}/assign-employment-status': {
      post: {
        tags: ['Courses'],
        summary: '[LMS-006] Gán khóa học tự động theo Loại nhân sự (Học việc / Chính thức)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignEmploymentStatusRequest' } } },
        },
        responses: { 200: { description: 'Gán theo loại nhân sự thành công' } },
      },
    },
    '/api/courses/{id}/assign-store': {
      post: {
        tags: ['Courses'],
        summary: '[LMS-007] Gán khóa học tự động theo Cửa hàng',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignStoreRequest' } } },
        },
        responses: { 200: { description: 'Gán theo cửa hàng thành công' } },
      },
    },
    '/api/courses/{id}/assign-department': {
      post: {
        tags: ['Courses'],
        summary: '[LMS-008] Gán khóa học tự động theo Bộ phận / Khâu sản xuất',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignDepartmentRequest' } } },
        },
        responses: { 200: { description: 'Gán theo bộ phận sản xuất thành công' } },
      },
    },
    '/api/courses/{id}/enroll': {
      post: {
        tags: ['Courses'],
        summary: '[LMS-044, 011] Đăng ký tham gia khóa học',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 201: { description: 'Đăng ký khóa học thành công' } },
      },
    },
  },
}
