import { z } from 'zod'

export const createDepartmentSchema = z.object({
  body: z.object({
    departmentName: z.string().min(1, 'departmentName là bắt buộc'),
    departmentCode: z.string().min(1, 'departmentCode là bắt buộc'),
    isFactoryDept: z.boolean().optional(),
  }),
})

export type CreateDepartmentDto = z.infer<typeof createDepartmentSchema>['body']

export const updateDepartmentSchema = z.object({
  body: z.object({
    departmentName: z.string().optional(),
    departmentCode: z.string().optional(),
  }),
})

export type UpdateDepartmentDto = z.infer<typeof updateDepartmentSchema>['body']
