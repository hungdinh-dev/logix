/**
 * Shared Organization Structure Contract between LMS and HRM
 */
export interface SharedDepartment {
  id: string
  code: string
  name: string
  description?: string | null
  parentId?: string | null
  status?: string
}

export interface SharedJobLevel {
  id: string
  code: string
  name: string
  level: number
  scopeType: number
  description?: string | null
}

export interface SharedPosition {
  id: string
  code: string
  name: string
  departmentId?: string
  jobLevelId?: string
}
