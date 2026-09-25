import { Router } from 'express'
import { quizController } from './quiz.controller'
import {
  updateQuizConfigSchema,
  createQuestionSchema,
  updateQuestionSchema,
  reorderQuestionsSchema,
  submitQuizSchema,
} from './quiz.dto'
import { validateRequest } from '../../common/middlewares/validate.middleware'
import { asyncHandler } from '../../common/utils/async-handler'
import { authenticateToken } from '../../middlewares/auth.middleware'
import { requirePermission } from '../../middlewares/permission.middleware'

const router = Router()

// ==========================================
// Quiz Routes (LMS-061 -> LMS-069)
// ==========================================

// Học viên lấy đề thi để làm bài (LMS-065) - Hỗ trợ cả quizId lẫn lessonId
router.get('/:id/take', authenticateToken, asyncHandler(quizController.getQuizForTake))

// Học viên nộp bài thi (LMS-066)
router.post(
  '/:id/submit',
  authenticateToken,
  validateRequest(submitQuizSchema),
  asyncHandler(quizController.submitQuiz)
)

// Học viên xem lịch sử các lần thi (LMS-069)
router.get('/:id/attempts', authenticateToken, asyncHandler(quizController.getUserQuizAttempts))

// Lấy Quiz theo Lesson ID (Tự động khởi tạo nếu chưa có)
router.get('/lessons/:lessonId', asyncHandler(quizController.getQuizByLessonId))

// Lấy chi tiết Quiz theo Quiz ID
router.get('/:id', asyncHandler(quizController.getQuizById))

// Xem trước đề thi (Preview Mode)
router.get('/:id/preview', asyncHandler(quizController.getQuizPreview))

// Cập nhật cấu hình Quiz
router.put(
  '/:id',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(updateQuizConfigSchema),
  asyncHandler(quizController.updateQuizConfig)
)

// ==========================================
// Question Builder Routes (LMS-056 -> LMS-060)
// ==========================================

// Thêm câu hỏi mới vào Quiz
router.post(
  '/:quizId/questions',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(createQuestionSchema),
  asyncHandler(quizController.createQuestion)
)

// Cập nhật câu hỏi & các options
router.put(
  '/questions/:questionId',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(updateQuestionSchema),
  asyncHandler(quizController.updateQuestion)
)

// Xóa câu hỏi khỏi Quiz
router.delete(
  '/questions/:questionId',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  asyncHandler(quizController.deleteQuestion)
)

// Sắp xếp lại thứ tự câu hỏi
router.post(
  '/:quizId/questions/reorder',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(reorderQuestionsSchema),
  asyncHandler(quizController.reorderQuestions)
)

export default router
