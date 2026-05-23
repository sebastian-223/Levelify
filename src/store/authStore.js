import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import authService from '@/services/authService'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const { user, token } = await authService.login(email, password)
          set({ user, token, isAuthenticated: true, isLoading: false })
          return { success: true }
        } catch (err) {
          set({ error: err.message, isLoading: false })
          return { success: false, error: err.message }
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const { user, token } = await authService.register(data)
          set({ user, token, isAuthenticated: true, isLoading: false })
          return { success: true }
        } catch (err) {
          set({ error: err.message, isLoading: false })
          return { success: false, error: err.message }
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null })
      },

      updateProfile: (data) => set(s => ({ user: { ...s.user, ...data } })),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'levelify-auth',
      partialize: s => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }),
    }
  )
)
