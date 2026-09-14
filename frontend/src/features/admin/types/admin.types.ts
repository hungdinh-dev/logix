// ========================================
// 🏢 SYSTEM ADMIN TYPES (Quản trị hệ thống chung)
// ========================================
// Chỉ chứa types liên quan: Roles, Permissions, Departments (org structure), Users
// HR-specific types (Employee, CustomFields, ContractType...) → hr-admin.types.ts

export interface QueryResult<T> {
  items: T[]
  totalCount: number
}

export interface RoleResponse {
  id: string
  roleName: string
  displayName?: string
  description?: string
  isSystemRole: boolean
  permissions: PermissionResponse[]
}

export interface PermissionResponse {
  id: string
  permissionCode: string
  module: string
  description?: string
}

export interface DepartmentResponse {
  id: string
  departmentName: string
  departmentCode: string
  parentDepartmentId?: string
  parentDepartmentName?: string
  isActive: boolean
}

export type ScopeType = 1 | 2 | 3 | 4

export const SCOPE_TYPE_LABELS = {
  1: 'Own',
  2: 'Team',
  3: 'Department',
  4: 'All',
} as const satisfies Record<ScopeType, string>

export interface JobLevelResponse {
  id: string
  levelName: string
  levelOrder: number
  defaultScopeType: ScopeType
  description?: string
  baseSalaryMin?: number
  baseSalaryMax?: number
  isDeleted: boolean
}

export interface RoleNode {
  id: string
  roleName: string
  displayName?: string
  description?: string
  isSystemRole: boolean
  permissionCount: number
  permissions: PermissionResponse[]
  children: RoleNode[]
}

export interface DepartmentTreeResponse {
  id: string
  departmentName: string
  departmentCode: string
  parentDepartmentId?: string
  managerId?: string
  managerName?: string
  isActive: boolean
  children: DepartmentTreeResponse[]
}

export interface DepartmentMemberResponse {
  userDepartmentId: string
  userId: string
  fullName: string
  employeeCode: string
  email: string
  avatarUrl?: string
  jobLevelId?: string
  jobLevelName?: string
  jobLevelOrder?: number
  isPrimary: boolean
  startDate: string
}

export interface AddDepartmentMemberPayload {
  departmentId: string
  startDate: string
  jobLevelId?: string
}

export interface UpdateDepartmentMemberPayload {
  jobLevelId: string | null
}

export interface UserSummaryResponse {
  id: string
  fullName: string
  employeeCode: string
  email: string
  avatarUrl?: string
}

// PascalCase to match BE QueryInfo model
export interface ListParams {
  Top?: number
  Skip?: number
  SearchText?: string
  IsActive?: boolean
  NeedTotalCount?: boolean
}

// ========================================
// 🔄 RE-EXPORT HR types cho backward compatibility
// Khi Team HRM phát triển, xóa dòng này và import trực tiếp từ hr-admin.types.ts
// ========================================
export {
  type Gender,
  GENDER_LABELS,
  type ContractType,
  CONTRACT_TYPE_LABELS,
  type CreateEmployeePayload,
  type CustomFieldType,
  type ValidationType,
  FIELD_TYPE_LABELS,
  type CustomFieldOptionResponse,
  type CustomFieldDefinitionResponse,
  type CreateCustomFieldPayload,
  type UpdateCustomFieldPayload,
} from './hr-admin.types'
