import type { Metadata } from 'next'
import LMSDashboardPage from '@/features/lms/demo-ui/pages/LMSDashboardPage'

export const metadata: Metadata = { title: 'Demo: LMS Dashboard | LogiX' }

export default function Page() {
  return <LMSDashboardPage />
}
