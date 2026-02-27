import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSessionStore } from '../store/sessionStore'
import { getCurrentLevel, getNextLevel, getLevelAsset } from '../lib/levels'
import { getStreakDays, getAuraPerSecond, getAuraPerMinute } from '../lib/aura'
import type { Level } from '../types'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MAX_PARTICLES = 10          // hard cap — never exceed this many at once
const TRICKLE_INTERVAL_MS = 3500  // how often passive particles spawn
const TRICKLE_COUNT = 1           // particles per trickle tick

function getTier(levelId: number): string {
  if (levelId <= 2) return 'low'
  if (levelId <= 5) return 'mid'
  if (levelId <= 8) return 'high'
  return 'glitch'
}

// ---------------------------------------------------------------------------
// Gen Z flavor lines
// ---------------------------------------------------------------------------
const GEN_Z_LINES = [
  'farming szn 🌾',
  'aura diff rn 😤',
  'stay rare fam',
  'not me becoming main character',
  'lowkey glowing up fr',
  'the discipline arc hits diff',
  'sigma grindset activated 🐺',
  'no cap the aura is real',
  'built diff, no cap',
  'the glow up is undefeated 💜',
]

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------
function formatAura(aura: number): string {
  if (aura >= 1_000_000) return (aura / 1_000_000).toFixed(2) + 'M'
  if (aura >= 100_000) return Math.floor(aura / 1000).toFixed(1) + 'K'
  if (aura >= 10_000) return (aura / 1000).toFixed(2) + 'K'
  return Math.floor(aura).toLocaleString()
}

function formatRate(value: number, decimals: number): string {
  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()
}

// Slight size variation per tier so higher levels feel more powerful
const TIER_SIZE: Record<string, number> = { low: 18, mid: 22, high: 26, glitch: 30 }

// ---------------------------------------------------------------------------
// Particle type
// ---------------------------------------------------------------------------
interface Particle {
  id: number
  startX: number
  startY: number
  auraAmount: number
  size: number
  duration: number
  delay: number
}

let particleIdCounter = 0

function spawnParticles(count: number, level: Level, batchSeconds: number): Particle[] {
  const particles: Particle[] = []
  const auraPerParticle = Math.max(1, Math.round((level.auraPerHour / 3600) * batchSeconds))
  const tier = getTier(level.id)
  const baseSize = TIER_SIZE[tier]

  for (let i = 0; i < count; i++) {
    const side = Math.floor(Math.random() * 4)
    let x = 0, y = 0
    const W = window.innerWidth
    const H = window.innerHeight
    if (side === 0)      { x = Math.random() * W; y = -24 }
    else if (side === 1) { x = W + 24;             y = Math.random() * H }
    else if (side === 2) { x = Math.random() * W; y = H + 24 }
    else                 { x = -24;                y = Math.random() * H }

    particles.push({
      id: ++particleIdCounter,
      startX: x,
      startY: y,
      auraAmount: auraPerParticle,
      size: baseSize + Math.random() * 10,
      duration: 1.6 + Math.random() * 0.8,
      delay: i * 0.12,
    })
  }
  return particles
}

// ---------------------------------------------------------------------------
// Pure glowing light orb particle — no emoji, just light
// ---------------------------------------------------------------------------
interface ParticleProps {
  particle: Particle
  targetX: number
  targetY: number
  color: string
  glowColor: string
  onDone: (id: number) => void
}

