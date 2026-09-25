import { Router } from 'express'
import { lessonController } from './lesson.controller'
import {
  createLessonSchema,
  updateLessonSchema,
  reorderLessonsSchema,
  parseYoutubeSchema,
  createLessonResourceSchema,
  updateLessonResourceSchema,
} from './lesson.dto'
import { validateRequest } from '../../common/middlewares/validate.middleware'
import { asyncHandler } from '../../common/utils/async-handler'
import { authenticateToken } from '../../middlewares/auth.middleware'
import { requirePermission } from '../../middlewares/permission.middleware'

import lessonCommentRouter from '../lesson-comments/lesson-comment.routes'

const router = Router()

// Bình luận & Thảo luận bài học (Lesson Comments & Q&A)
router.use('/:lessonId/comments', lessonCommentRouter)

// Utility: Parse YouTube link
router.post(
  '/parse-youtube',
  validateRequest(parseYoutubeSchema),
  asyncHandler(lessonController.parseYoutubeUrl)
)

// Lấy chi tiết bài học
router.get('/:id', asyncHandler(lessonController.getLessonById))

// Tạo bài học mới trong Chương
router.post(
  '/modules/:moduleId',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(createLessonSchema),
  asyncHandler(lessonController.createLesson)
)

// Cập nhật bài học
router.put(
  '/:id',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(updateLessonSchema),
  asyncHandler(lessonController.updateLesson)
)

// Xóa bài học
router.delete(
  '/:id',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  asyncHandler(lessonController.deleteLesson)
)

// Sắp xếp lại thứ tự bài học trong Chương
router.post(
  '/modules/:moduleId/reorder',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(reorderLessonsSchema),
  asyncHandler(lessonController.reorderLessons)
)

// ==========================================
// Tài nguyên bài học (Lesson Resources)
// ==========================================
router.get('/:id/resources', asyncHandler(lessonController.getLessonResources))

router.post(
  '/:id/resources',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(createLessonResourceSchema),
  asyncHandler(lessonController.addLessonResource)
)

router.put(
  '/resources/:resourceId',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(updateLessonResourceSchema),
  asyncHandler(lessonController.updateLessonResource)
)

router.delete(
  '/resources/:resourceId',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  asyncHandler(lessonController.deleteLessonResource)
)

export default router

