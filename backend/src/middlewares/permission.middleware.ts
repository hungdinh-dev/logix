import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from './auth.middleware'
import { getUserPermissions } from '../services/permission.service'

/**
 * Higher-order middleware kiểm tra xem User hiện tại có sở hữu `permissionCode` hay không.
 */
export const requirePermission = (permissionCode: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: Vui lòng đăng nhập trước' })
      }

      const userPermissions = await getUserPermissions(userId)

      if (!userPermissions.has(permissionCode)) {
        return res.status(403).json({
          error: `Forbidden: Bạn không có quyền [${permissionCode}] để thực hiện thao tác này.`,
        })
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
