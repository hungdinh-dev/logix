import { Role } from '@/features/auth/types/auth.types'
import type { RouteConfig } from './index'

export const adminRoutes: RouteConfig[] = [
  { path: '/reports', roles: [Role.ADMIN], label: 'Báo cáo', icon: 'BarChart2' },
  { path: '/settings', roles: [Role.ADMIN], label: 'Cài đặt', icon: 'Settings' },
  { path: '/users', roles: [Role.ADMIN], label: 'Quản lý người dùng', icon: 'UserCog' },
]
