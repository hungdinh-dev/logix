import { Response } from 'express'
import prisma from '../../config/prisma'

export interface CreateNotificationInput {
  userId: string
  actorId?: string | null
  type?: string
  title: string
  content: string
  linkUrl?: string | null
}

export class NotificationService {
  // Map of userId -> Set of active SSE Response connections
  private clients: Map<string, Set<Response>> = new Map()

  constructor() {
    // Keep-alive heartbeat every 25 seconds to prevent proxy/browser timeout
    setInterval(() => {
      this.broadcastHeartbeat()
    }, 25000)
  }

  /**
   * Register a new SSE client connection
   */
  public addClient(userId: string, res: Response) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set())
    }

    const userClients = this.clients.get(userId)!
    userClients.add(res)

    // Send initial handshake comment
    res.write(`: connected at ${new Date().toISOString()}\n\n`)

    res.on('close', () => {
      this.removeClient(userId, res)
    })
  }

  /**
   * Remove disconnected SSE client
   */
  public removeClient(userId: string, res: Response) {
    const userClients = this.clients.get(userId)
    if (userClients) {
      userClients.delete(res)
      if (userClients.size === 0) {
        this.clients.delete(userId)
      }
    }
  }

  /**
   * Heartbeat to keep connections alive through proxies / ELB
   */
  private broadcastHeartbeat() {
    for (const [_userId, connections] of this.clients.entries()) {
      for (const res of connections) {
        try {
          res.write(': keep-alive\n\n')
        } catch {
          // Closed connection will be cleaned up by close event
        }
      }
    }
  }

  /**
   * Push real-time SSE notification to a specific user
   */
  public pushNotification(userId: string, notification: any) {
    const connections = this.clients.get(userId)
    if (!connections || connections.size === 0) {
      return
    }

    const payload = `event: notification\ndata: ${JSON.stringify(notification)}\n\n`

    for (const res of connections) {
      try {
        res.write(payload)
      } catch (err) {
        console.error(`Error sending SSE to user ${userId}:`, err)
      }
    }
  }

  /**
   * Lấy danh sách thông báo của người dùng kèm phân trang
   */
  public async getUserNotifications(
    userId: string,
    limit: number = 20,
    offset: number = 0,
    isRead?: boolean
  ) {
    const where: any = { userId }
    if (typeof isRead === 'boolean') {
      where.isRead = isRead
    }

    const [items, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        include: {
          actor: {
            select: {
              id: true,
              fullName: true,
              employeeCode: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      }),
    ])

    return {
      items,
      total,
      unreadCount,
    }
  }

  /**
   * Lấy số lượng thông báo chưa đọc
   */
  public async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    })
  }

  /**
   * Đánh dấu 1 thông báo là đã đọc
   */
  public async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification || notification.userId !== userId) {
      throw new Error('Thông báo không tồn tại hoặc không thuộc về bạn')
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    })
  }

  /**
   * Đánh dấu tất cả thông báo là đã đọc
   */
  public async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    return { success: true }
  }

  /**
   * Tạo thông báo mới trong Database và đẩy realtime qua SSE
   */
  public async createAndPushNotification(input: CreateNotificationInput) {
    const notification = await prisma.notification.create({
      data: {
        userId: input.userId,
        actorId: input.actorId || null,
        type: input.type || 'COMMENT_REPLY',
        title: input.title,
        content: input.content,
        linkUrl: input.linkUrl || null,
        isRead: false,
      },
      include: {
        actor: {
          select: {
            id: true,
            fullName: true,
            employeeCode: true,
          },
        },
      },
    })

    // Realtime push to user if online
    this.pushNotification(input.userId, notification)

    return notification
  }
}

export const notificationService = new NotificationService()
