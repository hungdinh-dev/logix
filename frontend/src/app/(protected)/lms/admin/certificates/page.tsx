import type { Metadata } from 'next'
import { CertificatesAdminPage } from '@/features/lms/certificates-admin'

export const metadata: Metadata = {
  title: 'Quản Lý Chứng Chỉ & Tuân Thủ ATTP | LMS Admin LogiX',
  description: 'Quản lý cấp phát chứng chỉ đào tạo, mẫu phôi chuẩn và theo dõi hạn ATTP chuỗi Ba Hưng',
}

export default function Page() {
  return <CertificatesAdminPage />
}
