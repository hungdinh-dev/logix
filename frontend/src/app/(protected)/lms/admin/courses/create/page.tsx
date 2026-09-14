import type { Metadata } from 'next'
import { CourseCreatePage } from '@/features/lms/course-create'

export const metadata: Metadata = {
  title: 'Tạo Khóa học mới | LMS Admin LogiX',
  description: 'Wizard tạo khóa học mới theo các bước chuẩn hóa',
}

export default function Page() {
  return <CourseCreatePage />
}
