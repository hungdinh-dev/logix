import { Response } from 'express'
import { auditLogService } from './audit-log.service'
import { ApiResponse } from '../../common/responses/api-response'
import { AuthenticatedRequest } from '../../middlewares/auth.middleware'
import { BadRequestError } from '../../common/errors/app.error'

export class AuditLogController {
  /**
   * GET /api/audit-logs?tableName=crs_courses&entityId=...
   */
  public getEntityAuditLogs = async (req: AuthenticatedRequest, res: Response) => {
    const { tableName, entityId, limit, page } = req.query

    if (!tableName || !entityId) {
      throw new BadRequestError('Vui lòng cung cấp tableName và entityId')
    }

    const result = await auditLogService.getEntityAuditTrail({
      tableName: String(tableName),
      entityId: String(entityId),
      limit: limit ? Number(limit) : 20,
      page: page ? Number(page) : 1,
    })

    return res.json(
      ApiResponse.success(result, 'Lấy lịch sử thay đổi thực thể thành công')
    )
  }
}

export const auditLogController = new AuditLogController()
