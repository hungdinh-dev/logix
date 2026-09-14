import { apiCall } from '@/lib/api'
import type {
  AddDepartmentMemberPayload,
  DepartmentMemberResponse,
  DepartmentResponse,
  DepartmentTreeResponse,
  ListParams,
  QueryResult,
  UpdateDepartmentMemberPayload,
} from '../types/admin.types'

export const departmentsService = {
  list: (params?: ListParams) =>
    apiCall.get<QueryResult<DepartmentResponse>>('/api/departments', { params }),

  create: (data: { departmentName: string; departmentCode: string; parentDepartmentId?: string; managerId?: string }) =>
    apiCall.post<string>('/api/departments', data),

  update: (id: string, data: { departmentName: string; departmentCode: string; parentDepartmentId?: string; managerId?: string; isActive: boolean }) =>
    apiCall.put<void>(`/api/departments/${id}`, data),

  delete: (id: string) =>
    apiCall.delete<void>(`/api/departments/${id}`),

  tree: () =>
    apiCall.get<DepartmentTreeResponse[]>('/api/departments/tree'),

  getMembers: (departmentId: string) =>
    apiCall.get<DepartmentMemberResponse[]>(`/api/departments/${departmentId}/members`),

  addMember: (userId: string, data: AddDepartmentMemberPayload) =>
    apiCall.post<string>(`/api/users/${userId}/departments`, data),

  updateMember: (userId: string, departmentId: string, data: UpdateDepartmentMemberPayload) =>
    apiCall.put<void>(`/api/users/${userId}/departments/${departmentId}`, data),

  removeMember: (userId: string, departmentId: string) =>
    apiCall.delete<void>(`/api/users/${userId}/departments/${departmentId}`),
}
