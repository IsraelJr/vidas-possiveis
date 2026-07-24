import type { StoryNode } from "@vidas-possiveis/game-engine";
import * as S from "./shared";

export const firstWeekPart3: readonly StoryNode[] = [
{
    id: "prologue.night-plan",
    moduleId: "prologue.first-week",
    title: "Como terminar a noite",
    text: "Ainda há alguns detalhes para revisar. Amanhã haverá uma prova em dupla, e a apresentação continua marcada para sexta-feira.",
    activity: "Decidir entre preparação e descanso",
    nextCommitment: S.PAIR_TEST,
    choices: [
      {
        id: "review-and-sleep",
        label: "Revisar por uma hora e dormir",
        conditions: [],
        effects: [
          { type: "knowledge", knowledge: "mathematics", delta: 3 },
          { type: "attribute", attribute: "selfControl", delta: 2 },
          { type: "condition", condition: "energy", delta: 12 },
          { type: "condition", condition: "stress", delta: -3 },
          { type: "flag", flag: "studiedForPairTest", value: true },
          { type: "set_clock", clock: { date: "2026-02-17", minuteOfDay: 7 * 60 + 30 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.before-pair-test"
      },
      {
        id: "sleep-early",
        label: "Dormir cedo e confiar no que já sabe",
        conditions: [],
        effects: [
          { type: "condition", condition: "energy", delta: 18 },
          { type: "condition", condition: "stress", delta: -5 },
          { type: "condition", condition: "health", delta: 2 },
          { type: "flag", flag: "restedBeforeTests", value: true },
          { type: "set_clock", clock: { date: "2026-02-17", minuteOfDay: 7 * 60 + 30 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.before-pair-test"
      },
      {
        id: "scroll-late",
        label: "Passar boa parte da noite no celular",
        conditions: [],
        effects: [
          { type: "condition", condition: "energy", delta: 4 },
          { type: "condition", condition: "stress", delta: 7 },
          { type: "attribute", attribute: "selfControl", delta: -3 },
          { type: "flag", flag: "sleptLate", value: true },
          { type: "set_clock", clock: { date: "2026-02-17", minuteOfDay: 7 * 60 + 30 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.before-pair-test"
      }
    ]
  },
{
    id: "prologue.before-pair-test",
    moduleId: "prologue.first-week",
    title: "A prova em dupla",
    text: "A professora de Matemática avisa que a prova começa às 08:20 e forma as duplas. Você fará a atividade com {groupMateName}.",
    activity: "Aguardar a prova em dupla",
    nextCommitment: S.PAIR_TEST,
    contextPersonIds: [S.GROUP],
    choices: [
      {
        id: "prepare-pair",
        label: "Combinar como vocês vão dividir as questões",
        conditions: [],
        effects: [
          { type: "relationship", personId: S.GROUP, dimension: "trust", delta: 1 },
          { type: "set_clock", clock: S.PAIR_TEST.clock }
        ],
        nextNodeId: "prologue.pair-test"
      },
      {
        id: "review-alone",
        label: "Revisar sozinho até a prova começar",
        conditions: [],
        effects: [
          { type: "knowledge", knowledge: "mathematics", delta: 1 },
          { type: "set_clock", clock: S.PAIR_TEST.clock }
        ],
        nextNodeId: "prologue.pair-test"
      }
    ]
  },
{
    id: "prologue.pair-test",
    moduleId: "prologue.first-week",
    title: "Duas pessoas, uma nota",
    text: "A prova começa. Algumas questões parecem familiares; outras exigem que vocês conversem sem perder tempo.",
    activity: "Fazer a prova em dupla",
    nextCommitment: { label: "Fim das aulas", clock: { date: "2026-02-17", minuteOfDay: 12 * 60 } },
    choices: [
      {
        id: "solve-together",
        label: "Resolver as questões em conjunto",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 50 },
          { type: "attribute", attribute: "communication", delta: 2 },
          { type: "knowledge", knowledge: "mathematics", delta: 2 },
          { type: "relationship", personId: S.GROUP, dimension: "trust", delta: 2 },
          { type: "flag", flag: "pairTestTogether", value: true }
        ],
        nextNodeId: "prologue.social-transition"
      },
      {
        id: "take-over-test",
        label: "Assumir quase todas as questões",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 50 },
          { type: "knowledge", knowledge: "mathematics", delta: 2 },
          { type: "condition", condition: "stress", delta: 4 },
          { type: "relationship", personId: S.GROUP, dimension: "tension", delta: 3 }
        ],
        nextNodeId: "prologue.social-transition"
      },
      {
        id: "copy-answer",
        label: "Aceitar uma resposta que vocês não conseguem justificar",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 50 },
          { type: "reputation", delta: -1 },
          { type: "flag", flag: "usedDishonestAnswer", value: true },
          {
            type: "add_memory",
            personId: S.GROUP,
            memory: {
              id: "shared-risk-in-test",
              summary: "Vocês aceitaram juntos uma resposta que não conseguiam justificar durante a prova.",
              kind: "academic",
              intensity: 5,
              resolved: false,
              tags: ["school", "test", "shared-risk"]
            }
          }
        ],
        nextNodeId: "prologue.social-transition"
      }
    ]
  },
{
    id: "prologue.social-transition",
    moduleId: "prologue.first-week",
    title: "O convite depois da aula",
    text: "Quando as aulas acabam, {friendName} convida você para ir ao {socialDestination}. Ao mesmo tempo, chega uma mensagem lembrando que você precisa {familyDuty}.",
    activity: "Conciliar lazer e responsabilidade",
    nextCommitment: S.PRESENTATION,
    contextPersonIds: [S.FRIEND],
    choices: [
      {
        id: "accept-by-bus",
        label: "Aceitar o convite e ir de ônibus",
        conditions: [{ type: "money", operator: ">=", valueCents: 1000 }],
        effects: [
          { type: "set_clock", clock: { date: "2026-02-17", minuteOfDay: 13 * 60 + 10 } },
          { type: "money", deltaCents: -1000 },
          { type: "set_location", location: "street" },
          { type: "relationship", personId: S.FRIEND, dimension: "closeness", delta: 4 },
          { type: "flag", flag: "acceptedSocialInvite", value: true },
          { type: "flag", flag: "neglectedFamilyDuty", value: true }
        ],
        nextNodeId: "prologue.after-social-choice"
      },
      {
        id: "accept-by-app",
        label: "Aceitar e chamar um carro para ganhar tempo",
        conditions: [{ type: "money", operator: ">=", valueCents: 3000 }],
        effects: [
          { type: "set_clock", clock: { date: "2026-02-17", minuteOfDay: 12 * 60 + 40 } },
          { type: "money", deltaCents: -3000 },
          { type: "set_location", location: "street" },
          { type: "relationship", personId: S.FRIEND, dimension: "closeness", delta: 4 },
          { type: "flag", flag: "acceptedSocialInvite", value: true },
          { type: "flag", flag: "usedRideApp", value: true }
        ],
        nextNodeId: "prologue.after-social-choice"
      },
      {
        id: "negotiate-time",
        label: "Negociar para encontrar o grupo por pouco tempo",
        conditions: [],
        effects: [
          { type: "set_clock", clock: { date: "2026-02-17", minuteOfDay: 12 * 60 + 30 } },
          { type: "attribute", attribute: "communication", delta: 2 },
          { type: "relationship", personId: S.FRIEND, dimension: "trust", delta: 2 },
          { type: "flag", flag: "negotiatedSocialTime", value: true }
        ],
        nextNodeId: "prologue.after-social-choice"
      },
      {
        id: "decline-and-explain",
        label: "Recusar e explicar que precisa {familyDuty}",
        conditions: [],
        effects: [
          { type: "set_clock", clock: { date: "2026-02-17", minuteOfDay: 12 * 60 + 25 } },
          { type: "set_location", location: "home" },
          { type: "relationship", personId: S.FRIEND, dimension: "trust", delta: 1 },
          { type: "condition", condition: "stress", delta: 2 },
          { type: "flag", flag: "fulfilledFamilyDuty", value: true }
        ],
        nextNodeId: "prologue.after-social-choice"
      },
      {
        id: "lie-and-go",
        label: "Mentir em casa e sair mesmo assim",
        conditions: [],
        effects: [
          { type: "set_clock", clock: { date: "2026-02-17", minuteOfDay: 13 * 60 } },
          { type: "set_location", location: "street" },
          { type: "relationship", personId: S.FRIEND, dimension: "closeness", delta: 5 },
          { type: "condition", condition: "stress", delta: 5 },
          { type: "flag", flag: "liedToFamily", value: true }
        ],
        nextNodeId: "prologue.after-social-choice"
      }
    ]
  },
{
    id: "prologue.after-social-choice",
    moduleId: "prologue.first-week",
    title: "O assunto corre pela turma",
    text: "No dia seguinte, uma história sobre suas escolhas começa a circular. {rivalName} repete uma versão exagerada, e algumas pessoas riem sem saber o que realmente aconteceu.",
    activity: "Lidar com uma fofoca",
    nextCommitment: S.PRESENTATION,
    contextPersonIds: [S.RIVAL, S.FRIEND, S.GROUP],
    choices: [
      {
        id: "talk-privately",
        label: "Conversar com {rivalName} em particular",
        conditions: [],
        effects: [
          { type: "relationship", personId: S.RIVAL, dimension: "tension", delta: -3 },
          { type: "attribute", attribute: "communication", delta: 2 },
          { type: "set_clock", clock: { date: "2026-02-18", minuteOfDay: 10 * 60 + 20 } }
        ],
        nextNodeId: "prologue.friday-transition"
      },
      {
        id: "ignore-gossip",
        label: "Ignorar e seguir o dia",
        conditions: [],
        effects: [
          { type: "condition", condition: "stress", delta: 2 },
          { type: "set_clock", clock: { date: "2026-02-18", minuteOfDay: 10 * 60 + 20 } }
        ],
        nextNodeId: "prologue.friday-transition"
      },
      {
        id: "answer-with-humor",
        label: "Responder com humor sem confirmar a história",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "communication", delta: 2 },
          { type: "reputation", delta: 1 },
          { type: "set_clock", clock: { date: "2026-02-18", minuteOfDay: 10 * 60 + 20 } }
        ],
        nextNodeId: "prologue.friday-transition"
      },
      {
        id: "public-confrontation",
        label: "Confrontar {rivalName} diante da turma",
        conditions: [],
        effects: [
          { type: "relationship", personId: S.RIVAL, dimension: "tension", delta: 8 },
          { type: "reputation", delta: -1 },
          { type: "set_clock", clock: { date: "2026-02-18", minuteOfDay: 10 * 60 + 20 } }
        ],
        nextNodeId: "prologue.conflict"
      },
      {
        id: "ask-coordination",
        label: "Pedir ajuda à coordenação para encerrar a exposição",
        conditions: [],
        effects: [
          { type: "reputation", delta: 1 },
          { type: "relationship", personId: S.RIVAL, dimension: "tension", delta: 3 },
          { type: "set_clock", clock: { date: "2026-02-18", minuteOfDay: 10 * 60 + 20 } }
        ],
        nextNodeId: "prologue.friday-transition"
      }
    ]
  }
];
