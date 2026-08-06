'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import {
  LogOut,
  User as UserIcon,
  Settings,
  Sun,
  Moon,
  Monitor,
  Globe,
  Layers,
  LogIn,
  UserPlus,
  Type,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { cn } from '@/lib/utils'

export function Header() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const { user, isAuthenticated, logout } = useAuth()

  const [mounted, setMounted] = useState(false)
  const [activeSize, setActiveSize] = useState('16px')

  // Avoid hydration mismatch for next-themes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)

    // Load saved font size preferences
    const savedSize = localStorage.getItem('lms-reader-font-size') || '16px'
    const savedCodeSize = localStorage.getItem('lms-code-font-size') || '13px'
    setActiveSize(savedSize)
    document.documentElement.style.setProperty('--lms-reader-font-size', savedSize)
    document.documentElement.style.setProperty('--lms-code-font-size', savedCodeSize)
  }, [])

  const changeFontSize = (size: string) => {
    setActiveSize(size)
    localStorage.setItem('lms-reader-font-size', size)
    document.documentElement.style.setProperty('--lms-reader-font-size', size)

    // Co-scale code playground font size
    let codeSize = '13px'
    if (size === '14px') codeSize = '12px'
    if (size === '16px') codeSize = '13px'
    if (size === '18px') codeSize = '14px'
    if (size === '20px') codeSize = '15px'
    document.documentElement.style.setProperty('--lms-code-font-size', codeSize)
    localStorage.setItem('lms-code-font-size', codeSize)
  }

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi'
    i18n.changeLanguage(nextLang)
    localStorage.setItem('i18nextLng', nextLang)
  }

  const handleLanguageChange = (lang: 'vi' | 'en') => {
    i18n.changeLanguage(lang)
    localStorage.setItem('i18nextLng', lang)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isEn = mounted ? i18n.language === 'en' : false
  const showAuthenticated = mounted && isAuthenticated

  const fontSizes = [
    { value: '14px', label: isEn ? 'Small' : 'Nhỏ', desc: '14px' },
    { value: '16px', label: isEn ? 'Medium' : 'Vừa', desc: '16px' },
    { value: '18px', label: isEn ? 'Large' : 'Lớn', desc: '18px' },
    { value: '20px', label: isEn ? 'Extra Large' : 'Rất lớn', desc: '20px' },
  ]

  // User details fallback
  const displayName = user?.name || 'Huy Q.'
  const displayEmail = user?.email || 'huyq@digifnb.com'
  const userRole = user?.role || 'ADMIN'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Theme translation list
  const themeList = [
    { value: 'light', label: isEn ? 'Light' : 'Sáng', icon: Sun },
    { value: 'dark', label: isEn ? 'Dark' : 'Tối', icon: Moon },
    { value: 'system', label: isEn ? 'System' : 'Hệ thống', icon: Monitor },
  ]

  return (
    <header className="bg-background/80 sticky top-0 z-40 h-14 w-full shrink-0 border-b backdrop-blur-md transition-colors duration-200">
      <div className="flex h-14 w-full items-center justify-between px-6">
        {/* --- LEFT AREA: BRANDING OR TITLE --- */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 outline-none">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg shadow-md transition-transform hover:scale-105">
              <UserIcon className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-primary">Logi</span>
              <span className="text-foreground">X</span>
            </span>
          </Link>
        </div>

        {/* --- RIGHT AREA: UTILITIES & ACTIONS --- */}
        <div className="flex items-center gap-3">
          {/* Quick settings (always visible) */}
          {mounted && (
            <div className="flex items-center gap-1.5">
              {/* Quick Language Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="text-muted-foreground hover:text-foreground h-9 w-9 cursor-pointer"
                title={isEn ? 'Switch to Vietnamese' : 'Chuyển sang Tiếng Anh'}
              >
                <Globe className="h-5 w-5" />
              </Button>

              {/* Quick Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-muted-foreground hover:text-foreground h-9 w-9 cursor-pointer"
                title={isEn ? 'Toggle theme' : 'Chuyển đổi giao diện'}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* Quick Font Size Configuration */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground h-9 w-9 cursor-pointer"
                    title={isEn ? 'Font Size Settings' : 'Cấu hình cỡ chữ bài học'}
                  >
                    <Type className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel className="text-xs font-semibold">
                    {isEn ? 'Reader Font Size' : 'Cỡ chữ bài đọc'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {fontSizes.map((size) => (
                    <DropdownMenuItem
                      key={size.value}
                      onClick={() => changeFontSize(size.value)}
                      className={cn(
                        "cursor-pointer flex items-center justify-between text-xs",
                        activeSize === size.value && "font-semibold text-primary"
                      )}
                    >
                      <span>{size.label}</span>
                      <span className="text-[10px] text-muted-foreground">{size.desc}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Separator orientation="vertical" className="mx-1 h-6" />
            </div>
          )}

          {/* User Auth Menu (Dropdown / Login-Signup buttons) */}
          {showAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="border-border/85 hover:bg-muted relative h-9 w-9 cursor-pointer rounded-full border p-0"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={displayName} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-foreground text-sm leading-none font-semibold">
                        {displayName}
                      </p>
                      <span className="bg-primary/15 text-primary rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                        {userRole}
                      </span>
                    </div>
                    <p className="text-muted-foreground truncate pt-0.5 text-xs leading-none">
                      {displayEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>{isEn ? 'My Profile' : 'Hồ sơ cá nhân'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{isEn ? 'Settings' : 'Cài đặt'}</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                {/* Submenu for Theme Choice */}
                {mounted && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                      {theme === 'dark' ? (
                        <Moon className="mr-2 h-4 w-4" />
                      ) : theme === 'light' ? (
                        <Sun className="mr-2 h-4 w-4" />
                      ) : (
                        <Monitor className="mr-2 h-4 w-4" />
                      )}
                      <span>{t('sidebar.appearance')}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {themeList.map((tItem) => {
                        const Icon = tItem.icon
                        return (
                          <DropdownMenuItem
                            key={tItem.value}
                            onClick={() => setTheme(tItem.value)}
                            className={cn(
                              'cursor-pointer',
                              theme === tItem.value && 'bg-accent font-semibold'
                            )}
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            <span>{tItem.label}</span>
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}

                {/* Submenu for Language Choice */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    <Globe className="mr-2 h-4 w-4" />
                    <span>{t('sidebar.language')}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => handleLanguageChange('vi')}
                      className={cn(
                        'cursor-pointer',
                        i18n.language === 'vi' && 'bg-accent font-semibold'
                      )}
                    >
                      <span className="mr-2">🇻🇳</span>
                      <span>Tiếng Việt</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleLanguageChange('en')}
                      className={cn(
                        'cursor-pointer',
                        i18n.language === 'en' && 'bg-accent font-semibold'
                      )}
                    >
                      <span className="mr-2">🇬🇧</span>
                      <span>English</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />

                {/* Logout Button */}
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/20"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('sidebar.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden cursor-pointer sm:inline-flex"
              >
                <Link href="/login">
                  <LogIn className="mr-1.5 h-4 w-4" />
                  {isEn ? 'Login' : 'Đăng nhập'}
                </Link>
              </Button>
              <Button size="sm" asChild className="cursor-pointer shadow-sm">
                <Link href="/login">
                  <UserPlus className="mr-1.5 h-4 w-4" />
                  {isEn ? 'Sign Up' : 'Đăng ký'}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
