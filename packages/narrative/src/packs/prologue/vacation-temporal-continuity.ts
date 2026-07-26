import type { StoryNode } from "@vidas-possiveis/game-engine";

const VACATION_PATH_FLAG = "pendingVacationToThirdYear";

function stripDirectJump(node: StoryNode): StoryNode {
  if (node.id !== "prologue.vacation-transition") return node;

  return {
    ...node,
    choices: node.choices.map((choice) => ({
      ...choice,
      effects: [
        ...choice.effects.filter(
          (effect) => effect.type !== "set_clock" && effect.type !== "set_location"
        ),
        { type: "flag" as const, flag: VACATION_PATH_FLAG, value: true }
      ],
      nextNodeId: "prologue.vacation-return-home",
      outcome: {
        title: choice.outcome?.title ?? "A escolha para as férias",
        text: `${choice.outcome?.text ?? "Você decide como ocupar parte das férias."} O segundo ano terminou, mas fevereiro não começa no mesmo instante: primeiro você ainda precisa voltar para casa e encerrar aquele dia.`,
        continueLabel: "Voltar para casa",
        activity: "Encerrar o último dia letivo"
      }
    }))
  };
}

const vacationBridgeNodes: readonly StoryNode[] = [
  {
    id: "prologue.vacation-return-home",
    moduleId: "prologue.vacation",
    title: "O último caminho para casa daquele ano",
    text: "Você deixa a escola e percorre o caminho de volta pela última vez como estudante do segundo ano. O portão fica para trás, mas o dia ainda não terminou.",
    activity: "Voltar para casa depois do encerramento",
    choices: [
      {
        id: "arrive-home-for-vacation",
        label: "Concluir o trajeto e entrar em casa",
        conditions: [{ type: "flag", flag: VACATION_PATH_FLAG, value: true }],
        effects: [
          { type: "advance_time", minutes: 45 },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.vacation-first-night",
        outcome: {
          title: "A chegada encerra o caminho, não o dia",
          text: "Você chega em casa no começo da noite. A mochila fica num canto e a ausência de aula no dia seguinte muda o clima, mas ainda existem jantar, mensagens e descanso antes de dormir.",
          continueLabel: "Viver a primeira noite das férias",
          activity: "Chegar em casa"
        }
      }
    ]
  },
  {
    id: "prologue.vacation-first-night",
    moduleId: "prologue.vacation",
    title: "A primeira noite sem despertador",
    text: "Em casa, você janta, responde algumas mensagens e percebe que a rotina escolar realmente parou. O que escolheu para as férias começará nos próximos dias, não antes de esta noite terminar.",
    activity: "Encerrar o último dia letivo",
    choices: [
      {
        id: "prepare-vacation-sleep",
        label: "Guardar o material e preparar-se para dormir",
        conditions: [
          { type: "flag", flag: VACATION_PATH_FLAG, value: true },
          { type: "location", value: "home" }
        ],
        effects: [
          { type: "advance_time", minutes: 240 },
          { type: "condition", condition: "energy", delta: 4 },
          { type: "condition", condition: "stress", delta: -2 }
        ],
        nextNodeId: "prologue.vacation-montage",
        outcome: {
          title: "O segundo ano termina em casa",
          text: "A noite desacelera até você se deitar. O segundo ano não termina num corte repentino para fevereiro; ele termina quando você fecha os olhos em casa e as férias finalmente começam.",
          continueLabel: "Dormir e viver as férias",
          activity: "Dormir no início das férias"
        }
      }
    ]
  },
  {
    id: "prologue.vacation-montage",
    moduleId: "prologue.vacation",
    title: "As semanas fora da escola",
    text: "As férias têm dias completos: manhãs, refeições, deslocamentos, encontros, trabalho, treino ou descanso conforme suas escolhas. A rotina muda aos poucos até a véspera do terceiro ano.",
    activity: "Viver a passagem das férias",
    timeBoundary: "montage",
    choices: [
      {
        id: "live-vacation-until-third-year",
        label: "Acompanhar as férias até a manhã do terceiro ano",
        conditions: [
          { type: "flag", flag: VACATION_PATH_FLAG, value: true },
          { type: "location", value: "home" }
        ],
        effects: [
          {
            type: "time_transition",
            kind: "montage",
            requiredLocation: "home",
            clock: { date: "2027-02-08", minuteOfDay: 6 * 60 + 20 }
          }
        ],
        nextNodeId: "prologue.third-year-departure",
        outcome: {
          title: "A manhã do terceiro ano chega",
          text: "Depois de semanas vividas fora da escola, você acorda em casa na manhã do primeiro dia do terceiro ano. Ainda falta preparar-se e fazer o trajeto até a escola.",
          continueLabel: "Preparar-se para sair",
          activity: "Acordar para o terceiro ano"
        }
      }
    ]
  },
  {
    id: "prologue.third-year-departure",
    moduleId: "prologue.third-year-opening",
    title: "O caminho para o terceiro ano",
    text: "Você se arruma, confere o material e sai de casa. O terceiro ano só começa quando o trajeto termina e você atravessa novamente o portão da escola.",
    activity: "Ir para o primeiro dia do terceiro ano",
    choices: [
      {
        id: "arrive-for-third-year",
        label: "Concluir o trajeto até a escola",
        conditions: [
          { type: "flag", flag: VACATION_PATH_FLAG, value: true },
          { type: "location", value: "home" }
        ],
        effects: [
          { type: "advance_time", minutes: 50 },
          { type: "set_location", location: "school" },
          { type: "flag", flag: VACATION_PATH_FLAG, value: false }
        ],
        nextNodeId: "prologue.third-year-opening",
        outcome: {
          title: "O portão volta a aparecer",
          text: "O trajeto termina às 07:10. Você entra na escola, encontra os primeiros grupos no corredor e só então percebe o que mudou desde dezembro.",
          continueLabel: "Entrar no terceiro ano",
          activity: "Chegar à escola"
        }
      }
    ]
  }
];

export function addVacationTemporalContinuity(
  nodes: readonly StoryNode[]
): readonly StoryNode[] {
  return [...nodes.map(stripDirectJump), ...vacationBridgeNodes];
}
