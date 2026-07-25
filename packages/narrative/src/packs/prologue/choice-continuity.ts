import type {
  NarrativeChoiceOutcome,
  StoryChoice,
  StoryNode
} from "@vidas-possiveis/game-engine";

const continuityOutcomes: Readonly<Record<string, NarrativeChoiceOutcome>> = {
  "breakfast-bus": {
    title: "A manhã começa de verdade",
    text: "Você toma o café sem correr, confere a mochila e sai a tempo. O ônibus leva parte do dinheiro da semana, mas também deixa alguns minutos de margem antes da primeira aula. Quando desce perto do portão, a escola ainda está acordando.",
    continueLabel: "Entrar na escola",
    activity: "Ir para a escola de ônibus"
  },
  "quick-breakfast-early-bus": {
    title: "Entre uma mordida e o portão",
    text: "Você come depressa, fecha a mochila e alcança o ônibus anterior. A manhã começa acelerada, mas a escola ainda está relativamente vazia quando você chega. Há alguns minutos livres antes do sinal.",
    continueLabel: "Entrar no pátio",
    activity: "Chegar cedo à escola"
  },
  "sleep-and-app": {
    title: "Mais alguns minutos",
    text: "Você adia o despertador, dorme um pouco mais e chama um carro. O trajeto é rápido e confortável, mas o valor descontado do dinheiro da semana aparece na tela antes mesmo de você alcançar o portão. Ao descer, o movimento no pátio já começou.",
    continueLabel: "Entrar na escola",
    activity: "Chegar de carro à escola"
  },
  "skip-breakfast-bus": {
    title: "Sair antes da fome pesar",
    text: "Você fecha a mochila, deixa o café para trás e segue para o ponto. O ônibus chega a tempo. Seu corpo, porém, percebe a escolha antes de a primeira aula começar. Quando passa pelo portão, o cheiro da cantina torna a fome mais difícil de ignorar.",
    continueLabel: "Entrar no pátio",
    activity: "Ir para a escola sem comer"
  },
  "review-before-class": {
    title: "Alguns minutos com o caderno",
    text: "Você procura um lugar mais quieto, abre o caderno de Português e relê as últimas anotações. Uma frase que parecia confusa começa a fazer sentido. Quando o sinal toca, você fecha o caderno e entra na sala com a matéria ainda fresca.",
    continueLabel: "Entrar na sala",
    activity: "Revisar antes da aula"
  },
  "talk-before-class": {
    title: "Antes do sinal",
    text: "Você atravessa o pátio e se aproxima de {friendName}. A conversa começa com horários e professores, passa por quem caiu na mesma turma e termina numa piada que faz o tempo andar mais rápido. Quando o sinal toca, vocês entram juntos.",
    continueLabel: "Entrar com {friendName}",
    activity: "Conversar antes da aula"
  },
  "wait-quietly": {
    title: "Um pouco de silêncio",
    text: "Você escolhe um lugar perto da parede e deixa as conversas dos outros passarem sem participar. Por alguns minutos, ninguém pede nada de você. Quando o sinal toca, você guarda o celular, levanta e entra na sala com menos pressa do que o restante da turma.",
    continueLabel: "Entrar na sala",
    activity: "Esperar o sinal em silêncio"
  },
  "ask-preference": {
    title: "Uma pergunta antes da divisão",
    text: "Você pergunta a {groupMateName} qual parte prefere fazer. A resposta não resolve tudo, mas muda o tom da conversa: em vez de receber uma tarefa pronta, a pessoa precisa se comprometer diante do grupo. O sinal do intervalo interrompe a divisão, e vocês deixam a sala ainda discutindo os detalhes.",
    continueLabel: "Seguir para o intervalo",
    activity: "Combinar o trabalho em grupo"
  },
  "organize-immediately": {
    title: "A folha ganha nomes",
    text: "Você puxa a folha para o centro da mesa e começa a distribuir as partes. O grupo aceita a organização, embora {groupMateName} demore um pouco mais para concordar. Quando a professora encerra a aula, todos saem com uma tarefa definida e seguem para o pátio.",
    continueLabel: "Ir para o intervalo",
    activity: "Organizar o grupo"
  },
  "wait-group": {
    title: "Ninguém começa de imediato",
    text: "Você espera que outra pessoa tome a iniciativa. Alguns segundos viram uma conversa atravessada até alguém finalmente puxar a divisão das tarefas. O acordo sai sem muita clareza sobre quem vai cobrar os prazos. O sinal toca, e o grupo leva essa incerteza para o intervalo.",
    continueLabel: "Ir para o intervalo",
    activity: "Acompanhar a divisão do trabalho"
  },
  "school-meal": {
    title: "A bandeja no balcão",
    text: "Você entra na fila da merenda, pega a bandeja e encontra um lugar no pátio. A comida não custa nada e devolve parte da energia da manhã. Quando o intervalo termina, você entrega a bandeja e segue para a quadra.",
    continueLabel: "Ir para a Educação Física",
    activity: "Comer a merenda"
  },
  "canteen-snack": {
    title: "O balcão da lanchonete",
    text: "Você compra um lanche e se junta a {friendName}. A conversa continua enquanto o dinheiro da semana diminui um pouco. O sinal do fim do intervalo interrompe a última mordida, e vocês correm para a quadra.",
    continueLabel: "Ir para a quadra",
    activity: "Comer na lanchonete"
  },
  "share-snack": {
    title: "Metade para cada um",
    text: "Você compra algo maior e divide com {friendName}. O gesto parece pequeno, mas muda o jeito como a pessoa se senta ao seu lado. Quando o sinal toca, vocês guardam as embalagens e seguem para a quadra.",
    continueLabel: "Ir para a Educação Física",
    activity: "Dividir o lanche"
  },
  "skip-food": {
    title: "Guardar o dinheiro",
    text: "Você decide não comer e mantém o dinheiro no bolso. O intervalo passa entre conversas e o cheiro da lanchonete. Quando chega a hora da Educação Física, a fome já não é apenas uma ideia. Mesmo assim, você acompanha a turma até a quadra.",
    continueLabel: "Ir para a quadra",
    activity: "Passar o intervalo sem comer"
  },
  "participate-seriously": {
    title: "Entrar no jogo",
    text: "Você participa com intensidade, corre até o fim de cada lance e sente o corpo responder. O apito encerra a atividade. Ainda recuperando o fôlego, você pega a mochila e vai direto para a sala, onde a turma espera por um professor que ainda não chegou.",
    continueLabel: "Entrar na sala",
    activity: "Voltar da Educação Física"
  },
  "participate-lightly": {
    title: "Guardar parte do fôlego",
    text: "Você participa sem disputar cada lance. Faz o necessário, acompanha a turma e preserva energia para o restante do dia. Quando a professora encerra a atividade, você volta para a sala com calma. Os colegas já se espalham pelas carteiras, mas o professor ainda não apareceu.",
    continueLabel: "Aguardar o professor",
    activity: "Voltar para a sala"
  },
  "help-classmate": {
    title: "Jogar olhando para o lado",
    text: "Você percebe a dificuldade de outra pessoa e reduz o ritmo para ajudar. A atividade fica menos competitiva e mais próxima. Depois de devolver o material, você passa rapidamente no banheiro para lavar as mãos. Quando corre para a sala, a turma já está dentro, mas o professor ainda não chegou.",
    continueLabel: "Entrar na sala",
    activity: "Passar no banheiro e voltar à sala"
  },
  "sit-out": {
    title: "Do lado de fora da quadra",
    text: "Você fica de fora e acompanha a atividade do banco. O corpo descansa, mas algumas pessoas percebem sua ausência. Como já está com suas coisas por perto, você sai antes da maior parte da turma e chega primeiro à sala. Alguns minutos passam, e a cadeira do professor continua vazia.",
    continueLabel: "Esperar na sala",
    activity: "Chegar cedo à próxima aula"
  },
  "ask-what-happened": {
    title: "Antes de julgar",
    text: "Você pergunta o que aconteceu. A cobrança no grupo desacelera, e {groupMateName} começa a escrever uma resposta mais longa. As mensagens chegam em partes. Quando a última aparece na tela, o atraso deixa de ser um problema abstrato e passa a ter uma pessoa e uma situação concreta por trás.",
    continueLabel: "Ler a explicação",
    activity: "Ouvir {groupMateName} antes de decidir"
  },
  "go-straight-to-decision": {
    title: "Decidir sem perguntar",
    text: "Você escolhe não prolongar a conversa e começa a formar uma opinião com o que já sabe. Antes que consiga responder, {groupMateName} percebe o rumo da discussão e envia uma mensagem explicando por que a parte não ficou pronta. Você lê até o fim, agora com uma versão concreta para avaliar.",
    continueLabel: "Avaliar a explicação",
    activity: "Ler a mensagem de {groupMateName}"
  }
};

