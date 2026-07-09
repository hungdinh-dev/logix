import { z } from 'zod'

export const roleSchema = z.enum(['ADMIN', 'USER'])

// Expose as const object — preserves Role.ADMIN access without TypeScript enum
export const Role = roleSchema.enum
export type Role = z.infer<typeof roleSchema>

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
