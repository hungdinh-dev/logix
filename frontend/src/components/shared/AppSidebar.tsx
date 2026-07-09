'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  ArrowLeftRight,
  Landmark,
  BarChart3,
  TrendingUp,
  Plug2,
  Users,
  Package,
  Settings,
  Search,
  ChevronDown,
  Bell,
  FileText,
  Receipt,
  CreditCard,
  Building2,
  AlertCircle,
  PieChart,
  Activity,
  Target,
  History,
  GitBranch,
  UserCog,
  Boxes,
  ArrowUpDown,
  Calculator,
  BookMarked,
  MapPin,
  Clock,
  Sun,
  Moon,
  Monitor,
  Globe,
  LogOut,
  User as UserIcon,
  type LucideIcon,
} from 'lucide-react'
import { useState, Suspense, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { routePath } from '@/config/route-path'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/features/auth/hooks/use-auth'

// ─── Types ────────────────────────────────────────────────────────────────────

type NavLeaf = {
  kind: 'leaf'
  icon: LucideIcon
  label: string
  href: string
  badge?: number
}

type NavGroup = {
  kind: 'group'
  icon: LucideIcon
  label: string
  children: NavLeaf[]
}

type NavItem = NavLeaf | NavGroup

// ─── Navigation tree ──────────────────────────────────────────────────────────

const NAV_TREE: NavItem[] = [
  {
    kind: 'leaf',
    icon: LayoutDashboard,
    label: 'sidebar.overview',
    href: routePath.dashboard,
  },
  {
    kind: 'leaf',
    icon: BookOpen,
    label: 'sidebar.courses',
    href: routePath.courses,
  },
  {
    kind: 'leaf',
    icon: Activity,
    label: 'sidebar.progress',
    href: routePath.progress,
  },
]

// ─── NavLeafButton ────────────────────────────────────────────────────────────

function NavLeafButton({
  icon: Icon,
  label,
  badge,
  active,
  indent,
  onClick,
}: {
  icon: LucideIcon
  label: string
  badge?: number
  active: boolean
  indent: boolean
  onClick: () => void
}) {
  const { t } = useTranslation()

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={cn(
        'flex h-[30px] w-full cursor-pointer items-center gap-2 rounded-md text-[12px] font-normal transition-colors duration-[120ms]',
        indent ? 'pr-2 pl-5' : 'px-2',
        'border-l-2',
        active
          ? 'bg-primary/15 text-primary border-l-primary hover:bg-primary/20 hover:text-primary font-semibold'
          : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent border-transparent'
      )}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="flex-1 truncate text-left">{t(label)}</span>
      {badge != null && (
        <span className="bg-primary text-primary-foreground shrink-0 rounded-full px-1.5 py-px text-[10px] leading-none font-medium">
          {badge}
        </span>
      )}
    </Button>
  )
}

// ─── NavGroupSection ──────────────────────────────────────────────────────────

