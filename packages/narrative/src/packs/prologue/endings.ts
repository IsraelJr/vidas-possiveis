import type { StoryNode } from "@vidas-possiveis/game-engine";
import { PROLOGUE_PERSON_IDS } from "./cast";

const GROUP = PROLOGUE_PERSON_IDS.groupMate;
const NEW_PATH = {
  label: "Começo do novo caminho",
  clock: { date: "2027-01-12", minuteOfDay: 9 * 60 }
} as const;

export const endingNodes: readonly StoryNode[] = [
  {
    id: "prologue.school-year-end",
    moduleId: "prologue.ending",
    title: "A última semana de aula",
    text: "O ano termina entre provas, despedidas e promessas de manter contato. Algumas pessoas continuam perto; outras já parecem fazer parte de outra fase. Agora você precisa escolher o primeiro caminho depois da escola.",
    activity: "Encerrar o Ensino Médio",
    nextCommitment: {
      label: "Escolher o próximo passo",
      clock: { date: "2026-12-18", minuteOfDay: 16 * 60 }
    },
    contextPersonIds: [GROUP],
    choices: [
      {
        id: "review-school-year",
        label: "Guardar as lembranças e pensar no próximo passo",
        conditions: [],
        effects: [
          { type: "set_clock", clock: { date: "2026-12-18", minuteOfDay: 16 * 60 } },
          { type: "flag", flag: "completedSchoolPrologue", value: true }
        ],
        nextNodeId: "prologue.formation-choice"
      }
    ]
  },
  {
    id: "prologue.formation-choice",
    moduleId: "prologue.ending",
    title: "O primeiro caminho depois da escola",
    text: "Com o Ensino Médio encerrado, você precisa escolher como começará a construir a vida profissional. Nenhuma opção resolve tudo; cada caminho cobra tempo, dinheiro e energia de uma forma diferente.",
    activity: "Escolher a formação inicial",
    nextCommitment: NEW_PATH,
    choices: [
      {
        id: "choose-university",
        label: "Buscar uma vaga na faculdade",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 30 },
          { type: "money", deltaCents: -5000 },
          { type: "flag", flag: "formationUniversity", value: true }
        ],
        nextNodeId: "ending.university"
      },
      {
        id: "choose-technical-course",
        label: "Entrar em um curso técnico",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 30 },
          { type: "money", deltaCents: -3000 },
          { type: "flag", flag: "formationTechnical", value: true }
        ],
        nextNodeId: "ending.technical"
      },
      {
        id: "choose-online-and-work",
        label: "Trabalhar e estudar online à noite",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 30 },
          { type: "attribute", attribute: "selfControl", delta: 3 },
          { type: "condition", condition: "stress", delta: 3 },
          { type: "flag", flag: "formationOnlineWork", value: true }
        ],
        nextNodeId: "ending.online-work"
      },
      {
        id: "choose-work-and-self-study",
        label: "Procurar trabalho e estudar de forma independente",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 30 },
          { type: "money", deltaCents: 5000 },
          { type: "attribute", attribute: "selfControl", delta: 2 },
          { type: "flag", flag: "formationSelfStudy", value: true }
        ],
        nextNodeId: "ending.self-study"
      }
    ]
  },
  {
    id: "ending.university",
    moduleId: "prologue.ending",
    title: "Uma porta para a faculdade",
    text: "Você decide disputar uma vaga e construir uma formação mais longa. O caminho exigirá organização financeira e paciência, mas poderá ampliar sua rede e suas oportunidades.",
    activity: "Preparar a entrada na faculdade",
    nextCommitment: NEW_PATH,
    ending: true,
    choices: []
  },
  {
    id: "ending.technical",
    moduleId: "prologue.ending",
    title: "Aprender fazendo",
    text: "Você escolhe uma formação técnica, mais direta e ligada à prática. O objetivo agora é dominar uma profissão e chegar ao mercado com experiência concreta.",
    activity: "Preparar o início do curso técnico",
    nextCommitment: NEW_PATH,
    ending: true,
    choices: []
  },
  {
    id: "ending.online-work",
    moduleId: "prologue.ending",
    title: "Trabalho durante o dia, estudo à noite",
    text: "Você escolhe conciliar renda e aprendizado. Será uma rotina exigente, mas cada semana poderá aproximar você da primeira oportunidade profissional.",
    activity: "Organizar a nova rotina",
    nextCommitment: NEW_PATH,
    ending: true,
    choices: []
  },
  {
    id: "ending.self-study",
    moduleId: "prologue.ending",
    title: "Construir o próprio caminho",
    text: "Você decide começar a trabalhar e aprender com projetos próprios. O avanço dependerá do seu Autocontrole, da prática e das oportunidades que conseguir construir.",
    activity: "Buscar trabalho e planejar o primeiro projeto",
    nextCommitment: NEW_PATH,
    ending: true,
    choices: []
  }
];
