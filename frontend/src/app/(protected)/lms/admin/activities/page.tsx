import type { Metadata } from 'next'
import { LearningActivitiesPage } from '@/features/lms/activities'

export const metadata: Metadata = {
  title: 'Hoạt động Học tập Gần đây | LMS Admin LogiX',
  description: 'Nhật ký trực tiếp các hoạt động hoàn thành bài học, làm bài thi và ghi danh học tập của nhân sự',
}

export default function Page() {
  return <LearningActivitiesPage />
}
