import { Router } from 'express'
import { courseController } from './course.controller'
import {
  createCategorySchema,
  updateCategorySchema,
  createCourseSchema,
  updateCourseSchema,
  updateCourseStatusSchema,
  assignPositionSchema,
  assignEmploymentStatusSchema,
  assignStoreSchema,
  assignDepartmentSchema,
  createModuleSchema,
  updateModuleSchema,
  reorderModulesSchema,
  syncCurriculumSchema,
} from './course.dto'
import { validateRequest } from '../../common/middlewares/validate.middleware'
import { asyncHandler } from '../../common/utils/async-handler'
import { authenticateToken } from '../../middlewares/auth.middleware'
import { requirePermission } from '../../middlewares/permission.middleware'

const router = Router()

// ==========================================
// Category Routes (LMS-001)
// ==========================================
router.get('/categories', asyncHandler(courseController.getAllCategories))
router.get('/categories/:id', asyncHandler(courseController.getCategoryById))
router.post(
  '/categories',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(createCategorySchema),
  asyncHandler(courseController.createCategory)
)
router.put(
  '/categories/:id',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(updateCategorySchema),
  asyncHandler(courseController.updateCategory)
)
router.delete(
  '/categories/:id',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  asyncHandler(courseController.deleteCategory)
)

// ==========================================
// Course Routes (LMS-002 -> LMS-012)
// ==========================================
router.get('/', asyncHandler(courseController.getAllCourses))
router.get('/:id', asyncHandler(courseController.getCourseById))

router.post(
  '/',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(createCourseSchema),
  asyncHandler(courseController.createCourse)
)

router.put(
  '/:id',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(updateCourseSchema),
  asyncHandler(courseController.updateCourse)
)

// Đồng bộ toàn bộ giáo trình (Chương, Bài học: Video/SOP/Tài liệu/Quiz, Câu hỏi trắc nghiệm)
router.put(
  '/:id/curriculum',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(syncCurriculumSchema),
  asyncHandler(courseController.syncCurriculum)
)

// LMS-003: Clone course
router.post(
  '/:id/clone',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  asyncHandler(courseController.cloneCourse)
)

// LMS-004: Ngưng / Kích hoạt khóa học
router.patch(
  '/:id/status',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(updateCourseStatusSchema),
  asyncHandler(courseController.updateCourseStatus)
)

router.delete(
  '/:id',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  asyncHandler(courseController.deleteCourse)
)

// LMS-005: Gán theo Chức danh
router.post(
  '/:id/assign-position',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(assignPositionSchema),
  asyncHandler(courseController.assignToPosition)
)

// LMS-006: Gán theo Loại nhân sự
router.post(
  '/:id/assign-employment-status',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(assignEmploymentStatusSchema),
  asyncHandler(courseController.assignToEmploymentStatus)
)

// LMS-007: Gán theo Cửa hàng
router.post(
  '/:id/assign-store',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(assignStoreSchema),
  asyncHandler(courseController.assignToStore)
)

// LMS-008: Gán theo Bộ phận sản xuất
router.post(
  '/:id/assign-department',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(assignDepartmentSchema),
  asyncHandler(courseController.assignToDepartment)
)

// LMS-044 & LMS-011: Ghi danh cá nhân
router.post('/:id/enroll', authenticateToken, asyncHandler(courseController.enrollCourse))

// Danh sách học viên ghi danh khóa học (Admin Side Peek)
router.get('/:id/enrollments', authenticateToken, asyncHandler(courseController.getCourseEnrollments))

// ==========================================
// Curriculum & Module Routes (LMS-017)
// ==========================================

// Lấy toàn bộ cây Chương & Bài học (kèm Quiz)
router.get('/:id/curriculum', asyncHandler(courseController.getCourseCurriculum))

// Tạo Chương mới trong Khóa học
router.post(
  '/:id/modules',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(createModuleSchema),
  asyncHandler(courseController.createModule)
)

// Cập nhật Chương học
router.put(
  '/modules/:moduleId',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(updateModuleSchema),
  asyncHandler(courseController.updateModule)
)

// Xóa Chương học
router.delete(
  '/modules/:moduleId',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  asyncHandler(courseController.deleteModule)
)

// Sắp xếp lại thứ tự các Chương
router.post(
  '/:id/modules/reorder',
  authenticateToken,
  requirePermission('COURSE.CREATE'),
  validateRequest(reorderModulesSchema),
  asyncHandler(courseController.reorderModules)
)

export default router

