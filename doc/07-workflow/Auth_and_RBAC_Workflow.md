# 📚 LogiX LMS — Hướng dẫn Workflow Toàn diện cho Intern

> Tài liệu này giải thích chi tiết **toàn bộ flow** của 2 chức năng chính: **Login** và **Roles (RBAC)**, cùng với tổng hợp các thay đổi trong ngày 07/08/2026.

---

## 📁 Cấu trúc Tổng quan Dự án

```
LogiX/
├── backend/                  # Express.js + Prisma + PostgreSQL
│   ├── prisma/
│   │   └── schema.prisma     # 🗃️ Database Schema (nguồn sự thật)
│   └── src/
│       ├── config/prisma.ts  # Prisma Client instance
│       ├── index.ts          # Entry point Express app
│       ├── middlewares/
│       │   ├── auth.middleware.ts       # JWT verify + gắn user vào req
│       │   └── permission.middleware.ts # Kiểm tra quyền hạn
│       ├── routes/
│       │   ├── auth.ts              # Login, Refresh, Me, Logout
│       │   ├── role.routes.ts       # CRUD Roles + Assign Permissions/Users
│       │   ├── permission.routes.ts # List Permissions
│       │   ├── user.routes.ts       # List/Create Users
│       │   └── ...
│       ├── services/
│       │   └── permission.service.ts # Cache & query permissions
│       └── seed.ts           # Dữ liệu mẫu ban đầu
│
├── frontend/                 # Next.js 15 + React + TailwindCSS
│   ├── middleware.ts         # 🛡️ Next.js Edge Middleware (route guard)
│   └── src/
│       ├── config/
│       │   ├── api-routes.ts     # Map URL các API endpoints
│       │   ├── route-path.ts     # Map URL các trang frontend
│       │   └── routes/           # Role-based route access config
│       ├── lib/
│       │   ├── axios.ts          # Axios instance + interceptors
│       │   └── api.ts            # Utility wrapper cho API calls
│       ├── stores/
│       │   └── auth.store.ts     # Zustand global auth state
│       └── features/
│           ├── auth/             # 🔐 Authentication feature module
│           │   ├── auth.utils.ts       # JWT decode utilities
│           │   ├── schemas/login.schema.ts  # Zod validation
│           │   ├── types/auth.types.ts      # Role enum, User type
│           │   ├── services/auth.service.ts # API calls (login, me, logout)
│           │   ├── hooks/use-auth.ts        # React hook (login, logout, hasPermission)
│           │   ├── components/
│           │   │   ├── login/LoginForm.tsx   # Form component
│           │   │   └── AuthGuard.tsx         # Client-side route guard
│           │   └── pages/LoginPages.tsx      # Login page layout
│           └── admin/            # 👑 Admin feature module
│               ├── types/admin.types.ts
│               ├── services/roles.service.ts
│               ├── services/permissions.service.ts
│               ├── hooks/use-roles.ts
│               └── hooks/use-permissions.ts
```

---

## 🏗️ PHẦN 1: DATABASE SCHEMA (Prisma)

### 1.1 Quan hệ giữa các bảng Auth

