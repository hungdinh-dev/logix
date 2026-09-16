import { Router } from 'express'
import { auditLogController } from './audit-log.controller'
import { authenticateToken } from '../../middlewares/auth.middleware'
import { asyncHandler } from '../../common/utils/async-handler'

const router = Router()

// GET /api/audit-logs?tableName=...&entityId=...
router.get(
  '/',
  authenticateToken,
  asyncHandler(auditLogController.getEntityAuditLogs)
)

export default router
