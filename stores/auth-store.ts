import { create } from 'zustand'
import type {
  CompatibilityDetails,
  Message,
  UserProfile,
} from '@/lib/api-schema'
import { details } from 'framer-motion/client'

interface AuthState {
  user: UserProfile | null
  token: string | null
  isAuthenticated: boolean
  selectedMatchId: string | null
  messageQueue: Message[]
  compatibilityDetails: CompatibilityDetails | null
  isMatchModalOpen: boolean
  matchedUser: UserProfile | null
  isFandomModalOpen: boolean
  login: (user: UserProfile, token: string) => void
  logout: () => void

  openMatchModal: (user: UserProfile) => void
  closeMatchModal: () => void

  selectMatch: (matchId: string | null) => void
  addMessageToQueue: (message: Message) => void
  removeMessageFromQueue: (tempId: string) => void
  updateMessageStatusInQueue: (
    tempId: string,
    status: 'sending' | 'failed'
  ) => void
  openFandomModal: (user: UserProfile, details: CompatibilityDetails) => void
  closeFandomModal: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isMatchModalOpen: false,
  matchedUser: null,
  selectedMatchId: null,
  messageQueue: [],
  compatibilityDetails: null,
  isFandomModalOpen: false,

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
      compatibilityDetails: details,
    }),
  closeMatchModal: () =>
    set({
      isMatchModalOpen: false,
      matchedUser: null,
      compatibilityDetails: null,
    }),

  selectMatch: (matchId) => set({ selectedMatchId: matchId }),

  addMessageToQueue: (message) =>
    set((state) => ({
      messageQueue: [...state.messageQueue, { ...message, status: 'failed' }],
    })),

  removeMessageFromQueue: (tempId) =>
    set((state) => ({
      messageQueue: state.messageQueue.filter((m) => m.tempId !== tempId),
    })),

  updateMessageStatusInQueue: (tempId, status) =>
    set((state) => ({
      messageQueue: state.messageQueue.map((m) =>
        m.tempId === tempId ? { ...m, status } : m
      ),
    })),

  openFandomModal: (user, details) =>
    set({
      isFandomModalOpen: true,

      matchedUser: user,
      compatibilityDetails: details,
    }),

  closeFandomModal: () =>
    set({
      isFandomModalOpen: false,

      matchedUser: null,
      compatibilityDetails: null,
    }),
}))
