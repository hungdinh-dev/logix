'use client'

import { useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { LoginForm } from '@/features/auth/components/login/LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/shared/Logo'
import { routePath } from '@/config/route-path'

export function LoginPages() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(routePath.dashboard)
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || isAuthenticated) return null

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left panel — dark brand */}
      <div className="relative hidden flex-col justify-between bg-[#181715] p-12 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative">
          <Logo height={36} variant="dark" />
        </div>

        <div className="relative space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl leading-tight font-bold text-white">
              Quản lý quan hệ
              <br />
              <span className="text-[#cc785c]">khách hàng</span> thông minh
            </h1>
            <p className="text-lg text-[#a09d96]">
              Nền tảng CRM dành riêng cho ngành tài chính — ngân hàng
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { value: '10K+', label: 'Khách hàng' },
              { value: '99.9%', label: 'Uptime' },
              { value: '24/7', label: 'Hỗ trợ' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-[#a09d96]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-sm text-[#a09d96]">
          © {new Date().getFullYear()} DigiFNB. All rights reserved.
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex items-center justify-center bg-[#faf9f5] p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden">
            <Logo height={28} />
          </div>

          <Card className="border-[#e6dfd8] shadow-none">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
              <CardDescription>Nhập thông tin tài khoản để tiếp tục</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={null}>
                <LoginForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
