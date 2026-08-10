# Quy Trình & Thứ Tự Cấu Hình Chuẩn Dải Đầy Đủ (Configuration Sequence Baseline)

Tài liệu này ghi lại **chi tiết từng bước cài đặt, danh sách thư viện (Dependencies) và các lệnh CLI** cần thực hiện từ đầu khi setup một dự án **LogiX (Next.js 16 FE + Express/Prisma BE)**.

---

## 📌 Sơ Đồ Tổng Quan Quy Trình Khởi Tạo (Setup Flow)

```mermaid
flowchart TD
    A[1. Tạo Thư Mục Monorepo Root] --> B[2. Khởi Tạo Frontend Next.js & Cài Thư Viện]
    A --> C[3. Khởi Tạo Backend Express & Cài Thư Viện]
    B --> D[4. Cấu Hình ENV & Axios Client ở Frontend]
    C --> E[5. Cấu Hình ENV & Prisma Supabase ở Backend]
    D & E --> F[6. Khởi Chạy Server Local & Kiểm Tra Kết Nối]
```

---

## 🛠️ CHI TIẾT TỪNG BƯỚC CẤU HÌNH & DANH SÁCH THƯ VIỆN

### 1. Khởi Tạo Thư Mục Gốc & Cấu Trúc Monorepo
Tạo thư mục chính cho dự án và 2 thư mục con độc lập:
```bash
mkdir LogiX
cd LogiX
mkdir backend frontend
```

---

### 2. Cấu Hình & Cài Đặt Thư Viện Cho Frontend (`/frontend`)

Thư mục `/frontend` sử dụng **Next.js 16 (App Router), React 19, TypeScript và TailwindCSS v4**.

####  Bước 2.1: Lệnh khởi tạo dự án Next.js:
```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
```

####  Bước 2.2: Danh sách các thư viện bắt buộc cần cài đặt (`package.json`):

##### 1. Nhóm UI, Styling & Component Systems (Shadcn/Radix/Icons):
```bash
pnpm add tailwindcss @tailwindcss/postcss lucide-react clsx tailwind-merge class-variance-authority tw-animate-css next-themes nextjs-toploader
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-avatar @radix-ui/react-tabs @radix-ui/react-popover @radix-ui/react-tooltip @radix-ui/react-select @radix-ui/react-checkbox @radix-ui/react-slot sonner
```
- **`tailwindcss` (v4) & `@tailwindcss/postcss`:** Framework CSS hiện đại nhất.
- **`clsx` + `tailwind-merge` + `class-variance-authority` (cva):** Bộ công cụ ghép class CSS động chuẩn của Shadcn UI.
- **`lucide-react`:** Bộ Icon vector phong phú.
- **`@radix-ui/react-*`:** Các Headless UI Component đạt chuẩn Accessibility (Modal, Dropdown, Avatar, Tabs,...).
- **`sonner`:** Thư viện hiển thị Toast Notification giao diện cực đẹp.

##### 2. Nhóm Quản Lý State & Gọi API (State Management & Fetching):
```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools zustand axios
```
- **`@tanstack/react-query` (v5):** Quản lý Server State, tự động Caching, Re-fetch, Loading/Error state khi gọi API.
- **`zustand` (v5):** Quản lý Client State (Auth State, User Profile, Theme, Sidebar Toggle) siêu nhẹ không bị re-render thừa.
- **`axios`:** Thư viện gửi HTTP Request hỗ trợ Interceptors tự động đính kèm JWT Token.

##### 3. Nhóm Form, Validation & Tiện Ích:
```bash
pnpm add react-hook-form @hookform/resolvers zod date-fns i18next react-i18next jwt-decode jose
```
- **`react-hook-form` + `zod`:** Quản lý Form và Validate dữ liệu người dùng phía Client.
- **`date-fns`:** Xử lý ngày tháng, thời gian.
- **`jwt-decode` / `jose`:** Giải mã JWT Token phía Client để kiểm tra thời gian hết hạn của token.

