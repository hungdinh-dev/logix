import { Router } from 'express'
import { lessonCommentController } from './lesson-comment.controller'
import {
  createLessonCommentSchema,
  updateLessonCommentSchema,
  togglePinCommentSchema,
} from './lesson-comment.dto'
import { validateRequest } from '../../common/middlewares/validate.middleware'
import { asyncHandler } from '../../common/utils/async-handler'
import {
  authenticateToken,
  optionalAuthenticateToken,
} from '../../middlewares/auth.middleware'

const router = Router({ mergeParams: true })

// Lấy danh sách bình luận của bài học (có thể kèm user token để tính hasLiked)
router.get(
  '/',
  optionalAuthenticateToken,
  asyncHandler(lessonCommentController.getComments)
)

// Tạo bình luận mới hoặc phản hồi bài học
router.post(
  '/',
  authenticateToken,
  validateRequest(createLessonCommentSchema),
  asyncHandler(lessonCommentController.createComment)
)

// Cập nhật nội dung bình luận
router.put(
  '/:commentId',
  authenticateToken,
  validateRequest(updateLessonCommentSchema),
  asyncHandler(lessonCommentController.updateComment)
)

// Xóa bình luận
router.delete(
  '/:commentId',
  authenticateToken,
  asyncHandler(lessonCommentController.deleteComment)
)

// Thích / Bỏ thích bình luận
router.post(
  '/:commentId/like',
  authenticateToken,
  asyncHandler(lessonCommentController.toggleLike)
)

// Ghim / Bỏ ghim bình luận (Admin / Giảng viên)
router.post(
  '/:commentId/pin',
  authenticateToken,
  validateRequest(togglePinCommentSchema),
  asyncHandler(lessonCommentController.togglePin)
)

export default router
