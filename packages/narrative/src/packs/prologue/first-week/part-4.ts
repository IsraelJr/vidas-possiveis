import type { StoryNode } from "@vidas-possiveis/game-engine";
import * as S from "./shared";

export const firstWeekPart4: readonly StoryNode[] = [
  {
    id: "prologue.conflict",
    moduleId: "prologue.first-week",
    title: "A discussão esquenta",
    text: "{rivalName} responde, outras pessoas se aproximam e a conversa fica a um passo de virar empurrão.",
    activity: "Impedir ou ampliar um confronto",
    nextCommitment: S.PRESENTATION,
    contextPersonIds: [S.RIVAL],
    choices: [
      {
        id: "step-back",
        label: "Recuar antes que a discussão vire briga",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "selfControl", delta: 3 },
          { type: "relationship", personId: S.RIVAL, dimension: "tension", delta: -2 },
          { type: "flag", flag: "conflictDeescalated", value: true }
        ],
        nextNodeId: "prologue.conflict-closure",
        outcome: {
          title: "Dois passos para trás",
          text: "Você percebe que a roda ao redor já espera uma briga e recua. {rivalName} ainda lança uma última provocação, mas a distância corta o impulso do confronto. Um professor aparece no corredor, dispersa quem estava assistindo e manda todos voltarem para a sala.",
          continueLabel: "Voltar para a sala",
          activity: "Encerrar a discussão sem violência"
        }
      },
      {
        id: "ask-friend-mediation",
        label: "Pedir que {friendName} ajude a separar a discussão",
        conditions: [],
        effects: [
          { type: "relationship", personId: S.FRIEND, dimension: "trust", delta: 2 },
          { type: "relationship", personId: S.RIVAL, dimension: "tension", delta: -1 },
          { type: "flag", flag: "conflictMediated", value: true }
        ],
        nextNodeId: "prologue.conflict-closure",
        outcome: {
          title: "Alguém entra no meio",
          text: "Você chama {friendName} antes que a discussão passe do limite. {friendName} entra entre vocês, empurra a roda de curiosos para trás e insiste para que cada um siga para um lado. Quando um professor se aproxima, o confronto já perdeu força, embora o clima continue pesado.",
          continueLabel: "Retomar o dia",
          activity: "Aceitar a mediação de {friendName}"
        }
      },
      {
        id: "physical-fight",
        label: "Partir para a agressão",
        conditions: [],
        effects: [
          { type: "condition", condition: "health", delta: -8 },
          { type: "condition", condition: "stress", delta: 10 },
          { type: "reputation", delta: -6 },
          { type: "relationship", personId: S.RIVAL, dimension: "tension", delta: 18 },
          { type: "flag", flag: "schoolFight", value: true },
          {
            type: "add_memory",
            personId: S.RIVAL,
            memory: {
              id: "school-fight",
              summary: "Uma discussão entre vocês terminou em agressão física na escola.",
              kind: "conflict",
              intensity: 10,
              resolved: false,
              tags: ["school", "fight", "discipline"]
            }
          }
        ],
        nextNodeId: "prologue.fight-intervention",
        outcome: {
          title: "A discussão vira briga",
          text: "Você parte para cima de {rivalName}. O primeiro golpe transforma a roda de curiosos em gritos e movimento. {rivalName} reage, vocês se agarram e algumas pessoas tentam afastar mesas e mochilas do caminho. Um professor corre até vocês e chama ajuda enquanto dois colegas tentam separar a briga.",
          continueLabel: "Enfrentar o que aconteceu",
          activity: "Ser separado depois da agressão"
        }
      }
    ]
  },
  {
    id: "prologue.conflict-closure",
    moduleId: "prologue.first-week",
    title: "O confronto termina ali",
    text: "A turma volta para a sala aos poucos. Algumas pessoas continuam comentando, mas ninguém foi agredido e a discussão não cresce de novo. O professor espera o corredor esvaziar antes de retomar a aula.",
    activity: "Retomar o dia depois da discussão",
    nextCommitment: S.PRESENTATION,
    choices: [
      {
        id: "return-after-conflict",
        label: "Entrar na sala e seguir o restante do dia",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 15 },
          { type: "set_location", location: "school" },
          { type: "flag", flag: "conflictArcClosed", value: true }
        ],
        nextNodeId: "prologue.friday-transition",
        outcome: {
          title: "A aula recomeça",
          text: "Você se senta enquanto as últimas conversas diminuem. O conflito ainda será lembrado, mas aquele momento terminou: ninguém continua cercando vocês, não há ameaça imediata e a rotina da escola retoma seu espaço. Só depois disso o restante da semana pode avançar.",
          continueLabel: "Seguir com a semana",
          activity: "Concluir o confronto e voltar à rotina"
        }
      }
    ]
  },
  {
    id: "prologue.fight-intervention",
    moduleId: "prologue.first-week",
    title: "Separados no corredor",
    text: "O professor mantém vocês afastados enquanto outro funcionário abre espaço no corredor. Seu corpo ainda está tenso, {rivalName} continua do outro lado e a turma observa de longe. A coordenação já foi chamada.",
    activity: "Interromper a briga",
    nextCommitment: S.PRESENTATION,
    contextPersonIds: [S.RIVAL, S.FRIEND],
    choices: [
      {
        id: "stop-after-separation",
        label: "Parar quando separam vocês",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 10 },
          { type: "attribute", attribute: "selfControl", delta: 1 },
          { type: "condition", condition: "stress", delta: -2 },
          { type: "flag", flag: "fightStoppedAfterSeparation", value: true }
        ],
        nextNodeId: "prologue.fight-coordination",
        outcome: {
          title: "A briga não continua",
          text: "Você mantém distância quando o professor solta seu braço. {rivalName} também é levado para o outro lado. O barulho diminui, mas ninguém volta para a aula: vocês seguem separados até a coordenação, com a turma ainda tentando entender o que viu.",
          continueLabel: "Ir para a coordenação",
          activity: "Ser levado para a coordenação"
        }
      },
      {
        id: "keep-provoking-after-separation",
        label: "Continuar provocando mesmo de longe",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 10 },
          { type: "condition", condition: "stress", delta: 4 },
          { type: "reputation", delta: -2 },
          { type: "relationship", personId: S.RIVAL, dimension: "tension", delta: 5 },
          { type: "flag", flag: "fightKeptProvoking", value: true }
        ],
        nextNodeId: "prologue.fight-coordination",
        outcome: {
          title: "A separação não encerra a provocação",
          text: "Mesmo afastado, você continua falando para {rivalName}. O professor aumenta a distância entre vocês e manda a turma entrar. Quando a coordenação chega, o confronto físico terminou, mas a provocação prolongou a tensão e deixou mais pessoas como testemunhas.",
          continueLabel: "Ir para a coordenação",
          activity: "Responder pela continuação do conflito"
        }
      }
    ]
  },
  {
    id: "prologue.fight-coordination",
    moduleId: "prologue.first-week",
    title: "Na coordenação",
    text: "Vocês são colocados em salas diferentes. Um funcionário verifica os machucados, anota os nomes de quem presenciou a briga e explica que os responsáveis serão avisados. Depois, a coordenação pede sua versão do começo ao fim.",
    activity: "Contar o que aconteceu",
    nextCommitment: S.PRESENTATION,
    contextPersonIds: [S.RIVAL],
    choices: [
      {
        id: "admit-fight-responsibility",
        label: "Admitir que perdeu o controle e iniciou a agressão",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 20 },
          { type: "attribute", attribute: "communication", delta: 1 },
          { type: "condition", condition: "stress", delta: -1 },
          { type: "flag", flag: "admittedFightResponsibility", value: true }
        ],
        nextNodeId: "prologue.fight-consequence",
        outcome: {
          title: "Assumir o que fez",
          text: "Você conta que iniciou a agressão. A coordenadora não diminui a gravidade, mas interrompe menos vezes porque sua versão combina com parte dos relatos. Ela registra sua responsabilidade e explica que admitir não apaga a consequência.",
          continueLabel: "Ouvir a decisão da escola",
          activity: "Assumir responsabilidade pela briga"
        }
      },
      {
        id: "blame-rival-for-fight",
        label: "Culpar {rivalName} por toda a briga",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 20 },
          { type: "condition", condition: "stress", delta: 2 },
          { type: "relationship", personId: S.RIVAL, dimension: "tension", delta: 4 },
          { type: "flag", flag: "blamedRivalForFight", value: true }
        ],
        nextNodeId: "prologue.fight-consequence",
        outcome: {
          title: "Duas versões incompatíveis",
          text: "Você coloca toda a responsabilidade em {rivalName}. A coordenação compara sua fala com os relatos de quem estava no corredor e encontra contradições. A conversa fica mais longa, e o conflito passa a incluir também a disputa sobre quem está dizendo a verdade.",
          continueLabel: "Ouvir a decisão da escola",
          activity: "Sustentar sua versão diante da coordenação"
        }
      },
      {
        id: "stay-silent-at-coordination",
        label: "Ficar em silêncio e não explicar nada",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 20 },
          { type: "condition", condition: "stress", delta: 3 },
          { type: "reputation", delta: -1 },
          { type: "flag", flag: "silentAtCoordination", value: true }
        ],
        nextNodeId: "prologue.fight-consequence",
        outcome: {
          title: "O silêncio também entra no registro",
          text: "Você responde apenas o indispensável. Sem sua versão, a coordenação monta o relato com testemunhas, professores e a fala de {rivalName}. O silêncio evita uma nova discussão naquele instante, mas deixa outras pessoas definirem como a briga será registrada.",
          continueLabel: "Ouvir a decisão da escola",
          activity: "Aguardar a decisão em silêncio"
        }
      }
    ]
  },
  {
    id: "prologue.fight-consequence",
    moduleId: "prologue.first-week",
    title: "A consequência antes do fim do dia",
    text: "A escola registra a ocorrência, telefona para os responsáveis e tira vocês do restante das aulas daquele turno. A coordenação avisa que o caso será acompanhado e que uma nova agressão poderá trazer uma punição mais grave. Enquanto espera o horário de ir embora, chegam mensagens do grupo perguntando onde você está.",
    activity: "Lidar com a escola, a família e o grupo",
    nextCommitment: S.PRESENTATION,
    contextPersonIds: [S.RIVAL, S.GROUP],
    choices: [
      {
        id: "tell-group-about-fight",
        label: "Avisar o grupo e assumir que perdeu parte do ensaio",
        conditions: [],
        effects: [
          { type: "relationship", personId: S.GROUP, dimension: "trust", delta: 1 },
          { type: "condition", condition: "stress", delta: -1 },
          { type: "set_clock", clock: { date: "2026-02-18", minuteOfDay: 13 * 60 } },
          { type: "set_location", location: "home" },
          { type: "flag", flag: "toldGroupAboutFight", value: true }
        ],
        nextNodeId: "prologue.fight-closure",
        outcome: {
          title: "O grupo recebe a verdade",
          text: "Você conta que se envolveu em uma briga e que saiu das aulas. As respostas misturam preocupação, irritação e perguntas. Ninguém esquece a apresentação, mas o grupo agora sabe por que você desapareceu e pode reorganizar o ensaio sem inventar uma explicação.",
          continueLabel: "Voltar para casa",
          activity: "Assumir a ausência diante do grupo"
        }
      },
      {
        id: "hide-fight-from-group",
        label: "Dizer apenas que saiu mais cedo e esconder a briga",
        conditions: [],
        effects: [
          { type: "condition", condition: "stress", delta: 3 },
          { type: "set_clock", clock: { date: "2026-02-18", minuteOfDay: 13 * 60 } },
          { type: "set_location", location: "home" },
          { type: "flag", flag: "hidFightFromGroup", value: true }
        ],
        nextNodeId: "prologue.fight-closure",
        outcome: {
          title: "Uma explicação incompleta",
          text: "Você diz ao grupo apenas que precisou sair mais cedo. A resposta encerra as perguntas por alguns minutos, mas as mensagens da turma continuam circulando. Ao voltar para casa, você sabe que a versão escondida pode chegar ao grupo por outra pessoa.",
          continueLabel: "Voltar para casa",
          activity: "Esconder a briga do grupo"
        }
      },
      {
        id: "apologize-after-fight",
        label: "Pedir desculpas a {rivalName} antes de sair",
        conditions: [],
        effects: [
          { type: "relationship", personId: S.RIVAL, dimension: "tension", delta: -4 },
          { type: "reputation", delta: 1 },
          { type: "set_clock", clock: { date: "2026-02-18", minuteOfDay: 13 * 60 } },
          { type: "set_location", location: "home" },
          { type: "flag", flag: "apologizedAfterFight", value: true }
        ],
        nextNodeId: "prologue.fight-closure",
        outcome: {
          title: "Um pedido que não apaga a briga",
          text: "Antes de sair, você pede desculpas a {rivalName}. A resposta não é uma reconciliação e o machucado continua visível, mas a conversa termina sem nova provocação. O conflito permanece na memória de vocês, agora acompanhado de uma primeira tentativa de interrompê-lo.",
          continueLabel: "Voltar para casa",
          activity: "Tentar encerrar a hostilidade imediata"
        }
      }
    ]
  },
  {
    id: "prologue.fight-closure",
    moduleId: "prologue.first-week",
    title: "Em casa depois da briga",
    text: "O confronto físico acabou, a escola tomou uma decisão e as pessoas envolvidas foram separadas. Em casa, ainda há dor, mensagens e uma conversa difícil com a família. A apresentação de sexta-feira continua marcada, mas agora você precisa reorganizar o que restou da semana.",
    activity: "Fechar o dia e reorganizar a preparação",
    nextCommitment: S.PRESENTATION,
    choices: [
      {
        id: "resume-presentation-after-fight",
        label: "Responder ao grupo e retomar a preparação",
        conditions: [],
        effects: [
          { type: "knowledge", knowledge: "portuguese", delta: 1 },
          { type: "condition", condition: "stress", delta: 1 },
          { type: "set_clock", clock: { date: "2026-02-18", minuteOfDay: 19 * 60 + 30 } },
          { type: "flag", flag: "fightArcClosed", value: true }
        ],
        nextNodeId: "prologue.friday-transition",
        outcome: {
          title: "O trabalho volta para a tela",
          text: "Depois da conversa em casa, você abre as mensagens do grupo, entende o que mudou no ensaio e retoma sua parte. A briga não desapareceu, mas o arco daquele dia terminou: houve intervenção, registro, consequência e retorno para casa. Só então a semana volta a avançar.",
          continueLabel: "Seguir com a semana",
          activity: "Retomar a preparação depois das consequências"
        }
      },
      {
        id: "rest-after-fight",
        label: "Cuidar dos machucados e revisar no dia seguinte",
        conditions: [],
        effects: [
          { type: "condition", condition: "health", delta: 2 },
          { type: "condition", condition: "energy", delta: 4 },
          { type: "set_clock", clock: { date: "2026-02-18", minuteOfDay: 20 * 60 + 30 } },
          { type: "flag", flag: "fightArcClosed", value: true }
        ],
        nextNodeId: "prologue.friday-transition",
        outcome: {
          title: "O corpo pede pausa",
          text: "Você cuida dos machucados, responde apenas o necessário e combina de revisar no dia seguinte. A escola já interveio, a família foi avisada e o grupo sabe que precisa se reorganizar. Com o conflito imediato encerrado, a noite termina antes de a história avançar para os próximos dias.",
          continueLabel: "Seguir com a semana",
          activity: "Descansar depois de concluir o conflito"
        }
      }
    ]
  },
  {
    id: "prologue.friday-transition",
    moduleId: "prologue.first-week",
    title: "A semana continua",
    text: "Entre aulas, mensagens e ajustes no trabalho, os dias avançam. Na sexta-feira, o despertador toca às 06:30. A apresentação começa às 08:00.",
    activity: "Preparar-se para a apresentação",
    nextCommitment: S.PRESENTATION,
    choices: [
      {
        id: "reach-friday",
        label: "Levantar e decidir como chegar à escola",
        conditions: [],
        effects: [
          { type: "set_clock", clock: { date: "2026-02-20", minuteOfDay: 6 * 60 + 30 } },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.presentation-morning"
      }
    ]
  },
  {
    id: "prologue.presentation-morning",
    moduleId: "prologue.first-week",
    title: "A manhã da apresentação",
    text: "A apresentação começa às 08:00. O ônibus custa menos, o carro por aplicativo reduz o trajeto, e sair tarde pode fazer o grupo começar sem você.",
    activity: "Escolher o deslocamento para a escola",
    nextCommitment: S.PRESENTATION,
    choices: [
      {
        id: "breakfast-and-bus-friday",
        label: "Tomar café e pegar o ônibus",
        conditions: [{ type: "money", operator: ">=", valueCents: 500 }],
        effects: [
          { type: "money", deltaCents: -500 },
          { type: "condition", condition: "energy", delta: 5 },
          { type: "set_clock", clock: { date: "2026-02-20", minuteOfDay: 7 * 60 + 40 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.presentation-wait"
      },
      {
        id: "app-friday",
        label: "Chamar um carro e chegar bem cedo",
        conditions: [{ type: "money", operator: ">=", valueCents: 2500 }],
        effects: [
          { type: "money", deltaCents: -2500 },
          { type: "condition", condition: "stress", delta: -3 },
          { type: "set_clock", clock: { date: "2026-02-20", minuteOfDay: 7 * 60 + 10 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.presentation-wait"
      },
      {
        id: "late-bus-friday",
        label: "Sair mais tarde e correr para o ônibus",
        conditions: [],
        effects: [
          { type: "money", deltaCents: -500 },
          { type: "condition", condition: "stress", delta: 8 },
          { type: "set_clock", clock: { date: "2026-02-20", minuteOfDay: 8 * 60 + 10 } },
          { type: "set_location", location: "school" },
          { type: "flag", flag: "lateForPresentation", value: true }
        ],
        nextNodeId: "prologue.presentation-late"
      }
    ]
  },
  {
    id: "prologue.presentation-wait",
    moduleId: "prologue.first-week",
    title: "Tempo antes da apresentação",
    text: "Você chegou antes das 08:00. O grupo ainda pode revisar os slides, respirar ou resolver uma última tensão.",
    activity: "Aguardar e preparar a apresentação",
    nextCommitment: S.PRESENTATION,
    contextPersonIds: [S.GROUP],
    choices: [
      {
        id: "review-slides",
        label: "Revisar os slides com o grupo",
        conditions: [],
        effects: [
          { type: "knowledge", knowledge: "portuguese", delta: 1 },
          { type: "flag", flag: "lastReview", value: true },
          { type: "set_clock", clock: S.PRESENTATION.clock }
        ],
        nextNodeId: "prologue.presentation"
      },
      {
        id: "encourage-group",
        label: "Conversar com {groupMateName} e acalmar o grupo",
        conditions: [],
        effects: [
          { type: "relationship", personId: S.GROUP, dimension: "trust", delta: 1 },
          { type: "condition", condition: "stress", delta: -2 },
          { type: "flag", flag: "calmedGroup", value: true },
          { type: "set_clock", clock: S.PRESENTATION.clock }
        ],
        nextNodeId: "prologue.presentation"
      },
      {
        id: "wait-quietly-presentation",
        label: "Ficar em silêncio e organizar a própria fala",
        conditions: [],
        effects: [
          { type: "condition", condition: "stress", delta: -1 },
          { type: "set_clock", clock: S.PRESENTATION.clock }
        ],
        nextNodeId: "prologue.presentation"
      }
    ]
  },
  {
    id: "prologue.presentation-late",
    moduleId: "prologue.first-week",
    title: "A apresentação já começou",
    text: "Você chega às 08:10. O grupo precisou explicar sua ausência e a ordem das falas mudou.",
    activity: "Entrar na sala após o início",
    nextCommitment: { label: "Apresentação em andamento", clock: { date: "2026-02-20", minuteOfDay: 8 * 60 + 10 } },
    choices: [
      {
        id: "join-late",
        label: "Pedir desculpas e assumir a próxima parte",
        conditions: [],
        effects: [
          { type: "reputation", delta: -2 },
          { type: "relationship", personId: S.GROUP, dimension: "tension", delta: 3 }
        ],
        nextNodeId: "prologue.presentation"
      }
    ]
  }
];