import { apiCall } from '@/lib/api'
import type { RoleResponse, UserSummaryResponse } from '../types/admin.types'

export const rolesService = {
  list: () =>
    apiCall.get<RoleResponse[]>('/api/roles'),

  getById: (id: string) =>
    apiCall.get<RoleResponse>(`/api/roles/${id}`),

  create: (data: { roleName: string; displayName: string; description: string }) =>
    apiCall.post<string>('/api/roles', data),

  update: (id: string, data: { displayName: string; description: string }) =>
    apiCall.put<void>(`/api/roles/${id}`, data),

  delete: (id: string) =>
    apiCall.delete<void>(`/api/roles/${id}`),

  assignPermissions: (id: string, permissionIds: string[]) =>
    apiCall.put<void>(`/api/roles/${id}/permissions`, { permissionIds }),

  getUsersByRole: (roleId: string) =>
    apiCall.get<UserSummaryResponse[]>(`/api/roles/${roleId}/users`),

  syncUsers: (roleId: string, toAdd: string[], toRemove: string[], expiresAt?: string | null) =>
    apiCall.put<void>(`/api/roles/${roleId}/users`, { toAdd, toRemove, expiresAt: expiresAt ?? null }),
}
