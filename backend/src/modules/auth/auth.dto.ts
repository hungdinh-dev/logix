import { z } from 'zod'

export const loginSchema = z.object({
  body: z
    .object({
      loginEmail: z.string().optional(),
      email: z.string().optional(),
      password: z.string().min(1, 'Mật khẩu không được để trống'),
    })
    .refine((data) => data.loginEmail || data.email, {
      message: 'Email đăng nhập không được để trống',
      path: ['loginEmail'],
    }),
})

export type LoginDto = z.infer<typeof loginSchema>['body']

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token là bắt buộc'),
  }),
})

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>['body']
