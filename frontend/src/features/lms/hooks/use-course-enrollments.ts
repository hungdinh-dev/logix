import { useQuery } from '@tanstack/react-query'
import { courseApiService } from '../services/course.service'
import type { CourseEnrollmentsResponse } from '../types/course.types'

export const courseEnrollmentKeys = {
  all: ['course-enrollments'] as const,
  course: (courseId: string | null) => [...courseEnrollmentKeys.all, courseId] as const,
  list: (
    courseId: string | null,
    params?: { search?: string; departmentId?: string; storeId?: string; status?: string }
  ) => [...courseEnrollmentKeys.course(courseId), params] as const,
}

export function useCourseEnrollments(
  courseId: string | null | undefined,
  params?: {
    search?: string
    departmentId?: string
    storeId?: string
    status?: string
  },
  options?: {
    enabled?: boolean
  }
) {
  const isEnabled = Boolean(courseId && (options?.enabled ?? true))

  return useQuery<CourseEnrollmentsResponse>({
    queryKey: courseEnrollmentKeys.list(courseId || null, params),
    queryFn: () => courseApiService.getCourseEnrollments(courseId!, params),
    enabled: isEnabled,
    staleTime: 10 * 1000, // 10s
  })
}
