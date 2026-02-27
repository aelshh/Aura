import type { ExtendedMilestone, Level } from "../types";

export const HOURLY_BONUS = 200;

export const EXTENDED_MILESTONES: ExtendedMilestone[] = [
  { key: "ext_3h", hours: 3, bonus: 500, label: "3 Hour Streak" },
  { key: "ext_6h", hours: 6, bonus: 1200, label: "6 Hour Streak" },
  { key: "ext_12h", hours: 12, bonus: 3000, label: "12 Hour Streak" },
  { key: "ext_24h", hours: 24, bonus: 7000, label: "24 Hour Streak" },
];

/** Returns aura gained per second at the given level. */
export function getAuraPerSecond(level: Level): number {
  return level.auraPerHour / 3600
}

/** Returns aura gained per minute at the given level. */
export function getAuraPerMinute(level: Level): number {
  return level.auraPerHour / 60
}

export function hourlyKey(hour: number): string {
  return `hour_${hour}`;
}

export function getElapsedSeconds(start: Date, now: Date): number {
  return Math.max(0, (now.getTime() - start.getTime()) / 1000);
}

export function getElapsedHours(start: Date, now: Date): number {
  return getElapsedSeconds(start, now) / 3600;
}

export function getElapsedMinutes(start: Date, now: Date): number {
  return getElapsedSeconds(start, now) / 60;
}

export function getStreakDays(start: Date, now: Date): number {
  return Math.floor(getElapsedSeconds(start, now) / 86400);
}

interface MilestoneReward {
  key: string;
  amount: number;
  label: string;
}

interface AuraUpdateResult {
  passiveEarned: number;
  milestoneRewards: MilestoneReward[];
  totalEarned: number;
  newClaimed: string[];
}

/**
 * Calculates all aura earned between fromTime and toTime,
 * excluding already claimed milestones.
 * auraPerHour defaults to 1000 (Level 0) if not provided.
 */
export function calculateAuraUpdate(
  sessionStart: Date,
  fromTime: Date,
  toTime: Date,
  alreadyClaimed: string[],
  auraPerHour = 1_000,
): AuraUpdateResult {
  const fromMinutes = getElapsedMinutes(sessionStart, fromTime);
  const toMinutes = getElapsedMinutes(sessionStart, toTime);
  const elapsedMinutes = Math.max(0, toMinutes - fromMinutes);

  const passivePerMinute = auraPerHour / 60;
  const passiveEarned = elapsedMinutes * passivePerMinute;

  const milestoneRewards: MilestoneReward[] = [];
  const newClaimed: string[] = [];

  const fromHours = fromMinutes / 60;
  const toHours = toMinutes / 60;

  // Hourly bonuses
  const fromCompletedHours = Math.floor(fromHours);
  const toCompletedHours = Math.floor(toHours);

  for (let h = fromCompletedHours + 1; h <= toCompletedHours; h++) {
    const key = hourlyKey(h);
    if (!alreadyClaimed.includes(key)) {
      milestoneRewards.push({
        key,
        amount: HOURLY_BONUS,
        label: `${h}h Streak Bonus`,
      });
      newClaimed.push(key);
    }
  }

  // Extended milestones
  for (const ext of EXTENDED_MILESTONES) {
    if (
      toHours >= ext.hours &&
      fromHours < ext.hours &&
      !alreadyClaimed.includes(ext.key)
    ) {
      milestoneRewards.push({
        key: ext.key,
        amount: ext.bonus,
        label: ext.label,
      });
      newClaimed.push(ext.key);
    } else if (toHours >= ext.hours && !alreadyClaimed.includes(ext.key)) {
      milestoneRewards.push({
        key: ext.key,
        amount: ext.bonus,
        label: ext.label,
      });
      newClaimed.push(ext.key);
    }
  }

  const totalEarned =
    passiveEarned + milestoneRewards.reduce((sum, m) => sum + m.amount, 0);

  return { passiveEarned, milestoneRewards, totalEarned, newClaimed };
}

/**
 * Calculates aura earned during offline period (re-entry reward).
 */
export function calculateReentryAura(
  sessionStart: Date,
  lastActive: Date,
  now: Date,
  alreadyClaimed: string[],
  auraPerHour = 1_000,
): AuraUpdateResult {
  if (now.getTime() - lastActive.getTime() < 5000) {
    return {
      passiveEarned: 0,
      milestoneRewards: [],
      totalEarned: 0,
      newClaimed: [],
    };
  }
  return calculateAuraUpdate(sessionStart, lastActive, now, alreadyClaimed, auraPerHour);
}

export function formatAura(aura: number): string {
  if (aura >= 1_000_000) return `${(aura / 1_000_000).toFixed(1)}M`;
  if (aura >= 1_000) return `${(aura / 1_000).toFixed(1)}K`;
  return Math.floor(aura).toLocaleString();
}
