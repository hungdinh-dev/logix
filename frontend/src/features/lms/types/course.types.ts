export * from '../demo-ui/types/course.types'

export interface EnrolledUserDepartment {
  id: string
  deptName: string
  deptCode: string
}

export interface EnrolledUserPosition {
  id: string
  positionName: string
  positionCode: string
}

export interface EnrolledUserStore {
  id: string
  storeName: string
  storeCode: string
}

export interface EnrolledUser {
  id: string
  fullName: string
  email: string | null
  employeeCode: string | null
  status: string
  userType: string
  employmentStatus: string
  department?: EnrolledUserDepartment | null
  position?: EnrolledUserPosition | null
  store?: EnrolledUserStore | null
}

export type EnrollmentStatus = 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface CourseEnrollmentRecord {
  id: string
  userId: string
  courseId: string
  enrollmentSource: string
  status: EnrollmentStatus
  dueDate: string | null
  completionPercentage: number
  isPassed: boolean
  enrolledAt: string
  startedAt: string | null
  completedAt: string | null
  user: EnrolledUser
}

export interface CourseEnrollmentsStats {
  total: number
  enrolled: number
  inProgress: number
  completed: number
  cancelled: number
}

export interface CourseEnrollmentsResponse {
  course: {
    id: string
    code: string
    title: string
    status: string
    isMandatory: boolean
    durationDays?: number | null
  }
  stats: CourseEnrollmentsStats
  enrollments: CourseEnrollmentRecord[]
}
