import {
  ATTRIBUTE_KEYS,
  CONDITION_KEYS,
  type Attributes,
  type AttributeKey,
  type ConditionsState,
  type ConditionKey,
  type KnowledgeState
} from "./types";

const MIN_VALUE = 0;
const MAX_VALUE = 100;

const BASE_ATTRIBUTES: Attributes = {
  reasoning: 42,
  perception: 40,
  communication: 35,
  selfControl: 40,
  vigor: 45,
  agility: 42
};

const BASE_CONDITIONS: ConditionsState = {
  energy: 75,
  stress: 20,
  health: 80
};

export function clampValue(value: number): number {
  return Math.max(MIN_VALUE, Math.min(MAX_VALUE, Math.round(value)));
}

export function createInitialAttributes(
  adjustments: Partial<Record<AttributeKey, number>> = {}
): Attributes {
  return Object.fromEntries(
    ATTRIBUTE_KEYS.map((key) => [key, clampValue(BASE_ATTRIBUTES[key] + (adjustments[key] ?? 0))])
  ) as unknown as Attributes;
}

export function createInitialConditions(
  adjustments: Partial<Record<ConditionKey, number>> = {}
): ConditionsState {
  return Object.fromEntries(
    CONDITION_KEYS.map((key) => [key, clampValue(BASE_CONDITIONS[key] + (adjustments[key] ?? 0))])
  ) as unknown as ConditionsState;
}

/** O pacote define quais conhecimentos existem e seus valores iniciais. */
export function createInitialKnowledge(initialValues: KnowledgeState = {}): KnowledgeState {
  return Object.fromEntries(
    Object.entries(initialValues).map(([key, value]) => [key, clampValue(value)])
  );
}
