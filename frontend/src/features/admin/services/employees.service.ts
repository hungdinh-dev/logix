import { apiCall } from '@/lib/api'
import type { CreateEmployeePayload, UserSummaryResponse } from '../types/admin.types'

export const employeesService = {
  list: (search?: string) =>
    apiCall.get<UserSummaryResponse[]>('/api/users', { params: search ? { search } : undefined }),

  create: (data: CreateEmployeePayload) =>
    apiCall.post<string>('/api/users', data),
}
