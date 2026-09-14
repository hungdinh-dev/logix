export interface IApiResponse<T = any> {
  isSuccess: boolean
  statusCode: number
  message: string
  data?: T | null
  errors?: Record<string, string[]> | null
}

export interface IPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface IPaginatedData<T> {
  items: T[]
  meta: IPaginationMeta
}

export interface IPaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
