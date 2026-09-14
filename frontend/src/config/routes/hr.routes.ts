import { Role } from '@/features/auth/types/auth.types'
import type { RouteConfig } from './index'

export const hrRoutes: RouteConfig[] = [
  { path: '/admin/employees', roles: [Role.ADMIN], label: 'Nhân sự (Employees)', icon: 'Users' },
  { path: '/admin/departments', roles: [Role.ADMIN], label: 'Sơ đồ Tổ chức (Departments)', icon: 'Building2' },
  { path: '/admin/job-levels', roles: [Role.ADMIN], label: 'Cấp bậc (Job Levels)', icon: 'Target' },
  { path: '/admin/custom-fields', roles: [Role.ADMIN], label: 'Trường tùy chỉnh', icon: 'Boxes' },
]
