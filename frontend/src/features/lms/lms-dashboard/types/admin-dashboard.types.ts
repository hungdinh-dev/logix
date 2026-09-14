export interface DashboardMetrics {
  totalStudents: number
  officialStudents: number
  probationStudents: number
  totalCourses: number
  publishedCourses: number
  draftCourses: number
  mandatoryCourses: number
  avgCompletionRate: number
  totalEnrollments: number
}

export interface DashboardTopCourse {
  id: string
  title: string
  code: string
  enrolled: number
  completion: number
  mandatory: boolean
  status: string
}

export interface DashboardActivity {
  id: string
  userId: string
  user: string
  avatar: string
  email: string
  action: string
  target: string
  status: 'SUCCESS' | 'ACTIVE' | 'FAILED' | 'IN_PROGRESS'
  statusLabel: string
  timestamp: string
}

export interface AdminDashboardData {
  metrics: DashboardMetrics
  topCourses: DashboardTopCourse[]
  recentActivities: DashboardActivity[]
}
