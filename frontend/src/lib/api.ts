import { api } from './axios'
import { AxiosError, type AxiosRequestConfig } from 'axios'

// ──────────────────────────────────────────────────────────────
// API Call Utilities (Tự động unwrap ApiResponse envelope)
// ──────────────────────────────────────────────────────────────

const unwrapData = <T>(res: unknown): T => {
  if (res && typeof res === 'object' && 'isSuccess' in res && 'data' in res) {
    return (res as { data: T }).data
  }
  return res as T
}

export const apiCall = {
  get: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get<unknown>(url, config)
    return unwrapData<T>(response.data)
  },

  post: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.post<unknown>(url, data, config)
    return unwrapData<T>(response.data)
  },

  put: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.put<unknown>(url, data, config)
    return unwrapData<T>(response.data)
  },

  patch: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.patch<unknown>(url, data, config)
    return unwrapData<T>(response.data)
  },

  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.delete<unknown>(url, config)
    return unwrapData<T>(response.data)
  },
}

// ──────────────────────────────────────────────────────────────
// Error Handler
// ──────────────────────────────────────────────────────────────

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || 'Có lỗi xảy ra'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Có lỗi không xác định'
}

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof AxiosError && !error.response
}
