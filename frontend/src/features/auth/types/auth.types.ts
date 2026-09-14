import { z } from 'zod'

export const roleSchema = z.enum(['ADMIN', 'USER', 'TRAINER', 'STUDENT'])

export const Role = roleSchema.enum
export type Role = z.infer<typeof roleSchema> | string

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
