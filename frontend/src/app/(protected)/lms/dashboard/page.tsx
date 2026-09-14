import type { Metadata } from 'next'
import LMSDashboardPage from '@/features/lms/demo-ui/pages/LMSDashboardPage'
// import LMSDashboardPage from '@/features/lms/pages/LMSDashboardPage'

export const metadata: Metadata = { title: 'LMS Dashboard | LogiX' }

export default function Page() {
  return <LMSDashboardPage />
}
