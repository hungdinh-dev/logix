import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { customFieldsService } from '../services/custom-fields.service'
import type { CreateCustomFieldPayload, UpdateCustomFieldPayload } from '../types/admin.types'

const KEY = 'custom-field-definitions'

export function useCustomFields(module?: string) {
  return useQuery({
    queryKey: [KEY, module],
    queryFn: () => customFieldsService.list(module),
  })
}

export function useCreateCustomField() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCustomFieldPayload) => customFieldsService.create(data),
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Tạo trường thành công') },
    onError: () => toast.error('Tạo trường thất bại'),
  })
}

export function useUpdateCustomField() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomFieldPayload }) =>
      customFieldsService.update(id, data),
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Cập nhật thành công') },
    onError: () => toast.error('Cập nhật thất bại'),
  })
}

export function useDeleteCustomField() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => customFieldsService.delete(id),
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Đã xóa trường') },
    onError: () => toast.error('Xóa thất bại'),
  })
}
