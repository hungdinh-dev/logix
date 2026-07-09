import { Search } from 'lucide-react'
import { LmsPageHeader } from '../shared/LmsPageHeader'

export function DashboardHeader() {
  return (
    <LmsPageHeader
      searchSlot={(
        <button
          type="button"
          className="bg-secondary text-muted-foreground hover:bg-muted/80 flex h-8 min-w-[220px] cursor-text items-center gap-2 rounded-md px-3 text-xs transition-colors"
          aria-label="Search courses"
        >
          <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Search courses...</span>
        </button>
      )}
      notificationLabel="Notifications, 5 unread"
      unreadCount={5}
      accountLabel="My Account"
      accountInitials="MT"
    />
  )
}
