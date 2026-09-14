import { Router } from 'express'
import { customFieldController } from './custom-field.controller'
import { asyncHandler } from '../../common/utils/async-handler'
import { authenticateToken } from '../../middlewares/auth.middleware'

const router = Router()

router.get('/', authenticateToken, asyncHandler(customFieldController.getCustomFieldDefinitions))

export default router
