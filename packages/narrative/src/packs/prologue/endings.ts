import type { StoryNode } from "@vidas-possiveis/game-engine";
import { PROLOGUE_PERSON_IDS } from "./cast";

const GROUP = PROLOGUE_PERSON_IDS.groupMate;
const NEW_PATH = {
  label: "Começo do novo caminho",
  clock: { date: "2028-01-15", minuteOfDay: 9 * 60 }
} as const;
const FOOTBALL_OWNED = [{ type: "flag", flag: "footballLifeOwned", value: true }] as const;
const FOOTBALL_NOT_OWNED = [{ type: "flag", flag: "footballLifeOwned", value: false }] as const;

export const endingNodes: readonly StoryNode[] = [
  {
    id: "prologue.school-year-end",
    moduleId: "prologue.legacy-transition",
    title: "A escola ainda não terminou",
    text: "Esta vida foi iniciada quando o prólogo terminava no fim de 2026. Suas escolhas foram preservadas, e a história continuará pelas férias e pelo terceiro ano.",
    activity: "Continuar a vida escolar",
    choices: [
      {
        id: "continue-two-year-school",
        label: "Seguir para as férias antes do terceiro ano",
        conditions: [],
        effects: [
          { type: "set_clock", clock: { date: "2026-12-18", minuteOfDay: 17 * 60 } },
          { type: "set_location", location: "street" },
          { type: "flag", flag: "migratedToTwoYearPrologue", value: true }
        ],
        nextNodeId: "prologue.vacation-transition"
      }
    ]
  },
  {
    id: "prologue.formation-choice",
    moduleId: "prologue.ending",
    title: "Do lado de fora do portão",
    text: "A escola fica para trás sem desaparecer de uma vez. Ainda existem fotos, mensagens e promessas. Também existem horários, custos, cursos, trabalho e oportunidades que não chegaram por acaso. A próxima escolha não decide toda a sua vida. Decide qual vida você tentará primeiro.",
    activity: "Escolher o primeiro caminho depois da escola",
    nextCommitment: NEW_PATH,
    contextPersonIds: [GROUP],
    choices: [
      {
        id: "choose-university",
        label: "Buscar uma vaga na faculdade",
        conditions: FOOTBALL_NOT_OWNED,
        effects: [
          { type: "advance_time", minutes: 30 },
          { type: "money", deltaCents: -5000 },
          { type: "flag", flag: "formationUniversity", value: true },
          { type: "flag", flag: "completedSchoolPrologue", value: true }
        ],
        nextNodeId: "ending.university"
      },
      {
        id: "choose-university-owned",
        label: "Buscar uma vaga na faculdade",
        conditions: FOOTBALL_OWNED,
        effects: [],
        nextNodeId: "prologue.confirm-university"
      },
      {
        id: "choose-technical-course",
        label: "Entrar em um curso técnico",
        conditions: FOOTBALL_NOT_OWNED,
        effects: [
          { type: "advance_time", minutes: 30 },
          { type: "money", deltaCents: -3000 },
          { type: "flag", flag: "formationTechnical", value: true },
          { type: "flag", flag: "completedSchoolPrologue", value: true }
        ],
        nextNodeId: "ending.technical"
      },
      {
        id: "choose-technical-owned",
        label: "Entrar em um curso técnico",
        conditions: FOOTBALL_OWNED,
        effects: [],
        nextNodeId: "prologue.confirm-technical"
      },
      {
        id: "choose-online-and-work",
        label: "Trabalhar e estudar online à noite",
        conditions: FOOTBALL_NOT_OWNED,
        effects: [
          { type: "advance_time", minutes: 30 },
          { type: "attribute", attribute: "selfControl", delta: 3 },
          { type: "condition", condition: "stress", delta: 3 },
          { type: "flag", flag: "formationOnlineWork", value: true },
          { type: "flag", flag: "completedSchoolPrologue", value: true }
        ],
        nextNodeId: "ending.online-work"
      },
      {
        id: "choose-online-owned",
        label: "Trabalhar e estudar online à noite",
        conditions: FOOTBALL_OWNED,
        effects: [],
        nextNodeId: "prologue.confirm-online-work"
      },
      {
        id: "choose-work-and-self-study",
        label: "Procurar trabalho e estudar de forma independente",
        conditions: FOOTBALL_NOT_OWNED,
        effects: [
          { type: "advance_time", minutes: 30 },
          { type: "money", deltaCents: 5000 },
          { type: "attribute", attribute: "selfControl", delta: 2 },
          { type: "flag", flag: "formationSelfStudy", value: true },
          { type: "flag", flag: "completedSchoolPrologue", value: true }
        ],
        nextNodeId: "ending.self-study"
      },
      {
        id: "choose-self-study-owned",
        label: "Procurar trabalho e estudar de forma independente",
        conditions: FOOTBALL_OWNED,
        effects: [],
        nextNodeId: "prologue.confirm-self-study"
      },
      {
        id: "choose-football",
        label: "Seguir a trajetória no futebol",
        conditions: FOOTBALL_OWNED,
        effects: [
          { type: "advance_time", minutes: 30 },
          { type: "flag", flag: "formationFootball", value: true },
          { type: "flag", flag: "completedSchoolPrologue", value: true },
          { type: "knowledge", knowledge: "tactics", delta: 2 },
          { type: "condition", condition: "stress", delta: 2 }
        ],
        nextNodeId: "ending.football"
      }
    ]
  },
  {
    id: "prologue.confirm-university",
    moduleId: "prologue.ending-confirmation",
    title: "Confirmar outro caminho",
    text: "Você possui a vida Futebol e construiu uma trajetória esportiva durante a escola. Nesta vida, está escolhendo buscar a faculdade. A trajetória no Futebol continuará disponível em novas vidas. Você quer manter esta escolha?",
    activity: "Confirmar a escolha pela faculdade",
    choices: [
      {
        id: "confirm-university",
        label: "Seguir com a faculdade",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 30 },
          { type: "money", deltaCents: -5000 },
          { type: "flag", flag: "formationUniversity", value: true },
          { type: "flag", flag: "completedSchoolPrologue", value: true }
        ],
        nextNodeId: "ending.university"
      },
      {
        id: "return-from-university-confirmation",
        label: "Voltar às opções",
        conditions: [],
        effects: [],
        nextNodeId: "prologue.formation-choice"
      }
    ]
  },
  {
    id: "prologue.confirm-technical",
    moduleId: "prologue.ending-confirmation",
    title: "Confirmar outro caminho",
    text: "Você possui a vida Futebol e construiu uma trajetória esportiva durante a escola. Nesta vida, está escolhendo um curso técnico. A trajetória no Futebol continuará disponível em novas vidas. Você quer manter esta escolha?",
    activity: "Confirmar a escolha pelo curso técnico",
    choices: [
      {
        id: "confirm-technical",
        label: "Seguir com o curso técnico",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 30 },
          { type: "money", deltaCents: -3000 },
          { type: "flag", flag: "formationTechnical", value: true },
          { type: "flag", flag: "completedSchoolPrologue", value: true }
        ],
        nextNodeId: "ending.technical"
      },
      {
        id: "return-from-technical-confirmation",
        label: "Voltar às opções",
        conditions: [],
        effects: [],
        nextNodeId: "prologue.formation-choice"
      }
    ]
  },
  {
    id: "prologue.confirm-online-work",
    moduleId: "prologue.ending-confirmation",
    title: "Confirmar outro caminho",
    text: "Você possui a vida Futebol e construiu uma trajetória esportiva durante a escola. Nesta vida, está escolhendo trabalhar e estudar online. A trajetória no Futebol continuará disponível em novas vidas. Você quer manter esta escolha?",
    activity: "Confirmar a rotina de trabalho e estudo",
    choices: [
      {
        id: "confirm-online-work",
        label: "Seguir com trabalho e estudo online",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 30 },
          { type: "attribute", attribute: "selfControl", delta: 3 },
          { type: "condition", condition: "stress", delta: 3 },
          { type: "flag", flag: "formationOnlineWork", value: true },
          { type: "flag", flag: "completedSchoolPrologue", value: true }
        ],
        nextNodeId: "ending.online-work"
      },
      {
        id: "return-from-online-confirmation",
        label: "Voltar às opções",
        conditions: [],
        effects: [],
        nextNodeId: "prologue.formation-choice"
      }
    ]
  },
  {
    id: "prologue.confirm-self-study",
    moduleId: "prologue.ending-confirmation",
    title: "Confirmar outro caminho",
    text: "Você possui a vida Futebol e construiu uma trajetória esportiva durante a escola. Nesta vida, está escolhendo trabalhar e estudar de forma independente. A trajetória no Futebol continuará disponível em novas vidas. Você quer manter esta escolha?",
    activity: "Confirmar o caminho independente",
    choices: [
      {
        id: "confirm-self-study",
        label: "Seguir com trabalho e estudo independente",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 30 },
          { type: "money", deltaCents: 5000 },
          { type: "attribute", attribute: "selfControl", delta: 2 },
          { type: "flag", flag: "formationSelfStudy", value: true },
          { type: "flag", flag: "completedSchoolPrologue", value: true }
        ],
        nextNodeId: "ending.self-study"
      },
      {
        id: "return-from-self-study-confirmation",
        label: "Voltar às opções",
        conditions: [],
        effects: [],
        nextNodeId: "prologue.formation-choice"
      }
    ]
  },
  {
    id: "ending.university",
    moduleId: "prologue.ending",
    title: "Uma porta para a faculdade",
    text: "Você decide disputar uma vaga e construir uma formação mais longa. A escolha carrega os hábitos, as notas, os custos e as conversas dos dois anos anteriores. O caminho ainda não garante chegada, mas agora possui uma direção concreta.",
    activity: "Preparar a entrada na faculdade",
    nextCommitment: NEW_PATH,
    ending: true,
    choices: []
  },
  {
    id: "ending.technical",
    moduleId: "prologue.ending",
    title: "Aprender fazendo",
    text: "Você escolhe uma formação técnica, mais direta e ligada à prática. O objetivo agora é dominar uma profissão e chegar ao mercado com experiência concreta, levando consigo o que aprendeu sobre tempo, trabalho e pessoas durante a escola.",
    activity: "Preparar o início do curso técnico",
    nextCommitment: NEW_PATH,
    ending: true,
    choices: []
  },
  {
    id: "ending.online-work",
    moduleId: "prologue.ending",
    title: "Trabalho durante o dia, estudo à noite",
    text: "Você escolhe conciliar renda e aprendizado. A rotina exigirá energia e Autocontrole. As decisões escolares não desapareceram: elas definiram como você pede ajuda, organiza horários e reage quando duas obrigações ocupam o mesmo espaço.",
    activity: "Organizar a nova rotina",
    nextCommitment: NEW_PATH,
    ending: true,
    choices: []
  },
  {
    id: "ending.self-study",
    moduleId: "prologue.ending",
    title: "Construir o próprio caminho",
    text: "Você decide começar a trabalhar e aprender com projetos próprios. O avanço dependerá da prática, da rede que conseguir construir e da capacidade de continuar mesmo quando ninguém organiza o calendário por você.",
    activity: "Buscar trabalho e planejar o primeiro projeto",
    nextCommitment: NEW_PATH,
    ending: true,
    choices: []
  },
  {
    id: "ending.football",
    moduleId: "prologue.ending",
    title: "A próxima avaliação",
    text: "Você escolhe continuar a trajetória no futebol. Os treinos, jogos, deslocamentos, disputas e limites físicos da escola agora formam seu ponto de partida. A compra abriu essa vida; seu desempenho, sua saúde, seus vínculos e suas decisões ainda determinarão até onde ela irá.",
    activity: "Preparar o próximo treino e a próxima avaliação",
    nextCommitment: NEW_PATH,
    ending: true,
    choices: []
  }
];
