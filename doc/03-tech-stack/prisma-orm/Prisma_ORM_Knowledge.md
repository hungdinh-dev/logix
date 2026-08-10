# 📖 PRISMA ORM — TỔNG HỢP KIẾN THỨC TỪ A ĐẾN Z

> **Mục tiêu:** Tài liệu này tổng hợp mọi kiến thức cần biết về Prisma ORM — từ khái niệm nền tảng đến cách sử dụng thực tế trong dự án LogiX LMS.
> Tất cả ví dụ code đều lấy trực tiếp từ codebase LogiX để bạn dễ áp dụng ngay.

---

## 🧠 1. PRISMA ORM LÀ GÌ?

### 1.1. Định nghĩa
**Prisma** là một **ORM (Object-Relational Mapping)** thế hệ mới dành cho **Node.js** và **TypeScript**. Nó giúp lập trình viên tương tác với Database bằng code TypeScript thay vì viết SQL thô.

### 1.2. So sánh: Viết SQL Thô vs Dùng Prisma

| Cách tiếp cận | Ví dụ lấy User có email "admin@bahung.com" |
| :--- | :--- |
| **SQL thô** | `SELECT * FROM auth_users WHERE email = 'admin@bahung.com';` |
| **Prisma** | `prisma.user.findUnique({ where: { email: 'admin@bahung.com' } })` |

**Lợi ích của Prisma:**
- ✅ **Type-Safe 100%**: Mọi query đều có gợi ý IntelliSense từ TypeScript — sai tên trường là IDE báo lỗi ngay.
- ✅ **Auto-complete**: Bạn gõ `prisma.user.` là VSCode tự gợi ý toàn bộ phương thức (`findMany`, `create`, `update`...).
- ✅ **Migration tự động**: Khi bạn sửa `schema.prisma`, Prisma tự tạo file SQL migration để đồng bộ Database.
- ✅ **Không cần viết SQL JOIN phức tạp**: Chỉ cần dùng `include` hoặc `select` là Prisma tự JOIN bảng.

### 1.3. Prisma gồm 3 thành phần chính

| Thành phần | Chức năng | File/Lệnh liên quan |
| :--- | :--- | :--- |
| **Prisma Schema** | Khai báo cấu trúc Database (bảng, quan hệ, index) | `prisma/schema.prisma` |
| **Prisma Client** | Thư viện JavaScript để truy vấn DB trong code | `import prisma from './config/prisma'` |
| **Prisma CLI** | Công cụ dòng lệnh tạo migration, seed, studio | `npx prisma migrate dev`, `npx prisma studio` |

---

## 📄 2. PRISMA SCHEMA — BẢN THIẾT KẾ DATABASE

File `schema.prisma` nằm tại `backend/prisma/schema.prisma` — đây là **trái tim** của Prisma, nơi bạn khai báo toàn bộ cấu trúc Database.

### 2.1. Cấu trúc tổng quan file schema

```prisma
// ── 1. Kết nối Database ──────────────────────────
datasource db {
  provider  = "postgresql"           // Loại DB: PostgreSQL
  url       = env("DATABASE_URL")    // Chuỗi kết nối chính (từ .env)
  directUrl = env("DIRECT_URL")      // Kết nối trực tiếp cho migrations
}

// ── 2. Sinh Prisma Client ────────────────────────
generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
}

// ── 3. Khai báo các Model (Bảng) ─────────────────
model User {
  id       String  @id @default(uuid())
  fullName String
  email    String? @unique
  // ...
}
```

### 2.2. Giải thích từng thành phần Attribute

Dưới đây là bảng tổng hợp tất cả các **Attribute** (ký hiệu `@`) mà Prisma hỗ trợ:

#### Attribute cấp trường (Field-level)

