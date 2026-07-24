import type { StoryNode } from "@vidas-possiveis/game-engine";
import * as S from "./shared";

export const firstWeekPart2: readonly StoryNode[] = [
{
    id: "prologue.afternoon-transition",
    moduleId: "prologue.first-week",
    title: "O restante do dia",
    text: "As aulas terminam. Entre almoço, transporte e tarefas de casa, o relógio avança. Às 16:00, o grupo do trabalho começa a mandar mensagens.",
    activity: "Voltar para casa e seguir a rotina",
    nextCommitment: S.GROUP_CHAT,
    choices: [
      {
        id: "reach-afternoon",
        label: "Abrir as mensagens do grupo às 16:00",
        conditions: [],
        effects: [
          { type: "set_clock", clock: S.GROUP_CHAT.clock },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.group-message"
      }
    ]
  },
{
    id: "prologue.group-message",
    moduleId: "prologue.first-week",
    title: "Uma mensagem de {groupMateName}",
    text: "{groupMateName} diz que não conseguiu terminar a parte combinada. Uma pessoa do grupo quer retirar o nome {groupMateObject} do trabalho. Antes de decidir, você pode relembrar quem é essa pessoa.",
    activity: "Entender o problema do grupo",
    nextCommitment: S.PRESENTATION,
    contextPersonIds: [S.GROUP],
    choices: [
      {
        id: "ask-what-happened",
        label: "Perguntar o que aconteceu antes de decidir",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 10 },
          { type: "attribute", attribute: "perception", delta: 1 }
        ],
        nextNodeId: "prologue.group-explanation"
      },
      {
        id: "go-straight-to-decision",
        label: "Decidir com base no que você já sabe",
        conditions: [],
        effects: [{ type: "advance_time", minutes: 5 }],
        nextNodeId: "prologue.group-explanation"
      }
    ]
  },
{
    id: "prologue.group-explanation",
    moduleId: "prologue.first-week",
    title: "O que aconteceu",
    text: "{groupMateName} explica que {groupMateIssue}. O passado entre vocês continua existindo, mas agora há uma situação concreta para enfrentar.",
    activity: "Decidir como lidar com {groupMateName}",
    nextCommitment: S.PRESENTATION,
    contextPersonIds: [S.GROUP],
    choices: [
      {
        id: "help-group-mate",
        label: "Ajudar {groupMateName} e assumir parte do que falta",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 45 },
          { type: "condition", condition: "energy", delta: -7 },
          { type: "relationship", personId: S.GROUP, dimension: "trust", delta: 5 },
          { type: "relationship", personId: S.GROUP, dimension: "closeness", delta: 3 },
          { type: "flag", flag: "promisedHelp", value: true },
          {
            type: "add_memory",
            personId: S.GROUP,
            memory: {
              id: "helped-with-assignment",
              summary: "Você ajudou {groupMateName} quando a parte do trabalho não ficou pronta.",
              kind: "help",
              intensity: 6,
              resolved: true,
              tags: ["school", "assignment", "help"]
            }
          },
          {
            type: "schedule_consequence",
            consequenceId: "help-cost",
            delayMinutes: 720,
            title: "O custo da ajuda",
            text: "A parte extra tomou mais tempo do que parecia. Você está cansado, mas {groupMateName} sabe que pôde contar com você.",
            effects: [
              { type: "condition", condition: "energy", delta: -5 },
              { type: "condition", condition: "stress", delta: 5 },
              { type: "relationship", personId: S.GROUP, dimension: "trust", delta: 2 }
            ]
          }
        ],
        nextNodeId: "prologue.work-location"
      },
      {
        id: "make-clear-plan",
        label: "Manter {groupMateName} no grupo com um plano e um prazo claros",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 25 },
          { type: "attribute", attribute: "communication", delta: 3 },
          { type: "attribute", attribute: "selfControl", delta: 2 },
          { type: "relationship", personId: S.GROUP, dimension: "trust", delta: 3 },
          { type: "relationship", personId: S.GROUP, dimension: "tension", delta: -2 },
          { type: "flag", flag: "sharedPlan", value: true },
          {
            type: "add_memory",
            personId: S.GROUP,
            memory: {
              id: "clear-group-plan",
              summary: "Você organizou um plano para que {groupMateName} continuasse no grupo e cumprisse um novo prazo.",
              kind: "shared_work",
              intensity: 5,
              resolved: false,
              tags: ["school", "assignment", "plan"]
            }
          }
        ],
        nextNodeId: "prologue.work-location"
      },
      {
        id: "last-chance",
        label: "Dar uma última chance e cobrar a entrega até a noite",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 15 },
          { type: "relationship", personId: S.GROUP, dimension: "tension", delta: 1 },
          { type: "flag", flag: "gaveLastChance", value: true },
          {
            type: "schedule_consequence",
            consequenceId: "last-chance-result",
            delayMinutes: 240,
            title: "O prazo terminou",
            text: "{groupMateName} envia uma parte incompleta, mas melhor do que antes. A situação ainda exige trabalho do grupo.",
            effects: [
              { type: "relationship", personId: S.GROUP, dimension: "trust", delta: 1 },
              { type: "condition", condition: "stress", delta: 2 }
            ]
          }
        ],
        nextNodeId: "prologue.work-location"
      },
      {
        id: "remove-group-mate",
        label: "Concordar em retirar {groupMateName} do trabalho",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 10 },
          { type: "relationship", personId: S.GROUP, dimension: "trust", delta: -7 },
          { type: "relationship", personId: S.GROUP, dimension: "tension", delta: 9 },
          { type: "flag", flag: "removedGroupMate", value: true },
          {
            type: "add_memory",
            personId: S.GROUP,
            memory: {
              id: "removed-from-assignment",
              summary: "Você concordou em retirar {groupMateName} do trabalho do bimestre.",
              kind: "conflict",
              intensity: 8,
              resolved: false,
              tags: ["school", "assignment", "exclusion"]
            }
          }
        ],
        nextNodeId: "prologue.work-location"
      },
      {
        id: "humiliate-group-mate",
        label: "Expor {groupMateName} no grupo e fazer uma piada",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 10 },
          { type: "reputation", delta: -2 },
          { type: "relationship", personId: S.GROUP, dimension: "trust", delta: -8 },
          { type: "relationship", personId: S.GROUP, dimension: "tension", delta: 12 },
          { type: "flag", flag: "humiliatedGroupMate", value: true },
          {
            type: "add_memory",
            personId: S.GROUP,
            memory: {
              id: "public-humiliation",
              summary: "Você expôs {groupMateName} e fez uma piada diante do grupo.",
              kind: "humiliation",
              intensity: 10,
              resolved: false,
              tags: ["school", "humiliation", "group-chat"]
            }
          }
        ],
        nextNodeId: "prologue.work-location"
      }
    ]
  },
{
    id: "prologue.work-location",
    moduleId: "prologue.first-week",
    title: "Onde terminar o trabalho",
    text: "O grupo ainda precisa juntar pesquisa, texto e apresentação. O local escolhido mudará o tempo disponível e o nível de convivência.",
    activity: "Escolher onde trabalhar",
    nextCommitment: S.PRESENTATION,
    choices: [
      {
        id: "work-at-home",
        label: "Levar o grupo para sua casa",
        conditions: [],
        effects: [
          { type: "set_clock", clock: { date: "2026-02-16", minuteOfDay: 18 * 60 } },
          { type: "set_location", location: "home" },
          { type: "flag", flag: "groupAtHome", value: true }
        ],
        nextNodeId: "prologue.work-session"
      },
      {
        id: "work-at-library",
        label: "Encontrar o grupo na biblioteca",
        conditions: [],
        effects: [
          { type: "set_clock", clock: { date: "2026-02-16", minuteOfDay: 18 * 60 + 30 } },
          { type: "set_location", location: "library" },
          { type: "money", deltaCents: -500 },
          { type: "flag", flag: "usedLibrary", value: true }
        ],
        nextNodeId: "prologue.work-session"
      },
      {
        id: "video-call",
        label: "Fazer uma chamada de vídeo de casa",
        conditions: [{ type: "flag", flag: "hasComputer", value: true }],
        effects: [
          { type: "set_clock", clock: { date: "2026-02-16", minuteOfDay: 18 * 60 } },
          { type: "set_location", location: "home" },
          { type: "flag", flag: "usedVideoCall", value: true }
        ],
        nextNodeId: "prologue.work-session"
      },
      {
        id: "work-alone",
        label: "Fazer sua parte sozinho e enviar depois",
        conditions: [],
        effects: [
          { type: "set_clock", clock: { date: "2026-02-16", minuteOfDay: 18 * 60 } },
          { type: "set_location", location: "home" },
          { type: "condition", condition: "stress", delta: 4 },
          { type: "flag", flag: "workedAlone", value: true }
        ],
        nextNodeId: "prologue.work-session"
      }
    ]
  },
{
    id: "prologue.work-session",
    moduleId: "prologue.first-week",
    title: "Trabalho, conversa e distração",
    text: "No começo, todos abrem cadernos e pesquisas. Depois de algum tempo, alguém coloca música e a conversa começa a tomar espaço.",
    activity: "Preparar o trabalho em grupo",
    nextCommitment: S.PRESENTATION,
    contextPersonIds: [S.GROUP, S.FRIEND],
    choices: [
      {
        id: "keep-focused",
        label: "Manter o encontro focado até terminar",
        conditions: [],
        effects: [
          { type: "set_clock", clock: { date: "2026-02-16", minuteOfDay: 20 * 60 + 30 } },
          { type: "knowledge", knowledge: "portuguese", delta: 4 },
          { type: "attribute", attribute: "selfControl", delta: 2 },
          { type: "condition", condition: "energy", delta: -8 },
          { type: "flag", flag: "preparedAssignment", value: true }
        ],
        nextNodeId: "prologue.night-plan"
      },
      {
        id: "short-break",
        label: "Fazer uma pausa curta e voltar ao trabalho",
        conditions: [],
        effects: [
          { type: "set_clock", clock: { date: "2026-02-16", minuteOfDay: 20 * 60 + 30 } },
          { type: "knowledge", knowledge: "portuguese", delta: 3 },
          { type: "relationship", personId: S.GROUP, dimension: "closeness", delta: 2 },
          { type: "condition", condition: "energy", delta: -5 },
          { type: "flag", flag: "preparedAssignment", value: true }
        ],
        nextNodeId: "prologue.night-plan"
      },
      {
        id: "social-evening",
        label: "Deixar o encontro virar uma reunião mais social",
        conditions: [],
        effects: [
          { type: "set_clock", clock: { date: "2026-02-16", minuteOfDay: 21 * 60 + 15 } },
          { type: "relationship", personId: S.GROUP, dimension: "closeness", delta: 4 },
          { type: "relationship", personId: S.FRIEND, dimension: "closeness", delta: 3 },
          { type: "condition", condition: "stress", delta: -3 },
          { type: "flag", flag: "preparedAssignment", value: false },
          { type: "flag", flag: "socialStudyNight", value: true }
        ],
        nextNodeId: "prologue.night-plan"
      }
    ]
  }
];
