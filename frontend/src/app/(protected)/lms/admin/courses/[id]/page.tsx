import type { Metadata } from 'next'
import { CourseEditorPage } from '@/features/lms/course-editor'

export const metadata: Metadata = {
  title: 'Soạn thảo Giáo trình | LMS Admin LogiX',
  description: 'Soạn thảo module, bài giảng và câu hỏi trắc nghiệm của khóa học',
}

export default function Page() {
  return <CourseEditorPage />
}
