# Hướng Dẫn Kiến Trúc Kết Nối Supabase & Cấu Hình Môi Trường (LogiX Project)

Tài liệu này tổng hợp kiến thức chi tiết về các phương thức kết nối với Supabase, vai trò của từng loại biến môi trường, và lý do vì sao dự án **LogiX (Backend Node.js/Express + Prisma ORM)** sử dụng cấu hình hiện tại.

---

## 1. Tổng Quan 5 Phương Thức Kết Nối Supabase (Connection Options)

Supabase cung cấp 5 mô hình kết nối tương ứng với từng kiến trúc ứng dụng:

| Option | Tên Gọi | Trường Hợp Sử Dụng | Biến Môi Trường Liên Quan |
| :--- | :--- | :--- | :--- |
| **1. Framework** | Client SDK (`@supabase/supabase-js`) | Gọi trực tiếp từ **Frontend** (Next.js/React/Mobile) để sử dụng **Supabase Auth**, **Storage (Upload file)**, **Realtime**. | `NEXT_PUBLIC_SUPABASE_URL`<br>`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| **2. Server** | Server API / Service Role | Gọi Supabase REST/GraphQL API từ Server-side với quyền Admin (bỏ qua Row Level Security - RLS). | `SUPABASE_SERVICE_ROLE_KEY` |
| **3. Direct** | Direct Connection String | Kết nối trực tiếp vào Postgres (cổng `5432`). Thường dùng cho các công cụ GUI như DBeaver, TablePlus, pgAdmin. | Connection String cổng `5432` |
| **4. ORM** | Third-party ORM (Prisma / Drizzle) | Dùng cho **Backend Node.js/Express** quản lý Database Schema và query thông qua Prisma ORM. | `DATABASE_URL` (Cổng 6543)<br>`DIRECT_URL` (Cổng 5432) |
| **5. MCP** | Model Context Protocol | Cho phép AI Coding Agents (Cursor, Antigravity, Claude) kết nối kiểm tra DB, đọc log, query SQL tự động. | Cấu hình qua MCP Config Token |

---

## 2. Giải Mã Cấu Hình Prisma ORM Với Supabase

###  Vì sao Prisma BẮT BUỘC cần 2 chuỗi kết nối (`DATABASE_URL` và `DIRECT_URL`)?

Supabase tích hợp **PgBouncer** (Connection Pooler) giúp tối ưu hàng ngàn kết nối đồng thời từ ứng dụng. Tuy nhiên, PgBouncer chạy ở cơ chế *Transaction Mode* sẽ không hỗ trợ các lệnh thay đổi cấu trúc bảng (DDL Statements).

Do đó, cấu hình trong Prisma phải chia làm 2 đường:

1. **`DATABASE_URL` (Cổng `6543` - Transaction Pooler):**
   - **Mục đích:** Dùng khi ứng dụng web chạy bình thường (`npm run dev` / `npm start`).
   - **Đặc điểm:** Giúp gom và tái sử dụng connection, tránh làm sập Postgres khi có nhiều request đồng thời.
   - **Tham số bắt buộc:** `?pgbouncer=true`.

2. **`DIRECT_URL` (Cổng `5432` - Direct Session Connection):**
   - **Mục đích:** Dùng riêng cho các lệnh quản trị database của Prisma như `npx prisma db push`, `npx prisma migrate dev`, `npx prisma studio`.
   - **Đặc điểm:** Kết nối trực tiếp tới Postgres không qua PgBouncer, cho phép thực thi đầy đủ các lệnh tạo/sửa bảng (DDL).

---

## 3. Cấu Hình File Môi Trường `backend/.env` Của LogiX

### Cấu hình chuẩn hóa hiện tại:

```env
# Server Port
PORT=5000

# ==========================================
# 1. PRISMA ORM - SUPABASE POSTGRESQL CONFIG
# ==========================================
# Transaction Pooler (Port 6543) - Dùng cho Query ứng dụng runtime
DATABASE_URL="postgresql://postgres.inbhtnyunnywydulyouo:logix245667@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Session / Direct Connection (Port 5432) - Dùng cho Prisma Migration & DB Push
DIRECT_URL="postgresql://postgres.inbhtnyunnywydulyouo:logix245667@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# ==========================================
# 2. APPLICATION AUTHENTICATION SECRETS
# ==========================================
JWT_SECRET="super_secret_key"
REFRESH_SECRET="refresh_secret_key"

# ==========================================
# 3. SUPABASE CLIENT SDK (OPTIONAL FOR FE / CLIENT INTEGRATION)
# ==========================================
NEXT_PUBLIC_SUPABASE_URL=https://inbhtnyunnywydulyouo.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_rZCUYgNTt7OcC_0YbO4Lsg_OAPdpxs2
```

---

## 4. Quy Trình Phát Triển Database Tiếp Theo Dành Cho LogiX

1. **Giai đoạn 1 (Hiện tại):** Nghiên cứu các yêu cầu nghiệp vụ và tài liệu thiết kế trong thư mục `doc/` (`Database_Design_Document.md`, `[module] Auth, Permission`, `List Function.md`).
2. **Giai đoạn 2:** Thống nhất Database Schema chuẩn hóa cho dự án LogiX.
3. **Giai đoạn 3:** Cập nhật lại các Model chuẩn vào file `prisma/schema.prisma`.
4. **Giai đoạn 4:** Chạy lệnh `npx prisma db push` để tạo bảng chính thức trên Supabase PostgreSQL.
