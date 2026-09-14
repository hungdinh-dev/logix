import type { Role } from '@/features/auth/types/auth.types'
import { userRoutes } from './user.routes'
import { adminRoutes } from './admin.routes'
import { lmsRoutes } from './lms.routes'
import { hrRoutes } from './hr.routes'

export interface RouteConfig {
  path: string
  roles: Role[]
  label: string
  icon?: string
}

// Thêm route domain mới: tạo file xxx.routes.ts → import vào đây
export const routesConfig: RouteConfig[] = [
  ...userRoutes,
  ...lmsRoutes,
  ...adminRoutes,
  ...hrRoutes,
]

export const getAllowedRoles = (pathname: string): Role[] => {
  const route = routesConfig.find((r) => pathname === r.path || pathname.startsWith(r.path + '/'))
  return route?.roles ?? []
}

export const isRouteAccessible = (pathname: string, role: string): boolean => {
  const normRole = (role || '').toUpperCase()
  const isAdmin = normRole === 'ADMIN' || normRole === 'SUPER_ADMIN'

  // Bất kỳ đường dẫn nào thuộc /admin đều yêu cầu quyền ADMIN
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return isAdmin
  }

  const allowed = getAllowedRoles(pathname)
  if (allowed.length === 0) return true
  if (isAdmin) return true
  return allowed.map((r) => String(r).toUpperCase()).includes(normRole)
}

export const getNavItems = (role: string): RouteConfig[] => {
  if (role === 'ADMIN') return routesConfig
  return routesConfig.filter((r) => r.roles.length === 0 || r.roles.includes(role as Role))
}
