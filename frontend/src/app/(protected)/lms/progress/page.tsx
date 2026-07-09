import type { Metadata } from 'next'
import LearnerProgressPage from '@/features/lms/pages/LearnerProgressPage'

export const metadata: Metadata = { title: 'My Progress | LogiX' }

export default function Page() {
  return <LearnerProgressPage />
}
