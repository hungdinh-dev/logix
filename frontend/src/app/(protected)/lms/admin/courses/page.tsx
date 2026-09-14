import type { Metadata } from 'next'
import { CoursesAdminPage } from '@/features/lms/courses-admin'

export const metadata: Metadata = {
  title: 'Quản lý Khóa học | LMS Admin LogiX',
  description: 'Danh sách và quản lý các khóa học, nội dung đào tạo trong hệ thống LogiX LMS',
}

export default function Page() {
  return <CoursesAdminPage />
}
