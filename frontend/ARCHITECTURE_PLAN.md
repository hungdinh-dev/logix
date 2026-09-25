# 🏛️ BẢN QUY HOẠCH KIẾN TRÚC TỔNG THỂ (FRONTEND MASTER PLAN)
## Dự án: Next.js Monorepo (Tách biệt 4 Phân hệ: Public/Marketing - System Admin - LMS - HRM + Shared Contracts)

> **Mục đích**: Tài liệu kiến trúc chuẩn mực để bàn giao cho cả 2 team (**Team LMS** và **Team HRM**) cùng phát triển song song, độc lập 100% và **không bao giờ bị xung đột Git (Zero Git Conflict)**.

---

## 1. 🎯 TỔNG QUAN 4 TRỤ CỘT ĐỘC LẬP & SHARED CONTRACTS

```
                                  ┌─────────────────────────────┐
                                  │   Next.js 15 (Turborepo)    │
                                  └──────────────┬──────────────┘
                                                 │
        ┌───────────────────┬────────────────────┼───────────────────┬───────────────────┐
        ▼                   ▼                    ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────────┐   ┌─────────────┐   ┌─────────────────┐   ┌─────────────┐
│  0. PUBLIC   │   │  1. SYSTEM ADMIN │   │ 2. LMS      │   │ 3. HRM          │   │ 4. SHARED   │
│ (Marketing)  │   │  (Quản trị tổng) │   │ (Đào tạo)   │   │ (Nhân sự lương) │   │ (Contracts) │
├──────────────┤   ├──────────────────┤   ├─────────────┤   ├─────────────────┤   ├─────────────┤
│ • Landing    │   │ • Roles & Perms  │   │ • Learner   │   │ • Employees     │   │ • User DTO  │
│ • Solutions  │   │ • Role Hierarchy │   │ • Admin LMS │   │ • Attendance    │   │ • Org DTO   │
│ • Features   │   │ • Departments    │   │ • Courses   │   │ • Payroll       │   │ • Training  │
│ • Showcase   │   │ • Employees      │   │ • Editor    │   │ • KPI / Review  │   │   Contracts │
│ • Header/Foot│   │ • Job Levels     │   │ • Progress  │   │ • Leave / Shift │   │ • Badges    │
└──────────────┘   └──────────────────┘   └─────────────┘   └─────────────────┘   └─────────────┘
```

---

## 2. 🗂️ CẤU TRÚC CÂY THƯ MỤC CHUẨN HÓA (STANDARDIZED ARCHITECTURE TREE)

