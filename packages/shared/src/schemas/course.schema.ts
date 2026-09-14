import { z } from 'zod'
import { CourseStatus, CourseType, EmploymentStatus, ProgressionMode } from '../enums'

export const createCourseSchema = z.object({
  code: z.string().min(2, 'Mã khóa học là bắt buộc'),
  title: z.string().min(3, 'Tên khóa học phải có ít nhất 3 ký tự'),
  slug: z.string().min(2, 'Slug khóa học là bắt buộc'),
  description: z.string().optional().nullable(),
  thumbnailUrl: z.string().url('URL ảnh không hợp lệ').optional().nullable(),
  categoryId: z.string().uuid('ID danh mục không hợp lệ'),
  type: z.nativeEnum(CourseType).default(CourseType.ONLINE),
  status: z.nativeEnum(CourseStatus).default(CourseStatus.DRAFT),
  isMandatory: z.boolean().default(false),
  durationDays: z.number().int().min(1, 'Thời hạn tối thiểu là 1 ngày').default(30),
  progressionMode: z.nativeEnum(ProgressionMode).default(ProgressionMode.LINEAR_LESSON),
  targetPositionId: z.string().uuid().optional().nullable(),
  targetDepartmentId: z.string().uuid().optional().nullable(),
  targetStoreId: z.string().uuid().optional().nullable(),
  targetEmploymentStatus: z.nativeEnum(EmploymentStatus).optional().nullable(),
})

export type CreateCourseInput = z.infer<typeof createCourseSchema>

export const updateCourseSchema = createCourseSchema.partial()
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>

export const updateCourseStatusSchema = z.object({
  status: z.nativeEnum(CourseStatus),
})

export type UpdateCourseStatusInput = z.infer<typeof updateCourseStatusSchema>

// Auto-assign rule schemas
export const assignCoursePositionSchema = z.object({
  positionId: z.string().uuid('Position ID không hợp lệ'),
})
export type AssignCoursePositionInput = z.infer<typeof assignCoursePositionSchema>

export const assignCourseStoreSchema = z.object({
  storeId: z.string().uuid('Store ID không hợp lệ'),
})
export type AssignCourseStoreInput = z.infer<typeof assignCourseStoreSchema>

export const assignCourseDepartmentSchema = z.object({
  departmentId: z.string().uuid('Department ID không hợp lệ'),
})
export type AssignCourseDepartmentInput = z.infer<typeof assignCourseDepartmentSchema>

export const assignCourseEmploymentStatusSchema = z.object({
  employmentStatus: z.nativeEnum(EmploymentStatus),
})
export type AssignCourseEmploymentStatusInput = z.infer<typeof assignCourseEmploymentStatusSchema>
