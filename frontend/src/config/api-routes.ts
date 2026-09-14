export const apiRoutes = {
  auth: {
    login: '/api/auth/login', // POST
    logout: '/api/auth/logout', // POST
    refresh: '/api/auth/refresh', // POST
    me: '/api/auth/me', // GET
  },

  users: {
    base: '/api/users', // GET (list), POST (create)
    byId: (id: string) => `/api/users/${id}`, // GET, PATCH, DELETE
    block: (id: string) => `/api/users/${id}/block`, // PATCH
  },

  roles: {
    base: '/api/roles',
    byId: (id: string) => `/api/roles/${id}`,
  },

  departments: {
    base: '/api/departments',
    tree: '/api/departments/tree',
  },

  courses: {
    base: '/api/courses', // GET (list), POST (create)
    byId: (id: string) => `/api/courses/${id}`, // GET, PUT, DELETE
    curriculum: (id: string) => `/api/courses/${id}/curriculum`, // PUT (LMS-017 sync)
    clone: (id: string) => `/api/courses/${id}/clone`, // POST (LMS-003)
    status: (id: string) => `/api/courses/${id}/status`, // PATCH (LMS-004)
    enroll: (id: string) => `/api/courses/${id}/enroll`, // POST (LMS-044, 011)
    assignPosition: (id: string) => `/api/courses/${id}/assign-position`, // POST (LMS-005)
    assignEmploymentStatus: (id: string) => `/api/courses/${id}/assign-employment-status`, // POST (LMS-006)
    assignStore: (id: string) => `/api/courses/${id}/assign-store`, // POST (LMS-007)
    assignDepartment: (id: string) => `/api/courses/${id}/assign-department`, // POST (LMS-008)
    categories: '/api/courses/categories', // GET, POST (LMS-001)
    categoryById: (id: string) => `/api/courses/categories/${id}`, // GET, PUT, DELETE
  },

  lessons: {
    byId: (id: string) => `/api/lessons/${id}`,
  },

  progress: {
    dashboard: '/api/progress/dashboard',
    adminDashboard: '/api/progress/admin-dashboard',
    lesson: '/api/progress/lesson',
  },

  reports: {
    summary: '/api/reports/summary', // GET
  },

  certificates: {
    base: '/api/certificates',
    stats: '/api/certificates/stats',
    issue: '/api/certificates/issue',
    byId: (id: string) => `/api/certificates/${id}`,
    revoke: (id: string) => `/api/certificates/${id}/revoke`,
    renew: (id: string) => `/api/certificates/${id}/renew`,
    templates: '/api/certificates/templates',
    templateById: (id: string) => `/api/certificates/templates/${id}`,
    verify: (code: string) => `/api/certificates/verify/${code}`,
  },
} as const
