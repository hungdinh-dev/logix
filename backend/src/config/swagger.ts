import { Express } from 'express'
import swaggerUi from 'swagger-ui-express'

import { authSwagger } from '../modules/auth/auth.swagger'
import { roleSwagger } from '../modules/roles/role.swagger'
import { permissionSwagger } from '../modules/permissions/permission.swagger'
import { departmentSwagger } from '../modules/departments/department.swagger'
import { userSwagger } from '../modules/users/user.swagger'
import { jobLevelSwagger } from '../modules/job-levels/job-level.swagger'
import { customFieldSwagger } from '../modules/custom-fields/custom-field.swagger'
import { courseSwagger } from '../modules/courses/course.swagger'
import { lessonSwagger } from '../modules/lessons/lesson.swagger'
import { quizSwagger } from '../modules/quizzes/quiz.swagger'
import { progressSwagger } from '../modules/progress/progress.swagger'
import { certificateSwagger } from '../modules/certificates/certificate.swagger'

export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'LogiX LMS & ERP Backend API',
    version: '1.0.0',
    description: `### Tài liệu REST API hệ thống LogiX LMS & HRM
Hệ thống API quản lý đào tạo trực tuyến (LMS) tích hợp chuẩn phân quyền RBAC tương thích 1-1 với ERP-v2.

#### Cách xác thực (Authentication):
1. Gọi API **POST /api/auth/login** với tài khoản (ví dụ: \`admin@bahung.com\` / \`password123\`).
2. Copy chuỗi \`accessToken\` từ kết quả trả về.
3. Click nút **Authorize 🔓** phía trên bên phải, dán token vào ô value và bấm **Authorize**.
4. Toàn bộ các API yêu cầu quyền hạn sẽ tự động gửi kèm Bearer Token khi test.`,
    contact: {
      name: 'LogiX LMS Development Team',
      email: 'dev@logix.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  tags: [
    ...authSwagger.tags,
    ...roleSwagger.tags,
    ...permissionSwagger.tags,
    ...departmentSwagger.tags,
    ...userSwagger.tags,
    ...jobLevelSwagger.tags,
    ...customFieldSwagger.tags,
    ...courseSwagger.tags,
    ...lessonSwagger.tags,
    ...quizSwagger.tags,
    ...progressSwagger.tags,
    ...certificateSwagger.tags,
    { name: 'System', description: 'Kiểm tra trạng thái & Sức khỏe hệ thống' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Nhập JWT token theo định dạng: Bearer <access_token>',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
          message: { type: 'string', example: 'Thao tác thành công' },
        },
      },
      ApiError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string', example: 'Dữ liệu đầu vào không hợp lệ' },
              details: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
      ...authSwagger.schemas,
      ...roleSwagger.schemas,
      ...departmentSwagger.schemas,
      ...userSwagger.schemas,
      ...jobLevelSwagger.schemas,
      ...courseSwagger.schemas,
      ...progressSwagger.schemas,
    },
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['System'],
        summary: 'Kiểm tra trạng thái máy chủ (Health Check)',
        description: 'Endpoint kiểm tra nhanh máy chủ backend có đang hoạt động hay không.',
        responses: {
          200: {
            description: 'Server hoạt động bình thường',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } },
          },
        },
      },
    },
    ...authSwagger.paths,
    ...roleSwagger.paths,
    ...permissionSwagger.paths,
    ...departmentSwagger.paths,
    ...userSwagger.paths,
    ...jobLevelSwagger.paths,
    ...customFieldSwagger.paths,
    ...courseSwagger.paths,
    ...lessonSwagger.paths,
    ...quizSwagger.paths,
    ...progressSwagger.paths,
    ...certificateSwagger.paths,
  },
}

export const setupSwagger = (app: Express): void => {
  // Swagger UI route
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'LogiX LMS API Documentation',
    })
  )

  // Serve raw JSON spec for tooling or external viewers
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerDocument)
  })
}
