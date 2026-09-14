import { CourseStatus, CourseType, EmploymentStatus, LessonType, ProgressionMode } from '../enums'

export interface ICategoryDTO {
  id: string
  name: string
  code: string
  description?: string | null
  isActive: boolean
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface ILessonDTO {
  id: string
  moduleId: string
  title: string
  slug: string
  type: LessonType | string
  durationMinutes: number
  orderIndex: number
  contentUrl?: string | null
  contentText?: string | null
  isPreview: boolean
  isMandatory: boolean
}

export interface ICourseModuleDTO {
  id: string
  courseId: string
  title: string
  description?: string | null
  orderIndex: number
  lessons: ILessonDTO[]
}

export interface ICourseDTO {
  id: string
  code: string
  title: string
  slug: string
  description?: string | null
  thumbnailUrl?: string | null
  categoryId: string
  category?: ICategoryDTO | null
  type: CourseType | string
  status: CourseStatus | string
  isMandatory: boolean
  durationDays: number
  progressionMode: ProgressionMode | string
  modulesCount?: number
  lessonsCount?: number
  enrolledCount?: number
  targetPositionId?: string | null
  targetDepartmentId?: string | null
  targetStoreId?: string | null
  targetEmploymentStatus?: EmploymentStatus | string | null
  modules?: ICourseModuleDTO[]
  createdAt?: string | Date
  updatedAt?: string | Date
}
