import { apiCall } from '@/lib/api'
import type { UserSummaryResponse } from '../types/admin.types'

export const usersService = {
  list: (search?: string) =>
    apiCall.get<UserSummaryResponse[]>('/api/users', { params: search ? { search } : undefined }),

  assignRole: (userId: string, roleId: string) =>
    apiCall.post<string>(`/api/users/${userId}/roles`, { roleId, expiresAt: null }),

  revokeRole: (userId: string, roleId: string) =>
    apiCall.delete<void>(`/api/users/${userId}/roles/${roleId}`),
}
