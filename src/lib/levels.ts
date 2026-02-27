import type { Level } from '../types'

export const LEVELS: Level[] = [
  {
    id: 0,
    name: 'Clown',
    emoji: '🤡',
    assetKey: 'clown.png',
    minDays: 0,
    auraPerHour: 1_000,
    identity: 'background character',
    brain: 'Running on pure autopilot. Dopamine hijacked, attention span decimated.',
    performance: 'Scrolling on loop, zero intentionality, reacting to everything.',
    auraStyle: 'aura-grey',
    auraDescription: 'Grey glitch aura',
    color: '#6B7280',
    glowColor: 'rgba(107, 114, 128, 0.6)',
  },
  {
    id: 1,
    name: 'Awakened',
    emoji: '🌱',
    assetKey: 'awakened.png',
    minDays: 1,
    auraPerHour: 1_200,
    identity: 'realizing the pattern',
    brain: 'The matrix glitch is visible. Metacognition just turned on.',
    performance: 'First conscious pause before impulse. Awareness online.',
    auraStyle: 'aura-green',
    auraDescription: 'Soft green pulse',
    color: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
  },
  {
    id: 2,
    name: 'Normie',
    emoji: '😐',
    assetKey: 'normie.png',
    minDays: 2,
    auraPerHour: 1_600,
    identity: 'baseline human restored',
    brain: 'Withdrawal fading. Brain recalibrating to real-world stimulation.',
    performance: 'Basic impulse control returning. The fog is lifting.',
    auraStyle: 'aura-slate',
    auraDescription: 'Neutral steady aura',
    color: '#94A3B8',
    glowColor: 'rgba(148, 163, 184, 0.6)',
  },
  {
    id: 3,
    name: 'Locked In',
    emoji: '🗿',
    assetKey: 'lockedin.png',
    minDays: 7,
    auraPerHour: 2_400,
    identity: 'tunnel vision mode',
    brain: 'Dopamine sensitivity improving. Effort-reward circuitry rebuilding.',
    performance: 'Longer focus windows, routine stability, boredom tolerable.',
    auraStyle: 'aura-blue',
    auraDescription: 'Calm blue armor glow',
    color: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.6)',
  },
  {
    id: 4,
    name: 'Sigma',
    emoji: '🐺',
    assetKey: 'sigma.png',
    minDays: 15,
    auraPerHour: 4_000,
    identity: 'moving in silence',
    brain: 'Social reward salience reduced. Operating on internal metrics.',
    performance: 'Deep work possible. Distraction resistance high.',
    auraStyle: 'aura-purple',
    auraDescription: 'Purple shadow aura',
    color: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.6)',
  },
  {
    id: 5,
    name: 'Alpha',
    emoji: '🦁',
    assetKey: 'alpha.png',
    minDays: 30,
    auraPerHour: 6_000,
    identity: 'self leadership unlocked',
    brain: 'Habit restructuring complete. Frontal lobe reclaiming territory.',
    performance: 'Consistency, confidence, momentum. Leading by example.',
    auraStyle: 'aura-gold',
    auraDescription: 'Golden flame aura',
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.6)',
  },
  {
    id: 6,
    name: 'Chad',
    emoji: '😎',
    assetKey: 'chad.png',
    minDays: 45,
    auraPerHour: 9_000,
    identity: 'confidence online',
    brain: 'Baseline dopamine elevated. Pleasure derived from real achievement.',
    performance: 'High output, social presence sharpened, zero apology mode.',
    auraStyle: 'aura-orange',
    auraDescription: 'Orange radiant glow',
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
  },
  {
    id: 7,
    name: 'Gigachad',
    emoji: '🗿',
    assetKey: 'gigachad.png',
    minDays: 60,
    auraPerHour: 14_000,
    identity: 'rare presence',
    brain: 'Top-down cognitive control dominant. You think before you feel.',
    performance: 'Emotional regulation locked in. Strategic, calm, dangerous.',
    auraStyle: 'aura-white',
    auraDescription: 'Electric white aura',
    color: '#F1F5F9',
    glowColor: 'rgba(241, 245, 249, 0.7)',
  },
  {
    id: 8,
    name: 'Demigod',
    emoji: '⚡',
    assetKey: 'demigod.png',
    minDays: 120,
    auraPerHour: 30_000,
    identity: 'beyond average',
    brain: 'Identity integration complete. You are the discipline.',
    performance: 'Flow state accessible on demand. Creative output elevated.',
    auraStyle: 'aura-cyan',
    auraDescription: 'Cyan neural grid aura',
    color: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.6)',
  },
  {
    id: 9,
    name: 'Glitch in the Matrix',
    emoji: '🌀',
    assetKey: 'glitch.png',
    minDays: 365,
    auraPerHour: 72_000,
    identity: 'statistical anomaly',
    brain: 'You are literally not like other people. Neuroplasticity maxed.',
    performance: 'Operating outside normal human parameters. Undefined behavior.',
    auraStyle: 'aura-cosmic',
    auraDescription: 'Cosmic glitch aura',
    color: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.6)',
  },
]

export function getCurrentLevel(streakDays: number): Level {
  let current = LEVELS[0]
  for (const level of LEVELS) {
    if (streakDays >= level.minDays) {
      current = level
    }
  }
  return current
}

export function getNextLevel(streakDays: number): Level | null {
  const current = getCurrentLevel(streakDays)
  const nextIndex = current.id + 1
  return LEVELS[nextIndex] ?? null
}

export function getLevelProgress(streakDays: number): number {
  const current = getCurrentLevel(streakDays)
  const next = getNextLevel(streakDays)
  if (!next) return 100
  const range = next.minDays - current.minDays
  const progress = streakDays - current.minDays
  return Math.min(100, Math.round((progress / range) * 100))
}

export function getLevelAsset(assetKey: string): string {
  return `/assets/${assetKey}`
}
