import { conditionsAreMet } from "./conditions";
import { applyEffects } from "./effects";
import { createInitialStats } from "./stats";
import type { GameState, PlayerProfile, StoryChoice, StoryNode } from "./types";

export function createGameState(player: PlayerProfile): GameState {
  return {
    schemaVersion: 1,
    contentVersion: "sprint-0.1",
    player,
    clock: { date: "2026-02-16", minuteOfDay: 16 * 60 },
    location: "school",
    currentNodeId: "school.computer-assignment",
    stats: createInitialStats(player.origin),
    moneyCents: player.origin === "low_income" ? 3_000 : player.origin === "middle_income" ? 12_000 : 30_000,
    flags: {
      hasComputer: player.origin !== "low_income"
    },
    rollIndex: 0,
    seed: `${player.id}:${player.origin}`,
    history: [],
    scheduledConsequences: []
  };
}

export function getAvailableChoices(state: GameState, node: StoryNode): readonly StoryChoice[] {
  return node.choices.filter((choice) => conditionsAreMet(state, choice.conditions));
}

export function chooseStoryOption(state: GameState, node: StoryNode, choiceId: string): GameState {
  if (node.id !== state.currentNodeId) {
    throw new Error(`Nó atual é ${state.currentNodeId}, mas foi recebido ${node.id}.`);
  }

  const choice = node.choices.find((candidate) => candidate.id === choiceId);
  if (!choice) throw new Error(`Escolha inexistente: ${choiceId}`);
  if (!conditionsAreMet(state, choice.conditions)) throw new Error(`Escolha indisponível: ${choiceId}`);

  const result = applyEffects(state, choice.effects);
  return {
    ...result.state,
    currentNodeId: choice.nextNodeId,
    history: [
      ...state.history,
      {
        nodeId: node.id,
        choiceId,
        decidedAt: state.clock,
        changes: result.changes
      }
    ]
  };
}
