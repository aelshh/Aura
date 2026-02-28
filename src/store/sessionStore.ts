import { create } from 'zustand'
import type { DetoxSession, AuraPopupItem } from '../types'

let popupIdCounter = 0

interface SessionState {
  session: DetoxSession | null
  liveAura: number
  claimedMilestones: string[]
  earnedWhileAway: number
  showReentryModal: boolean
  auraPopups: AuraPopupItem[]
  isLoading: boolean

  // Actions
  setSession: (session: DetoxSession | null) => void
  initFromSession: (session: DetoxSession) => void
  addPassiveAura: (amount: number) => void
  claimMilestone: (key: string, amount: number, label: string) => void
  setEarnedWhileAway: (amount: number, newMilestones: string[]) => void
  dismissReentryModal: () => void
  removeAuraPopup: (id: number) => void
  setLoading: (loading: boolean) => void
  applyRelapse: () => void
  updateAvoidedItems: (items: string[]) => void
  getLiveAura: () => number
  getClaimedMilestones: () => string[]
}

export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  liveAura: 0,
  claimedMilestones: [],
  earnedWhileAway: 0,
  showReentryModal: false,
  auraPopups: [],
  isLoading: true,

  setSession: (session) => set({ session }),

  initFromSession: (session) => {
    set({
      session,
      liveAura: session.total_aura,
      claimedMilestones: session.claimed_milestones,
      isLoading: false,
    })
  },

  addPassiveAura: (amount) => {
    set((state) => ({ liveAura: state.liveAura + amount }))
  },

  claimMilestone: (key, amount, label) => {
    set((state) => {
      if (state.claimedMilestones.includes(key)) return state
      const newPopup: AuraPopupItem = {
        id: ++popupIdCounter,
        amount,
        label,
      }
      return {
        liveAura: state.liveAura + amount,
        claimedMilestones: [...state.claimedMilestones, key],
        auraPopups: [...state.auraPopups, newPopup],
      }
    })
  },

  setEarnedWhileAway: (amount, newMilestones) => {
    set((state) => ({
      liveAura: state.liveAura + amount,
      claimedMilestones: [...state.claimedMilestones, ...newMilestones],
      earnedWhileAway: amount,
      showReentryModal: amount > 0,
    }))
  },

  dismissReentryModal: () => set({ showReentryModal: false, earnedWhileAway: 0 }),

  removeAuraPopup: (id) => {
    set((state) => ({
      auraPopups: state.auraPopups.filter((p) => p.id !== id),
    }))
  },

  setLoading: (loading) => set({ isLoading: loading }),

  applyRelapse: () => {
    set((state) => {
      if (!state.session) return state
      const now = new Date().toISOString()
      return {
        session: {
          ...state.session,
          start_timestamp: now,
          relapse_timestamp: now,
          last_active: now,
          streak_days: 0,
          claimed_milestones: [],
          total_aura: 0,
        },
        liveAura: 0,
        claimedMilestones: [],
        auraPopups: [],
      }
    })
  },

  updateAvoidedItems: (items) => {
    set((state) => {
      if (!state.session) return state
      return { session: { ...state.session, avoided_items: items } }
    })
  },

  getLiveAura: () => get().liveAura,
  getClaimedMilestones: () => get().claimedMilestones,
}))
