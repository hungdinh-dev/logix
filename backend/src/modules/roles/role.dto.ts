import { z } from 'zod'

export const createRoleSchema = z.object({
  body: z.object({
    roleName: z.string().min(1, 'roleName là bắt buộc'),
    displayName: z.string().optional(),
    description: z.string().optional(),
  }),
})

export type CreateRoleDto = z.infer<typeof createRoleSchema>['body']

export const updateRoleSchema = z.object({
  body: z.object({
    displayName: z.string().optional(),
    description: z.string().optional(),
  }),
})

export type UpdateRoleDto = z.infer<typeof updateRoleSchema>['body']

export const assignPermissionsSchema = z.object({
  body: z.object({
    permissionIds: z.array(z.string()),
  }),
})

export type AssignPermissionsDto = z.infer<typeof assignPermissionsSchema>['body']

export const syncRoleUsersSchema = z.object({
  body: z.object({
    toAdd: z.array(z.string()).optional(),
    toRemove: z.array(z.string()).optional(),
    expiresAt: z.string().nullable().optional(),
  }),
})

export type SyncRoleUsersDto = z.infer<typeof syncRoleUsersSchema>['body']
