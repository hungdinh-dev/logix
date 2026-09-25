export type EnrollmentStatus = 'ALL' | 'COMPLETED' | 'IN_PROGRESS' | 'ENROLLED' | 'CANCELLED'

export interface ProgressStudentUser {
  id: string
  fullName: string
  email: string
  employeeCode: string | null
  department: {
    id: string
    deptName: string
    deptCode: string
  } | null
  store: {
    id: string
    storeName: string
    storeCode: string
  } | null
}

export interface ProgressCourseInfo {
  id: string
  title: string
  code: string
  slug: string
  passScorePercentage: number | null
  category: {
    id: string
    name: string
  } | null
}

export interface AdminProgressItem {
  id: string
  userId: string
  courseId: string
  status: 'COMPLETED' | 'IN_PROGRESS' | 'ENROLLED' | 'CANCELLED'
  completionPercentage: number
  isPassed: boolean
  enrollmentSource: string
  enrolledAt: string
  completedAt: string | null
  dueDate: string | null
  highestQuizScore: number | null
  user: ProgressStudentUser
  course: ProgressCourseInfo
}

export interface ProgressStats {
  totalEnrollments: number
  completedCount: number
  inProgressCount: number
  enrolledCount: number
  avgCompletionRate: number
}

export interface ProgressFilterOptions {
  courses: Array<{ id: string; title: string; code: string }>
  departments: Array<{ id: string; deptName: string; deptCode: string }>
}

export interface AdminProgressApiResponse {
  items: AdminProgressItem[]
  stats: ProgressStats
  filters: ProgressFilterOptions
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface AdminProgressQueryParams {
  page?: number
  pageSize?: number
  search?: string
  courseId?: string
  departmentId?: string
  storeId?: string
  status?: EnrollmentStatus
  sortField?: 'enrolledAt' | 'completionPercentage' | 'fullName' | 'courseTitle' | 'completedAt'
  sortDirection?: 'asc' | 'desc'
}
