import { jwtDecode, type JwtPayload } from 'jwt-decode'

// Microsoft Role claim long URL key from OData/.NET Identity tokens
export const MICROSOFT_ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
export const MICROSOFT_EMAIL_CLAIM =
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
export const MICROSOFT_NAME_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'

export interface CustomJwtPayload extends JwtPayload {
  id?: string
  Id?: string
  email?: string
  name?: string
  role?: string
  avatar?: string
  avatarUrl?: string
  picture?: string
  [MICROSOFT_EMAIL_CLAIM]?: string
  [MICROSOFT_NAME_CLAIM]?: string
  [MICROSOFT_ROLE_CLAIM]?: string
}

export interface DecodedUser {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
}

/**
 * Decodes user information from JWT access token.
 * Supports standard claims and Microsoft Identity Claims (.NET Backend format).
 */
export const decodeUserFromToken = (token: string): DecodedUser | null => {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token)

    const id = decoded.Id || decoded.sub || decoded.id || ''

    const email = decoded[MICROSOFT_EMAIL_CLAIM] || decoded.email || ''

    const name = decoded[MICROSOFT_NAME_CLAIM] || decoded.name || ''

    const role = String(decoded[MICROSOFT_ROLE_CLAIM] || decoded.role || '').toUpperCase() // Finance Role expects uppercase ADMIN/USER

    const avatar = decoded.avatarUrl || decoded.avatar || decoded.picture || undefined

    return { id, email, name, role, avatar }
  } catch (error) {
    console.error('❌ [auth.utils] Lỗi giải mã JWT token:', error)
    return null
  }
}

/**
 * Checks if a token is valid (not expired).
 */
export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token)
    if (!decoded.exp) return false
    return decoded.exp > Date.now() / 1000
  } catch {
    return false
  }
}

/**
 * Returns remaining milliseconds before token expires.
 */
export const getTokenExpiresIn = (token: string): number => {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token)
    if (!decoded.exp) return 0
    const expiresIn = (decoded.exp - Date.now() / 1000) * 1000
    return expiresIn > 0 ? expiresIn : 0
  } catch {
    return 0
  }
}
