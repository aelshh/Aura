import type { Level } from '../types'

export const LEVELS: Level[] = [
  {
    id: 0,
    name: 'Clown',
    emoji: '🤡',
    assetKey: 'clown.png',
    minDays: 0,
    auraPerHour: 1_000,
    identity: 'dopamine-farmed NPC',
    brain: 'Reward circuit fully hijacked. Every notification triggers a micro-dopamine spike, desensitizing receptors and making real-world rewards feel flat.',
    performance: 'Zero intentional action. Attention hijacked by algorithms, living on autopilot in a manufactured stimulation loop.',
    auraStyle: 'aura-grey',
    auraDescription: 'Dead grey static',
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
    identity: 'feeling the withdrawal',
    brain: 'Acute withdrawal phase: restlessness, irritability, and cravings signal your brain actively recalibrating dopamine receptor sensitivity.',
    performance: 'Discomfort is the proof it is working. First conscious pause before reaching for the phone.',
    auraStyle: 'aura-green',
    auraDescription: 'Flickering green spark',
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
    identity: 'surviving the fog',
    brain: 'Withdrawal peaks then breaks. Brain fog and low energy are temporary — dopamine receptors beginning to upregulate after overstimulation.',
    performance: 'Boredom feels loud but you are sitting with it. Impulse control is returning one minute at a time.',
    auraStyle: 'aura-slate',
    auraDescription: 'Dim steady pulse',
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
    identity: 'first week cleared',
    brain: 'Dopamine receptor sensitivity measurably recovering. The brain is beginning to find low-stimulation activities tolerable — even enjoyable.',
    performance: 'Focus windows opening up. Routine stabilizing. Sitting with discomfort without immediately escaping it.',
    auraStyle: 'aura-blue',
    auraDescription: 'Solid blue resolve',
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
    identity: 'wiring rewiring',
    brain: 'Sleep quality improving as melatonin and dopamine rhythms restabilize. Natural rewards — sunlight, food, real conversation — start feeling genuinely good again.',
    performance: 'Operating on internal metrics instead of external validation. Cravings for old habits fading, internal voice getting louder.',
    auraStyle: 'aura-purple',
    auraDescription: 'Purple inner signal',
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
    identity: 'reward system rebuilt',
    brain: 'Reward circuit measurably resensitized after 30 days. Studies show ~30% increase in motivation for real-world effort, exercise, and meaningful work.',
    performance: 'Habits forming without forcing. Discipline compounding. The hard things are starting to feel normal.',
    auraStyle: 'aura-gold',
    auraDescription: 'Golden momentum aura',
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
    identity: 'prefrontal takeover',
    brain: 'Prefrontal cortex activity visibly increasing. Emotional reactivity drops. You think before you feel, not the other way around.',
    performance: 'Self-control compounding into identity. High output, sharp social presence, zero tolerance for time-wasting.',
    auraStyle: 'aura-orange',
    auraDescription: 'Radiant orange field',
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
    identity: 'neuroplastic shift complete',
    brain: 'Neuroplastic changes solidified. Old dopamine pathways pruned. Identity-level shift underway — the person who doomscrolled feels like a stranger.',
    performance: 'Near-zero cravings. Operating with calm, strategic clarity. Emotional regulation is automatic, not effortful.',
    auraStyle: 'aura-white',
    auraDescription: 'Blinding white presence',
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
    identity: 'operating on a different plane',
    brain: 'Brain now defaults to long-term reward circuitry. Flow states accessible on demand. Creative and cognitive output measurably elevated.',
    performance: 'Your baseline is what most people call their peak. You live at the level others only visit by accident.',
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
    identity: 'top 1% of humans alive',
    brain: 'Full neuroplastic reorganization complete. You are a statistical anomaly — fewer than 1% of people sustain this. Your brain is structurally different now.',
    performance: 'You are not optimizing anymore. You simply operate outside the parameters most humans accept as reality.',
    auraStyle: 'aura-cosmic',
    auraDescription: 'Cosmic glitch field',
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