| Attribute | Ý nghĩa | Ví dụ trong LogiX |
| :--- | :--- | :--- |
| `@id` | Đánh dấu trường làm **Primary Key** | `id String @id` |
| `@default(uuid())` | Tự động sinh UUID khi tạo bản ghi mới | `id String @id @default(uuid())` |
| `@default(now())` | Tự động gán thời gian hiện tại | `createdAt DateTime @default(now())` |
| `@default("ACTIVE")` | Gán giá trị mặc định là chuỗi | `status String @default("ACTIVE")` |
| `@default(true)` | Gán giá trị mặc định Boolean | `isActive Boolean @default(true)` |
| `@default(0)` | Gán giá trị mặc định số | `sortOrder Int @default(0)` |
| `@unique` | Ràng buộc giá trị không được trùng | `email String? @unique` |
| `@updatedAt` | Tự động cập nhật thời gian khi sửa | `updatedAt DateTime @updatedAt` |
| `@relation(...)` | Khai báo quan hệ với bảng khác | `store Store? @relation(fields: [storeId], references: [id])` |

#### Attribute cấp model (Model-level — dùng `@@`)

| Attribute | Ý nghĩa | Ví dụ trong LogiX |
| :--- | :--- | :--- |
| `@@map("tên_bảng")` | Đặt tên bảng thực trong Database | `@@map("auth_users")` |
| `@@unique([field1, field2])` | Ràng buộc cặp giá trị không được trùng | `@@unique([userId, courseId])` — 1 user chỉ ghi danh 1 lần vào 1 khóa |

### 2.3. Kiểu dữ liệu Prisma

| Prisma Type | PostgreSQL Type | Giải thích | Ví dụ |
| :--- | :--- | :--- | :--- |
| `String` | `TEXT` | Chuỗi ký tự | `fullName String` |
| `String?` | `TEXT` (nullable) | Chuỗi có thể `null` | `email String?` |
| `Int` | `INTEGER` | Số nguyên | `passScore Int @default(80)` |
| `Float` | `DOUBLE PRECISION` | Số thực | `completionPercentage Float @default(0.0)` |
| `Boolean` | `BOOLEAN` | True/False | `isActive Boolean @default(true)` |
| `DateTime` | `TIMESTAMP` | Ngày giờ | `createdAt DateTime @default(now())` |
| `DateTime?` | `TIMESTAMP` (nullable) | Ngày giờ có thể null | `completedAt DateTime?` |

---

## 🔗 3. CÁC LOẠI QUAN HỆ (RELATIONS)

Prisma hỗ trợ 3 loại quan hệ cơ bản giữa các bảng:

### 3.1. Quan hệ 1 - 1 (One-to-One)

**Ví dụ LogiX:** Mỗi `User` chỉ có đúng 1 `UserAccount` (chứa password, login email).

```prisma
model User {
  id          String       @id @default(uuid())
  fullName    String
  userAccount UserAccount?    // ← Phía "1" (optional)
}

model UserAccount {
  id           String  @id @default(uuid())
  userId       String  @unique          // ← Khóa ngoại, bắt buộc @unique cho 1-1
  user         User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  loginEmail   String  @unique
  passwordHash String
}
```

**Cách đọc:** `User` có **tối đa 1** `UserAccount`. Khi xóa `User`, `UserAccount` cũng bị xóa theo (`onDelete: Cascade`).

### 3.2. Quan hệ 1 - N (One-to-Many)

**Ví dụ LogiX:** 1 `Course` có **nhiều** `CourseModule`, mỗi `CourseModule` chỉ thuộc 1 `Course`.

```prisma
model Course {
  id      String         @id @default(uuid())
  title   String
  modules CourseModule[]    // ← Phía "nhiều" (mảng)
}

model CourseModule {
  id       String @id @default(uuid())
  courseId  String                   // ← Khóa ngoại
  course   Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
  title    String
  lessons  Lesson[]                  // ← 1 Module có nhiều Lesson
}
```

**Cách đọc:** 1 `Course` → nhiều `CourseModule[]`. 1 `CourseModule` → nhiều `Lesson[]`. Xóa Course sẽ cascade xóa hết Module và Lesson.

### 3.3. Quan hệ N - N (Many-to-Many) thông qua bảng trung gian

**Ví dụ LogiX:** 1 `Role` có thể gắn **nhiều** `Permission`, và 1 `Permission` có thể thuộc **nhiều** `Role`. Bảng trung gian là `RolePermission`.

```prisma
model Role {
  id              String           @id @default(uuid())
  roleName        String           @unique
  rolePermissions RolePermission[]    // ← Phía nhiều
}

model Permission {
  id              String           @id @default(uuid())
  permissionCode  String           @unique
  rolePermissions RolePermission[]    // ← Phía nhiều
}

// ── Bảng trung gian ──
model RolePermission {
  id           String     @id @default(uuid())
  roleId       String
  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permissionId String
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@unique([roleId, permissionId])   // Đảm bảo 1 Role không gán trùng 1 Permission
}
```

