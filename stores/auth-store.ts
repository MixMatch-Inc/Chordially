import { create } from 'zustand'
import type { UserProfile } from '@/lib/api-schema'

interface AuthState {
  user: UserProfile | null
  token: string | null
  isAuthenticated: boolean
  login: (user: UserProfile, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),
}))
