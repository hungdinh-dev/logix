import type { BackendCourse } from '@/features/lms/types/course.types'

export type SortField = 'title' | 'code' | 'status' | 'enrollments' | 'updatedAt' | null
export type SortDirection = 'asc' | 'desc'

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type ProgressionMode = 'FREE' | 'LINEAR_LESSON' | 'LINEAR_MODULE'
export type CourseTypeFilter = 'ALL' | 'MANDATORY' | 'OPTIONAL'

export interface ColumnVisibility {
  code: boolean
  category: boolean
  type: boolean
  progression: boolean
  status: boolean
  enrollment: boolean
  updatedAt: boolean
  actions: boolean
}

export interface StatusChangeTarget {
  course: BackendCourse
  nextStatus: CourseStatus
}

export interface ProgressionChangeTarget {
  course: BackendCourse
  nextMode: ProgressionMode
}

export interface BulkActionTarget {
  type: CourseStatus | 'DELETE'
  count: number
}
