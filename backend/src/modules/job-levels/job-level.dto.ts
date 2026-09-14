import { z } from 'zod'

export const createJobLevelSchema = z.object({
  body: z.object({
    levelName: z.string().min(1, 'levelName là bắt buộc'),
    description: z.string().optional(),
  }),
})

export type CreateJobLevelDto = z.infer<typeof createJobLevelSchema>['body']

export const updateJobLevelSchema = z.object({
  body: z.object({
    levelName: z.string().min(1, 'levelName là bắt buộc'),
  }),
})

export type UpdateJobLevelDto = z.infer<typeof updateJobLevelSchema>['body']
