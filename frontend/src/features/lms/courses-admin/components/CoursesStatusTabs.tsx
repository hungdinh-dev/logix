'use client'

import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

interface CoursesStatusTabsProps {
  selectedStatus: string
  onStatusChange: (status: string) => void
  totalCount: number
  publishedCount: number
  draftCount: number
  archivedCount: number
}

export function CoursesStatusTabs({
  selectedStatus,
  onStatusChange,
  totalCount,
  publishedCount,
  draftCount,
  archivedCount,
}: CoursesStatusTabsProps) {

  const tabs = [
    { value: 'ALL', label: 'Tất cả', count: totalCount },
    { value: 'PUBLISHED', label: 'Đang phát hành', count: publishedCount, dotColor: 'bg-emerald-500' },
    { value: 'DRAFT', label: 'Bản nháp', count: draftCount, dotColor: 'bg-amber-500' },
    { value: 'ARCHIVED', label: 'Đã lưu trữ', count: archivedCount, dotColor: 'bg-slate-400' },
  ]

  return (
    <Tabs value={selectedStatus} onValueChange={onStatusChange}>
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
