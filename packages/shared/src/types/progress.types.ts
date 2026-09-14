import { ProgressStatus } from '../enums'
import { ICourseDTO } from './course.types'

export interface IUserCourseProgressDTO {
  id: string
  userId: string
  courseId: string
  course?: ICourseDTO
  status: ProgressStatus | string
  progressPercent: number
  completedLessonsCount: number
  totalLessonsCount: number
  score?: number | null
  dueDate?: string | Date | null
  completedAt?: string | Date | null
  enrolledAt: string | Date
}
