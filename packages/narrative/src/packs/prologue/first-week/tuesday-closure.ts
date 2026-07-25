import type { StoryNode } from "@vidas-possiveis/game-engine";
import * as S from "./shared";

export const tuesdayClosureNodes: readonly StoryNode[] = [
  {
    id: "prologue.tuesday-route-home",
    moduleId: "prologue.first-week",
    title: "O restante da terça-feira",
    text: "A decisão depois da aula terminou, mas o dia não. Você ainda precisa concluir onde está e voltar para casa.",
    activity: "Voltar para casa",
    nextCommitment: S.PRESENTATION,
    choices: [
      {
        id: "return-home-from-street",
        label: "Encerrar o passeio e voltar para casa",
        conditions: [{ type: "location", value: "street" }],
        effects: [
          { type: "advance_time", minutes: 80 },
          { type: "condition", condition: "energy", delta: -5 },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.tuesday-evening",
        outcome: {
          title: "O passeio termina",
          text: "Você se despede, atravessa o caminho de volta e só então entra em casa. A noite ainda está pela frente.",
          continueLabel: "Entrar em casa",
          activity: "Concluir o trajeto"
        }
      },
      {
        id: "return-home-from-school",
        label: "Sair da escola e voltar para casa",
        conditions: [{ type: "location", value: "school" }],
        effects: [
          { type: "advance_time", minutes: 60 },
          { type: "condition", condition: "energy", delta: -4 },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.tuesday-evening",
        outcome: {
          title: "A saída da escola",
          text: "Você atravessa o portão e completa o trajeto até casa. Chegar não significa que o dia acabou.",
          continueLabel: "Entrar em casa",
          activity: "Concluir o trajeto"
        }
      },
      {
        id: "continue-already-home",
        label: "Viver o restante da tarde em casa",
        conditions: [{ type: "location", value: "home" }],
        effects: [],
        nextNodeId: "prologue.tuesday-evening",
        outcome: {
          title: "A tarde continua",
          text: "Você já está em casa, mas ainda há tarefas, mensagens e convivência familiar antes do sono.",
          continueLabel: "Continuar a tarde",
          activity: "Viver o restante do dia"
        }
      }
    ]
  },
  {
    id: "prologue.tuesday-evening",
    moduleId: "prologue.first-week",
    title: "A terça-feira em casa",
    text: "A escolha da tarde encontra a família, as mensagens e o trabalho de sexta-feira. Nada disso desaparece apenas porque você chegou em casa.",
    activity: "Encerrar a tarde e a noite",
    nextCommitment: S.PRESENTATION,
    choices: [
      {
        id: "handle-tuesday-evening",
        label: "Comer, lidar com as conversas de casa e responder ao grupo",
        conditions: [{ type: "location", value: "home" }],
        effects: [
          { type: "knowledge", knowledge: "portuguese", delta: 1 },
          { type: "condition", condition: "stress", delta: 1 },
          { type: "set_clock", clock: { date: "2026-02-17", minuteOfDay: 21 * 60 + 15 } },
          { type: "flag", flag: "finishedTuesdayAtHome", value: true }
        ],
        nextNodeId: "prologue.tuesday-bedtime",
        outcome: {
          title: "A noite chega ao fim",
          text: "Você atravessa as conversas de casa, responde ao grupo e organiza o necessário. Só agora a terça-feira chega à hora de dormir.",
          continueLabel: "Preparar-se para dormir",
          activity: "Concluir a noite"
        }
      }
    ]
  },
  {
    id: "prologue.tuesday-bedtime",
    moduleId: "prologue.first-week",
    title: "O fim da terça-feira",
    text: "Você está em casa e não existe mais uma ação imediata aberta naquele dia.",
    activity: "Dormir depois de encerrar o dia",
    nextCommitment: S.PRESENTATION,
    timeBoundary: "day-end",
    choices: [
      {
        id: "sleep-tuesday",
        label: "Apagar a luz e dormir",
        conditions: [{ type: "location", value: "home" }],
        effects: [
          { type: "condition", condition: "energy", delta: 10 },
          {
            type: "time_transition",
            kind: "sleep",
            requiredLocation: "home",
            clock: { date: "2026-02-18", minuteOfDay: 6 * 60 + 30 }
          },
          { type: "flag", flag: "sleptTuesday", value: true }
        ],
        nextNodeId: "prologue.wednesday-morning",
        outcome: {
          title: "A terça-feira termina",
          text: "Você dorme. Somente depois disso o relógio avança para a manhã de quarta-feira.",
          continueLabel: "Acordar na quarta-feira",
          activity: "Começar um novo dia"
        }
      }
    ]
  },
  {
    id: "prologue.wednesday-morning",
    moduleId: "prologue.first-week",
    title: "A manhã de quarta-feira",
    text: "O despertador toca. Antes de descobrir o que circula pela turma, você precisa sair de casa e chegar à escola.",
    activity: "Ir para a escola",
    nextCommitment: S.PRESENTATION,
    choices: [
      {
        id: "go-to-school-wednesday",
        label: "Tomar café e seguir para a escola",
        conditions: [{ type: "location", value: "home" }],
        effects: [
          { type: "advance_time", minutes: 75 },
          { type: "condition", condition: "energy", delta: 3 },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.after-social-choice",
        outcome: {
          title: "De volta à escola",
          text: "Você completa o trajeto e atravessa o portão. Só agora percebe olhares e conversas sobre o dia anterior.",
          continueLabel: "Entrar na escola",
          activity: "Concluir o deslocamento"
        }
      }
    ]
  }
];