```mermaid
erDiagram
    auth_users ||--o| auth_user_accounts : "1 User có 1 Account"
    auth_users ||--o{ auth_user_roles : "1 User có nhiều Role"
    auth_roles ||--o{ auth_user_roles : "1 Role gán cho nhiều User"
    auth_roles ||--o{ auth_role_permissions : "1 Role có nhiều Permission"
    auth_permissions ||--o{ auth_role_permissions : "1 Permission thuộc nhiều Role"

    auth_users {
        uuid id PK
        string employeeCode UK
        string fullName
        string email UK
        string status "ACTIVE | LOCKED | PENDING"
        boolean isActive
        string userType "EMPLOYEE | CUSTOMER | SYSTEM_ADMIN"
        string employmentStatus "PROBATION | OFFICIAL | TEMPORARY | RESIGNED"
        uuid storeId FK
        uuid departmentId FK
        uuid positionId FK
    }

    auth_user_accounts {
        uuid id PK
        uuid userId FK_UK "1-to-1 với User"
        string loginEmail UK
        string passwordHash "bcrypt hash"
        boolean isLocked "khóa khi sai 5 lần"
        int failedLoginCount "đếm số lần sai pass"
        string refreshToken "JWT refresh token"
        datetime refreshTokenExpiresAt
        datetime lastLoginAt
    }

    auth_roles {
        uuid id PK
        string roleName UK "VD: ADMIN, STUDENT"
        string displayName "Tên hiển thị"
        boolean isSystemRole "Không thể xóa"
        boolean bypassDataScope "Bỏ qua data scope"
        boolean isActive
    }

    auth_permissions {
        uuid id PK
        string permissionCode UK "VD: USER.READ, COURSE.CREATE"
        string permissionName
        string module "HRM, LMS, SYSTEM, ATTP"
        string action "READ, CREATE, UPDATE, MANAGE"
        string resource "USER, COURSE, ROLE"
    }

    auth_user_roles {
        uuid id PK
        uuid userId FK
        uuid roleId FK
        datetime assignedAt
        datetime expiresAt "nullable - hết hạn role"
        datetime revokedAt "nullable - bị thu hồi"
        boolean isActive
    }

    auth_role_permissions {
        uuid id PK
        uuid roleId FK
        uuid permissionId FK
    }
```

### 1.2 Giải thích thiết kế

> **Tại sao tách `User` và `UserAccount`?**
> - `User` = hồ sơ nhân sự (tên, email, chức vụ, phòng ban) — có thể tồn tại TRƯỚC khi có tài khoản đăng nhập
> - `UserAccount` = thông tin đăng nhập (email login, password hash, refresh token) — tạo SAU khi cấp quyền đăng nhập
> - Quan hệ **1-to-1** (`userId` là `@unique` trong `UserAccount`)

> **Mô hình RBAC (Role-Based Access Control):**
> - `User` ↔ `Role`: quan hệ **many-to-many** qua bảng trung gian `UserRole`
> - `Role` ↔ `Permission`: quan hệ **many-to-many** qua bảng trung gian `RolePermission`
> - Khi kiểm tra quyền: `User → UserRoles (active) → Roles → RolePermissions → Permissions`

---

## 🔐 PHẦN 2: LOGIN FLOW (Chi tiết từng bước)

### 2.1 Workflow tổng quan

