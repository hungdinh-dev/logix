import { Bell, ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface LmsPageHeaderProps {
  readonly searchSlot: ReactNode
  readonly notificationLabel: string
  readonly unreadCount: number
  readonly accountLabel: string
  readonly accountInitials: string
}

export function LmsPageHeader({
  searchSlot,
  notificationLabel,
  unreadCount,
  accountLabel,
  accountInitials,
}: LmsPageHeaderProps) {
  return (
    <header className="bg-background border-border sticky top-0 z-10 flex h-[52px] items-center gap-3 border-b px-6">
      <div className="flex-1" />
      {searchSlot}
      <div className="flex flex-1 items-center justify-end gap-2.5">
        <button
          type="button"
          className="text-muted-foreground hover:bg-card relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2"
          aria-label={notificationLabel}
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span
            className="bg-primary text-primary-foreground absolute -right-0.5 -top-0.5 flex h-[14px] w-[14px] items-center justify-center rounded-full text-[9px] font-bold"
            aria-hidden="true"
          >
            {unreadCount}
          </span>
        </button>

        <button
          type="button"
          className="hover:bg-card flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2"
          aria-label={`${accountLabel} menu`}
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
              {accountInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-foreground text-xs font-medium">
            {accountLabel}
          </span>
          <ChevronDown className="text-muted-foreground h-3 w-3" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}