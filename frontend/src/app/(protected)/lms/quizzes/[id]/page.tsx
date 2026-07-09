import type { Metadata } from 'next'
import QuizPage from '@/features/lms/pages/QuizPage'

export const metadata: Metadata = { title: 'Quiz | LogiX' }

export default function Page() {
  return <QuizPage />
}
