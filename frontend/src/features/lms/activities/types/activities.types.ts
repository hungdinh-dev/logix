export type ActivityType = 'ALL' | 'QUIZ' | 'LESSON' | 'COURSE'
export type ActivityStatus = 'ALL' | 'SUCCESS' | 'ACTIVE' | 'FAILED'

export interface LearningActivityItem {
  id: string
  type: 'QUIZ' | 'LESSON' | 'COURSE'
  userId: string
  user: string
  email: string
  avatar: string
  department?: string
  action: string
  target: string
  courseTitle: string
  status: 'SUCCESS' | 'ACTIVE' | 'FAILED'
  statusLabel: string
  score?: number | null
  timestamp: string
}

export interface ActivitiesStats {
  totalActivities: number
  quizCount: number
  lessonCount: number
  courseCount: number
}

export interface ActivitiesApiResponse {
  items: LearningActivityItem[]
  stats: ActivitiesStats
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface ActivitiesQueryParams {
  page?: number
  pageSize?: number
  search?: string
  type?: ActivityType
  status?: ActivityStatus
}
