import type { BackendCategory } from '@/features/lms/types/course.types'
import type { CreateCategoryPayload } from '@/features/lms/services/course.service'

export type CategoryStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE'

export type CategoryFormData = CreateCategoryPayload

export interface CategoryStats {
  totalCategories: number
  activeCategoriesCount: number
  totalCourses: number
  mandatoryCoursesCount: number
}

export interface CategoryItemWithMeta extends BackendCategory {
  courseCount: number
}
