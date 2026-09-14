import { api } from '@/lib/axios'
import { apiRoutes } from '@/config/api-routes'
import type { AdminDashboardData } from '../types/admin-dashboard.types'

export const dashboardApiService = {
  async getAdminDashboardStats(): Promise<AdminDashboardData> {
    const response = await api.get(apiRoutes.progress.adminDashboard)
    return response.data.data
  },
}
