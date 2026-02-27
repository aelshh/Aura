import { useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useSessionStore } from '../store/sessionStore'
import { calculateReentryAura, getStreakDays } from '../lib/aura'
import { getCurrentLevel } from '../lib/levels'
import type { DetoxSession } from '../types'

export function useSession() {
  const { user } = useAuth()
  const { initFromSession, setEarnedWhileAway, setLoading, session } = useSessionStore()

  useEffect(() => {
    if (!user) return

    async function loadSession() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('detox_sessions')
          .select('*')
          .eq('user_id', user!.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading session:', error)
          setLoading(false)
          return
        }

        if (data) {
          const loadedSession = data as DetoxSession
          initFromSession(loadedSession)

          const now = new Date()
          const lastActive = new Date(loadedSession.last_active)
          const sessionStart = new Date(loadedSession.start_timestamp)

          const streakDaysAtReentry = getStreakDays(sessionStart, now)
          const levelAtReentry = getCurrentLevel(streakDaysAtReentry)
          const update = calculateReentryAura(
            sessionStart,
            lastActive,
            now,
            loadedSession.claimed_milestones,
            levelAtReentry.auraPerHour,
          )

          if (update.totalEarned > 0) {
            setEarnedWhileAway(update.totalEarned, update.newClaimed)
            const streakDays = streakDaysAtReentry
            await supabase
              .from('detox_sessions')
              .update({
                total_aura: loadedSession.total_aura + update.totalEarned,
                claimed_milestones: [
                  ...loadedSession.claimed_milestones,
                  ...update.newClaimed,
                ],
                last_active: now.toISOString(),
                streak_days: streakDays,
              })
              .eq('id', loadedSession.id)
          } else {
            await supabase
              .from('detox_sessions')
              .update({ last_active: now.toISOString() })
              .eq('id', loadedSession.id)
          }
        } else {
          setLoading(false)
        }
      } catch (err) {
        console.error('Session load error:', err)
        setLoading(false)
      }
    }

    loadSession()
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const createSession = useCallback(
    async (avoidedItems: string[]): Promise<DetoxSession | null> => {
      if (!user) return null
      try {
        const now = new Date().toISOString()
        const { data, error } = await supabase
          .from('detox_sessions')
          .insert({
            user_id: user.id,
            start_timestamp: now,
            avoided_items: avoidedItems,
            total_aura: 0,
            streak_days: 0,
            last_active: now,
            is_active: true,
            claimed_milestones: [],
          })
          .select()
          .single()

        if (error) {
          console.error('Error creating session:', error)
          return null
        }
        return data as DetoxSession
      } catch (err) {
        console.error('Create session error:', err)
        return null
      }
    },
    [user],
  )

  const syncSession = useCallback(
    async (updates: Partial<DetoxSession>) => {
      if (!session) return
      try {
        await supabase.from('detox_sessions').update(updates).eq('id', session.id)
      } catch (err) {
        console.error('Sync error:', err)
      }
    },
    [session],
  )

  const relapse = useCallback(async () => {
    if (!session) return
    try {
      const now = new Date().toISOString()
      await supabase
        .from('detox_sessions')
        .update({
          relapse_timestamp: now,
          start_timestamp: now,
          last_active: now,
          streak_days: 0,
          claimed_milestones: [],
        })
        .eq('id', session.id)
    } catch (err) {
      console.error('Relapse error:', err)
    }
  }, [session])

  const updateAvoidedItems = useCallback(
    async (items: string[]) => {
      if (!session) return
      try {
        await supabase
          .from('detox_sessions')
          .update({ avoided_items: items })
          .eq('id', session.id)
      } catch (err) {
        console.error('Update avoided items error:', err)
      }
    },
    [session],
  )

  return { createSession, syncSession, relapse, updateAvoidedItems }
}
