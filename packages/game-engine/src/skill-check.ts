import { deterministicUnit } from "./random";
import type { OutcomeTier, SkillCheckInput, SkillCheckResult } from "./types";

export function resolveOutcome(score: number): OutcomeTier {
  if (score <= 10) return "critical_failure";
  if (score <= 35) return "failure";
  if (score <= 60) return "partial_success";
  if (score <= 90) return "success";
  return "exceptional_success";
}

export function runSkillCheck(input: SkillCheckInput): SkillCheckResult {
  if (!Number.isInteger(input.rollIndex) || input.rollIndex < 0) {
    throw new Error("rollIndex deve ser um inteiro não negativo.");
  }

  const roll = Math.floor(
    deterministicUnit(input.seed, `${input.eventId}:${input.rollIndex}`) * 100
  ) + 1;
  const modifierTotal = input.modifiers.reduce((sum, modifier) => sum + modifier.value, 0);
  const score = Math.max(1, Math.min(100, roll + modifierTotal - input.difficulty + 50));

  return {
    roll,
    modifierTotal,
    score,
    outcome: resolveOutcome(score)
  };
}
