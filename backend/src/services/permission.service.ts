import prisma from '../config/prisma'

// In-Memory Permission Cache (TTL 10 phút)
const memoryCache = new Map<string, { permissions: Set<string>; expiresAt: number }>()
const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes

/**
 * Lấy danh sách permissionCode mà User sở hữu (tính các UserRole đang Active, chưa bị Revoked/Expired)
 */
export const getUserPermissions = async (userId: string): Promise<Set<string>> => {
  const now = Date.now()

  // Check In-Memory Cache
  const cached = memoryCache.get(userId)
  if (cached && cached.expiresAt > now) {
    return cached.permissions
  }

  // Tra cứu DB
  const nowDate = new Date()
  const userRoles = await prisma.userRole.findMany({
    where: {
      userId,
      isActive: true,
      revokedAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gt: nowDate } }],
      role: { isActive: true },
    },
    select: { roleId: true },
  })

  const roleIds = userRoles.map((ur) => ur.roleId)
  if (roleIds.length === 0) {
    const emptySet = new Set<string>()
    memoryCache.set(userId, { permissions: emptySet, expiresAt: now + CACHE_TTL_MS })
    return emptySet
  }

  const rolePermissions = await prisma.rolePermission.findMany({
    where: {
      roleId: { in: roleIds },
      permission: { isActive: true },
    },
    select: {
      permission: {
        select: { permissionCode: true },
      },
    },
  })

  const permissionCodes = new Set(rolePermissions.map((rp) => rp.permission.permissionCode))

  // Set Memory Cache
  memoryCache.set(userId, { permissions: permissionCodes, expiresAt: now + CACHE_TTL_MS })

  return permissionCodes
}

/**
 * Invalidate cache cho các User thuộc một Role khi Role/Permission bị thay đổi
 */
export const invalidatePermissionCacheForRole = async (roleId: string): Promise<void> => {
  const userRoles = await prisma.userRole.findMany({
    where: { roleId, isActive: true },
    select: { userId: true },
  })

  userRoles.forEach((ur) => {
    memoryCache.delete(ur.userId)
  })
}

/**
 * Invalidate cache cho 1 User cụ thể
 */
export const invalidatePermissionCacheForUser = (userId: string): void => {
  memoryCache.delete(userId)
}
