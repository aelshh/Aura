import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Level } from '../types'
import { getLevelAsset } from '../lib/levels'

interface LevelCardProps {
  level: Level
  streakDays: number
  compact?: boolean
}

function MemeFace({
  assetKey,
  emoji,
  size,
  className = '',
}: {
  assetKey: string
  emoji: string
  size: number
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span
        className={`flex items-center justify-center select-none ${className}`}
        style={{ fontSize: size * 0.5, width: size, height: size }}
      >
        {emoji}
      </span>
    )
  }
  return (
    <img
      src={getLevelAsset(assetKey)}
      alt=""
      onError={() => setFailed(true)}
      className={`object-cover select-none ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

export default function LevelCard({ level, streakDays, compact = false }: LevelCardProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div
          className={`relative flex items-center justify-center rounded-full overflow-hidden ${level.auraStyle}`}
          style={{
            width: 56,
            height: 56,
            background: `radial-gradient(circle, ${level.glowColor}22 0%, transparent 70%)`,
            border: `2px solid ${level.color}40`,
          }}
        >
          <MemeFace
            assetKey={level.assetKey}
            emoji={level.emoji}
            size={52}
            className="rounded-full"
          />
        </div>
        <div>
          <p className="text-xs text-white/40 font-medium uppercase tracking-widest">Level {level.id}</p>
          <p className="font-display font-bold text-lg leading-tight" style={{ color: level.color }}>
            {level.name}
          </p>
          <p className="text-xs text-white/50 mt-0.5 italic">"{level.identity}"</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Meme face orb */}
      <div
        className={`relative flex items-center justify-center rounded-full overflow-hidden ${level.auraStyle}`}
        style={{
          width: 120,
          height: 120,
          background: `radial-gradient(circle, ${level.glowColor}30 0%, transparent 70%)`,
          border: `2px solid ${level.color}50`,
        }}
      >
        <MemeFace
          assetKey={level.assetKey}
          emoji={level.emoji}
          size={116}
          className="rounded-full"
        />
      </div>

      {/* Level info */}
      <div className="text-center">
        <p className="text-xs text-white/40 font-medium uppercase tracking-widest mb-1">
          Level {level.id} · Day {streakDays}
        </p>
        <h2 className="font-display font-extrabold text-3xl" style={{ color: level.color }}>
          {level.name}
        </h2>
        <p className="text-white/70 text-sm mt-2 font-medium italic">"{level.identity}"</p>
      </div>

      {/* Aura description */}
      <div
        className="px-3 py-1 rounded-full text-xs font-medium"
        style={{
          background: `${level.glowColor}20`,
          border: `1px solid ${level.color}30`,
          color: level.color,
        }}
      >
        ✦ {level.auraDescription}
      </div>
    </motion.div>
  )
}
