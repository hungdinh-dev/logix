import { Role } from '@/features/auth/types/auth.types'
import type { RouteConfig } from './index'

export const userRoutes: RouteConfig[] = [
  {
    path: '/lms/dashboard',
    roles: [Role.ADMIN, Role.USER, Role.TRAINER, Role.STUDENT],
    label: 'Dashboard',
    icon: 'LayoutDashboard',
  },
  {
    path: '/lms/courses',
    roles: [Role.ADMIN, Role.USER, Role.TRAINER, Role.STUDENT],
    label: 'Khóa học',
    icon: 'BookOpen',
  },
  {
    path: '/lms/progress',
    roles: [Role.ADMIN, Role.USER, Role.TRAINER, Role.STUDENT],
    label: 'Tiến độ học tập',
    icon: 'Activity',
  },
  {
    path: '/lms/reports',
    roles: [Role.ADMIN, Role.USER, Role.TRAINER, Role.STUDENT],
    label: 'Báo cáo',
    icon: 'FileText',
  },
]
