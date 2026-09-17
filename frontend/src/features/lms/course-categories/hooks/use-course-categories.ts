'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { courseApiService, CreateCategoryPayload } from '@/features/lms/services/course.service'
import { useCourses } from '@/features/lms/hooks/use-courses'
import type { BackendCategory } from '@/features/lms/types/course.types'
import type {
  CategoryStatusFilter,
  CategoryFormData,
  CategoryStats,
} from '../types/course-categories.types'

export function useCourseCategories() {
  const queryClient = useQueryClient()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<CategoryStatusFilter>('ALL')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BackendCategory | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<BackendCategory | null>(null)

  // Form State
  const [formData, setFormData] = useState<CategoryFormData>({
    code: '',
    name: '',
    description: '',
    sortOrder: 1,
  })

  // Queries
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
  } = useQuery({
    queryKey: ['courses', 'categories'],
    queryFn: () => courseApiService.getCategories(),
    staleTime: 1000 * 60 * 5,
  })

  const { courses = [] } = useCourses()

  // Course count per category mapping
  const categoryCourseCountMap = useMemo(() => {
    const map = new Map<string, number>()
    courses.forEach((c: any) => {
      if (c.categoryId) {
        map.set(c.categoryId, (map.get(c.categoryId) || 0) + 1)
      }
    })
    return map
  }, [courses])

  // KPI Calculations
  const stats: CategoryStats = useMemo(() => {
    const totalCategories = categories.length
    const activeCategoriesCount = categories.filter((c: any) => c.isActive !== false).length
    const totalCourses = courses.length
    const mandatoryCoursesCount = courses.filter((c: any) => c.isMandatory).length

    return {
      totalCategories,
      activeCategoriesCount,
      totalCourses,
      mandatoryCoursesCount,
    }
  }, [categories, courses])

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchSearch =
        (cat.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.description || '').toLowerCase().includes(searchQuery.toLowerCase())

      const isActive = (cat as any).isActive !== false
      const matchStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'ACTIVE'
            ? isActive
            : !isActive

      return matchSearch && matchStatus
    })
  }, [categories, searchQuery, statusFilter])

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: CreateCategoryPayload) => courseApiService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', 'categories'] })
      setIsCreateModalOpen(false)
      resetForm()
      toast.success('Tạo danh mục mới thành công')
    },
    onError: (err: any) => {
      toast.error('Tạo danh mục thất bại: ' + (err?.response?.data?.message || err.message))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateCategoryPayload> }) =>
      courseApiService.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', 'categories'] })
      setEditingCategory(null)
      resetForm()
      toast.success('Cập nhật danh mục thành công')
    },
    onError: (err: any) => {
      toast.error('Cập nhật danh mục thất bại: ' + (err?.response?.data?.message || err.message))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseApiService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', 'categories'] })
      setDeletingCategory(null)
      toast.success('Xóa danh mục thành công')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err.message || 'Xóa danh mục thất bại')
    },
  })

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      sortOrder: (categories.length || 0) + 1,
    })
  }

  const handleOpenCreate = () => {
    resetForm()
    setIsCreateModalOpen(true)
  }

  const handleOpenEdit = (cat: BackendCategory) => {
    setEditingCategory(cat)
    setFormData({
      code: cat.code,
      name: cat.name || '',
      description: cat.description || '',
      sortOrder: cat.sortOrder || 1,
    })
  }

  const handleCloseFormModal = () => {
    setIsCreateModalOpen(false)
    setEditingCategory(null)
  }

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error('Vui lòng nhập đầy đủ tên và mã danh mục.')
      return
    }

    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        payload: formData,
      })
    } else {
      createMutation.mutate(formData)
    }
  }

  return {
    // Queries & Filtered Data
    categories,
    isCategoriesLoading,
    filteredCategories,
    categoryCourseCountMap,
    stats,

    // Filters State
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,

    // Modal / Form States
    isCreateModalOpen,
    editingCategory,
    deletingCategory,
    setDeletingCategory,
    formData,
    setFormData,

    // Mutations State
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Actions
    handleOpenCreate,
    handleOpenEdit,
    handleCloseFormModal,
    handleSubmitForm,
    handleConfirmDelete: (id: string) => deleteMutation.mutate(id),
  }
}