**Sơ đồ tổng quan quan hệ RBAC trong LogiX:**
```
User ──1:N──> UserRole ──N:1──> Role ──1:N──> RolePermission ──N:1──> Permission
```

---

## 🖥️ 4. PRISMA CLI — CÁC LỆNH DÒNG LỆNH CẦN BIẾT

Tất cả lệnh chạy từ thư mục `backend/`:

| Lệnh | Chức năng | Khi nào dùng |
| :--- | :--- | :--- |
| `npx prisma generate` | Sinh lại Prisma Client từ schema | Sau khi sửa `schema.prisma` |
| `npx prisma migrate dev --name <tên>` | Tạo file SQL migration & đồng bộ DB | Khi thêm/sửa/xóa bảng hoặc trường |
| `npx prisma migrate deploy` | Áp dụng migration lên DB production | Khi deploy lên server |
| `npx prisma db push` | Đồng bộ schema xuống DB (không tạo migration file) | Dùng thử nghiệm nhanh lúc dev |
| `npx prisma db seed` | Chạy file `seed.ts` nạp dữ liệu mẫu | Lần đầu setup hoặc reset dữ liệu |
| `npx prisma studio` | Mở giao diện web xem/sửa dữ liệu DB | Debug, kiểm tra dữ liệu trực quan |
| `npx prisma migrate reset` | Xóa toàn bộ DB rồi chạy lại migration + seed | Reset hoàn toàn DB về trạng thái ban đầu |

### Quy trình điển hình khi thêm trường mới:

```bash
# 1. Sửa schema.prisma (ví dụ: thêm trường `phone` vào model User)
# 2. Tạo migration
npx prisma migrate dev --name add-phone-to-user

# 3. Sinh lại Client (tự động sau migrate, nhưng có thể chạy tay)
npx prisma generate
```

---

## 🔍 5. PRISMA CLIENT — CÁCH TRUY VẤN DATABASE TRONG CODE

### 5.1. Khởi tạo Prisma Client (Singleton Pattern)

File `backend/src/config/prisma.ts` trong LogiX:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'warn', 'error']   // Dev: log toàn bộ query SQL
      : ['error'],                    // Production: chỉ log lỗi
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma     // Tránh tạo lại Client khi hot-reload
}

export default prisma
```

**Sử dụng trong Service:**
```typescript
import prisma from '../../config/prisma'
```

### 5.2. Các phương thức truy vấn chính

#### 📘 `findMany` — Lấy nhiều bản ghi (SELECT nhiều)

```typescript
// Lấy tất cả User đang active
const users = await prisma.user.findMany({
  where: { isActive: true },
  orderBy: { createdAt: 'desc' },
})
```

#### 📘 `findUnique` — Lấy 1 bản ghi theo trường unique (SELECT 1)

```typescript
// Lấy User theo email (email có @unique)
const user = await prisma.user.findUnique({
  where: { email: 'admin@bahung.com' },
})

