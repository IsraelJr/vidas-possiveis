import { compareClocks } from "./clock";
import { conditionsAreMet, evaluateCondition } from "./conditions";
import { applyEffects } from "./effects";
import { createPrologueGroupMate } from "./identity";
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

const START_CLOCK = { date: "2026-02-16", minuteOfDay: 6 * 60 + 10 } as const;

export function createGameState(player: PlayerProfile, narrativePackageId = "school-prologue-br-v1"): GameState {
  const generated = createPrologueGroupMate(player, START_CLOCK);
  return {
    schemaVersion: 3,
    contentVersion: "prologue-1.0",
    narrativePackageId,
    player,
    clock: START_CLOCK,
    location: "home",
    currentNodeId: "prologue.morning",
    stats: createInitialStats(player.origin),
    moneyCents: player.origin === "low_income" ? 3_000 : player.origin === "middle_income" ? 12_000 : 30_000,
    flags: {
      hasComputer: player.origin !== "low_income",
      groupMateHelpedBefore: generated.historyId === "helped-before",
      groupMateProvokedBefore: generated.historyId === "provoked-before",
      groupMateResponsible: generated.historyId === "usually-responsible",
      groupMateRepeatedDelays: generated.historyId === "repeated-delays"
    },
    relationships: { [generated.relationship.id]: generated.relationship },
    identityRegistry: { [generated.registry.displayName.toLocaleLowerCase("pt-BR")]: generated.registry },
    rollIndex: 0,
    seed: `${player.id}:${player.origin}`,
    history: [],
    scheduledConsequences: []
  };
}

function legacyBia(): RelationshipState {
  return {
    id: "school.groupMate",
    name: "Bia",
    gender: "woman",
    role: "Colega da escola",
    category: "known",
    presence: "active",
    contextSummary: "Bia estudou com você e participou do primeiro trabalho em grupo desta vida.",
    trust: 30,
    affection: 20,
    conflict: 5,
    memories: []
  };
}

export function migrateGameState(state: GameState): GameState {
  const candidate = state as unknown as Partial<GameState> & {
    readonly schemaVersion?: number;
    readonly relationships?: Readonly<Record<string, RelationshipState>>;
  };

  if (candidate.schemaVersion === 3 && candidate.identityRegistry && candidate.narrativePackageId) {
    return candidate as GameState;
  }

  const oldRelationships = candidate.relationships ?? {};
  const previous = oldRelationships.bia ?? oldRelationships["school.groupMate"];
  const migratedPerson = previous
    ? {
        ...legacyBia(),
        name: previous.name,
        trust: previous.trust,
        affection: previous.affection,
        conflict: previous.conflict
      }
    : legacyBia();

  return {
    ...(candidate as GameState),
    schemaVersion: 3,
    contentVersion: "prologue-1.0",
    narrativePackageId: "school-prologue-br-v1",
    currentNodeId: candidate.currentNodeId?.startsWith("ending.") ? candidate.currentNodeId : "prologue.morning",
    relationships: { "school.groupMate": migratedPerson },
    identityRegistry: {
      [migratedPerson.name.toLocaleLowerCase("pt-BR")]: {
        personId: migratedPerson.id,
        displayName: migratedPerson.name,
        gender: migratedPerson.gender,
        reservedAt: candidate.clock ?? START_CLOCK
      }
    },
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
  return getChoiceAvailability(state, node).filter((item) => item.available).map((item) => item.choice);
}

function processDueConsequences(state: GameState): { readonly state: GameState; readonly changes: readonly AppliedChange[]; readonly triggered: readonly TriggeredConsequence[] } {
  const due = state.scheduledConsequences.filter((item) => compareClocks(item.triggerAt, state.clock) <= 0);
  if (due.length === 0) return { state, changes: [], triggered: [] };

  let nextState: GameState = { ...state, scheduledConsequences: state.scheduledConsequences.filter((item) => compareClocks(item.triggerAt, state.clock) > 0) };
  const changes: AppliedChange[] = [];
  const triggered: TriggeredConsequence[] = [];
  for (const consequence of due) {
    const result = applyEffects(nextState, consequence.effects, { sourceChoiceId: consequence.sourceChoiceId });
    nextState = result.state;
    changes.push(...result.changes);
    triggered.push({ id: consequence.id, title: consequence.title, text: consequence.text, changes: result.changes });
  }
  return { state: nextState, changes, triggered };
}

function buildSkillModifiers(state: GameState, choice: StoryChoice): readonly SkillModifier[] {
  if (!choice.skillCheck) return [];
  const modifiers: SkillModifier[] = [
    { label: choice.skillCheck.stat, value: Math.round((state.stats[choice.skillCheck.stat] - 50) / 5) },
    { label: "energy", value: Math.round((state.stats.energy - 50) / 10) },
    { label: "stress", value: -Math.round(state.stats.stress / 20) }
  ];
  for (const bonus of choice.skillCheck.bonusFlags) if (state.flags[bonus.flag] === true) modifiers.push({ label: bonus.label, value: bonus.value });
  return modifiers;
}

export function chooseStoryOption(state: GameState, node: StoryNode, choiceId: string): GameState {
  if (node.id !== state.currentNodeId) throw new Error(`Nó atual é ${state.currentNodeId}, mas foi recebido ${node.id}.`);
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
    ...(consequenceResult.triggered.length > 0 ? { triggeredConsequences: consequenceResult.triggered } : {})
  };

  return { ...nextState, currentNodeId: nextNodeId, history: [...state.history, historyEntry] };
}
