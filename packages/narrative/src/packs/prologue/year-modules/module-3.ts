import type { StoryNode } from "@vidas-possiveis/game-engine";
import * as S from "./shared";

export const yearModulePart3: readonly StoryNode[] = [
{
    id: "prologue.module-family",
    moduleId: "prologue.family",
    title: "Uma responsabilidade em casa",
    text: "Durante as férias, sua família pede que você pare o que está fazendo para {familyDuty}. Você já tinha outros planos para a tarde.",
    activity: "Lidar com uma responsabilidade familiar",
    choices: [
      {
        id: "family-help",
        label: "Assumir a responsabilidade",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "selfControl", delta: 3 },
          { type: "condition", condition: "energy", delta: -6 },
          { type: "condition", condition: "stress", delta: 2 },
          { type: "flag", flag: "supportedFamily", value: true },
          { type: "set_clock", clock: { date: "2026-09-18", minuteOfDay: 10 * 60 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.module-physical"
      },
      {
        id: "family-negotiate",
        label: "Negociar uma divisão da tarefa com outra pessoa",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "communication", delta: 2 },
          { type: "condition", condition: "stress", delta: -1 },
          { type: "flag", flag: "negotiatedFamilyDuty", value: true },
          { type: "set_clock", clock: { date: "2026-09-18", minuteOfDay: 10 * 60 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.module-physical"
      },
      {
        id: "family-ignore",
        label: "Ignorar o pedido e manter seus próprios planos",
        conditions: [],
        effects: [
          { type: "condition", condition: "stress", delta: 5 },
          { type: "reputation", delta: -1 },
          { type: "flag", flag: "ignoredFamilyDuty", value: true },
          { type: "set_clock", clock: { date: "2026-09-18", minuteOfDay: 10 * 60 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.module-physical"
      },
      {
        id: "family-paid-work",
        label: "Transformar a ajuda em um trabalho combinado",
        conditions: [],
        effects: [
          { type: "money", deltaCents: 8000 },
          { type: "attribute", attribute: "selfControl", delta: 2 },
          { type: "condition", condition: "energy", delta: -8 },
          { type: "flag", flag: "workedWithFamily", value: true },
          { type: "set_clock", clock: { date: "2026-09-18", minuteOfDay: 10 * 60 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.module-physical"
      }
    ]
  }
];
