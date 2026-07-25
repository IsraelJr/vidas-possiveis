import type {
  NarrativeChoiceOutcome,
  StoryChoice,
  StoryNode
} from "@vidas-possiveis/game-engine";

const continuityOutcomes: Readonly<Record<string, NarrativeChoiceOutcome>> = {
  "breakfast-bus": {
    title: "A manhã começa de verdade",
    text: "Você toma o café sem correr, confere a mochila e sai a tempo. O ônibus leva parte do dinheiro da semana, mas também deixa alguns minutos de margem antes da primeira aula.",
    continueLabel: "Chegar à escola",
    activity: "Ir para a escola de ônibus"
  },
  "quick-breakfast-early-bus": {
    title: "Entre uma mordida e o portão",
    text: "Você come depressa, fecha a mochila e alcança o ônibus anterior. A manhã começa acelerada, mas a escola ainda está relativamente vazia quando você chega.",
    continueLabel: "Entrar no pátio",
    activity: "Chegar cedo à escola"
  },
  "sleep-and-app": {
    title: "Mais alguns minutos",
    text: "Você adia o despertador, dorme um pouco mais e chama um carro. O trajeto é rápido e confortável, mas o valor descontado do dinheiro da semana aparece na tela antes mesmo de você alcançar o portão.",
    continueLabel: "Descer na escola",
    activity: "Chegar de carro à escola"
  },
  "skip-breakfast-bus": {
    title: "Sair antes da fome pesar",
    text: "Você fecha a mochila, deixa o café para trás e segue para o ponto. O ônibus chega a tempo. Seu corpo, porém, percebe a escolha antes de a primeira aula começar.",
    continueLabel: "Chegar à escola",
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
    text: "Você pergunta a {groupMateName} qual parte prefere fazer. A resposta não resolve tudo, mas muda o tom da conversa: em vez de receber uma tarefa pronta, a pessoa precisa se comprometer diante do grupo.",
    continueLabel: "Seguir para o intervalo",
    activity: "Combinar o trabalho em grupo"
  },
  "organize-immediately": {
    title: "A folha ganha nomes",
    text: "Você puxa a folha para o centro da mesa e começa a distribuir as partes. O grupo aceita a organização, embora {groupMateName} demore um pouco mais para concordar. Quando a professora encerra a aula, todos saem com uma tarefa definida.",
    continueLabel: "Ir para o intervalo",
    activity: "Organizar o grupo"
  },
  "wait-group": {
    title: "Ninguém começa de imediato",
    text: "Você espera que outra pessoa tome a iniciativa. Alguns segundos viram uma conversa atravessada até alguém finalmente puxar a divisão das tarefas. O acordo sai, mas sem muita clareza sobre quem vai cobrar os prazos.",
    continueLabel: "Ir para o intervalo",
    activity: "Acompanhar a divisão do trabalho"
  },
  "school-meal": {
    title: "A bandeja no balcão",
    text: "Você entra na fila da merenda, pega a bandeja e encontra um lugar no pátio. A comida não custa nada e devolve parte da energia da manhã. Quando o intervalo termina, você segue para a quadra.",
    continueLabel: "Ir para a Educação Física",
    activity: "Comer a merenda"
  },
  "canteen-snack": {
    title: "O balcão da lanchonete",
    text: "Você compra um lanche e se junta a {friendName}. A conversa continua enquanto o dinheiro da semana diminui um pouco. O sinal do fim do intervalo interrompe a última mordida.",
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
    text: "Você decide não comer e mantém o dinheiro no bolso. O intervalo passa entre conversas e o cheiro da lanchonete. Quando chega a hora da Educação Física, a fome já não é apenas uma ideia.",
    continueLabel: "Ir para a quadra",
    activity: "Passar o intervalo sem comer"
  },
  "participate-seriously": {
    title: "Entrar no jogo",
    text: "Você participa com intensidade, corre até o fim de cada lance e sente o corpo responder. Quando a atividade termina, o cansaço vem junto com a sensação de ter sido notado.",
    continueLabel: "Voltar para a sala",
    activity: "Participar da Educação Física"
  },
  "participate-lightly": {
    title: "Guardar parte do fôlego",
    text: "Você participa sem disputar cada lance. Faz o necessário, acompanha a turma e preserva energia para o restante do dia. Quando a professora encerra a atividade, você volta para a sala ainda respirando com calma.",
    continueLabel: "Voltar para a sala",
    activity: "Participar com moderação"
  },
  "help-classmate": {
    title: "Jogar olhando para o lado",
    text: "Você percebe a dificuldade de outra pessoa e reduz o ritmo para ajudar. A atividade fica menos competitiva e mais próxima. Ao final, vocês deixam a quadra conversando sobre o que funcionou.",
    continueLabel: "Voltar para a sala",
    activity: "Ajudar durante a atividade"
  },
  "sit-out": {
    title: "Do lado de fora da quadra",
    text: "Você fica de fora e acompanha a atividade do banco. O corpo descansa, mas algumas pessoas percebem sua ausência. Quando a aula termina, você se levanta antes que a turma comece a guardar o material.",
    continueLabel: "Voltar para a sala",
    activity: "Observar a Educação Física"
  }
};

function lowerFirst(value: string): string {
  if (value.length === 0) return value;
  return `${value.charAt(0).toLocaleLowerCase("pt-BR")}${value.slice(1)}`;
}

function fallbackOutcome(choice: StoryChoice): NarrativeChoiceOutcome {
  const action = lowerFirst(choice.label).replace(/[.!?]+$/, "");
  return {
    title: "A decisão continua na cena",
    text: `Você decide ${action}. A ação se completa, produz seus efeitos e só então o próximo momento da história começa.`,
    continueLabel: "Continuar",
    activity: "Viver a consequência da escolha"
  };
}

export function addChoiceContinuity(node: StoryNode): StoryNode {
  return {
    ...node,
    choices: node.choices.map((choice) => ({
      ...choice,
      outcome: choice.outcome ?? continuityOutcomes[choice.id] ?? fallbackOutcome(choice)
    }))
  };
}
