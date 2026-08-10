# 🚀 HƯỚNG DẪN ONBOARDING CHO LẬP TRÌNH VIÊN MỚI (LOGIX LMS)

> **Mục tiêu:** Giúp lập trình viên mới (Frontend / Backend / Fullstack) cài đặt môi trường, hiểu rõ kiến trúc hệ thống và bắt tay vào phát triển tính năng trong vòng **15 - 30 phút**.  
> **Vị trí tài liệu:** `doc/00-overview/Onboarding_Guide.md`

---

## 📌 1. TỔNG QUAN DỰ ÁN LOGIX

**LogiX LMS** là Hệ thống Quản lý Đào tạo & Phát triển Năng lực Nội bộ thế hệ mới dành cho các chuỗi F&B và Doanh nghiệp Bán lẻ/Nhà máy.

- **Mô hình**: Monorepo tách biệt Frontend và Backend, sử dụng `pnpm workspace`.
- **Cấu trúc Monorepo**:
  - `frontend/`: Ứng dụng Next.js 16 (React 19, Tailwind CSS v4, TanStack Query v5, Zustand, Radix/Shadcn UI).
  - `backend/`: RESTful API Node.js + Express.js + TypeScript + Prisma ORM + PostgreSQL (Supabase) + Redis Cache.
  - `doc/`: Trung tâm tài liệu kiến trúc, module, DB, tracking sprints.

---

## 🛠️ 2. YÊU CẦU MÔI TRƯỜNG & CÔNG CỤ CẦN CÀI ĐẶT

Trước khi bắt đầu, đảm bảo máy tính của bạn đã cài đặt các công cụ sau:

| Công cụ | Phiên bản yêu cầu | Mục đích |
| :--- | :--- | :--- |
| **Node.js** | `>= v20.x` (khuyên dùng LTS v20 / v22) | Môi trường thực thi JavaScript/TypeScript |
| **pnpm** | `>= v9.x` (hoặc `pnpm v10+`) | Package Manager cho Monorepo |
| **Git** | Bản mới nhất | Quản lý mã nguồn |
| **VSCode** | Bản mới nhất | Code Editor chính |

### 🧩 Extension VSCode Khuyên Dùng:
- **Prisma** (`Prisma.prisma`) — Highlight & Auto-complete file `schema.prisma`.
- **ESLint** (`dbaeumer.vscode-eslint`) — Kiểm tra chuẩn code.
- **Prettier** (`esbenp.prettier-vscode`) — Tự động format code khi save.
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) — Gợi ý class Tailwind CSS.

---

## ⚡ 3. 4 BƯỚC THIẾT LẬP DỰ ÁN DÀNH CHO DEV MỚI (15 PHÚT)

### 🔹 Bước 1: Clone Repository & Cài Đặt Dependencies

Mở Terminal tại thư mục workspace của bạn:

```bash
# Clone dự án (thay url repo của bạn)
git clone <repository-url>
cd LogiX

# Cài đặt toàn bộ dependencies cho Monorepo (Root, Frontend, Backend)
pnpm install
```

---

### 🔹 Bước 2: Thiết Lập Biến Môi Trường (`.env`)

#### 1. File `.env` cho Backend (`backend/.env`):
Tạo file `backend/.env` (hoặc sao chép từ cấu hình bên dưới):

#### 2. File `.env` cho Frontend (`frontend/.env`):
Tạo file `frontend/.env`:

### 🔹 Bước 3: Khởi Tạo Database & Seed Dữ Liệu Mẫu

Chạy các lệnh Prisma để đồng bộ Database PostgreSQL và tạo dữ liệu ban đầu (User admin, Roles, Permissions, Courses):

```bash
# Di chuyển vào thư mục backend
cd backend

# 1. Sinh Prisma Client
pnpm prisma:generate

# 2. Đồng bộ Schema xuống Database
pnpm prisma:migrate

# 3. Nạp dữ liệu mẫu ban đầu (Seed User Admin, Roles, Permissions...)
pnpm prisma:seed

# (Tùy chọn) Mở giao diện xem trực quan dữ liệu DB
npx prisma studio
```

---

### 🔹 Bước 4: Khởi Chạy Local Dev Server

Từ thư mục root của dự án `LogiX`, chạy lệnh khởi động song song cả Frontend và Backend:

```bash
# Từ thư mục root dự án LogiX
pnpm dev
```

Server sẽ khởi chạy tại:
- 🌐 **Frontend**: `http://localhost:3000`
- ⚙️ **Backend API**: `http://localhost:5000`
- 🗄️ **Prisma Studio**: `http://localhost:5555` (nếu bật `npx prisma studio`)

Tài khoản mặc định đăng nhập Admin:
- **Email**: `admin@digifnb.com`
- **Password**: `123456`

