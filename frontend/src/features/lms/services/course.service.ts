import { api } from '@/lib/axios'
import { apiRoutes } from '@/config/api-routes'
import type { BackendCourse, BackendCategory } from '../types/course.types'

export interface CreateCoursePayload {
  code: string
  title: string
  slug: string
  categoryId: string
  description?: string
  thumbnailUrl?: string
  courseType?: 'STANDARD' | 'ATTP' | 'ONBOARDING'
  isMandatory?: boolean
  durationDays?: number | null
  progressionMode?: 'FREE' | 'LINEAR_LESSON' | 'LINEAR_MODULE'
  isInternal?: boolean
  isCommercial?: boolean
  targetPositionId?: string
  targetDepartmentId?: string
  targetStoreId?: string
  targetEmploymentStatus?: 'PROBATION' | 'OFFICIAL' | 'TEMPORARY' | 'ALL'
  hasCertificate?: boolean
  certificateTemplateId?: string | null
}

export interface UpdateCoursePayload extends Partial<CreateCoursePayload> {
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

export interface CreateCategoryPayload {
  code: string
  name: string
  description?: string
  sortOrder?: number
}

export interface SyncCurriculumPayload {
  title?: string
  modules: {
    id?: string
    title: string
    sortOrder?: number
    lessons: {
      id?: string
      title: string
      lessonType?: 'VIDEO' | 'ARTICLE' | 'QUIZ' | 'PDF' | 'CHECKLIST'
      sortOrder?: number
      durationMinutes?: number
      videoUrl?: string | null
      videoProvider?: 'YOUTUBE' | 'DIRECT_UPLOAD' | 'EXTERNAL_URL' | null
      bodyHtml?: string | null
      documentUrl?: string | null
      sopCode?: string | null
      sopType?: string | null
      checklistItems?: string | null
      quizPassScore?: number
      quizTimeLimit?: number
      quizQuestions?: {
        id?: string
        questionText: string
        questionType?: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER'
        options: {
          id?: string
          text: string
          isCorrect: boolean
        }[]
      }[]
    }[]
  }[]
}

export const courseApiService = {
  // ==========================================
  // Categories (LMS-001)
  // ==========================================
  async getCategories(): Promise<BackendCategory[]> {
    const res = await api.get(apiRoutes.courses.categories)
    return res.data?.data || []
  },

  async createCategory(payload: CreateCategoryPayload): Promise<BackendCategory> {
    const res = await api.post(apiRoutes.courses.categories, payload)
    return res.data?.data
  },

  async updateCategory(id: string, payload: Partial<CreateCategoryPayload>): Promise<BackendCategory> {
    const res = await api.put(apiRoutes.courses.categoryById(id), payload)
    return res.data?.data
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(apiRoutes.courses.categoryById(id))
  },

  // ==========================================
  // Courses (LMS-002 -> LMS-012)
  // ==========================================
  async getCourses(params?: {
    search?: string
    categoryId?: string
    status?: string
    isMandatory?: boolean
  }): Promise<BackendCourse[]> {
    const res = await api.get(apiRoutes.courses.base, { params })
    return res.data?.data || []
  },

  async getCourseById(id: string): Promise<BackendCourse> {
    const res = await api.get(apiRoutes.courses.byId(id))
    return res.data?.data
  },

  async createCourse(payload: CreateCoursePayload): Promise<BackendCourse> {
    const res = await api.post(apiRoutes.courses.base, payload)
    return res.data?.data
  },

  async updateCourse(id: string, payload: UpdateCoursePayload): Promise<BackendCourse> {
    const res = await api.put(apiRoutes.courses.byId(id), payload)
    return res.data?.data
  },

  // LMS-017: Đồng bộ toàn bộ giáo trình (Modules, Lessons, Quizzes, Questions, Options)
  async syncCourseCurriculum(id: string, payload: SyncCurriculumPayload): Promise<BackendCourse> {
    const res = await api.put(apiRoutes.courses.curriculum(id), payload)
    return res.data?.data
  },

  // LMS-003: Clone course
  async cloneCourse(id: string): Promise<BackendCourse> {
    const res = await api.post(apiRoutes.courses.clone(id))
    return res.data?.data
  },

  // LMS-004: Update status
  async updateCourseStatus(id: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'): Promise<BackendCourse> {
    const res = await api.patch(apiRoutes.courses.status(id), { status })
    return res.data?.data
  },

  async deleteCourse(id: string): Promise<void> {
    await api.delete(apiRoutes.courses.byId(id))
  },

  // LMS-005: Assign Position
  async assignPosition(courseId: string, positionId: string) {
    const res = await api.post(apiRoutes.courses.assignPosition(courseId), { positionId })
    return res.data?.data
  },

  // LMS-006: Assign Employment Status
  async assignEmploymentStatus(courseId: string, employmentStatus: string) {
    const res = await api.post(apiRoutes.courses.assignEmploymentStatus(courseId), { employmentStatus })
    return res.data?.data
  },

  // LMS-007: Assign Store
  async assignStore(courseId: string, storeId: string) {
    const res = await api.post(apiRoutes.courses.assignStore(courseId), { storeId })
    return res.data?.data
  },

  // LMS-008: Assign Department
  async assignDepartment(courseId: string, departmentId: string) {
    const res = await api.post(apiRoutes.courses.assignDepartment(courseId), { departmentId })
    return res.data?.data
  },

  // LMS-044: Enroll Course
  async enrollCourse(courseId: string) {
    const res = await api.post(apiRoutes.courses.enroll(courseId))
    return res.data?.data
  },
}

