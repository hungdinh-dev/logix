import type { Metadata } from 'next'
import { ProgressTrackingPage } from '@/features/lms/progress-tracking'

export const metadata: Metadata = {
  title: 'Theo dõi Tiến độ Đào tạo | LMS Admin LogiX',
  description: 'Theo dõi tiến độ, tỷ lệ hoàn thành và kết quả đào tạo của học viên theo phòng ban',
}

export default function Page() {
  return <ProgressTrackingPage />
}
