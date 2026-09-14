export const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || 'http://localhost:5000/api'

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  COURSES: {
    BASE: '/courses',
    BY_ID: (id: string) => `/courses/${id}`,
    CATEGORIES: '/courses/categories',
    CATEGORY_BY_ID: (id: string) => `/courses/categories/${id}`,
    CLONE: (id: string) => `/courses/${id}/clone`,
    STATUS: (id: string) => `/courses/${id}/status`,
    ASSIGN_POSITION: (id: string) => `/courses/${id}/assign-position`,
    ASSIGN_STORE: (id: string) => `/courses/${id}/assign-store`,
    ASSIGN_DEPARTMENT: (id: string) => `/courses/${id}/assign-department`,
    ASSIGN_EMPLOYMENT_STATUS: (id: string) => `/courses/${id}/assign-employment-status`,
  },
  LESSONS: {
    BASE: '/lessons',
    BY_ID: (id: string) => `/lessons/${id}`,
    BY_MODULE: (moduleId: string) => `/lessons/module/${moduleId}`,
  },
  QUIZZES: {
    BASE: '/quizzes',
    BY_ID: (id: string) => `/quizzes/${id}`,
    SUBMIT: (id: string) => `/quizzes/${id}/submit`,
  },
  PROGRESS: {
    MY_COURSES: '/progress/my-courses',
    COURSE_PROGRESS: (courseId: string) => `/progress/course/${courseId}`,
    COMPLETE_LESSON: '/progress/complete-lesson',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
  ROLES: {
    BASE: '/roles',
    BY_ID: (id: string) => `/roles/${id}`,
  },
} as const

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const
