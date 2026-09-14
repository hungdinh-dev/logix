import { Role } from '@/features/auth/types/auth.types'
import type { RouteConfig } from './index'

// 🏢 System Admin routes ONLY — Quản trị hệ thống chung
// LMS routes → lms.routes.ts
// HR routes → hr.routes.ts
export const adminRoutes: RouteConfig[] = [
  { path: '/admin/roles', roles: [Role.ADMIN], label: 'Vai trò (Roles)', icon: 'Shield' },
  { path: '/admin/permissions', roles: [Role.ADMIN], label: 'Phân quyền (Permissions)', icon: 'UserCog' },
  { path: '/admin/role-hierarchy', roles: [Role.ADMIN], label: 'Cây phân quyền', icon: 'GitBranch' },
]
