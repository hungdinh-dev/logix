import { api } from '@/lib/axios'
import { apiRoutes } from '@/config/api-routes'
import type { AdminProgressApiResponse, AdminProgressQueryParams } from '../types/progress-tracking.types'

export const progressApiService = {
  async getAdminProgress(params?: AdminProgressQueryParams): Promise<AdminProgressApiResponse> {
    const res = await api.get(apiRoutes.progress.adminTracking, { params })
    return res.data?.data
  },
}
