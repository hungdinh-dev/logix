'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  CheckCheck,
  MessageSquare,
  Clock,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuth } from '@/features/auth/hooks/use-auth'
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
} from '../hooks/use-notifications'
import { useNotificationSSE } from '../hooks/use-notification-sse'
import { cn } from '@/lib/utils'
import type { AppNotification } from '../types/notification.types'

function formatNotificationTime(dateString: string): string {
  try {
    const diff = Math.max(0, Date.now() - new Date(dateString).getTime())
    const seconds = Math.floor(diff / 1000)
    if (seconds < 60) return 'Vừa xong'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m trước`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h trước`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} ngày trước`
    return new Date(dateString).toLocaleDateString('vi-VN')
  } catch {
    return 'Vừa xong'
  }
}

export function NotificationBell() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false)

  // Start real-time SSE listener
  useNotificationSSE(isAuthenticated)

  const { data: unreadCount = 0 } = useUnreadCount(isAuthenticated)
  const { data, isLoading } = useNotifications(
    filterUnreadOnly ? false : undefined
  )

  const markAsReadMutation = useMarkAsRead()
  const markAllAsReadMutation = useMarkAllAsRead()

  const notifications = data?.items || []

  const handleNotificationClick = (item: AppNotification) => {
    if (!item.isRead) {
      markAsReadMutation.mutate(item.id)
    }
    setOpen(false)

    if (item.linkUrl) {
      router.push(item.linkUrl)
    }
  }

  const handleMarkAllRead = () => {
    if (unreadCount > 0 && !markAllAsReadMutation.isPending) {
      markAllAsReadMutation.mutate()
    }
  }

  if (!isAuthenticated) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="Thông báo"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground animate-in zoom-in-50">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 sm:w-96 p-0 shadow-lg border border-border bg-card"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-foreground">Thông báo</h4>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/15 text-primary text-[10px] font-bold px-1.5 py-0.2">
                {unreadCount} mới
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterUnreadOnly((prev) => !prev)}
              className={cn(
                'text-[11px] px-2 py-0.5 rounded cursor-pointer transition-colors',
                filterUnreadOnly
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Chưa đọc
            </button>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={markAllAsReadMutation.isPending}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
                title="Đánh dấu tất cả đã đọc"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Đã đọc</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/50">
          {isLoading && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span className="text-xs">Đang tải thông báo...</span>
            </div>
          )}

          {!isLoading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-2">
                <Bell className="h-5 w-5 opacity-40" />
              </div>
              <p className="text-xs font-medium text-foreground">Không có thông báo nào</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {filterUnreadOnly
                  ? 'Bạn đã xem hết các thông báo mới.'
                  : 'Các cập nhật thảo luận bài học sẽ xuất hiện tại đây.'}
              </p>
            </div>
          )}

          {!isLoading &&
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={cn(
                  'flex items-start gap-3 p-3 transition-colors cursor-pointer text-left group',
                  item.isRead
                    ? 'hover:bg-muted/40'
                    : 'bg-primary/[0.04] hover:bg-primary/[0.08]'
                )}
              >
                {/* Icon indicator */}
                <div
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold mt-0.5',
                    item.isRead
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-primary/20 text-primary ring-2 ring-primary/20'
                  )}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <p
                      className={cn(
                        'text-xs line-clamp-1',
                        item.isRead
                          ? 'text-foreground/80 font-normal'
                          : 'text-foreground font-semibold'
                      )}
                    >
                      {item.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-0.5">
                      <Clock className="h-2.5 w-2.5 inline" />
                      {formatNotificationTime(item.createdAt)}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                    {item.content}
                  </p>
                </div>

                {/* Unread indicator dot */}
                {!item.isRead && (
                  <span className="h-2 w-2 rounded-full bg-primary shrink-0 self-center" />
                )}
              </div>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
