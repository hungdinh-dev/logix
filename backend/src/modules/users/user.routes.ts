import { Router } from 'express'
import { userController } from './user.controller'
import { createUserSchema } from './user.dto'
import { validateRequest } from '../../common/middlewares/validate.middleware'
import { asyncHandler } from '../../common/utils/async-handler'
import { authenticateToken } from '../../middlewares/auth.middleware'

const router = Router()

router.get('/', authenticateToken, asyncHandler(userController.getAllUsers))
router.post(
  '/',
  authenticateToken,
  validateRequest(createUserSchema),
  asyncHandler(userController.createUser)
)

export default router