####  Bước 2.3: File cấu hình môi trường Frontend (`frontend/.env`):
```env
# Địa chỉ API của Backend Server
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### 3. Cấu Hình & Cài Đặt Thư Viện Cho Backend (`/backend`)

Thư mục `/backend` sử dụng **Node.js, Express.js, TypeScript và Prisma ORM**.

####  Bước 3.1: Khởi tạo Package & TypeScript ở Backend:
```bash
cd ../backend
pnpm init
pnpm add -D typescript @types/node @types/express ts-node-dev
npx tsc --init
```

####  Bước 3.2: Danh sách các thư viện bắt buộc cần cài đặt (`package.json`):

```bash
# Thư viện ứng dụng chính (Dependencies)
pnpm add express cors dotenv @prisma/client jsonwebtoken bcryptjs zod

# Thư viện hỗ trợ lập trình (Dev Dependencies)
pnpm add -D prisma @types/cors @types/jsonwebtoken @types/bcryptjs
```

##### Chi tiết chức năng từng thư viện Backend:
- **`express`:** Web Framework tạo Server HTTP, các tuyến đường `/api/...` và Middleware.
- **`cors`:** Middleware cho phép Frontend cổng `3000` gọi API sang cổng `5000`.
- **`dotenv`:** Đọc biến môi trường từ file `.env`.
- **`@prisma/client` & `prisma`:** ORM làm việc với cơ sở dữ liệu Supabase PostgreSQL.
- **`jsonwebtoken` & `bcryptjs`:** Xử lý Đăng nhập, băm mật khẩu an toàn và tạo Access/Refresh Token (JWT).
- **`zod`:** Validate dữ liệu DTO đầu vào của request API.

####  Bước 3.3: Cấu hình file môi trường Backend (`backend/.env`):
```env
PORT=5000

# ==========================================
# 1. PRISMA ORM - SUPABASE POSTGRESQL CONFIG
# ==========================================
# Transaction Pooler (Port 6543) - Dùng khi app chạy query runtime
DATABASE_URL="postgresql://postgres.inbhtnyunnywydulyouo:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection (Port 5432) - Dùng riêng cho Prisma Migration & DB Push
DIRECT_URL="postgresql://postgres.inbhtnyunnywydulyouo:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# ==========================================
# 2. AUTHENTICATION SECRETS
# ==========================================
JWT_SECRET="super_secret_key"
REFRESH_SECRET="refresh_secret_key"
```

####  Bước 3.4: Cấu hình Prisma Schema (`backend/prisma/schema.prisma`):
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

---

### 4. Cấu Hình Giao Tiếp Kết Nối Frontend & Backend

#### 1. Khởi tạo Axios Instance có Interceptor ở Frontend (`frontend/src/lib/axios.ts`):
```typescript
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Tự động đính kèm JWT Access Token vào Header mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

#### 2. Khai báo CORS Server ở Backend (`backend/src/index.ts`):
```typescript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors()) // Cho phép Frontend (Port 3000) truy cập
app.use(express.json()) // Parse JSON payload từ request body

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend API LogiX is running' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server backend running on http://localhost:${PORT}`)
})
```

---

## 🚀 Quy Trình Chạy Lệnh Khởi Động Local

```bash
# 1. Khởi chạy Backend Server (Terminal 1)
cd backend
pnpm dev

# 2. Khởi chạy Frontend Client (Terminal 2)
cd frontend
pnpm dev
```

---

## 📂 Hồ Sơ Tài Liệu Liên Quan
* 📁 [Supabase_Connection_Architecture_Guide.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/03-tech-stack/Supabase/Supabase_Connection_Architecture_Guide.md)
* 📁 [Architecture_Analysis_Decoupled_Design.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/01-architecture/Architecture_Analysis_Decoupled_Design.md)
* 📁 [README.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/00-overview/README.md)
