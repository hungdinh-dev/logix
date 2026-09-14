'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft, Save,
  Loader2,
  AlertCircle,
  ExternalLink,
  BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { courseApiService } from '@/features/lms/services/course.service'
import { useCourseDetail } from '@/features/lms/hooks/use-course-detail'
import {
  CourseTargetingCard,
  TargetingValues
} from '../components/CourseTargetingCard'

export function CourseTargetingAdminPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const courseId = params?.id as string

  const { course, isLoading, error } = useCourseDetail(courseId)

  const [targeting, setTargeting] = useState<TargetingValues>({
    targetPositionId: null,
    targetDepartmentId: null,
    targetStoreId: null,
    targetEmploymentStatus: 'ALL',
  })

  useEffect(() => {
    if (course) {
      setTargeting({
        targetPositionId: course.targetPositionId || null,
        targetDepartmentId: course.targetDepartmentId || null,
        targetStoreId: course.targetStoreId || null,
        targetEmploymentStatus: (course.targetEmploymentStatus as any) || 'ALL',
      })
    }
  }, [course])

  const saveMutation = useMutation({
    mutationFn: async () => {
      return courseApiService.updateCourse(courseId, {
        targetPositionId: targeting.targetPositionId || undefined,
        targetDepartmentId: targeting.targetDepartmentId || undefined,
        targetStoreId: targeting.targetStoreId || undefined,
        targetEmploymentStatus: targeting.targetEmploymentStatus || undefined,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Đã lưu quy tắc phân bổ nhân sự tự động thành công!')
      router.push('/lms/admin/courses')
    },
    onError: (err: any) => {
      toast.error('Lỗi lưu phân bổ: ' + (err?.response?.data?.message || err.message))
    },
  })

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
        <h2 className="text-lg font-bold">Không tìm thấy khóa học</h2>
        <p className="text-xs text-muted-foreground">Khóa học không tồn tại hoặc đã bị xóa.</p>
        <Button onClick={() => router.push('/admin/courses')} variant="outline">
          Quay lại danh sách khóa học
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] bg-muted/20">
      {/* Header Sticky */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Link href="/lms/admin/courses">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Quay lại Khóa học</span>
            </Link>
          </Button>
          <div className="h-4 w-px bg-border" />
          <div>
            <h1 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>Phân Bổ Nhân Sự Tự Động</span>
              <span className="text-muted-foreground font-normal">/</span>
              <span className="text-primary truncate max-w-xs">{course.title}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
          >
            <Link href="/lms/admin/courses">
              Hủy bỏ
            </Link>
          </Button>
          <Button
            size="sm"
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
            className="gap-1.5 bg-primary shadow-sm"
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>Lưu & Kích hoạt Auto-Enroll</span>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6">
        {/* Course Summary Banner */}
        <div className="p-5 rounded-xl border bg-background shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-24 rounded-lg overflow-hidden border bg-muted shrink-0">
              {course.thumbnailUrl ? (
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                  <BookOpen className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-[10px]">
                  {course.code}
                </Badge>
                <Badge
                  className={`text-[10px] ${
                    course.courseType === 'ATTP'
                      ? 'bg-rose-600 text-white'
                      : course.courseType === 'ONBOARDING'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {course.courseType}
                </Badge>
              </div>
              <h2 className="text-base font-bold text-foreground">{course.title}</h2>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {course.description || 'Chưa có mô tả tóm tắt.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-1 text-xs"
            >
              <Link href={`/lms/admin/courses/${course.id}`}>
                <span>Soạn Giáo trình</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Targeting Component */}
        <CourseTargetingCard
          values={targeting}
          onChange={setTargeting}
          isOptional={false}
          defaultEnabled={true}
        />
      </main>
    </div>
  )
}
