import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Tên danh mục phải có ít nhất 2 ký tự'),
  code: z.string().min(2, 'Mã danh mục phải có ít nhất 2 ký tự').toUpperCase(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>

export const updateCategorySchema = createCategorySchema.partial()
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
