import { Router } from 'express'
import { authController } from './auth.controller'
import { loginSchema, refreshTokenSchema } from './auth.dto'
import { validateRequest } from '../../common/middlewares/validate.middleware'
import { asyncHandler } from '../../common/utils/async-handler'
import { authenticateToken } from '../../middlewares/auth.middleware'

const router = Router()

router.post('/login', validateRequest(loginSchema), asyncHandler(authController.login))
router.post('/refresh', validateRequest(refreshTokenSchema), asyncHandler(authController.refreshToken))
router.get('/me', authenticateToken, asyncHandler(authController.getProfile))
router.post('/logout', authenticateToken, asyncHandler(authController.logout))

export default router