function AuraParticle({ particle, targetX, targetY, color, glowColor, onDone }: ParticleProps) {
  const destX = targetX - particle.size / 2
  const destY = targetY - particle.size / 2
  const s = particle.size

  return (
    <>
      {/* Pure light orb — white-hot center, bleeds into level color */}
      <motion.div
        className="fixed pointer-events-none z-100"
        style={{
          left: particle.startX - s / 2,
          top: particle.startY - s / 2,
          width: s,
          height: s,
          borderRadius: '50%',
          background: `radial-gradient(circle at 40% 38%,
            rgba(255,255,255,1) 0%,
            rgba(255,255,255,0.85) 12%,
            ${color}dd 32%,
            ${color}66 58%,
            ${color}11 80%,
            transparent 100%
          )`,
          boxShadow: `
            0 0 ${s * 0.5}px rgba(255,255,255,0.9),
            0 0 ${s * 1.2}px ${color}cc,
            0 0 ${s * 2.2}px ${color}77,
            0 0 ${s * 3.5}px ${glowColor}44
          `,
          willChange: 'transform, opacity',
        }}
        animate={{
          left: destX,
          top: destY,
          opacity: [0, 1, 0.9, 0],
          scale: [0.15, 1.1, 0.95, 0.1],
        }}
        transition={{
          duration: particle.duration,
          delay: particle.delay,
          ease: [0.15, 0, 0.75, 1],
        }}
        onAnimationComplete={() => onDone(particle.id)}
      />

      {/* "+X aura" glass pill label */}
      <motion.div
        className="fixed pointer-events-none z-100 select-none"
        style={{
          left: particle.startX - s / 2 + s + 4,
          top: particle.startY - s / 2 - 2,
          padding: '2px 7px',
          borderRadius: 99,
          background: `${color}18`,
          border: `1px solid ${color}50`,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          fontSize: 10,
          fontWeight: 700,
          color,
          textShadow: `0 0 10px ${color}`,
          whiteSpace: 'nowrap',
          willChange: 'transform, opacity',
        }}
        animate={{
          left: destX + s + 4,
          top: destY - 2,
          opacity: [0, 1, 0.9, 0],
          scale: [0.5, 1, 0.95, 0.3],
        }}
        transition={{
          duration: particle.duration,
          delay: particle.delay,
          ease: [0.15, 0, 0.75, 1],
        }}
      >
        +{particle.auraAmount}
      </motion.div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Meme face in orb
// ---------------------------------------------------------------------------
function MemeFace({
  assetKey,
  emoji,
  size,
  isGlitch = false,
}: {
  assetKey: string
  emoji: string
  size: number
  isGlitch?: boolean
}) {
  const [imgFailed, setImgFailed] = useState(false)

  if (imgFailed) {
    return (
      <span style={{ fontSize: size * 0.5 }} className="select-none leading-none">
        {emoji}
      </span>
    )
  }

  return (
    <motion.img
      src={getLevelAsset(assetKey)}
      alt=""
      onError={() => setImgFailed(true)}
      className="rounded-full object-cover select-none"
      style={{ width: size - 8, height: size - 8 }}
      animate={
        isGlitch
          ? {
              filter: [
                'hue-rotate(0deg) saturate(1)',
                'hue-rotate(90deg) saturate(2)',
                'hue-rotate(180deg) saturate(1.5)',
                'hue-rotate(270deg) saturate(2)',
                'hue-rotate(360deg) saturate(1)',
              ],
            }
          : {}
      }
      transition={isGlitch ? { duration: 4, repeat: Infinity, ease: 'linear' } : {}}
    />
  )
}

// ---------------------------------------------------------------------------
// Main orb component
// ---------------------------------------------------------------------------
export default function AuraFarmOrb() {
  const { session, liveAura, auraPopups, removeAuraPopup } = useSessionStore()
  const orbRef = useRef<HTMLDivElement>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const [orbCenter, setOrbCenter] = useState({ x: 0, y: 0 })
  const [flavorIdx, setFlavorIdx] = useState(0)
  const [mergeFlash, setMergeFlash] = useState(false)
  const prevPopupCountRef = useRef(auraPopups.length)
  const trickleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // Tracks IDs to remove in the next cleanup pass instead of one setState per particle
  const doneIdsRef = useRef<Set<number>>(new Set())
  const cleanupTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const streakDays = session
    ? getStreakDays(new Date(session.start_timestamp), new Date())
    : 0
  const currentLevel = getCurrentLevel(streakDays)
  const nextLevel = getNextLevel(streakDays)
  const isGlitch = currentLevel.id === 9

  const perSecond = getAuraPerSecond(currentLevel)
  const perMinute = getAuraPerMinute(currentLevel)
  const perHour = currentLevel.auraPerHour

  const updateOrbCenter = useCallback(() => {
    if (orbRef.current) {
      const rect = orbRef.current.getBoundingClientRect()
      setOrbCenter({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    }
  }, [])

  // Batch-remove done particles every 500ms instead of one setState per particle
  useEffect(() => {
    cleanupTimerRef.current = setInterval(() => {
      if (doneIdsRef.current.size > 0) {
        const ids = new Set(doneIdsRef.current)
        doneIdsRef.current.clear()
        setParticles((prev) => prev.filter((p) => !ids.has(p.id)))
      }
    }, 500)
    return () => { if (cleanupTimerRef.current) clearInterval(cleanupTimerRef.current) }
  }, [])

  // Collect done particle IDs without triggering state update each time
  const removeParticle = useCallback((id: number) => {
    doneIdsRef.current.add(id)
  }, [])

  // Helper — add particles respecting hard cap
  const addParticles = useCallback((newOnes: Particle[]) => {
    setParticles((prev) => {
      const available = MAX_PARTICLES - prev.length
      if (available <= 0) return prev
      return [...prev, ...newOnes.slice(0, available)]
    })
  }, [])

  useEffect(() => {
    updateOrbCenter()
    window.addEventListener('resize', updateOrbCenter)
    window.addEventListener('scroll', updateOrbCenter)
    return () => {
      window.removeEventListener('resize', updateOrbCenter)
      window.removeEventListener('scroll', updateOrbCenter)
    }
  }, [updateOrbCenter])

  // Passive trickle — pause when tab hidden so we don't burst on re-focus
  useEffect(() => {
    const start = () => {
      trickleTimerRef.current = setInterval(() => {
        if (document.visibilityState === 'hidden') return
        updateOrbCenter()
        addParticles(spawnParticles(TRICKLE_COUNT, currentLevel, TRICKLE_INTERVAL_MS / 1000))
      }, TRICKLE_INTERVAL_MS)
    }

    start()
    return () => { if (trickleTimerRef.current) clearInterval(trickleTimerRef.current) }
  }, [updateOrbCenter, addParticles, currentLevel.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Milestone burst — collapse ALL pending popups into a SINGLE burst of max 5 particles
  useEffect(() => {
    if (auraPopups.length > prevPopupCountRef.current) {
      updateOrbCenter()
      // Cap burst at 5 regardless of how many popups stacked up
      addParticles(spawnParticles(Math.min(5, auraPopups.length), currentLevel, 60))
      setFlavorIdx((i) => (i + 1) % GEN_Z_LINES.length)
      setMergeFlash(true)
      setTimeout(() => setMergeFlash(false), 500)
      // Consume all pending popups at once
      auraPopups.forEach((p) => removeAuraPopup(p.id))
    }
    prevPopupCountRef.current = auraPopups.length
  }, [auraPopups, removeAuraPopup, updateOrbCenter, addParticles, currentLevel])

  const progressPct = nextLevel
    ? Math.min(
        100,
        Math.round(
          ((streakDays - currentLevel.minDays) /
            (nextLevel.minDays - currentLevel.minDays)) *
            100,
        ),
      )
    : 100

  return (
    <>
      {/* Particles in a fixed layer */}
      {particles.map((p) => (
        <AuraParticle
          key={p.id}
          particle={p}
          targetX={orbCenter.x}
          targetY={orbCenter.y}
          color={currentLevel.color}
          glowColor={currentLevel.glowColor}
          onDone={removeParticle}
        />
      ))}

      {/* Orb card */}
      <motion.div
        className="flex flex-col items-center gap-5 w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Level info above orb */}
        <div className="text-center">
          <p className="text-xs text-white/40 font-medium uppercase tracking-widest mb-0.5">
            Level {currentLevel.id} · Day {streakDays}
          </p>
          <h2 className="font-display font-extrabold text-3xl" style={{ color: currentLevel.color }}>
            {currentLevel.name}
          </h2>
          <p className="text-white/60 text-sm mt-1 font-medium italic">
            "{currentLevel.identity}"
          </p>
        </div>

        {/* The orb */}
        <div className="relative flex items-center justify-center" ref={orbRef}>
          {/* Outer glow rings */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 172, height: 172,
              background: `radial-gradient(circle, ${currentLevel.glowColor}18 0%, transparent 70%)`,
              border: `1px solid ${currentLevel.color}15`,
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 216, height: 216,
              background: `radial-gradient(circle, ${currentLevel.glowColor}08 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />

          {/* Main orb circle */}
          <motion.div
            className={`relative flex items-center justify-center rounded-full overflow-hidden ${currentLevel.auraStyle}`}
            style={{
              width: 136, height: 136,
              background: `radial-gradient(circle, ${currentLevel.glowColor}35 0%, ${currentLevel.glowColor}10 60%, transparent 100%)`,
              border: `2px solid ${currentLevel.color}50`,
              boxShadow: mergeFlash
                ? `0 0 60px ${currentLevel.glowColor}, 0 0 120px ${currentLevel.glowColor}60`
                : `0 0 30px ${currentLevel.glowColor}40`,
            }}
            animate={mergeFlash ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <MemeFace
              assetKey={currentLevel.assetKey}
              emoji={currentLevel.emoji}
              size={136}
              isGlitch={isGlitch}
            />
          </motion.div>

          {/* Glitch scanlines */}
          {isGlitch && (
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 136, height: 136,
                background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(236,72,153,0.08) 2px, rgba(236,72,153,0.08) 4px)`,
                mixBlendMode: 'overlay',
              }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
          )}
        </div>

        {/* Aura number */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-baseline gap-1.5">
            <motion.span
              key={Math.floor(liveAura / 10)}
              className="font-display font-extrabold text-5xl leading-none aura-shimmer"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {formatAura(liveAura)}
            </motion.span>
            <span className="text-white/40 text-sm font-medium">aura</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={flavorIdx}
              className="text-xs text-white/35 font-medium"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              {GEN_Z_LINES[flavorIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress to next level */}
        {nextLevel && (
          <div className="w-full max-w-xs">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] text-white/30 uppercase tracking-widest">
                Next: {nextLevel.name} {nextLevel.emoji}
              </span>
              <span className="text-[10px] font-medium" style={{ color: currentLevel.color }}>
                {progressPct}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${currentLevel.color}80, ${currentLevel.color})`,
                  boxShadow: `0 0 8px ${currentLevel.glowColor}`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            <p className="text-[10px] text-white/20 mt-1 text-right">
              {nextLevel.minDays - streakDays}d to go
            </p>
          </div>
        )}

        {/* Live aura rate strip */}
        <div
          className="flex items-center gap-0 rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${currentLevel.color}20` }}
        >
          {[
            { label: '/sec', value: formatRate(perSecond, 2) },
            { label: '/min', value: formatRate(perMinute, 1) },
            { label: '/hr',  value: formatRate(perHour, 0) },
          ].map(({ label, value }, i) => (
            <div
              key={label}
              className="flex flex-col items-center px-4 py-2.5"
              style={{ borderRight: i < 2 ? `1px solid ${currentLevel.color}15` : 'none' }}
            >
              <motion.span
                key={`${currentLevel.id}-${label}`}
                className="font-display font-bold text-sm leading-none"
                style={{ color: currentLevel.color }}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                +{value}
              </motion.span>
              <span className="text-[10px] text-white/25 mt-0.5 font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* Aura description badge */}
        <div
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{
            background: `${currentLevel.glowColor}20`,
            border: `1px solid ${currentLevel.color}30`,
            color: currentLevel.color,
          }}
        >
          ✦ {currentLevel.auraDescription}
        </div>
      </motion.div>
    </>
  )
}
