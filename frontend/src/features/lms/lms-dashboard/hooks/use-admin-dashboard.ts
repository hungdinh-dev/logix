'use client'

import { useQuery } from '@tanstack/react-query'
import { dashboardApiService } from '../services/dashboard.service'
import type { AdminDashboardData } from '../types/admin-dashboard.types'

export function useAdminDashboard() {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<AdminDashboardData>({
    queryKey: ['lms-admin-dashboard'],
    queryFn: () => dashboardApiService.getAdminDashboardStats(),
    staleTime: 30 * 1000,
  })

  return {
    dashboardData: data,
    metrics: data?.metrics,
    topCourses: data?.topCourses || [],
    recentActivities: data?.recentActivities || [],
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : error ? 'Lỗi tải dữ liệu dashboard' : null,
    refetch,
  }
}

