---
trigger: always_on
---

# Frontend Specialist Sub-Agent [FE-Agent]

**Domain**: Next.js 16 (App Router, Turbopack, React 19), Tailwind CSS v4, Radix / shadcn/ui, TanStack Query v5, Zustand, React Hook Form + Zod, Lucide, Sonner.
**Location**: `Practice/LogiX/frontend/`
**Design Source of Truth**: `src/app/globals.css` (or `index.css`). All color, radius, font, and spacing MUST use defined CSS variables. NEVER use raw hex/oklch inside components.

---

## 1. Feature-Driven Architecture

Organize code under `src/features/<feature_name>/`:
- `components/`: Feature UI (Tables, Modals, Forms, Filters).
- `schemas/`: Zod validation schemas co-located with feature (e.g. `src/features/<feature>/schemas/<feature>.schemas.ts`). *Note: Always co-locate schemas here even if mirrored in `@logix/shared` to allow future backend migration (e.g. C#/.NET).*
- `services/`: Pure Axios/Fetch API client returning typed DTOs.
- `hooks/`: Custom hooks & TanStack Query hooks.
- `types/`: Strict TypeScript DTOs/interfaces (NO `any`).
- `stores/`: Ephemeral Zustand state (modals, active selections).
- `pages/`: Page orchestrators mounted under `src/app/(protected)/...`.

Shared UI belongs in `src/components/shared/` (`StatusBadge`, `PriorityBadge`, `EmptyState`, `LoadingState`, `ErrorState`) — do NOT duplicate.

---

## 2. UX & Business Flow Mandates (Priority #1)

For all CRUD screens, Tables, and Dashboards:

1. **Complete Action Toolbar**:
   - Debounced search input with clear button.
   - Filter dropdowns/popovers (Status, Category, Store, Date).
   - Primary CTA (`+ Thêm mới`, `+ Tạo mới`) in header/toolbar.
   - Secondary actions (Export Excel/CSV, Import, Bulk Delete) when required.
   - Full Pagination: record count, page size selector (`10/20/50`), Prev/Next.

2. **Row Actions**:
   - 1-2 actions: Inline icon buttons + `<Tooltip>` (`Edit`, `View`).
   - 3+ actions: `<DropdownMenu>` via `MoreHorizontal`. Destructive actions (`Xóa`, `Thu hồi`) in red at bottom.

3. **Double-Submit Prevention & Loading**:
   - Disable mutation buttons: `disabled={isPending || isLoading}`.
   - Inline feedback: `<Loader2 className="h-4 w-4 animate-spin" />` + dynamic text (`Đang lưu...`, `Đang xóa...`).

4. **Feedback & Confirmation**:
   - **Sonner**: `toast.success(...)` and `toast.error(...)`.
   - **Destructive Actions**: BẮT BUỘC dùng `<AlertDialog>` (nêu rõ tên bản ghi, cảnh báo không thể hoàn tác).

5. **Multi-Layer Loading & State Feedback**:
   - **Top Bar & Spinner**: Tự động kích hoạt qua `NextTopLoader` trong `src/app/layout.tsx` khi chuyển route (thanh cam `#e8784a` trên top + spinner góc phải).
   - **Route Suspense (`loading.tsx`)**: Mỗi module/sub-route mới dưới `src/app/(protected)/...` phải có `loading.tsx` (hoặc kế thừa `(protected)/loading.tsx`) hiển thị loader giữa màn hình.
   - **Component Skeleton**: Khi component đang tải (`isLoading`), BẮT BUỘC dùng `<Skeleton>` khớp kích thước layout thật (bảng, card, form) để chống giật layout (CLS).
   - **EmptyState & ErrorState**: `EmptyState` có icon + CTA; `ErrorState` có thông báo + nút Thử lại (`refetch()`).

---

## 3. UI Aesthetics — shadcn-First & Token-Driven

### 3.1 Component Hierarchy
1. **shadcn Primitive**: (`Button`, `Badge`, `Dialog`, `AlertDialog`, `DropdownMenu`, `Table`, `Skeleton`, `Tooltip`, `Popover`, `Select`, `Command`, `Sonner`).
2. **Project Shared**: (`src/components/shared/StatusBadge.tsx`, `PriorityBadge.tsx`, `EmptyState.tsx`, etc.).
3. **Feature Composition**: Compose exclusively from shadcn primitives (e.g. `<Card>` instead of `<div className="border rounded">`).

### 3.2 Token-Only Color Usage (Strict CSS Priority)
- **Always prioritize pre-configured CSS tokens**: 100% UI colors must reference tokens in `index.css`/`globals.css`. NEVER hardcode inline hex, oklch, or arbitrary Tailwind colors (`bg-emerald-50`, `text-rose-700`, `style={{ color: ... }}`).
- **Semantic UI**: Use shadcn semantic tokens (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary text-primary-foreground`, `bg-destructive text-destructive-foreground`, `bg-accent text-accent-foreground`). Auto dark-mode via `.dark`.
- **Status / Priority**: Use `--t-status-*` (`--t-status-todo-*`, `--t-status-progress-*`, `--t-status-done-*`, `--t-status-overdue-*`) & `--t-priority-*` (`--t-priority-high-*`, `--t-priority-med-*`, `--t-priority-low-*`).
- **Sidebar & Charts**: Use `--t-sidebar-*`, `--finance-teal`, `--finance-purple`, `--chart-1..5`.
- **Missing Token**: Propose new CSS variable in `globals.css` (both `:root` and `.dark`) via `[Doc-Agent]` — NEVER invent one-off raw colors.

### 3.3 Centralized Status & Priority Badges
- **`src/components/shared/status-badge.tsx`**: Wraps shadcn `Badge`. References `--t-status-*` tokens via typed config map (`src/lib/status-config.ts`), e.g. `className="bg-[var(--t-status-done-bg)] text-[var(--t-status-done-text)]"`.
- **`src/components/shared/priority-badge.tsx`**: Same pattern with `--t-priority-*` and `priority-config.ts`.
- Usage: `<StatusBadge status="done" />` (call sites never touch color classes).

### 3.4 Styling Constraints
- **No Inline Styles**: NEVER use `style={{}}` for properties expressible via Tailwind/CSS vars. Exceptions strictly limited to runtime dynamic values (e.g., DnD `transform`, chart dimensions).
- **Drag & Drop**: Use global classes (`.sortable-ghost`, `.sortable-chosen`, `.sortable-drag`).

### 3.5 Typography, Radius & Spacing
- **Typography**:
  - `font-sans` (Geist Variable) for body/UI.
  - `font-heading` / `font-display` (Lora) for headings.
  - `font-mono` (JetBrains Mono) for code.
  - Hierarchy: Page Title (`text-2xl font-bold tracking-tight text-foreground`), Section Title (`text-lg font-semibold text-foreground`), Table Header (`text-xs font-semibold uppercase tracking-wider text-muted-foreground`), Table Cell (`text-sm text-foreground`).
- **Radius**: Use `--radius` scale (`rounded-sm` → `rounded-4xl`). Inputs/Buttons: `rounded-md`/`rounded-lg`; Cards: `rounded-lg`/`rounded-xl`; Large surfaces: `rounded-2xl`+.
- **Spacing**: 4px grid (`gap-2`, `gap-4`, `gap-6`, `p-4`, `p-6`). Table row padding: `py-3` to `py-3.5`.

### 3.6 Motion & Transitions
- Minimalist, high data density. Micro-transitions only (`transition-colors duration-150`, `active:scale-[0.99]`).
- Card/list reordering: reuse `.lesson-item` / `.section-card` transition classes.

---

## 4. Data Fetching & State Evaluation

Evaluate data requirements before choosing state/fetching patterns:
1. **Use TanStack `useQuery` (Server State)**:
   - Dành cho dữ liệu động, kích thước lớn, phân trang nhiều, tìm kiếm thời gian thực hoặc cần cache/refetch/invalidation liên tục (VD: Danh sách Users, Giao dịch, Audit Logs).
   - Bắt buộc dùng **Query Key Factory** (e.g. `userKeys.list(params)`) và invalidate cache trong `onSuccess` của mutation.
2. **Lightweight / Local Fetch / Server Component**:
   - Dữ liệu nhỏ, tĩnh hoặc bán tĩnh (< 50 items, e.g. danh mục khóa học cơ bản, dropdown options, lookup codes, static settings): Fetch trực tiếp hoặc load 1 lần nhẹ nhàng, không over-engineer với complex query chains.
3. **Zustand (Client State)**:
   - Chỉ dùng cho ephemeral UI state (sidebar collapse, active modal IDs, wizard stepper state, filter drawer toggles).

---

## 5. Forms & TypeScript Quality
- **React Hook Form + Zod**: Luôn dùng `useForm({ resolver: zodResolver(schema) })` từ file `schemas/<feature>.schemas.ts`. Map server errors 400/422 vào `form.setError`.
- **Strict Typing**: ZERO `any`. All props, DTOs, handlers must be strictly typed.
- Status/priority config maps MUST use `Record<StatusKey, StatusConfig>` or discriminated unions.