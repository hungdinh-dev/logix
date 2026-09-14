/**
 * Shared Training Contract — Cung cấp dữ liệu đào tạo cho phân hệ HRM (Hồ sơ nhân sự)
 */
export type TrainingCompletionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED'

export interface EmployeeTrainingSummary {
  userId: string
  totalAssignedCourses: number
  completedCourses: number
  inProgressCourses: number
  complianceRate: number // Tỷ lệ tuân thủ (%)
  certificatesCount: number
}

export interface EmployeeCourseRecord {
  courseId: string
  courseCode: string
  courseTitle: string
  isMandatory: boolean
  status: TrainingCompletionStatus
  progressPercent: number
  completedAt?: string | null
  expiresAt?: string | null
  certificateUrl?: string | null
}
