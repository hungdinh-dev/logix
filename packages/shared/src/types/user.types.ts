import { UserStatus, EmploymentStatus } from '../enums'

export interface IUserSummary {
  id: string
  email: string
  fullName: string
  avatarUrl?: string | null
  status: UserStatus | string
  employmentStatus?: EmploymentStatus | string
  departmentName?: string | null
  positionTitle?: string | null
  storeName?: string | null
}
