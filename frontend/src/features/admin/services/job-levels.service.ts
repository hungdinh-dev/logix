import { apiCall } from '@/lib/api'
import type { JobLevelResponse, ListParams, QueryResult } from '../types/admin.types'

export const jobLevelsService = {
  list: (params?: ListParams) =>
    apiCall.get<QueryResult<JobLevelResponse>>('/api/job-levels', { params }),

  create: (data: { levelName: string; levelOrder: number; defaultScopeType: number; description?: string; baseSalaryMin?: number; baseSalaryMax?: number }) =>
    apiCall.post<string>('/api/job-levels', data),

  update: (id: string, data: { levelName: string; levelOrder: number; defaultScopeType: number; description?: string; baseSalaryMin?: number; baseSalaryMax?: number }) =>
    apiCall.put<void>(`/api/job-levels/${id}`, data),

  delete: (id: string) =>
    apiCall.delete<void>(`/api/job-levels/${id}`),
}
