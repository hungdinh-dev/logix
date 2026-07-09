import { Search } from 'lucide-react'

import { LmsPageHeader } from '../shared/LmsPageHeader'
import { LMS_PALETTE } from '../shared/lms-palette'

export function CatalogHeader() {
  return (
    <LmsPageHeader
      searchSlot={(
        <label
          className="flex h-8 min-w-[220px] cursor-text items-center gap-2 rounded-md px-3 text-[12px]"
          style={{ backgroundColor: LMS_PALETTE.surfaceSoft, color: LMS_PALETTE.muted }}
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span>Search courses...</span>
        </label>
      )}
      notificationLabel="Notifications"
      unreadCount={5}
      accountLabel="My Account"
      accountInitials="MT"
    />
  )
}
