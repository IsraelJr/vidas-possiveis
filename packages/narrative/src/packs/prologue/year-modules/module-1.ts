import type { StoryNode } from "@vidas-possiveis/game-engine";
import * as S from "./shared";

export const yearModulePart1: readonly StoryNode[] = [
{
    id: "prologue.module-academic",
    moduleId: "prologue.academic",
    title: "Um professor substituto",
    text: "Algumas semanas depois, um professor substituto assume a turma. Parte dos colegas decide testar seus limites; outra parte tenta aproveitar a aula para recuperar conteúdo.",
    activity: "Decidir como agir com o professor substituto",
    nextCommitment: {
      label: "Fim da aula",
      clock: { date: "2026-03-20", minuteOfDay: 10 * 60 + 50 }
    },
    contextPersonIds: [S.FRIEND, S.RIVAL],
    choices: [
      {
        id: "help-substitute",
        label: "Colaborar e ajudar a organizar a atividade",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "communication", delta: 2 },
          { type: "attribute", attribute: "selfControl", delta: 2 },
          { type: "reputation", delta: 2 },
          { type: "set_clock", clock: { date: "2026-05-15", minuteOfDay: 12 * 60 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.module-social"
      },
      {
        id: "join-class-chaos",
        label: "Participar das brincadeiras contra o substituto",
        conditions: [],
        effects: [
          { type: "relationship", personId: S.FRIEND, dimension: "closeness", delta: 2 },
          { type: "reputation", delta: -3 },
          { type: "knowledge", knowledge: "mathematics", delta: -1 },
          { type: "flag", flag: "mockedSubstitute", value: true },
          { type: "set_clock", clock: { date: "2026-05-15", minuteOfDay: 12 * 60 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.module-social"
      },
      {
        id: "study-another-subject",
        label: "Ficar quieto e estudar outra matéria",
        conditions: [],
        effects: [
          { type: "knowledge", knowledge: "physics", delta: 3 },
          { type: "attribute", attribute: "selfControl", delta: 1 },
          { type: "set_clock", clock: { date: "2026-05-15", minuteOfDay: 12 * 60 } },
          { type: "set_location", location: "school" }
        ],
        nextNodeId: "prologue.module-social"
      }
    ]
  }
];
