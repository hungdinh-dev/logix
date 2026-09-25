import { Router } from 'express'
import { progressController } from './progress.controller'
import { updateLessonProgressSchema } from './progress.dto'
import { validateRequest } from '../../common/middlewares/validate.middleware'
import { asyncHandler } from '../../common/utils/async-handler'
import { authenticateToken } from '../../middlewares/auth.middleware'

const router = Router()

router.get('/dashboard', authenticateToken, asyncHandler(progressController.getDashboardProgress))
router.get('/admin-dashboard', authenticateToken, asyncHandler(progressController.getAdminDashboardStats))
router.get('/admin-tracking', authenticateToken, asyncHandler(progressController.getAdminProgressTracking))
router.get('/admin-activities', authenticateToken, asyncHandler(progressController.getAdminActivities))
router.get('/course/:courseId', authenticateToken, asyncHandler(progressController.getCourseProgress))
router.post(
  '/lesson',
  authenticateToken,
  validateRequest(updateLessonProgressSchema),
  asyncHandler(progressController.updateLessonProgress)
)

export default router