const destinationTransitions: Readonly<Record<string, string>> = {
  "prologue.before-class": "Quando você atravessa o portão, ainda restam alguns minutos antes do sinal. O pátio oferece tempo para conversar, revisar alguma coisa ou apenas respirar.",
  "prologue.assignment": "O sinal toca, a turma entra e a professora de Português começa a organizar a primeira atividade importante do bimestre.",
  "prologue.interval": "A explicação termina junto com o sinal. Cadernos se fecham, cadeiras arrastam e o corredor leva a turma até o intervalo.",
  "prologue.physical-education": "O intervalo acaba. Você guarda o que está usando e acompanha a turma até a quadra, onde a professora já separa o material da atividade.",
  "prologue.class-gap": "A Educação Física termina e a turma volta para a sala. As carteiras enchem aos poucos, mas o professor da aula seguinte ainda não apareceu.",
  "prologue.afternoon-transition": "Quando o horário vago termina, o restante do turno passa entre aulas e conversas. Depois do último sinal, você volta para casa e retoma a rotina até o celular vibrar no fim da tarde.",
  "prologue.group-message": "Depois das aulas, você almoça, atravessa as tarefas de casa e tenta descansar. Às 16:00, as notificações do grupo começam a aparecer uma atrás da outra.",
  "prologue.group-explanation": "A conversa muda de ritmo. Em vez de cobrar uma resposta imediata, o grupo para para entender o que realmente aconteceu.",
  "prologue.work-location": "A decisão é enviada ao grupo. Com a situação de {groupMateName} encaminhada, ainda falta escolher onde todos vão juntar pesquisa, texto e apresentação.",
  "prologue.work-session": "O grupo combina o encontro e, quando chega o horário, cadernos, celulares e pesquisas finalmente ficam abertos no mesmo lugar.",
  "prologue.night-plan": "Quando o encontro termina, a noite já avançou. Antes de dormir, ainda resta decidir quanto esforço guardar para o dia seguinte."
};

