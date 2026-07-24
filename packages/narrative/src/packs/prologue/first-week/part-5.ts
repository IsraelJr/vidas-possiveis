import type { StoryNode } from "@vidas-possiveis/game-engine";
import * as S from "./shared";

export const firstWeekPart5: readonly StoryNode[] = [
{
    id: "prologue.presentation",
    moduleId: "prologue.first-week",
    title: "A turma olha para você",
    text: "O projetor acende. A professora chama seu grupo e a sala fica em silêncio.",
    activity: "Apresentar o trabalho",
    nextCommitment: { label: "Conversa após a apresentação", clock: { date: "2026-02-20", minuteOfDay: 10 * 60 } },
    choices: [
      {
        id: "lead-presentation",
        label: "Abrir a apresentação e conduzir o grupo",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 25 },
          { type: "condition", condition: "energy", delta: -4 }
        ],
        nextNodeId: "prologue.presentation-mixed",
        skillCheck: {
          eventId: "prologue-presentation-lead",
          attribute: "communication",
          difficulty: 55,
          bonusFlags: [
            { flag: "preparedAssignment", label: "Material preparado", value: 8 },
            { flag: "lastReview", label: "Revisão final", value: 6 },
            { flag: "calmedGroup", label: "Grupo mais tranquilo", value: 4 },
            { flag: "lateForPresentation", label: "Atraso", value: -10 }
          ],
          outcomes: S.presentationOutcomes
        }
      },
      {
        id: "support-group-mate",
        label: "Convidar {groupMateName} para começar e apoiar a fala",
        conditions: [
          { type: "relationship", personId: S.GROUP, dimension: "trust", operator: ">=", value: 25 }
        ],
        effects: [
          { type: "advance_time", minutes: 25 },
          { type: "relationship", personId: S.GROUP, dimension: "closeness", delta: 2 }
        ],
        nextNodeId: "prologue.presentation-mixed",
        skillCheck: {
          eventId: "prologue-presentation-partner",
          attribute: "communication",
          difficulty: 50,
          bonusFlags: [
            { flag: "sharedPlan", label: "Plano do grupo", value: 7 },
            { flag: "promisedHelp", label: "Ajuda anterior", value: 4 },
            { flag: "calmedGroup", label: "Conversa antes de começar", value: 5 },
            { flag: "lateForPresentation", label: "Atraso", value: -10 }
          ],
          outcomes: S.presentationOutcomes
        }
      },
      {
        id: "follow-notes",
        label: "Seguir as anotações e explicar a parte mais segura",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 25 },
          { type: "condition", condition: "energy", delta: -2 }
        ],
        nextNodeId: "prologue.presentation-mixed",
        skillCheck: {
          eventId: "prologue-presentation-notes",
          attribute: "reasoning",
          difficulty: 52,
          bonusFlags: [
            { flag: "preparedAssignment", label: "Material preparado", value: 10 },
            { flag: "lastReview", label: "Revisão final", value: 5 },
            { flag: "studiedForPairTest", label: "Rotina de estudo", value: 3 },
            { flag: "lateForPresentation", label: "Atraso", value: -10 }
          ],
          outcomes: S.presentationOutcomes
        }
      }
    ]
  },
{
    id: "prologue.presentation-hard",
    moduleId: "prologue.first-week",
    title: "Uma apresentação difícil",
    text: "A fala se perde, a professora precisa fazer perguntas básicas e o grupo termina frustrado. Ainda existe recuperação, mas o resultado terá consequência.",
    activity: "Entender o que aconteceu",
    nextCommitment: { label: "Fim das aulas", clock: { date: "2026-02-20", minuteOfDay: 12 * 60 } },
    choices: [
      {
        id: "continue-after-hard",
        label: "Conversar com o grupo depois da aula",
        conditions: [],
        effects: [{ type: "set_clock", clock: { date: "2026-02-20", minuteOfDay: 12 * 60 } }],
        nextNodeId: "prologue.group-aftermath"
      }
    ]
  },
{
    id: "prologue.presentation-mixed",
    moduleId: "prologue.first-week",
    title: "Vocês conseguiram atravessar",
    text: "Algumas partes funcionam e outras parecem improvisadas. A professora reconhece o esforço, mas aponta claramente onde o grupo perdeu tempo.",
    activity: "Ouvir a avaliação da professora",
    nextCommitment: { label: "Fim das aulas", clock: { date: "2026-02-20", minuteOfDay: 12 * 60 } },
    choices: [
      {
        id: "continue-after-mixed",
        label: "Conversar com o grupo depois da aula",
        conditions: [],
        effects: [{ type: "set_clock", clock: { date: "2026-02-20", minuteOfDay: 12 * 60 } }],
        nextNodeId: "prologue.group-aftermath"
      }
    ]
  },
{
    id: "prologue.presentation-strong",
    moduleId: "prologue.first-week",
    title: "A sala presta atenção",
    text: "O grupo encontra ritmo, responde às perguntas e termina com segurança. A professora elogia a conexão entre as partes.",
    activity: "Aproveitar o bom resultado",
    nextCommitment: { label: "Fim das aulas", clock: { date: "2026-02-20", minuteOfDay: 12 * 60 } },
    choices: [
      {
        id: "continue-after-strong",
        label: "Conversar com o grupo depois da aula",
        conditions: [],
        effects: [{ type: "set_clock", clock: { date: "2026-02-20", minuteOfDay: 12 * 60 } }],
        nextNodeId: "prologue.group-aftermath"
      }
    ]
  },
{
    id: "prologue.group-aftermath",
    moduleId: "prologue.first-week",
    title: "Depois da nota",
    text: "{groupMateName} espera sua reação. O trabalho terminou, mas a relação entre vocês não precisa terminar junto.",
    activity: "Definir o que fica dessa relação",
    contextPersonIds: [S.GROUP],
    choices: [
      {
        id: "keep-close-contact",
        label: "Dizer que gostaria de manter contato e fazer outras coisas juntos",
        conditions: [],
        effects: [
          { type: "relationship", personId: S.GROUP, dimension: "trust", delta: 3 },
          { type: "relationship", personId: S.GROUP, dimension: "closeness", delta: 5 },
          { type: "set_person_category", personId: S.GROUP, category: "important" },
          { type: "set_clock", clock: { date: "2026-03-20", minuteOfDay: 10 * 60 } },
          { type: "set_location", location: "school" },
          {
            type: "add_memory",
            personId: S.GROUP,
            memory: {
              id: "relationship-became-important",
              summary: "Depois do trabalho, vocês decidiram manter uma relação mais próxima.",
              kind: "reconciliation",
              intensity: 7,
              resolved: true,
              tags: ["school", "relationship", "important"]
            }
          }
        ],
        nextNodeId: "prologue.module-academic"
      },
      {
        id: "stay-respectful",
        label: "Encerrar o trabalho com respeito, sem prometer proximidade",
        conditions: [],
        effects: [
          { type: "relationship", personId: S.GROUP, dimension: "tension", delta: -2 },
          { type: "set_person_category", personId: S.GROUP, category: "known" },
          { type: "set_clock", clock: { date: "2026-03-20", minuteOfDay: 10 * 60 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.module-academic"
      },
      {
        id: "take-distance",
        label: "Deixar claro que prefere se afastar",
        conditions: [],
        effects: [
          { type: "relationship", personId: S.GROUP, dimension: "closeness", delta: -4 },
          { type: "set_person_presence", personId: S.GROUP, presence: "distant" },
          { type: "set_clock", clock: { date: "2026-03-20", minuteOfDay: 10 * 60 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.module-academic"
      }
    ]
  }
];
