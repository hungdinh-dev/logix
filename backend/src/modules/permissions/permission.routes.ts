import { Router } from 'express'
import { permissionController } from './permission.controller'
import { asyncHandler } from '../../common/utils/async-handler'
import { authenticateToken } from '../../middlewares/auth.middleware'

const router = Router()

router.get('/', authenticateToken, asyncHandler(permissionController.getAllPermissions))

export default router