```mermaid
sequenceDiagram
    actor User as 👤 Người dùng
    participant FE_Page as LoginPages.tsx
    participant FE_Form as LoginForm.tsx
    participant FE_Hook as useAuth hook
    participant FE_Service as authService
    participant FE_Axios as axios.ts
    participant FE_Store as auth.store.ts
    participant FE_MW as middleware.ts
    participant BE_Route as auth.ts (Express)
    participant BE_Prisma as Prisma ORM
    participant DB as PostgreSQL

    Note over User, DB: 🟡 Bước 1: User mở trang /login

    User->>FE_MW: GET /login
    FE_MW->>FE_MW: Check cookie 'access_token'
    alt Đã có token (đã login)
        FE_MW-->>User: Redirect → /lms/dashboard
    else Chưa có token
        FE_MW-->>FE_Page: Cho phép vào trang login
    end

    FE_Page->>FE_Page: useEffect check isAuthenticated
    alt isAuthenticated = true
        FE_Page-->>User: router.replace(dashboard)
    else isAuthenticated = false
        FE_Page->>FE_Form: Render LoginForm
    end

    Note over User, DB: 🟢 Bước 2: User nhập email + password → Submit

    User->>FE_Form: Nhập email + password → Click "Đăng nhập"
    FE_Form->>FE_Form: Zod validate (loginSchema)
    alt Validate fail
        FE_Form-->>User: Hiển thị lỗi inline
    else Validate pass
        FE_Form->>FE_Hook: login({ email, password })
    end

    Note over User, DB: 🔵 Bước 3: Frontend gửi API request

    FE_Hook->>FE_Hook: setLoading(true)
    FE_Hook->>FE_Service: authService.login(credentials)
    FE_Service->>FE_Axios: POST /api/auth/login
    FE_Axios->>FE_Axios: Request Interceptor: gắn Bearer token (nếu có)
    FE_Axios->>BE_Route: HTTP POST /api/auth/login

    Note over User, DB: 🟣 Bước 4: Backend xử lý Login

    BE_Route->>BE_Route: Extract { loginEmail, email, password }
    BE_Route->>BE_Prisma: findUnique({ loginEmail })
    BE_Prisma->>DB: SELECT * FROM auth_user_accounts WHERE loginEmail = ?
    DB-->>BE_Prisma: UserAccount + User (include store, dept, position)
    BE_Prisma-->>BE_Route: userAccount object

    alt UserAccount not found
        BE_Route-->>FE_Axios: 401 "Email hoặc mật khẩu không chính xác"
    else Account is locked
        BE_Route-->>FE_Axios: 403 "Tài khoản bị khóa"
    else Password incorrect
        BE_Route->>DB: UPDATE failedLoginCount + check lock
        alt Đã sai >= 5 lần
            BE_Route-->>FE_Axios: 403 "Tài khoản vừa bị khóa"
        else Còn cơ hội
            BE_Route-->>FE_Axios: 401 "Còn N lần thử"
        end
    else Password correct ✅
        BE_Route->>BE_Route: Check user.isActive && status == 'ACTIVE'
        BE_Route->>BE_Route: Reset failedLoginCount = 0
        BE_Route->>BE_Route: Generate refreshToken (JWT, 7 ngày)
        BE_Route->>DB: UPDATE refreshToken, lastLoginAt
        BE_Route->>BE_Prisma: getUserPermissions(userId)
        Note over BE_Prisma, DB: Query UserRoles → RolePermissions → Permission codes
        BE_Route->>BE_Route: Generate accessToken (JWT, 15 phút)
        BE_Route-->>FE_Axios: 200 { accessToken, refreshToken, user, permissions }
    end

    Note over User, DB: 🟠 Bước 5: Frontend xử lý response thành công

    FE_Axios-->>FE_Service: Response data
    FE_Service->>FE_Service: normalizeUserProfile(user)
    FE_Service-->>FE_Hook: { accessToken, refreshToken, user, permissions }
    FE_Hook->>FE_Store: setUser(user, permissions, accessToken, refreshToken)
    FE_Store->>FE_Store: localStorage.setItem('access_token', accessToken)
    FE_Store->>FE_Store: localStorage.setItem('refresh_token', refreshToken)
    FE_Store->>FE_Store: document.cookie = 'access_token=...'
    FE_Store->>FE_Store: Zustand persist → localStorage('auth-storage')
    FE_Hook->>FE_Hook: toast.success("Chào mừng, ...")
    FE_Hook-->>FE_Form: return response
    FE_Form->>FE_Form: router.replace(redirect || '/dashboard')
    FE_Form-->>User: ✅ Redirect đến Dashboard
```

### 2.2 Giải thích chi tiết từng file

#### Bước 1: Validation (Frontend)

**File:** `frontend/src/features/auth/schemas/login.schema.ts`

```typescript
// Dùng Zod để validate form trước khi gửi API
export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
})
```

#### Bước 2: Form Component submit

**File:** `frontend/src/features/auth/components/login/LoginForm.tsx`

```typescript
// react-hook-form + Zod resolver → validate → gọi login()
const onSubmit = async (data: LoginFormValues) => {
  await login(data)                                    // ← gọi useAuth().login
  router.replace(redirect ?? '/dashboard')             // ← redirect sau login
}
```

#### Bước 3: useAuth Hook xử lý logic

**File:** `frontend/src/features/auth/hooks/use-auth.ts`

```typescript
const login = async (credentials) => {
  setLoading(true)
  const response = await authService.login(credentials) // ← gọi service
  setUser(normalizedUser, perms, accessToken, refreshToken) // ← lưu vào Zustand
  toast.success(`Chào mừng, ${user.fullName}!`)
}
```

#### Bước 4: Auth Service gọi API

**File:** `frontend/src/features/auth/services/auth.service.ts`

