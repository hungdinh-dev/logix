'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  progressApiService,
  type CourseProgressResponse,
  type DashboardProgressResponse,
  type UpdateLessonProgressPayload,
} from '../services/progress.service'

export const PROGRESS_KEYS = {
  all: ['progress'] as const,
  dashboard: () => [...PROGRESS_KEYS.all, 'dashboard'] as const,
  course: (courseId: string) => [...PROGRESS_KEYS.all, 'course', courseId] as const,
}

export function useDashboardProgress() {
  return useQuery<DashboardProgressResponse>({
    queryKey: PROGRESS_KEYS.dashboard(),
    queryFn: () => progressApiService.getDashboardProgress(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

export function useCourseProgress(courseId: string) {
  return useQuery<CourseProgressResponse>({
    queryKey: PROGRESS_KEYS.course(courseId),
    queryFn: () => progressApiService.getCourseProgress(courseId),
    enabled: Boolean(courseId),
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
  })
}

export function useEnrollCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (courseId: string) => progressApiService.enrollCourse(courseId),
    onSuccess: (data, courseId) => {
      toast.success('Ghi danh khóa học thành công! Chúc bạn học tập hiệu quả.')
      queryClient.invalidateQueries({ queryKey: PROGRESS_KEYS.all })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: PROGRESS_KEYS.course(courseId) })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Ghi danh khóa học thất bại. Vui lòng thử lại sau.')
    },
  })
}

export function useUpdateLessonProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateLessonProgressPayload) => progressApiService.updateLessonProgress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROGRESS_KEYS.all })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Có lỗi khi cập nhật tiến độ bài học.')
    },
  })
}
