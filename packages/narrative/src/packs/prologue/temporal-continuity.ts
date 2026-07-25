import type {
  Effect,
  GameClock,
  StoryChoice,
  StoryNode
} from "@vidas-possiveis/game-engine";

type ChoiceOutcome = NonNullable<StoryChoice["outcome"]>;

interface LongTemporalRoute {
  readonly id: string;
  readonly flag: string;
  readonly targetClock: GameClock;
  readonly targetLocation?: string;
  readonly destinationNodeId: string;
}

const GOSSIP_CHOICES_THAT_FINISH_AT_SCHOOL = new Set([
  "talk-privately",
  "ignore-gossip",
  "answer-with-humor",
  "ask-coordination"
]);

function withoutTeleport(effects: readonly Effect[]): readonly Effect[] {
  return effects.filter(
    (effect) => effect.type !== "set_clock" && effect.type !== "set_location"
  );
}

function rewireAfterSchoolChoice(choice: StoryChoice): StoryChoice {
  const outcomes: Record<string, ChoiceOutcome> = {
    "accept-by-bus": {
      title: "O convite ocupa parte da tarde",
      text: "Você aceita o convite e completa o deslocamento até o encontro. A escolha aconteceu, mas a terça-feira ainda não terminou e você ainda precisa voltar para casa.",
      continueLabel: "Concluir a tarde",
      activity: "Organizar a volta para casa"
    },
    "accept-by-app": {
      title: "Um trajeto mais rápido",
      text: "O carro reduz o tempo até o encontro. Depois de chegar e viver aquele momento, ainda existe o caminho de volta e o restante da terça-feira.",
      continueLabel: "Concluir a tarde",
      activity: "Organizar a volta para casa"
    },
    "negotiate-time": {
      title: "Um encontro mais curto",
      text: "Você combina um limite para o encontro sem desaparecer da escola nem avançar para outro dia. Primeiro ainda precisa concluir a tarde e voltar para casa.",
      continueLabel: "Concluir a tarde",
      activity: "Organizar a volta para casa"
    },
    "decline-and-explain": {
      title: "O convite termina na escola",
      text: "Você explica por que não irá. A conversa termina ali, mas você ainda está na escola e precisa sair, completar o trajeto e viver o restante da terça-feira.",
      continueLabel: "Sair da escola",
      activity: "Voltar para casa"
    },
    "lie-and-go": {
      title: "A saída acontece, a consequência fica",
      text: "Você sai mesmo assim. O passeio acontece, mas a mentira e a responsabilidade familiar continuam esperando quando você voltar para casa.",
      continueLabel: "Concluir a tarde",
      activity: "Organizar a volta para casa"
    }
  };
  const outcome = outcomes[choice.id];
  if (!outcome) return choice;

  const effects =
    choice.id === "decline-and-explain"
      ? choice.effects.filter((effect) => effect.type !== "set_location")
      : choice.effects;

  return {
    ...choice,
    effects,
    nextNodeId: "prologue.tuesday-route-home",
    outcome
  };
}

function rewireGossipChoice(choice: StoryChoice): StoryChoice {
  if (!GOSSIP_CHOICES_THAT_FINISH_AT_SCHOOL.has(choice.id)) return choice;

  const outcomes: Record<string, ChoiceOutcome> = {
    "talk-privately": {
      title: "Uma conversa sem plateia",
      text: "Você chama {rivalName} para um canto e fala sem a turma ao redor. A conversa reduz a exposição daquele momento, mas o sinal ainda não tocou e o restante das aulas continua.",
      continueLabel: "Voltar para a aula",
      activity: "Retomar o dia escolar"
    },
    "ignore-gossip": {
      title: "A fofoca perde sua atenção",
      text: "Você não responde e volta sua atenção para a aula. Algumas pessoas continuam comentando por alguns minutos, até o professor pedir silêncio. O assunto não controla mais a cena, mas a manhã escolar ainda precisa terminar.",
      continueLabel: "Seguir com as aulas",
      activity: "Retomar o dia escolar"
    },
    "answer-with-humor": {
      title: "Uma resposta que muda o tom",
      text: "Sua resposta provoca algumas risadas sem confirmar a história. A tensão diminui e o professor chama a turma de volta para a atividade. Depois disso, o restante da manhã continua normalmente.",
      continueLabel: "Seguir com as aulas",
      activity: "Retomar o dia escolar"
    },
    "ask-coordination": {
      title: "A escola entra na conversa",
      text: "Você procura a coordenação e explica a exposição. Um funcionário conversa separadamente com as pessoas envolvidas e orienta a turma a interromper os comentários. Quando você retorna, ainda há aulas antes da saída.",
      continueLabel: "Voltar para a sala",
      activity: "Retomar o dia escolar"
    }
  };
  const outcome = outcomes[choice.id];
  if (!outcome) return choice;

  return {
    ...choice,
    nextNodeId: "prologue.school-day-continuation",
    outcome
  };
}

