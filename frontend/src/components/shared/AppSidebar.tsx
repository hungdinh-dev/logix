'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Award,
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
  FolderTree,
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
  Shield,
  Sparkles,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  PanelLeftClose,
  PanelLeft,
  type LucideIcon,
} from 'lucide-react'
import { useState, Suspense, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { routePath } from '@/config/route-path'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { useSidebarStore } from '@/stores/sidebar.store'

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

type NavSectionHeader = {
  kind: 'header'
  label: string
}

type NavItem = NavLeaf | NavGroup | NavSectionHeader

// ─── Navigation trees ──────────────────────────────────────────────────────────

const LMS_LEARNER_NAV_TREE: NavItem[] = [
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
  {
    kind: 'leaf',
    icon: FileText,
    label: 'sidebar.reports',
    href: routePath.reports,
  },
  {
    kind: 'header',
    label: 'Quy trình & Tiện ích',
  },
  {
    kind: 'leaf',
    icon: Sparkles,
    label: 'Quy trình Onboarding',
    href: routePath.onboarding,
  },
]

const LMS_ADMIN_NAV_TREE: NavItem[] = [
  {
    kind: 'leaf',
    icon: LayoutDashboard,
    label: 'Tổng quan Đào tạo',
    href: routePath.lmsAdminDashboard,
  },
  { kind: 'header', label: 'Quản lý Đào tạo' },
  { kind: 'leaf', icon: BookOpen, label: 'Quản lý Khóa học', href: routePath.lmsAdminCourses },
  { kind: 'leaf', icon: FolderTree, label: 'Danh mục Chương trình', href: routePath.lmsAdminCourseCategories },
  { kind: 'leaf', icon: Award, label: 'Quản lý Chứng chỉ & ATTP', href: routePath.lmsAdminCertificates },
  { kind: 'leaf', icon: Activity, label: 'Theo dõi Tiến độ', href: routePath.lmsAdminProgress },
  { kind: 'leaf', icon: FileText, label: 'Soạn thảo Bài giảng', href: routePath.lessonCreate },

  { kind: 'header', label: 'Giao diện Demo UI (Showcase)' },
  { kind: 'leaf', icon: LayoutDashboard, label: 'Demo: Dashboard', href: routePath.lmsAdminDemoDashboard },
  { kind: 'leaf', icon: BookOpen, label: 'Demo: Khóa học (API)', href: routePath.lmsAdminDemoCourses },
  { kind: 'leaf', icon: FolderTree, label: 'Demo: Khám phá Catalog', href: routePath.lmsAdminDemoCatalog },
  { kind: 'leaf', icon: BookMarked, label: 'Demo: Chi tiết Khóa học', href: routePath.lmsAdminDemoCourseDetail },
  { kind: 'leaf', icon: GraduationCap, label: 'Demo: Trình phát Bài giảng', href: routePath.lmsAdminDemoLessonPlayer },
  { kind: 'leaf', icon: FileText, label: 'Demo: Bài kiểm tra (Quiz)', href: routePath.lmsAdminDemoQuiz },
  { kind: 'leaf', icon: Activity, label: 'Demo: Báo cáo Tiến độ', href: routePath.lmsAdminDemoProgress },
]

const SYSTEM_ADMIN_NAV_TREE: NavItem[] = [
  {
    kind: 'leaf',
    icon: LayoutDashboard,
    label: 'Tổng quan Hệ thống',
    href: routePath.adminDashboard,
  },
  { kind: 'header', label: 'Phân quyền & Vai trò' },
  { kind: 'leaf', icon: Shield, label: 'Vai trò (Roles)', href: routePath.adminRoles },
  { kind: 'leaf', icon: UserCog, label: 'Phân quyền (Permissions)', href: routePath.adminPermissions },
  { kind: 'leaf', icon: GitBranch, label: 'Cây phân quyền (Hierarchy)', href: routePath.adminRoleHierarchy },

  { kind: 'header', label: 'Tổ chức & Nhân sự' },
  { kind: 'leaf', icon: Building2, label: 'Sơ đồ Tổ chức (Departments)', href: routePath.adminDepartments },
  { kind: 'leaf', icon: Users, label: 'Nhân sự (Employees)', href: routePath.adminEmployees },
  { kind: 'leaf', icon: Target, label: 'Cấp bậc (Job Levels)', href: routePath.adminJobLevels },
  { kind: 'leaf', icon: Boxes, label: 'Trường tùy chỉnh', href: routePath.adminCustomFields },
]

// ─── NavLeafButton ────────────────────────────────────────────────────────────

function NavLeafButton({
  icon: Icon,
  label,
  badge,
  active,
  indent,
  href,
  isCollapsed,
}: {
  icon: LucideIcon
  label: string
  badge?: number
  active: boolean
  indent: boolean
  href: string
  isCollapsed: boolean
}) {
  const { t } = useTranslation()
  const translatedLabel = t(label)

  const content = (
    <Link
      href={href}
      className={cn(
        'flex h-[34px] w-full cursor-pointer items-center rounded-md text-[12px] font-normal transition-all duration-150',
        isCollapsed
          ? 'justify-center px-0'
          : indent
          ? 'pr-2 pl-5 gap-2.5 border-l-2'
          : 'px-2.5 gap-2.5 border-l-2',
        active
          ? 'bg-primary/15 text-primary border-l-primary hover:bg-primary/20 hover:text-primary font-semibold'
          : 'text-sidebar-foreground/65 hover:text-sidebar-foreground hover:bg-sidebar-accent border-transparent'
      )}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className={cn('shrink-0 transition-transform', isCollapsed ? 'h-4 w-4' : 'h-3.5 w-3.5')} aria-hidden="true" />
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate text-left">{translatedLabel}</span>
          {badge != null && (
            <span className="bg-primary text-primary-foreground shrink-0 rounded-full px-1.5 py-px text-[10px] leading-none font-medium">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  )

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2 font-medium">
          <span>{translatedLabel}</span>
          {badge != null && (
            <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-[10px] leading-none">
              {badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}

// ─── NavGroupSection ──────────────────────────────────────────────────────────

function NavGroupSection({
  group,
  pathname,
  isCollapsed,
}: {
  group: NavGroup
  pathname: string
  isCollapsed: boolean
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
  const translatedGroupLabel = t(group.label)

  if (isCollapsed) {
    return (
      <div className="flex flex-col gap-0.5">
        {group.children.map((child) => (
          <NavLeafButton
            key={child.href}
            icon={child.icon}
            label={child.label}
            badge={child.badge}
            active={isChildActive(child.href)}
            indent={false}
            href={child.href}
            isCollapsed={true}
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex h-[32px] w-full cursor-pointer items-center gap-2 rounded-md px-2.5 text-[12px] font-medium transition-colors duration-[120ms]',
          isAnyChildActive
            ? 'text-sidebar-foreground bg-sidebar-accent/50 font-semibold'
            : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
        )}
        aria-expanded={open}
      >
        <GroupIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate text-left">{translatedGroupLabel}</span>
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
              href={child.href}
              isCollapsed={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── NavSectionTitle ─────────────────────────────────────────────────────────

function NavSectionTitle({ label, isCollapsed }: { label: string; isCollapsed: boolean }) {
  if (isCollapsed) {
    return <div className="my-2 mx-auto w-6 border-t border-sidebar-border/40" />
  }
  return (
    <div className="px-2.5 pt-3.5 pb-1 text-[10px] font-bold tracking-wider text-sidebar-foreground/45 uppercase">
      {label}
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
  const { user, role } = useAuth()
  const { isCollapsed, toggleCollapse } = useSidebarStore()

  const normRole = String(role || user?.role || (user?.roles && user.roles[0]) || '').toUpperCase()
  const isAdmin = normRole === 'ADMIN' || normRole === 'SUPER_ADMIN'

  const isSystemAdminSection = pathname?.startsWith('/admin')
  const isLmsAdminSection = pathname?.startsWith('/lms/admin')

  const currentNavTree = isSystemAdminSection
    ? SYSTEM_ADMIN_NAV_TREE
    : isLmsAdminSection
    ? LMS_ADMIN_NAV_TREE
    : LMS_LEARNER_NAV_TREE

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi'
    i18n.changeLanguage(nextLang)
    localStorage.setItem('i18nextLng', nextLang)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const isEn = mounted ? i18n.language === 'en' : false

  const headerTitle = isSystemAdminSection
    ? 'LogiX Admin'
    : isLmsAdminSection
    ? 'LogiX LMS Admin'
    : 'LogiX LMS'

  const headerSubtitle = isSystemAdminSection
    ? (isEn ? 'System & Org Console' : 'Quản trị Hệ thống')
    : isLmsAdminSection
    ? (isEn ? 'Training Management' : 'Quản trị Đào tạo')
    : (isEn ? 'Learning Portal' : 'Cổng Học tập')

  return (
    <TooltipProvider delayDuration={50}>
      <aside
        className={cn(
          'border-sidebar-border bg-sidebar text-sidebar-foreground fixed top-0 left-0 z-50 flex h-screen shrink-0 flex-col overflow-hidden border-r transition-[width] duration-200 ease-in-out select-none',
          isCollapsed ? 'w-[64px]' : 'w-[240px]'
        )}
        aria-label="Main navigation"
      >
        {/* 1. Workspace Header with Collapse Toggle */}
        <div className="border-sidebar-border/30 flex h-[52px] w-full shrink-0 items-center justify-between border-b px-2.5">
          <div className="flex min-w-0 items-center gap-2.5 overflow-hidden">
            <div
              className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm text-sm font-bold text-white cursor-pointer"
              onClick={toggleCollapse}
              title={isCollapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
              aria-hidden="true"
            >
              {isSystemAdminSection ? <Shield className="h-4.5 w-4.5" /> : <GraduationCap className="h-4.5 w-4.5" />}
            </div>

            {!isCollapsed && (
              <div className="flex min-w-0 flex-1 flex-col items-start overflow-hidden">
                <span className="text-sidebar-foreground w-full truncate text-left text-[13px] font-semibold leading-tight">
                  {headerTitle}
                </span>
                <span className="text-sidebar-foreground/50 w-full truncate text-left text-[10px] font-medium leading-tight">
                  {headerSubtitle}
                </span>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          {/* <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent h-7 w-7 shrink-0 cursor-pointer"
            title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {isCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button> */}
        </div>

        {/* 2. Switch Mode Shortcuts */}
        {isAdmin && (
          <div className={cn('p-2 pb-1 flex flex-col gap-1', isCollapsed && 'px-1')}>
            {isSystemAdminSection && (
              isCollapsed ? (
                <Tooltip delayDuration={50}>
                  <TooltipTrigger asChild>
                    <Link
                      href={routePath.lmsAdminDashboard}
                      className="border border-sidebar-border/70 hover:bg-sidebar-accent hover:text-sidebar-foreground text-sidebar-foreground/75 h-8 w-full cursor-pointer flex items-center justify-center rounded-md transition-colors"
                    >
                      <GraduationCap className="h-4 w-4 text-primary" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <span>{isEn ? 'LMS Admin Portal' : 'Quản trị Đào tạo (LMS)'}</span>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  href={routePath.lmsAdminDashboard}
                  className="border border-sidebar-border/70 hover:bg-sidebar-accent hover:text-sidebar-foreground text-sidebar-foreground/75 h-7 w-full cursor-pointer flex items-center justify-between px-2 text-[11px] font-medium rounded-md transition-colors"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <GraduationCap className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="truncate">{isEn ? 'LMS Admin Portal' : 'Quản trị Đào tạo (LMS)'}</span>
                  </span>
                  <ArrowRight className="h-3 w-3 shrink-0 text-sidebar-foreground/45" />
                </Link>
              )
            )}

            {isLmsAdminSection && (
              isCollapsed ? (
                <>
                  <Tooltip delayDuration={50}>
                    <TooltipTrigger asChild>
                      <Link
                        href={routePath.dashboard}
                        className="border border-sidebar-border/70 hover:bg-sidebar-accent hover:text-sidebar-foreground text-sidebar-foreground/75 h-8 w-full cursor-pointer flex items-center justify-center rounded-md transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4 text-primary" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <span>{isEn ? 'Learner Portal' : 'Về Cổng Học viên'}</span>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip delayDuration={50}>
                    <TooltipTrigger asChild>
                      <Link
                        href={routePath.adminDashboard}
                        className="border border-sidebar-border/70 hover:bg-sidebar-accent hover:text-sidebar-foreground text-sidebar-foreground/75 h-8 w-full cursor-pointer flex items-center justify-center rounded-md transition-colors"
                      >
                        <Shield className="h-4 w-4 text-primary" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <span>{isEn ? 'System Admin' : 'Về Admin Tổng'}</span>
                    </TooltipContent>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Link
                    href={routePath.dashboard}
                    className="border border-sidebar-border/70 hover:bg-sidebar-accent hover:text-sidebar-foreground text-sidebar-foreground/75 h-7 w-full cursor-pointer flex items-center justify-start gap-1.5 px-2 text-[11px] font-medium rounded-md transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="truncate">{isEn ? 'Learner Portal' : 'Về Cổng Học viên'}</span>
                  </Link>
                  <Link
                    href={routePath.adminDashboard}
                    className="border border-sidebar-border/70 hover:bg-sidebar-accent hover:text-sidebar-foreground text-sidebar-foreground/75 h-7 w-full cursor-pointer flex items-center justify-start gap-1.5 px-2 text-[11px] font-medium rounded-md transition-colors"
                  >
                    <Shield className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="truncate">{isEn ? 'System Admin' : 'Về Admin Tổng'}</span>
                  </Link>
                </>
              )
            )}

            {!isSystemAdminSection && !isLmsAdminSection && (
              isCollapsed ? (
                <Tooltip delayDuration={50}>
                  <TooltipTrigger asChild>
                    <Link
                      href={routePath.lmsAdminDashboard}
                      className="border border-sidebar-border/70 hover:bg-sidebar-accent hover:text-sidebar-foreground text-sidebar-foreground/75 h-8 w-full cursor-pointer flex items-center justify-center rounded-md transition-colors"
                    >
                      <GraduationCap className="h-4 w-4 text-primary" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <span>{isEn ? 'LMS Admin Portal' : 'Trang Quản trị Đào tạo'}</span>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  href={routePath.lmsAdminDashboard}
                  className="border border-sidebar-border/70 hover:bg-sidebar-accent hover:text-sidebar-foreground text-sidebar-foreground/75 h-7 w-full cursor-pointer flex items-center justify-between px-2 text-[11px] font-medium rounded-md transition-colors"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <GraduationCap className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="truncate">{isEn ? 'LMS Admin Portal' : 'Trang Quản trị Đào tạo'}</span>
                  </span>
                  <ArrowRight className="h-3 w-3 shrink-0 text-sidebar-foreground/45" />
                </Link>
              )
            )}
          </div>
        )}

        {/* 3. Search Bar */}
        <div className={cn('mb-1 shrink-0', isCollapsed ? 'px-2' : 'px-2')}>
          {isCollapsed ? (
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="bg-sidebar-accent/40 border-sidebar-border/60 text-sidebar-foreground/60 flex h-[34px] w-full cursor-pointer items-center justify-center rounded-md border text-[12px] hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span>{t('sidebar.search_placeholder')}</span>
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="bg-sidebar-accent/40 border-sidebar-border/60 text-sidebar-foreground/60 flex h-[28px] cursor-text items-center gap-2 rounded-md border px-2.5 text-[12px]">
              <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{t('sidebar.search_placeholder')}</span>
            </div>
          )}
        </div>

        {/* 4. Scrollable Nav Tree */}
        <div
          className="mt-1 min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-1.5"
          style={{ scrollbarWidth: 'none' }}
        >
          <nav className="flex flex-col gap-0.5 pb-2" aria-label="Site navigation">
            {currentNavTree.map((item, index) => {
              if (item.kind === 'header') {
                return (
                  <NavSectionTitle
                    key={`header-${item.label}-${index}`}
                    label={item.label}
                    isCollapsed={isCollapsed}
                  />
                )
              }
              if (item.kind === 'leaf') {
                return (
                  <NavLeafButton
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    badge={item.badge}
                    active={pathname === item.href}
                    indent={false}
                    href={item.href}
                    isCollapsed={isCollapsed}
                  />
                )
              }
              return (
                <Suspense key={item.label} fallback={null}>
                  <NavGroupSection
                    group={item}
                    pathname={pathname}
                    isCollapsed={isCollapsed}
                  />
                </Suspense>
              )
            })}
          </nav>
        </div>

        {/* 5. Footer Utilities */}
        <div
          className={cn(
            'border-sidebar-border/20 flex shrink-0 items-center border-t p-2',
            isCollapsed ? 'flex-col gap-1.5 items-center' : 'gap-1'
          )}
        >
          {!isCollapsed && (
            <Button
              type="button"
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 flex-1 cursor-pointer gap-1 truncate px-2 text-[12px] font-medium shadow-sm"
              aria-label={t('sidebar.export_report')}
            >
              {t('sidebar.export_report')}
            </Button>
          )}

          {/* Quick Language Toggle with Tooltip */}
          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground h-8 w-8 shrink-0 cursor-pointer"
              >
                <Globe className="h-4 w-4 shrink-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <span>{isEn ? 'Switch to Vietnamese (Tiếng Việt)' : 'Chuyển sang English'}</span>
            </TooltipContent>
          </Tooltip>

          {/* Quick Theme Toggle with Tooltip */}
          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground h-8 w-8 shrink-0 cursor-pointer"
              >
                {mounted && theme === 'dark' ? (
                  <Sun className="h-4 w-4 shrink-0" />
                ) : (
                  <Moon className="h-4 w-4 shrink-0" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <span>{mounted && theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}</span>
            </TooltipContent>
          </Tooltip>

          {/* Notifications with Tooltip */}
          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground h-8 w-8 shrink-0 cursor-pointer"
                aria-label={t('sidebar.notifications')}
              >
                <Bell className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <span>{t('sidebar.notifications')}</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  )
}