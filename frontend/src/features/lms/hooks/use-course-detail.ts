import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { courseApiService, type SyncCurriculumPayload } from '../services/course.service'
import type { BackendCourse } from '../types/course.types'

export const COURSE_DETAIL_QUERY_KEY = (id: string) => ['courses', 'detail', id]

export function useCourseDetail(courseId: string) {
  const queryClient = useQueryClient()

  const {
    data: course,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<BackendCourse>({
    queryKey: COURSE_DETAIL_QUERY_KEY(courseId),
    queryFn: () => courseApiService.getCourseById(courseId),
    enabled: !!courseId,
    staleTime: 0, // Ensure fresh data on navigation
    refetchOnMount: 'always',
  })

  const syncCurriculumMutation = useMutation({
    mutationFn: (payload: SyncCurriculumPayload) =>
      courseApiService.syncCourseCurriculum(courseId, payload),
    onSuccess: (updatedCourse) => {
      // Invalidate and update detail cache
      queryClient.setQueryData(COURSE_DETAIL_QUERY_KEY(courseId), updatedCourse)
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] })
    },
  })

  return {
    course,
    isLoading,
    isFetching,
    error,
    refetch,
    syncCurriculum: syncCurriculumMutation.mutateAsync,
    isSyncing: syncCurriculumMutation.isPending,
  }
}
