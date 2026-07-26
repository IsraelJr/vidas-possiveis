import type { StoryNode } from "@vidas-possiveis/game-engine";
import * as S from "./shared";

export const mondayNightClosureNodes: readonly StoryNode[] = [
  {
    id: "prologue.monday-return-home",
    moduleId: "prologue.first-week",
    title: "O caminho depois do trabalho",
    text: "O encontro terminou, mas a noite ainda não. Antes de revisar qualquer coisa e dormir, você precisa estar em casa.",
    activity: "Concluir o retorno para casa",
    nextCommitment: S.PAIR_TEST,
    choices: [
      {
        id: "return-home-from-library",
        label: "Guardar o material e voltar da biblioteca para casa",
        conditions: [{ type: "location", value: "library" }],
        effects: [
          { type: "advance_time", minutes: 40 },
          { type: "condition", condition: "energy", delta: -3 },
          { type: "set_location", location: "home" }
        ],
        nextNodeId: "prologue.night-plan",
        outcome: {
          title: "A biblioteca fica para trás",
          text: "Você guarda o material, deixa a biblioteca e completa o trajeto até o seu bairro. Só quando entra em casa a decisão sobre o restante da noite pode acontecer.",
          continueLabel: "Organizar a noite em casa",
          activity: "Concluir o deslocamento"
        }
      },
      {
        id: "continue-night-at-home",
        label: "Encerrar o encontro e organizar o restante da noite",
        conditions: [{ type: "location", value: "home" }],
        effects: [],
        nextNodeId: "prologue.night-plan",
        outcome: {
          title: "O encontro termina em casa",
          text: "O grupo encerra o trabalho e cada pessoa segue seu caminho. Você permanece em casa, onde ainda pode revisar, descansar ou se distrair antes de dormir.",
          continueLabel: "Decidir como terminar a noite",
          activity: "Organizar o fim da noite"
        }
      }
    ]
  },
  {
    id: "prologue.tuesday-school-morning",
    moduleId: "prologue.first-week",
    title: "A manhã da prova em dupla",
    text: "O despertador toca às 06:30. A prova começa às 08:20, e você ainda precisa sair de casa e chegar à escola.",
    activity: "Ir para a escola antes da prova",
    nextCommitment: S.PAIR_TEST,
    choices: [
      {
        id: "go-to-school-before-pair-test",
        label: "Tomar café e seguir para a escola",
        conditions: [{ type: "location", value: "home" }],
        effects: [
          { type: "condition", condition: "energy", delta: 3 },
          { type: "advance_time", minutes: 60 },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.before-pair-test",
        outcome: {
          title: "A escola aparece depois do trajeto",
          text: "Você se prepara, sai de casa e percorre o caminho até a escola. Quando atravessa o portão, ainda há algum tempo antes do início da prova.",
          continueLabel: "Aguardar a prova",
          activity: "Concluir o deslocamento da manhã"
        }
      }
    ]
  }
];