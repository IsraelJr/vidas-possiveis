import type { StorySkillCheck } from "@vidas-possiveis/game-engine";
import { PROLOGUE_PERSON_IDS } from "../cast";

export const GROUP = PROLOGUE_PERSON_IDS.groupMate;
export const FRIEND = PROLOGUE_PERSON_IDS.friend;
export const RIVAL = PROLOGUE_PERSON_IDS.rival;

export const FIRST_CLASS = {
  label: "Primeira aula",
  clock: { date: "2026-02-16", minuteOfDay: 7 * 60 + 30 }
} as const;
export const INTERVAL = {
  label: "Intervalo",
  clock: { date: "2026-02-16", minuteOfDay: 10 * 60 }
} as const;
export const PHYSICAL_EDUCATION = {
  label: "Educação Física",
  clock: { date: "2026-02-16", minuteOfDay: 10 * 60 + 20 }
} as const;
export const SCHOOL_END = {
  label: "Fim das aulas",
  clock: { date: "2026-02-16", minuteOfDay: 12 * 60 }
} as const;
export const GROUP_CHAT = {
  label: "Organizar o trabalho",
  clock: { date: "2026-02-16", minuteOfDay: 16 * 60 }
} as const;
export const PAIR_TEST = {
  label: "Prova em dupla",
  clock: { date: "2026-02-17", minuteOfDay: 8 * 60 + 20 }
} as const;
export const PRESENTATION = {
  label: "Apresentação do trabalho",
  clock: { date: "2026-02-20", minuteOfDay: 8 * 60 }
} as const;

export const presentationOutcomes = {
  critical_failure: {
    nextNodeId: "prologue.presentation-hard",
    effects: [
      { type: "reputation", delta: -5 },
      { type: "condition", condition: "stress", delta: 10 },
      { type: "relationship", personId: GROUP, dimension: "tension", delta: 5 }
    ]
  },
  failure: {
    nextNodeId: "prologue.presentation-hard",
    effects: [
      { type: "reputation", delta: -3 },
      { type: "condition", condition: "stress", delta: 7 }
    ]
  },
  partial_success: {
    nextNodeId: "prologue.presentation-mixed",
    effects: [
      { type: "reputation", delta: 2 },
      { type: "condition", condition: "stress", delta: 3 }
    ]
  },
  success: {
    nextNodeId: "prologue.presentation-strong",
    effects: [
      { type: "reputation", delta: 5 },
      { type: "attribute", attribute: "communication", delta: 3 },
      { type: "relationship", personId: GROUP, dimension: "trust", delta: 3 }
    ]
  },
  exceptional_success: {
    nextNodeId: "prologue.presentation-strong",
    effects: [
      { type: "reputation", delta: 8 },
      { type: "attribute", attribute: "communication", delta: 5 },
      { type: "knowledge", knowledge: "portuguese", delta: 3 },
      { type: "relationship", personId: GROUP, dimension: "trust", delta: 5 }
    ]
  }
} satisfies StorySkillCheck["outcomes"];
