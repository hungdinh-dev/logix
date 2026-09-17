import { api } from '@/lib/axios'
import { apiRoutes } from '@/config/api-routes'

export interface DashboardProgressSummary {
  enrolledCount: number
  completedCount: number
  inProgressCount: number
}

export interface DashboardEnrolledCourse {
  id: string
  title: string
  category: string
  progress: number
  totalLessons: number
}

export interface DashboardProgressResponse {
  summary: DashboardProgressSummary
  courses: DashboardEnrolledCourse[]
}

export interface CourseProgressEnrollment {
  id: string
  status: 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  completionPercentage: number
  isPassed: boolean
  enrolledAt: string
  completedAt?: string | null
}

export interface CourseProgressLesson {
  id: string
  title: string
  lessonType: 'VIDEO' | 'ARTICLE' | 'QUIZ' | 'PDF' | 'CHECKLIST'
  duration: number
  sopCode?: string | null
  isCompleted: boolean
  isLocked: boolean
  status: 'completed' | 'current' | 'locked' | 'available'
  lastPositionSeconds: number
  quizHighestScore?: number | null
  quiz?: any
}

export interface CourseProgressModule {
  id: string
  title: string
  sortOrder: number
  isLocked: boolean
  lessons: CourseProgressLesson[]
}

export interface CourseProgressResponse {
  courseId: string
  title: string
  code: string
  progressionMode: 'FREE' | 'LINEAR_LESSON' | 'LINEAR_MODULE'
  enrollment: CourseProgressEnrollment | null
  modules: CourseProgressModule[]
}

export interface UpdateLessonProgressPayload {
  lessonId: string
  isCompleted?: boolean
  lastPositionSeconds?: number
}

export const progressApiService = {
  async getDashboardProgress(): Promise<DashboardProgressResponse> {
    const res = await api.get(apiRoutes.progress.dashboard)
    return res.data?.data || { summary: { enrolledCount: 0, completedCount: 0, inProgressCount: 0 }, courses: [] }
  },

  async getCourseProgress(courseId: string): Promise<CourseProgressResponse> {
    const res = await api.get(`/api/progress/course/${courseId}`)
    return res.data?.data
  },

  async updateLessonProgress(payload: UpdateLessonProgressPayload) {
    const res = await api.post(apiRoutes.progress.lesson, payload)
    return res.data?.data
  },

  async enrollCourse(courseId: string) {
    const res = await api.post(apiRoutes.courses.enroll(courseId))
    return res.data?.data
  },
}
