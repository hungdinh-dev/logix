import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token là bắt buộc'),
})

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>
