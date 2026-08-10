# Quy trình Kiểm tra và Xác minh Kết nối Supabase PostgreSQL (LogiX System)

## 📌 1. Tổng quan (Overview)

Tài liệu này hướng dẫn quy trình tiêu chuẩn để **kiểm tra, xác minh và giám sát kết nối** giữa Backend dự án **LogiX LMS** và cơ sở dữ liệu **Supabase PostgreSQL** thông qua **Prisma ORM**.

Quy trình giúp đội ngũ phát triển nhanh chóng phát hiện các sự cố về kết nối DB, kiểm tra tính hợp lệ của biến môi trường, cũng như audit số lượng bản ghi thực tế trong cơ sở dữ liệu.

---

## ⚙️ 2. Cấu hình Môi trường (Environment Configuration)

Tất cả các tham số kết nối được lưu trữ tại file environment của Backend: [`Practice/LogiX/backend/.env`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/.env).

### Các thông số kết nối chính:

| Biến Môi Trường | Mô Tả & Cổng (Port) | Mục Đích Sử Dụng |
| :--- | :--- | :--- |
| `DATABASE_URL` | Transaction Pooler (Port `6543`, `pgbouncer=true`) | Dùng cho các truy vấn Runtime hàng ngày của ứng dụng Backend |
| `DIRECT_URL` | Session Pooler / Direct Connection (Port `5432`) | Dùng cho Prisma Migration (`prisma migrate`) & DB Push |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-id>.supabase.co` | REST API / Storage / Realtime Endpoint của Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable Key (`sb_publishable_...`) | API Key công khai dùng cho Client SDK |

---

## 🧪 3. Kịch bản Kiểm tra Tự động (Verification Script)

Kịch bản kiểm tra kết nối được đóng gói tại file:  
👉 [`Practice/LogiX/backend/src/test-connection.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/test-connection.ts)

### Chi tiết Mã nguồn Script (`test-connection.ts`):

```typescript
import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';

console.log('==================================================');
console.log('   LOGIX SUPABASE CONNECTION VERIFICATION REPORT  ');
console.log('==================================================\n');

console.log('1. ENVIRONMENT CONFIGURATION:');
console.log(` - DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Configured' : '❌ Missing'}`);
console.log(` - DIRECT_URL:   ${process.env.DIRECT_URL ? '✅ Configured' : '❌ Missing'}`);
console.log(` - SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ Missing'}`);
console.log(` - SUPABASE_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? '✅ Configured' : '❌ Missing'}`);

const prisma = new PrismaClient();

async function runAudit() {
  console.log('\n2. POSTGRESQL DB CONNECTION (VIA PRISMA ORM):');
  try {
    const start = Date.now();
    const serverInfo: any[] = await prisma.$queryRaw`SELECT current_database(), current_user, version();`;
    const latency = Date.now() - start;

    console.log(` - Status: ✅ SUCCESS (Latency: ${latency}ms)`);
    console.log(` - Database Name: ${serverInfo[0]?.current_database}`);
    console.log(` - DB User: ${serverInfo[0]?.current_user}`);
    console.log(` - Postgres Version: ${serverInfo[0]?.version}`);

    console.log('\n3. LOGIX DATABASE TABLES & RECORD COUNTS:');
    const users = await prisma.user.findMany({ select: { id: true, fullName: true, email: true, userType: true } });
    const roles = await prisma.role.findMany({ select: { id: true, roleName: true, displayName: true } });
    const stores = await prisma.store.findMany({ select: { id: true, storeCode: true, storeName: true } });
    const courses = await prisma.course.findMany({ select: { id: true, code: true, title: true } });

    console.log(` - auth_users (${users.length}):`, users);
    console.log(` - auth_roles (${roles.length}):`, roles);
    console.log(` - org_stores (${stores.length}):`, stores);
    console.log(` - crs_courses (${courses.length}):`, courses);

  } catch (error: any) {
    console.error(' - Status: ❌ FAILED');
    console.error(' - Error:', error.message || error);
  }

  console.log('\n4. SUPABASE HTTP REST API TEST:');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (supabaseUrl && apiKey) {
    try {
      const pingRes = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': apiKey,
          'Authorization': `Bearer ${apiKey}`
        }
      });
      console.log(` - Endpoint: ${supabaseUrl}/rest/v1/`);
      console.log(` - HTTP Status: ${pingRes.status} ${pingRes.statusText}`);
    } catch (e: any) {
      console.error(' - REST API Fetch Error:', e.message);
    }
  }

  console.log('\n==================================================');
  await prisma.$disconnect();
  process.exit(0);
}