---

## 🏛️ 4. TỔ CHỨC CẤU TRÚC THƯ MỤC CẦN NẮM

```
LogiX/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Cấu trúc bảng Database PostgreSQL (User, Role, Course...)
│   │   └── migrations/          # Lịch sử thay đổi DB
│   ├── src/
│   │   ├── config/              # Cấu hình DB, Redis, Env
│   │   ├── middlewares/         # Middleware Auth JWT, RBAC Permissions, Error Handling
│   │   ├── modules/             # Các mô đun nghiệp vụ (auth, users, roles, courses...)
│   │   ├── services/            # Logic nghiệp vụ chi tiết
│   │   ├── seed.ts              # Script nạp dữ liệu mẫu
│   │   └── index.ts             # Entry point Express App
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js 16 App Router pages & layouts
│   │   ├── components/          # UI Components tái sử dụng (ui/, shared/)
│   │   ├── features/            # Feature-Based Modules (admin/, auth/, hr/, lms/)
│   │   ├── hooks/               # Custom React Hooks & React Query mutations/queries
│   │   ├── lib/                 # Providers, Axios client, utils, i18n
│   │   ├── stores/              # Zustand global client stores
│   │   └── types/               # TypeScript interfaces / DTOs
│   └── package.json
│
└── doc/                         # Hệ thống tài liệu dự án đầy đủ
```

---

## 🧠 5. KIẾN THỨC CỐT LÕI CẦN ĐỌC TRƯỚC KHI CODE

Để theo kịp tiến độ team, dev mới cần đọc kỹ các tài liệu quan trọng trong thư mục `doc/`:

1. 📖 **Tech Stack Roadmap**: [LogiX_Knowledge_Roadmap.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/03-tech-stack/LogiX_Knowledge_Roadmap.md) — Bức tranh tổng thể các công nghệ FE/BE.
2. 🔐 **Hệ thống Phân quyền RBAC**: [Auth_and_RBAC_Workflow.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/07-workflow/Auth_and_RBAC_Workflow.md) — Chi tiết luồng phân quyền `MODULE.ACTION`.
3. 🗄️ **Thiết kế Database**: [Database_Design_Document.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/01-architecture/Database_Design_Document.md) — Thiết kế bảng & ERD PostgreSQL.
4. 📋 **Danh mục Tính năng & Tiến độ**: [Sprint_Tracking_Board.md](file:///c:/Projects/DigiFnb/Practice/LogiX/doc/04-tracking-sprints/Sprint_Tracking_Board.md) — Bảng phân công công việc & Sprint.

---

## 🛠️ 6. QUY TRÌNH PHÁT TRIỂN HÀNG NGÀY (DAILY WORKFLOW)

### 1. Tạo Nhánh Git Mới (Branch Convention)
```bash
# Cập nhật code mới nhất từ main
git checkout main
git pull origin main

# Tạo nhánh tính năng mới
git checkout -b feature/lms-course-creation
# hoặc sửa lỗi
git checkout -b fix/permission-sheet-loop
```

### 2. Thao Tác Thường Dùng
- **Chạy riêng Frontend**: `pnpm --prefix frontend dev`
- **Chạy riêng Backend**: `pnpm --prefix backend dev`
- **Thêm bảng / đổi trường DB**:
  1. Sửa `backend/prisma/schema.prisma`
  2. Run `npx prisma migrate dev --name <ten-migration>`
  3. Run `npx prisma generate`
- **Kiểm tra chuẩn code & Type check**:
  - FE: `pnpm --prefix frontend lint` & `npx tsc --noEmit`
  - BE: `pnpm --prefix backend build`

---

## ❓ 7. XỬ LÝ SỰ CỐ THƯỜNG GẶP (TROUBLESHOOTING)

| Hiện tượng | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| **`Connection refused` khi gọi API** | Backend chưa chạy hoặc hỏng port 5000 | Kiểm tra terminal backend, đảm bảo `pnpm --prefix backend dev` đang chạy |
| **`PrismaClientInitializationError`** | Cấu hình `DATABASE_URL` trong `.env` chưa đúng | Kiểm tra lại chuỗi kết nối Supabase trong `backend/.env` |
| **`Hydration failed` ở Frontend** | Server HTML không khớp Client khi dùng Theme | Đảm bảo component đọc `theme` chỉ render icon khi `mounted === true` |
| **`Too many re-renders`** | Gọi `setState` trực tiếp trong render pass | Chuyển việc sync state từ props/queries sang `useEffect` |

---

💬 *Nếu gặp bất kỳ khó khăn nào trong quá trình Onboarding, hãy tạo issue hoặc trao đổi trực tiếp trên kênh chat của Team!*
