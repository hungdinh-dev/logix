import { z } from 'zod'
import { UserStatus, EmploymentStatus } from '../enums'

export const createUserSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  roleId: z.string().uuid('Role ID không hợp lệ'),
  departmentId: z.string().uuid().optional().nullable(),
  positionId: z.string().uuid().optional().nullable(),
  storeId: z.string().uuid().optional().nullable(),
  employmentStatus: z.nativeEnum(EmploymentStatus).default(EmploymentStatus.PROBATION),
  status: z.nativeEnum(UserStatus).default(UserStatus.ACTIVE),
})
export type CreateUserInput = z.infer<typeof createUserSchema>

export const updateUserSchema = createUserSchema.partial().omit({ password: true })
export type UpdateUserInput = z.infer<typeof updateUserSchema>
