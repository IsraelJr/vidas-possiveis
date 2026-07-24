import type { GameState, NarrativePackage, StoryNode, StorySkillCheck } from "@vidas-possiveis/game-engine";
import { renderPersonTemplate } from "@vidas-possiveis/game-engine";
import { storyNodeSchema } from "./schema";

const GROUP = "school.groupMate";
const CLASS_START = { label: "Primeira aula", clock: { date: "2026-02-16", minuteOfDay: 7 * 60 + 30 } } as const;
const BREAK = { label: "Intervalo", clock: { date: "2026-02-16", minuteOfDay: 10 * 60 } } as const;
const PHYSICAL_ED = { label: "Educação Física", clock: { date: "2026-02-16", minuteOfDay: 10 * 60 + 20 } } as const;
const SCHOOL_END = { label: "Saída da escola", clock: { date: "2026-02-16", minuteOfDay: 12 * 60 } } as const;
const PRESENTATION = { label: "Apresentação do trabalho", clock: { date: "2026-02-20", minuteOfDay: 8 * 60 } } as const;
const YEAR_END = { label: "Última semana de aula", clock: { date: "2026-12-18", minuteOfDay: 14 * 60 } } as const;
const NEW_PATH = { label: "Começo do novo caminho", clock: { date: "2027-01-12", minuteOfDay: 9 * 60 } } as const;

const presentationOutcomes = {
  critical_failure: { nextNodeId: "prologue.presentation-hard", effects: [{ type: "stat", stat: "reputation", delta: -5 }, { type: "stat", stat: "stress", delta: 10 }, { type: "relationship", relationshipId: GROUP, dimension: "conflict", delta: 4 }] },
  failure: { nextNodeId: "prologue.presentation-hard", effects: [{ type: "stat", stat: "reputation", delta: -3 }, { type: "stat", stat: "stress", delta: 7 }] },
  partial_success: { nextNodeId: "prologue.presentation-mixed", effects: [{ type: "stat", stat: "reputation", delta: 2 }, { type: "stat", stat: "stress", delta: 3 }] },
  success: { nextNodeId: "prologue.presentation-strong", effects: [{ type: "stat", stat: "reputation", delta: 5 }, { type: "stat", stat: "communication", delta: 3 }, { type: "relationship", relationshipId: GROUP, dimension: "trust", delta: 3 }] },
  exceptional_success: { nextNodeId: "prologue.presentation-strong", effects: [{ type: "stat", stat: "reputation", delta: 8 }, { type: "stat", stat: "communication", delta: 5 }, { type: "stat", stat: "knowledge", delta: 2 }, { type: "relationship", relationshipId: GROUP, dimension: "trust", delta: 5 }, { type: "promote_person", relationshipId: GROUP, category: "important" }] }
} satisfies StorySkillCheck["outcomes"];

