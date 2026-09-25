'use client'

import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import type { EnrollmentStatus } from '../types/progress-tracking.types'

interface ProgressStatusTabsProps {
  selectedStatus: EnrollmentStatus
  onStatusChange: (status: EnrollmentStatus) => void
  totalCount: number
  completedCount: number
  inProgressCount: number
  enrolledCount: number
}

export function ProgressStatusTabs({
  selectedStatus,
  onStatusChange,
  totalCount,
  completedCount,
  inProgressCount,
  enrolledCount,
}: ProgressStatusTabsProps) {
  const tabs = [
    { value: 'ALL', label: 'Tất cả', count: totalCount },
    { value: 'COMPLETED', label: 'Đã hoàn thành', count: completedCount, dotColor: 'bg-emerald-500' },
    { value: 'IN_PROGRESS', label: 'Đang học', count: inProgressCount, dotColor: 'bg-sky-500' },
    { value: 'ENROLLED', label: 'Mới ghi danh', count: enrolledCount, dotColor: 'bg-amber-500' },
  ]

  return (
    <Tabs value={selectedStatus} onValueChange={(val) => onStatusChange(val as EnrollmentStatus)}>
      <TabsList className="h-9 p-1">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="px-3 text-xs sm:text-sm gap-2 h-full">
            {tab.dotColor && <span className={`size-2 rounded-full ${tab.dotColor}`} />}
            <span>{tab.label}</span>
            <Badge variant="secondary" className="h-5 px-2 text-xs">
              {tab.count}
            </Badge>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