// Lấy theo Composite Unique Key (2 trường kết hợp)
const enrollment = await prisma.courseEnrollment.findUnique({
  where: {
    userId_courseId: {      // Tên tự động từ @@unique([userId, courseId])
      userId: 'abc-123',
      courseId: 'xyz-456',
    },
  },
})
```

#### 📘 `findFirst` — Lấy bản ghi đầu tiên thỏa điều kiện

```typescript
// Tìm UserRole đầu tiên match điều kiện
const existingUr = await prisma.userRole.findFirst({
  where: { userId: 'abc-123', roleId: 'xyz-456' },
})
```

#### 📘 `create` — Tạo bản ghi mới (INSERT)

```typescript
// Tạo 1 khóa học mới
const course = await prisma.course.create({
  data: {
    code: 'LMS-002',
    title: 'An toàn vệ sinh thực phẩm ATTP',
    slug: 'an-toan-ve-sinh-thuc-pham-attp',
    description: 'Khóa học bắt buộc dành cho toàn bộ nhân viên F&B.',
    categoryId: 'cat-onboarding-id',
    courseType: 'ATTP',
    isMandatory: true,
    passScore: 80,
    status: 'DRAFT',
  },
})
```

#### 📘 `createMany` — Tạo nhiều bản ghi cùng lúc (BATCH INSERT)

```typescript
// Gán nhiều Permission cho 1 Role cùng lúc
await prisma.rolePermission.createMany({
  data: permissionIds.map((permissionId) => ({
    roleId: 'role-admin-id',
    permissionId,
  })),
})
```

#### 📘 `update` — Cập nhật bản ghi (UPDATE)

```typescript
// Cập nhật tiến trình hoàn thành khóa học
await prisma.courseEnrollment.update({
  where: { id: enrollment.id },
  data: {
    completionPercentage: 75.5,
    status: 'IN_PROGRESS',
  },
})
```

#### 📘 `upsert` — Tạo mới nếu chưa có, Cập nhật nếu đã tồn tại

```typescript
// Cập nhật tiến trình bài học — nếu chưa có thì tạo mới
const progress = await prisma.lessonProgress.upsert({
  where: {
    userId_lessonId: { userId, lessonId },   // Tìm theo Composite Unique
  },
  update: {                                   // Nếu đã tồn tại → cập nhật
    isCompleted: true,
    lastPositionSeconds: 180,
    completedAt: new Date(),
  },
  create: {                                   // Nếu chưa tồn tại → tạo mới
    enrollmentId: enrollment.id,
    userId,
    lessonId,
    isCompleted: true,
    lastPositionSeconds: 180,
    completedAt: new Date(),
  },
})
```

#### 📘 `delete` / `deleteMany` — Xóa bản ghi (DELETE)

```typescript
// Xóa 1 Role theo ID
await prisma.role.delete({ where: { id: 'role-id' } })

// Xóa tất cả RolePermission của 1 Role
await prisma.rolePermission.deleteMany({ where: { roleId: 'role-id' } })
```

#### 📘 `count` — Đếm số bản ghi

```typescript
// Đếm số bài học đã hoàn thành
const completedCount = await prisma.lessonProgress.count({
  where: {
    userId: 'user-id',
    lessonId: { in: ['lesson-1', 'lesson-2', 'lesson-3'] },
    isCompleted: true,
  },
})
```

---

## 🔗 6. INCLUDE VÀ SELECT — JOIN BẢNG TRONG PRISMA

### 6.1. `include` — Lấy dữ liệu bảng liên kết (Eager Loading / JOIN)

```typescript
// Lấy Course kèm Category, Modules, và Lessons bên trong mỗi Module
const course = await prisma.course.findUnique({
  where: { id: courseId },
  include: {
    category: true,                      // JOIN bảng Category
    modules: {                           // JOIN bảng CourseModule
      orderBy: { sortOrder: 'asc' },     // Sắp xếp modules
      include: {
        lessons: {                       // JOIN bảng Lesson (lồng sâu 2 cấp)
          where: { isVisible: true },    // Lọc chỉ lấy lesson hiển thị
          orderBy: { sortOrder: 'asc' },
        },
      },
    },
  },
})

