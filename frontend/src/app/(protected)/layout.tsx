'use client'

import { usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/shared/AppSidebar'
import { Header } from '@/components/shared/Header'
import { AuthGuard } from '@/features/auth/components/AuthGuard'
import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/stores/sidebar.store'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLessonPlayer = pathname?.includes('/lessons/')
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)

  if (isLessonPlayer) {
    return (
      <AuthGuard>
        <div className="bg-background text-foreground flex h-screen overflow-hidden transition-colors duration-200">
          <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
            <Header />
            <main className="bg-background text-foreground flex-1 overflow-hidden">{children}</main>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="bg-background text-foreground flex h-screen overflow-hidden transition-colors duration-200">
        <AppSidebar />
        <div
          className={cn(
            'flex h-full min-w-0 flex-1 flex-col overflow-hidden transition-[margin] duration-200 ease-in-out',
            isCollapsed ? 'ml-[64px]' : 'ml-[240px]'
          )}
        >
          <Header />
          <main className="bg-background text-foreground flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
