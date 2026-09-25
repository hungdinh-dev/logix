import { api } from '@/lib/axios'
import { apiRoutes } from '@/config/api-routes'
import type { ActivitiesApiResponse, ActivitiesQueryParams } from '../types/activities.types'

export const activitiesApiService = {
  async getAdminActivities(params?: ActivitiesQueryParams): Promise<ActivitiesApiResponse> {
    const res = await api.get(apiRoutes.progress.adminActivities, { params })
    return res.data?.data
  },
}
