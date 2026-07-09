import { apiCall } from '@/lib/api'

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

/**
 * Response returned from external Backend API
 * Based on pattern: server returns accessToken (JWT) and optionally refreshToken.
 */
export interface LoginResponse {
  accessToken: string
  refreshToken?: string
}

// ──────────────────────────────────────────────────────────────
// Auth Service
// ──────────────────────────────────────────────────────────────

export const authService = {
  login: async (credentials: LoginRequest) => {
    return apiCall.post<LoginResponse>('/auth/login', credentials)
  },

  refreshToken: async (token: string) => {
    return apiCall.post<LoginResponse>('/auth/refresh-token', { token })
  },

  logout: async (token?: string) => {
    return apiCall.post('/auth/logout', { token })
  },

  getProfile: async () => {
    return apiCall.get('/auth/profile')
  },

  updateProfile: async (data: unknown) => {
    return apiCall.patch('/auth/profile', data)
  },
}
