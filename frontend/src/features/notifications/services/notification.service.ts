import { api } from '@/lib/axios'
import type { NotificationsResponse, AppNotification } from '../types/notification.types'

export const notificationService = {
  async getNotifications(
    limit: number = 20,
    offset: number = 0,
    isRead?: boolean
  ): Promise<NotificationsResponse> {
    const res = await api.get('/api/notifications', {
      params: { limit, offset, isRead },
    })
    return res.data?.data || { items: [], total: 0, unreadCount: 0 }
  },

  async getUnreadCount(): Promise<number> {
    const res = await api.get('/api/notifications/unread-count')
    return res.data?.data?.unreadCount || 0
  },

  async markAsRead(id: string): Promise<AppNotification> {
    const res = await api.patch(`/api/notifications/${id}/read`)
    return res.data?.data
  },

  async markAllAsRead(): Promise<{ success: boolean }> {
    const res = await api.patch('/api/notifications/read-all')
    return res.data?.data
  },
}
