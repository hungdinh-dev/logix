import prisma from '../../config/prisma'
import { LmsActivityType } from '@prisma/client'

export interface CreateLmsActivityDto {
  userId: string
  courseId?: string
  lessonId?: string
  activityType: LmsActivityType
  actionTitle: string
  targetName: string
  status?: 'SUCCESS' | 'ACTIVE' | 'FAILED' | 'IN_PROGRESS'
  statusLabel?: string
  metadata?: Record<string, any>
}

export interface LmsActivityItem {
  id: string
  userId: string
  user: string
  avatar: string
  email: string
  action: string
  target: string
  status: 'SUCCESS' | 'ACTIVE' | 'FAILED' | 'IN_PROGRESS'
  statusLabel: string
  timestamp: string
  metadata?: any
}

export class LmsActivityLogService {
  /**
   * Ghi nhận 1 sự kiện hoạt động học tập (Audit Log) vào cơ sở dữ liệu
   */
  public async logActivity(dto: CreateLmsActivityDto) {

    try {
      return await prisma.lmsActivityLog.create({
        data: {
          userId: dto.userId,
          courseId: dto.courseId || null,
          lessonId: dto.lessonId || null,
          activityType: dto.activityType,
          actionTitle: dto.actionTitle,
          targetName: dto.targetName,
          status: dto.status || 'SUCCESS',
          statusLabel: dto.statusLabel || null,
          metadata: dto.metadata ? (dto.metadata as any) : undefined,
        },
      })
    } catch (err) {
      console.error('[LmsActivityLog] Không thể ghi log hoạt động:', err)
      // Không throw error để tránh làm gián đoạn transaction nghiệp vụ chính
      return null
    }
  }

  /**
   * Lấy danh sách hoạt động học tập gần đây nhất cho Admin Dashboard
   */
  public async getRecentActivities(limit = 10): Promise<LmsActivityItem[]> {

    const logs = await prisma.lmsActivityLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    })

    const getAvatarInitials = (name: string) => {
      if (!name) return 'U'
      const parts = name.trim().split(/\s+/)
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    return logs.map((log) => ({
      id: log.id,
      userId: log.userId,
      user: log.user?.fullName || 'Nhân sự',
      avatar: getAvatarInitials(log.user?.fullName || ''),
      email: log.user?.email || 'N/A',
      action: log.actionTitle,
      target: log.targetName,
      status: log.status as 'SUCCESS' | 'ACTIVE' | 'FAILED' | 'IN_PROGRESS',
      statusLabel: log.statusLabel || '',
      timestamp: log.createdAt.toISOString(),
      metadata: log.metadata,
    }))
  }
}

export const lmsActivityLogService = new LmsActivityLogService()
