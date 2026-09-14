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

const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('refresh_token')
}

const setTokens = (accessToken: string, refreshToken?: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('access_token', accessToken)
  if (refreshToken) localStorage.setItem('refresh_token', refreshToken)
  
  // Đồng bộ cookie cho Next.js Middleware & Router
  document.cookie = `access_token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`
}

const clearTokens = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('auth-storage')
  document.cookie = 'access_token=; path=/; max-age=0'
}

const redirectToLogin = (): void => {
  clearTokens()
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith(routePath.login)) {
    const currentPath = window.location.pathname
    window.location.href = `${routePath.login}?redirect=${encodeURIComponent(currentPath)}`
  }
}

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new Error('No refresh token available')

  const response = await axios.post(`${API_BASE_URL}${apiRoutes.auth.refresh}`, {
    refreshToken: refreshToken, // ✅ Gửi đúng key `refreshToken` (camelCase)
  })

  const resData = response.data
  // Trích xuất access token từ ApiResponse { data: { accessToken } } hoặc { accessToken }
  const accessToken = resData?.data?.accessToken || resData?.accessToken

  if (!accessToken) {
    throw new Error('No access token returned from refresh API')
  }

  return accessToken
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

    // Nếu endpoint gọi refresh bị 401 -> Logout ngay lập tức
    if (originalRequest?.url?.includes(apiRoutes.auth.refresh)) {
      redirectToLogin()
      return Promise.reject(error)
    }

    // Token hết hạn / Unauthorized (401)
    if (error.response?.status === 401) {
      if (!originalRequest?._retry && getRefreshToken()) {
        originalRequest._retry = true
        try {
          const newToken = await handleTokenRefresh()
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        } catch (refreshErr) {
          redirectToLogin()
          return Promise.reject(refreshErr)
        }
      } else {
        // Không có refresh token hoặc retry lại vẫn 401 -> Chủ động Logout!
        redirectToLogin()
        return Promise.reject(error)
      }
    }

    // 403 Forbidden → redirect sang trang cấm truy cập
    if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = routePath.forbidden
      }
    }

    if (!error.response) {
      console.error('Network error:', error.message)
    }

    return Promise.reject(error)
  }
)
