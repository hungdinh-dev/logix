import { useQuery } from '@tanstack/react-query'
import { permissionsService } from '../services/permissions.service'

const KEY = 'permissions'

export function usePermissions() {
  return useQuery({
    queryKey: [KEY],
    queryFn: () => permissionsService.list(),
  })
}

export function useRolePermissionIds(roleId: string | undefined) {
  return useQuery({
    queryKey: [KEY, 'by-role', roleId],
    queryFn: () => permissionsService.getByRole(roleId!),
    enabled: !!roleId,
  })
}
