import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { rolesService } from '../services/roles.service'
import { usersService } from '../services/users.service'

const KEY = 'roles'
const USERS_KEY = 'users'

function beError(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || fallback
  }
  return fallback
}

export function useRoles() {
  return useQuery({
    queryKey: [KEY],
    queryFn: () => rolesService.list(),
  })
}

export function useRolePermissions(roleId: string | undefined) {
  return useQuery({
    queryKey: [KEY, roleId, 'permissions'],
    queryFn: () => rolesService.getById(roleId!),
    enabled: !!roleId,
  })
}

export function useCreateRole() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: rolesService.create,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [KEY] })
      toast.success('Tạo vai trò thành công')
    },
    onError: (error) => {
      toast.error(beError(error, 'Tạo vai trò thất bại'))
    },
  })
}

export function useUpdateRole() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { displayName: string; description: string } }) =>
      rolesService.update(id, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [KEY] })
      toast.success('Cập nhật vai trò thành công')
    },
    onError: (error) => {
      toast.error(beError(error, 'Cập nhật vai trò thất bại'))
    },
  })
}

export function useDeleteRole() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: rolesService.delete,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [KEY] })
      toast.success('Xóa vai trò thành công')
    },
    onError: (error) => {
      toast.error(beError(error, 'Xóa vai trò thất bại'))
    },
  })
}

export function useAssignPermissions() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      rolesService.assignPermissions(roleId, permissionIds),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [KEY] })
      toast.success('Cập nhật quyền hạn thành công')
    },
    onError: (error) => {
      toast.error(beError(error, 'Cập nhật quyền hạn thất bại'))
    },
  })
}

export function useAllUsers() {
  return useQuery({
    queryKey: [USERS_KEY],
    queryFn: () => usersService.list(),
  })
}

export function useRoleUsers(roleId: string | undefined) {
  return useQuery({
    queryKey: [KEY, roleId, 'users'],
    queryFn: () => rolesService.getUsersByRole(roleId!),
    enabled: !!roleId,
  })
}

export function useSyncRoleUsers() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, toAdd, toRemove }: { roleId: string; toAdd: string[]; toRemove: string[] }) =>
      rolesService.syncUsers(roleId, toAdd, toRemove),
    onSuccess: (_data, { roleId }) => {
      client.invalidateQueries({ queryKey: [KEY, roleId, 'users'] })
      toast.success('Cập nhật người dùng thành công')
    },
    onError: (error) => {
      toast.error(beError(error, 'Cập nhật người dùng thất bại'))
    },
  })
}
