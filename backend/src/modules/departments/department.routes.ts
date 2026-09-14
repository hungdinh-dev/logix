import { Router } from 'express'
import { departmentController } from './department.controller'
import { createDepartmentSchema, updateDepartmentSchema } from './department.dto'
import { validateRequest } from '../../common/middlewares/validate.middleware'
import { asyncHandler } from '../../common/utils/async-handler'
import { authenticateToken } from '../../middlewares/auth.middleware'

const router = Router()

router.get('/', authenticateToken, asyncHandler(departmentController.getDepartmentsList))
router.get('/tree', authenticateToken, asyncHandler(departmentController.getDepartmentTree))
router.post(
  '/',
  authenticateToken,
  validateRequest(createDepartmentSchema),
  asyncHandler(departmentController.createDepartment)
)
router.put(
  '/:id',
  authenticateToken,
  validateRequest(updateDepartmentSchema),
  asyncHandler(departmentController.updateDepartment)
)
router.delete('/:id', authenticateToken, asyncHandler(departmentController.deleteDepartment))
router.get(
  '/:departmentId/members',
  authenticateToken,
  asyncHandler(departmentController.getDepartmentMembers)
)

export default router
