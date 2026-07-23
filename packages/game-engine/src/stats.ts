import { STAT_KEYS, type Origin, type Stats, type StatKey } from "./types";

const MIN_STAT = 0;
const MAX_STAT = 100;

const BASE_STATS: Stats = {
  knowledge: 35,
  communication: 35,
  discipline: 40,
  ethics: 50,
  energy: 75,
  stress: 20,
  health: 80,
  reputation: 10
};

const ORIGIN_ADJUSTMENTS: Readonly<Record<Origin, Partial<Record<StatKey, number>>>> = {
  low_income: {
    discipline: 3,
    energy: -4,
    stress: 5
  },
  middle_income: {},
  high_income: {
    knowledge: 2,
    stress: -2
  }
};

export function clampStat(value: number): number {
  return Math.max(MIN_STAT, Math.min(MAX_STAT, Math.round(value)));
}

export function createInitialStats(origin: Origin): Stats {
  const adjustment = ORIGIN_ADJUSTMENTS[origin];
  return Object.fromEntries(
    STAT_KEYS.map((key) => [key, clampStat(BASE_STATS[key] + (adjustment[key] ?? 0))])
  ) as unknown as Stats;
}