```typescript
login: async (credentials) => {
  const response = await apiCall.post('/api/auth/login', {
    loginEmail: credentials.email,
    password: credentials.password,
  })
  response.user = normalizeUserProfile(response.user) // ← chuẩn hóa
  return response
}
```

#### Bước 5: Axios Interceptors

**File:** `frontend/src/lib/axios.ts`

```typescript
// REQUEST: Tự động gắn Bearer token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// RESPONSE: Nếu 401 → tự động refresh token → retry request gốc
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.status === 401 && !originalRequest._retry) {
      const newToken = await handleTokenRefresh()
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return api(originalRequest) // retry!
    }
  }
)
```

#### Bước 6: Backend xử lý Login

**File:** `backend/src/routes/auth.ts` (dòng 16-137)

Flow xử lý trong backend:

```
1. Extract body: { loginEmail, email, password }
2. Query DB: prisma.userAccount.findUnique({ loginEmail }) + include User/Store/Dept/Position
3. Check: Account tồn tại? → 401
4. Check: isLocked? → 403
5. Check: bcrypt.compare(password, passwordHash) → nếu sai: tăng failedCount, lock nếu >= 5
6. Check: user.isActive && status === 'ACTIVE' → 403
7. Reset failedLoginCount = 0, update lastLoginAt
8. Generate refreshToken (7d) → lưu vào DB
9. getUserPermissions(userId) → query UserRoles → RolePermissions → Permission codes
10. Generate accessToken (15m) → chứa { userId, email, employeeCode, fullName }
11. Return: { accessToken, refreshToken, user, permissions }
```

#### Bước 7: Zustand Store lưu trữ state

**File:** `frontend/src/stores/auth.store.ts`

```typescript
setUser: (user, permissions, accessToken, refreshToken) => {
  localStorage.setItem('access_token', accessToken)   // cho axios interceptor
  localStorage.setItem('refresh_token', refreshToken)  // cho refresh flow
  setTokenCookie(accessToken)                          // cho Next.js middleware
  set({ user, permissions, isAuthenticated: true })    // Zustand state
}
// Zustand persist: tự động lưu { user, permissions, isAuthenticated } vào localStorage('auth-storage')
```

> **Tại sao lưu token ở cả 3 nơi?**
>
> | Nơi lưu | Mục đích |
> |---------|----------|
> | `localStorage('access_token')` | Axios interceptor đọc để gắn Authorization header |
> | `localStorage('refresh_token')` | Dùng khi access token hết hạn → gọi refresh |
> | `cookie('access_token')` | Next.js Edge Middleware đọc (SSR/server không truy cập localStorage) |
> | Zustand persist (`auth-storage`) | Rehydrate UI state khi reload page |

---

## 🛡️ PHẦN 3: MIDDLEWARE & ROUTE PROTECTION

### 3.1 Next.js Edge Middleware (Server-side)

**File:** `frontend/middleware.ts`

```mermaid
flowchart TD
    A["🌐 Request vào bất kỳ URL"] --> B{"Là /_next, /api, hoặc file tĩnh?"}
    B -->|Có| C["✅ NextResponse.next()"]
    B -->|Không| D{"Là PUBLIC path? /forbidden, /404"}
    D -->|Có| C
    D -->|Không| E{"Là AUTH path? /login"}
    E -->|Có| F{"Có cookie access_token?"}
    F -->|Có| G["↩️ Redirect → /lms/dashboard"]
    F -->|Không| C
    E -->|Không| H{"PROTECTED: Có cookie access_token?"}
    H -->|Không| I["↩️ Redirect → /login?redirect=pathname"]
    H -->|Có| C
```

### 3.2 AuthGuard Component (Client-side)

**File:** `frontend/src/features/auth/components/AuthGuard.tsx`

```mermaid
flowchart TD
    A["AuthGuard wraps protected pages"] --> B{"isLoading?"}
    B -->|Có| C["⏳ Loading spinner"]
    B -->|Không| D{"isAuthenticated?"}
    D -->|Không| E["↩️ Redirect → /login?redirect=pathname"]
    D -->|Có| F{"isRouteAccessible(pathname, role)?"}
    F -->|Không| G["↩️ Redirect → /forbidden"]
    F -->|Có| H["✅ Render children"]
```

