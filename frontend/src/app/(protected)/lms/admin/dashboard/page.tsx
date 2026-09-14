import type { Metadata } from 'next'
import AdminDashboardPage from '@/features/lms/lms-dashboard/pages/AdminDashboardPage'

export const metadata: Metadata = {
  title: 'Tổng quan Đào tạo | LMS Admin LogiX',
  description: 'Báo cáo tổng hợp số liệu học tập, tiến độ khóa học và hoạt động đào tạo nhân sự',
}

export default function Page() {
  return <AdminDashboardPage />
}
