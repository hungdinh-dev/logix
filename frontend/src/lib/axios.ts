import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { apiRoutes } from '@/config/api-routes'
import { routePath } from '@/config/route-path'

type PendingRequest = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

// ──────────────────────────────────────────────────────────────
// Config & Instance
// ──────────────────────────────────────────────────────────────

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

// ──────────────────────────────────────────────────────────────
// Token Management
// ──────────────────────────────────────────────────────────────

let isRefreshing = false
let pendingRequests: PendingRequest[] = []

const getAccessToken = (): string | null => localStorage.getItem('access_token')
const getRefreshToken = (): string | null => localStorage.getItem('refresh_token')

const setTokens = (accessToken: string, refreshToken?: string): void => {
  localStorage.setItem('access_token', accessToken)
  if (refreshToken) localStorage.setItem('refresh_token', refreshToken)
}

const clearTokens = (): void => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

const redirectToLogin = (): void => {
  clearTokens()
  window.location.href = routePath.login
}

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new Error('No refresh token available')

  const { data } = await axios.post(`${API_BASE_URL}${apiRoutes.auth.refresh}`, {
    refresh_token: refreshToken,
  })

  return data.access_token
}

const processPendingRequests = (token: string): void => {
  pendingRequests.forEach((req) => req.resolve(token))
  pendingRequests = []
}

const handleTokenRefresh = async (): Promise<string> => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      pendingRequests.push({ resolve, reject })
    })
  }

  isRefreshing = true
  try {
    const newToken = await refreshAccessToken()
    setTokens(newToken)
    processPendingRequests(newToken)
    return newToken
  } catch (error) {
    pendingRequests.forEach((req) => req.reject(error))
    pendingRequests = []
    redirectToLogin()
    throw error
  } finally {
    isRefreshing = false
  }
}

// ──────────────────────────────────────────────────────────────
// Request Interceptor
// ──────────────────────────────────────────────────────────────

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ──────────────────────────────────────────────────────────────
// Response Interceptor
// ──────────────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Token hết hạn → refresh & retry
    if (error.response?.status === 401 && !originalRequest?._retry && getRefreshToken()) {
      originalRequest._retry = true
      try {
        const newToken = await handleTokenRefresh()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch {
        return Promise.reject(error)
      }
    }

    // 403 Forbidden → redirect
    if (error.response?.status === 403) {
      window.location.href = routePath.forbidden
    }

    // Network error hoặc server error
    if (!error.response) {
      console.error('Network error:', error.message)
    }

    return Promise.reject(error)
  }
)
