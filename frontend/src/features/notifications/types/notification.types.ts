export interface NotificationActor {
  id: string
  fullName: string
  employeeCode: string | null
}

export interface AppNotification {
  id: string
  userId: string
  actorId: string | null
  actor?: NotificationActor | null
  type: string
  title: string
  content: string
  linkUrl: string | null
  isRead: boolean
  createdAt: string
}

export interface NotificationsResponse {
  items: AppNotification[]
  total: number
  unreadCount: number
}
