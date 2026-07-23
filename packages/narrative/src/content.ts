import type { StoryNode, StorySkillCheck } from "@vidas-possiveis/game-engine";
import { storyNodeSchema } from "./schema";

const PRESENTATION = { label: "Apresentação do trabalho", clock: { date: "2026-02-17", minuteOfDay: 8 * 60 } } as const;
const GUIDANCE = { label: "Conversa sobre os próximos passos", clock: { date: "2026-02-17", minuteOfDay: 10 * 60 + 30 } } as const;
const SCHOOL_END = { label: "Encerramento do ano escolar", clock: { date: "2026-12-18", minuteOfDay: 16 * 60 } } as const;
const NEW_PATH = { label: "Começo do novo caminho", clock: { date: "2027-01-12", minuteOfDay: 9 * 60 } } as const;

const presentationOutcomes = {
  critical_failure: {
    nextNodeId: "school.presentation-hard",
    effects: [
      { type: "stat", stat: "reputation", delta: -5 },
      { type: "stat", stat: "stress", delta: 10 },
      { type: "relationship", relationshipId: "bia", dimension: "conflict", delta: 4 }
    ]
  },
  failure: {
    nextNodeId: "school.presentation-hard",
    effects: [
      { type: "stat", stat: "reputation", delta: -3 },
      { type: "stat", stat: "stress", delta: 7 }
    ]
  },
  partial_success: {
    nextNodeId: "school.presentation-mixed",
    effects: [
      { type: "stat", stat: "reputation", delta: 2 },
      { type: "stat", stat: "stress", delta: 3 }
    ]
  },
  success: {
    nextNodeId: "school.presentation-strong",
    effects: [
      { type: "stat", stat: "reputation", delta: 5 },
      { type: "stat", stat: "communication", delta: 3 },
      { type: "relationship", relationshipId: "bia", dimension: "trust", delta: 3 }
    ]
  },
  exceptional_success: {
    nextNodeId: "school.presentation-strong",
    effects: [
      { type: "stat", stat: "reputation", delta: 8 },
      { type: "stat", stat: "communication", delta: 5 },
      { type: "stat", stat: "knowledge", delta: 2 },
      { type: "relationship", relationshipId: "bia", dimension: "trust", delta: 5 }
    ]
  }
} satisfies StorySkillCheck["outcomes"];

