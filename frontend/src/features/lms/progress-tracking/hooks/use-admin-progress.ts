import { useQuery } from '@tanstack/react-query'
import { progressApiService } from '../services/progress-tracking.service'
import type { AdminProgressQueryParams } from '../types/progress-tracking.types'

export const progressKeys = {
  all: ['admin-progress-tracking'] as const,
  lists: () => [...progressKeys.all, 'list'] as const,
  list: (params?: AdminProgressQueryParams) => [...progressKeys.lists(), params] as const,
}

export function useAdminProgress(params?: AdminProgressQueryParams) {
  return useQuery({
    queryKey: progressKeys.list(params),
    queryFn: () => progressApiService.getAdminProgress(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30, // 30s
  })
}
