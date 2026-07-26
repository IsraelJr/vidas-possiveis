import type { StoryNode } from "@vidas-possiveis/game-engine";
import * as S from "./shared";

export const dayClosureNodes: readonly StoryNode[] = [
  {
    id: "prologue.school-day-continuation",
    moduleId: "prologue.first-week",
    title: "O restante da manhã",
    text: "O assunto perde espaço quando a próxima aula começa. Ainda há explicações no quadro, tarefas para copiar e pessoas comentando em voz baixa, mas o dia escolar não terminou junto com a discussão.",
    activity: "Concluir as aulas da manhã",
    nextCommitment: S.PRESENTATION,
    choices: [
      {
        id: "finish-morning-classes",
        label: "Assistir às aulas restantes e esperar o sinal",
        conditions: [{ type: "location", value: "school" }],
        effects: [
          { type: "advance_time", minutes: 100 },
          { type: "condition", condition: "energy", delta: -4 },
          { type: "flag", flag: "finishedWednesdayClasses", value: true }
        ],
        nextNodeId: "prologue.school-dismissal",
        outcome: {
          title: "O sinal encerra as aulas",
          text: "Você atravessa o restante da manhã entre matéria, anotações e olhares ocasionais. Quando o sinal toca, a turma começa a guardar o material. Agora ainda falta decidir como voltar para casa.",
          continueLabel: "Sair da escola",
          activity: "Encerrar o turno escolar"
        }
      }
    ]
  },
  {
    id: "prologue.school-dismissal",
    moduleId: "prologue.first-week",
    title: "A saída da escola",
    text: "O portão está cheio e o movimento da rua já aumentou. Chegar em casa exige tempo: o ônibus custa dinheiro, enquanto ir a pé preserva o dinheiro e consome mais energia.",
    activity: "Voltar da escola para casa",
    nextCommitment: S.PRESENTATION,
    choices: [
      {
        id: "bus-home-wednesday",
        label: "Pegar o ônibus para casa",
        conditions: [
          { type: "location", value: "school" },
          { type: "money", operator: ">=", valueCents: 500 }
        ],
        effects: [
          { type: "money", deltaCents: -500 },
          { type: "advance_time", minutes: 45 },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.home-evening-before-presentation",
        outcome: {
          title: "O caminho de ônibus",
          text: "Você deixa a escola, espera no ponto e segue no ônibus até o seu bairro. O trajeto dá tempo para a tensão diminuir um pouco. Quando desce, caminha os últimos metros e entra em casa.",
          continueLabel: "Entrar em casa",
          activity: "Concluir o deslocamento de ônibus"
        }
      },
      {
        id: "walk-home-wednesday",
        label: "Voltar para casa a pé",
        conditions: [{ type: "location", value: "school" }],
        effects: [
          { type: "condition", condition: "energy", delta: -6 },
          { type: "advance_time", minutes: 80 },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.home-evening-before-presentation",
        outcome: {
          title: "Um caminho mais longo",
          text: "Você atravessa as ruas a pé, passa pelo comércio do bairro e continua até reconhecer a sua quadra. O caminho leva mais tempo e pesa nas pernas. Só depois de completar o trajeto você abre a porta de casa.",
          continueLabel: "Entrar em casa",
          activity: "Concluir o deslocamento a pé"
        }
      }
    ]
  },
  {
    id: "prologue.home-evening-before-presentation",
    moduleId: "prologue.first-week",
    title: "O restante do dia em casa",
    text: "Chegar em casa não encerra automaticamente o dia. Ainda há comida, mensagens, a convivência com a família e o trabalho de sexta-feira esperando uma decisão sua.",
    activity: "Organizar a tarde e a noite",
    nextCommitment: S.PRESENTATION,
    choices: [
      {
        id: "eat-talk-and-prepare",
        label: "Comer, conversar em casa e depois preparar a apresentação",
        conditions: [{ type: "location", value: "home" }],
        effects: [
          { type: "condition", condition: "energy", delta: 4 },
          { type: "condition", condition: "stress", delta: -2 },
          { type: "knowledge", knowledge: "portuguese", delta: 1 },
          { type: "set_clock", clock: { date: "2026-02-18", minuteOfDay: 21 * 60 + 45 } },
          { type: "flag", flag: "finishedWednesdayAtHome", value: true }
        ],
        nextNodeId: "prologue.wednesday-bedtime",
        outcome: {
          title: "A noite encontra algum ritmo",
          text: "Você come, participa da conversa em casa e só depois abre o material do grupo. As mensagens ainda chegam, mas sua parte fica mais organizada. Quando fecha a tela, a noite já está avançada e o próximo passo é decidir a hora de dormir.",
          continueLabel: "Preparar-se para dormir",
          activity: "Concluir as atividades da noite"
        }
      },
      {
        id: "rest-before-preparing",
        label: "Descansar primeiro e responder ao grupo mais tarde",
        conditions: [{ type: "location", value: "home" }],
        effects: [
          { type: "condition", condition: "energy", delta: 6 },
          { type: "condition", condition: "stress", delta: 1 },
          { type: "set_clock", clock: { date: "2026-02-18", minuteOfDay: 22 * 60 } },
          { type: "flag", flag: "finishedWednesdayAtHome", value: true }
        ],
        nextNodeId: "prologue.wednesday-bedtime",
        outcome: {
          title: "Uma pausa antes das mensagens",
          text: "Você descansa, toma banho e deixa o telefone de lado por algum tempo. Mais tarde, responde ao indispensável e combina os ajustes do dia seguinte. O dia finalmente chega ao ponto em que dormir faz sentido.",
          continueLabel: "Preparar-se para dormir",
          activity: "Encerrar a noite depois de descansar"
        }
      }
    ]
  },
  {
    id: "prologue.fight-school-exit",
    moduleId: "prologue.first-week",
    title: "A saída depois da ocorrência",
    text: "Você não é liberado sozinho como em um dia comum. Um responsável chega à escola, assina a ciência da ocorrência e acompanha você até a saída. A conversa pode começar ali ou ficar presa durante o trajeto.",
    activity: "Sair da escola acompanhado",
    nextCommitment: S.PRESENTATION,
    choices: [
      {
        id: "talk-on-way-home-after-fight",
        label: "Começar a explicar durante o caminho para casa",
        conditions: [{ type: "location", value: "school" }],
        effects: [
          { type: "condition", condition: "stress", delta: -1 },
          { type: "advance_time", minutes: 50 },
          { type: "set_location", location: "home" },
          { type: "flag", flag: "talkedDuringFightCommute", value: true }
        ],
        nextNodeId: "prologue.fight-home-conversation",
        outcome: {
          title: "A conversa começa no trajeto",
          text: "Vocês deixam a escola juntos. No caminho, você tenta organizar os fatos enquanto o responsável faz perguntas curtas. A conversa não termina na rua: ao chegar em casa, ainda será preciso encarar a versão completa e as consequências familiares.",
          continueLabel: "Entrar em casa",
          activity: "Chegar em casa acompanhado"
        }
      },
      {
        id: "stay-silent-on-way-home-after-fight",
        label: "Fazer o trajeto em silêncio",
        conditions: [{ type: "location", value: "school" }],
        effects: [
          { type: "condition", condition: "stress", delta: 3 },
          { type: "advance_time", minutes: 50 },
          { type: "set_location", location: "home" },
          { type: "flag", flag: "silentDuringFightCommute", value: true }
        ],
        nextNodeId: "prologue.fight-home-conversation",
        outcome: {
          title: "O silêncio ocupa o caminho",
          text: "Vocês saem da escola e fazem o trajeto quase sem palavras. O silêncio não resolve a ocorrência nem apaga as perguntas. Quando a porta de casa se fecha, a conversa que foi adiada precisa finalmente acontecer.",
          continueLabel: "Entrar em casa",
          activity: "Chegar em casa sem explicar ainda"
        }
      }
    ]
  },
  {
    id: "prologue.fight-home-conversation",
    moduleId: "prologue.first-week",
    title: "A conversa em casa",
    text: "A ocorrência está sobre a mesa, junto com a preocupação pelos machucados e pela reação da escola. Agora não há professor nem turma por perto: sua família quer ouvir o que aconteceu e saber como você pretende lidar com isso.",
    activity: "Responder à família depois da briga",
    nextCommitment: S.PRESENTATION,
    choices: [
      {
        id: "admit-at-home-after-fight",
        label: "Contar a sequência completa e assumir sua parte",
        conditions: [{ type: "location", value: "home" }],
        effects: [
          { type: "attribute", attribute: "selfControl", delta: 1 },
          { type: "condition", condition: "stress", delta: -2 },
          { type: "set_clock", clock: { date: "2026-02-18", minuteOfDay: 18 * 60 + 30 } },
          { type: "flag", flag: "admittedFightAtHome", value: true }
        ],
        nextNodeId: "prologue.fight-closure",
        outcome: {
          title: "Uma conversa difícil, mas completa",
          text: "Você conta como a provocação cresceu, admite o momento em que perdeu o controle e ouve uma reação dura. A família não trata a agressão como algo pequeno, mas a conversa chega a uma conclusão prática: cuidar dos machucados, acompanhar a escola e evitar uma nova escalada.",
          continueLabel: "Cuidar do restante da noite",
          activity: "Concluir a conversa familiar"
        }
      },
      {
        id: "minimize-at-home-after-fight",
        label: "Diminuir sua responsabilidade e insistir que não foi tão grave",
        conditions: [{ type: "location", value: "home" }],
        effects: [
          { type: "condition", condition: "stress", delta: 4 },
          { type: "set_clock", clock: { date: "2026-02-18", minuteOfDay: 19 * 60 } },
          { type: "flag", flag: "minimizedFightAtHome", value: true }
        ],
        nextNodeId: "prologue.fight-closure",
        outcome: {
          title: "A conversa se prolonga",
          text: "Você tenta reduzir a gravidade da briga, mas a ligação da escola e os machucados contradizem parte da sua fala. A conversa dura mais, fica mais tensa e termina sem confiança completa na sua versão.",
          continueLabel: "Cuidar do restante da noite",
          activity: "Encerrar uma conversa familiar tensa"
        }
      },
      {
        id: "stay-silent-at-home-after-fight",
        label: "Ouvir a família e responder apenas o necessário",
        conditions: [{ type: "location", value: "home" }],
        effects: [
          { type: "condition", condition: "stress", delta: 3 },
          { type: "set_clock", clock: { date: "2026-02-18", minuteOfDay: 18 * 60 + 45 } },
          { type: "flag", flag: "silentAboutFightAtHome", value: true }
        ],
        nextNodeId: "prologue.fight-closure",
        outcome: {
          title: "Poucas respostas",
          text: "Você ouve as cobranças e responde apenas quando não há como evitar. A família define cuidados e acompanhamento mesmo sem conhecer todos os detalhes. A discussão termina, mas algumas perguntas permanecem para depois.",
          continueLabel: "Cuidar do restante da noite",
          activity: "Passar pela conversa sem se abrir"
        }
      }
    ]
  },
  {
    id: "prologue.wednesday-bedtime",
    moduleId: "prologue.first-week",
    title: "O fim da quarta-feira",
    text: "Você já chegou em casa, viveu as consequências daquele dia e não há mais nenhuma ação imediata aberta. O quarto está silencioso e o despertador precisa ser preparado para a manhã seguinte.",
    activity: "Dormir depois de encerrar o dia",
    nextCommitment: S.PRESENTATION,
    timeBoundary: "day-end",
    choices: [
      {
        id: "sleep-wednesday",
        label: "Guardar o telefone e dormir",
        conditions: [{ type: "location", value: "home" }],
        effects: [
          { type: "condition", condition: "energy", delta: 10 },
          { type: "condition", condition: "stress", delta: -3 },
          {
            type: "time_transition",
            kind: "sleep",
            requiredLocation: "home",
            clock: { date: "2026-02-19", minuteOfDay: 6 * 60 + 30 }
          },
          { type: "flag", flag: "sleptWednesday", value: true }
        ],
        nextNodeId: "prologue.thursday-morning",
        outcome: {
          title: "A quarta-feira termina",
          text: "Você deixa o telefone de lado, apaga a luz e dorme. Somente depois do descanso o relógio avança para a manhã de quinta-feira.",
          continueLabel: "Acordar na quinta-feira",
          activity: "Começar um novo dia"
        }
      }
    ]
  },
  {
    id: "prologue.thursday-morning",
    moduleId: "prologue.first-week",
    title: "Quinta-feira pela manhã",
    text: "O despertador toca às 06:30. A apresentação será no dia seguinte, mas antes disso existe uma quinta-feira inteira de aulas e preparação.",
    activity: "Começar a quinta-feira",
    nextCommitment: S.PRESENTATION,
    choices: [
      {
        id: "bus-to-school-thursday",
        label: "Tomar café e pegar o ônibus para a escola",
        conditions: [
          { type: "location", value: "home" },
          { type: "money", operator: ">=", valueCents: 500 }
        ],
        effects: [
          { type: "money", deltaCents: -500 },
          { type: "condition", condition: "energy", delta: 4 },
          { type: "advance_time", minutes: 70 },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.thursday-school-day",
        outcome: {
          title: "De volta à escola",
          text: "Você toma café, caminha até o ponto e segue no ônibus. Ao atravessar o portão, a quinta-feira começa de verdade, com aulas e o grupo ainda precisando ajustar a apresentação.",
          continueLabel: "Entrar na escola",
          activity: "Concluir o deslocamento da manhã"
        }
      },
      {
        id: "walk-to-school-thursday",
        label: "Sair cedo e ir a pé para a escola",
        conditions: [{ type: "location", value: "home" }],
        effects: [
          { type: "condition", condition: "energy", delta: -5 },
          { type: "advance_time", minutes: 85 },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.thursday-school-day",
        outcome: {
          title: "Uma caminhada até a escola",
          text: "Você sai cedo e percorre o caminho a pé. Quando chega, o movimento no portão já começou e ainda há alguns minutos antes da primeira aula.",
          continueLabel: "Entrar na escola",
          activity: "Concluir a caminhada da manhã"
        }
      }
    ]
  },
  {
    id: "prologue.thursday-school-day",
    moduleId: "prologue.first-week",
    title: "A quinta-feira na escola",
    text: "As aulas ocupam a manhã, e o trabalho de sexta aparece nos intervalos. O grupo pode fazer uma revisão organizada ou apenas conferir o indispensável antes do sinal.",
    activity: "Estudar e preparar a apresentação",
    nextCommitment: S.PRESENTATION,
    contextPersonIds: [S.GROUP],
    choices: [
      {
        id: "rehearse-thursday",
        label: "Usar o intervalo para ensaiar com o grupo",
        conditions: [{ type: "location", value: "school" }],
        effects: [
          { type: "knowledge", knowledge: "portuguese", delta: 2 },
          { type: "relationship", personId: S.GROUP, dimension: "trust", delta: 1 },
          { type: "condition", condition: "energy", delta: -5 },
          { type: "set_clock", clock: { date: "2026-02-19", minuteOfDay: 12 * 60 } },
          { type: "flag", flag: "rehearsedThursday", value: true }
        ],
        nextNodeId: "prologue.thursday-dismissal",
        outcome: {
          title: "Um ensaio no intervalo",
          text: "O grupo encontra um canto, repassa a ordem das falas e corrige dois pontos dos slides. Depois, as últimas aulas continuam até o sinal do meio-dia.",
          continueLabel: "Sair da escola",
          activity: "Concluir as aulas de quinta-feira"
        }
      },
      {
        id: "basic-review-thursday",
        label: "Conferir apenas sua parte e acompanhar as aulas",
        conditions: [{ type: "location", value: "school" }],
        effects: [
          { type: "knowledge", knowledge: "portuguese", delta: 1 },
          { type: "condition", condition: "energy", delta: -3 },
          { type: "set_clock", clock: { date: "2026-02-19", minuteOfDay: 12 * 60 } },
          { type: "flag", flag: "reviewedThursday", value: true }
        ],
        nextNodeId: "prologue.thursday-dismissal",
        outcome: {
          title: "Uma revisão curta",
          text: "Você confere sua parte, responde algumas mensagens e volta para as aulas. Ao meio-dia, o sinal encerra o turno e ainda falta o trajeto de volta para casa.",
          continueLabel: "Sair da escola",
          activity: "Concluir as aulas de quinta-feira"
        }
      }
    ]
  },
  {
    id: "prologue.thursday-dismissal",
    moduleId: "prologue.first-week",
    title: "A volta para casa na quinta-feira",
    text: "O portão se abre e o grupo se dispersa. A apresentação está próxima, mas primeiro você precisa completar o deslocamento de volta para casa.",
    activity: "Voltar para casa",
    nextCommitment: S.PRESENTATION,
    choices: [
      {
        id: "bus-home-thursday",
        label: "Voltar de ônibus",
        conditions: [
          { type: "location", value: "school" },
          { type: "money", operator: ">=", valueCents: 500 }
        ],
        effects: [
          { type: "money", deltaCents: -500 },
          { type: "advance_time", minutes: 45 },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.thursday-evening",
        outcome: {
          title: "O ônibus de volta",
          text: "Você espera no ponto, embarca e atravessa o bairro até chegar perto de casa. O deslocamento termina antes de qualquer decisão sobre a noite.",
          continueLabel: "Entrar em casa",
          activity: "Concluir o trajeto de ônibus"
        }
      },
      {
        id: "walk-home-thursday",
        label: "Voltar a pé",
        conditions: [{ type: "location", value: "school" }],
        effects: [
          { type: "condition", condition: "energy", delta: -5 },
          { type: "advance_time", minutes: 80 },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.thursday-evening",
        outcome: {
          title: "A caminhada de volta",
          text: "Você percorre o caminho até o seu bairro e chega cansado. A porta de casa marca o fim do deslocamento, não o fim automático do dia.",
          continueLabel: "Entrar em casa",
          activity: "Concluir a caminhada de volta"
        }
      }
    ]
  },
  {
    id: "prologue.thursday-evening",
    moduleId: "prologue.first-week",
    title: "A véspera da apresentação",
    text: "Em casa, a quinta-feira ainda tem algumas horas. Você pode fazer uma revisão final ou preservar energia, mas em ambos os casos precisa encerrar a noite antes de dormir.",
    activity: "Viver a noite de quinta-feira",
    nextCommitment: S.PRESENTATION,
    choices: [
      {
        id: "final-review-thursday-evening",
        label: "Fazer uma revisão final e separar o material",
        conditions: [{ type: "location", value: "home" }],
        effects: [
          { type: "knowledge", knowledge: "portuguese", delta: 1 },
          { type: "condition", condition: "energy", delta: -3 },
          { type: "set_clock", clock: { date: "2026-02-19", minuteOfDay: 22 * 60 } },
          { type: "flag", flag: "preparedNightBeforePresentation", value: true }
        ],
        nextNodeId: "prologue.bedtime-before-presentation",
        outcome: {
          title: "Material separado",
          text: "Você revisa sua fala, confere os arquivos e deixa tudo separado para a manhã. A véspera chega ao fim sem outra tarefa urgente antes do sono.",
          continueLabel: "Ir dormir",
          activity: "Encerrar a preparação da véspera"
        }
      },
      {
        id: "rest-thursday-evening",
        label: "Comer, descansar e evitar estudar até tarde",
        conditions: [{ type: "location", value: "home" }],
        effects: [
          { type: "condition", condition: "energy", delta: 6 },
          { type: "condition", condition: "stress", delta: -2 },
          { type: "set_clock", clock: { date: "2026-02-19", minuteOfDay: 21 * 60 + 30 } },
          { type: "flag", flag: "restedNightBeforePresentation", value: true }
        ],
        nextNodeId: "prologue.bedtime-before-presentation",
        outcome: {
          title: "Uma noite mais leve",
          text: "Você come, descansa e responde apenas ao necessário. Quando se prepara para dormir, o dia está encerrado e a apresentação continua marcada para a manhã seguinte.",
          continueLabel: "Ir dormir",
          activity: "Encerrar a noite descansando"
        }
      }
    ]
  },
  {
    id: "prologue.bedtime-before-presentation",
    moduleId: "prologue.first-week",
    title: "Dormir antes da apresentação",
    text: "A quinta-feira terminou, você está em casa e não existe outra ação imediata antes da apresentação. O despertador está programado para 06:30.",
    activity: "Dormir antes do compromisso",
    nextCommitment: S.PRESENTATION,
    timeBoundary: "day-end",
    choices: [
      {
        id: "sleep-before-presentation",
        label: "Apagar a luz e dormir",
        conditions: [{ type: "location", value: "home" }],
        effects: [
          { type: "condition", condition: "energy", delta: 10 },
          { type: "condition", condition: "stress", delta: -3 },
          {
            type: "time_transition",
            kind: "sleep",
            requiredLocation: "home",
            clock: { date: "2026-02-20", minuteOfDay: 6 * 60 + 30 }
          },
          { type: "flag", flag: "sleptBeforePresentation", value: true }
        ],
        nextNodeId: "prologue.presentation-morning",
        outcome: {
          title: "A manhã de sexta-feira",
          text: "Você dorme depois de concluir a quinta-feira. Às 06:30, o despertador toca e a apresentação finalmente se torna o próximo compromisso do dia.",
          continueLabel: "Levantar na sexta-feira",
          activity: "Acordar para a apresentação"
        }
      }
    ]
  }
];