// Kết quả trả về:
// {
//   id: '...',
//   title: 'Quy trình SOP...',
//   category: { id: '...', name: 'Onboarding' },     ← Dữ liệu từ bảng Category
//   modules: [
//     {
//       id: '...', title: 'Phần 1: Chuẩn bị Mở cửa hàng',
//       lessons: [                                     ← Dữ liệu từ bảng Lesson
//         { id: '...', title: 'Bài 1: Checklist Vệ sinh...' }
//       ]
//     }
//   ]
// }
```

### 6.2. `select` — Chỉ lấy các trường cần thiết (Tối ưu performance)

```typescript
// Chỉ lấy danh sách id của các bài học (không lấy toàn bộ dữ liệu)
const lessonIds = await prisma.lesson.findMany({
  where: {
    module: { courseId: 'course-id' },
    isVisible: true,
  },
  select: { id: true },    // Chỉ SELECT trường id, bỏ qua tất cả trường khác
})
// Kết quả: [{ id: 'abc' }, { id: 'xyz' }]
```

> **Lưu ý:** `include` và `select` **không thể** dùng cùng lúc trên cùng 1 cấp. Chọn 1 trong 2.

---

## 🔎 7. BỘ LỌC WHERE — FILTERING DATA

### 7.1. Các toán tử lọc phổ biến

| Toán tử | Ý nghĩa | Ví dụ |
| :--- | :--- | :--- |
| `equals` | Bằng (mặc định, không cần ghi) | `{ status: 'ACTIVE' }` |
| `not` | Không bằng | `{ status: { not: 'LOCKED' } }` |
| `in` | Nằm trong danh sách | `{ lessonId: { in: ['id1', 'id2'] } }` |
| `contains` | Chứa chuỗi con (LIKE) | `{ title: { contains: 'SOP', mode: 'insensitive' } }` |
| `startsWith` | Bắt đầu bằng | `{ email: { startsWith: 'admin' } }` |
| `gt` / `gte` | Lớn hơn / Lớn hơn hoặc bằng | `{ passScore: { gte: 80 } }` |
| `lt` / `lte` | Nhỏ hơn / Nhỏ hơn hoặc bằng | `{ levelRank: { lt: 5 } }` |

### 7.2. Kết hợp nhiều điều kiện: `AND`, `OR`, `NOT`

```typescript
// Tìm khóa học PUBLISHED và (tiêu đề chứa "SOP" HOẶC mô tả chứa "SOP")
const courses = await prisma.course.findMany({
  where: {
    status: 'PUBLISHED',                         // AND ngầm định
    OR: [
      { title: { contains: 'SOP', mode: 'insensitive' } },
      { description: { contains: 'SOP', mode: 'insensitive' } },
    ],
  },
})
```

### 7.3. Lọc theo quan hệ (Relation Filtering)

```typescript
// Lấy tất cả bài học thuộc các Module của 1 Course cụ thể
const lessons = await prisma.lesson.findMany({
  where: {
    module: { courseId: 'course-id' },    // Lọc qua bảng quan hệ CourseModule
    isVisible: true,
  },
})
```

---

## 📊 8. SẮP XẾP VÀ PHÂN TRANG

### 8.1. Sắp xếp — `orderBy`

```typescript
// Sắp xếp khóa học mới nhất lên đầu
const courses = await prisma.course.findMany({
  orderBy: { createdAt: 'desc' },
})

// Sắp xếp theo nhiều tiêu chí
const lessons = await prisma.lesson.findMany({
  orderBy: [
    { sortOrder: 'asc' },    // Ưu tiên theo thứ tự sắp xếp
    { createdAt: 'desc' },   // Nếu cùng sortOrder thì mới nhất trước
  ],
})
```

### 8.2. Phân trang — `skip` + `take`

```typescript
// Lấy trang 2, mỗi trang 10 bản ghi
const page = 2
const pageSize = 10

