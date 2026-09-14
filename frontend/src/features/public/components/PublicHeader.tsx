'use client'

import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { routePath } from '@/config/route-path'
import { ArrowRight, Globe, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'

export function PublicHeader() {
  const { theme, setTheme } = useTheme()
  const { i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi'
    i18n.changeLanguage(nextLang)
    localStorage.setItem('i18nextLng', nextLang)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Logo height={32} />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Tính năng</Link>
            <Link href="#solutions" className="hover:text-foreground transition-colors">Giải pháp LMS & HRM</Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">Quy trình</Link>
            <Link href="#testimonials" className="hover:text-foreground transition-colors">Khách hàng</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Đổi ngôn ngữ"
          >
            <Globe className="h-4 w-4" />
          </Button>

          {/* Theme toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Đổi giao diện"
          >
            {mounted && theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Link href={routePath.login}>
            <Button size="sm" className="gap-1.5 font-medium">
              <span>Đăng nhập</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
