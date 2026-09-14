import { apiCall } from '@/lib/api'
import type { PermissionResponse } from '../types/admin.types'

export const permissionsService = {
  list: () =>
    apiCall.get<PermissionResponse[]>('/api/permissions'),

  getByRole: (roleId: string) =>
    apiCall.get<PermissionResponse[]>(`/api/roles/${roleId}/permissions`),
}
