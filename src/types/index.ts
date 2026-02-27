export interface DetoxSession {
  id: string
  user_id: string
  start_timestamp: string
  avoided_items: string[]
  total_aura: number
  streak_days: number
  last_active: string
  relapse_timestamp: string | null
  is_active: boolean
  claimed_milestones: string[]
  created_at: string
}

export interface Level {
  id: number
  name: string
  emoji: string
  assetKey: string
  minDays: number
  auraPerHour: number
  identity: string
  brain: string
  performance: string
  auraStyle: string
  auraDescription: string
  color: string
  glowColor: string
}

export interface AuraPopupItem {
  id: number
  amount: number
  label: string
}

export interface ExtendedMilestone {
  key: string
  hours: number
  bonus: number
  label: string
}
