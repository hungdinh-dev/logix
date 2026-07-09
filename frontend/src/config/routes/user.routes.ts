import { Role } from '@/features/auth/types/auth.types'
import type { RouteConfig } from './index'

export const userRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    roles: [Role.ADMIN, Role.USER],
    label: 'Dashboard',
    icon: 'LayoutDashboard',
  },
  { path: '/hr', roles: [Role.ADMIN, Role.USER], label: 'Quản lý nhân sự', icon: 'UserCog' },
  { path: '/customers', roles: [Role.ADMIN, Role.USER], label: 'Khách hàng', icon: 'Users' },
  { path: '/leads', roles: [Role.ADMIN, Role.USER], label: 'Leads', icon: 'UserPlus' },
]
