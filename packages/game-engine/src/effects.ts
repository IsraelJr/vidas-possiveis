import { advanceClock } from "./clock";
import { clampStat } from "./stats";
import type { AppliedChange, Effect, GameState, Stats } from "./types";

export interface EffectsResult {
  readonly state: GameState;
  readonly changes: readonly AppliedChange[];
}

export function applyEffects(state: GameState, effects: readonly Effect[]): EffectsResult {
  let nextState = state;
  const changes: AppliedChange[] = [];

  for (const effect of effects) {
    switch (effect.type) {
      case "stat": {
        const before = nextState.stats[effect.stat];
        const after = clampStat(before + effect.delta);
        const stats: Stats = { ...nextState.stats, [effect.stat]: after };
        nextState = { ...nextState, stats };
        changes.push({ type: "stat", stat: effect.stat, before, after });
        break;
      }
      case "money": {
        const beforeCents = nextState.moneyCents;
        const afterCents = Math.max(0, beforeCents + effect.deltaCents);
        nextState = { ...nextState, moneyCents: afterCents };
        changes.push({ type: "money", beforeCents, afterCents });
        break;
      }
      case "flag": {
        const before = nextState.flags[effect.flag] ?? false;
        nextState = {
          ...nextState,
          flags: { ...nextState.flags, [effect.flag]: effect.value }
        };
        changes.push({ type: "flag", flag: effect.flag, before, after: effect.value });
        break;
      }
      case "advance_time": {
        const before = nextState.clock;
        const after = advanceClock(before, effect.minutes);
        nextState = { ...nextState, clock: after };
        changes.push({ type: "clock", before, after });
        break;
      }
      case "set_location": {
        const before = nextState.location;
        nextState = { ...nextState, location: effect.location };
        changes.push({ type: "location", before, after: effect.location });
        break;
      }
    }
  }

  return { state: nextState, changes };
}
