import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../../config/prisma'
import { notificationService } from './notification.service'
import { ApiResponse } from '../../common/responses/api-response'
import { AuthenticatedRequest } from '../../middlewares/auth.middleware'

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key'

export class NotificationController {
  /**
   * SSE Stream endpoint (supports token via query param or header)
   */
  public stream = async (req: Request, res: Response) => {
    try {
      const token =
        (req.query.token as string) ||
        (req.headers.authorization && req.headers.authorization.split(' ')[1])

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Access Token missing' })
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any
      if (!decoded || (!decoded.userId && !decoded.id)) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token payload' })
      }

      const userAccount = await prisma.userAccount.findUnique({
        where: { id: decoded.userAccountId || decoded.id },
        include: { user: true },
      })

      if (!userAccount || !userAccount.user || !userAccount.user.isActive) {
        return res.status(401).json({ error: 'Unauthorized: User inactive' })
      }

      if (userAccount.isLocked) {
        return res.status(403).json({ error: 'Forbidden: Account locked' })
      }

      const userId = userAccount.user.id

      // Set standard SSE Headers
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable buffering for Nginx
      })

      if (typeof (res as any).flushHeaders === 'function') {
        ;(res as any).flushHeaders()
      }

      notificationService.addClient(userId, res)
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized: Token verification failed' })
    }
  }

  /**
   * Lấy danh sách thông báo
   */
  public getNotifications = async (req: AuthenticatedRequest, res: Response) => {
    const limit = Number(req.query.limit) || 20
    const offset = Number(req.query.offset) || 0
    const isRead =
      req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined

    const result = await notificationService.getUserNotifications(
      req.user!.id,
      limit,
      offset,
      isRead
    )

    return res.json(
      ApiResponse.success(result, 'Lấy danh sách thông báo thành công')
    )
  }

  /**
   * Lấy số lượng thông báo chưa đọc
   */
  public getUnreadCount = async (req: AuthenticatedRequest, res: Response) => {
    const unreadCount = await notificationService.getUnreadCount(req.user!.id)
    return res.json(
      ApiResponse.success({ unreadCount }, 'Lấy số lượng chưa đọc thành công')
    )
  }

  /**
   * Đánh dấu 1 thông báo là đã đọc
   */
  public markAsRead = async (req: AuthenticatedRequest, res: Response) => {
    const updated = await notificationService.markAsRead(
      req.params.id,
      req.user!.id
    )
    return res.json(
      ApiResponse.success(updated, 'Đã đánh dấu thông báo là đã đọc')
    )
  }

  /**
   * Đánh dấu tất cả thông báo là đã đọc
   */
  public markAllAsRead = async (req: AuthenticatedRequest, res: Response) => {
    const result = await notificationService.markAllAsRead(req.user!.id)
    return res.json(
      ApiResponse.success(result, 'Đã đánh dấu tất cả thông báo là đã đọc')
    )
  }
}

export const notificationController = new NotificationController()
