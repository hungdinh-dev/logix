'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, FolderTree, RefreshCw, Download, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { DataTablePagination } from '@/components/common/DataTablePagination'
import { EntityAuditSidePeek } from '@/components/shared/EntityAuditSidePeek'
import type { BackendCourse } from '@/features/lms/types/course.types'
import {
  CoursesStatsCards,
  CoursesStatusTabs,
  CoursesToolbar,
  CoursesBulkActionBar,
  CoursesTable,
  CourseAssignDialog,
  CourseEnrollmentsSidePeek,
} from '../components'
import { useCoursesAdmin } from '../hooks/use-courses-admin'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function CoursesAdminPage() {
  const router = useRouter()
  const {
    courses,
    categories,
    isLoading,
    refetchCourses,
    // Filters
    search,
    setSearch,
    selectedCategories,
    setSelectedCategories,
    selectedStatus,
    setSelectedStatus,
    selectedType,
    setSelectedType,
    selectedProgressions,
    setSelectedProgressions,
    hasActiveFilters,
    handleResetFilters,
    // Sorting
    sortField,
    sortDirection,
    handleSort,
    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    paginatedCourses,
    filteredCourses,
    // Column Visibility
    columnVisibility,
    setColumnVisibility,
    // Selection
    selectedCourseIds,
    setSelectedCourseIds,
    isAllPageSelected,
    handleToggleSelectAllPage,
    handleToggleSelectRow,
    // Stats
    publishedCount,
    draftCount,
    archivedCount,
    totalEnrollments,
    // CSV
    handleExportCSV,
    // Modals
    statusChangeTarget,
    setStatusChangeTarget,
    isUpdatingStatus,
    handleConfirmStatusChange,
    progressionChangeTarget,
    setProgressionChangeTarget,
    isUpdatingProgression,
    handleConfirmProgressionChange,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleConfirmDelete,
    cloneTarget,
    setCloneTarget,
    isCloning,
    handleConfirmClone,
    bulkActionTarget,
    setBulkActionTarget,
    isBulkSubmitting,
    handleExecuteBulkAction,
    isAssignOpen,
    setIsAssignOpen,
    activeAssignCourse,
  } = useCoursesAdmin()

  const [auditTargetCourse, setAuditTargetCourse] = React.useState<BackendCourse | null>(null)
  const [enrollmentTargetCourse, setEnrollmentTargetCourse] = React.useState<BackendCourse | null>(null)

  return (
    <div className="p-6 mx-auto space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Quản Lý Khóa Học & Quy Trình Đào Tạo</span>
            <Badge variant="secondary" className="font-semibold text-xs px-2 py-0.5 rounded-full">
              LMS Hub
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản trị danh mục, nội dung đào tạo, cấu hình tiến trình & phân bổ tự động theo vị trí nhân sự
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 cursor-pointer text-xs h-9"
          >
            <Link href="/lms/admin/courses/categories">
              <FolderTree className="h-4 w-4 text-primary" />
              <span>Danh mục</span>
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
              refetchCourses()
              toast.info('Đang làm mới danh sách...')
            }}
            className="gap-1.5 cursor-pointer text-xs h-9"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </Button>

          <Button
            asChild
            className="gap-1.5 bg-primary text-primary-foreground shadow-xs cursor-pointer text-xs font-semibold h-9"
          >
            <Link href="/lms/admin/courses/create">
              <Plus className="h-4 w-4" />
              <span>Tạo Khóa Học Mới</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. KPI Stats Cards */}
      <CoursesStatsCards
        totalCourses={courses.length}
        totalCategories={categories.length}
        publishedCount={publishedCount}
        draftCount={draftCount}
        archivedCount={archivedCount}
        totalEnrollments={totalEnrollments}
      />


      <div className='flex flex-wrap items-center justify-between gap-3 min-h-10'>
        {/* 3. Status Tabs */}
        <CoursesStatusTabs
          selectedStatus={selectedStatus}
          onStatusChange={(val) => {
            setSelectedStatus(val)
            setCurrentPage(1)
          }}
          totalCount={courses.length}
          publishedCount={publishedCount}
          draftCount={draftCount}
          archivedCount={archivedCount}
        />

        {/* 5. Floating Bulk Actions Bar */}
        <CoursesBulkActionBar
          selectedCount={selectedCourseIds.length}
          onBulkStatus={(status) => setBulkActionTarget({ type: status, count: selectedCourseIds.length })}
          onBulkDelete={() => setBulkActionTarget({ type: 'DELETE', count: selectedCourseIds.length })}
          onDeselectAll={() => setSelectedCourseIds([])}
        />
      </div>

      {/* 4. Toolbar & Filters */}
      <CoursesToolbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val)
          setCurrentPage(1)
        }}
        selectedCategories={selectedCategories}
        onCategoriesChange={(vals) => {
          setSelectedCategories(vals)
          setCurrentPage(1)
        }}
        categories={categories}
        selectedProgressions={selectedProgressions}
        onProgressionsChange={(vals) => {
          setSelectedProgressions(vals)
          setCurrentPage(1)
        }}
        selectedType={selectedType}
        onTypeChange={(val) => {
          setSelectedType(val)
          setCurrentPage(1)
        }}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        columnVisibility={columnVisibility}
        onToggleColumn={(key, visible) =>
          setColumnVisibility((prev) => ({ ...prev, [key]: visible }))
        }
      />


      {/* 6. Main Data Table */}
      <CoursesTable
        courses={paginatedCourses}
        isLoading={isLoading}
        isAllPageSelected={isAllPageSelected}
        selectedCourseIds={selectedCourseIds}
        columnVisibility={columnVisibility}
        sortField={sortField}
        sortDirection={sortDirection}
        hasActiveFilters={hasActiveFilters}
        onToggleSelectAllPage={handleToggleSelectAllPage}
        onToggleSelectRow={handleToggleSelectRow}
        onSort={handleSort}
        onResetFilters={handleResetFilters}
        onNavigate={(path) => router.push(path)}
        onRequestStatusChange={(course, nextStatus) => setStatusChangeTarget({ course, nextStatus })}
        onRequestProgressionChange={(course, nextMode) => setProgressionChangeTarget({ course, nextMode })}
        onRequestClone={(course) => setCloneTarget(course)}
        onRequestDelete={(course) => setDeleteTarget(course)}
        onRequestViewAudit={(course) => setAuditTargetCourse(course)}
        onRequestViewEnrollments={(course) => setEnrollmentTargetCourse(course)}
      />

      {/* 7. Data Table Pagination */}
      <DataTablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredCourses.length}
        selectedCount={selectedCourseIds.length}
        itemLabel="khóa học"
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setCurrentPage(1)
        }}
      />

      {/* 8. CONFIRM DIALOG: Status Change */}
      <ConfirmDialog
        open={!!statusChangeTarget}
        onOpenChange={(open) => !open && setStatusChangeTarget(null)}
        title="Xác nhận thay đổi trạng thái khóa học"
        variant={statusChangeTarget?.nextStatus === 'ARCHIVED' ? 'destructive' : 'warning'}
        isLoading={isUpdatingStatus}
        confirmText="Xác nhận đổi"
        onConfirm={handleConfirmStatusChange}
        description={
          statusChangeTarget && (
            <div className="space-y-2">
              <div>
                Bạn có chắc chắn muốn thay đổi trạng thái của khóa học:
                <p className="font-semibold text-foreground text-sm mt-0.5">
                  {statusChangeTarget.course.title} ({statusChangeTarget.course.code})
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/60 border border-border flex items-center justify-between text-xs">
                <div>
                  Hiện tại:{' '}
                  <Badge variant="outline" className="font-semibold">
                    {statusChangeTarget.course.status === 'PUBLISHED'
                      ? 'Đang phát hành'
                      : statusChangeTarget.course.status === 'DRAFT'
                        ? 'Bản nháp'
                        : 'Đã lưu trữ'}
                  </Badge>
                </div>
                <span className="text-muted-foreground font-bold">→</span>
                <div>
                  Chuyển sang:{' '}
                  <Badge
                    className={cn(
                      statusChangeTarget.nextStatus === 'PUBLISHED' && 'bg-emerald-600',
                      statusChangeTarget.nextStatus === 'DRAFT' && 'bg-amber-600',
                      statusChangeTarget.nextStatus === 'ARCHIVED' && 'bg-slate-600'
                    )}
                  >
                    {statusChangeTarget.nextStatus === 'PUBLISHED'
                      ? 'Đang phát hành'
                      : statusChangeTarget.nextStatus === 'DRAFT'
                        ? 'Bản nháp'
                        : 'Đã lưu trữ'}
                  </Badge>
                </div>
              </div>
              {statusChangeTarget.nextStatus === 'DRAFT' && (
                <p className="text-amber-600 dark:text-amber-400 text-[11px] bg-amber-50 dark:bg-amber-950/30 p-2 rounded border border-amber-200 dark:border-amber-900">
                  ⚠️ Lưu ý: Khi chuyển về Bản nháp, học viên sẽ không nhìn thấy khóa học này trên danh mục đào tạo nữa.
                </p>
              )}
              {statusChangeTarget.nextStatus === 'ARCHIVED' && (
                <p className="text-destructive text-[11px] bg-destructive/10 p-2 rounded border border-destructive/20">
                  ⚠️ Lưu ý: Khóa học sẽ được đưa vào kho lưu trữ và tạm ngừng mọi hoạt động đào tạo liên quan.
                </p>
              )}
            </div>
          )
        }
      />

      {/* 9. CONFIRM DIALOG: Progression Mode Change */}
      <ConfirmDialog
        open={!!progressionChangeTarget}
        onOpenChange={(open) => !open && setProgressionChangeTarget(null)}
        title="Xác nhận đổi chế độ tiến trình học"
        variant="info"
        icon={<Layers className="h-5 w-5 text-primary shrink-0" />}
        isLoading={isUpdatingProgression}
        confirmText="Xác nhận đổi"
        onConfirm={handleConfirmProgressionChange}
        description={
          progressionChangeTarget && (
            <div className="space-y-2">
              <div>
                Đổi chế độ tiến trình học cho khóa:
                <p className="font-semibold text-foreground text-sm mt-0.5">
                  {progressionChangeTarget.course.title}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/60 border border-border text-xs">
                Chế độ mới:{' '}
                <strong className="text-foreground">
                  {progressionChangeTarget.nextMode === 'FREE'
                    ? '🔓 Tự do (Học viên học bất kỳ bài nào)'
                    : progressionChangeTarget.nextMode === 'LINEAR_MODULE'
                      ? '📦 Tuần tự chương (Hoàn thành từng chương)'
                      : '🔗 Tuần tự bài (Phải học lần lượt từng bài)'}
                </strong>
              </div>
            </div>
          )
        }
      />

      {/* 10. CONFIRM DIALOG: Bulk Actions */}
      <ConfirmDialog
        open={!!bulkActionTarget}
        onOpenChange={(open) => !open && setBulkActionTarget(null)}
        title={
          bulkActionTarget?.type === 'DELETE'
            ? 'Xác nhận xóa hàng loạt'
            : 'Xác nhận đổi trạng thái hàng loạt'
        }
        variant={bulkActionTarget?.type === 'DELETE' ? 'destructive' : 'warning'}
        isLoading={isBulkSubmitting}
        confirmText="Xác nhận thực hiện"
        onConfirm={handleExecuteBulkAction}
        description={
          bulkActionTarget && (
            <div className="space-y-2">
              <div>
                Bạn đang chuẩn bị thực hiện hành động trên{' '}
                <strong className="text-foreground">{bulkActionTarget.count}</strong> khóa học đã chọn:
              </div>
              <div className="p-2.5 rounded-lg bg-muted/60 border border-border text-xs font-medium">
                {bulkActionTarget.type === 'PUBLISHED' && '🟢 Chuyển sang trạng thái: Đang phát hành'}
                {bulkActionTarget.type === 'DRAFT' && '🟡 Chuyển sang trạng thái: Bản nháp'}
                {bulkActionTarget.type === 'ARCHIVED' && '⚪ Chuyển sang trạng thái: Đã lưu trữ'}
                {bulkActionTarget.type === 'DELETE' && (
                  <span className="text-destructive font-semibold">
                    🔴 Xóa vĩnh viễn toàn bộ {bulkActionTarget.count} khóa học này!
                  </span>
                )}
              </div>
              {bulkActionTarget.type === 'DELETE' && (
                <p className="text-destructive text-[11px] bg-destructive/10 p-2 rounded border border-destructive/20">
                  ⚠️ Cảnh báo: Toàn bộ bài giảng và lịch sử học tập liên quan sẽ bị xóa và không thể phục hồi!
                </p>
              )}
            </div>
          )
        }
      />

      {/* 11. CONFIRM DIALOG: Single Delete Course */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xác nhận xóa khóa học"
        variant="destructive"
        isLoading={isDeleting}
        confirmText="Xóa vĩnh viễn"
        onConfirm={handleConfirmDelete}
        description={
          deleteTarget && (
            <div className="space-y-2">
              <div>
                Bạn có chắc chắn muốn xóa khóa học{' '}
                <strong className="text-foreground">{deleteTarget.title}</strong> ({deleteTarget.code})?
              </div>
              <p className="text-destructive font-medium text-[11px] bg-destructive/10 p-2 rounded border border-destructive/20">
                ⚠️ Cảnh báo: Toàn bộ cấu trúc bài giảng, video, bài kiểm tra và lịch sử học tập của nhân viên thuộc khóa học này sẽ bị xóa. Không thể khôi phục!
              </p>
            </div>
          )
        }
      />

      {/* 12. CONFIRM DIALOG: Clone Course */}
      <ConfirmDialog
        open={!!cloneTarget}
        onOpenChange={(open) => !open && setCloneTarget(null)}
        title="Sao chép khóa học (Clone Course)"
        variant="info"
        isLoading={isCloning}
        confirmText="Tạo bản sao"
        onConfirm={handleConfirmClone}
        description={
          cloneTarget && (
            <p>
              Hệ thống sẽ nhân bản khóa học <strong className="text-foreground">{cloneTarget.title}</strong> kèm theo toàn bộ giáo trình bài học, video và câu hỏi trắc nghiệm sang một khóa học mới ở trạng thái <strong>Bản nháp (Draft)</strong>.
            </p>
          )
        }
      />

      {/* 13. Auto Assign Dialog */}
      <CourseAssignDialog
        open={isAssignOpen}
        onOpenChange={setIsAssignOpen}
        course={activeAssignCourse}
        onSuccess={refetchCourses}
      />

      {/* 14. Notion-style Audit Trail Side Peek */}
      <EntityAuditSidePeek
        isOpen={!!auditTargetCourse}
        onClose={() => setAuditTargetCourse(null)}
        tableName="crs_courses"
        entityId={auditTargetCourse?.id}
        entityTitle={auditTargetCourse?.title}
        entitySubtitle={`Mã khóa học: ${auditTargetCourse?.code || ''}`}
      />

      {/* 15. Course Enrollments Side Peek */}
      <CourseEnrollmentsSidePeek
        isOpen={!!enrollmentTargetCourse}
        onClose={() => setEnrollmentTargetCourse(null)}
        course={enrollmentTargetCourse}
        onOpenAssignDialog={() => setIsAssignOpen(true)}
      />
    </div>
  )
}
