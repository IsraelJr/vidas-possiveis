import type { StoryNode } from "@vidas-possiveis/game-engine";
import * as S from "./shared";

export const yearModulePart2: readonly StoryNode[] = [
{
    id: "prologue.module-social",
    moduleId: "prologue.social",
    title: "Um convite para o {socialDestination}",
    text: "No meio do ano, {friendName} reúne algumas pessoas para ir ao {socialDestination}. O passeio pode render uma conversa importante, mas custa dinheiro e ocupa quase toda a tarde.",
    activity: "Decidir se vai sair com os amigos",
    contextPersonIds: [S.FRIEND, S.GROUP],
    choices: [
      {
        id: "social-bus",
        label: "Ir de ônibus e controlar os gastos",
        conditions: [{ type: "money", operator: ">=", valueCents: 1800 }],
        effects: [
          { type: "money", deltaCents: -1800 },
          { type: "relationship", personId: S.FRIEND, dimension: "closeness", delta: 4 },
          { type: "condition", condition: "energy", delta: -5 },
          {
            type: "add_memory",
            personId: S.FRIEND,
            memory: {
              id: "midyear-outing",
              summary: "Vocês passaram uma tarde juntos no {socialDestination}.",
              kind: "shared_leisure",
              intensity: 5,
              resolved: true,
              tags: ["school-year", "outing", "friendship"]
            }
          },
          { type: "set_clock", clock: { date: "2026-07-10", minuteOfDay: 16 * 60 } },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.module-family"
      },
      {
        id: "social-app",
        label: "Usar um carro por aplicativo para chegar mais rápido",
        conditions: [{ type: "money", operator: ">=", valueCents: 3500 }],
        effects: [
          { type: "money", deltaCents: -3500 },
          { type: "relationship", personId: S.FRIEND, dimension: "closeness", delta: 4 },
          { type: "condition", condition: "stress", delta: -3 },
          { type: "set_clock", clock: { date: "2026-07-10", minuteOfDay: 16 * 60 } },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.module-family"
      },
      {
        id: "social-decline",
        label: "Recusar para preservar dinheiro e tempo",
        conditions: [],
        effects: [
          { type: "money", deltaCents: 0 },
          { type: "attribute", attribute: "selfControl", delta: 1 },
          { type: "relationship", personId: S.FRIEND, dimension: "closeness", delta: -1 },
          { type: "set_clock", clock: { date: "2026-07-10", minuteOfDay: 16 * 60 } },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.module-family"
      },
      {
        id: "social-invite-group-mate",
        label: "Aceitar e chamar {groupMateName} para ir também",
        conditions: [
          { type: "relationship", personId: S.GROUP, dimension: "tension", operator: "<=", value: 25 }
        ],
        effects: [
          { type: "money", deltaCents: -1800 },
          { type: "relationship", personId: S.GROUP, dimension: "closeness", delta: 4 },
          { type: "relationship", personId: S.FRIEND, dimension: "closeness", delta: 2 },
          { type: "set_person_presence", personId: S.GROUP, presence: "active" },
          { type: "set_clock", clock: { date: "2026-07-10", minuteOfDay: 16 * 60 } },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.module-family"
      }
    ]
  }
];
