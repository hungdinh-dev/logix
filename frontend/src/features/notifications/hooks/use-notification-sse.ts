'use client'

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { notificationKeys } from './use-notifications'
import type { AppNotification } from '../types/notification.types'

export function useNotificationSSE(isAuthenticated: boolean) {
  const queryClient = useQueryClient()
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!isAuthenticated || typeof window === 'undefined') {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      return
    }

    const token = localStorage.getItem('access_token')
    if (!token) return

    const sseUrl = `/api/notifications/stream?token=${encodeURIComponent(token)}`
    const eventSource = new EventSource(sseUrl)
    eventSourceRef.current = eventSource

    eventSource.addEventListener('notification', (e: MessageEvent) => {
      try {
        const notification: AppNotification = JSON.parse(e.data)

        // 1. Invalidate unread count & notification list cache
        queryClient.invalidateQueries({ queryKey: notificationKeys.all })

        // 2. Display real-time toast notification
        toast.info(notification.title, {
          description: notification.content,
          duration: 6000,
          action: notification.linkUrl
            ? {
                label: 'Xem bài học',
                onClick: () => {
                  if (notification.linkUrl) {
                    window.location.href = notification.linkUrl
                  }
                },
              }
            : undefined,
        })
      } catch (err) {
        console.error('Error parsing SSE event payload:', err)
      }
    })

    eventSource.onerror = (err) => {
      // Browser EventSource automatically reconnects on error/disconnect
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log('[SSE] Connection closed, ready to reconnect...')
      }
    }

    return () => {
      eventSource.close()
      eventSourceRef.current = null
    }
  }, [isAuthenticated, queryClient])
}
