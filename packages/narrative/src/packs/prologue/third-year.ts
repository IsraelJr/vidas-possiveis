import type { StoryNode } from "@vidas-possiveis/game-engine";
import { PROLOGUE_PERSON_IDS } from "./cast";

const GROUP = PROLOGUE_PERSON_IDS.groupMate;
const FRIEND = PROLOGUE_PERSON_IDS.friend;
const RIVAL = PROLOGUE_PERSON_IDS.rival;

export const thirdYearNodes: readonly StoryNode[] = [
  {
    id: "prologue.third-year-deadline",
    moduleId: "prologue.third-year-future",
    title: "O formulário, a taxa e a data",
    text: "Em abril, o futuro deixa de ser uma conversa distante. A coordenação entrega uma lista de inscrições, cursos, provas e processos seletivos. Há prazos, documentos e custos diferentes. Escolher tentar alguma coisa já ocupa tempo; não tentar também vira uma decisão.",
    activity: "Escolher uma oportunidade para perseguir",
    nextCommitment: {
      label: "Retorno de uma relação do segundo ano",
      clock: { date: "2027-05-03", minuteOfDay: 10 * 60 }
    },
    choices: [
      {
        id: "register-university-exam",
        label: "Separar dinheiro e se inscrever para uma prova de acesso à faculdade",
        conditions: [{ type: "money", operator: ">=", valueCents: 4000 }],
        effects: [
          { type: "money", deltaCents: -4000 },
          { type: "knowledge", knowledge: "portuguese", delta: 2 },
          { type: "knowledge", knowledge: "mathematics", delta: 2 },
          { type: "flag", flag: "pursuedUniversity", value: true },
          { type: "set_clock", clock: { date: "2027-05-03", minuteOfDay: 10 * 60 } }
        ],
        nextNodeId: "prologue.third-year-return"
      },
      {
        id: "register-technical-selection",
        label: "Entrar num processo seletivo de curso técnico",
        conditions: [{ type: "money", operator: ">=", valueCents: 2000 }],
        effects: [
          { type: "money", deltaCents: -2000 },
          { type: "knowledge", knowledge: "technology", delta: 3 },
          { type: "flag", flag: "pursuedTechnical", value: true },
          { type: "set_clock", clock: { date: "2027-05-03", minuteOfDay: 10 * 60 } }
        ],
        nextNodeId: "prologue.third-year-return"
      },
      {
        id: "seek-paid-work",
        label: "Procurar uma oportunidade de trabalho antes da formatura",
        conditions: [],
        effects: [
          { type: "money", deltaCents: 10000 },
          { type: "condition", condition: "stress", delta: 4 },
          { type: "attribute", attribute: "selfControl", delta: 2 },
          { type: "flag", flag: "pursuedWork", value: true },
          { type: "set_clock", clock: { date: "2027-05-03", minuteOfDay: 10 * 60 } }
        ],
        nextNodeId: "prologue.third-year-return"
      },
      {
        id: "register-football-tryout",
        label: "Confirmar uma peneira e assumir o risco de ser avaliado no futebol",
        conditions: [{ type: "flag", flag: "footballLifeOwned", value: true }],
        effects: [
          { type: "flag", flag: "footballBridgeActive", value: true },
          { type: "flag", flag: "pursuedFootball", value: true },
          { type: "money", deltaCents: -3000 },
          { type: "knowledge", knowledge: "tactics", delta: 3 },
          { type: "condition", condition: "stress", delta: 4 },
          { type: "set_clock", clock: { date: "2027-05-03", minuteOfDay: 10 * 60 } }
        ],
        nextNodeId: "prologue.third-year-return"
      },
      {
        id: "delay-future-choice",
        label: "Guardar a lista e adiar a decisão por enquanto",
        conditions: [],
        effects: [
          { type: "condition", condition: "stress", delta: -2 },
          { type: "flag", flag: "delayedCareerDecision", value: true },
          { type: "set_clock", clock: { date: "2027-05-03", minuteOfDay: 10 * 60 } }
        ],
        nextNodeId: "prologue.third-year-return"
      }
    ]
  },
  {
    id: "prologue.third-year-return",
    moduleId: "prologue.third-year-memory",
    title: "Alguém lembra",
    text: "Uma atividade em grupo coloca {groupMateName} novamente diante de você. O assunto é novo, mas a conversa não começa do zero. O modo como vocês terminaram o segundo ano aparece nos silêncios, na distância entre as cadeiras e em quem se oferece primeiro para dividir as tarefas.",
    activity: "Responder a uma pessoa que lembra do passado",
    contextPersonIds: [GROUP],
    choices: [
      {
        id: "accept-returned-help",
        label: "Aceitar a parceria e observar se a confiança ainda existe",
        conditions: [
          { type: "relationship", personId: GROUP, dimension: "trust", operator: ">=", value: 25 },
          { type: "relationship", personId: GROUP, dimension: "tension", operator: "<=", value: 40 }
        ],
        effects: [
          { type: "relationship", personId: GROUP, dimension: "trust", delta: 4 },
          { type: "relationship", personId: GROUP, dimension: "closeness", delta: 3 },
          { type: "set_person_presence", personId: GROUP, presence: "active" },
          {
            type: "add_memory",
            personId: GROUP,
            memory: {
              id: "returned-collaboration-2027",
              summary: "No terceiro ano, vocês voltaram a trabalhar juntos levando o passado em consideração.",
              kind: "shared_work",
              intensity: 7,
              resolved: true,
              tags: ["callback", "third-year", "collaboration"]
            }
          },
          { type: "set_clock", clock: { date: "2027-05-20", minuteOfDay: 16 * 60 } }
        ],
        nextNodeId: "prologue.third-year-schedule-conflict"
      },
      {
        id: "set-boundaries-on-return",
        label: "Trabalhar junto, mas deixar os limites claros desde o começo",
        conditions: [],
        effects: [
          { type: "relationship", personId: GROUP, dimension: "trust", delta: 2 },
          { type: "relationship", personId: GROUP, dimension: "tension", delta: -2 },
          { type: "attribute", attribute: "communication", delta: 2 },
          { type: "set_person_presence", personId: GROUP, presence: "active" },
          {
            type: "add_memory",
            personId: GROUP,
            memory: {
              id: "boundaries-on-return",
              summary: "Você aceitou uma nova convivência sem fingir que o passado tinha desaparecido.",
              kind: "reconciliation",
              intensity: 6,
              resolved: false,
              tags: ["callback", "boundary", "third-year"]
            }
          },
          { type: "set_clock", clock: { date: "2027-05-20", minuteOfDay: 16 * 60 } }
        ],
        nextNodeId: "prologue.third-year-schedule-conflict"
      },
      {
        id: "ask-what-changed",
        label: "Perguntar como a vida de {groupMateName} mudou desde o ano passado",
        conditions: [],
        effects: [
          { type: "relationship", personId: GROUP, dimension: "closeness", delta: 3 },
          { type: "attribute", attribute: "perception", delta: 2 },
          { type: "set_person_presence", personId: GROUP, presence: "active" },
          { type: "set_clock", clock: { date: "2027-05-20", minuteOfDay: 16 * 60 } }
        ],
        nextNodeId: "prologue.third-year-schedule-conflict"
      },
      {
        id: "avoid-returned-relation",
        label: "Manter distância e concentrar-se apenas na tarefa",
        conditions: [],
        effects: [
          { type: "set_person_presence", personId: GROUP, presence: "distant" },
          { type: "relationship", personId: GROUP, dimension: "closeness", delta: -2 },
          { type: "attribute", attribute: "selfControl", delta: 1 },
          { type: "set_clock", clock: { date: "2027-05-20", minuteOfDay: 16 * 60 } }
        ],
        nextNodeId: "prologue.third-year-schedule-conflict"
      }
    ]
  },
  {
    id: "prologue.third-year-schedule-conflict",
    moduleId: "prologue.third-year-pressure",
    title: "Duas obrigações às quatro da tarde",
    text: "Uma apresentação importante, uma responsabilidade em casa e uma oportunidade fora da escola caem no mesmo período. Não existe tempo escondido entre elas. Avisar cedo, negociar ou simplesmente faltar produzirá efeitos diferentes para as pessoas envolvidas.",
    activity: "Escolher qual compromisso sustentar",
    choices: [
      {
        id: "prioritize-school-commitment",
        label: "Priorizar a apresentação e avisar em casa com antecedência",
        conditions: [],
        effects: [
          { type: "knowledge", knowledge: "portuguese", delta: 3 },
          { type: "reputation", delta: 2 },
          { type: "condition", condition: "stress", delta: 4 },
          { type: "flag", flag: "prioritizedSchool", value: true },
          { type: "set_clock", clock: { date: "2027-08-20", minuteOfDay: 19 * 60 } },
          { type: "set_location", location: "party" }
        ],
        nextNodeId: "prologue.third-year-social-night"
      },
      {
        id: "prioritize-family-commitment",
        label: "Cumprir a responsabilidade em casa e aceitar uma preparação menor",
        conditions: [],
        effects: [
          { type: "flag", flag: "supportedFamilyThirdYear", value: true },
          { type: "condition", condition: "energy", delta: -4 },
          { type: "condition", condition: "stress", delta: 2 },
          { type: "reputation", delta: -1 },
          { type: "set_clock", clock: { date: "2027-08-20", minuteOfDay: 19 * 60 } },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.third-year-social-night"
      },
      {
        id: "split-schedule",
        label: "Dividir o tempo e aceitar que nenhuma das duas coisas ficará perfeita",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "selfControl", delta: 2 },
          { type: "condition", condition: "energy", delta: -8 },
          { type: "condition", condition: "stress", delta: 5 },
          { type: "flag", flag: "splitThirdYearSchedule", value: true },
          { type: "set_clock", clock: { date: "2027-08-20", minuteOfDay: 19 * 60 } },
          { type: "set_location", location: "street" }
        ],
        nextNodeId: "prologue.third-year-social-night"
      },
      {
        id: "prioritize-football-training",
        label: "Ir ao treino decisivo e negociar a parte escolar com o grupo",
        conditions: [{ type: "flag", flag: "footballBridgeActive", value: true }],
        effects: [
          { type: "knowledge", knowledge: "ballControl", delta: 4 },
          { type: "knowledge", knowledge: "tactics", delta: 3 },
          { type: "condition", condition: "energy", delta: -9 },
          { type: "relationship", personId: GROUP, dimension: "trust", delta: -2 },
          { type: "flag", flag: "prioritizedFootball", value: true },
          { type: "set_clock", clock: { date: "2027-08-20", minuteOfDay: 19 * 60 } },
          { type: "set_location", location: "sports_field" }
        ],
        nextNodeId: "prologue.third-year-social-night"
      }
    ]
  },
  {
    id: "prologue.third-year-social-night",
    moduleId: "prologue.third-year-social",
    title: "A noite antes",
    text: "O convite parece simples até encontrar o resto da sua semana. Há gente que talvez mude de cidade, uma prova próxima, dinheiro limitado e um horário para voltar. Ficar de fora tem custo. Ir também.",
    activity: "Decidir como participar de uma noite importante",
    contextPersonIds: [FRIEND, GROUP],
    choices: [
      {
        id: "attend-briefly",
        label: "Ir por pouco tempo, combinar a volta e preservar o compromisso seguinte",
        conditions: [{ type: "money", operator: ">=", valueCents: 2500 }],
        effects: [
          { type: "money", deltaCents: -2500 },
          { type: "relationship", personId: FRIEND, dimension: "closeness", delta: 4 },
          { type: "condition", condition: "energy", delta: -4 },
          { type: "flag", flag: "attendedFarewellBriefly", value: true },
          { type: "set_clock", clock: { date: "2027-09-02", minuteOfDay: 7 * 60 + 20 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.third-year-health"
      },
      {
        id: "stay-through-night",
        label: "Ficar até o fim e aceitar o cansaço do dia seguinte",
        conditions: [{ type: "money", operator: ">=", valueCents: 4000 }],
        effects: [
          { type: "money", deltaCents: -4000 },
          { type: "relationship", personId: FRIEND, dimension: "closeness", delta: 6 },
          { type: "condition", condition: "energy", delta: -12 },
          { type: "condition", condition: "stress", delta: 3 },
          { type: "flag", flag: "stayedLateThirdYear", value: true },
          { type: "set_clock", clock: { date: "2027-09-02", minuteOfDay: 7 * 60 + 20 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.third-year-health"
      },
      {
        id: "decline-with-explanation",
        label: "Recusar e explicar por que esta semana não cabe mais nada",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "communication", delta: 2 },
          { type: "condition", condition: "energy", delta: 5 },
          { type: "relationship", personId: FRIEND, dimension: "trust", delta: 1 },
          { type: "relationship", personId: FRIEND, dimension: "closeness", delta: -1 },
          { type: "set_clock", clock: { date: "2027-09-02", minuteOfDay: 7 * 60 + 20 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.third-year-health"
      },
      {
        id: "lie-and-go",
        label: "Mentir em casa e ir sem combinar a volta",
        conditions: [],
        effects: [
          { type: "flag", flag: "liedToFamilyThirdYear", value: true },
          { type: "relationship", personId: FRIEND, dimension: "closeness", delta: 5 },
          { type: "condition", condition: "stress", delta: 8 },
          { type: "condition", condition: "energy", delta: -8 },
          { type: "set_clock", clock: { date: "2027-09-02", minuteOfDay: 7 * 60 + 20 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.third-year-health"
      }
    ]
  },
  {
    id: "prologue.third-year-health",
    moduleId: "prologue.third-year-health",
    title: "Quando o corpo pede pausa",
    text: "A primeira aula mal começou e seu corpo já está cobrando a conta das últimas semanas. Sono, treino, estudo, trabalho e preocupação não ficam em gavetas separadas. Fingir que está tudo bem também é uma escolha.",
    activity: "Lidar com cansaço e queda de rendimento",
    choices: [
      {
        id: "rest-and-seek-help",
        label: "Reduzir a carga por alguns dias e pedir ajuda antes de piorar",
        conditions: [],
        effects: [
          { type: "condition", condition: "energy", delta: 12 },
          { type: "condition", condition: "health", delta: 4 },
          { type: "condition", condition: "stress", delta: -7 },
          { type: "flag", flag: "respectedHealthLimit", value: true },
          { type: "set_clock", clock: { date: "2027-10-04", minuteOfDay: 18 * 60 } },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.third-year-expectations"
      },
      {
        id: "push-through-exhaustion",
        label: "Continuar a rotina e tentar recuperar depois",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "selfControl", delta: 1 },
          { type: "condition", condition: "energy", delta: -8 },
          { type: "condition", condition: "health", delta: -4 },
          { type: "condition", condition: "stress", delta: 6 },
          { type: "flag", flag: "ignoredHealthLimit", value: true },
          { type: "set_clock", clock: { date: "2027-10-04", minuteOfDay: 18 * 60 } },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.third-year-expectations"
      },
      {
        id: "drop-one-commitment",
        label: "Abrir mão de um compromisso para proteger os outros",
        conditions: [],
        effects: [
          { type: "condition", condition: "energy", delta: 7 },
          { type: "condition", condition: "stress", delta: -4 },
          { type: "attribute", attribute: "perception", delta: 2 },
          { type: "flag", flag: "reducedThirdYearLoad", value: true },
          { type: "set_clock", clock: { date: "2027-10-04", minuteOfDay: 18 * 60 } },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.third-year-expectations"
      },
      {
        id: "hide-football-pain",
        label: "Esconder o incômodo para não perder espaço no time",
        conditions: [{ type: "flag", flag: "footballBridgeActive", value: true }],
        effects: [
          { type: "knowledge", knowledge: "ballControl", delta: 2 },
          { type: "condition", condition: "health", delta: -8 },
          { type: "condition", condition: "stress", delta: 7 },
          { type: "flag", flag: "footballInjuryRisk", value: true },
          { type: "set_clock", clock: { date: "2027-10-04", minuteOfDay: 18 * 60 } },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.third-year-expectations"
      }
    ]
  },
  {
    id: "prologue.third-year-expectations",
    moduleId: "prologue.third-year-family",
    title: "O futuro que os outros imaginam",
    text: "Em casa, na escola e fora dela, as pessoas começam a falar do seu futuro como se cada uma segurasse uma parte do mapa. Segurança, dinheiro, talento, distância e medo aparecem com nomes diferentes. Você ainda pode escutar sem entregar a decisão.",
    activity: "Conversar sobre o futuro com quem espera algo de você",
    choices: [
      {
        id: "present-realistic-plan",
        label: "Apresentar um plano, inclusive com custos, prazos e dúvidas",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "communication", delta: 4 },
          { type: "attribute", attribute: "reasoning", delta: 2 },
          { type: "condition", condition: "stress", delta: -2 },
          { type: "flag", flag: "presentedCareerPlan", value: true },
          { type: "set_clock", clock: { date: "2027-11-10", minuteOfDay: 16 * 60 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.third-year-career-build"
      },
      {
        id: "accept-stable-expectation",
        label: "Aceitar o caminho considerado mais seguro pela família",
        conditions: [],
        effects: [
          { type: "condition", condition: "stress", delta: -1 },
          { type: "flag", flag: "acceptedFamilyCareerExpectation", value: true },
          { type: "set_clock", clock: { date: "2027-11-10", minuteOfDay: 16 * 60 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.third-year-career-build"
      },
      {
        id: "ask-for-more-time",
        label: "Admitir que ainda não sabe e pedir tempo sem fingir certeza",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "communication", delta: 2 },
          { type: "condition", condition: "stress", delta: -4 },
          { type: "flag", flag: "askedCareerTime", value: true },
          { type: "set_clock", clock: { date: "2027-11-10", minuteOfDay: 16 * 60 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.third-year-career-build"
      },
      {
        id: "choose-without-approval",
        label: "Deixar claro que a decisão final será sua, mesmo sem aprovação",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "selfControl", delta: 3 },
          { type: "condition", condition: "stress", delta: 3 },
          { type: "flag", flag: "claimedCareerAutonomy", value: true },
          { type: "set_clock", clock: { date: "2027-11-10", minuteOfDay: 16 * 60 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.third-year-career-build"
      }
    ]
  },
  {
    id: "prologue.third-year-career-build",
    moduleId: "prologue.third-year-career",
    title: "A decisão que não acontece de uma vez",
    text: "Em novembro, cada opção já carrega alguma história. Há formulários preenchidos, dinheiro gasto ou guardado, conhecimentos, cansaço, pessoas que abriram portas e coisas que você decidiu não perseguir. Você ainda pode mudar de direção, mas nenhuma alternativa começa do zero.",
    activity: "Preparar a transição para depois da escola",
    choices: [
      {
        id: "prepare-university-path",
        label: "Organizar documentos e preparação para buscar a faculdade",
        conditions: [],
        effects: [
          { type: "flag", flag: "careerInterestUniversity", value: true },
          { type: "knowledge", knowledge: "portuguese", delta: 2 },
          { type: "knowledge", knowledge: "mathematics", delta: 2 },
          { type: "set_clock", clock: { date: "2027-12-03", minuteOfDay: 11 * 60 + 50 } }
        ],
        nextNodeId: "prologue.last-ordinary-day"
      },
      {
        id: "prepare-technical-path",
        label: "Priorizar uma formação técnica e prática",
        conditions: [],
        effects: [
          { type: "flag", flag: "careerInterestTechnical", value: true },
          { type: "knowledge", knowledge: "technology", delta: 3 },
          { type: "set_clock", clock: { date: "2027-12-03", minuteOfDay: 11 * 60 + 50 } }
        ],
        nextNodeId: "prologue.last-ordinary-day"
      },
      {
        id: "prepare-work-study-path",
        label: "Planejar uma rotina que combine trabalho e estudo",
        conditions: [],
        effects: [
          { type: "flag", flag: "careerInterestWorkStudy", value: true },
          { type: "attribute", attribute: "selfControl", delta: 2 },
          { type: "money", deltaCents: 5000 },
          { type: "set_clock", clock: { date: "2027-12-03", minuteOfDay: 11 * 60 + 50 } }
        ],
        nextNodeId: "prologue.last-ordinary-day"
      },
      {
        id: "prepare-football-path",
        label: "Manter a trajetória no futebol aberta para depois da formatura",
        conditions: [{ type: "flag", flag: "footballLifeOwned", value: true }],
        effects: [
          { type: "flag", flag: "careerInterestFootball", value: true },
          { type: "flag", flag: "footballBridgeActive", value: true },
          { type: "knowledge", knowledge: "tactics", delta: 2 },
          { type: "set_clock", clock: { date: "2027-12-03", minuteOfDay: 11 * 60 + 50 } }
        ],
        nextNodeId: "prologue.last-ordinary-day"
      },
      {
        id: "keep-options-open",
        label: "Chegar à formatura sem fechar uma escolha que ainda não parece honesta",
        conditions: [],
        effects: [
          { type: "flag", flag: "careerStillOpen", value: true },
          { type: "condition", condition: "stress", delta: 2 },
          { type: "set_clock", clock: { date: "2027-12-03", minuteOfDay: 11 * 60 + 50 } }
        ],
        nextNodeId: "prologue.last-ordinary-day"
      }
    ]
  },
  {
    id: "prologue.last-ordinary-day",
    moduleId: "prologue.third-year-farewell",
    title: "O último dia comum",
    text: "Não é a formatura. Ainda há chamada, quadro sujo, bandejas e gente reclamando do calor. Justamente por isso, a manhã parece estranha. Alguém diz ‘amanhã a gente vê’ antes de lembrar que nenhum amanhã terá a mesma rotina.",
    activity: "Escolher como encerrar a rotina escolar",
    contextPersonIds: [GROUP, FRIEND, RIVAL],
    choices: [
      {
        id: "seek-group-mate-before-end",
        label: "Procurar {groupMateName} antes que o dia termine",
        conditions: [],
        effects: [
          { type: "relationship", personId: GROUP, dimension: "closeness", delta: 3 },
          { type: "set_person_presence", personId: GROUP, presence: "active" },
          {
            type: "add_memory",
            personId: GROUP,
            memory: {
              id: "last-ordinary-school-day",
              summary: "Vocês se procuraram no último dia em que a escola ainda parecia rotina.",
              kind: "other",
              intensity: 7,
              resolved: true,
              tags: ["farewell", "school", "future-callback"]
            }
          },
          { type: "set_clock", clock: { date: "2027-12-17", minuteOfDay: 18 * 60 } },
          { type: "set_location", location: "graduation_hall" }
        ],
        nextNodeId: "prologue.graduation"
      },
      {
        id: "spend-last-day-with-friend",
        label: "Ficar com {friendName} e registrar uma foto sem prometer demais",
        conditions: [],
        effects: [
          { type: "relationship", personId: FRIEND, dimension: "closeness", delta: 4 },
          { type: "set_person_category", personId: FRIEND, category: "important" },
          { type: "set_person_presence", personId: FRIEND, presence: "active" },
          { type: "set_clock", clock: { date: "2027-12-17", minuteOfDay: 18 * 60 } },
          { type: "set_location", location: "graduation_hall" }
        ],
        nextNodeId: "prologue.graduation"
      },
      {
        id: "repair-rivalry-before-end",
        label: "Devolver o que ficou pendente com {rivalName}",
        conditions: [],
        effects: [
          { type: "relationship", personId: RIVAL, dimension: "tension", delta: -6 },
          { type: "relationship", personId: RIVAL, dimension: "trust", delta: 2 },
          { type: "set_person_presence", personId: RIVAL, presence: "distant" },
          { type: "set_clock", clock: { date: "2027-12-17", minuteOfDay: 18 * 60 } },
          { type: "set_location", location: "graduation_hall" }
        ],
        nextNodeId: "prologue.graduation"
      },
      {
        id: "leave-school-quietly",
        label: "Sair cedo e guardar o fim sem transformá-lo em promessa",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "selfControl", delta: 1 },
          { type: "set_person_presence", personId: GROUP, presence: "distant" },
          { type: "set_clock", clock: { date: "2027-12-17", minuteOfDay: 18 * 60 } },
          { type: "set_location", location: "graduation_hall" }
        ],
        nextNodeId: "prologue.graduation"
      }
    ]
  },
  {
    id: "prologue.graduation",
    moduleId: "prologue.graduation",
    title: "Formatura",
    text: "A cerimônia mistura espera, roupa desconfortável, nomes chamados, fotos repetidas e conversas curtas demais para tudo o que ficou entre as pessoas. Algumas despedidas fecham uma relação. Outras apenas confirmam que a distância já tinha começado.",
    activity: "Encerrar o Ensino Médio",
    contextPersonIds: [GROUP, FRIEND],
    choices: [
      {
        id: "honest-farewell",
        label: "Conversar com {groupMateName} sem prometer o que você não sabe se cumprirá",
        conditions: [],
        effects: [
          { type: "relationship", personId: GROUP, dimension: "trust", delta: 3 },
          { type: "relationship", personId: GROUP, dimension: "tension", delta: -2 },
          {
            type: "add_memory",
            personId: GROUP,
            memory: {
              id: "graduation-farewell",
              summary: "Na formatura, vocês se despediram sem fingir que o futuro estava decidido.",
              kind: "other",
              intensity: 8,
              resolved: true,
              tags: ["graduation", "farewell", "adult-return"]
            }
          },
          { type: "flag", flag: "completedTwoYearSchool", value: true },
          { type: "set_clock", clock: { date: "2027-12-18", minuteOfDay: 9 * 60 } },
          { type: "set_location", location: "street" }
        ],
        nextNodeId: "prologue.formation-choice"
      },
      {
        id: "take-final-photo",
        label: "Fazer uma última foto com quem ainda faz parte da sua vida",
        conditions: [],
        effects: [
          { type: "relationship", personId: FRIEND, dimension: "closeness", delta: 3 },
          { type: "relationship", personId: GROUP, dimension: "closeness", delta: 2 },
          { type: "flag", flag: "completedTwoYearSchool", value: true },
          { type: "set_clock", clock: { date: "2027-12-18", minuteOfDay: 9 * 60 } },
          { type: "set_location", location: "street" }
        ],
        nextNodeId: "prologue.formation-choice"
      },
      {
        id: "accept-school-distance",
        label: "Aceitar que algumas relações terminam sem uma última conversa",
        conditions: [],
        effects: [
          { type: "set_person_presence", personId: GROUP, presence: "distant" },
          { type: "set_person_presence", personId: RIVAL, presence: "inactive" },
          { type: "condition", condition: "stress", delta: -3 },
          { type: "flag", flag: "completedTwoYearSchool", value: true },
          { type: "set_clock", clock: { date: "2027-12-18", minuteOfDay: 9 * 60 } },
          { type: "set_location", location: "street" }
        ],
        nextNodeId: "prologue.formation-choice"
      }
    ]
  }
];
