import { Router } from 'express'
import { jobLevelController } from './job-level.controller'
import { createJobLevelSchema, updateJobLevelSchema } from './job-level.dto'
import { validateRequest } from '../../common/middlewares/validate.middleware'
import { asyncHandler } from '../../common/utils/async-handler'
import { authenticateToken } from '../../middlewares/auth.middleware'

const router = Router()

router.get('/', authenticateToken, asyncHandler(jobLevelController.getAllJobLevels))
router.post(
  '/',
  authenticateToken,
  validateRequest(createJobLevelSchema),
  asyncHandler(jobLevelController.createJobLevel)
)
router.put(
  '/:id',
  authenticateToken,
  validateRequest(updateJobLevelSchema),
  asyncHandler(jobLevelController.updateJobLevel)
)
router.delete('/:id', authenticateToken, asyncHandler(jobLevelController.deleteJobLevel))

export default router
