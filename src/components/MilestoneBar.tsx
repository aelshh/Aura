import { motion } from 'framer-motion'
import { useSessionStore } from '../store/sessionStore'
import { getCurrentLevel, getNextLevel, getLevelProgress } from '../lib/levels'
import { getStreakDays } from '../lib/aura'

export default function MilestoneBar() {
  const { session } = useSessionStore()
  if (!session) return null

  const streakDays = getStreakDays(new Date(session.start_timestamp), new Date())
  const currentLevel = getCurrentLevel(streakDays)
  const nextLevel = getNextLevel(streakDays)
  const progress = getLevelProgress(streakDays)

  if (!nextLevel) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs text-white/40">
          <span>Maximum level reached</span>
          <span className="text-yellow-400">👑 TRANSCENDENT</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />
        </div>
      </div>
    )
  }

  const daysRemaining = nextLevel.minDays - streakDays

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-white/40">
          Next: <span className="font-medium" style={{ color: nextLevel.color }}>{nextLevel.emoji} {nextLevel.name}</span>
        </span>
        <span className="text-xs text-white/40">
          {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color})`,
            boxShadow: `0 0 8px ${nextLevel.glowColor}`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs text-white/25 text-right">{progress}%</p>
    </div>
  )
}