function NavGroupSection({
  group,
  pathname,
  onNavigate,
}: {
  group: NavGroup
  pathname: string
  onNavigate: (href: string) => void
}) {
  const { t } = useTranslation()
  const searchParams = useSearchParams()

  const isChildActive = (href: string) => {
    const [hrefPath, hrefQuery] = href.split('?')
    if (hrefQuery) {
      if (pathname !== hrefPath) return false
      const hrefParams = new URLSearchParams(hrefQuery)
      return [...hrefParams.entries()].every(([k, v]) => searchParams.get(k) === v)
    }
    return (
      pathname === hrefPath &&
      !group.children.some((sibling) => {
        if (sibling.href === href) return false
        const [sibPath, sibQuery] = sibling.href.split('?')
        if (!sibQuery || sibPath !== hrefPath) return false
        const sibParams = new URLSearchParams(sibQuery)
        return [...sibParams.entries()].every(([k, v]) => searchParams.get(k) === v)
      })
    )
  }

  const isAnyChildActive = group.children.some((c) => isChildActive(c.href))
  const [open, setOpen] = useState(isAnyChildActive)
  const GroupIcon = group.icon

  return (
    <div>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex h-[30px] w-full cursor-pointer items-center gap-2 rounded-md px-2 text-[12px] font-medium transition-colors duration-[120ms]',
          isAnyChildActive
            ? 'text-sidebar-foreground bg-sidebar-accent/50 font-semibold'
            : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
        )}
        aria-expanded={open}
      >
        <GroupIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate text-left">{t(group.label)}</span>
        <ChevronDown
          className={cn('h-3 w-3 shrink-0 transition-transform duration-150', open && 'rotate-180')}
          aria-hidden="true"
        />
      </Button>

      {open && (
        <div className="mt-0.5 flex flex-col gap-0.5">
          {group.children.map((child) => (
            <NavLeafButton
              key={child.href}
              icon={child.icon}
              label={child.label}
              badge={child.badge}
              active={isChildActive(child.href)}
              indent
              onClick={() => onNavigate(child.href)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── AppSidebar ───────────────────────────────────────────────────────────────

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { user, logout } = useAuth()

  const displayName = user?.name || 'Huy Q.'
  const displayEmail = user?.email || 'huyq@digifnb.com'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleLanguageChange = (lang: 'vi' | 'en') => {
    i18n.changeLanguage(lang)
    localStorage.setItem('i18nextLng', lang)
  }

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi'
    i18n.changeLanguage(nextLang)
    localStorage.setItem('i18nextLng', nextLang)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const isEn = i18n.language === 'en'

  const themeList = [
    { value: 'light', label: isEn ? 'Light' : 'Sáng', icon: Sun },
    { value: 'dark', label: isEn ? 'Dark' : 'Tối', icon: Moon },
    { value: 'system', label: isEn ? 'System' : 'Hệ thống', icon: Monitor },
  ]

  return (
    <aside
      className="border-sidebar-border bg-sidebar text-sidebar-foreground fixed top-0 left-0 z-50 flex h-screen shrink-0 flex-col overflow-hidden border-r"
      style={{ width: 240 }}
      aria-label="Main navigation"
    >
      {/* Workspace header */}
      <Button
        type="button"
        variant="ghost"
        className="hover:bg-sidebar-accent text-sidebar-foreground flex h-[52px] w-full shrink-0 cursor-pointer items-center gap-2 rounded-md px-3 transition-colors duration-[120ms]"
      >
        <span
          className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white"
          aria-hidden="true"
        >
          L
        </span>
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <span className="text-sidebar-foreground w-full truncate text-left text-[13px] font-semibold">
            LogiX LMS
          </span>
          <span className="text-sidebar-foreground/45 w-full truncate text-left text-[10px]">
            v1.0.0
          </span>
        </div>
        <ChevronDown className="text-sidebar-foreground/45 h-3.5 w-3.5 shrink-0" />
      </Button>

      {/* Search bar */}
      <div className="mb-1 shrink-0 px-2">
        <div className="bg-sidebar-accent/40 border-sidebar-border/60 text-sidebar-foreground/60 flex h-[28px] cursor-text items-center gap-2 rounded-md border px-2.5 text-[12px]">
          <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{t('sidebar.search_placeholder')}</span>
        </div>
      </div>

      {/* Scrollable nav */}
      <div
        className="mt-1 min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-1"
        style={{ scrollbarWidth: 'none' }}
      >
        <nav className="flex flex-col gap-0.5 pb-2" aria-label="Site navigation">
          {NAV_TREE.map((item) => {
            if (item.kind === 'leaf') {
              return (
                <NavLeafButton
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                  active={pathname === item.href}
                  indent={false}
                  onClick={() => router.push(item.href)}
                />
              )
            }
            return (
              <Suspense key={item.label} fallback={null}>
                <NavGroupSection
                  group={item}
                  pathname={pathname}
                  onNavigate={(href) => router.push(href)}
                />
              </Suspense>
            )
          })}
        </nav>
      </div>

      {/* Export button + Utilities */}
      <div className="border-sidebar-border/20 flex shrink-0 items-center gap-1 border-t px-2 pt-2 pb-2">
        <Button
          type="button"
          className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 flex-1 cursor-pointer gap-1 truncate px-2 text-[12px] font-medium shadow-sm"
          aria-label={t('sidebar.export_report')}
        >
          {t('sidebar.export_report')}
        </Button>

        {/* Quick Language Toggle */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleLanguage}
          className="text-sidebar-foreground/45 hover:bg-sidebar-accent hover:text-sidebar-foreground h-8 w-8 shrink-0 cursor-pointer"
          title={isEn ? 'Switch to Vietnamese' : 'Chuyển sang Tiếng Anh'}
        >
          <Globe className="h-4 w-4 shrink-0" />
        </Button>

        {/* Quick Theme Toggle */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-sidebar-foreground/45 hover:bg-sidebar-accent hover:text-sidebar-foreground h-8 w-8 shrink-0 cursor-pointer"
          title={isEn ? 'Toggle theme' : 'Chuyển đổi giao diện'}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 shrink-0" />
          ) : (
            <Moon className="h-4 w-4 shrink-0" />
          )}
        </Button>

        {/* Notifications */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground/45 hover:bg-sidebar-accent hover:text-sidebar-foreground h-8 w-8 shrink-0 cursor-pointer"
          aria-label={t('sidebar.notifications')}
        >
          <Bell className="h-4 w-4 shrink-0" aria-hidden="true" />
        </Button>
      </div>

      {/* User row */}
      {mounted && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className="border-sidebar-border/30 hover:bg-sidebar-accent/50 text-sidebar-foreground/85 mx-1 mb-1 flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-md border-t px-3 transition-colors duration-[120ms]"
              role="button"
              tabIndex={0}
              aria-label={t('sidebar.user_account')}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={displayName}
                  className="h-[26px] w-[26px] shrink-0 rounded-full object-cover"
                />
              ) : (
                <span
                  className="bg-primary flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-white"
                  aria-hidden="true"
                >
                  {initials}
                </span>
              )}
              <span className="text-sidebar-foreground/80 flex-1 truncate text-[12px]">
                {displayName}
              </span>
              <ChevronDown className="text-sidebar-foreground/45 h-3 w-3 shrink-0" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="start" side="top" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-foreground text-sm leading-none font-semibold">{displayName}</p>
                <p className="text-muted-foreground pt-0.5 text-xs leading-none">{displayEmail}</p>
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
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('sidebar.logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </aside>
  )
}