const locationDestinations: Readonly<Record<string, string>> = {
  home: "casa",
  school: "a escola",
  library: "a biblioteca",
  work: "o trabalho",
  public_transport: "o transporte público",
  street: "a rua",
  shopping_mall: "o shopping",
  park: "o parque",
  party: "a festa",
  sports_field: "o campo de treino",
  graduation_hall: "a formatura"
};

function lowerFirst(value: string): string {
  if (value.length === 0) return value;
  return `${value.charAt(0).toLocaleLowerCase("pt-BR")}${value.slice(1)}`;
}

function cleanSentence(value: string): string {
  return value.trim().replace(/[.!?]+$/, "");
}

function variationIndex(choiceId: string): number {
  return [...choiceId].reduce((total, character) => total + character.charCodeAt(0), 0) % 4;
}

function naturalDestinationBridge(
  sourceNode: StoryNode,
  choice: StoryChoice,
  targetNode: StoryNode | undefined
): string {
  const authoredDestination = destinationTransitions[choice.nextNodeId];
  if (authoredDestination) return authoredDestination;

  if (choice.skillCheck) {
    return "A tentativa se desenrola diante das outras pessoas. O resultado muda o clima do lugar e define como você entra no que vem depois.";
  }

  const locationEffect = choice.effects.find((effect) => effect.type === "set_location");
  const targetActivity = cleanSentence(lowerFirst(targetNode?.activity ?? "seguir com o dia"));
  const targetTitle = cleanSentence(lowerFirst(targetNode?.title ?? "o que acontece depois"));

  if (locationEffect?.type === "set_location") {
    const destination = locationDestinations[locationEffect.location] ?? "outro lugar";
    return `Depois disso, você segue para ${destination}. Ao chegar, é hora de ${targetActivity}.`;
  }

  const hasTimePassage = choice.effects.some(
    (effect) => effect.type === "advance_time" || effect.type === "set_clock"
  );

  if (targetNode?.ending) {
    return `Quando esse momento termina, você chega a ${targetTitle} e encara o caminho que suas decisões abriram.`;
  }

  if (hasTimePassage) {
    const variations = [
      `O tempo avança. Quando você percebe, já está diante de ${targetTitle}, pronto para ${targetActivity}.`,
      `Mais tarde, a rotina leva você até ${targetTitle}. É ali que precisa ${targetActivity}.`,
      `Quando esse trecho do dia termina, surge ${targetTitle}, e você precisa ${targetActivity}.`,
      `Algum tempo depois, ${targetTitle} ocupa sua atenção. Você se prepara para ${targetActivity}.`
    ] as const;
    return variations[variationIndex(choice.id)]!;
  }

  if (sourceNode.id === choice.nextNodeId) {
    return `A conversa continua no mesmo lugar, mas agora com espaço para ${targetActivity}.`;
  }

  const variations = [
    `A decisão muda o clima do momento e leva você até ${targetTitle}, onde precisa ${targetActivity}.`,
    `A reação das pessoas abre caminho para ${targetTitle}. Agora é hora de ${targetActivity}.`,
    `Com isso resolvido, ${targetTitle} começa a tomar forma, e você precisa ${targetActivity}.`,
    `O assunto se encerra e desemboca em ${targetTitle}. Você volta a atenção para ${targetActivity}.`
  ] as const;
  return variations[variationIndex(choice.id)]!;
}

function fallbackOutcome(
  sourceNode: StoryNode,
  choice: StoryChoice,
  targetNode: StoryNode | undefined
): NarrativeChoiceOutcome {
  const action = cleanSentence(lowerFirst(choice.label));
  return {
    title: sourceNode.title,
    text: `Você decide ${action}. ${naturalDestinationBridge(sourceNode, choice, targetNode)}`,
    continueLabel: targetNode ? `Seguir para ${targetNode.title}` : "Continuar",
    activity: targetNode?.activity ?? sourceNode.activity
  };
}

export function addChoiceContinuity(nodes: readonly StoryNode[]): readonly StoryNode[] {
  const nodeById = new Map(nodes.map((node) => [node.id, node] as const));

  return nodes.map((node) => ({
    ...node,
    choices: node.choices.map((choice) => ({
      ...choice,
      outcome:
        choice.outcome ??
        continuityOutcomes[choice.id] ??
        fallbackOutcome(node, choice, nodeById.get(choice.nextNodeId))
    }))
  }));
}
