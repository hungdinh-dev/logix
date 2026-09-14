import { Router } from 'express'
import { roleController } from './role.controller'
import {
  createRoleSchema,
  updateRoleSchema,
  assignPermissionsSchema,
  syncRoleUsersSchema,
} from './role.dto'
import { validateRequest } from '../../common/middlewares/validate.middleware'
import { asyncHandler } from '../../common/utils/async-handler'
import { authenticateToken } from '../../middlewares/auth.middleware'
import { requirePermission } from '../../middlewares/permission.middleware'

const router = Router()

router.get('/', authenticateToken, asyncHandler(roleController.getAllRoles))
router.get('/:id', authenticateToken, asyncHandler(roleController.getRoleById))
router.post(
  '/',
  authenticateToken,
  requirePermission('ROLE.MANAGE'),
  validateRequest(createRoleSchema),
  asyncHandler(roleController.createRole)
)
router.put(
  '/:id',
  authenticateToken,
  requirePermission('ROLE.MANAGE'),
  validateRequest(updateRoleSchema),
  asyncHandler(roleController.updateRole)
)
router.delete(
  '/:id',
  authenticateToken,
  requirePermission('ROLE.MANAGE'),
  asyncHandler(roleController.deleteRole)
)
router.put(
  '/:id/permissions',
  authenticateToken,
  requirePermission('ROLE.MANAGE'),
  validateRequest(assignPermissionsSchema),
  asyncHandler(roleController.assignPermissions)
)
router.get('/:roleId/permissions', authenticateToken, asyncHandler(roleController.getPermissionsByRoleId))
router.get('/:roleId/users', authenticateToken, asyncHandler(roleController.getUsersByRoleId))
router.put(
  '/:roleId/users',
  authenticateToken,
  requirePermission('ROLE.MANAGE'),
  validateRequest(syncRoleUsersSchema),
  asyncHandler(roleController.syncRoleUsers)
)

export default router
