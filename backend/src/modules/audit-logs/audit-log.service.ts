import prisma from '../../config/prisma'

export interface CreateAuditLogDto {
  tableName: string // e.g. 'crs_courses', 'crs_lessons', 'auth_users'
  entityId: string
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'CLONE' | 'SYNC' | 'ASSIGN'
  fieldName?: string | null
  oldValue?: string | null
  newValue?: string | null
  diff?: Record<string, { old: any; new: any }> | null
  metadata?: Record<string, any> | null
  userId?: string | null
}

export interface AuditLogItem {
  id: string
  tableName: string
  entityId: string
  action: string
  fieldName: string | null
  oldValue: string | null
  newValue: string | null
  diff: Record<string, { old: any; new: any }> | null
  metadata: Record<string, any> | null
  userId: string | null
  userName: string
  userEmail: string
  userAvatar: string
  createdAt: string
}

export class AuditLogService {
  /**
   * Helper tính toán sự khác biệt (Field Diff) giữa 2 object
   * Bỏ qua các trường hệ thống không cần thiết (id, createdAt, updatedAt, relations...)
   */
  public calculateDiff(
    oldObj: Record<string, any> | null | undefined,
    newObj: Record<string, any> | null | undefined,
    customIgnoredKeys: string[] = []
  ): { diff: Record<string, { old: any; new: any }>; changedFields: string[] } {
    if (!oldObj || !newObj) {
      return { diff: {}, changedFields: [] }
    }

    const defaultIgnored = [
      'id',
      'createdAt',
      'updatedAt',
      'created_at',
      'updated_at',
      'modified_at',
      'createdByUser',
      'updatedByUser',
      'category',
      'modules',
      'lessons',
      'targetPosition',
      'targetDepartment',
      'targetStore',
      'certificateTemplate',
      '_count',
    ]
    const ignored = new Set([...defaultIgnored, ...customIgnoredKeys])

    const diff: Record<string, { old: any; new: any }> = {}
    const changedFields: string[] = []

    for (const key of Object.keys(newObj)) {
      if (ignored.has(key)) continue
      const newVal = newObj[key]
      const oldVal = oldObj[key]

      // Bỏ qua nếu newVal là undefined
      if (newVal === undefined) continue

      // So sánh giá trị (hỗ trợ so sánh Date, Object, Primitive)
      const isDifferent = this.isValuesDifferent(oldVal, newVal)
      if (isDifferent) {
        diff[key] = {
          old: oldVal !== undefined ? oldVal : null,
          new: newVal,
        }
        changedFields.push(key)
      }
    }

    return { diff, changedFields }
  }

  private isValuesDifferent(a: any, b: any): boolean {
    if (a === b) return false
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() !== b.getTime()
    }
    if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
      return JSON.stringify(a) !== JSON.stringify(b)
    }
    return String(a ?? '') !== String(b ?? '')
  }

  /**
   * Ghi log thay đổi vào cơ sở dữ liệu (Non-blocking Safe Logging)
   */
  public async logChange(dto: CreateAuditLogDto) {
    try {
      return await prisma.auditLog.create({
        data: {
          tableName: dto.tableName,
          entityId: dto.entityId,
          action: dto.action,
          fieldName: dto.fieldName || null,
          oldValue: dto.oldValue || (dto.diff ? JSON.stringify(dto.diff) : null),
          newValue: dto.newValue || null,
          diff: dto.diff ? (dto.diff as any) : undefined,
          metadata: dto.metadata ? (dto.metadata as any) : undefined,
          userId: dto.userId || null,
        },
      })
    } catch (err) {
      console.error('[AuditLogService] Không thể ghi audit log:', err)
      // Non-blocking: không throw error để không làm gián đoạn luồng nghiệp vụ chính
      return null
    }
  }

  /**
   * Lấy lịch sử thay đổi của một thực thể (VD: Khóa học, Bài học...)
   */
  public async getEntityAuditTrail(params: {
    tableName: string
    entityId: string
    limit?: number
    page?: number
  }): Promise<{ items: AuditLogItem[]; total: number }> {
    const limit = Math.min(params.limit || 20, 100)
    const page = Math.max(params.page || 1, 1)
    const skip = (page - 1) * limit

    const where = {
      tableName: params.tableName,
      entityId: params.entityId,
    }

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              employeeCode: true,
            },
          },
        },
      }),
    ])

    const getAvatarInitials = (name: string) => {
      if (!name) return 'U'
      const parts = name.trim().split(/\s+/)
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    const items: AuditLogItem[] = logs.map((log) => ({
      id: log.id,
      tableName: log.tableName,
      entityId: log.entityId,
      action: log.action,
      fieldName: log.fieldName,
      oldValue: log.oldValue,
      newValue: log.newValue,
      diff: log.diff as any,
      metadata: log.metadata as any,
      userId: log.userId,
      userName: log.user?.fullName || 'Hệ thống / Quản trị viên',
      userEmail: log.user?.email || 'N/A',
      userAvatar: getAvatarInitials(log.user?.fullName || 'Admin'),
      createdAt: log.createdAt.toISOString(),
    }))

    return { items, total }
  }
}

export const auditLogService = new AuditLogService()
