import type { Metadata } from 'next'
import LearnerProgressPage from '@/features/lms/demo-ui/pages/LearnerProgressPage'

export const metadata: Metadata = { title: 'Demo: Progress | LogiX' }

export default function Page() {
  return <LearnerProgressPage />
}
