# Hướng dẫn Xử lý Loading & Phản hồi Tương tác (UI Feedback Guide)

Tài liệu hướng dẫn quy chuẩn về **Loading khi chuyển trang** và **Phản hồi trạng thái nút bấm/hành động** trong dự án LogiX.

---

## 1. Cơ chế Loading khi Chuyển Trang (Page Transitions)

Hệ thống kết hợp 2 cơ chế chính để đảm bảo người dùng luôn nhận biết được trạng thái đang tải:

### A. Thanh tiến trình đỉnh trang (NextTopLoader)
- **Vị trí cấu hình**: `src/app/layout.tsx`
- **Đặc điểm**:
  - Tự động bắt sự kiện route change của Next.js khi click vào các `Link` hoặc dùng `router.push()`.
  - Màu sắc chuẩn thương hiệu: `#e8784a` (Brand Accent).
  - Có kèm Spinner xoay góc trên bên phải màn hình.

### B. Route Suspense Loading (`loading.tsx`)
- **Root Level**: `src/app/loading.tsx`
- **Protected Level**: `src/app/(protected)/loading.tsx`
- **Đặc điểm**:
  - Tự động hiển thị giao diện skeleton/spinner mượt mà trong khi Next.js Server Components chuẩn bị dữ liệu cho route tiếp theo.

---

## 2. Trạng thái Loading của Nút bấm (Button Loading)

Component `Button` tại `src/components/ui/button.tsx` đã được tích hợp sẵn prop `isLoading`:

```tsx
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function SaveButton() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await apiCall()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button isLoading={isSubmitting} onClick={handleSubmit}>
      Lưu thay đổi
    </Button>
  )
}
```

*Khi `isLoading={true}`*:
- Nút sẽ tự động hiển thị biểu tượng quay `<Loader2 className="animate-spin" />`.
- Nút tự động bị disabled để chống người dùng click nhiều lần (prevent double submit).

---

## 3. Thông báo Hành động Thành công / Thất bại (Toast Feedback)

Sử dụng thư viện `sonner` đã được tích hợp sẵn trong `Providers`:

```tsx
import { toast } from 'sonner'

// Thông báo thành công
toast.success('Cập nhật dữ liệu thành công!')

// Thông báo lỗi
toast.error('Có lỗi xảy ra, vui lòng thử lại.')

// Thông báo dạng Promise tự động loading -> success/error
toast.promise(updateCourseService(id, payload), {
  loading: 'Đang lưu khóa học...',
  success: 'Đã lưu khóa học thành công!',
  error: (err) => `Lỗi: ${err.message || 'Không thể lưu'}`,
})
```