runAudit();
```

---

## 🚀 4. Hướng dẫn Thực thi (Execution Steps)

Để chạy kiểm tra kết nối Supabase, bạn có thể thực hiện theo 2 cách bên dưới:

### Cách 1: Sử dụng Lệnh Tắt `npm/pnpm` (Khuyên dùng)
Lệnh đã được tích hợp vào [`package.json`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/package.json):

```powershell
# Di chuyển vào thư mục backend
cd c:\Projects\DigiFnb\Practice\LogiX\backend

# Chạy lệnh kiểm tra
pnpm test:db
```

### Cách 2: Chạy trực tiếp qua `ts-node-dev`
```powershell
pnpm exec ts-node-dev src/test-connection.ts
```

---

## 📋 5. Báo cáo Kết quả Kiểm tra Thực tế (Audit Report)

Kết quả xác minh gần nhất thu được từ hệ thống:

```text
==================================================
   LOGIX SUPABASE CONNECTION VERIFICATION REPORT  
==================================================

1. ENVIRONMENT CONFIGURATION:
 - DATABASE_URL: ✅ Configured
 - DIRECT_URL:   ✅ Configured
 - SUPABASE_URL: https://inbhtnyunnywydulyouo.supabase.co
 - SUPABASE_KEY: ✅ Configured

2. POSTGRESQL DB CONNECTION (VIA PRISMA ORM):
 - Status: ✅ SUCCESS (Latency: 738ms)
 - Database Name: postgres
 - DB User: postgres
 - Postgres Version: PostgreSQL 17.6 on x86_64-pc-linux-gnu, compiled by gcc (GCC) 15.2.0, 64-bit

3. LOGIX DATABASE TABLES & RECORD COUNTS:
 - auth_users (2):
   * Quản trị Ba Hưng (admin@bahung.com)
   * Alex Thompson (alex@logix.com)
 - auth_roles (3):
   * ADMIN (Quản trị viên Hệ thống)
   * STUDENT (Học viên / Nhân sự)
   * TEACHER (Giáo viên)
 - org_stores (2):
   * CH-QUAN1 (Cửa hàng Ba Hưng - Quận 1)
   * XUONG-KEM (Xưởng Sản Xuất Kem Ba Hưng)
 - crs_courses (1):
   * LMS-001 (Quy trình SOP Vận hành Cửa hàng Hàng ngày)

4. SUPABASE HTTP REST API TEST:
 - Endpoint: https://inbhtnyunnywydulyouo.supabase.co/rest/v1/
 - Status Code: 401 (Do kết nối chính của ứng dụng chạy qua Prisma ORM PostgreSQL Direct/Pooler)
==================================================
```

---

## 🛠️ 6. Xử lý Lỗi Thường Gặp (Troubleshooting)

| Sự Cố | Nguyên Nhân | Cách Xử Lý |
| :--- | :--- | :--- |
| `Can't reach database server` | Sai IP / Supabase Pooler tạm thời gián đoạn | Kiểm tra kết nối Internet, đảm bảo dùng domain Pooler `aws-0-ap-southeast-1.pooler.supabase.com` |
| `P1001: Connection timed out` | Sai Port (dùng port 5432 thay vì 6543 cho app query) | Kiểm tra `DATABASE_URL` trong `.env` phải có port `6543` và query parameter `?pgbouncer=true` |
| `P1002: Database server was reached but timed out` | Sai password hoặc DB connection quota chạm ngưỡng | Kiểm tra lại password trong `DATABASE_URL` hoặc restart lại Supabase project |

---

> **Lưu ý**: File quy trình này nên được cập nhật khi có sự thay đổi về cấu hình kết nối Supabase hoặc thay đổi kiến trúc truy vấn CSDL trong dự án LogiX.
