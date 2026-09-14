import type { Metadata } from 'next'
import { CourseTargetingAdminPage } from '@/features/lms/course-targeting'

export const metadata: Metadata = {
  title: 'Phân bổ Đối tượng | LMS Admin LogiX',
  description: 'Cấu hình phân bổ khóa học tự động theo phòng ban và cấp bậc nhân sự',
}

export default function Page() {
  return <CourseTargetingAdminPage />
}
