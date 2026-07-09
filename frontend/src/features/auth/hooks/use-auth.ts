'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth.store'
import { authService, type LoginRequest } from '@/features/auth/services/auth.service'
import { decodeUserFromToken } from '@/features/auth/auth.utils'
import { getErrorMessage } from '@/lib/api'
import { Role } from '@/features/auth/types/auth.types'

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, setUser, clearAuth, setLoading } = useAuthStore()
  const router = useRouter()

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        setLoading(true)
        // 1. Gọi API login
        const response = await authService.login(credentials)
        const { accessToken, refreshToken } = response

        if (!accessToken) {
          throw new Error('Không nhận được Access Token từ server.')
        }

        // 2. Giải mã JWT để lấy user info
        const decodedUser = decodeUserFromToken(accessToken)
        if (!decodedUser) {
          throw new Error('Token không hợp lệ, không thể giải mã thông tin người dùng.')
        }

        // 3. Lưu vào Zustand store + localStorage + cookie
        setUser(
          {
            id: decodedUser.id,
            name: decodedUser.name,
            email: decodedUser.email,
            role: decodedUser.role as Role,
            avatar: decodedUser.avatar,
          },
          accessToken,
          refreshToken
        )

        toast.success(`Chào mừng, ${decodedUser.name}!`)
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
      const token = localStorage.getItem('access_token')
      await authService.logout(token || undefined)
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      clearAuth()
      toast.info('Đã đăng xuất')
      router.push('/login')
      setLoading(false)
    }
  }, [clearAuth, router, setLoading])

  const hasRole = (role: Role): boolean => user?.role === role

  const hasAnyRole = (roles: Role[]): boolean =>
    roles.length === 0 || (!!user && roles.includes(user.role))

  return {
    user,
    role: user?.role ?? null,
    isAuthenticated,
    isLoading,
    hasRole,
    hasAnyRole,
    login,
    logout,
  }
}
