import type { Metadata } from 'next'
import CourseDetailPage from '@/features/lms/pages/CourseDetailPage'

export const metadata: Metadata = { title: 'Course Details | LogiX' }

export default function Page() {
  return <CourseDetailPage />
}
