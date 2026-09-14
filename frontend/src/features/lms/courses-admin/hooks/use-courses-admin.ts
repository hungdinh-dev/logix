'use client'

import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { useCourses } from '@/features/lms/hooks/use-courses'
import { courseApiService } from '@/features/lms/services/course.service'
import type { BackendCourse } from '@/features/lms/types/course.types'
import type {
  SortField,
  SortDirection,
  ColumnVisibility,
  CourseStatus,
  ProgressionMode,
  CourseTypeFilter,
  StatusChangeTarget,
  ProgressionChangeTarget,
  BulkActionTarget,
} from '../types/courses-admin.types'

export function useCoursesAdmin() {
  const {
    courses,
    categories,
    isLoading,
    refetchCourses,
    cloneCourse,
    updateStatus,
    deleteCourse,
  } = useCourses()

  // Filter States
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [selectedType, setSelectedType] = useState<CourseTypeFilter>('ALL')
  const [selectedProgressions, setSelectedProgressions] = useState<string[]>([])

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Sorting State
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Column Visibility State
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    code: true,
    category: true,
    type: true,
    progression: true,
    status: true,
    enrollment: true,
    updatedAt: false,
    actions: true,
  })

  // Row Selection State
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([])

  // Quick Action Confirmations
  const [statusChangeTarget, setStatusChangeTarget] = useState<StatusChangeTarget | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const [progressionChangeTarget, setProgressionChangeTarget] = useState<ProgressionChangeTarget | null>(null)
  const [isUpdatingProgression, setIsUpdatingProgression] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<BackendCourse | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [cloneTarget, setCloneTarget] = useState<BackendCourse | null>(null)
  const [isCloning, setIsCloning] = useState(false)

  // Bulk Action Confirmation State
  const [bulkActionTarget, setBulkActionTarget] = useState<BulkActionTarget | null>(null)
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false)

  // Assign Dialog State
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [activeAssignCourse, setActiveAssignCourse] = useState<BackendCourse | null>(null)

  // 1. Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())

      const matchesCat =
        selectedCategories.length === 0 ||
        (!!c.categoryId && selectedCategories.includes(c.categoryId))
      const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus
      const matchesType =
        selectedType === 'ALL' ||
        (selectedType === 'MANDATORY' && c.isMandatory) ||
        (selectedType === 'OPTIONAL' && !c.isMandatory)
      const matchesProgression =
        selectedProgressions.length === 0 ||
        selectedProgressions.some((p) =>
          p === 'LINEAR_LESSON'
            ? !c.progressionMode || c.progressionMode === 'LINEAR_LESSON'
            : c.progressionMode === p
        )

      return matchesSearch && matchesCat && matchesStatus && matchesType && matchesProgression
    })
  }, [courses, search, selectedCategories, selectedStatus, selectedType, selectedProgressions])

  // 2. Sort courses
  const sortedCourses = useMemo(() => {
    if (!sortField) return filteredCourses

    return [...filteredCourses].sort((a, b) => {
      let valA: any
      let valB: any

      if (sortField === 'title') {
        valA = a.title.toLowerCase()
        valB = b.title.toLowerCase()
      } else if (sortField === 'code') {
        valA = a.code.toLowerCase()
        valB = b.code.toLowerCase()
      } else if (sortField === 'status') {
        valA = a.status
        valB = b.status
      } else if (sortField === 'enrollments') {
        valA = a._count?.enrollments || 0
        valB = b._count?.enrollments || 0
      } else if (sortField === 'updatedAt') {
        valA = new Date(a.updatedAt || a.createdAt || 0).getTime()
        valB = new Date(b.updatedAt || b.createdAt || 0).getTime()
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredCourses, sortField, sortDirection])

  // 3. Paginate courses
  const totalPages = Math.max(1, Math.ceil(sortedCourses.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedCourses = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize
    return sortedCourses.slice(start, start + pageSize)
  }, [sortedCourses, safeCurrentPage, pageSize])

  const hasActiveFilters =
    search !== '' ||
    selectedCategories.length > 0 ||
    selectedStatus !== 'ALL' ||
    selectedType !== 'ALL' ||
    selectedProgressions.length > 0

  const handleResetFilters = () => {
    setSearch('')
    setSelectedCategories([])
    setSelectedStatus('ALL')
    setSelectedType('ALL')
    setSelectedProgressions([])
    setCurrentPage(1)
  }

  // Handle Sort Toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else {
        setSortField(null)
        setSortDirection('asc')
      }
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Row Selection Helpers
  const isAllPageSelected =
    paginatedCourses.length > 0 &&
    paginatedCourses.every((c) => selectedCourseIds.includes(c.id))

  const handleToggleSelectAllPage = () => {
    if (isAllPageSelected) {
      const pageIds = new Set(paginatedCourses.map((c) => c.id))
      setSelectedCourseIds((prev) => prev.filter((id) => !pageIds.has(id)))
    } else {
      const pageIds = paginatedCourses.map((c) => c.id)
      setSelectedCourseIds((prev) => Array.from(new Set([...prev, ...pageIds])))
    }
  }

  const handleToggleSelectRow = (courseId: string) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    )
  }

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredCourses.length === 0) {
      toast.info('Không có dữ liệu khóa học để xuất')
      return
    }

    const headers = [
      'Mã khóa',
      'Tên khóa học',
      'Danh mục',
      'Loại khóa',
      'Thời hạn (ngày)',
      'Chế độ học',
      'Trạng thái',
      'Số học viên',
    ]

    const rows = filteredCourses.map((c) => [
      `"${c.code || ''}"`,
      `"${(c.title || '').replace(/"/g, '""')}"`,
      `"${(c.category?.name || 'Chưa phân loại').replace(/"/g, '""')}"`,
      `"${c.isMandatory ? 'Bắt buộc' : 'Tùy chọn'}"`,
      c.durationDays || 30,
      `"${
        c.progressionMode === 'FREE'
          ? 'Tự do'
          : c.progressionMode === 'LINEAR_MODULE'
          ? 'Tuần tự chương'
          : 'Tuần tự bài'
      }"`,
      `"${
        c.status === 'PUBLISHED'
          ? 'Đang phát hành'
          : c.status === 'DRAFT'
          ? 'Bản nháp'
          : 'Đã lưu trữ'
      }"`,
      c._count?.enrollments || 0,
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `danh-sach-khoa-hoc-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Đã xuất file CSV thành công!')
  }

  // Confirm Status Change
  const handleConfirmStatusChange = async () => {
    if (!statusChangeTarget) return
    const { course, nextStatus } = statusChangeTarget
    try {
      setIsUpdatingStatus(true)
      await updateStatus(course.id, nextStatus)
      const statusLabel =
        nextStatus === 'PUBLISHED'
          ? 'Đang phát hành'
          : nextStatus === 'DRAFT'
          ? 'Bản nháp'
          : 'Đã lưu trữ'
      toast.success(`Đã chuyển trạng thái khóa học sang "${statusLabel}"`)
      setStatusChangeTarget(null)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Cập nhật trạng thái thất bại')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Confirm Progression Mode Change
  const handleConfirmProgressionChange = async () => {
    if (!progressionChangeTarget) return
    const { course, nextMode } = progressionChangeTarget
    try {
      setIsUpdatingProgression(true)
      await courseApiService.updateCourse(course.id, { progressionMode: nextMode })
      await refetchCourses()
      const modeLabel =
        nextMode === 'FREE'
          ? 'Tự do'
          : nextMode === 'LINEAR_MODULE'
          ? 'Tuần tự chương'
          : 'Tuần tự bài'
      toast.success(`Đã cập nhật chế độ học sang "${modeLabel}"`)
      setProgressionChangeTarget(null)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Cập nhật chế độ học thất bại')
    } finally {
      setIsUpdatingProgression(false)
    }
  }

  // Confirm Clone
  const handleConfirmClone = async () => {
    if (!cloneTarget) return
    try {
      setIsCloning(true)
      await cloneCourse(cloneTarget.id)
      toast.success(`Đã sao chép khóa học "${cloneTarget.title}" thành công!`)
      setCloneTarget(null)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Sao chép thất bại')
    } finally {
      setIsCloning(false)
    }
  }

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      setIsDeleting(true)
      await deleteCourse(deleteTarget.id)
      toast.success(`Đã xóa khóa học "${deleteTarget.title}"`)
      setDeleteTarget(null)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Xóa khóa học thất bại')
    } finally {
      setIsDeleting(false)
    }
  }

  // Bulk Action Execution
  const handleExecuteBulkAction = async () => {
    if (!bulkActionTarget || selectedCourseIds.length === 0) return

    try {
      setIsBulkSubmitting(true)
      if (bulkActionTarget.type === 'DELETE') {
        await Promise.allSettled(selectedCourseIds.map((id) => deleteCourse(id)))
        toast.success(`Đã xóa ${selectedCourseIds.length} khóa học được chọn!`)
      } else {
        const nextStatus = bulkActionTarget.type
        await Promise.allSettled(selectedCourseIds.map((id) => updateStatus(id, nextStatus)))
        const statusLabel =
          nextStatus === 'PUBLISHED'
            ? 'Đang phát hành'
            : nextStatus === 'DRAFT'
            ? 'Bản nháp'
            : 'Đã lưu trữ'
        toast.success(`Đã chuyển ${selectedCourseIds.length} khóa học sang "${statusLabel}"!`)
      }
      setSelectedCourseIds([])
      setBulkActionTarget(null)
      refetchCourses()
    } catch (err: any) {
      toast.error('Có lỗi trong quá trình thao tác hàng loạt')
    } finally {
      setIsBulkSubmitting(false)
    }
  }

  // Stats calculation
  const publishedCount = useMemo(() => courses.filter((c) => c.status === 'PUBLISHED').length, [courses])
  const draftCount = useMemo(() => courses.filter((c) => c.status === 'DRAFT').length, [courses])
  const archivedCount = useMemo(() => courses.filter((c) => c.status === 'ARCHIVED').length, [courses])
  const totalEnrollments = useMemo(
    () => courses.reduce((acc, c) => acc + (c._count?.enrollments || 0), 0),
    [courses]
  )

  return {
    courses,
    categories,
    isLoading,
    refetchCourses,
    // Filters
    search,
    setSearch,
    selectedCategories,
    setSelectedCategories,
    selectedCategory: selectedCategories[0] || 'ALL',
    setSelectedCategory: (cat: string) => setSelectedCategories(cat === 'ALL' ? [] : [cat]),
    selectedStatus,
    setSelectedStatus,
    selectedType,
    setSelectedType,
    selectedProgressions,
    setSelectedProgressions,
    selectedProgression: selectedProgressions[0] || 'ALL',
    setSelectedProgression: (prog: string) => setSelectedProgressions(prog === 'ALL' ? [] : [prog]),
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
    totalPages,
    safeCurrentPage,
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
    // Actions
    handleExportCSV,
    // Status Modal
    statusChangeTarget,
    setStatusChangeTarget,
    isUpdatingStatus,
    handleConfirmStatusChange,
    // Progression Modal
    progressionChangeTarget,
    setProgressionChangeTarget,
    isUpdatingProgression,
    handleConfirmProgressionChange,
    // Delete Modal
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleConfirmDelete,
    // Clone Modal
    cloneTarget,
    setCloneTarget,
    isCloning,
    handleConfirmClone,
    // Bulk Modal
    bulkActionTarget,
    setBulkActionTarget,
    isBulkSubmitting,
    handleExecuteBulkAction,
    // Assign Modal
    isAssignOpen,
    setIsAssignOpen,
    activeAssignCourse,
    setActiveAssignCourse,
  }
}
