import { z } from 'zod'

export const createUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, 'fullName là bắt buộc'),
    email: z.string().email('Email không đúng định dạng'),
    employeeCode: z.string().optional(),
    jobLevelId: z.string().optional(),
    dateOfJoin: z.string().optional(),
  }),
})

export type CreateUserDto = z.infer<typeof createUserSchema>['body']