### 3.3 Backend Auth Middleware

**File:** `backend/src/middlewares/auth.middleware.ts`

```mermaid
flowchart TD
    A["Request đến protected route"] --> B{"Header có Authorization: Bearer xxx?"}
    B -->|Không| C["❌ 401 Access Token missing"]
    B -->|Có| D["jwt.verify(token, JWT_SECRET)"]
    D -->|Fail| E["❌ 401 Invalid token"]
    D -->|OK| F["decoded = { userId, userAccountId, ... }"]
    F --> G["prisma.userAccount.findUnique(decoded.userAccountId)"]
    G --> H{"Account tồn tại? User active?"}
    H -->|Không| I["❌ 401 User inactive or missing"]
    H -->|Có| J{"Account isLocked?"}
    J -->|Có| K["❌ 403 Account is locked"]
    J -->|Không| L["req.user = { id, userAccountId, loginEmail, ... }"]
    L --> M["✅ next() → chuyển sang handler tiếp"]
```

### 3.4 Permission Middleware

**File:** `backend/src/middlewares/permission.middleware.ts`

```mermaid
flowchart TD
    A["requirePermission('ROLE.MANAGE')"] --> B{"req.user?.id tồn tại?"}
    B -->|Không| C["❌ 401 Unauthorized"]
    B -->|Có| D["getUserPermissions(userId)"]
    D --> E{"permissions.has('ROLE.MANAGE')?"}
    E -->|Không| F["❌ 403 Forbidden: Không có quyền"]
    E -->|Có| G["✅ next()"]
```

---

## 👑 PHẦN 4: ROLES & RBAC FLOW

### 4.1 Mô hình phân quyền

```mermaid
graph TB
    subgraph "User Layer"
        U1["👤 admin@bahung.com"]
        U2["👤 alex@logix.com"]
    end

    subgraph "Role Layer"
        R1["🎭 ADMIN<br/>isSystemRole: true<br/>bypassDataScope: true"]
        R2["🎭 STUDENT<br/>isSystemRole: false"]
    end

    subgraph "Permission Layer"
        P1["🔑 USER.READ"]
        P2["🔑 USER.CREATE"]
        P3["🔑 USER.LOCK"]
        P4["🔑 ROLE.MANAGE"]
        P5["🔑 COURSE.READ"]
        P6["🔑 COURSE.CREATE"]
        P7["🔑 ATTP.VIEW"]
    end

    U1 -->|UserRole| R1
    U2 -->|UserRole| R2

    R1 -->|RolePermission| P1
    R1 -->|RolePermission| P2
    R1 -->|RolePermission| P3
    R1 -->|RolePermission| P4
    R1 -->|RolePermission| P5
    R1 -->|RolePermission| P6
    R1 -->|RolePermission| P7

    R2 -->|RolePermission| P5

    style R1 fill:#dc2626,color:#fff
    style R2 fill:#2563eb,color:#fff
```

### 4.2 Permission Service (Caching Layer)

**File:** `backend/src/services/permission.service.ts`

```mermaid
flowchart TD
    A["getUserPermissions(userId)"] --> B{"In-Memory Cache hit?<br/>TTL 10 phút"}
    B -->|Hit và chưa hết hạn| C["✅ Return cached Set<string>"]
    B -->|Miss hoặc hết hạn| D["Query DB"]
    D --> E["prisma.userRole.findMany<br/>where: userId, isActive, revokedAt: null,<br/>expiresAt chưa qua, role.isActive"]
    E --> F["Lấy roleIds[]"]
    F --> G{"roleIds.length === 0?"}
    G -->|Có| H["Cache empty Set → return"]
    G -->|Không| I["prisma.rolePermission.findMany<br/>where: roleId in roleIds, permission.isActive"]
    I --> J["Map → Set<permissionCode>"]
    J --> K["Cache với TTL 10 phút → return"]
```

> **Khi nào cache bị invalidate?**
> - `invalidatePermissionCacheForRole(roleId)` — gọi khi: update/delete role, assign permissions, sync users
> - `invalidatePermissionCacheForUser(userId)` — gọi khi: logout, user bị remove khỏi role

