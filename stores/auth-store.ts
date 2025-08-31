import { create } from 'zustand'
import type { UserProfile } from '@/lib/api-schema'

interface AuthState {
  user: UserProfile | null
  token: string | null
  isAuthenticated: boolean

  isMatchModalOpen: boolean
  matchedUser: UserProfile | null
  login: (user: UserProfile, token: string) => void
  logout: () => void

  openMatchModal: (user: UserProfile) => void
  closeMatchModal: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isMatchModalOpen: false,
  matchedUser: null,

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

  openMatchModal: (user) =>
    set({
      isMatchModalOpen: true,
      matchedUser: user,
    }),

  closeMatchModal: () =>
    set({
      isMatchModalOpen: false,
      matchedUser: null,
    }),
}))
