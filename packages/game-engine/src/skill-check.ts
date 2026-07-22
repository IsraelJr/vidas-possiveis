export type OutcomeTier =
  | "critical_failure"
  | "failure"
  | "partial_success"
  | "success"
  | "exceptional_success";

export interface SkillModifier {
  readonly label: string;
  readonly value: number;
}

export interface SkillCheckInput {
  readonly seed: string;
  readonly eventId: string;
  readonly rollIndex: number;
  readonly difficulty: number;
  readonly modifiers: readonly SkillModifier[];
}

export interface SkillCheckResult {
  readonly roll: number;
  readonly modifierTotal: number;
  readonly score: number;
  readonly outcome: OutcomeTier;
}

function hash(input: string): number {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function nextRandom(seed: number): number {
  let value = seed + 0x6d2b79f5;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
}

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

  const random = nextRandom(hash(`${input.seed}:${input.eventId}:${input.rollIndex}`));
  const roll = Math.floor(random * 100) + 1;
  const modifierTotal = input.modifiers.reduce((sum, modifier) => sum + modifier.value, 0);
  const score = Math.max(1, Math.min(100, roll + modifierTotal - input.difficulty + 50));

  return {
    roll,
    modifierTotal,
    score,
    outcome: resolveOutcome(score)
  };
}
