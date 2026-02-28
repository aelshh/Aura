import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useSessionStore } from '../store/sessionStore'
import { LEVELS, getCurrentLevel, getLevelAsset } from '../lib/levels'
import { getStreakDays } from '../lib/aura'

function MemeImage({
  assetKey,
  emoji,
  size,
  className = '',
  isGlitch = false,
}: {
  assetKey: string
  emoji: string
  size: number
  className?: string
  isGlitch?: boolean
}) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span
        className={`flex items-center justify-center select-none ${className}`}
        style={{ fontSize: size * 0.55, width: size, height: size }}
      >
        {emoji}
      </span>
    )
  }
  return (
    <motion.img
      src={getLevelAsset(assetKey)}
      alt=""
      onError={() => setFailed(true)}
      className={`object-cover select-none ${className}`}
      style={{ width: size, height: size }}
      animate={
        isGlitch
          ? {
              filter: [
                'hue-rotate(0deg) saturate(1)',
                'hue-rotate(120deg) saturate(2)',
                'hue-rotate(240deg) saturate(1.5)',
                'hue-rotate(360deg) saturate(1)',
              ],
            }
          : {}
      }
      transition={isGlitch ? { duration: 4, repeat: Infinity, ease: 'linear' } : {}}
    />
  )
}

export default function JourneyPage() {
  const navigate = useNavigate()
  const { session } = useSessionStore()

  const streakDays = session
    ? getStreakDays(new Date(session.start_timestamp), new Date())
    : 0
  const currentLevel = getCurrentLevel(streakDays)

  return (
    <div className="min-h-screen cosmic-bg flex flex-col">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-center gap-3 px-5 pt-12 pb-4">
        <button
          onClick={() => navigate('/')}
          className="absolute left-5 p-2 rounded-xl glass-card text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="font-display font-bold text-2xl text-white">Level Journey</h1>
          <p className="text-sm text-white/50">your character arc 🧬</p>
        </div>
      </div>

      {/* Cards list */}
      <div className="relative z-10 flex-1 px-4 pb-10 overflow-y-auto">
        {/* Connector line */}
        <div
          className="absolute left-[2.4rem] top-0 bottom-0 w-px pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, transparent, rgba(124,58,237,0.25) 5%, rgba(124,58,237,0.25) 95%, transparent)',
          }}
        />

        <div className="flex flex-col gap-4 mt-2">
          {LEVELS.map((level, index) => {
            const isUnlocked = streakDays >= level.minDays
            const isCurrent = level.id === currentLevel.id
            const isPast = level.id < currentLevel.id
            const isLocked = !isUnlocked
            const isGlitch = level.id === 9
            const daysAway = level.minDays - streakDays

            return (
              <motion.div
                key={level.id}
                initial={{ x: -15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.35 }}
                className="flex gap-3 items-start"
              >
                {/* Timeline node */}
                <div className="shrink-0 relative z-10 mt-5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden transition-all ${
                      isCurrent ? 'ring-2 ring-offset-2 ring-offset-cosmos' : ''
                    }`}
                    style={{
                      background: `radial-gradient(circle, ${level.glowColor}40, ${level.glowColor}10)`,
                      border: `1.5px solid ${level.color}50`,
                    }}
                  >
                    {isPast ? (
                      <CheckCircle2 size={16} style={{ color: level.color }} />
                    ) : (
                      <MemeImage
                        assetKey={level.assetKey}
                        emoji={level.emoji}
                        size={36}
                        className="rounded-full"
                      />
                    )}
                  </div>
                </div>

                {/* Main card */}
                <div
                  className={`flex-1 rounded-2xl overflow-hidden transition-all ${
                    isCurrent ? 'glass-card' : ''
                  }`}
                  style={{
                    background: isCurrent
                      ? 'rgba(255,255,255,0.06)'
                      : 'rgba(255,255,255,0.025)',
                    border: isCurrent
                      ? `1.5px solid ${level.color}40`
                      : `1px solid rgba(255,255,255,0.08)`,
                    boxShadow: isCurrent
                      ? `0 0 28px ${level.glowColor}22, inset 0 0 20px ${level.glowColor}08`
                      : 'none',
                  }}
                >
                  {/* Image banner */}
                  <div
                    className="relative flex items-center justify-center overflow-hidden"
                    style={{
                      height: isCurrent ? 170 : 130,
                      background: `radial-gradient(ellipse at center, ${level.glowColor}${
                        isCurrent ? '20' : '0e'
                      } 0%, transparent 70%)`,
                    }}
                  >
                    <MemeImage
                      assetKey={level.assetKey}
                      emoji={level.emoji}
                      size={isCurrent ? 140 : 106}
                      className="rounded-2xl"
                      isGlitch={isGlitch && isCurrent}
                    />

                    {/* Glitch scanlines for level 9 */}
                    {isGlitch && (
                      <AnimatePresence>
                        <motion.div
                          className="absolute inset-0 pointer-events-none rounded-2xl"
                          style={{
                            background: `repeating-linear-gradient(
                              0deg,
                              transparent,
                              transparent 3px,
                              rgba(236,72,153,0.05) 3px,
                              rgba(236,72,153,0.05) 6px
                            )`,
                          }}
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.4, repeat: Infinity }}
                        />
                      </AnimatePresence>
                    )}

                    {/* Status badges */}
                    <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                      {isCurrent && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-bold backdrop-blur-sm"
                          style={{
                            background: `${level.glowColor}35`,
                            border: `1px solid ${level.color}60`,
                            color: level.color,
                          }}
                        >
                          ● YOU ARE HERE
                        </span>
                      )}
                      {isPast && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold backdrop-blur-sm"
                          style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.14)',
                            color: 'rgba(255,255,255,0.5)',
                          }}
                        >
                          cleared ✓
                        </span>
                      )}
                      {isLocked && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold backdrop-blur-sm"
                          style={{
                            background: 'rgba(0,0,0,0.35)',
                            border: `1px solid ${level.color}25`,
                            color: level.color + 'aa',
                          }}
                        >
                          🔒 {daysAway}d away
                        </span>
                      )}
                    </div>

                    {/* Level number badge */}
                    <div className="absolute top-2 left-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-mono font-bold backdrop-blur-sm"
                        style={{
                          background: 'rgba(0,0,0,0.4)',
                          border: `1px solid ${level.color}30`,
                          color: level.color,
                        }}
                      >
                        LVL {level.id}
                      </span>
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="px-4 py-3 text-center">
                    {/* Name + day requirement */}
                    <div className="flex flex-col items-center gap-0.5 mb-2">
                      <h3
                        className="font-display font-bold text-lg leading-tight"
                        style={{ color: level.color }}
                      >
                        {level.name}
                      </h3>
                      <span
                        className="text-sm font-mono"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                      >
                        Day {level.minDays}+
                      </span>
                    </div>

                    {/* Identity line — always visible */}
                    <p className="text-sm italic mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      "{level.identity}"
                    </p>

                    {/* Brain + performance — always visible */}
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm leading-relaxed max-w-md" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>🧠 </span>
                        {level.brain}
                      </p>
                      <p className="text-sm leading-relaxed max-w-md" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>⚡ </span>
                        {level.performance}
                      </p>
                      <div
                        className="mt-1 text-sm px-3 py-1 rounded-full w-fit"
                        style={{
                          background: `${level.glowColor}15`,
                          color: level.color + 'cc',
                          border: `1px solid ${level.color}20`,
                        }}
                      >
                        ✦ {level.auraDescription}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
