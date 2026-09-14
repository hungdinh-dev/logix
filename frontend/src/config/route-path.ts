export const routePath = {
  login: '/login',
  forbidden: '/forbidden',

  // 🎓 LMS Learner Portal
  dashboard: '/lms/dashboard',
  courses: '/lms/courses',
  courseDetail: '/lms/courses/:id',
  lessonPlayer: '/lms/lessons/:id',
  quiz: '/lms/quizzes/:id',
  progress: '/lms/progress',
  reports: '/lms/reports',
  onboarding: '/onboarding',
  lessonCreate: '/lms/lessons/create',

  // 🏢 LMS Training Admin (Tách biệt hoàn toàn khỏi System Admin)
  lmsAdminDashboard: '/lms/admin/dashboard',
  lmsAdminCourses: '/lms/admin/courses',
  lmsAdminCourseCreate: '/lms/admin/courses/create',
  lmsAdminCourseCategories: '/lms/admin/courses/categories',
  lmsAdminCourseDetail: '/lms/admin/courses/:id',
  lmsAdminCourseTargeting: '/lms/admin/courses/:id/targeting',
  lmsAdminProgress: '/lms/admin/progress',
  lmsAdminCertificates: '/lms/admin/certificates',

  // 🎨 LMS Demo UI Showcase
  lmsAdminDemoDashboard: '/lms/admin/demo/dashboard',
  lmsAdminDemoCourses: '/lms/admin/demo/courses',
  lmsAdminDemoCatalog: '/lms/admin/demo/catalog',
  lmsAdminDemoCourseDetail: '/lms/admin/demo/courses/sample',
  lmsAdminDemoLessonPlayer: '/lms/admin/demo/lessons/sample',
  lmsAdminDemoQuiz: '/lms/admin/demo/quizzes/sample',
  lmsAdminDemoProgress: '/lms/admin/demo/progress',

  // 🔐 System & Organization Admin (Admin Tổng)
  adminDashboard: '/admin/dashboard',
  adminRoles: '/admin/roles',
  adminPermissions: '/admin/permissions',
  adminRoleHierarchy: '/admin/role-hierarchy',
  adminDepartments: '/admin/departments',
  adminEmployees: '/admin/employees',
  adminJobLevels: '/admin/job-levels',
  adminCustomFields: '/admin/custom-fields',

  // Backward compatibility aliases
  adminCourses: '/lms/admin/courses',
  adminCourseCreate: '/lms/admin/courses/create',
  adminCourseCategories: '/lms/admin/courses/categories',
  adminCourseDetail: '/lms/admin/courses/:id',
  adminProgress: '/lms/admin/progress',
  adminDemoDashboard: '/lms/admin/demo/dashboard',
  adminDemoCourses: '/lms/admin/demo/courses',
  adminDemoCatalog: '/lms/admin/demo/catalog',
  adminDemoCourseDetail: '/lms/admin/demo/courses/sample',
  adminDemoLessonPlayer: '/lms/admin/demo/lessons/sample',
  adminDemoQuiz: '/lms/admin/demo/quizzes/sample',
  adminDemoProgress: '/lms/admin/demo/progress',
} as const

export type RoutePath = (typeof routePath)[keyof typeof routePath]