const nodes: readonly StoryNode[] = [
  {
    id: "prologue.morning", moduleId: "school-routine", title: "O despertador", activity: "Preparar-se para a escola", nextCommitment: CLASS_START,
    text: "O celular vibra às 06:10. Há café e pão na cozinha, merenda na escola e dinheiro limitado para a semana. Você pode pegar o ônibus de sempre ou gastar mais para ir de carro por aplicativo.",
    choices: [
      { id: "breakfast-bus", label: "Tomar café com calma e pegar o ônibus", conditions: [], effects: [{ type: "advance_time", minutes: 65 }, { type: "stat", stat: "energy", delta: 5 }, { type: "set_location", location: "school" }], nextNodeId: "prologue.wait-class" },
      { id: "quick-bus", label: "Comer rapidamente e pegar o ônibus anterior", conditions: [], effects: [{ type: "advance_time", minutes: 55 }, { type: "stat", stat: "energy", delta: 3 }, { type: "set_location", location: "school" }], nextNodeId: "prologue.wait-class" },
      { id: "sleep-ride", label: "Dormir mais vinte minutos e chamar um carro", conditions: [{ type: "money", operator: ">=", valueCents: 2500 }], effects: [{ type: "advance_time", minutes: 60 }, { type: "money", deltaCents: -2500 }, { type: "set_location", location: "school" }], nextNodeId: "prologue.wait-class" },
      { id: "skip-food", label: "Sair sem comer e pegar o ônibus", conditions: [], effects: [{ type: "advance_time", minutes: 60 }, { type: "stat", stat: "energy", delta: -5 }, { type: "set_location", location: "school" }], nextNodeId: "prologue.wait-class" }
    ]
  },
  {
    id: "prologue.wait-class", moduleId: "school-routine", title: "Alguns minutos antes da aula", activity: "Aguardar o início da aula", nextCommitment: CLASS_START,
    text: "Você chega antes das 07:30. Ainda não há aula acontecendo. Dá para revisar o caderno, conversar no corredor ou apenas esperar o sinal.",
    choices: [{ id: "wait-signal", label: "Esperar o sinal e entrar na sala", conditions: [], effects: [{ type: "set_clock", clock: CLASS_START.clock }], nextNodeId: "prologue.assignment" }]
  },
  {
    id: "prologue.assignment", moduleId: "group-project", title: "O trabalho que vale o bimestre", activity: "Aula de Português", nextCommitment: BREAK, contextPersonId: GROUP,
    text: "A professora anuncia um trabalho sobre histórias que mudam uma comunidade. A apresentação será na sexta-feira, às 08:00. Os grupos são sorteados e {{groupMate}} fica no seu grupo.",
    choices: [
      { id: "greet", label: "Cumprimentar {{groupMate}} e perguntar qual parte prefere", conditions: [], effects: [{ type: "advance_time", minutes: 5 }, { type: "relationship", relationshipId: GROUP, dimension: "trust", delta: 2 }], nextNodeId: "prologue.break" },
      { id: "take-control", label: "Assumir imediatamente a organização", conditions: [], effects: [{ type: "advance_time", minutes: 5 }, { type: "stat", stat: "discipline", delta: 1 }], nextNodeId: "prologue.break" },
      { id: "stay-distant", label: "Esperar que outra pessoa tome a iniciativa", conditions: [], effects: [{ type: "advance_time", minutes: 5 }], nextNodeId: "prologue.break" }
    ]
  },
  {
    id: "prologue.break", moduleId: "food-and-money", title: "Merenda ou lanchonete", activity: "Intervalo", nextCommitment: PHYSICAL_ED,
    text: "O cheiro da merenda chega ao pátio. A lanchonete vende salgados e sanduíches, mas o dinheiro gasto agora fará falta no transporte ou em um passeio.",
    choices: [
      { id: "school-meal", label: "Comer a merenda", conditions: [], effects: [{ type: "advance_time", minutes: 20 }, { type: "stat", stat: "energy", delta: 7 }], nextNodeId: "prologue.physical-ed" },
      { id: "buy-snack", label: "Comprar um lanche", conditions: [{ type: "money", operator: ">=", valueCents: 1200 }], effects: [{ type: "advance_time", minutes: 20 }, { type: "money", deltaCents: -1200 }, { type: "stat", stat: "energy", delta: 9 }], nextNodeId: "prologue.physical-ed" },
      { id: "skip-break", label: "Não comer e guardar o dinheiro", conditions: [], effects: [{ type: "advance_time", minutes: 20 }, { type: "stat", stat: "energy", delta: -4 }], nextNodeId: "prologue.physical-ed" }
    ]
  },
  {
    id: "prologue.physical-ed", moduleId: "physical-school", title: "A quadra", activity: "Educação Física", nextCommitment: SCHOOL_END,
    text: "A professora organiza um circuito de corrida e revezamento. A turma mistura brincadeira, competição e provocações.",
    choices: [
      { id: "participate", label: "Participar seriamente", conditions: [], effects: [{ type: "advance_time", minutes: 50 }, { type: "stat", stat: "energy", delta: -8 }, { type: "stat", stat: "health", delta: 2 }], nextNodeId: "prologue.free-class" },
      { id: "help-classmate", label: "Ajudar uma pessoa com dificuldade", conditions: [], effects: [{ type: "advance_time", minutes: 50 }, { type: "stat", stat: "communication", delta: 2 }, { type: "stat", stat: "energy", delta: -5 }], nextNodeId: "prologue.free-class" },
      { id: "stay-out", label: "Ficar de fora e preservar energia", conditions: [], effects: [{ type: "advance_time", minutes: 50 }, { type: "stat", stat: "reputation", delta: -1 }], nextNodeId: "prologue.free-class" }
    ]
  },
  {
    id: "prologue.free-class", moduleId: "school-social", title: "A aula que não aconteceu", activity: "Horário sem professor", nextCommitment: SCHOOL_END,
    text: "O professor faltou. Um colega sugere sair da escola e ir ao parque antes que alguém perceba. O grupo do trabalho também poderia usar esse tempo.",
    choices: [
      { id: "advance-project", label: "Ficar e adiantar o trabalho", conditions: [], effects: [{ type: "advance_time", minutes: 50 }, { type: "flag", flag: "preparedAssignment", value: true }, { type: "stat", stat: "knowledge", delta: 2 }], nextNodeId: "prologue.afternoon-message" },
      { id: "talk-friends", label: "Ficar e conversar com os amigos", conditions: [], effects: [{ type: "advance_time", minutes: 50 }, { type: "relationship", relationshipId: GROUP, dimension: "affection", delta: 2 }], nextNodeId: "prologue.afternoon-message" },
      { id: "skip-to-park", label: "Sair escondido e ir ao parque", conditions: [], effects: [{ type: "advance_time", minutes: 80 }, { type: "set_location", location: "park" }, { type: "stat", stat: "reputation", delta: -3 }, { type: "flag", flag: "skippedSchool", value: true }], nextNodeId: "prologue.afternoon-message" }
    ]
  },
  {
    id: "prologue.afternoon-message", moduleId: "group-project", title: "A mensagem das quatro", activity: "Organizar o trabalho", nextCommitment: PRESENTATION, contextPersonId: GROUP,
    text: "Às 16:00, {{groupMate}} avisa no grupo que não conseguiu concluir a parte combinada. Uma pessoa quer retirar o nome dela do trabalho; outra diz que ainda dá para reorganizar.",
    choices: [{ id: "ask-first", label: "Perguntar o que aconteceu antes de decidir", conditions: [], effects: [{ type: "set_clock", clock: { date: "2026-02-16", minuteOfDay: 16 * 60 + 10 } }, { type: "set_location", location: "home" }, { type: "stat", stat: "communication", delta: 1 }], nextNodeId: "prologue.group-decision" }]
  },
  {
    id: "prologue.group-decision", moduleId: "group-project", title: "O que fazer com {{groupMate}}?", activity: "Resolver o conflito do grupo", nextCommitment: PRESENTATION, contextPersonId: GROUP,
    text: "{{groupMate}} explica que a semana saiu do controle e pede uma chance. O passado entre vocês torna a decisão menos simples.",
    choices: [
      { id: "help-mate", label: "Dividir a parte e ajudar {{groupMate}}", conditions: [], effects: [{ type: "advance_time", minutes: 45 }, { type: "stat", stat: "energy", delta: -7 }, { type: "relationship", relationshipId: GROUP, dimension: "trust", delta: 6 }, { type: "relationship", relationshipId: GROUP, dimension: "affection", delta: 3 }, { type: "flag", flag: "promisedHelp", value: true }, { type: "schedule_consequence", consequenceId: "promise-return", delayMinutes: 600, title: "A promessa voltou a ter efeito", text: "A parte extra cobrou energia, mas {{groupMate}} percebeu que pôde contar com você.", effects: [{ type: "stat", stat: "energy", delta: -4 }, { type: "stat", stat: "stress", delta: 5 }, { type: "relationship", relationshipId: GROUP, dimension: "trust", delta: 2 }] }], nextNodeId: "prologue.work-place" },
      { id: "organize-group", label: "Manter no grupo com tarefas e prazo claros", conditions: [], effects: [{ type: "advance_time", minutes: 25 }, { type: "stat", stat: "communication", delta: 3 }, { type: "stat", stat: "discipline", delta: 2 }, { type: "relationship", relationshipId: GROUP, dimension: "trust", delta: 4 }, { type: "relationship", relationshipId: GROUP, dimension: "conflict", delta: -2 }, { type: "flag", flag: "sharedPlan", value: true }], nextNodeId: "prologue.work-place" },
      { id: "remove-mate", label: "Retirar {{groupMate}} do trabalho", conditions: [], effects: [{ type: "advance_time", minutes: 10 }, { type: "relationship", relationshipId: GROUP, dimension: "trust", delta: -7 }, { type: "relationship", relationshipId: GROUP, dimension: "conflict", delta: 9 }, { type: "flag", flag: "removedGroupMate", value: true }], nextNodeId: "prologue.work-place" },
      { id: "expose-mate", label: "Expor a situação no grupo e fazer uma piada", conditions: [], effects: [{ type: "advance_time", minutes: 10 }, { type: "relationship", relationshipId: GROUP, dimension: "trust", delta: -10 }, { type: "relationship", relationshipId: GROUP, dimension: "conflict", delta: 13 }, { type: "flag", flag: "humiliatedGroupMate", value: true }], nextNodeId: "prologue.work-place" }
    ]
  },
  {
    id: "prologue.work-place", moduleId: "group-project", title: "Onde terminar o trabalho", activity: "Preparar a apresentação", nextCommitment: PRESENTATION,
    text: "O grupo precisa escolher onde trabalhar. Sua casa oferece computador e convivência; a biblioteca fecha cedo; a chamada de vídeo evita deslocamento.",
    choices: [
      { id: "friends-home", label: "Levar o grupo para casa", conditions: [], effects: [{ type: "advance_time", minutes: 120 }, { type: "set_location", location: "home" }, { type: "flag", flag: "preparedAssignment", value: true }, { type: "relationship", relationshipId: GROUP, dimension: "affection", delta: 3 }], nextNodeId: "prologue.pair-test" },
      { id: "library-work", label: "Encontrar o grupo na biblioteca", conditions: [], effects: [{ type: "advance_time", minutes: 150 }, { type: "set_location", location: "library" }, { type: "flag", flag: "preparedAssignment", value: true }, { type: "stat", stat: "knowledge", delta: 3 }], nextNodeId: "prologue.pair-test" },
      { id: "video-call", label: "Fazer uma chamada de vídeo", conditions: [], effects: [{ type: "advance_time", minutes: 100 }, { type: "set_location", location: "home" }, { type: "flag", flag: "preparedAssignment", value: true }, { type: "stat", stat: "stress", delta: 2 }], nextNodeId: "prologue.pair-test" }
    ]
  },
  {
    id: "prologue.pair-test", moduleId: "academic-event", title: "A prova em dupla", activity: "Prova de Matemática", nextCommitment: PRESENTATION, contextPersonId: GROUP,
    text: "Na manhã seguinte, a professora anuncia uma prova em dupla. Por coincidência, sua dupla é {{groupMate}}.",
    choices: [
      { id: "solve-together", label: "Resolver em conjunto", conditions: [], effects: [{ type: "set_clock", clock: { date: "2026-02-17", minuteOfDay: 9 * 60 } }, { type: "set_location", location: "school" }, { type: "stat", stat: "knowledge", delta: 2 }, { type: "relationship", relationshipId: GROUP, dimension: "trust", delta: 2 }], nextNodeId: "prologue.social-invite" },
      { id: "take-over-test", label: "Assumir quase toda a prova", conditions: [], effects: [{ type: "set_clock", clock: { date: "2026-02-17", minuteOfDay: 9 * 60 } }, { type: "set_location", location: "school" }, { type: "stat", stat: "stress", delta: 4 }, { type: "relationship", relationshipId: GROUP, dimension: "conflict", delta: 2 }], nextNodeId: "prologue.social-invite" }
    ]
  },
  {
    id: "prologue.social-invite", moduleId: "social-life", title: "O convite depois da aula", activity: "Decidir sobre o fim da tarde", nextCommitment: PRESENTATION,
    text: "Um grupo combina de ir ao shopping. Em casa, você também precisa ajudar com uma responsabilidade familiar. Dá para ir de ônibus, gastar mais com aplicativo ou recusar.",
    choices: [
      { id: "mall-bus", label: "Ir ao shopping de ônibus e voltar cedo", conditions: [{ type: "money", operator: ">=", valueCents: 1500 }], effects: [{ type: "advance_time", minutes: 210 }, { type: "money", deltaCents: -1500 }, { type: "set_location", location: "shopping_mall" }, { type: "relationship", relationshipId: GROUP, dimension: "affection", delta: 2 }], nextNodeId: "prologue.rumor" },
      { id: "mall-ride", label: "Ir de carro por aplicativo para ganhar tempo", conditions: [{ type: "money", operator: ">=", valueCents: 4000 }], effects: [{ type: "advance_time", minutes: 170 }, { type: "money", deltaCents: -4000 }, { type: "set_location", location: "shopping_mall" }, { type: "relationship", relationshipId: GROUP, dimension: "affection", delta: 2 }], nextNodeId: "prologue.rumor" },
      { id: "decline-responsibility", label: "Recusar e cumprir a responsabilidade em casa", conditions: [], effects: [{ type: "advance_time", minutes: 150 }, { type: "set_location", location: "home" }, { type: "stat", stat: "discipline", delta: 2 }], nextNodeId: "prologue.rumor" }
    ]
  },
  {
    id: "prologue.rumor", moduleId: "conflict", title: "Uma história corre pela escola", activity: "Lidar com uma intriga", nextCommitment: PRESENTATION,
    text: "No dia seguinte, uma versão distorcida das escolhas do grupo começa a circular. A fofoca tem origem nas conversas sobre o trabalho e no que aconteceu fora da sala.",
    choices: [
      { id: "private-talk", label: "Conversar em particular com quem espalhou", conditions: [], effects: [{ type: "advance_time", minutes: 25 }, { type: "stat", stat: "communication", delta: 2 }, { type: "stat", stat: "stress", delta: -2 }], nextNodeId: "prologue.presentation-morning" },
      { id: "ignore-rumor", label: "Ignorar e focar na apresentação", conditions: [], effects: [{ type: "advance_time", minutes: 15 }, { type: "flag", flag: "ignoredRumor", value: true }], nextNodeId: "prologue.presentation-morning" },
      { id: "public-confrontation", label: "Confrontar em público", conditions: [], effects: [{ type: "advance_time", minutes: 20 }, { type: "stat", stat: "stress", delta: 4 }, { type: "relationship", relationshipId: GROUP, dimension: "conflict", delta: 3 }], nextNodeId: "prologue.presentation-morning" }
    ]
  },
  {
    id: "prologue.presentation-morning", moduleId: "presentation", title: "A manhã da apresentação", activity: "Chegar à escola", nextCommitment: PRESENTATION,
    text: "A apresentação começa às 08:00. Você precisa decidir como sair de casa e quanto cuidado terá consigo antes de chegar.",
    choices: [
      { id: "presentation-bus", label: "Tomar café e seguir de ônibus", conditions: [], effects: [{ type: "set_clock", clock: { date: "2026-02-20", minuteOfDay: 7 * 60 + 35 } }, { type: "set_location", location: "school" }, { type: "stat", stat: "energy", delta: 5 }], nextNodeId: "prologue.wait-presentation" },
      { id: "presentation-ride", label: "Chamar um carro e chegar mais cedo", conditions: [{ type: "money", operator: ">=", valueCents: 2500 }], effects: [{ type: "set_clock", clock: { date: "2026-02-20", minuteOfDay: 7 * 60 + 20 } }, { type: "money", deltaCents: -2500 }, { type: "set_location", location: "school" }, { type: "stat", stat: "stress", delta: -3 }], nextNodeId: "prologue.wait-presentation" },
      { id: "presentation-late", label: "Sair tarde e correr para o ponto", conditions: [], effects: [{ type: "set_clock", clock: { date: "2026-02-20", minuteOfDay: 8 * 60 + 10 } }, { type: "set_location", location: "school" }, { type: "stat", stat: "stress", delta: 8 }, { type: "flag", flag: "latePresentation", value: true }], nextNodeId: "prologue.presentation" }
    ]
  },
  {
    id: "prologue.wait-presentation", moduleId: "presentation", title: "Antes das oito", activity: "Revisar e aguardar a apresentação", nextCommitment: PRESENTATION,
    text: "Você chegou cedo. O grupo confere o arquivo, procura o cabo do projetor e revisa as falas enquanto espera o horário.",
    choices: [{ id: "start-at-eight", label: "Revisar e começar quando a professora chamar", conditions: [], effects: [{ type: "set_clock", clock: PRESENTATION.clock }, { type: "flag", flag: "rehearsedPresentation", value: true }], nextNodeId: "prologue.presentation" }]
  },
  {
    id: "prologue.presentation", moduleId: "presentation", title: "A turma olha para você", activity: "Apresentar o trabalho", nextCommitment: YEAR_END,
    text: "A professora chama o grupo. O resultado agora depende da preparação, da energia, do estresse e de como vocês chegaram até aqui.",
    choices: [
      { id: "lead-presentation", label: "Abrir a apresentação e conduzir o grupo", conditions: [], effects: [{ type: "advance_time", minutes: 25 }, { type: "stat", stat: "energy", delta: -4 }], nextNodeId: "prologue.presentation-mixed", skillCheck: { eventId: "school-presentation", stat: "communication", difficulty: 55, bonusFlags: [{ flag: "preparedAssignment", label: "Material preparado", value: 8 }, { flag: "rehearsedPresentation", label: "Revisão antes da apresentação", value: 8 }, { flag: "sharedPlan", label: "Equipe organizada", value: 4 }, { flag: "latePresentation", label: "Atraso", value: -10 }], outcomes: presentationOutcomes } },
      { id: "use-notes", label: "Seguir as anotações e explicar a parte mais segura", conditions: [], effects: [{ type: "advance_time", minutes: 25 }, { type: "stat", stat: "energy", delta: -2 }], nextNodeId: "prologue.presentation-mixed", skillCheck: { eventId: "school-presentation-notes", stat: "knowledge", difficulty: 50, bonusFlags: [{ flag: "preparedAssignment", label: "Material preparado", value: 10 }, { flag: "latePresentation", label: "Atraso", value: -8 }], outcomes: presentationOutcomes } }
    ]
  },
  { id: "prologue.presentation-hard", moduleId: "presentation", title: "Uma apresentação difícil", activity: "Entender o que aconteceu", nextCommitment: YEAR_END, text: "A fala se perde e a professora precisa fazer perguntas básicas. A consequência é real, mas ainda há tempo para aprender durante o ano.", choices: [{ id: "continue-hard", label: "Seguir para os meses seguintes", conditions: [], effects: [{ type: "set_clock", clock: { date: "2026-08-15", minuteOfDay: 13 * 60 } }], nextNodeId: "prologue.year-module" }] },
  { id: "prologue.presentation-mixed", moduleId: "presentation", title: "Você conseguiu atravessar", activity: "Conversar depois da apresentação", nextCommitment: YEAR_END, text: "Algumas partes funcionam e outras parecem improvisadas. A nota não é ruim, e fica claro onde o grupo perdeu tempo.", choices: [{ id: "continue-mixed", label: "Seguir para os meses seguintes", conditions: [], effects: [{ type: "set_clock", clock: { date: "2026-08-15", minuteOfDay: 13 * 60 } }], nextNodeId: "prologue.year-module" }] },
  { id: "prologue.presentation-strong", moduleId: "presentation", title: "A sala presta atenção", activity: "Aproveitar o resultado", nextCommitment: YEAR_END, text: "O grupo encontra ritmo, responde às perguntas e termina com segurança. A experiência fortalece algumas relações.", choices: [{ id: "continue-strong", label: "Seguir para os meses seguintes", conditions: [], effects: [{ type: "set_clock", clock: { date: "2026-08-15", minuteOfDay: 13 * 60 } }], nextNodeId: "prologue.year-module" }] },
  {
    id: "prologue.year-module", moduleId: "modular-year", title: "Entre provas, família e amigos", activity: "Escolher uma prioridade", nextCommitment: YEAR_END,
    text: "Os meses passam entre ônibus cheios, provas, conversas no intervalo e responsabilidades em casa. Surge um fim de semana com três caminhos possíveis.",
    choices: [
      { id: "temporary-work", label: "Aceitar um trabalho temporário", conditions: [], effects: [{ type: "money", deltaCents: 12000 }, { type: "stat", stat: "discipline", delta: 3 }, { type: "stat", stat: "stress", delta: 4 }, { type: "flag", flag: "workedTemporaryJob", value: true }, { type: "set_clock", clock: YEAR_END.clock }, { type: "set_location", location: "school" }], nextNodeId: "prologue.formation" },
      { id: "care-relative", label: "Ficar com um parente que precisa de companhia", conditions: [], effects: [{ type: "stat", stat: "stress", delta: 2 }, { type: "stat", stat: "ethics", delta: 3 }, { type: "flag", flag: "caredForRelative", value: true }, { type: "set_clock", clock: YEAR_END.clock }, { type: "set_location", location: "school" }], nextNodeId: "prologue.formation" },
      { id: "friends-party", label: "Ir a uma festa com os amigos", conditions: [{ type: "money", operator: ">=", valueCents: 2000 }], effects: [{ type: "money", deltaCents: -2000 }, { type: "stat", stat: "energy", delta: -6 }, { type: "relationship", relationshipId: GROUP, dimension: "affection", delta: 3 }, { type: "set_clock", clock: YEAR_END.clock }, { type: "set_location", location: "school" }], nextNodeId: "prologue.formation" }
    ]
  },
  {
    id: "prologue.formation", moduleId: "formation-bridge", title: "O último dia de aula", activity: "Escolher o primeiro caminho de formação", nextCommitment: NEW_PATH,
    text: "O ano termina. Pessoas ficaram próximas, outras se afastaram, e algumas escolhas ainda podem voltar no futuro. Agora você precisa escolher o primeiro passo depois da escola.",
    choices: [
      { id: "choose-university", label: "Buscar uma vaga na faculdade", conditions: [], effects: [{ type: "advance_time", minutes: 30 }, { type: "money", deltaCents: -5000 }, { type: "flag", flag: "formationUniversity", value: true }], nextNodeId: "ending.university" },
      { id: "choose-technical", label: "Entrar em um curso técnico", conditions: [], effects: [{ type: "advance_time", minutes: 30 }, { type: "money", deltaCents: -3000 }, { type: "flag", flag: "formationTechnical", value: true }], nextNodeId: "ending.technical" },
      { id: "choose-online-work", label: "Trabalhar e estudar online à noite", conditions: [], effects: [{ type: "advance_time", minutes: 30 }, { type: "stat", stat: "discipline", delta: 3 }, { type: "stat", stat: "stress", delta: 3 }, { type: "flag", flag: "formationOnlineWork", value: true }], nextNodeId: "ending.online-work" },
      { id: "choose-self-study", label: "Trabalhar e estudar por conta própria", conditions: [], effects: [{ type: "advance_time", minutes: 30 }, { type: "money", deltaCents: 5000 }, { type: "stat", stat: "discipline", delta: 2 }, { type: "flag", flag: "formationSelfStudy", value: true }], nextNodeId: "ending.self-study" }
    ]
  },
  { id: "ending.university", moduleId: "ending", title: "Uma porta para a faculdade", text: "Você decide disputar uma vaga e construir uma formação mais longa.", activity: "Preparar a entrada na faculdade", nextCommitment: NEW_PATH, ending: true, choices: [] },
  { id: "ending.technical", moduleId: "ending", title: "Aprender fazendo", text: "Você escolhe uma formação técnica, direta e ligada à prática.", activity: "Preparar o início do curso técnico", nextCommitment: NEW_PATH, ending: true, choices: [] },
  { id: "ending.online-work", moduleId: "ending", title: "Trabalho durante o dia, estudo à noite", text: "Você escolhe conciliar renda e aprendizado em uma rotina exigente.", activity: "Organizar a nova rotina", nextCommitment: NEW_PATH, ending: true, choices: [] },
  { id: "ending.self-study", moduleId: "ending", title: "Construir o próprio caminho", text: "Você decide trabalhar e aprender com projetos próprios.", activity: "Planejar o primeiro projeto", nextCommitment: NEW_PATH, ending: true, choices: [] }
];

export const rawNodes = nodes.map((node) => storyNodeSchema.parse(node) as StoryNode);
export const storyNodes = new Map(rawNodes.map((node) => [node.id, node] as const));
export const schoolProloguePackage: NarrativePackage = {
  id: "school-prologue-br-v1",
  version: "1.0.0",
  title: "Prólogo escolar brasileiro",
  startNodeId: "prologue.morning",
  nodeIds: rawNodes.map((node) => node.id),
  moduleIds: [...new Set(rawNodes.map((node) => node.moduleId))]
};

function renderNode(node: StoryNode, state?: GameState): StoryNode {
  if (!state) return node;
  return {
    ...node,
    title: renderPersonTemplate(node.title, state.relationships),
    text: renderPersonTemplate(node.text, state.relationships),
    choices: node.choices.map((choice) => ({ ...choice, label: renderPersonTemplate(choice.label, state.relationships) }))
  };
}

export function getStoryNode(nodeId: string, state?: GameState): StoryNode {
  const node = storyNodes.get(nodeId);
  if (!node) throw new Error(`Nó narrativo inexistente: ${nodeId}`);
  return renderNode(node, state);
}
