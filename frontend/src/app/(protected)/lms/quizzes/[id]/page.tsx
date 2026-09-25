import type { Metadata } from 'next'
import QuizPage from '@/features/lms/demo-ui/pages/QuizPage'

export const metadata: Metadata = { title: 'Làm bài kiểm tra | LogiX' }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <QuizPage quizIdOrLessonId={id} />
}
