# 📘 HƯỚNG DẪN TÍCH HỢP & CẤU HÌNH SWAGGER (OPENAPI 3.0) — LOGIX BACKEND

> **Dự án:** LogiX LMS & ERP-v2 RBAC  
> **Kiến trúc:** Modular OpenAPI 3.0 Architecture (Tách file tài liệu theo từng Feature Module)  
> **Tài liệu vị trí:** `Practice/LogiX/doc/03-tech-stack/Swagger_OpenAPI_Config_Guide.md`  
> **Cổng truy cập tài liệu API:** `http://localhost:5000/api-docs` (Hoặc `http://localhost:5000` tự động redirect)

---

## 1. TỔNG QUAN VÀ LỢI ÍCH CỦA KIẾN TRÚC MODULAR SWAGGER

Swagger/OpenAPI trong dự án LogiX được thiết kế theo mô hình **Modular Architecture (Mô-đun hóa)**:
- **Không nhồi nhét tất cả API vào 1 file khổng lồ:** Mỗi module chức năng trong `backend/src/modules/` tự quản lý file `*.swagger.ts` của riêng mình.
- **Dễ bảo trì & cộng tác nhóm:** Khi lập trình viên phát triển module nào (ví dụ: Auth, Roles, Courses), họ chỉ cần cập nhật file Swagger nằm ngay trong thư mục đó mà không gây xung đột (Git merge conflicts) với người khác.
- **Interactive Testing & JWT Bearer Auth:** Nút **Authorize 🔓** hỗ trợ xác thực JWT token nhanh chóng để test trực tiếp API trên trình duyệt.

---

## 2. CẤU TRÚC THƯ MỤC MODULAR SWAGGER

```
backend/src/
├── config/
│   ├── prisma.ts
│   └── swagger.ts                    <-- [GỐC] Gom hợp nhất tất cả module swaggers & mount route
└── modules/
    ├── auth/
    │   ├── auth.controller.ts
    │   ├── auth.routes.ts
    │   ├── auth.dto.ts
    │   └── auth.swagger.ts           <-- [MODULAR] Quản lý Tag, Schemas & Paths của Auth
    ├── roles/
    │   └── role.swagger.ts           <-- [MODULAR] Quản lý Tag, Schemas & Paths của Roles
    ├── permissions/
    │   └── permission.swagger.ts     <-- [MODULAR] Quản lý Permissions
    ├── departments/
    │   └── department.swagger.ts     <-- [MODULAR] Quản lý Departments
    ├── users/
    │   └── user.swagger.ts           <-- [MODULAR] Quản lý Users
    ├── job-levels/
    │   └── job-level.swagger.ts      <-- [MODULAR] Quản lý Job Levels
    ├── custom-fields/
    │   └── custom-field.swagger.ts   <-- [MODULAR] Quản lý Custom Fields
    ├── courses/
    │   └── course.swagger.ts         <-- [MODULAR] Quản lý Courses
    ├── lessons/
    │   └── lesson.swagger.ts         <-- [MODULAR] Quản lý Lessons
    ├── quizzes/
    │   └── quiz.swagger.ts           <-- [MODULAR] Quản lý Quizzes
    └── progress/
        └── progress.swagger.ts       <-- [MODULAR] Quản lý Progress
```

---

## 3. CÁCH XÂY DỰNG FILE SWAGGER CHO MỘT MODULE

Mỗi file `*.swagger.ts` đại diện cho một module và export một object chuẩn gồm 3 thành phần: `tags`, `schemas`, và `paths`.

### Ví dụ: `src/modules/auth/auth.swagger.ts`

```typescript
export const authSwagger = {
  // 1. Danh mục Tag phân nhóm
  tags: [
    { name: 'Auth', description: 'Xác thực, Đăng nhập, Token JWT & Tài khoản' },
  ],

  // 2. Định nghĩa các DTO Schemas (Request/Response Model)
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

  // 3. Danh sách các Endpoints chi tiết
  paths: {
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng nhập hệ thống (Email + Password)',
        description: 'Xác thực tài khoản người dùng, trả về Access Token, Refresh Token...',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: {
          200: { description: 'Đăng nhập thành công' },
          400: { description: 'Sai mật khẩu hoặc dữ liệu không hợp lệ' },
          403: { description: 'Tài khoản bị khóa do đăng nhập sai quá 5 lần' },
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
  },
}
```

---

## 4. TỔNG HỢP VÀ ĐĂNG KÝ TẠI `src/config/swagger.ts`

File `src/config/swagger.ts` chỉ cần import các module swagger và spread (`...`) vào object cấu hình chung:

```typescript
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

export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'LogiX LMS & ERP Backend API',
    version: '1.0.0',
    description: 'Tài liệu REST API hệ thống LogiX LMS & HRM',
  },
  servers: [{ url: 'http://localhost:5000', description: 'Local Development Server' }],
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
      ApiResponse: { /* schema chung */ },
      ApiError: { /* schema chung */ },
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
    '/api/health': { /* endpoint health check */ },
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
  },
}

export const setupSwagger = (app: Express): void => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'LogiX LMS API Documentation',
    })
  )

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerDocument)
  })
}
```

---

## 5. HƯỚNG DẪN THÊM MODULE MỚI TRONG TƯƠNG LAI

Khi bắt đầu tạo một tính năng / module mới (ví dụ: `notifications`):
1. Tạo file `src/modules/notifications/notification.swagger.ts`.
2. Định nghĩa `notificationSwagger = { tags: [...], schemas: {...}, paths: {...} }`.
3. Mở `src/config/swagger.ts`, import `notificationSwagger` và thêm vào `tags`, `schemas`, `paths`.
4. Giao diện Swagger UI sẽ tự động cập nhật ngay lập tức mà không cần khởi động lại server.
