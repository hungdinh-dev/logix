import { z } from 'zod'

export const getNotificationsQuerySchema = z.object({
  query: z.object({
    limit: z.coerce.number().min(1).max(50).default(20),
    offset: z.coerce.number().min(0).default(0),
    isRead: z
      .enum(['true', 'false'])
      .optional()
      .transform((val) => (val ? val === 'true' : undefined)),
  }),
})

export type GetNotificationsQuery = z.infer<typeof getNotificationsQuerySchema>['query']
