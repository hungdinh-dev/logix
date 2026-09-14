import type { Metadata } from 'next'
import QuizPage from '@/features/lms/demo-ui/pages/QuizPage'

export const metadata: Metadata = { title: 'Demo: Quiz | LogiX' }

export default function Page() {
  return <QuizPage />
}
