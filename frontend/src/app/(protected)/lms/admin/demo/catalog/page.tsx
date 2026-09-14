import type { Metadata } from 'next'
import LMSCatalogPage from '@/features/lms/demo-ui/pages/LMSCatalogPage'

export const metadata: Metadata = { title: 'Demo: LMS Catalog | LogiX' }

export default function Page() {
  return <LMSCatalogPage />
}
