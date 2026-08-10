# 🛠️ HƯỚNG DẪN CHI TIẾT SETUP BACKEND LOGIX (Express.js + TypeScript + Prisma + Redis)

> **Mục đích:** Tài liệu checklist & từng bước cài đặt, cấu hình Backend cho dự án **LogiX** từ đầu (Clean Slate / Refactoring), ôn tập kiến thức thuần **Node.js (Express.js)**.  
> **Tham chiếu:** [[Auth_Permission_System_Design]] · [[Database_Design_Document]] · [[List Function]]

---

## 📐 1. TỔNG QUAN TẬP THƯ VIỆN & CÔNG NGHỆ SỬ DỤNG

| Thành phần | Thu viện / Công nghệ | Mục đích |
| :--- | :--- | :--- |
| **Core Runtime** | `Node.js` (v20+) + `TypeScript` | Môi trường thực thi & kiểm soát Kiểu dữ liệu |
| **Web Framework** | `Express.js` (`^4.18`) | Framework HTTP Server nhẹ, phổ biến |
| **Development Tool** | `ts-node-dev` | Live-reload code TypeScript khi code |
| **Database ORM** | `Prisma ORM` (`^5.10`) | Quản lý Schema, Migrations, Query Type-safe |
| **Cache Store** | `Redis` (`ioredis`) | Cache tập quyền User & Session |
| **Authentication** | `jsonwebtoken` + `bcryptjs` | Sinh/Verify JWT Access Token & Hash mật khẩu |
| **Validation** | `zod` | Validate body/params/query từ HTTP Request |
| **Security & Utilities** | `cors`, `dotenv` | Xử lý CORS và nạp biến môi trường |

---

## 🧱 2. BƯỚC 1: CÀI ĐẶT PACKAGE & CẤU TRÚC THƯ MỤC

### 2.1. Lệnh cài đặt thư viện cần bổ sung
Mở terminal tại thư mục `c:\Projects\DigiFnb\Practice\LogiX\backend` và chạy các lệnh sau:

```bash
# Cài đặt các dependencies chính
pnpm add ioredis zod express-async-errors

# Cài đặt devDependencies hỗ trợ TypeScript
pnpm add -D @types/ioredis @types/express @types/node @types/cors @types/bcryptjs @types/jsonwebtoken
```

---

### 2.2. Chuẩn hóa Cấu trúc Thư mục Backend (`backend/src`)

Tạo cây thư mục theo kiến trúc phân tầng Layered Architecture rõ ràng:

```text
backend/
├── .env                         # File chứa biến môi trường
├── prisma/
│   ├── schema.prisma            # Schema định nghĩa các bảng DB
│   └── dev.db                   # SQLite database (dev)
├── src/
│   ├── config/
│   │   ├── env.ts               # Loader & Validator cho biến môi trường
│   │   ├── prisma.ts            # Export PrismaClient Singleton
│   │   └── redis.ts             # Export ioredis Client Singleton
│   ├── constants/
│   │   └── permissions.ts       # Enum / Const danh sách Mã Quyền hệ thống
│   ├── middlewares/
│   │   ├── auth.middleware.ts   # Check JWT Access Token
│   │   ├── permission.middleware.ts # Check Mã Quyền qua Redis/DB
│   │   ├── validate.middleware.ts   # Validate Request với Zod
│   │   └── error.middleware.ts      # Catch lỗi HTTP toàn cục
│   ├── services/
│   │   ├── auth.service.ts      # Logic Đăng nhập, Refresh Token, Đổi pass
│   │   ├── permission.service.ts# Logic Get & Invalidate Cache Quyền trên Redis
│   │   └── user.service.ts      # Logic Quản lý User
│   ├── controllers/
│   │   ├── auth.controller.ts   # Request Handler cho /api/auth
│   │   └── course.controller.ts # Request Handler cho /api/courses
│   ├── routes/
│   │   ├── index.ts             # Gom tất cả routes chính
│   │   ├── auth.routes.ts       # Routes xác thực
│   │   └── course.routes.ts     # Routes khóa học
│   ├── utils/
│   │   └── response.ts          # Standard JSON Response Wrapper (Success/Error)
│   ├── seed.ts                  # Script khởi tạo dữ liệu mẫu (Roles/Permissions)
│   └── index.ts                 # File chạy chính của server Express
```

---

## ⚙️ 3. BƯỚC 2: CẤU HÌNH BIẾN MÔI TRƯỜNG & SINGLETON CLIENTS

### 3.1. File `.env` (`backend/.env`)

