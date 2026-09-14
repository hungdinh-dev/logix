import type { Metadata } from 'next'
import { CourseCategoriesAdminPage } from '@/features/lms/course-categories'

export const metadata: Metadata = {
  title: 'Danh mục Chương trình | LMS Admin LogiX',
  description: 'Quản lý cây danh mục và phân nhóm chương trình đào tạo',
}

export default function Page() {
  return <CourseCategoriesAdminPage />
}
