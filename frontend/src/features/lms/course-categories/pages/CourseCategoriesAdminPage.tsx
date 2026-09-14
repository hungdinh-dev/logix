'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  FolderTree,
  FolderPlus,
  Search,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  ArrowUpDown,
  Download,
  SlidersHorizontal,
  GripVertical,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { TableSkeleton } from '@/components/shared/skeletons'
import { courseApiService, CreateCategoryPayload } from '@/features/lms/services/course.service'
import { useCourses } from '@/features/lms/hooks/use-courses'
import type { BackendCategory } from '@/features/lms/types/course.types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function CourseCategoriesAdminPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BackendCategory | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<BackendCategory | null>(null)

  // Form State
  const [formData, setFormData] = useState<CreateCategoryPayload>({
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

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: CreateCategoryPayload) => courseApiService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', 'categories'] })
      setIsCreateModalOpen(false)
      resetForm()
    },
    onError: (err: any) => {
      alert('Tạo danh mục thất bại: ' + (err?.response?.data?.message || err.message))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateCategoryPayload> }) =>
      courseApiService.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', 'categories'] })
      setEditingCategory(null)
      resetForm()
    },
    onError: (err: any) => {
      alert('Cập nhật danh mục thất bại: ' + (err?.response?.data?.message || err.message))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseApiService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', 'categories'] })
      setDeletingCategory(null)
    },
    onError: (err: any) => {
      alert('Xóa danh mục thất bại: ' + (err?.response?.data?.message || err.message))
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

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.code.trim()) {
      alert('Vui lòng nhập đầy đủ tên và mã danh mục.')
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
  const totalCategories = categories.length
  const activeCategoriesCount = categories.filter((c: any) => c.isActive !== false).length
  const totalCourses = courses.length
  const mandatoryCoursesCount = courses.filter((c: any) => c.isMandatory).length

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

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">
            <span>Khóa học</span>
            <span>/</span>
            <span className="text-primary">crs_categories</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Danh mục Chương trình Đào tạo
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 max-w-3xl">
            Quản lý các nhóm chương trình đào tạo doanh nghiệp (Hội nhập Onboarding, An toàn ATTP, Vận hành F&B, Kỹ năng lãnh đạo) theo cấu trúc chuẩn Prisma Enterprise.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <Link href="/lms/admin/courses">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>Xem Danh sách Khóa học</span>
            </Link>
          </Button>

          <Button onClick={handleOpenCreate} size="sm" className="gap-1.5 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Thêm Danh mục Mới</span>
          </Button>
        </div>
      </div>

      {/* Bento KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <Card className="relative overflow-hidden border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Tổng danh mục
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <FolderTree className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isCategoriesLoading ? (
                <Skeleton className="h-8 w-14" />
              ) : (
                totalCategories
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>100% indexed schema</span>
            </p>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="relative overflow-hidden border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Đang hoạt động
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isCategoriesLoading ? (
                <Skeleton className="h-8 w-14" />
              ) : (
                activeCategoriesCount
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalCategories > 0
                ? `${Math.round((activeCategoriesCount / totalCategories) * 100)}% khả dụng`
                : 'Chưa có dữ liệu'}
            </p>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="relative overflow-hidden border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Khóa học liên kết
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
              <BookOpen className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isCategoriesLoading ? (
                <Skeleton className="h-8 w-14" />
              ) : (
                totalCourses
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 text-indigo-600 font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Quan hệ 1-N `_count.courses`</span>
            </p>
          </CardContent>
        </Card>

        {/* KPI 4 */}
        <Card className="relative overflow-hidden border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Khóa học bắt buộc (Mandatory)
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isCategoriesLoading ? (
                <Skeleton className="h-8 w-14" />
              ) : (
                mandatoryCoursesCount
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tuân thủ pháp chế & SLA hội nhập
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex-1 w-full flex items-center gap-3">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên danh mục hoặc mã code (vd: FNB, ONB)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-1 border rounded-lg p-1 bg-muted/30">
              <Button
                variant={statusFilter === 'ALL' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => setStatusFilter('ALL')}
              >
                Tất cả ({totalCategories})
              </Button>
              <Button
                variant={statusFilter === 'ACTIVE' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => setStatusFilter('ACTIVE')}
              >
                Đang hoạt động ({activeCategoriesCount})
              </Button>
              <Button
                variant={statusFilter === 'INACTIVE' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => setStatusFilter('INACTIVE')}
              >
                Đã ẩn ({totalCategories - activeCategoriesCount})
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Categories Table */}
      <Card className="overflow-hidden border-border/80">
        {isCategoriesLoading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider border-b">
                  <th className="py-3 px-4 w-16 text-center">Thứ tự</th>
                  <th className="py-3 px-4 w-36">Mã code</th>
                  <th className="py-3 px-6">Tên danh mục & Mô tả</th>
                  <th className="py-3 px-6 w-48 text-center">Khóa học liên kết</th>
                  <th className="py-3 px-4 w-36 text-center">Trạng thái</th>
                  <th className="py-3 px-4 w-28 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                <TableSkeleton rows={5} cols={6} />
              </tbody>
            </table>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <FolderTree className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <h3 className="text-base font-semibold text-foreground">Không tìm thấy danh mục nào</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {searchQuery
                ? 'Không có danh mục nào khớp với từ khóa tìm kiếm của bạn.'
                : 'Hệ thống chưa có danh mục nào. Hãy tạo danh mục đầu tiên.'}
            </p>
            {!searchQuery && (
              <Button onClick={handleOpenCreate} size="sm" className="mt-4 gap-1.5">
                <Plus className="h-4 w-4" />
                <span>+ Thêm Danh mục</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider border-b">
                  <th className="py-3 px-4 w-16 text-center">Thứ tự</th>
                  <th className="py-3 px-4 w-36">Mã code</th>
                  <th className="py-3 px-6">Tên danh mục & Mô tả</th>
                  <th className="py-3 px-6 w-48 text-center">Khóa học liên kết</th>
                  <th className="py-3 px-4 w-36 text-center">Trạng thái</th>
                  <th className="py-3 px-4 w-28 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filteredCategories.map((cat, idx) => {
                  const courseCount =
                    categoryCourseCountMap.get(cat.id) ||
                    (cat as any)._count?.courses ||
                    0
                  const isActive = (cat as any).isActive !== false

                  return (
                    <tr key={cat.id} className="hover:bg-muted/40 transition-colors">
                      {/* Sort Order */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground">
                          <GripVertical className="h-4 w-4 text-muted-foreground/40 cursor-grab" />
                          <span className="font-semibold text-xs">{cat.sortOrder || idx + 1}</span>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className="font-mono text-xs font-semibold">
                          {cat.code}
                        </Badge>
                      </td>

                      {/* Name & Description */}
                      <td className="py-3.5 px-6">
                        <div>
                          <div className="font-semibold text-foreground flex items-center gap-2">
                            <span>{cat.name}</span>
                          </div>
                          {cat.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Course Count */}
                      <td className="py-3.5 px-6 text-center">
                        <Link href={`/lms/admin/courses?categoryId=${cat.id}`}>
                          <Badge
                            variant="secondary"
                            className="font-medium gap-1 text-xs cursor-pointer hover:bg-secondary/80"
                          >
                            <BookOpen className="h-3 w-3" />
                            <span>{courseCount} khóa học</span>
                            <ExternalLink className="h-2.5 w-2.5 ml-0.5 opacity-60" />
                          </Badge>
                        </Link>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <Badge
                          variant={isActive ? 'default' : 'outline'}
                          className={
                            isActive
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px]'
                              : 'text-muted-foreground text-[11px]'
                          }
                        >
                          {isActive ? 'Đang hoạt động' : 'Đã ẩn'}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Chỉnh sửa danh mục"
                            onClick={() => handleOpenEdit(cat)}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            title="Xóa danh mục"
                            onClick={() => setDeletingCategory(cat)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal: Create & Edit Category */}
      <Dialog
        open={isCreateModalOpen || !!editingCategory}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false)
            setEditingCategory(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmitForm}>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Chỉnh sửa Danh mục Chương trình' : 'Thêm Danh mục Chương trình Mới'}
              </DialogTitle>
              <DialogDescription>
                Khai báo mã code và thông tin nhóm đào tạo theo cấu trúc chuẩn cơ sở dữ liệu.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="cat-code">
                  Mã Danh mục (Code) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cat-code"
                  placeholder="vd: ONBOARDING, FOOD_SAFETY, OPS..."
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cat-name">
                  Tên Danh mục <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cat-name"
                  placeholder="vd: Hội nhập Onboarding, An toàn Thực phẩm..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cat-desc">Mô tả tóm tắt</Label>
                <Textarea
                  id="cat-desc"
                  placeholder="Mô tả phạm vi và mục tiêu của nhóm chương trình đào tạo này..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cat-order">Thứ tự hiển thị</Label>
                <Input
                  id="cat-order"
                  type="number"
                  min={1}
                  value={formData.sortOrder || 1}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setEditingCategory(null)
                }}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="gap-1.5"
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span>{editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục'}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog: Delete Confirm */}
      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa danh mục?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục{' '}
              <strong className="text-foreground">{deletingCategory?.name}</strong> (
              <span className="font-mono">{deletingCategory?.code}</span>)? Các khóa học thuộc danh mục này sẽ cần được phân loại lại.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={() => deletingCategory && deleteMutation.mutate(deletingCategory.id)}
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xác nhận Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
