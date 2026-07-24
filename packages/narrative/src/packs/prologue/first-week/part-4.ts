import type { StoryNode } from "@vidas-possiveis/game-engine";
import * as S from "./shared";

export const firstWeekPart4: readonly StoryNode[] = [
{
    id: "prologue.conflict",
    moduleId: "prologue.first-week",
    title: "A discussão esquenta",
    text: "{rivalName} responde, outras pessoas se aproximam e a conversa fica a um passo de virar empurrão.",
    activity: "Impedir ou ampliar um confronto",
    nextCommitment: S.PRESENTATION,
    contextPersonIds: [S.RIVAL],
    choices: [
      {
        id: "step-back",
        label: "Recuar antes que a discussão vire briga",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "selfControl", delta: 3 },
          { type: "relationship", personId: S.RIVAL, dimension: "tension", delta: -2 }
        ],
        nextNodeId: "prologue.friday-transition"
      },
      {
        id: "ask-friend-mediation",
        label: "Pedir que {friendName} ajude a separar a discussão",
        conditions: [],
        effects: [
          { type: "relationship", personId: S.FRIEND, dimension: "trust", delta: 2 },
          { type: "relationship", personId: S.RIVAL, dimension: "tension", delta: -1 }
        ],
        nextNodeId: "prologue.friday-transition"
      },
      {
        id: "physical-fight",
        label: "Partir para a agressão",
        conditions: [],
        effects: [
          { type: "condition", condition: "health", delta: -8 },
          { type: "condition", condition: "stress", delta: 10 },
          { type: "reputation", delta: -6 },
          { type: "relationship", personId: S.RIVAL, dimension: "tension", delta: 18 },
          { type: "flag", flag: "schoolFight", value: true },
          {
            type: "add_memory",
            personId: S.RIVAL,
            memory: {
              id: "school-fight",
              summary: "Uma discussão entre vocês terminou em agressão física na escola.",
              kind: "conflict",
              intensity: 10,
              resolved: false,
              tags: ["school", "fight", "discipline"]
            }
          }
        ],
        nextNodeId: "prologue.friday-transition"
      }
    ]
  },
{
    id: "prologue.friday-transition",
    moduleId: "prologue.first-week",
    title: "A semana continua",
    text: "Entre aulas, mensagens e ajustes no trabalho, os dias avançam. Na sexta-feira, o despertador toca às 06:30. A apresentação começa às 08:00.",
    activity: "Preparar-se para a apresentação",
    nextCommitment: S.PRESENTATION,
    choices: [
      {
        id: "reach-friday",
        label: "Levantar e decidir como chegar à escola",
        conditions: [],
        effects: [
          { type: "set_clock", clock: { date: "2026-02-20", minuteOfDay: 6 * 60 + 30 } },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.presentation-morning"
      }
    ]
  },
{
    id: "prologue.presentation-morning",
    moduleId: "prologue.first-week",
    title: "A manhã da apresentação",
    text: "A apresentação começa às 08:00. O ônibus custa menos, o carro por aplicativo reduz o trajeto, e sair tarde pode fazer o grupo começar sem você.",
    activity: "Escolher o deslocamento para a escola",
    nextCommitment: S.PRESENTATION,
    choices: [
      {
        id: "breakfast-and-bus-friday",
        label: "Tomar café e pegar o ônibus",
        conditions: [{ type: "money", operator: ">=", valueCents: 500 }],
        effects: [
          { type: "money", deltaCents: -500 },
          { type: "condition", condition: "energy", delta: 5 },
          { type: "set_clock", clock: { date: "2026-02-20", minuteOfDay: 7 * 60 + 40 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.presentation-wait"
      },
      {
        id: "app-friday",
        label: "Chamar um carro e chegar bem cedo",
        conditions: [{ type: "money", operator: ">=", valueCents: 2500 }],
        effects: [
          { type: "money", deltaCents: -2500 },
          { type: "condition", condition: "stress", delta: -3 },
          { type: "set_clock", clock: { date: "2026-02-20", minuteOfDay: 7 * 60 + 10 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.presentation-wait"
      },
      {
        id: "late-bus-friday",
        label: "Sair mais tarde e correr para o ônibus",
        conditions: [],
        effects: [
          { type: "money", deltaCents: -500 },
          { type: "condition", condition: "stress", delta: 8 },
          { type: "set_clock", clock: { date: "2026-02-20", minuteOfDay: 8 * 60 + 10 } },
          { type: "set_location", location: "school" },
          { type: "flag", flag: "lateForPresentation", value: true }
        ],
        nextNodeId: "prologue.presentation-late"
      }
    ]
  },
{
    id: "prologue.presentation-wait",
    moduleId: "prologue.first-week",
    title: "Tempo antes da apresentação",
    text: "Você chegou antes das 08:00. O grupo ainda pode revisar os slides, respirar ou resolver uma última tensão.",
    activity: "Aguardar e preparar a apresentação",
    nextCommitment: S.PRESENTATION,
    contextPersonIds: [S.GROUP],
    choices: [
      {
        id: "review-slides",
        label: "Revisar os slides com o grupo",
        conditions: [],
        effects: [
          { type: "knowledge", knowledge: "portuguese", delta: 1 },
          { type: "flag", flag: "lastReview", value: true },
          { type: "set_clock", clock: S.PRESENTATION.clock }
        ],
        nextNodeId: "prologue.presentation"
      },
      {
        id: "encourage-group",
        label: "Conversar com {groupMateName} e acalmar o grupo",
        conditions: [],
        effects: [
          { type: "relationship", personId: S.GROUP, dimension: "trust", delta: 1 },
          { type: "condition", condition: "stress", delta: -2 },
          { type: "flag", flag: "calmedGroup", value: true },
          { type: "set_clock", clock: S.PRESENTATION.clock }
        ],
        nextNodeId: "prologue.presentation"
      },
      {
        id: "wait-quietly-presentation",
        label: "Ficar em silêncio e organizar a própria fala",
        conditions: [],
        effects: [
          { type: "condition", condition: "stress", delta: -1 },
          { type: "set_clock", clock: S.PRESENTATION.clock }
        ],
        nextNodeId: "prologue.presentation"
      }
    ]
  },
{
    id: "prologue.presentation-late",
    moduleId: "prologue.first-week",
    title: "A apresentação já começou",
    text: "Você chega às 08:10. O grupo precisou explicar sua ausência e a ordem das falas mudou.",
    activity: "Entrar na sala após o início",
    nextCommitment: { label: "Apresentação em andamento", clock: { date: "2026-02-20", minuteOfDay: 8 * 60 + 10 } },
    choices: [
      {
        id: "join-late",
        label: "Pedir desculpas e assumir a próxima parte",
        conditions: [],
        effects: [
          { type: "reputation", delta: -2 },
          { type: "relationship", personId: S.GROUP, dimension: "tension", delta: 3 }
        ],
        nextNodeId: "prologue.presentation"
      }
    ]
  }
];
