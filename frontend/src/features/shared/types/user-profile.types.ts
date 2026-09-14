/**
 * Shared User Profile Contract between LMS and HRM
 */
export interface SharedUserProfile {
  id: string
  employeeCode?: string | null
  fullName: string
  email?: string | null
  avatar?: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  employmentStatus?: 'INTERN' | 'PROBATION' | 'OFFICIAL' | 'RESIGNED'
  store?: {
    id: string
    storeName: string
    storeCode: string
  } | null
  department?: {
    id: string
    deptName: string
    deptCode: string
  } | null
  position?: {
    id: string
    positionName: string
    positionCode: string
  } | null
  roles: string[]
}
