import type { Metadata } from 'next'
import { QuestionBankDetailPage } from '@/features/lms/question-banks'

export const metadata: Metadata = {
  title: 'Chi tiết Ngân hàng Câu hỏi | LMS Admin LogiX',
  description: 'Quản lý danh sách câu hỏi, đồng bộ Google Sheets, import file và xem lịch sử audit',
}

export default function Page() {
  return <QuestionBankDetailPage />
}
