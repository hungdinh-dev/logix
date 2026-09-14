# 👥 Phân Hệ HRM (Quản Trị Nhân Sự & Tiền Lương)
> Thư mục này dành riêng cho **Team HRM** phát triển các tính năng nhân sự độc lập, không bị xung đột với phân hệ LMS hay Admin.

## 🗂️ Quy Hoạch Cấu Trúc Vertical Slices Cho Team HRM:

```
src/features/hr/
├── dashboard/               # HRM Dashboard tổng quan
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── pages/
├── employees/               # Danh sách nhân viên & Tạo mới
├── employee-detail/         # Hồ sơ chi tiết, giấy tờ, lương, lịch sử công tác
├── attendance/              # Chấm công, heatmap, giải trình đi trễ về sớm
├── payroll/                 # Tính lương, phiếu lương, lịch sử chi trả
├── kpi/                     # Đánh giá hiệu suất KPI, phân bổ điểm
├── leave/                   # Nghỉ phép, đơn từ, lịch nghỉ
├── org-chart/               # Sơ đồ cơ cấu tổ chức doanh nghiệp
└── shared/                  # Types & Base services dùng chung nội bộ HRM
```

## 🛠️ Quy Tắc Kỹ Thuật (Khi chuyển code từ React/Vite sang Next.js App Router):
1. Thêm `'use client'` ở dòng đầu tiên của các component có hooks (`useState`, `useEffect`, `useForm`).
2. Thay `useNavigate()` bằng `useRouter()` từ `next/navigation` (`router.push('/hr/...')`).
3. Thay `import.meta.env.VITE_*` bằng `process.env.NEXT_PUBLIC_*`.
4. Gọi API qua `apiCall` từ `@/lib/api`.
5. Sử dụng các Common Components có sẵn trong `@/components/common`:
   - `ConfirmDialog` (Modal xác nhận Yes/No)
   - `DataTablePagination` (Phân trang dữ liệu)
   - `DataTableViewOptions` (Bật/tắt cột hiển thị)
