import type { Metadata } from 'next'
import CourseDetailPage from '@/features/lms/pages/CourseDetailPage'

export const metadata: Metadata = { title: 'Course Details | LogiX' }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <CourseDetailPage courseId={id} />
}
