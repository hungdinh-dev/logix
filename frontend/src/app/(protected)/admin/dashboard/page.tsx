import type { Metadata } from 'next'
import AdminDashboardPage from '@/features/lms/lms-dashboard/pages/AdminDashboardPage'

export const metadata: Metadata = {
  title: 'Tổng quan Quản trị | Admin LogiX LMS',
  description: 'Báo cáo tổng hợp số liệu học tập, tiến độ khóa học và hoạt động nhân sự',
}

export default function Page() {
  return <AdminDashboardPage />
}
