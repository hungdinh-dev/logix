import type { Metadata } from 'next'
import CourseDetailPage from '@/features/lms/demo-ui/pages/CourseDetailPage'

export const metadata: Metadata = { title: 'Demo: Course Detail | LogiX' }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <CourseDetailPage courseId={resolvedParams.id} />
}
