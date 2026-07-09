// Wrapper for all API responses
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Common pagination query params
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Error response from API
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}
