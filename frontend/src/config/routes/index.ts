import type { Role } from '@/features/auth/types/auth.types'
import { userRoutes } from './user.routes'
import { adminRoutes } from './admin.routes'

export interface RouteConfig {
  path: string
  roles: Role[]
  label: string
  icon?: string
}

// Thêm role mới: tạo file xxx.routes.ts → import vào đây
export const routesConfig: RouteConfig[] = [...userRoutes, ...adminRoutes]

export const getAllowedRoles = (pathname: string): Role[] => {
  const route = routesConfig.find((r) => pathname === r.path || pathname.startsWith(r.path + '/'))
  return route?.roles ?? []
}

export const isRouteAccessible = (pathname: string, role: Role): boolean => {
  const allowed = getAllowedRoles(pathname)
  if (allowed.length === 0) return true
  return allowed.includes(role)
}

export const getNavItems = (role: Role): RouteConfig[] => {
  return routesConfig.filter((r) => r.roles.length === 0 || r.roles.includes(role))
}
