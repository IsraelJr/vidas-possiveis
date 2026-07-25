import type { Effect, StoryChoice, StoryNode } from "@vidas-possiveis/game-engine";

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

function rewireGossipChoice(choice: StoryChoice): StoryChoice {
  if (!GOSSIP_CHOICES_THAT_FINISH_AT_SCHOOL.has(choice.id)) return choice;

  const outcomes: Record<string, StoryChoice["outcome"]> = {
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

  return {
    ...choice,
    nextNodeId: "prologue.school-day-continuation",
    outcome: outcomes[choice.id]
  };
}

function rewireFightConsequenceChoice(choice: StoryChoice): StoryChoice {
  const outcomes: Record<string, StoryChoice["outcome"]> = {
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

  return {
    ...choice,
    effects: [...withoutTeleport(choice.effects), { type: "advance_time", minutes: 30 }],
    nextNodeId: "prologue.fight-school-exit",
    outcome: outcomes[choice.id] ?? choice.outcome
  };
}

function rewireFightClosureChoice(choice: StoryChoice): StoryChoice {
  const outcomes: Record<string, StoryChoice["outcome"]> = {
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

  return {
    ...choice,
    nextNodeId: "prologue.wednesday-bedtime",
    outcome: outcomes[choice.id] ?? choice.outcome
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

export function addTemporalContinuity(nodes: readonly StoryNode[]): readonly StoryNode[] {
  return nodes.map((node) => {
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
  });
}