```
src/
├── app/                                  # 🌐 NEXT.JS APP ROUTER (Routing & Metadata)
│   │
│   ├── (public)/                         # 🌐 1. KHU VỰC CÔNG KHAI (TRƯỚC ĐĂNG NHẬP)
│   │   ├── layout.tsx                    # PublicHeader + PublicFooter
│   │   └── page.tsx                      # LandingPage (Giới thiệu hệ sinh thái LMS & HRM)
│   │
│   ├── (auth)/                           # 🔑 2. KHU VỰC ĐĂNG NHẬP
│   │   ├── login/page.tsx
│   │   └── forgot-password/page.tsx
│   │
│   └── (protected)/                      # 🛡️ 3. KHU VỰC ĐÃ XÁC THỰC
│       ├── layout.tsx                    # AppShell chung (Sidebar + Header, auto-hide player)
│       │
│       ├── admin/                        # 🏢 SYSTEM & HR ADMIN (Quản trị Tổng)
│       │   ├── dashboard/page.tsx        # Tổng quan hệ thống
│       │   ├── roles/page.tsx            # Vai trò (Roles)
│       │   ├── permissions/page.tsx      # Phân quyền (Permissions)
│       │   ├── role-hierarchy/page.tsx   # Cây phân quyền
│       │   ├── departments/page.tsx      # Sơ đồ tổ chức
│       │   ├── employees/page.tsx        # Danh sách nhân sự
│       │   ├── job-levels/page.tsx       # Cấp bậc
│       │   └── custom-fields/page.tsx    # Trường tùy chỉnh
│       │
│       ├── lms/                          # 🎓 PHÂN HỆ ĐÀO TẠO (TEAM LMS HOÀN TOÀN LÀM CHỦ)
│       │   │
│       │   ├── (learner)/                # 👤 Cổng Học viên (Learner Portal)
│       │   │   ├── dashboard/page.tsx    # /lms/dashboard
│       │   │   ├── courses/page.tsx      # /lms/courses
│       │   │   ├── courses/[id]/page.tsx # /lms/courses/:id
│       │   │   ├── lessons/[id]/page.tsx # /lms/lessons/:id (Full-screen player)
│       │   │   ├── quizzes/[id]/page.tsx # /lms/quizzes/:id
│       │   │   └── progress/page.tsx     # /lms/progress
│       │   │
│       │   └── admin/                    # ⭐ CỔNG QUẢN TRỊ ĐÀO TẠO (LMS ADMIN - TÁCH BIỆT ADMIN TỔNG)
│       │       ├── dashboard/page.tsx    # /lms/admin/dashboard
│       │       ├── courses/page.tsx      # /lms/admin/courses
│       │       ├── courses/create/       # /lms/admin/courses/create
│       │       ├── courses/[id]/         # /lms/admin/courses/:id (Editor giáo trình)
│       │       ├── courses/[id]/targeting/# /lms/admin/courses/:id/targeting (Phân bổ)
│       │       ├── categories/page.tsx   # /lms/admin/categories
│       │       ├── progress/page.tsx     # /lms/admin/progress
│       │       └── demo/                 # /lms/admin/demo/* (Toàn bộ 7 trang UI demo)
│       │
│       └── hrm/                          # 👥 PHÂN HỆ NHÂN SỰ (TEAM HRM HOÀN TOÀN LÀM CHỦ)
│           └── page.tsx                  # HRM Dashboard / Landing
│
├── features/                             # 🧠 VERTICAL SLICES (BUSINESS LOGIC)
│   │
│   ├── public/                           # 🌐 MỚI: UI Landing & Trang công khai
│   │   ├── components/                   # HeroSection, FeaturesSection, SolutionsSection, Header, Footer
│   │   ├── pages/LandingPage.tsx
│   │   └── index.ts                      # Barrel export của Public
│   │
│   ├── shared/                           # 🤝 MỚI: CONTRACTS DÙNG CHUNG LMS ↔ HRM
│   │   ├── types/
│   │   │   ├── user-profile.types.ts     # DTO thông tin nhân viên
│   │   │   ├── organization.types.ts     # DTO Phòng ban, Vị trí, Cấp bậc
│   │   │   └── training-contract.types.ts# Contract dữ liệu đào tạo cho Hồ sơ nhân sự
│   │   ├── components/                   # DepartmentBadge, TrainingStatusBadge
│   │   └── index.ts                      # Barrel export của Shared
│   │
│   ├── auth/                             # 🔑 Xác thực & Session
│   │   └── index.ts
│   │
│   ├── admin/                            # 🏢 Quản trị hệ thống & Tổ chức
│   │   └── index.ts
│   │
│   ├── lms/                              # 🎓 Đào tạo nội bộ (TEAM LMS)
│   │   ├── courses-admin/                # Quản lý khóa học
│   │   ├── course-editor/                # Soạn giáo trình
│   │   ├── course-create/                # Tạo khóa học từng bước (Wizard Stepper)
│   │   ├── course-categories/            # Danh mục chương trình
│   │   ├── course-targeting/             # Phân bổ tự động
│   │   ├── lms-dashboard/                # Dashboard đào tạo
│   │   ├── progress-tracking/            # Theo dõi tiến độ
│   │   ├── demo-ui/                      # UI demo components & pages
│   │   ├── hooks/                        # use-courses, use-course-detail (LMS-shared)
│   │   ├── services/                     # course.service.ts
│   │   └── index.ts                      # Barrel export của LMS
│   │
│   └── hrm/                              # 👥 Quản trị nhân sự (TEAM HRM)
│       └── index.ts                      # Barrel export của HRM
│
├── components/                           # 🎨 UI TÁI SỬ DỤNG HỆ THỐNG
│   ├── common/                           # ConfirmDialog, DataTablePagination...
│   ├── shared/                           # AppSidebar, Header, Logo...
│   └── ui/                               # Shadcn UI Atoms
│
├── config/
│   ├── api-routes.ts
│   ├── route-path.ts                     # Thống nhất route paths toàn hệ thống
│   └── routes/                           # Phân định routes theo domain
│       ├── index.ts
│       ├── admin.routes.ts               # System Admin
│       ├── lms.routes.ts                 # LMS Learner + LMS Admin
│       ├── hr.routes.ts                  # HRM Admin
│       └── user.routes.ts
│
├── lib/                                  # api.ts, axios.ts, utils.ts
└── stores/                               # Zustand stores
```

---

## 3. 🛡️ QUY ƯỚC BẮT BUỘC CHO CẢ 2 TEAM (TEAM CONVENTIONS)

### Quy tắc 1: Ranh giới Thư mục (Strict Folder Boundary)
- **Team LMS**: Chỉ tạo/sửa mã nguồn trong `src/features/lms/` và `src/app/(protected)/lms/`.
- **Team HRM**: Chỉ tạo/sửa mã nguồn trong `src/features/hrm/` và `src/app/(protected)/hrm/`.
- **Admin Tổng**: Chỉ chứa quản trị phân quyền hệ thống (`admin/roles`, `admin/permissions`) và cơ cấu tổ chức. Quản trị khóa học đào tạo nằm ở `lms/admin/`.

### Quy tắc 2: "Rule: CHỈ IMPORT QUA `index.ts` CỦA FEATURE KHÁC" (Barrel Export Pattern)
- **Tại sao?** Để một team có thể tự do tái cấu trúc, đổi tên file, di dời folder con bên trong feature của mình mà **KHÔNG BAO GIỜ** làm gãy code của team khác.
- **Mẫu áp dụng**:
  - ✅ **HỢP LỆ**:
    ```ts
    // Import DTO chung từ features/shared:
    import { SharedDepartment, EmployeeTrainingSummary } from '@/features/shared'

    // HRM import component hoặc type do LMS cung cấp công khai:
    import { CourseCard } from '@/features/lms'
    ```
  - ❌ **CẤM TUYỆT ĐỐI**:
    ```ts
    // Cấm import sâu vào file con nội bộ của feature khác:
    import { something } from '@/features/lms/courses-admin/components/CourseAssignDialog'
    import { internalUtil } from '@/features/hrm/internal/helpers'
    ```

### Quy tắc 3: Dữ liệu Chia sẻ giữa LMS ↔ HRM
- Mọi dữ liệu mà Team LMS cần từ HRM (nhân viên, phòng ban để gán khóa học) và dữ liệu Team HRM cần từ LMS (kết quả học tập để đưa vào hồ sơ nhân viên) **BẮT BUỘC** được định nghĩa tại `src/features/shared/types/`.
- Không tự ý tạo DTO trùng lặp gây lệch cấu trúc (drift).
