import type { Metadata } from 'next'
import { LoginPages } from '@/features/auth/pages/LoginPages'

export const metadata: Metadata = { title: 'Đăng nhập' }

export default function LoginPage() {
  return <LoginPages />
}
