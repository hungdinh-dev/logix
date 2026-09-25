'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { RefreshCw, LayoutDashboard, UserCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTablePagination } from '@/components/common/DataTablePagination'
import { routePath } from '@/config/route-path'
import { useLearningActivities } from '../hooks/use-learning-activities'
import {
  ActivitiesStatsCards,
  ActivitiesToolbar,
  ActivitiesTable,
} from '../components'
import type { ActivityType, ActivityStatus } from '../types/activities.types'
import { toast } from 'sonner'

export default function LearningActivitiesPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [search, setSearch] = useState('')
  const [type, setType] = useState<ActivityType>('ALL')
  const [status, setStatus] = useState<ActivityStatus>('ALL')

  const { data, isLoading, isFetching, refetch } = useLearningActivities({
    page,
    pageSize,
    search: search.trim() || undefined,
    type: type !== 'ALL' ? type : undefined,
    status: status !== 'ALL' ? status : undefined,
  })

  const hasActiveFilters = Boolean(search || type !== 'ALL' || status !== 'ALL')

  const handleResetFilters = () => {
    setSearch('')
    setType('ALL')
    setStatus('ALL')
    setPage(1)
  }

  return (
    <div className="p-6 mx-auto space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Hoạt Động Học Tập Gần Đây</span>
            <Badge variant="secondary" className="font-semibold text-xs px-2 py-0.5 rounded-full">
              Live Feed
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Nhật ký theo dõi trực tiếp các hoạt động hoàn thành bài học, nộp bài kiểm tra và tiến độ ghi danh trên toàn hệ thống
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 cursor-pointer text-xs h-9"
          >
            <Link href={routePath.lmsAdminProgress}>
              <UserCheck className="h-4 w-4 text-primary" />
              <span>Tiến độ học viên</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 cursor-pointer text-xs h-9"
          >
            <Link href={routePath.lmsAdminDashboard}>
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              <span className="hidden sm:inline">Tổng quan</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetch()
              toast.info('Đang làm mới nhật ký hoạt động...')
            }}
            className="gap-1.5 cursor-pointer text-xs h-9"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </Button>
        </div>
      </div>

      {/* 2. KPI Stats Cards */}
      <ActivitiesStatsCards stats={data?.stats} isLoading={isLoading} />

      {/* 3. Toolbar & Filters */}
      <ActivitiesToolbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        type={type}
        onTypeChange={(val) => {
          setType(val)
          setPage(1)
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val)
          setPage(1)
        }}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Table */}
      <ActivitiesTable
        items={data?.items || []}
        isLoading={isLoading}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      {/* 5. Pagination */}
      <DataTablePagination
        currentPage={page}
        pageSize={pageSize}
        totalItems={data?.pagination?.total || 0}
        selectedCount={0}
        pageSizeOptions={[15, 30, 50, 100]}
        itemLabel="hoạt động"
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />
    </div>
  )
}
