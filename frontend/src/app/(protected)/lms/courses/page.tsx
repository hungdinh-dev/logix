import type { Metadata } from 'next'
import CourseCatalog from '@/features/lms/pages/CourseCatalog'

export const metadata: Metadata = { title: 'Courses | LogiX' }

export default function Page() {
  return <CourseCatalog />
}
