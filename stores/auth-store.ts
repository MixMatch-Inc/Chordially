import { create } from 'zustand'
import type { Message, UserProfile } from '@/lib/api-schema'

interface AuthState {
  user: UserProfile | null
  token: string | null
  isAuthenticated: boolean
  selectedMatchId: string | null
  messageQueue: Message[]

  isMatchModalOpen: boolean
  matchedUser: UserProfile | null
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
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isMatchModalOpen: false,
  matchedUser: null,
  selectedMatchId: null,
  messageQueue: [],

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
}))
