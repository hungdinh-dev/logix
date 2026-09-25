import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '../services/notification.service'

const NOTIFICATION_BASE_KEY = 'notifications' as const

export const notificationKeys = {
  all: [NOTIFICATION_BASE_KEY] as const,
  list: (isRead?: boolean) => [NOTIFICATION_BASE_KEY, 'list', { isRead }] as const,
  unreadCount: [NOTIFICATION_BASE_KEY, 'unread-count'] as const,
}

export function useNotifications(isRead?: boolean, limit = 20) {
  return useQuery({
    queryKey: notificationKeys.list(isRead),
    queryFn: () => notificationService.getNotifications(limit, 0, isRead),
    staleTime: 1000 * 30,
  })
}

export function useUnreadCount(enabled = true) {
  return useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: () => notificationService.getUnreadCount(),
    enabled,
    staleTime: 1000 * 15,
  })
}

export function useMarkAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}
