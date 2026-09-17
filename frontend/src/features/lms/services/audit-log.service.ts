import { api } from '@/lib/axios'
import { apiRoutes } from '@/config/api-routes'
import type { AuditLogQueryResult } from '../types/audit-log.types'

export interface GetEntityAuditLogsParams {
  tableName: string
  entityId: string
  limit?: number
  page?: number
}

export const auditLogService = {
  /**
   * Lấy danh sách lịch sử thay đổi (Audit Trail) của một thực thể
   */
  async getEntityAuditLogs(params: GetEntityAuditLogsParams): Promise<AuditLogQueryResult> {
    const response = await api.get(apiRoutes.auditLogs.base, {
      params,
    })
    return response.data?.data || { items: [], total: 0 }
  },
}
