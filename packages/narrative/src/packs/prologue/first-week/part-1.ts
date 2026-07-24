import type { StoryNode } from "@vidas-possiveis/game-engine";
import * as S from "./shared";

export const firstWeekPart1: readonly StoryNode[] = [
{
    id: "prologue.wakeup",
    moduleId: "prologue.first-week",
    title: "O despertador",
    text: "O celular vibra às 06:10. Ainda parece cedo demais, mas a primeira aula começa às 07:30. Na cozinha há café e algo para levar. Você tem dinheiro para a semana, não para gastar sem pensar.",
    activity: "Preparar-se para a escola",
    nextCommitment: S.FIRST_CLASS,
    choices: [
      {
        id: "breakfast-bus",
        label: "Tomar café com calma e pegar o ônibus",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 65 },
          { type: "money", deltaCents: -500 },
          { type: "condition", condition: "energy", delta: 5 },
          { type: "set_location", location: "school" },
          { type: "flag", flag: "ateBreakfast", value: true },
          { type: "flag", flag: "usedBus", value: true }
        ],
        nextNodeId: "prologue.before-class"
      },
      {
        id: "quick-breakfast-early-bus",
        label: "Comer rapidamente e pegar o ônibus anterior",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 55 },
          { type: "money", deltaCents: -500 },
          { type: "condition", condition: "energy", delta: 3 },
          { type: "set_location", location: "school" },
          { type: "flag", flag: "ateBreakfast", value: true },
          { type: "flag", flag: "usedBus", value: true }
        ],
        nextNodeId: "prologue.before-class"
      },
      {
        id: "sleep-and-app",
        label: "Dormir mais vinte minutos e chamar um carro",
        conditions: [{ type: "money", operator: ">=", valueCents: 2200 }],
        effects: [
          { type: "advance_time", minutes: 60 },
          { type: "money", deltaCents: -2200 },
          { type: "condition", condition: "energy", delta: 2 },
          { type: "set_location", location: "school" },
          { type: "flag", flag: "usedRideApp", value: true }
        ],
        nextNodeId: "prologue.before-class"
      },
      {
        id: "skip-breakfast-bus",
        label: "Sair sem comer e pegar o ônibus",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 50 },
          { type: "money", deltaCents: -500 },
          { type: "condition", condition: "energy", delta: -5 },
          { type: "set_location", location: "school" },
          { type: "flag", flag: "usedBus", value: true }
        ],
        nextNodeId: "prologue.before-class"
      }
    ]
  },
{
    id: "prologue.before-class",
    moduleId: "prologue.first-week",
    title: "Antes do sinal",
    text: "Você chegou antes do início da aula. Há tempo para revisar uma anotação, conversar com {friendName} ou apenas respirar antes de entrar.",
    activity: "Aguardar o início da aula",
    nextCommitment: S.FIRST_CLASS,
    contextPersonIds: [S.FRIEND],
    choices: [
      {
        id: "review-before-class",
        label: "Revisar Português até o sinal",
        conditions: [],
        effects: [
          { type: "knowledge", knowledge: "portuguese", delta: 1 },
          { type: "set_clock", clock: S.FIRST_CLASS.clock }
        ],
        nextNodeId: "prologue.assignment"
      },
      {
        id: "talk-before-class",
        label: "Conversar com {friendName}",
        conditions: [],
        effects: [
          { type: "relationship", personId: S.FRIEND, dimension: "closeness", delta: 2 },
          {
            type: "add_memory",
            personId: S.FRIEND,
            memory: {
              id: "talked-before-first-class",
              summary: "Vocês conversaram antes da primeira aula e começaram a manhã juntos.",
              kind: "shared_leisure",
              intensity: 2,
              resolved: true,
              tags: ["school", "friendship"]
            }
          },
          { type: "set_clock", clock: S.FIRST_CLASS.clock }
        ],
        nextNodeId: "prologue.assignment"
      },
      {
        id: "wait-quietly",
        label: "Esperar em silêncio e guardar energia",
        conditions: [],
        effects: [
          { type: "condition", condition: "stress", delta: -1 },
          { type: "set_clock", clock: S.FIRST_CLASS.clock }
        ],
        nextNodeId: "prologue.assignment"
      }
    ]
  },
{
    id: "prologue.assignment",
    moduleId: "prologue.first-week",
    title: "O trabalho que vale o bimestre",
    text: "A professora de Português anuncia um trabalho sobre histórias que mudam uma comunidade. A apresentação será na sexta-feira, às 08:00. O sorteio coloca {groupMateName} no seu grupo.",
    activity: "Conhecer o grupo do trabalho",
    nextCommitment: S.INTERVAL,
    contextPersonIds: [S.GROUP],
    choices: [
      {
        id: "ask-preference",
        label: "Perguntar qual parte {groupMateName} prefere fazer",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "communication", delta: 1 },
          { type: "relationship", personId: S.GROUP, dimension: "trust", delta: 1 },
          { type: "set_clock", clock: S.INTERVAL.clock }
        ],
        nextNodeId: "prologue.interval"
      },
      {
        id: "organize-immediately",
        label: "Assumir a organização e distribuir as partes",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "selfControl", delta: 1 },
          { type: "relationship", personId: S.GROUP, dimension: "tension", delta: 1 },
          { type: "flag", flag: "organizedFromStart", value: true },
          { type: "set_clock", clock: S.INTERVAL.clock }
        ],
        nextNodeId: "prologue.interval"
      },
      {
        id: "wait-group",
        label: "Esperar outra pessoa tomar a iniciativa",
        conditions: [],
        effects: [
          { type: "condition", condition: "stress", delta: -1 },
          { type: "set_clock", clock: S.INTERVAL.clock }
        ],
        nextNodeId: "prologue.interval"
      }
    ]
  },
{
    id: "prologue.interval",
    moduleId: "prologue.first-week",
    title: "Vinte minutos de intervalo",
    text: "O cheiro da merenda chega antes de você alcançar o pátio. Do outro lado, a lanchonete vende salgados e sanduíches. O dinheiro gasto agora pode fazer falta no transporte ou no passeio depois da aula.",
    activity: "Escolher o que comer",
    nextCommitment: S.PHYSICAL_EDUCATION,
    choices: [
      {
        id: "school-meal",
        label: "Comer a merenda da escola",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 20 },
          { type: "condition", condition: "energy", delta: 7 },
          { type: "condition", condition: "health", delta: 1 },
          { type: "flag", flag: "ateSchoolMeal", value: true }
        ],
        nextNodeId: "prologue.physical-education"
      },
      {
        id: "canteen-snack",
        label: "Comprar um lanche na lanchonete",
        conditions: [{ type: "money", operator: ">=", valueCents: 1200 }],
        effects: [
          { type: "advance_time", minutes: 20 },
          { type: "money", deltaCents: -1200 },
          { type: "condition", condition: "energy", delta: 9 },
          { type: "relationship", personId: S.FRIEND, dimension: "closeness", delta: 1 },
          { type: "flag", flag: "boughtCanteenSnack", value: true }
        ],
        nextNodeId: "prologue.physical-education"
      },
      {
        id: "share-snack",
        label: "Comprar algo e dividir com {friendName}",
        conditions: [{ type: "money", operator: ">=", valueCents: 1800 }],
        effects: [
          { type: "advance_time", minutes: 20 },
          { type: "money", deltaCents: -1800 },
          { type: "condition", condition: "energy", delta: 7 },
          { type: "relationship", personId: S.FRIEND, dimension: "trust", delta: 2 },
          { type: "relationship", personId: S.FRIEND, dimension: "closeness", delta: 2 },
          {
            type: "add_memory",
            personId: S.FRIEND,
            memory: {
              id: "shared-snack",
              summary: "Você dividiu o lanche com {friendName} durante o intervalo.",
              kind: "shared_leisure",
              intensity: 3,
              resolved: true,
              tags: ["school", "food", "friendship"]
            }
          }
        ],
        nextNodeId: "prologue.physical-education"
      },
      {
        id: "skip-food",
        label: "Não comer e guardar o dinheiro",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 20 },
          { type: "condition", condition: "energy", delta: -5 },
          { type: "flag", flag: "skippedIntervalFood", value: true }
        ],
        nextNodeId: "prologue.physical-education"
      }
    ]
  },
{
    id: "prologue.physical-education",
    moduleId: "prologue.first-week",
    title: "A quadra e o {peActivity}",
    text: "A professora organiza uma atividade de {peActivity}. A fome, o descanso e a disposição da manhã começam a aparecer no corpo.",
    activity: "Participar da Educação Física",
    nextCommitment: { label: "Próxima aula", clock: { date: "2026-02-16", minuteOfDay: 11 * 60 + 10 } },
    choices: [
      {
        id: "participate-seriously",
        label: "Participar com dedicação",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 50 },
          { type: "attribute", attribute: "vigor", delta: 2 },
          { type: "attribute", attribute: "agility", delta: 2 },
          { type: "condition", condition: "energy", delta: -9 },
          { type: "reputation", delta: 1 }
        ],
        nextNodeId: "prologue.class-gap"
      },
      {
        id: "participate-lightly",
        label: "Participar sem gastar tanta energia",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 50 },
          { type: "attribute", attribute: "agility", delta: 1 },
          { type: "condition", condition: "energy", delta: -4 }
        ],
        nextNodeId: "prologue.class-gap"
      },
      {
        id: "help-classmate",
        label: "Ajudar alguém com dificuldade na atividade",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 50 },
          { type: "attribute", attribute: "communication", delta: 2 },
          { type: "relationship", personId: S.GROUP, dimension: "closeness", delta: 2 },
          { type: "condition", condition: "energy", delta: -6 }
        ],
        nextNodeId: "prologue.class-gap"
      },
      {
        id: "sit-out",
        label: "Ficar de fora e observar",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 50 },
          { type: "condition", condition: "energy", delta: 1 },
          { type: "reputation", delta: -1 }
        ],
        nextNodeId: "prologue.class-gap"
      }
    ]
  },
{
    id: "prologue.class-gap",
    moduleId: "prologue.first-week",
    title: "A aula que não aconteceu",
    text: "O professor falta. Um substituto chega, mas a turma percebe que ele ainda não conhece ninguém. {friendName} sugere sair da escola e ir ao {socialDestination} antes que alguém note.",
    activity: "Decidir o que fazer no horário vago",
    nextCommitment: S.SCHOOL_END,
    contextPersonIds: [S.FRIEND, S.RIVAL],
    choices: [
      {
        id: "stay-and-work",
        label: "Ficar na sala e avançar o trabalho",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 50 },
          { type: "knowledge", knowledge: "portuguese", delta: 2 },
          { type: "attribute", attribute: "selfControl", delta: 1 },
          { type: "flag", flag: "usedFreeClassForWork", value: true }
        ],
        nextNodeId: "prologue.afternoon-transition"
      },
      {
        id: "talk-in-class",
        label: "Ficar e conversar com a turma",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 50 },
          { type: "relationship", personId: S.FRIEND, dimension: "closeness", delta: 2 },
          { type: "relationship", personId: S.RIVAL, dimension: "tension", delta: -1 }
        ],
        nextNodeId: "prologue.afternoon-transition"
      },
      {
        id: "leave-school",
        label: "Sair escondido com {friendName}",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 50 },
          { type: "set_location", location: "street" },
          { type: "reputation", delta: -2 },
          { type: "relationship", personId: S.FRIEND, dimension: "closeness", delta: 4 },
          { type: "flag", flag: "skippedClass", value: true },
          {
            type: "add_memory",
            personId: S.FRIEND,
            memory: {
              id: "left-school-together",
              summary: "Você e {friendName} saíram escondidos da escola durante uma aula vaga.",
              kind: "shared_leisure",
              intensity: 6,
              resolved: false,
              tags: ["school", "absence", "secret"]
            }
          }
        ],
        nextNodeId: "prologue.afternoon-transition"
      },
      {
        id: "support-substitute",
        label: "Ajudar o professor substituto a organizar a sala",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 50 },
          { type: "attribute", attribute: "communication", delta: 2 },
          { type: "reputation", delta: 2 },
          { type: "relationship", personId: S.RIVAL, dimension: "tension", delta: 2 }
        ],
        nextNodeId: "prologue.afternoon-transition"
      }
    ]
  }
];