### 4.3 Role Management API Flow

```mermaid
sequenceDiagram
    actor Admin as 👑 Admin User
    participant FE as Frontend (RolesPage)
    participant Hook as useRoles / use-roles.ts
    participant Service as rolesService
    participant API as Express Backend
    participant MW as authenticateToken + requirePermission
    participant DB as PostgreSQL

    Note over Admin, DB: 📋 Xem danh sách Roles

    Admin->>FE: Vào trang /admin/roles
    FE->>Hook: useRoles() → useQuery
    Hook->>Service: rolesService.list()
    Service->>API: GET /api/roles
    API->>MW: authenticateToken → verify JWT
    MW->>API: ✅ req.user set
    API->>DB: prisma.role.findMany + include rolePermissions.permission
    DB-->>API: roles[]
    API->>API: Format response → { id, roleName, displayName, permissions[] }
    API-->>FE: RoleResponse[]

    Note over Admin, DB: ➕ Tạo Role mới

    Admin->>FE: Click "Tạo vai trò mới"
    FE->>Hook: useCreateRole().mutate(data)
    Hook->>Service: rolesService.create({ roleName, displayName })
    Service->>API: POST /api/roles
    API->>MW: authenticateToken → requirePermission('ROLE.MANAGE')
    MW->>MW: getUserPermissions → check 'ROLE.MANAGE'
    alt Không có quyền
        MW-->>FE: 403 Forbidden
    else Có quyền ✅
        API->>DB: prisma.role.create
        API-->>FE: 201 role.id
        Hook->>Hook: invalidateQueries(['roles']) → refetch list
        Hook-->>Admin: toast.success("Tạo vai trò thành công")
    end

    Note over Admin, DB: 🔑 Gán Permissions cho Role

    Admin->>FE: Chọn permissions → Save
    FE->>Hook: useAssignPermissions().mutate({ roleId, permissionIds })
    Hook->>Service: rolesService.assignPermissions(roleId, permissionIds)
    Service->>API: PUT /api/roles/:id/permissions
    API->>MW: authenticateToken → requirePermission('ROLE.MANAGE')
    API->>DB: DELETE all old RolePermissions for this role
    API->>DB: CREATE new RolePermissions
    API->>API: invalidatePermissionCacheForRole(roleId)
    API-->>FE: 204 No Content

    Note over Admin, DB: 👥 Gán Users cho Role

    Admin->>FE: Chọn users → Save
    FE->>Hook: useSyncRoleUsers().mutate({ roleId, toAdd, toRemove })
    Hook->>Service: rolesService.syncUsers(roleId, toAdd, toRemove)
    Service->>API: PUT /api/roles/:roleId/users
    API->>MW: authenticateToken → requirePermission('ROLE.MANAGE')
    API->>DB: DELETE UserRoles for toRemove users
    API->>DB: UPSERT UserRoles for toAdd users
    API->>API: invalidatePermissionCacheForUser(each user)
    API-->>FE: 204 No Content
```

### 4.4 Frontend kiểm tra quyền tại Client

```mermaid
flowchart TD
    A["Component cần kiểm tra quyền"] --> B{"Dùng cách nào?"}
    
    B --> C["useAuth().hasPermission('ROLE.MANAGE')"]
    C --> D["Zustand Store: permissions.includes(code)"]
    D --> E{"true?"}
    E -->|Có| F["✅ Render nội dung"]
    E -->|Không| G["❌ Ẩn hoặc disable"]

    B --> H["useAuth().hasRole('ADMIN')"]
    H --> I["So sánh user.role === 'ADMIN'"]
    
    B --> J["AuthGuard → isRouteAccessible(path, role)"]
    J --> K["routesConfig.find → check roles[]"]
    K --> L{"ADMIN hoặc role trong allowed?"}
    L -->|Có| F
    L -->|Không| M["↩️ Redirect /forbidden"]
```

---

## 🔄 PHẦN 5: TOKEN REFRESH FLOW