export const rawNodes: readonly StoryNode[] = [
  {
    id: "school.computer-assignment",
    title: "O trabalho que vale o bimestre",
    text: "A professora anuncia um trabalho em grupo que exige pesquisa, apresentação e acesso a um computador. A entrega será amanhã cedo. Você ainda precisa decidir como organizar a noite.",
    activity: "Organizar o trabalho escolar",
    nextCommitment: PRESENTATION,
    choices: [
      {
        id: "use-own-computer",
        label: "Voltar para casa e usar o computador da família",
        conditions: [{ type: "flag", flag: "hasComputer", value: true }],
        effects: [
          { type: "advance_time", minutes: 45 },
          { type: "set_location", location: "home" },
          { type: "stat", stat: "energy", delta: -5 },
          { type: "stat", stat: "knowledge", delta: 2 },
          { type: "flag", flag: "preparedAssignment", value: true }
        ],
        nextNodeId: "school.assignment-result"
      },
      {
        id: "go-library",
        label: "Ir à biblioteca pública antes que ela feche",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 90 },
          { type: "set_location", location: "library" },
          { type: "stat", stat: "energy", delta: -10 },
          { type: "stat", stat: "discipline", delta: 2 },
          { type: "stat", stat: "knowledge", delta: 3 },
          { type: "flag", flag: "preparedAssignment", value: true }
        ],
        nextNodeId: "school.assignment-result"
      },
      {
        id: "use-phone",
        label: "Tentar fazer tudo pelo celular durante o trajeto",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 60 },
          { type: "set_location", location: "public_transport" },
          { type: "stat", stat: "energy", delta: -8 },
          { type: "stat", stat: "stress", delta: 8 },
          { type: "stat", stat: "knowledge", delta: 1 },
          { type: "flag", flag: "preparedAssignment", value: false }
        ],
        nextNodeId: "school.assignment-result"
      }
    ]
  },
  {
    id: "school.assignment-result",
    title: "O começo da noite",
    text: "Você encontrou um jeito de avançar no trabalho. Ainda há muito para resolver, e uma nova mensagem acaba de chegar no grupo da turma.",
    activity: "Acompanhar o grupo do trabalho",
    nextCommitment: PRESENTATION,
    choices: [
      {
        id: "open-group-chat",
        label: "Abrir a conversa do grupo",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 15 },
          { type: "set_location", location: "home" },
          { type: "stat", stat: "energy", delta: -2 }
        ],
        nextNodeId: "school.group-conflict"
      }
    ]
  },
  {
    id: "school.group-conflict",
    title: "Uma mensagem de Bia",
    text: "Bia conta que precisou cuidar do irmão menor e não conseguiu terminar sua parte. Um colega quer retirar o nome dela do trabalho. Ela pede que você não deixe isso acontecer.",
    activity: "Resolver um conflito no grupo",
    nextCommitment: PRESENTATION,
    choices: [
      {
        id: "help-bia",
        label: "Ajudar Bia e assumir parte do que falta",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 45 },
          { type: "stat", stat: "energy", delta: -7 },
          { type: "stat", stat: "ethics", delta: 2 },
          { type: "relationship", relationshipId: "bia", dimension: "trust", delta: 8 },
          { type: "relationship", relationshipId: "bia", dimension: "affection", delta: 4 },
          { type: "flag", flag: "promisedHelp", value: true },
          {
            type: "schedule_consequence",
            consequenceId: "bia-help-promise",
            delayMinutes: 600,
            title: "A promessa da noite anterior",
            text: "A parte que você assumiu por Bia exigiu mais esforço do que parecia. Você chega à manhã cansado, mas ela percebe que pôde contar com você.",
            effects: [
              { type: "stat", stat: "stress", delta: 6 },
              { type: "stat", stat: "energy", delta: -4 },
              { type: "relationship", relationshipId: "bia", dimension: "trust", delta: 2 }
            ]
          }
        ],
        nextNodeId: "school.night-plan"
      },
      {
        id: "organize-team",
        label: "Redistribuir as tarefas sem excluir ninguém",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 25 },
          { type: "stat", stat: "communication", delta: 3 },
          { type: "stat", stat: "discipline", delta: 2 },
          { type: "relationship", relationshipId: "bia", dimension: "trust", delta: 4 },
          { type: "relationship", relationshipId: "bia", dimension: "conflict", delta: -2 },
          { type: "flag", flag: "sharedPlan", value: true }
        ],
        nextNodeId: "school.night-plan"
      },
      {
        id: "remove-bia",
        label: "Concordar em retirar Bia do trabalho",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 10 },
          { type: "stat", stat: "ethics", delta: -5 },
          { type: "stat", stat: "reputation", delta: -2 },
          { type: "relationship", relationshipId: "bia", dimension: "trust", delta: -8 },
          { type: "relationship", relationshipId: "bia", dimension: "conflict", delta: 10 },
          { type: "flag", flag: "removedBia", value: true }
        ],
        nextNodeId: "school.night-plan"
      }
    ]
  },
  {
    id: "school.night-plan",
    title: "A noite antes da apresentação",
    text: "O material está encaminhado. Agora você precisa decidir como usar as horas que restam antes de sair para a escola.",
    activity: "Preparar-se para o dia seguinte",
    nextCommitment: PRESENTATION,
    choices: [
      {
        id: "rehearse-presentation",
        label: "Ensaiar e depois dormir algumas horas",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 720 },
          { type: "stat", stat: "energy", delta: 10 },
          { type: "stat", stat: "stress", delta: -2 },
          { type: "stat", stat: "communication", delta: 2 },
          { type: "flag", flag: "rehearsedPresentation", value: true }
        ],
        nextNodeId: "school.morning-rush"
      },
      {
        id: "sleep-early",
        label: "Dormir mais cedo e confiar no que já foi feito",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 750 },
          { type: "stat", stat: "energy", delta: 18 },
          { type: "stat", stat: "stress", delta: -5 },
          { type: "stat", stat: "health", delta: 2 },
          { type: "flag", flag: "restedBeforePresentation", value: true }
        ],
        nextNodeId: "school.morning-rush"
      },
      {
        id: "keep-scrolling",
        label: "Adiar a preparação e passar parte da noite no celular",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 690 },
          { type: "stat", stat: "energy", delta: 5 },
          { type: "stat", stat: "stress", delta: 6 },
          { type: "stat", stat: "discipline", delta: -3 },
          { type: "flag", flag: "improvisedNight", value: true }
        ],
        nextNodeId: "school.morning-rush"
      }
    ]
  },
  {
    id: "school.morning-rush",
    title: "A manhã chegou",
    text: "A apresentação começa às oito. Você precisa escolher como sair de casa e quanto cuidado terá consigo antes de chegar à escola.",
    activity: "Chegar à escola",
    nextCommitment: PRESENTATION,
    choices: [
      {
        id: "breakfast-and-bus",
        label: "Tomar café e seguir de transporte público",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 75 },
          { type: "money", deltaCents: -500 },
          { type: "stat", stat: "energy", delta: 5 },
          { type: "stat", stat: "health", delta: 1 },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "school.presentation"
      },
      {
        id: "leave-immediately",
        label: "Sair imediatamente para não correr risco de atraso",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 55 },
          { type: "stat", stat: "energy", delta: -4 },
          { type: "stat", stat: "stress", delta: 2 },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "school.presentation"
      },
      {
        id: "ride-hailing",
        label: "Chamar um carro e ganhar alguns minutos",
        conditions: [{ type: "money", operator: ">=", valueCents: 2500 }],
        effects: [
          { type: "advance_time", minutes: 30 },
          { type: "money", deltaCents: -2500 },
          { type: "stat", stat: "stress", delta: -3 },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "school.presentation"
      }
    ]
  },
  {
    id: "school.presentation",
    title: "A turma olha para você",
    text: "Chegou a hora. A professora chama seu grupo, o projetor acende e a sala fica em silêncio.",
    activity: "Apresentar o trabalho",
    nextCommitment: GUIDANCE,
    choices: [
      {
        id: "lead-presentation",
        label: "Abrir a apresentação e conduzir o grupo",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 25 },
          { type: "stat", stat: "energy", delta: -4 }
        ],
        nextNodeId: "school.presentation-mixed",
        skillCheck: {
          eventId: "school-presentation-lead",
          stat: "communication",
          difficulty: 55,
          bonusFlags: [
            { flag: "preparedAssignment", label: "Material preparado", value: 8 },
            { flag: "rehearsedPresentation", label: "Ensaio", value: 10 },
            { flag: "restedBeforePresentation", label: "Descanso", value: 4 },
            { flag: "sharedPlan", label: "Equipe organizada", value: 3 }
          ],
          outcomes: presentationOutcomes
        }
      },
      {
        id: "invite-bia-first",
        label: "Convidar Bia para começar e apoiar a fala dela",
        conditions: [
          { type: "relationship", relationshipId: "bia", dimension: "trust", operator: ">=", value: 52 }
        ],
        effects: [
          { type: "advance_time", minutes: 25 },
          { type: "stat", stat: "energy", delta: -3 },
          { type: "relationship", relationshipId: "bia", dimension: "affection", delta: 2 }
        ],
        nextNodeId: "school.presentation-mixed",
        skillCheck: {
          eventId: "school-presentation-bia",
          stat: "communication",
          difficulty: 48,
          bonusFlags: [
            { flag: "sharedPlan", label: "Equipe organizada", value: 8 },
            { flag: "promisedHelp", label: "Confiança de Bia", value: 4 },
            { flag: "rehearsedPresentation", label: "Ensaio", value: 6 }
          ],
          outcomes: presentationOutcomes
        }
      },
      {
        id: "read-notes",
        label: "Seguir as anotações e explicar a parte mais segura",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 25 },
          { type: "stat", stat: "energy", delta: -2 }
        ],
        nextNodeId: "school.presentation-mixed",
        skillCheck: {
          eventId: "school-presentation-notes",
          stat: "knowledge",
          difficulty: 50,
          bonusFlags: [
            { flag: "preparedAssignment", label: "Material preparado", value: 10 },
            { flag: "rehearsedPresentation", label: "Ensaio", value: 4 },
            { flag: "restedBeforePresentation", label: "Descanso", value: 5 }
          ],
          outcomes: presentationOutcomes
        }
      }
    ]
  },
  {
    id: "school.presentation-hard",
    title: "Uma apresentação difícil",
    text: "A fala se perde em alguns momentos e a professora faz perguntas que deixam o grupo inseguro. Não foi o resultado que você esperava, mas agora você sabe exatamente o que precisa melhorar.",
    activity: "Entender o que aconteceu",
    nextCommitment: GUIDANCE,
    choices: [
      {
        id: "move-after-hard-presentation",
        label: "Respirar e seguir para a conversa sobre o futuro",
        conditions: [],
        effects: [{ type: "advance_time", minutes: 40 }],
        nextNodeId: "school.course-or-work"
      }
    ]
  },
  {
    id: "school.presentation-mixed",
    title: "Você conseguiu atravessar",
    text: "A apresentação tem tropeços, mas as ideias principais ficam claras. A professora reconhece o esforço do grupo e aponta caminhos para vocês evoluírem.",
    activity: "Conversar após a apresentação",
    nextCommitment: GUIDANCE,
    choices: [
      {
        id: "move-after-mixed-presentation",
        label: "Seguir para a conversa sobre o futuro",
        conditions: [],
        effects: [{ type: "advance_time", minutes: 40 }],
        nextNodeId: "school.course-or-work"
      }
    ]
  },
  {
    id: "school.presentation-strong",
    title: "A sala presta atenção",
    text: "O grupo encontra ritmo, responde às perguntas e termina sob elogios da professora. A experiência deixa uma sensação nova: talvez você consiga ir mais longe do que imaginava.",
    activity: "Aproveitar o bom resultado",
    nextCommitment: GUIDANCE,
    choices: [
      {
        id: "move-after-strong-presentation",
        label: "Seguir para a conversa sobre o futuro",
        conditions: [],
        effects: [{ type: "advance_time", minutes: 40 }],
        nextNodeId: "school.course-or-work"
      }
    ]
  },
  {
    id: "school.course-or-work",
    title: "Uma oportunidade para o sábado",
    text: "A orientadora oferece vagas em um curso gratuito de introdução à tecnologia. No mesmo dia, um parente convida você para um trabalho temporário que ajudaria nas despesas de casa.",
    activity: "Escolher uma oportunidade",
    nextCommitment: SCHOOL_END,
    choices: [
      {
        id: "attend-tech-course",
        label: "Participar do curso gratuito de tecnologia",
        conditions: [],
        effects: [
          { type: "money", deltaCents: -1000 },
          { type: "stat", stat: "knowledge", delta: 5 },
          { type: "stat", stat: "discipline", delta: 2 },
          { type: "flag", flag: "attendedTechCourse", value: true },
          { type: "set_clock", clock: { date: "2026-12-18", minuteOfDay: 14 * 60 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "school.formation-choice"
      },
      {
        id: "take-temporary-job",
        label: "Aceitar o trabalho e guardar parte do dinheiro",
        conditions: [],
        effects: [
          { type: "money", deltaCents: 12000 },
          { type: "stat", stat: "discipline", delta: 3 },
          { type: "stat", stat: "stress", delta: 4 },
          { type: "flag", flag: "workedTemporaryJob", value: true },
          { type: "set_clock", clock: { date: "2026-12-18", minuteOfDay: 14 * 60 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "school.formation-choice"
      },
      {
        id: "study-with-borrowed-material",
        label: "Estudar por conta própria com material emprestado",
        conditions: [],
        effects: [
          { type: "stat", stat: "knowledge", delta: 4 },
          { type: "stat", stat: "discipline", delta: 4 },
          { type: "flag", flag: "builtFirstProject", value: true },
          { type: "set_clock", clock: { date: "2026-12-18", minuteOfDay: 14 * 60 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "school.formation-choice"
      }
    ]
  },
  {
    id: "school.formation-choice",
    title: "O último dia de aula",
    text: "O ano termina. Com o certificado nas mãos, você precisa escolher como dará o primeiro passo em direção à vida profissional.",
    activity: "Escolher o primeiro caminho de formação",
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
          { type: "stat", stat: "discipline", delta: 3 },
          { type: "stat", stat: "stress", delta: 3 },
          { type: "flag", flag: "formationOnlineWork", value: true }
        ],
        nextNodeId: "ending.online-work"
      },
      {
        id: "choose-work-and-self-study",
        label: "Procurar trabalho e continuar aprendendo por conta própria",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 30 },
          { type: "money", deltaCents: 5000 },
          { type: "stat", stat: "discipline", delta: 2 },
          { type: "flag", flag: "formationSelfStudy", value: true }
        ],
        nextNodeId: "ending.self-study"
      }
    ]
  },
  {
    id: "ending.university",
    title: "Uma porta para a faculdade",
    text: "Você decide disputar uma vaga e construir uma formação mais longa. O caminho exigirá organização financeira e paciência, mas também poderá ampliar sua rede e suas oportunidades.",
    activity: "Preparar a entrada na faculdade",
    nextCommitment: NEW_PATH,
    ending: true,
    choices: []
  },
  {
    id: "ending.technical",
    title: "Aprender fazendo",
    text: "Você escolhe uma formação técnica, mais direta e ligada à prática. O objetivo agora é dominar uma profissão e chegar ao mercado com experiência concreta.",
    activity: "Preparar o início do curso técnico",
    nextCommitment: NEW_PATH,
    ending: true,
    choices: []
  },
  {
    id: "ending.online-work",
    title: "Trabalho durante o dia, estudo à noite",
    text: "Você escolhe conciliar renda e aprendizado. Será uma rotina exigente, mas cada semana poderá aproximar você da primeira oportunidade em tecnologia.",
    activity: "Organizar a nova rotina",
    nextCommitment: NEW_PATH,
    ending: true,
    choices: []
  },
  {
    id: "ending.self-study",
    title: "Construir o próprio caminho",
    text: "Você decide começar a trabalhar e aprender com projetos próprios. O avanço dependerá muito da sua disciplina, mas você terá liberdade para experimentar e mostrar o que sabe fazer.",
    activity: "Buscar trabalho e planejar o primeiro projeto",
    nextCommitment: NEW_PATH,
    ending: true,
    choices: []
  }
];

export const storyNodes = new Map<string, StoryNode>(
  rawNodes.map((node) => {
    const parsed = storyNodeSchema.parse(node) as StoryNode;
    return [parsed.id, parsed] as const;
  })
);

export function getStoryNode(nodeId: string): StoryNode {
  const node = storyNodes.get(nodeId);
  if (!node) throw new Error(`Nó narrativo inexistente: ${nodeId}`);
  return node;
}
