import type { Metadata } from 'next'
import { QuestionBanksPage } from '@/features/lms/question-banks'

export const metadata: Metadata = {
  title: 'Ngân hàng Câu hỏi | LMS Admin LogiX',
  description: 'Quản lý kho câu hỏi trắc nghiệm, tích hợp đồng bộ Google Sheets 1-Click và xuất đề thi',
}

export default function Page() {
  return <QuestionBanksPage />
}