const users = await prisma.user.findMany({
  skip: (page - 1) * pageSize,   // Bỏ qua 10 bản ghi đầu
  take: pageSize,                 // Lấy 10 bản ghi
  orderBy: { createdAt: 'desc' },
})
```

---

## 🌱 9. SEEDING — NẠP DỮ LIỆU MẪU

File `backend/src/seed.ts` dùng để tạo dữ liệu ban đầu cho Database (Admin user, Roles, Permissions, Courses mẫu).

### Cấu trúc file Seed điển hình:

```typescript
import prisma from './config/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  // 1. Xóa dữ liệu cũ (theo thứ tự ngược Foreign Key)
  await prisma.rolePermission.deleteMany({})
  await prisma.userRole.deleteMany({})
  await prisma.permission.deleteMany({})
  await prisma.role.deleteMany({})
  await prisma.userAccount.deleteMany({})
  await prisma.user.deleteMany({})

  // 2. Tạo dữ liệu mới
  const adminRole = await prisma.role.create({
    data: {
      roleName: 'ADMIN',
      displayName: 'Quản trị viên Hệ thống',
      isSystemRole: true,
    },
  })

  // 3. Tạo User Admin
  const passwordHash = await bcrypt.hash('password123', 10)
  const adminUser = await prisma.user.create({
    data: {
      employeeCode: 'BH-ADMIN-001',
      fullName: 'Quản trị Ba Hưng',
      email: 'admin@bahung.com',
      status: 'ACTIVE',
    },
  })

  // 4. Tạo UserAccount (chứa password)
  await prisma.userAccount.create({
    data: {
      userId: adminUser.id,
      loginEmail: 'admin@bahung.com',
      passwordHash,
    },
  })

  // 5. Gán Role cho User
  await prisma.userRole.create({
    data: { userId: adminUser.id, roleId: adminRole.id },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
```

**Chạy Seed:**
```bash
cd backend
pnpm prisma:seed
# hoặc
npx prisma db seed
```

---

## ⚠️ 10. LƯU Ý QUAN TRỌNG & SAI LẦM HAY GẶP

### 10.1. Luôn chạy `prisma generate` sau khi sửa Schema

Sau khi sửa `schema.prisma`, bạn **bắt buộc** phải chạy:
```bash
npx prisma generate
```
Nếu không, Prisma Client sẽ dùng schema cũ → code TypeScript của bạn sẽ thiếu trường mới.

### 10.2. `onDelete: Cascade` — Xóa cha thì tự xóa con

```prisma
model UserAccount {
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```
Khi xóa `User` → `UserAccount` sẽ **tự động bị xóa theo**. Nếu không muốn, dùng `onDelete: SetNull` hoặc `onDelete: Restrict`.

### 10.3. Phân biệt `DATABASE_URL` vs `DIRECT_URL`

| Biến | Port | Mục đích |
| :--- | :--- | :--- |
| `DATABASE_URL` | `6543` | Kết nối qua **Connection Pooler** (PgBouncer) — dùng cho **runtime queries** trong app |
| `DIRECT_URL` | `5432` | Kết nối **trực tiếp** — dùng cho **migrations** và **prisma studio** |

### 10.4. Thứ tự `deleteMany` khi Seed

Khi xóa dữ liệu để seed lại, phải xóa **bảng con trước, bảng cha sau** (ngược thứ tự Foreign Key):
```typescript
// ✅ Đúng: Xóa con trước
await prisma.rolePermission.deleteMany({})   // Con
await prisma.role.deleteMany({})             // Cha

// ❌ Sai: Xóa cha trước → Foreign Key lỗi
await prisma.role.deleteMany({})             // ← Lỗi vì RolePermission đang tham chiếu
await prisma.rolePermission.deleteMany({})
```

### 10.5. Composite Unique Key — Tên tự động sinh

Khi bạn khai báo `@@unique([userId, courseId])` trong schema, Prisma tự tạo key tên `userId_courseId` để dùng trong `where`:
```typescript
await prisma.courseEnrollment.findUnique({
  where: {
    userId_courseId: {       // ← Tên tự động: field1_field2
      userId: 'abc',
      courseId: 'xyz',
    },
  },
})
```

---

## 📋 11. BẢNG THAM CHIẾU NHANH (CHEAT SHEET)

| Thao tác | Prisma Code |
| :--- | :--- |
| Lấy nhiều | `prisma.user.findMany({ where, include, orderBy, skip, take })` |
| Lấy 1 (unique) | `prisma.user.findUnique({ where: { email: '...' } })` |
| Lấy 1 (đầu tiên) | `prisma.user.findFirst({ where: { status: 'ACTIVE' } })` |
| Tạo mới | `prisma.user.create({ data: { ... } })` |
| Tạo nhiều | `prisma.user.createMany({ data: [{ ... }, { ... }] })` |
| Cập nhật | `prisma.user.update({ where: { id }, data: { ... } })` |
| Tạo hoặc Cập nhật | `prisma.user.upsert({ where, create, update })` |
| Xóa 1 | `prisma.user.delete({ where: { id } })` |
| Xóa nhiều | `prisma.user.deleteMany({ where: { status: 'LOCKED' } })` |
| Đếm | `prisma.user.count({ where: { isActive: true } })` |
| JOIN bảng | `include: { userRoles: { include: { role: true } } }` |
| Chỉ lấy vài trường | `select: { id: true, fullName: true }` |
| Lọc LIKE | `{ title: { contains: 'SOP', mode: 'insensitive' } }` |
| Lọc IN | `{ id: { in: ['id1', 'id2'] } }` |
| Sắp xếp | `orderBy: { createdAt: 'desc' }` |
| Phân trang | `skip: 10, take: 10` |

---

> 📚 **Tài liệu chính thức Prisma:** https://www.prisma.io/docs
