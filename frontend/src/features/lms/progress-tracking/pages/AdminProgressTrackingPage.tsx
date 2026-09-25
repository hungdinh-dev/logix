'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Download,
  RefreshCw,
  History,
  GraduationCap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTablePagination } from '@/components/common/DataTablePagination'
import { routePath } from '@/config/route-path'
import { toast } from 'sonner'
import { useAdminProgress } from '../hooks/use-admin-progress'
import {
  ProgressStatsCards,
  ProgressStatusTabs,
  ProgressBulkActionBar,
  ProgressToolbar,
  ProgressTable,
  StudentProgressSidePeek,
  type ProgressColumnVisibility,
} from '../components'
import type {
  EnrollmentStatus,
  AdminProgressItem,
} from '../types/progress-tracking.types'

export default function AdminProgressTrackingPage() {
  const router = useRouter()

  // State: Pagination & Filters
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<EnrollmentStatus>('ALL')
  const [courseId, setCourseId] = useState('ALL')
  const [departmentId, setDepartmentId] = useState('ALL')

  // State: Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // State: Detail Side Peek
  const [selectedDetailItem, setSelectedDetailItem] = useState<AdminProgressItem | null>(null)

  // State: Column Visibility
  const [columnVisibility, setColumnVisibility] = useState<ProgressColumnVisibility>({
    department: true,
    course: true,
    progress: true,
    quizScore: true,
    dates: true,
    status: true,
    actions: true,
  })

  // Data fetching via TanStack Query
  const { data, isLoading, isFetching, refetch } = useAdminProgress({
    page,
    pageSize,
    search: search.trim() || undefined,
    status: status !== 'ALL' ? status : undefined,
    courseId: courseId !== 'ALL' ? courseId : undefined,
    departmentId: departmentId !== 'ALL' ? departmentId : undefined,
  })

  const items = data?.items || []
  const hasActiveFilters = Boolean(
    search || status !== 'ALL' || courseId !== 'ALL' || departmentId !== 'ALL'
  )

  const handleResetFilters = () => {
    setSearch('')
    setStatus('ALL')
    setCourseId('ALL')
    setDepartmentId('ALL')
    setPage(1)
  }

  // Selection handlers
  const isAllSelected = items.length > 0 && selectedIds.length === items.length

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(items.map((it) => it.id))
    }
  }

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  // Action handlers
  const handleSingleReminder = (item: AdminProgressItem) => {
    toast.success(`Đã gửi thông báo nhắc nhở đến học viên: ${item.user.fullName} (${item.user.email})`)
  }

  const handleBulkReminder = () => {
    toast.success(`Đã gửi thông báo nhắc nhở thành công đến ${selectedIds.length} học viên được chọn!`)
  }

  const handleExportCSV = () => {
    if (items.length === 0) {
      toast.warning('Không có dữ liệu để xuất!')
      return
    }

    const headers = [
      'Họ và tên',
      'Mã NV',
      'Email',
      'Phòng ban',
      'Chi nhánh',
      'Khóa học',
      'Mã khóa',
      'Tiến độ (%)',
      'Điểm thi (%)',
      'Trạng thái',
      'Ngày ghi danh',
      'Ngày hoàn thành',
    ]

    const rows = items.map((it) => [
      `"${it.user.fullName}"`,
      `"${it.user.employeeCode || ''}"`,
      `"${it.user.email}"`,
      `"${it.user.department?.deptName || ''}"`,
      `"${it.user.store?.storeName || ''}"`,
      `"${it.course.title.replace(/"/g, '""')}"`,
      `"${it.course.code}"`,
      it.completionPercentage,
      it.highestQuizScore !== null ? it.highestQuizScore : '',
      `"${it.status}"`,
      it.enrolledAt ? new Date(it.enrolledAt).toLocaleDateString('vi-VN') : '',
      it.completedAt ? new Date(it.completedAt).toLocaleDateString('vi-VN') : '',
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `lms-tien-do-hoc-vien-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Đã xuất file CSV báo cáo tiến độ thành công!')
  }

  const handleExportSelected = () => {
    const selectedItems = items.filter((it) => selectedIds.includes(it.id))
    if (selectedItems.length === 0) {
      toast.warning('Vui lòng chọn ít nhất 1 học viên!')
      return
    }

    const headers = ['Họ và tên', 'Email', 'Phòng ban', 'Khóa học', 'Tiến độ (%)', 'Trạng thái']
    const rows = selectedItems.map((it) => [
      `"${it.user.fullName}"`,
      `"${it.user.email}"`,
      `"${it.user.department?.deptName || ''}"`,
      `"${it.course.title.replace(/"/g, '""')}"`,
      it.completionPercentage,
      `"${it.status}"`,
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `lms-hoc-vien-da-chon-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Đã xuất dữ liệu của ${selectedItems.length} học viên!`)
  }

  return (
    <div className="p-6 mx-auto space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Theo Dõi Tiến Độ &amp; Ghi Danh Đào Tạo</span>
            <Badge variant="secondary" className="font-semibold text-xs px-2 py-0.5 rounded-full">
              LMS Hub
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Giám sát quá trình hoàn thành bài học, kết quả bài thi và đôn đốc nhân sự hoàn thành đúng hạn
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 cursor-pointer text-xs h-9"
          >
            <Link href={routePath.lmsAdminActivities}>
              <History className="h-4 w-4 text-primary" />
              <span>Hoạt động gần đây</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5 cursor-pointer text-xs h-9"
            title="Xuất danh sách hiện tại ra file CSV/Excel"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
            <span className="hidden sm:inline">Xuất CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetch()
              toast.info('Đang làm mới dữ liệu tiến độ...')
            }}
            className="gap-1.5 cursor-pointer text-xs h-9"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </Button>
        </div>
      </div>

      {/* 2. KPI Stats Cards */}
      <ProgressStatsCards stats={data?.stats} isLoading={isLoading} />

      {/* 3. Status Tabs & Floating Bulk Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 min-h-10">
        <ProgressStatusTabs
          selectedStatus={status}
          onStatusChange={(val) => {
            setStatus(val)
            setPage(1)
          }}
          totalCount={data?.stats?.totalEnrollments ?? 0}
          completedCount={data?.stats?.completedCount ?? 0}
          inProgressCount={data?.stats?.inProgressCount ?? 0}
          enrolledCount={data?.stats?.enrolledCount ?? 0}
        />

        <ProgressBulkActionBar
          selectedCount={selectedIds.length}
          onSendReminder={handleBulkReminder}
          onExportSelected={handleExportSelected}
          onDeselectAll={() => setSelectedIds([])}
        />
      </div>

      {/* 4. Toolbar & Filters */}
      <ProgressToolbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        selectedCourseId={courseId}
        onCourseChange={(val) => {
          setCourseId(val)
          setPage(1)
        }}
        coursesList={data?.filters?.courses || []}
        selectedDepartmentId={departmentId}
        onDepartmentChange={(val) => {
          setDepartmentId(val)
          setPage(1)
        }}
        departmentsList={data?.filters?.departments || []}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        columnVisibility={columnVisibility}
        onToggleColumn={(key, visible) =>
          setColumnVisibility((prev) => ({ ...prev, [key]: visible }))
        }
      />

      {/* 5. Main Data Table */}
      <ProgressTable
        items={items}
        isLoading={isLoading}
        selectedIds={selectedIds}
        isAllSelected={isAllSelected}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectRow={handleToggleSelectRow}
        columnVisibility={columnVisibility}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        onViewDetail={(item) => setSelectedDetailItem(item)}
        onSendReminder={handleSingleReminder}
        onNavigateToCourse={(cId) => router.push(`/lms/courses/${cId}`)}
      />

      {/* 6. Data Table Pagination */}
      <DataTablePagination
        currentPage={page}
        pageSize={pageSize}
        totalItems={data?.pagination?.total || 0}
        selectedCount={selectedIds.length}
        itemLabel="học viên"
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />

      {/* 7. Student Progress Side Peek */}
      <StudentProgressSidePeek
        isOpen={!!selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
        item={selectedDetailItem}
        onSendReminder={handleSingleReminder}
        onNavigateToCourse={(cId) => router.push(`/lms/courses/${cId}`)}
      />
    </div>
  )
}