```env
PORT=5000
NODE_ENV=development

# Database Connection (SQLite dev hoặc PostgreSQL)
DATABASE_URL="file:./dev.db"

# Redis Cache Connection
REDIS_URL="redis://localhost:6379"

# JWT Config
JWT_SECRET="logix_jwt_access_token_secret_key_2026"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_SECRET="logix_jwt_refresh_token_secret_key_2026"
REFRESH_TOKEN_EXPIRES_DAYS=7

# CORS Allowed Origin
CORS_ORIGIN="http://localhost:3000"
```

---

### 3.2. Cấu hình Prisma Singleton (`src/config/prisma.ts`)

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
```

---

### 3.3. Cấu hình Redis Client có Fallback (`src/config/redis.ts`)

```typescript
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 3) {
      console.warn('⚠️ [Redis] Không thể kết nối Redis. Hệ thống sẽ tạm thời fallback về DB query.');
      return null; // Stop retrying
    }
    return Math.min(times * 200, 2000);
  },
});

redis.on('connect', () => {
  console.log('✅ [Redis] Đã kết nối thành công!');
});

redis.on('error', (err) => {
  console.error('❌ [Redis Error]:', err.message);
});

export default redis;
```

---

## 🗄️ 4. BƯỚC 3: NÂNG CẤP SCHEMA DATABASE PHÂN QUYỀN (PRISMA)

Cập nhật `backend/prisma/schema.prisma` hỗ trợ đầy đủ thiết kế **UserAccount & RBAC Permission**:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ─── USER & AUTHENTICATION ───
model User {
  id           String          @id @default(uuid())
  employeeCode String?         @unique
  fullName     String
  email        String          @unique
  avatarUrl    String?
  status       String          @default("ACTIVE") // ACTIVE, INACTIVE, PROBATION
  isActive     Boolean         @default(true)
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt

  userAccount  UserAccount?
  userRoles    UserRole[]
  enrollments  CourseEnrollment[]
  progress     UserProgress[]
}

model UserAccount {
  id                    String    @id @default(uuid())
  userId                String    @unique
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  loginEmail            String    @unique
  passwordHash          String
  isLocked              Boolean   @default(false)
  failedLoginCount      Int       @default(0)
  refreshToken          String?
  refreshTokenExpiresAt DateTime?
  lastLoginAt           DateTime?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

// ─── RBAC PERMISSION SYSTEM ───
model Role {
  id              String           @id @default(uuid())
  roleName        String           @unique // ADMIN, INSTRUCTOR, STUDENT
  displayName     String
  description     String?
  isSystemRole    Boolean          @default(false)
  bypassDataScope Boolean          @default(false)
  isActive        Boolean          @default(true)
  createdAt       DateTime         @default(now())

  userRoles       UserRole[]
  rolePermissions RolePermission[]
}

model Permission {
  id             String           @id @default(uuid())
  permissionCode String           @unique // COURSE.READ, COURSE.CREATE, USER.MANAGE
  permissionName String
  module         String           // LMS, HRM, SYSTEM...
  action         String           // CREATE, READ, UPDATE, DELETE
  resource       String
  isActive       Boolean          @default(true)

  rolePermissions RolePermission[]
}

model UserRole {
  id         String    @id @default(uuid())
  userId     String
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  roleId     String
  role       Role      @relation(fields: [roleId], references: [id], onDelete: Cascade)
  assignedAt DateTime  @default(now())
  expiresAt  DateTime?
  revokedAt  DateTime?
  isActive   Boolean   @default(true)

  @@unique([userId, roleId])
}

model RolePermission {
  id           String     @id @default(uuid())
  roleId       String
  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permissionId String
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  assignedAt   DateTime   @default(now())

  @@unique([roleId, permissionId])
}

// ─── LMS MODULE (GIỮ NGUYÊN HOẶC MỞ RỘNG) ───
model Course {
  id          String             @id @default(uuid())
  title       String
  description String
  thumbnail   String?
  price       Float              @default(0)
  published   Boolean            @default(false)
  category    String             @default("General")
  duration    String             @default("0h")
  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt

  sections    Section[]
  enrollments CourseEnrollment[]
}

model Section {
  id        String   @id @default(uuid())
  title     String
  order     Int
  courseId  String
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons   Lesson[]
}

model Lesson {
  id        String   @id @default(uuid())
  title     String
  content   String?
  videoUrl  String?
  duration  String   @default("0:00")
  order     Int
  sectionId String
  section   Section  @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  progress  UserProgress[]
}

model CourseEnrollment {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId   String
  course     Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  enrolledAt DateTime @default(now())
  progress   Float    @default(0.0)

  @@unique([userId, courseId])
}

model UserProgress {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  lessonId    String
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  completed   Boolean  @default(false)
  completedAt DateTime @default(now())

  @@unique([userId, lessonId])
}
```

Sau khi sửa file `schema.prisma`, chạy lệnh cập nhật DB:

```bash
npx prisma migrate dev --name init_rbac_system
```