function rewireFightConsequenceChoice(choice: StoryChoice): StoryChoice {
  const outcomes: Record<string, ChoiceOutcome> = {
    "tell-group-about-fight": {
      title: "O grupo recebe a verdade",
      text: "Você conta que se envolveu em uma briga e que não voltará para as aulas naquele turno. As respostas misturam preocupação e irritação. A escola ainda não liberou sua saída: primeiro um responsável precisa chegar.",
      continueLabel: "Aguardar a liberação",
      activity: "Esperar a saída da escola"
    },
    "hide-fight-from-group": {
      title: "Uma explicação incompleta",
      text: "Você diz ao grupo apenas que precisou sair das aulas. As mensagens da turma continuam circulando, e sua versão pode ser desmentida depois. Por enquanto, você permanece na escola aguardando um responsável.",
      continueLabel: "Aguardar a liberação",
      activity: "Esperar a saída da escola"
    },
    "apologize-after-fight": {
      title: "Um pedido que não apaga a briga",
      text: "Você pede desculpas a {rivalName} antes de serem mantidos novamente em espaços separados. Não há reconciliação imediata, e a ocorrência continua registrada. Depois disso, você ainda precisa esperar um responsável chegar para sair.",
      continueLabel: "Aguardar a liberação",
      activity: "Esperar a saída da escola"
    }
  };
  const outcome = outcomes[choice.id];
  if (!outcome) return choice;

  return {
    ...choice,
    effects: [...withoutTeleport(choice.effects), { type: "advance_time", minutes: 30 }],
    nextNodeId: "prologue.fight-school-exit",
    outcome
  };
}

function rewireFightClosureChoice(choice: StoryChoice): StoryChoice {
  const outcomes: Record<string, ChoiceOutcome> = {
    "resume-presentation-after-fight": {
      title: "O trabalho volta para a tela",
      text: "Depois da conversa em casa, você abre as mensagens do grupo, entende o que mudou no ensaio e retoma sua parte. A briga não desapareceu, mas as consequências imediatas daquele dia foram enfrentadas. Agora falta encerrar a noite e dormir.",
      continueLabel: "Preparar-se para dormir",
      activity: "Encerrar a noite depois da briga"
    },
    "rest-after-fight": {
      title: "O corpo pede pausa",
      text: "Você cuida dos machucados, responde apenas ao necessário e combina de revisar no dia seguinte. A escola já interveio e a família foi avisada. A noite ainda não pode virar outro dia antes de você ir dormir.",
      continueLabel: "Preparar-se para dormir",
      activity: "Encerrar a noite descansando"
    }
  };
  const outcome = outcomes[choice.id];
  if (!outcome) return choice;

  return {
    ...choice,
    nextNodeId: "prologue.wednesday-bedtime",
    outcome
  };
}

