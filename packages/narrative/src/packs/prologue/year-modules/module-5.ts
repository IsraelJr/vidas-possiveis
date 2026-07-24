import type { StoryNode } from "@vidas-possiveis/game-engine";
import * as S from "./shared";

export const yearModulePart5: readonly StoryNode[] = [
{
    id: "prologue.module-relationship",
    moduleId: "prologue.relationship",
    title: "Uma conversa antes do fim do ano",
    text: "{groupMateName} procura você durante o intervalo. Meses se passaram desde o trabalho, mas o que aconteceu entre vocês ainda influencia a conversa.",
    activity: "Decidir o futuro da relação",
    contextPersonIds: [S.GROUP],
    choices: [
      {
        id: "strengthen-friendship",
        label: "Investir em uma amizade e combinar de manter contato",
        conditions: [
          { type: "relationship", personId: S.GROUP, dimension: "tension", operator: "<=", value: 35 }
        ],
        effects: [
          { type: "relationship", personId: S.GROUP, dimension: "trust", delta: 4 },
          { type: "relationship", personId: S.GROUP, dimension: "closeness", delta: 6 },
          { type: "set_person_category", personId: S.GROUP, category: "important" },
          { type: "set_person_presence", personId: S.GROUP, presence: "active" },
          {
            type: "add_memory",
            personId: S.GROUP,
            memory: {
              id: "promised-contact-after-school",
              summary: "Vocês combinaram de manter contato depois do fim da escola.",
              kind: "promise",
              intensity: 7,
              resolved: false,
              tags: ["school-end", "future", "friendship"]
            }
          },
          { type: "set_clock", clock: { date: "2026-12-18", minuteOfDay: 14 * 60 } }
        ],
        nextNodeId: "prologue.school-year-end"
      },
      {
        id: "romantic-opening",
        label: "Demonstrar que gostaria de conhecer {groupMateName} de outra forma",
        conditions: [
          { type: "flag", flag: "romanceCompatibleWithGroupMate", value: true },
          { type: "relationship", personId: S.GROUP, dimension: "trust", operator: ">=", value: 35 },
          { type: "relationship", personId: S.GROUP, dimension: "closeness", operator: ">=", value: 30 },
          { type: "relationship", personId: S.GROUP, dimension: "tension", operator: "<=", value: 20 }
        ],
        effects: [
          { type: "relationship", personId: S.GROUP, dimension: "closeness", delta: 7 },
          { type: "set_person_category", personId: S.GROUP, category: "important" },
          { type: "flag", flag: "romanticInterestWithGroupMate", value: true },
          {
            type: "add_memory",
            personId: S.GROUP,
            memory: {
              id: "romantic-opening",
              summary: "Vocês reconheceram a possibilidade de uma relação romântica, sem prometer o que ainda não viveram.",
              kind: "romance",
              intensity: 8,
              resolved: false,
              tags: ["school-end", "romance", "consent"]
            }
          },
          { type: "set_clock", clock: { date: "2026-12-18", minuteOfDay: 14 * 60 } }
        ],
        nextNodeId: "prologue.school-year-end"
      },
      {
        id: "repair-conflict",
        label: "Tentar resolver o que ainda ficou mal explicado",
        conditions: [
          { type: "relationship", personId: S.GROUP, dimension: "tension", operator: ">=", value: 15 }
        ],
        effects: [
          { type: "relationship", personId: S.GROUP, dimension: "tension", delta: -8 },
          { type: "relationship", personId: S.GROUP, dimension: "trust", delta: 2 },
          {
            type: "add_memory",
            personId: S.GROUP,
            memory: {
              id: "late-reconciliation",
              summary: "Perto do fim do ano, vocês tentaram conversar sobre o conflito do trabalho.",
              kind: "reconciliation",
              intensity: 6,
              resolved: true,
              tags: ["school-end", "reconciliation"]
            }
          },
          { type: "set_clock", clock: { date: "2026-12-18", minuteOfDay: 14 * 60 } }
        ],
        nextNodeId: "prologue.school-year-end"
      },
      {
        id: "let-relation-fade",
        label: "Aceitar que a relação ficará no passado",
        conditions: [],
        effects: [
          { type: "set_person_presence", personId: S.GROUP, presence: "inactive" },
          { type: "set_clock", clock: { date: "2026-12-18", minuteOfDay: 14 * 60 } }
        ],
        nextNodeId: "prologue.school-year-end"
      }
    ]
  }
];
