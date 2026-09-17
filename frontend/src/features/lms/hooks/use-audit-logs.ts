import { useQuery } from '@tanstack/react-query'
import { auditLogService } from '../services/audit-log.service'
import type { AuditLogQueryResult } from '../types/audit-log.types'

export const auditLogKeys = {
  all: ['audit-logs'] as const,
  entity: (tableName: string, entityId: string | null) =>
    [...auditLogKeys.all, tableName, entityId] as const,
  list: (tableName: string, entityId: string | null, page?: number) =>
    [...auditLogKeys.entity(tableName, entityId), { page }] as const,
}

export function useEntityAuditLogs(
  tableName: string,
  entityId: string | null | undefined,
  options?: {
    enabled?: boolean
    page?: number
    limit?: number
  }
) {
  const isEnabled = Boolean(entityId && (options?.enabled ?? true))

  return useQuery<AuditLogQueryResult>({
    queryKey: auditLogKeys.list(tableName, entityId || null, options?.page),
    queryFn: () =>
      auditLogService.getEntityAuditLogs({
        tableName,
        entityId: entityId!,
        page: options?.page,
        limit: options?.limit || 50,
      }),
    enabled: isEnabled,
    staleTime: 30 * 1000, // 30s
  })
}
