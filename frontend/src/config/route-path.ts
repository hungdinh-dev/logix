export const routePath = {
  login: '/login',
  forbidden: '/forbidden',

  dashboard: '/lms/dashboard',
  courses: '/lms/courses',
  courseDetail: '/lms/courses/:id',
  lessonPlayer: '/lms/lessons/:id',
  quiz: '/lms/quizzes/:id',
  progress: '/lms/progress',
} as const

export type RoutePath = (typeof routePath)[keyof typeof routePath]