```mermaid
sequenceDiagram
    participant FE as Frontend (bất kỳ request)
    participant Axios as axios.ts interceptor
    participant BE_Refresh as POST /api/auth/refresh
    participant DB as PostgreSQL

    FE->>Axios: API call bất kỳ
    Axios->>Axios: Gắn Bearer token
    Axios->>BE_Refresh: Request gốc
    BE_Refresh-->>Axios: 401 Unauthorized (token hết hạn 15m)

    Note over Axios: Response interceptor bắt 401

    Axios->>Axios: Check: có refreshToken? Chưa retry?
    alt Đã có request đang refresh
        Axios->>Axios: Enqueue vào pendingRequests[]
        Axios->>Axios: Chờ Promise resolve
    else Chưa có → bắt đầu refresh
        Axios->>Axios: isRefreshing = true
        Axios->>BE_Refresh: POST /api/auth/refresh { refreshToken }
        BE_Refresh->>BE_Refresh: jwt.verify(refreshToken, REFRESH_SECRET)
        BE_Refresh->>DB: Find userAccount by decoded.userAccountId
        BE_Refresh->>BE_Refresh: Check: token match? Chưa hết hạn? Account not locked?
        alt Hợp lệ
            BE_Refresh->>BE_Refresh: Sign new accessToken (15m)
            BE_Refresh-->>Axios: { accessToken: newToken }
            Axios->>Axios: setTokens(newToken)
            Axios->>Axios: processPendingRequests(newToken)
            Axios->>Axios: Retry request gốc với newToken
        else Không hợp lệ
            BE_Refresh-->>Axios: 401
            Axios->>Axios: redirectToLogin()
        end
    end
```

---

## 📊 PHẦN 6: TỔNG HỢP THAY ĐỔI NGÀY 07/08/2026

### 6.1 Thống kê thay đổi

| Thành phần | Files Changed | Mô tả |
|-----------|:------------:|-------|
| **Backend Schema** | 1 | Mở rộng `schema.prisma`: thêm Auth RBAC (User, UserAccount, Role, Permission, UserRole, RolePermission) + Org Structure + LMS modules |
| **Backend Routes** | 8+ | Thêm `auth.ts`, `role.routes.ts`, `permission.routes.ts`, `user.routes.ts` + mở rộng courses/lessons/progress/quizzes |
| **Backend Middleware** | 2 | Tạo mới `auth.middleware.ts` (JWT verify) + `permission.middleware.ts` (RBAC check) |
| **Backend Service** | 1 | Tạo mới `permission.service.ts` (in-memory cache + DB lookup) |
| **Backend Seed** | 1 | Viết lại hoàn toàn seed data: tạo org, permissions, roles, users, courses |
| **Frontend Middleware** | 1 | Tạo `middleware.ts`: route guard dựa trên cookie |
| **Frontend Store** | 1 | Tạo `auth.store.ts` (Zustand + persist) |
| **Frontend Auth Feature** | 7+ | `auth.service`, `use-auth`, `LoginForm`, `LoginPages`, `AuthGuard`, `auth.utils`, schemas, types |
| **Frontend Admin Feature** | 5+ | `roles.service`, `permissions.service`, `use-roles`, `use-permissions`, admin types |
| **Frontend Config** | 4 | `api-routes`, `route-path`, route configs (admin/user routes) |
| **Frontend Lib** | 2 | `axios.ts` (interceptors + refresh), `api.ts` (wrapper) |
| **Docs** | -8 files | Xóa docs cũ, chuyển sang cấu trúc mới `doc/00-overview` → `doc/workflow` |

> **Tổng cộng: ~28 files thay đổi, +11,105 dòng thêm, -2,089 dòng xóa**

### 6.2 Kiến trúc đã xây dựng

