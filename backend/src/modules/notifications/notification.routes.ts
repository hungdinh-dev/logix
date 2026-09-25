import { Router } from 'express'
import { notificationController } from './notification.controller'
import { authenticateToken } from '../../middlewares/auth.middleware'
import { asyncHandler } from '../../common/utils/async-handler'

const router = Router()

// SSE Realtime Stream: Nhận token qua Query Param hoặc Header
router.get('/stream', notificationController.stream)

// Lấy danh sách thông báo
router.get(
  '/',
  authenticateToken,
  asyncHandler(notificationController.getNotifications)
)

// Lấy số lượng thông báo chưa đọc
router.get(
  '/unread-count',
  authenticateToken,
  asyncHandler(notificationController.getUnreadCount)
)

// Đánh dấu tất cả thông báo là đã đọc
router.patch(
  '/read-all',
  authenticateToken,
  asyncHandler(notificationController.markAllAsRead)
)

// Đánh dấu 1 thông báo là đã đọc
router.patch(
  '/:id/read',
  authenticateToken,
  asyncHandler(notificationController.markAsRead)
)

export default router
