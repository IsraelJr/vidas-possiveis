import type { StoryNode } from "@vidas-possiveis/game-engine";
import { PROLOGUE_PERSON_IDS } from "./cast";

const GROUP = PROLOGUE_PERSON_IDS.groupMate;
const FRIEND = PROLOGUE_PERSON_IDS.friend;

export const twoYearTransitionNodes: readonly StoryNode[] = [
  {
    id: "prologue.second-year-vocational-review",
    moduleId: "prologue.second-year-transition",
    title: "O que você levou até o fim do ano",
    text: "As últimas provas acabam, mas o ano não cabe apenas nas notas. Entre escola, casa, amigos e cansaço, algumas atividades começaram a parecer mais do que passatempo. Agora você precisa decidir o que continuará ocupando espaço quando as aulas pararem.",
    activity: "Rever interesses e compromissos do segundo ano",
    nextCommitment: {
      label: "Encerramento do segundo ano",
      clock: { date: "2026-12-18", minuteOfDay: 15 * 60 }
    },
    choices: [
      {
        id: "continue-football-bridge",
        label: "Manter os treinos durante a semana e os jogos nos fins de semana",
        conditions: [{ type: "flag", flag: "footballLifeOwned", value: true }],
        effects: [
          { type: "flag", flag: "footballBridgeActive", value: true },
          { type: "flag", flag: "secondYearVocationalChoice", value: true },
          { type: "knowledge", knowledge: "ballControl", delta: 4 },
          { type: "knowledge", knowledge: "tactics", delta: 3 },
          { type: "condition", condition: "energy", delta: -4 },
          { type: "money", deltaCents: -2000 },
          { type: "set_clock", clock: { date: "2026-12-18", minuteOfDay: 15 * 60 } }
        ],
        nextNodeId: "prologue.second-year-close"
      },
      {
        id: "take-free-course",
        label: "Continuar um curso gratuito e explorar uma área com calma",
        conditions: [],
        effects: [
          { type: "flag", flag: "secondYearVocationalChoice", value: true },
          { type: "knowledge", knowledge: "technology", delta: 4 },
          { type: "attribute", attribute: "reasoning", delta: 1 },
          { type: "money", deltaCents: -1000 },
          { type: "set_clock", clock: { date: "2026-12-18", minuteOfDay: 15 * 60 } }
        ],
        nextNodeId: "prologue.second-year-close"
      },
      {
        id: "keep-temporary-work",
        label: "Usar parte das férias para trabalhar e guardar dinheiro",
        conditions: [],
        effects: [
          { type: "flag", flag: "secondYearVocationalChoice", value: true },
          { type: "flag", flag: "workedDuringVacation", value: true },
          { type: "money", deltaCents: 12000 },
          { type: "attribute", attribute: "selfControl", delta: 2 },
          { type: "condition", condition: "stress", delta: 4 },
          { type: "set_clock", clock: { date: "2026-12-18", minuteOfDay: 15 * 60 } }
        ],
        nextNodeId: "prologue.second-year-close"
      },
      {
        id: "leave-vacation-open",
        label: "Não assumir uma rotina fixa e recuperar o fôlego",
        conditions: [],
        effects: [
          { type: "condition", condition: "energy", delta: 6 },
          { type: "condition", condition: "stress", delta: -5 },
          { type: "set_clock", clock: { date: "2026-12-18", minuteOfDay: 15 * 60 } }
        ],
        nextNodeId: "prologue.second-year-close"
      }
    ]
  },
  {
    id: "prologue.second-year-close",
    moduleId: "prologue.second-year-transition",
    title: "O fim do segundo ano",
    text: "O sinal toca pela última vez naquele ano. Algumas pessoas já saem planejando janeiro; outras falam em manter contato como se dizer fosse suficiente. {groupMateName} continua perto, distante ou mal resolvido conforme o que vocês viveram. Você não termina o ano como começou, embora ainda seja difícil explicar exatamente o que mudou.",
    activity: "Encerrar o segundo ano do Ensino Médio",
    nextCommitment: {
      label: "Começo das férias",
      clock: { date: "2026-12-18", minuteOfDay: 17 * 60 }
    },
    contextPersonIds: [GROUP, FRIEND],
    choices: [
      {
        id: "leave-school-for-vacation",
        label: "Sair da escola e deixar o ano terminar",
        conditions: [],
        effects: [
          { type: "flag", flag: "completedSecondYear", value: true },
          { type: "set_location", location: "street" },
          { type: "set_clock", clock: { date: "2026-12-18", minuteOfDay: 17 * 60 } }
        ],
        nextNodeId: "prologue.vacation-transition"
      }
    ]
  },
  {
    id: "prologue.vacation-transition",
    moduleId: "prologue.vacation",
    title: "Quando a escola some",
    text: "Sem o sinal, os dias perdem a divisão que a escola impunha. Algumas pessoas continuam nas mensagens. Outras desaparecem depressa demais para quem, até dezembro, ocupava a cadeira ao lado. As férias abrem espaço, mas esse espaço também precisa ser decidido.",
    activity: "Viver as férias entre o segundo e o terceiro ano",
    nextCommitment: {
      label: "Primeiro dia do terceiro ano",
      clock: { date: "2027-02-08", minuteOfDay: 7 * 60 + 10 }
    },
    contextPersonIds: [GROUP, FRIEND],
    choices: [
      {
        id: "maintain-school-contact",
        label: "Procurar {groupMateName} e manter o contato fora da escola",
        conditions: [
          { type: "relationship", personId: GROUP, dimension: "tension", operator: "<=", value: 45 }
        ],
        effects: [
          { type: "relationship", personId: GROUP, dimension: "trust", delta: 3 },
          { type: "relationship", personId: GROUP, dimension: "closeness", delta: 4 },
          { type: "set_person_presence", personId: GROUP, presence: "active" },
          {
            type: "add_memory",
            personId: GROUP,
            memory: {
              id: "contact-during-vacation",
              summary: "Vocês mantiveram contato quando a convivência escolar deixou de ser obrigatória.",
              kind: "shared_leisure",
              intensity: 6,
              resolved: true,
              tags: ["vacation", "continuity", "2027-return"]
            }
          },
          { type: "set_clock", clock: { date: "2027-02-08", minuteOfDay: 7 * 60 + 10 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.third-year-opening"
      },
      {
        id: "stay-with-friend-circle",
        label: "Manter contato principalmente com {friendName}",
        conditions: [],
        effects: [
          { type: "relationship", personId: FRIEND, dimension: "trust", delta: 3 },
          { type: "relationship", personId: FRIEND, dimension: "closeness", delta: 5 },
          { type: "set_person_presence", personId: GROUP, presence: "distant" },
          { type: "set_clock", clock: { date: "2027-02-08", minuteOfDay: 7 * 60 + 10 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.third-year-opening"
      },
      {
        id: "work-through-vacation",
        label: "Priorizar o trabalho e responder quando houver tempo",
        conditions: [{ type: "flag", flag: "workedDuringVacation", value: true }],
        effects: [
          { type: "money", deltaCents: 18000 },
          { type: "attribute", attribute: "selfControl", delta: 2 },
          { type: "condition", condition: "stress", delta: 5 },
          { type: "set_person_presence", personId: GROUP, presence: "distant" },
          { type: "set_clock", clock: { date: "2027-02-08", minuteOfDay: 7 * 60 + 10 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.third-year-opening"
      },
      {
        id: "train-through-vacation",
        label: "Manter os treinos mesmo sem a rotina escolar",
        conditions: [{ type: "flag", flag: "footballBridgeActive", value: true }],
        effects: [
          { type: "knowledge", knowledge: "ballControl", delta: 5 },
          { type: "knowledge", knowledge: "tactics", delta: 4 },
          { type: "attribute", attribute: "vigor", delta: 2 },
          { type: "condition", condition: "energy", delta: -5 },
          { type: "flag", flag: "trainedDuringVacation", value: true },
          { type: "set_clock", clock: { date: "2027-02-08", minuteOfDay: 7 * 60 + 10 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.third-year-opening"
      },
      {
        id: "let-school-relations-rest",
        label: "Aceitar o silêncio e usar as férias para descansar",
        conditions: [],
        effects: [
          { type: "condition", condition: "energy", delta: 9 },
          { type: "condition", condition: "stress", delta: -9 },
          { type: "set_person_presence", personId: GROUP, presence: "distant" },
          { type: "set_person_presence", personId: FRIEND, presence: "distant" },
          { type: "set_clock", clock: { date: "2027-02-08", minuteOfDay: 7 * 60 + 10 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.third-year-opening"
      }
    ]
  },
  {
    id: "prologue.third-year-opening",
    moduleId: "prologue.third-year-opening",
    title: "A cadeira que ficou vazia",
    text: "A sala parece a mesma até você notar o que mudou. Uma cadeira está vazia, alguém escolheu outro lugar e certas conversas não recomeçam de onde pararam. No quadro, a data confirma o terceiro ano. O futuro ainda não entrou na sala, mas todo mundo já fala como se ele estivesse atrasado.",
    activity: "Escolher onde começar o terceiro ano",
    nextCommitment: {
      label: "Primeira aula do terceiro ano",
      clock: { date: "2027-02-08", minuteOfDay: 7 * 60 + 30 }
    },
    contextPersonIds: [GROUP, FRIEND],
    choices: [
      {
        id: "sit-with-group-mate",
        label: "Sentar perto de {groupMateName} e observar como vocês estão agora",
        conditions: [
          { type: "relationship", personId: GROUP, dimension: "tension", operator: "<=", value: 50 }
        ],
        effects: [
          { type: "relationship", personId: GROUP, dimension: "closeness", delta: 2 },
          { type: "set_person_presence", personId: GROUP, presence: "active" },
          { type: "set_clock", clock: { date: "2027-02-08", minuteOfDay: 7 * 60 + 30 } }
        ],
        nextNodeId: "prologue.third-year-deadline"
      },
      {
        id: "sit-with-friend",
        label: "Sentar com {friendName} e recuperar a conversa",
        conditions: [],
        effects: [
          { type: "relationship", personId: FRIEND, dimension: "closeness", delta: 2 },
          { type: "set_person_presence", personId: FRIEND, presence: "active" },
          { type: "set_clock", clock: { date: "2027-02-08", minuteOfDay: 7 * 60 + 30 } }
        ],
        nextNodeId: "prologue.third-year-deadline"
      },
      {
        id: "choose-new-seat",
        label: "Escolher outro lugar e deixar o ano começar diferente",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "selfControl", delta: 1 },
          { type: "set_clock", clock: { date: "2027-02-08", minuteOfDay: 7 * 60 + 30 } }
        ],
        nextNodeId: "prologue.third-year-deadline"
      },
      {
        id: "approach-unresolved-person",
        label: "Procurar {groupMateName} e não fingir que o conflito desapareceu",
        conditions: [
          { type: "relationship", personId: GROUP, dimension: "tension", operator: ">=", value: 15 }
        ],
        effects: [
          { type: "relationship", personId: GROUP, dimension: "tension", delta: -3 },
          { type: "relationship", personId: GROUP, dimension: "trust", delta: 1 },
          { type: "set_person_presence", personId: GROUP, presence: "active" },
          { type: "set_clock", clock: { date: "2027-02-08", minuteOfDay: 7 * 60 + 30 } }
        ],
        nextNodeId: "prologue.third-year-deadline"
      }
    ]
  }
];
