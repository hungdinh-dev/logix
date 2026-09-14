import { RoleCode } from '../enums'

export interface IAuthUser {
  id: string
  email: string
  fullName: string
  role: RoleCode | string
  permissions: string[]
  avatarUrl?: string | null
  departmentId?: string | null
  positionId?: string | null
  storeId?: string | null
}

export interface IAuthTokens {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
}

export interface ILoginResponse {
  user: IAuthUser
  tokens: IAuthTokens
}
