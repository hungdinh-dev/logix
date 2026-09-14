import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile } from '@/features/auth/services/auth.service'

interface AuthStore {
  user: UserProfile | null
  permissions: string[]
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: UserProfile, permissions: string[], accessToken: string, refreshToken?: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  hasPermission: (permissionCode: string) => boolean
  // Compatibility aliases for HRM module
  setAuth?: (user: any, accessToken: string, refreshToken?: string) => void
  logout?: () => void
}

const setTokenCookie = (token: string) => {
  document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`
}

const clearTokenCookie = () => {
  document.cookie = 'access_token=; path=/; max-age=0'
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      permissions: [],
      isAuthenticated: false,
      isLoading: true,

      setUser: (user, permissions, accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken)
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken)
        setTokenCookie(accessToken)
        set({ user, permissions, isAuthenticated: true, isLoading: false })
      },

      clearAuth: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        clearTokenCookie()
        set({ user: null, permissions: [], isAuthenticated: false, isLoading: false })
      },

      setLoading: (loading) => set({ isLoading: loading }),

      hasPermission: (permissionCode: string) => {
        const { permissions } = get()
        return permissions.includes(permissionCode)
      },
      setAuth: (user: any, accessToken: string, refreshToken?: string) => {
        get().setUser(user, user?.permissions || [], accessToken, refreshToken)
      },
      logout: () => {
        get().clearAuth()
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setLoading(false)
      },
    }
  )
)
