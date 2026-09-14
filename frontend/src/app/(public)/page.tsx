import type { Metadata } from 'next'
import { LandingPage } from '@/features/public'

export const metadata: Metadata = {
  title: 'LogiX — Hệ sinh thái Quản trị Nhân sự & Đào tạo Doanh nghiệp',
  description:
    'Nền tảng tích hợp Quản lý Học tập (LMS) và Quản trị Nhân sự (HRM) chuẩn hóa quy trình cho doanh nghiệp.',
}

export default function Page() {
  return <LandingPage />
}
