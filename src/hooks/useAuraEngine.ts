import { useEffect, useRef, useCallback } from 'react'
import { useSessionStore } from '../store/sessionStore'
import { useSession } from './useSession'
import {
  HOURLY_BONUS,
  EXTENDED_MILESTONES,
  hourlyKey,
  getElapsedHours,
  getStreakDays,
  getAuraPerSecond,
} from '../lib/aura'
import { getCurrentLevel } from '../lib/levels'

const SYNC_INTERVAL_MS = 30_000
const TICK_INTERVAL_MS = 1_000

export function useAuraEngine() {
  const { session, addPassiveAura, claimMilestone, getLiveAura, getClaimedMilestones } =
    useSessionStore()
  const { syncSession } = useSession()
  const prevElapsedHoursRef = useRef(0)
  const syncTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const doSync = useCallback(() => {
    if (!session) return
    const liveAura = getLiveAura()
    const claimed = getClaimedMilestones()
    const now = new Date()
    const streakDays = getStreakDays(new Date(session.start_timestamp), now)
    syncSession({
      total_aura: liveAura,
      claimed_milestones: claimed,
      last_active: now.toISOString(),
      streak_days: streakDays,
    })
  }, [session, getLiveAura, getClaimedMilestones, syncSession])

  useEffect(() => {
    if (!session) return

    const sessionStart = new Date(session.start_timestamp)
    prevElapsedHoursRef.current = getElapsedHours(sessionStart, new Date())

    tickTimerRef.current = setInterval(() => {
      const now = new Date()
      const elapsedHours = getElapsedHours(sessionStart, now)
      const prevElapsedHours = prevElapsedHoursRef.current

      // Passive aura: rate is based on current streak level
      const streakDays = getStreakDays(sessionStart, now)
      const currentLevel = getCurrentLevel(streakDays)
      addPassiveAura(getAuraPerSecond(currentLevel))

      // Hourly milestones
      const prevCompleted = Math.floor(prevElapsedHours)
      const nowCompleted = Math.floor(elapsedHours)
      if (nowCompleted > prevCompleted) {
        for (let h = prevCompleted + 1; h <= nowCompleted; h++) {
          claimMilestone(hourlyKey(h), HOURLY_BONUS, `${h}h Streak Bonus!`)
        }
      }

      // Extended milestones
      for (const ext of EXTENDED_MILESTONES) {
        if (elapsedHours >= ext.hours && prevElapsedHours < ext.hours) {
          claimMilestone(ext.key, ext.bonus, `${ext.label} +${ext.bonus.toLocaleString()}`)
        }
      }

      prevElapsedHoursRef.current = elapsedHours
    }, TICK_INTERVAL_MS)

    // Sync to Supabase every 30s
    syncTimerRef.current = setInterval(doSync, SYNC_INTERVAL_MS)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        doSync()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (tickTimerRef.current) clearInterval(tickTimerRef.current)
      if (syncTimerRef.current) clearInterval(syncTimerRef.current)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [session?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
