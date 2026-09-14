import { Role } from '@/features/auth/types/auth.types'
import type { RouteConfig } from './index'

// 🎓 LMS Training Admin Routes (Tách biệt hoàn toàn khỏi System Admin)
export const lmsRoutes: RouteConfig[] = [
  // Learner Portal
  { path: '/lms/dashboard', roles: [], label: 'Dashboard Học tập', icon: 'LayoutDashboard' },
  { path: '/lms/courses', roles: [], label: 'Khóa học Của tôi', icon: 'BookOpen' },
  { path: '/lms/progress', roles: [], label: 'Tiến độ Đào tạo', icon: 'Activity' },
  { path: '/lms/reports', roles: [], label: 'Báo cáo', icon: 'FileText' },

  // LMS Training Admin
  { path: '/lms/admin/dashboard', roles: [Role.ADMIN, 'TRAINER', 'INSTRUCTOR'], label: 'Tổng quan Đào tạo', icon: 'LayoutDashboard' },
  { path: '/lms/admin/courses', roles: [Role.ADMIN, 'TRAINER', 'INSTRUCTOR'], label: 'Quản lý Khóa học', icon: 'BookOpen' },
  { path: '/lms/admin/courses/categories', roles: [Role.ADMIN, 'TRAINER', 'INSTRUCTOR'], label: 'Danh mục Chương trình', icon: 'FolderTree' },
  { path: '/lms/admin/certificates', roles: [Role.ADMIN, 'TRAINER', 'INSTRUCTOR'], label: 'Quản lý Chứng chỉ & ATTP', icon: 'Award' },
  { path: '/lms/admin/progress', roles: [Role.ADMIN, 'TRAINER', 'INSTRUCTOR'], label: 'Theo dõi Tiến độ Đào tạo', icon: 'Activity' },

  // LMS Demo Showcase
  { path: '/lms/admin/demo/dashboard', roles: [Role.ADMIN, 'TRAINER'], label: 'Demo: Dashboard', icon: 'LayoutDashboard' },
  { path: '/lms/admin/demo/courses', roles: [Role.ADMIN, 'TRAINER'], label: 'Demo: Khóa học', icon: 'BookOpen' },
  { path: '/lms/admin/demo/catalog', roles: [Role.ADMIN, 'TRAINER'], label: 'Demo: Khám phá', icon: 'FolderTree' },
  { path: '/lms/admin/demo/progress', roles: [Role.ADMIN, 'TRAINER'], label: 'Demo: Tiến độ', icon: 'Activity' },
]