```mermaid
graph TB
    subgraph "🌐 Frontend - Next.js 15"
        MW["middleware.ts<br/>Edge Route Guard"]
        AG["AuthGuard.tsx<br/>Client Route Guard"]
        
        subgraph "Auth Feature"
            LP["LoginPages.tsx"]
            LF["LoginForm.tsx"]
            UH["useAuth hook"]
            AS["authService"]
            AU["auth.utils"]
            LS["loginSchema (Zod)"]
        end

        subgraph "Admin Feature"  
            RS["rolesService"]
            PS["permissionsService"]
            UR["useRoles hook"]
            UP["usePermissions hook"]
        end

        subgraph "Infrastructure"
            AX["axios.ts<br/>Interceptors + Refresh"]
            ZS["auth.store.ts<br/>Zustand + Persist"]
            RC["Routes Config<br/>Role-based access"]
        end
    end

    subgraph "⚙️ Backend - Express.js"
        EP["index.ts<br/>Entry Point"]
        
        subgraph "Middlewares"
            AM["auth.middleware<br/>JWT Verify"]
            PM["permission.middleware<br/>RBAC Check"]
        end

        subgraph "Routes"
            AR["auth.ts<br/>Login/Refresh/Me/Logout"]
            RR["role.routes.ts<br/>CRUD + Assign"]
            PR["permission.routes.ts<br/>List"]
            URR["user.routes.ts<br/>List/Create"]
        end

        subgraph "Services"
            PSvc["permission.service<br/>Cache + DB Query"]
        end
    end

    subgraph "🗃️ Database - PostgreSQL"
        PRISMA["Prisma ORM"]
        DB["auth_users<br/>auth_user_accounts<br/>auth_roles<br/>auth_permissions<br/>auth_user_roles<br/>auth_role_permissions"]
    end

    LP --> LF --> UH --> AS --> AX --> AR
    UH --> ZS
    MW --> |cookie| ZS
    AG --> UH
    AG --> RC
    
    RS --> AX --> RR
    PS --> AX --> PR
    
    AR --> AM --> PRISMA --> DB
    RR --> AM --> PM --> PSvc --> PRISMA
    PR --> AM
    URR --> AM

    style MW fill:#f97316,color:#fff
    style AM fill:#ef4444,color:#fff
    style PM fill:#ef4444,color:#fff
    style ZS fill:#8b5cf6,color:#fff
    style PSvc fill:#059669,color:#fff
    style DB fill:#3b82f6,color:#fff
```

---

## 🔑 PHẦN 7: SEED DATA (Dữ liệu mẫu)

**File:** `backend/src/seed.ts`

| Thứ tự | Data | Chi tiết |
|:------:|------|---------|
| 1 | **Org Structure** | 2 Stores (CH-QUAN1, XUONG-KEM), 2 Departments (Bán hàng, Làm kem), 2 Positions (QLCH, NV-BAN-HANG) |
| 2 | **Permissions** | 7 permissions: `USER.READ`, `USER.CREATE`, `USER.LOCK`, `ROLE.MANAGE`, `COURSE.READ`, `COURSE.CREATE`, `ATTP.VIEW` |
| 3 | **Roles** | `ADMIN` (all 7 permissions, system role), `STUDENT` (chỉ `COURSE.READ`) |
| 4 | **Users** | `admin@bahung.com` (ADMIN role), `alex@logix.com` (STUDENT role) — password mặc định: `password123` |
| 5 | **Sample Course** | 1 Category → 1 Course → 1 Module → 1 Lesson + enrollment cho alex |

---

## 🎯 Quick Reference cho Intern

### Muốn thêm Permission mới?

1. Thêm vào `seed.ts` → chạy seed lại
2. Hoặc tạo qua Admin UI nếu đã có API

### Muốn protect một route mới?

```typescript
// Backend: Trong route file
router.get('/my-route', authenticateToken, requirePermission('MY.PERMISSION'), handler)

// Frontend: Trong route config
{ path: '/my-page', roles: [Role.ADMIN], label: 'My Page' }
```

### Muốn kiểm tra quyền trong component?

```tsx
const { hasPermission } = useAuth()

{hasPermission('COURSE.CREATE') && <Button>Tạo khóa học</Button>}
```

### Test accounts

| Email | Password | Role | Permissions |
|-------|----------|------|-------------|
| `admin@bahung.com` | `password123` | ADMIN | Tất cả (7) |
| `alex@logix.com` | `password123` | STUDENT | COURSE.READ |
