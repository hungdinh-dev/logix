import type { Metadata } from 'next'
import CourseCatalog from '@/features/lms/demo-ui/pages/CourseCatalog'

export const metadata: Metadata = { title: 'Demo: Courses | LogiX' }

export default function Page() {
  return <CourseCatalog />
}
