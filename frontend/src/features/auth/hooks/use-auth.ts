'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth.store'
import { authService, type LoginRequest, normalizeUserProfile } from '@/features/auth/services/auth.service'
import { getErrorMessage } from '@/lib/api'

export const useAuth = () => {
  const { user, permissions, isAuthenticated, isLoading, setUser, clearAuth, setLoading, hasPermission } =
    useAuthStore()
  const router = useRouter()

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        setLoading(true)
        const response = await authService.login(credentials)
        const { accessToken, refreshToken, user: userProfile, permissions: userPerms } = response

        if (!accessToken) {
          throw new Error('Không nhận được Access Token từ máy chủ.')
        }

        const normalizedUser = normalizeUserProfile(userProfile)
        setUser(normalizedUser, userPerms || [], accessToken, refreshToken)
        toast.success(`Chào mừng, ${normalizedUser.fullName}!`)
        return response
      } catch (error) {
        const message = getErrorMessage(error)
        toast.error(message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setUser, setLoading]
  )

  const logout = useCallback(async () => {
    try {
      setLoading(true)
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
      toast.info('Đã đăng xuất')
      router.push('/login')
      setLoading(false)
    }
  }, [clearAuth, router, setLoading])

  const userRole = user?.role || (user?.roles && user.roles.length > 0 ? user.roles[0] : 'STUDENT')

  const hasRole = (role: string): boolean => userRole === role

  const hasAnyRole = (roles: string[]): boolean =>
    roles.length === 0 || roles.includes(userRole)

  return {
    user: user ? normalizeUserProfile(user) : null,
    role: userRole,
    permissions,
    isAuthenticated,
    isLoading,
    hasPermission,
    hasRole,
    hasAnyRole,
    login,
    logout,
  }
}
