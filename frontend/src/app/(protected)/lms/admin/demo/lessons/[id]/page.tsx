import type { Metadata } from 'next'
import LessonPlayerPage from '@/features/lms/demo-ui/pages/LessonPlayerPage'

export const metadata: Metadata = { title: 'Demo: Lesson Player | LogiX' }

export default function Page() {
  return <LessonPlayerPage />
}
