import type { StoryNode } from "@vidas-possiveis/game-engine";
import * as S from "./shared";

export const yearModulePart4: readonly StoryNode[] = [
{
    id: "prologue.module-physical",
    moduleId: "prologue.physical",
    title: "Jogos entre turmas",
    text: "A escola organiza uma competição de {peActivity}. O clima de torcida aumenta e {rivalName} provoca sua turma antes da atividade.",
    activity: "Participar dos jogos entre turmas",
    contextPersonIds: [S.FRIEND, S.RIVAL],
    choices: [
      {
        id: "compete",
        label: "Entrar na competição e se esforçar",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "vigor", delta: 3 },
          { type: "attribute", attribute: "agility", delta: 3 },
          { type: "condition", condition: "energy", delta: -10 },
          { type: "reputation", delta: 2 },
          { type: "set_clock", clock: { date: "2026-11-20", minuteOfDay: 12 * 60 } }
        ],
        nextNodeId: "prologue.module-relationship"
      },
      {
        id: "support-team",
        label: "Ajudar a organizar e apoiar a equipe",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "communication", delta: 2 },
          { type: "relationship", personId: S.FRIEND, dimension: "trust", delta: 2 },
          { type: "reputation", delta: 1 },
          { type: "set_clock", clock: { date: "2026-11-20", minuteOfDay: 12 * 60 } }
        ],
        nextNodeId: "prologue.module-relationship"
      },
      {
        id: "help-injury",
        label: "Parar para ajudar uma pessoa que se machucou",
        conditions: [],
        effects: [
          { type: "attribute", attribute: "perception", delta: 2 },
          { type: "relationship", personId: S.RIVAL, dimension: "tension", delta: -4 },
          { type: "reputation", delta: 2 },
          { type: "set_clock", clock: { date: "2026-11-20", minuteOfDay: 12 * 60 } }
        ],
        nextNodeId: "prologue.module-relationship"
      },
      {
        id: "avoid-games",
        label: "Não participar e usar o tempo para estudar",
        conditions: [],
        effects: [
          { type: "knowledge", knowledge: "technology", delta: 3 },
          { type: "condition", condition: "energy", delta: 2 },
          { type: "set_clock", clock: { date: "2026-11-20", minuteOfDay: 12 * 60 } }
        ],
        nextNodeId: "prologue.module-relationship"
      }
    ]
  }
];
