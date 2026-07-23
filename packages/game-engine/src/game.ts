import { compareClocks } from "./clock";
import { conditionsAreMet, evaluateCondition } from "./conditions";
import { applyEffects } from "./effects";
import { runSkillCheck } from "./skill-check";
import { createInitialStats } from "./stats";
import type {
  AppliedChange,
  GameState,
  PlayerProfile,
  RelationshipState,
  SkillModifier,
  StoryChoice,
  StoryChoiceAvailability,
  StoryNode,
  TriggeredConsequence
} from "./types";

function createInitialRelationships(): Readonly<Record<string, RelationshipState>> {
  return {
    bia: {
      id: "bia",
      name: "Bia",
      role: "friend",
      trust: 50,
      affection: 45,
      conflict: 10
    }
  };
}

export function createGameState(player: PlayerProfile): GameState {
  return {
    schemaVersion: 2,
    contentVersion: "sprint-1.0",
    player,
    clock: { date: "2026-02-16", minuteOfDay: 16 * 60 },
    location: "school",
    currentNodeId: "school.computer-assignment",
    stats: createInitialStats(player.origin),
    moneyCents: player.origin === "low_income" ? 3_000 : player.origin === "middle_income" ? 12_000 : 30_000,
    flags: { hasComputer: player.origin !== "low_income" },
    relationships: createInitialRelationships(),
    rollIndex: 0,
    seed: `${player.id}:${player.origin}`,
    history: [],
    scheduledConsequences: []
  };
}

export function migrateGameState(state: GameState): GameState {
  const candidate = state as GameState & {
    readonly schemaVersion?: number;
    readonly relationships?: Readonly<Record<string, RelationshipState>>;
    readonly scheduledConsequences?: GameState["scheduledConsequences"];
  };

  return {
    ...candidate,
    schemaVersion: 2,
    contentVersion: "sprint-1.0",
    relationships: candidate.relationships ?? createInitialRelationships(),
    scheduledConsequences: candidate.scheduledConsequences ?? []
  };
}

export function getChoiceAvailability(state: GameState, node: StoryNode): readonly StoryChoiceAvailability[] {
  return node.choices.map((choice) => {
    const failedConditions = choice.conditions.filter((condition) => !evaluateCondition(state, condition));
    return { choice, available: failedConditions.length === 0, failedConditions };
  });
}

export function getAvailableChoices(state: GameState, node: StoryNode): readonly StoryChoice[] {
  return getChoiceAvailability(state, node)
    .filter((availability) => availability.available)
    .map((availability) => availability.choice);
}

function processDueConsequences(state: GameState): {
  readonly state: GameState;
  readonly changes: readonly AppliedChange[];
  readonly triggered: readonly TriggeredConsequence[];
} {
  const due = state.scheduledConsequences.filter((item) => compareClocks(item.triggerAt, state.clock) <= 0);
  if (due.length === 0) return { state, changes: [], triggered: [] };

  let nextState: GameState = {
    ...state,
    scheduledConsequences: state.scheduledConsequences.filter((item) => compareClocks(item.triggerAt, state.clock) > 0)
  };
  const changes: AppliedChange[] = [];
  const triggered: TriggeredConsequence[] = [];

  for (const consequence of due) {
    const result = applyEffects(nextState, consequence.effects, { sourceChoiceId: consequence.sourceChoiceId });
    nextState = result.state;
    changes.push(...result.changes);
    triggered.push({
      id: consequence.id,
      title: consequence.title,
      text: consequence.text,
      changes: result.changes
    });
  }

  return { state: nextState, changes, triggered };
}

function buildSkillModifiers(state: GameState, choice: StoryChoice): readonly SkillModifier[] {
  if (!choice.skillCheck) return [];
  const modifiers: SkillModifier[] = [
    {
      label: choice.skillCheck.stat,
      value: Math.round((state.stats[choice.skillCheck.stat] - 50) / 5)
    },
    {
      label: "energy",
      value: Math.round((state.stats.energy - 50) / 10)
    },
    {
      label: "stress",
      value: -Math.round(state.stats.stress / 20)
    }
  ];

  for (const bonus of choice.skillCheck.bonusFlags) {
    if (state.flags[bonus.flag] === true) modifiers.push({ label: bonus.label, value: bonus.value });
  }

  return modifiers;
}

export function chooseStoryOption(state: GameState, node: StoryNode, choiceId: string): GameState {
  if (node.id !== state.currentNodeId) {
    throw new Error(`Nó atual é ${state.currentNodeId}, mas foi recebido ${node.id}.`);
  }

  const choice = node.choices.find((candidate) => candidate.id === choiceId);
  if (!choice) throw new Error(`Escolha inexistente: ${choiceId}`);
  if (!conditionsAreMet(state, choice.conditions)) throw new Error(`Escolha indisponível: ${choiceId}`);

  const baseResult = applyEffects(state, choice.effects, { sourceChoiceId: choice.id });
  let nextState = baseResult.state;
  const changes: AppliedChange[] = [...baseResult.changes];
  let nextNodeId = choice.nextNodeId;
  let skillCheckResult;

  if (choice.skillCheck) {
    skillCheckResult = runSkillCheck({
      seed: nextState.seed,
      eventId: choice.skillCheck.eventId,
      rollIndex: nextState.rollIndex,
      difficulty: choice.skillCheck.difficulty,
      modifiers: buildSkillModifiers(nextState, choice)
    });
    const outcome = choice.skillCheck.outcomes[skillCheckResult.outcome];
    const outcomeResult = applyEffects(nextState, outcome.effects, { sourceChoiceId: choice.id });
    nextState = { ...outcomeResult.state, rollIndex: nextState.rollIndex + 1 };
    changes.push(...outcomeResult.changes);
    nextNodeId = outcome.nextNodeId;
  }

  const consequenceResult = processDueConsequences(nextState);
  nextState = consequenceResult.state;
  changes.push(...consequenceResult.changes);

  const historyEntry = {
    nodeId: node.id,
    choiceId,
    decidedAt: state.clock,
    changes,
    ...(skillCheckResult ? { skillCheck: skillCheckResult } : {}),
    ...(consequenceResult.triggered.length > 0
      ? { triggeredConsequences: consequenceResult.triggered }
      : {})
  };

  return {
    ...nextState,
    currentNodeId: nextNodeId,
    history: [...state.history, historyEntry]
  };
}
