import { useQuery } from '@tanstack/react-query'
import { activitiesApiService } from '../services/activities.service'
import type { ActivitiesQueryParams } from '../types/activities.types'

export const activityKeys = {
  all: ['learning-activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (params?: ActivitiesQueryParams) => [...activityKeys.lists(), params] as const,
}

export function useLearningActivities(params?: ActivitiesQueryParams) {
  return useQuery({
    queryKey: activityKeys.list(params),
    queryFn: () => activitiesApiService.getAdminActivities(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30, // 30 seconds
  })
}
