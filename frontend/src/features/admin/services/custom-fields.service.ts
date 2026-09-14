import { apiCall } from '@/lib/api'
import type {
  CustomFieldDefinitionResponse,
  CreateCustomFieldPayload,
  UpdateCustomFieldPayload,
} from '../types/admin.types'

export const customFieldsService = {
  list: (module?: string) =>
    apiCall.get<CustomFieldDefinitionResponse[]>('/api/custom-field-definitions', {
      params: module ? { module } : undefined,
    }),

  create: (data: CreateCustomFieldPayload) =>
    apiCall.post<string>('/api/custom-field-definitions', data),

  update: (id: string, data: UpdateCustomFieldPayload) =>
    apiCall.put<void>(`/api/custom-field-definitions/${id}`, data),

  delete: (id: string) =>
    apiCall.delete<void>(`/api/custom-field-definitions/${id}`),
}
