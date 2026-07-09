export const apiRoutes = {
  auth: {
    login: '/auth/login', // POST
    logout: '/auth/logout', // POST
    refresh: '/auth/refresh', // POST
  },

  users: {
    base: '/users', // GET (list), POST (create)
    byId: (id: string) => `/users/${id}`, // GET, PATCH, DELETE
    block: (id: string) => `/users/${id}/block`, // PATCH
  },

  customers: {
    base: '/customers', // GET (list), POST (create)
    byId: (id: string) => `/customers/${id}`, // GET, PATCH, DELETE
  },

  leads: {
    base: '/leads', // GET (list), POST (create)
    byId: (id: string) => `/leads/${id}`, // GET, PATCH, DELETE
    convert: (id: string) => `/leads/${id}/convert`, // POST
  },

  reports: {
    summary: '/reports/summary', // GET
    customers: '/reports/customers', // GET
    leads: '/reports/leads', // GET
  },
} as const