---

## 🛠️ 5. BƯỚC 4: TRIỂN KHAI MIDDLEWARES CORE

### 5.1. Authentication Middleware (`src/middlewares/auth.middleware.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Request Type của Express để có req.user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Thiếu Token xác thực' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'logix_jwt_access_token_secret_key_2026';
    const decoded = jwt.verify(token, secret) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Token không hợp lệ hoặc đã hết hạn' });
  }
};
```

---

### 5.2. Dynamic Permission Middleware (`src/middlewares/permission.middleware.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';
import { getUserPermissions } from '../services/permission.service';

export const requirePermission = (permissionCode: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: Chưa xác thực người dùng' });
      }

      // Lấy danh sách mã quyền của user (từ Redis Cache hoặc Query DB)
      const permissions = await getUserPermissions(userId);

      if (!permissions.has(permissionCode)) {
        return res.status(403).json({
          error: `Forbidden: Bạn không có quyền [${permissionCode}] để thực hiện thao tác này.`,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
```

---

### 5.3. Global Error Handling Middleware (`src/middlewares/error.middleware.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('🔥 [Unhandled Error]:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Lỗi máy chủ nội bộ (Internal Server Error)';

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
```

---

##  🌱 6. BƯỚC 5: VIẾT SCRIPT SEED DỮ LIỆU BAN ĐẦU (`src/seed.ts`)

Tạo script khởi tạo vai trò (`ADMIN`, `STUDENT`) và gán mã quyền cơ bản:

```typescript
import prisma from './config/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Đang khởi tạo dữ liệu mẫu...');

  // 1. Tạo Permissions mẫu
  const permissions = [
    { permissionCode: 'COURSE.READ', permissionName: 'Xem khóa học', module: 'LMS', action: 'READ', resource: 'Course' },
    { permissionCode: 'COURSE.CREATE', permissionName: 'Tạo khóa học mới', module: 'LMS', action: 'CREATE', resource: 'Course' },
    { permissionCode: 'USER.MANAGE', permissionName: 'Quản lý người dùng', module: 'SYSTEM', action: 'MANAGE', resource: 'User' },
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { permissionCode: p.permissionCode },
      update: {},
      create: p,
    });
  }

  // 2. Tạo Roles
  const adminRole = await prisma.role.upsert({
    where: { roleName: 'ADMIN' },
    update: {},
    create: { roleName: 'ADMIN', displayName: 'Quản trị viên Hệ thống', isSystemRole: true },
  });

  const studentRole = await prisma.role.upsert({
    where: { roleName: 'STUDENT' },
    update: {},
    create: { roleName: 'STUDENT', displayName: 'Học viên', isSystemRole: true },
  });

  // 3. Gán tất cả quyền cho Admin Role
  const allPermissions = await prisma.permission.findMany();
  for (const p of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: p.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: p.id },
    });
  }

  // 4. Tạo User Admin mẫu
  const hashedPassword = await bcrypt.hash('Admin@123456', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@logix.com' },
    update: {},
    create: {
      fullName: 'System Admin',
      email: 'admin@logix.com',
      employeeCode: 'ADM001',
      userAccount: {
        create: {
          loginEmail: 'admin@logix.com',
          passwordHash: hashedPassword,
        },
      },
    },
  });

  // Gán Role ADMIN cho Admin User
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  });

  console.log('✅ Seed dữ liệu thành công! Tài khoản Admin: admin@logix.com / Admin@123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed thất bại:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Chạy lệnh seed:
```bash
npx prisma db seed
```

---

## 📋 7. CHECKLIST LỘ TRÌNH THỰC HIỆN BACKEND

- [ ] **Bước 1**: Cài đặt gói `ioredis`, `zod`, `express-async-errors`.
- [ ] **Bước 2**: Cấu hình `.env`, `src/config/prisma.ts`, `src/config/redis.ts`.
- [ ] **Bước 3**: Cập nhật `prisma/schema.prisma` hỗ trợ `UserAccount` & `RBAC` $\rightarrow$ chạy `npx prisma migrate dev`.
- [ ] **Bước 4**: Tạo các file Middleware (`auth.middleware.ts`, `permission.middleware.ts`, `error.middleware.ts`).
- [ ] **Bước 5**: Viết `permission.service.ts` để lưu/lấy Cache từ Redis.
- [ ] **Bước 6**: Viết `auth.service.ts` xử lý băm mật khẩu `bcrypt`, sinh JWT Access & Refresh Token.
- [ ] **Bước 7**: Chạy script `seed.ts` để tạo tài khoản Admin & mã quyền ban đầu.
- [ ] **Bước 8**: Test thử API Login (`/api/auth/login`) và API protected (`/api/courses`) trên Postman / Bruno / Frontend.
