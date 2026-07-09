import { api } from './axios'
import { AxiosError, type AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types/api'

// ──────────────────────────────────────────────────────────────
// API Call Utilities
// ──────────────────────────────────────────────────────────────

export const apiCall = {
  get: async <T = unknown>(url: string, config?: AxiosRequestConfig) => {
    const response = await api.get<unknown, ApiResponse<T>>(url, config)
    return response.data
  },

  post: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    const response = await api.post<unknown, ApiResponse<T>>(url, data, config)
    return response.data
  },

  put: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    const response = await api.put<unknown, ApiResponse<T>>(url, data, config)
    return response.data
  },

  patch: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    const response = await api.patch<unknown, ApiResponse<T>>(url, data, config)
    return response.data
  },

  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig) => {
    const response = await api.delete<unknown, ApiResponse<T>>(url, config)
    return response.data
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