function compatibilityTransitionNode(node: StoryNode): StoryNode {
  return {
    ...node,
    title: "Antes de os dias avançarem",
    text: "A história ainda precisa respeitar onde você está e o que falta acontecer neste dia. O tempo não avançará diretamente para sexta-feira.",
    activity: "Retomar o encerramento correto do dia",
    choices: [
      {
        id: "resume-current-school-day",
        label: "Concluir as aulas antes de voltar para casa",
        conditions: [{ type: "location", value: "school" }],
        effects: [],
        nextNodeId: "prologue.school-day-continuation",
        outcome: {
          title: "O dia continua na escola",
          text: "Você permanece onde está. Antes de pensar nos próximos dias, ainda existem as aulas restantes, a saída e o deslocamento para casa.",
          continueLabel: "Concluir as aulas",
          activity: "Retomar o dia escolar"
        }
      },
      {
        id: "resume-current-home-day",
        label: "Viver o restante do dia em casa",
        conditions: [{ type: "location", value: "home" }],
        effects: [],
        nextNodeId: "prologue.home-evening-before-presentation",
        outcome: {
          title: "O dia continua em casa",
          text: "Você já chegou em casa, mas isso não significa que dormiu. A tarde, a noite e as consequências domésticas ainda precisam acontecer antes de qualquer novo dia.",
          continueLabel: "Continuar o dia em casa",
          activity: "Retomar a tarde e a noite"
        }
      },
      {
        id: "finish-street-trip-home",
        label: "Concluir o trajeto até casa",
        conditions: [{ type: "location", value: "street" }],
        effects: [
          { type: "advance_time", minutes: 40 },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.home-evening-before-presentation",
        outcome: {
          title: "O trajeto termina",
          text: "Você continua pelas ruas até chegar ao seu bairro e entrar em casa. Somente agora as decisões da tarde e da noite podem acontecer.",
          continueLabel: "Entrar em casa",
          activity: "Concluir o deslocamento"
        }
      },
      {
        id: "finish-transport-trip-home",
        label: "Descer do transporte e chegar em casa",
        conditions: [{ type: "location", value: "public_transport" }],
        effects: [
          { type: "advance_time", minutes: 30 },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.home-evening-before-presentation",
        outcome: {
          title: "A viagem termina em casa",
          text: "Você completa o trajeto, desce perto do seu bairro e caminha até casa. O relógio continua no mesmo dia, com a tarde e a noite ainda pela frente.",
          continueLabel: "Entrar em casa",
          activity: "Concluir o deslocamento"
        }
      }
    ]
  };
}

function applySpecificContinuity(node: StoryNode): StoryNode {
  if (node.id === "prologue.after-school-invite") {
    return { ...node, choices: node.choices.map(rewireAfterSchoolChoice) };
  }
  if (node.id === "prologue.after-social-choice") {
    return { ...node, choices: node.choices.map(rewireGossipChoice) };
  }
  if (node.id === "prologue.conflict-closure") {
    return {
      ...node,
      choices: node.choices.map((choice) =>
        choice.id === "return-after-conflict"
          ? {
              ...choice,
              nextNodeId: "prologue.school-day-continuation",
              outcome: {
                title: "A aula recomeça",
                text: "Você se senta enquanto as últimas conversas diminuem. O conflito imediato terminou, mas o dia ainda não: a aula recomeça e o sinal da saída ainda está longe.",
                continueLabel: "Seguir com as aulas",
                activity: "Retomar o dia escolar"
              }
            }
          : choice
      )
    };
  }
  if (node.id === "prologue.fight-consequence") {
    return { ...node, choices: node.choices.map(rewireFightConsequenceChoice) };
  }
  if (node.id === "prologue.fight-closure") {
    return { ...node, choices: node.choices.map(rewireFightClosureChoice) };
  }
  if (node.id === "prologue.friday-transition") {
    return compatibilityTransitionNode(node);
  }
  return node;
}

function rewriteLongTemporalChoice(
  node: StoryNode,
  choice: StoryChoice,
  routes: LongTemporalRoute[]
): StoryChoice {
  const referenceDate = node.nextCommitment?.clock.date;
  const clockEffect = choice.effects.find(
    (effect) =>
      effect.type === "set_clock" &&
      (referenceDate === undefined || effect.clock.date !== referenceDate)
  );
  if (!clockEffect || clockEffect.type !== "set_clock") return choice;

  const locationEffect = choice.effects.find((effect) => effect.type === "set_location");
  const routeNumber = routes.length + 1;
  const route: LongTemporalRoute = {
    id: `long-route-${routeNumber}`,
    flag: `pendingLongTemporalRoute${routeNumber}`,
    targetClock: clockEffect.clock,
    destinationNodeId: choice.nextNodeId,
    ...(locationEffect?.type === "set_location"
      ? { targetLocation: locationEffect.location }
      : {})
  };
  routes.push(route);

  const existingText = choice.outcome?.text ?? "A decisão encontra uma consequência naquele momento.";
  return {
    ...choice,
    effects: [
      ...choice.effects.filter(
        (effect) => effect.type !== "set_clock" && effect.type !== "set_location"
      ),
      { type: "flag", flag: route.flag, value: true }
    ],
    nextNodeId: "prologue.long-transition-finish-day",
    outcome: {
      title: choice.outcome?.title ?? "O acontecimento termina",
      text: `${existingText} Antes que semanas ou meses avancem, o restante desse dia ainda precisa acontecer.`,
      continueLabel: "Concluir o restante do dia",
      activity: "Encerrar o dia antes da passagem do tempo"
    }
  };
}

function routeConditions(route: LongTemporalRoute) {
  return [{ type: "flag" as const, flag: route.flag, value: true }];
}

function buildLongTemporalBridgeNodes(routes: readonly LongTemporalRoute[]): readonly StoryNode[] {
  if (routes.length === 0) return [];

  return [
    {
      id: "prologue.long-transition-finish-day",
      moduleId: "prologue.temporal-bridges",
      title: "O restante do dia",
      text: "O acontecimento principal terminou, mas o relógio continua no mesmo dia. Ainda existem as atividades restantes, a saída e o momento de deixar esse local.",
      activity: "Concluir o dia antes de voltar para casa",
      choices: routes.map((route) => ({
        id: `finish-${route.id}`,
        label: "Concluir o que resta do dia",
        conditions: routeConditions(route),
        effects: [
          { type: "advance_time" as const, minutes: 90 },
          { type: "condition" as const, condition: "energy" as const, delta: -3 }
        ],
        nextNodeId: "prologue.long-transition-travel-home",
        outcome: {
          title: "O dia chega à saída",
          text: "As atividades restantes acontecem e o horário avança. Só depois disso chega o momento de iniciar o caminho de volta.",
          continueLabel: "Voltar para casa",
          activity: "Começar o deslocamento de volta"
        }
      }))
    },
    {
      id: "prologue.long-transition-travel-home",
      moduleId: "prologue.temporal-bridges",
      title: "O caminho de volta",
      text: "Chegar em casa exige um trajeto. O cenário muda aos poucos enquanto o personagem deixa o local do acontecimento e segue para o próprio bairro.",
      activity: "Concluir o deslocamento para casa",
      choices: routes.map((route) => ({
        id: `travel-${route.id}`,
        label: "Completar o trajeto até casa",
        conditions: routeConditions(route),
        effects: [
          { type: "advance_time" as const, minutes: 50 },
          { type: "set_location" as const, location: "home" }
        ],
        nextNodeId: "prologue.long-transition-evening",
        outcome: {
          title: "A chegada acontece no mesmo dia",
          text: "O trajeto termina quando você entra em casa. O relógio ainda não avançou para outra semana: primeiro existe uma noite para viver.",
          continueLabel: "Viver o restante da noite",
          activity: "Entrar em casa"
        }
      }))
    },
    {
      id: "prologue.long-transition-evening",
      moduleId: "prologue.temporal-bridges",
      title: "A noite em casa",
      text: "A chegada não encerra o dia sozinha. Comida, descanso, mensagens e convivência ocupam as horas seguintes até que não reste outra ação imediata aberta.",
      activity: "Encerrar a noite em casa",
      choices: routes.map((route) => ({
        id: `evening-${route.id}`,
        label: "Viver a noite e preparar-se para dormir",
        conditions: [
          ...routeConditions(route),
          { type: "location" as const, value: "home" }
        ],
        effects: [
          { type: "advance_time" as const, minutes: 180 },
          { type: "condition" as const, condition: "stress" as const, delta: -2 }
        ],
        nextNodeId: "prologue.long-transition-montage",
        outcome: {
          title: "O dia finalmente termina",
          text: "A noite passa pelas tarefas e conversas possíveis. Quando você se prepara para dormir, o dia está encerrado e não existe compromisso pendente naquele intervalo imediato.",
          continueLabel: "Dormir e acompanhar a passagem dos dias",
          activity: "Chegar ao fim do dia"
        }
      }))
    },
    {
      id: "prologue.long-transition-montage",
      moduleId: "prologue.temporal-bridges",
      title: "Os dias entre um acontecimento e outro",
      text: "Depois do sono, a rotina continua em dias que não trazem uma decisão decisiva: aulas, refeições, deslocamentos e conversas menores se repetem até o próximo acontecimento relevante.",
      activity: "Acompanhar uma passagem de tempo sem pular compromissos",
      timeBoundary: "montage",
      choices: routes.map((route) => {
        const morningMinute = Math.min(6 * 60 + 30, route.targetClock.minuteOfDay);
        return {
          id: `montage-${route.id}`,
          label: "Avançar pela rotina até o próximo acontecimento",
          conditions: [
            ...routeConditions(route),
            { type: "location" as const, value: "home" }
          ],
          effects: [
            {
              type: "time_transition" as const,
              kind: "montage" as const,
              requiredLocation: "home",
              clock: { date: route.targetClock.date, minuteOfDay: morningMinute }
            }
          ],
          nextNodeId: "prologue.long-transition-next-event",
          outcome: {
            title: "Uma nova data chega",
            text: "A passagem do tempo ocorre somente depois do encerramento do dia anterior. Na data do próximo acontecimento, você acorda em casa e ainda precisa chegar ao local certo.",
            continueLabel: "Começar o novo dia",
            activity: "Preparar-se para o próximo acontecimento"
          }
        };
      })
    },
    {
      id: "prologue.long-transition-next-event",
      moduleId: "prologue.temporal-bridges",
      title: "O próximo acontecimento",
      text: "A data chegou, mas o personagem ainda não apareceu magicamente em outro lugar. A manhã começa em casa e inclui o tempo necessário para alcançar o próximo cenário.",
      activity: "Chegar ao próximo acontecimento",
      choices: routes.map((route) => {
        const morningMinute = Math.min(6 * 60 + 30, route.targetClock.minuteOfDay);
        const minutesUntilEvent = Math.max(0, route.targetClock.minuteOfDay - morningMinute);
        return {
          id: `arrive-${route.id}`,
          label: "Preparar-se e seguir para o próximo compromisso",
          conditions: [
            ...routeConditions(route),
            { type: "location" as const, value: "home" }
          ],
          effects: [
            ...(minutesUntilEvent > 0
              ? [{ type: "advance_time" as const, minutes: minutesUntilEvent }]
              : []),
            ...(route.targetLocation && route.targetLocation !== "home"
              ? [{ type: "set_location" as const, location: route.targetLocation }]
              : []),
            { type: "flag" as const, flag: route.flag, value: false }
          ],
          nextNodeId: route.destinationNodeId,
          outcome: {
            title: "O deslocamento termina",
            text: "Você atravessa a manhã e completa o trajeto. Só agora o próximo acontecimento começa no horário e no local previstos.",
            continueLabel: "Entrar no próximo acontecimento",
            activity: "Concluir o deslocamento"
          }
        };
      })
    }
  ];
}

export function addTemporalContinuity(nodes: readonly StoryNode[]): readonly StoryNode[] {
  const specificallyRewired = nodes.map(applySpecificContinuity);
  const routes: LongTemporalRoute[] = [];
  const transformed = specificallyRewired.map((node) => ({
    ...node,
    choices: node.choices.map((choice) => rewriteLongTemporalChoice(node, choice, routes))
  }));

  return [...transformed, ...buildLongTemporalBridgeNodes(routes)];
}