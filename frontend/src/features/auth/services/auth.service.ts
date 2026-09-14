import { apiCall } from '@/lib/api'

// ──────────────────────────────────────────────────────────────
// Types (ERP-v2 1-to-1 Compatible with Backward Compatibility)
// ──────────────────────────────────────────────────────────────

export interface LoginRequest {
  loginEmail?: string
  email?: string
  password: string
}

export interface UserProfile {
  id: string
  userAccountId?: string
  employeeCode?: string | null
  fullName: string
  name?: string // Aliased getter for backward compatibility
  email?: string | null
  loginEmail?: string
  avatar?: string
  status?: string
  userType?: string
  employmentStatus?: string
  store?: { id: string; storeName: string; storeCode: string } | null
  department?: { id: string; deptName: string; deptCode: string } | null
  position?: { id: string; positionName: string; positionCode: string } | null
  roles?: string[]
  role?: string // Primary role for backward compatibility
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: UserProfile
  permissions: string[]
}

export interface MeResponse {
  user: UserProfile
  permissions: string[]
}

// Helper to normalize UserProfile with name, role, avatar
export const normalizeUserProfile = (user: UserProfile): UserProfile => {
  const primaryRole = user.roles && user.roles.length > 0 ? user.roles[0] : (user.role || 'STUDENT')
  return {
    ...user,
    name: user.name || user.fullName,
    role: primaryRole,
    avatar: user.avatar || undefined,
  }
}

// ──────────────────────────────────────────────────────────────
// Auth Service
// ──────────────────────────────────────────────────────────────

export const authService = {
  login: async (credentials: LoginRequest) => {
    const response = await apiCall.post<LoginResponse>('/api/auth/login', {
      loginEmail: credentials.loginEmail || credentials.email,
      password: credentials.password,
    })
    if (response && response.user) {
      response.user = normalizeUserProfile(response.user)
    }
    return response
  },

  refreshToken: async (refreshToken: string) => {
    return apiCall.post<{ accessToken: string }>('/api/auth/refresh', { refreshToken })
  },

  logout: async () => {
    return apiCall.post('/api/auth/logout')
  },

  getProfile: async () => {
    const res = await apiCall.get<MeResponse>('/api/auth/me')
    if (res && res.user) {
      res.user = normalizeUserProfile(res.user)
    }
    return res
  },

  getMe: async () => {
    const res = await apiCall.get<MeResponse>('/api/auth/me')
    if (res && res.user) {
      res.user = normalizeUserProfile(res.user)
    }
    return res
  },
}
