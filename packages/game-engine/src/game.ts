import { compareClocks } from "./clock";
import { conditionsAreMet, evaluateCondition } from "./conditions";
import { applyEffects } from "./effects";
import { runSkillCheck } from "./skill-check";
import {
  clampValue,
  createInitialAttributes,
  createInitialConditions,
  createInitialKnowledge
} from "./stats";
import type {
  AppliedChange,
  Effect,
  GameScenarioSetup,
  GameState,
  NarrativeChoiceOutcome,
  PlayerProfile,
  SkillModifier,
  StoryChoice,
  StoryChoiceAvailability,
  StoryNode,
  TriggeredConsequence
} from "./types";

export function createGameState(player: PlayerProfile, setup: GameScenarioSetup): GameState {
  return {
    schemaVersion: 3,
    contentVersion: setup.contentVersion,
    player,
    clock: setup.clock,
    location: setup.location,
    currentNodeId: setup.entryNodeId,
    attributes: createInitialAttributes(setup.attributeAdjustments),
    conditions: createInitialConditions(setup.conditionAdjustments),
    knowledge: createInitialKnowledge(setup.initialKnowledge ?? {}),
    reputation: clampValue(setup.initialReputation ?? 10),
    moneyCents: setup.moneyCents,
    flags: setup.flags,
    people: setup.people,
    usedNames: setup.usedNames,
    scenario: { id: setup.id, variables: setup.variables },
    rollIndex: 0,
    seed: `${player.id}:${setup.id}`,
    history: [],
    scheduledConsequences: []
  };
}

export function readPersistedPlayerProfile(state: unknown): PlayerProfile | null {
  if (!state || typeof state !== "object") return null;
  const candidate = state as { readonly player?: Partial<PlayerProfile> };
  const player = candidate.player;
  if (!player || typeof player.id !== "string" || typeof player.name !== "string") return null;

  return {
    id: player.id,
    name: player.name,
    presentation: player.presentation === "woman" ? "woman" : "man",
    origin: "middle_income",
    romanticPreference:
      player.romanticPreference === "women" ||
      player.romanticPreference === "men" ||
      player.romanticPreference === "both" ||
      player.romanticPreference === "none"
        ? player.romanticPreference
        : "undefined"
  };
}

function canPreserveContentUpgrade(candidate: Partial<GameState>, setup: GameScenarioSetup): boolean {
  const migration = setup.contentMigration;
  return Boolean(
    candidate.schemaVersion === 3 &&
      candidate.scenario?.id === setup.id &&
      typeof candidate.contentVersion === "string" &&
      migration?.fromContentVersions.includes(candidate.contentVersion)
  );
}

function migrateCompatibleContent(
  candidate: Partial<GameState>,
  player: PlayerProfile,
  setup: GameScenarioSetup
): GameState {
  const fresh = createGameState(player, setup);
  const migration = setup.contentMigration;
  if (!migration) return fresh;

  const completedByNode =
    typeof candidate.currentNodeId === "string" &&
    (migration.completionNodeIds?.includes(candidate.currentNodeId) ?? false);
  const completedByFlag =
    typeof migration.completionFlag === "string" && candidate.flags?.[migration.completionFlag] === true;
  const shouldResume = completedByNode || completedByFlag;

  const resetFlags = Object.fromEntries(
    (migration.resetFlags ?? []).map((flag) => [flag, false])
  ) as Readonly<Record<string, boolean>>;
  const mergedFlags: Record<string, boolean> = {
    ...fresh.flags,
    ...(candidate.flags ?? {}),
    ...resetFlags
  };
  if (migration.noticeFlag) mergedFlags[migration.noticeFlag] = true;

  return {
    ...fresh,
    ...candidate,
    schemaVersion: 3,
    contentVersion: setup.contentVersion,
    player,
    clock:
      shouldResume && migration.resumeClock
        ? migration.resumeClock
        : candidate.clock ?? fresh.clock,
    location:
      shouldResume && migration.resumeLocation
        ? migration.resumeLocation
        : candidate.location ?? fresh.location,
    currentNodeId:
      shouldResume && migration.resumeNodeId
        ? migration.resumeNodeId
        : candidate.currentNodeId ?? fresh.currentNodeId,
    attributes: { ...fresh.attributes, ...(candidate.attributes ?? {}) },
    conditions: { ...fresh.conditions, ...(candidate.conditions ?? {}) },
    knowledge: { ...fresh.knowledge, ...(candidate.knowledge ?? {}) },
    reputation: candidate.reputation ?? fresh.reputation,
    moneyCents: candidate.moneyCents ?? fresh.moneyCents,
    flags: mergedFlags,
    people: { ...fresh.people, ...(candidate.people ?? {}) },
    usedNames: { ...fresh.usedNames, ...(candidate.usedNames ?? {}) },
    scenario: {
      id: setup.id,
      variables: {
        ...fresh.scenario.variables,
        ...(candidate.scenario?.variables ?? {})
      }
    },
    rollIndex: candidate.rollIndex ?? fresh.rollIndex,
    seed: candidate.seed ?? fresh.seed,
    history: candidate.history ?? fresh.history,
    scheduledConsequences: candidate.scheduledConsequences ?? fresh.scheduledConsequences,
    ...(candidate.pendingOutcome ? { pendingOutcome: candidate.pendingOutcome } : {})
  };
}

export function migrateGameState(state: unknown, setup: GameScenarioSetup): GameState {
  const player = readPersistedPlayerProfile(state);
  if (!player) throw new Error("O progresso salvo não contém um personagem válido.");

  const candidate = state as Partial<GameState>;
  if (
    candidate.schemaVersion === 3 &&
    candidate.contentVersion === setup.contentVersion &&
    candidate.scenario?.id === setup.id
  ) {
    return candidate as GameState;
  }

  if (canPreserveContentUpgrade(candidate, setup)) {
    return migrateCompatibleContent(candidate, player, setup);
  }

  const migrated = createGameState(player, setup);
  return {
    ...migrated,
    flags: {
      ...migrated.flags,
      migratedFromEarlierPrologue: true
    }
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
      label: choice.skillCheck.attribute,
      value: Math.round((state.attributes[choice.skillCheck.attribute] - 50) / 5)
    },
    {
      label: "energy",
      value: Math.round((state.conditions.energy - 50) / 10)
    },
    {
      label: "stress",
      value: -Math.round(state.conditions.stress / 20)
    }
  ];

  for (const bonus of choice.skillCheck.bonusFlags) {
    if (state.flags[bonus.flag] === true) modifiers.push({ label: bonus.label, value: bonus.value });
  }

  return modifiers;
}

function lowerFirst(value: string): string {
  if (value.length === 0) return value;
  return `${value.charAt(0).toLocaleLowerCase("pt-BR")}${value.slice(1)}`;
}

function defaultChoiceOutcome(choice: StoryChoice): NarrativeChoiceOutcome {
  const action = lowerFirst(choice.label).replace(/[.!?]+$/, "");
  return {
    title: "Sua decisão",
    text: `Você decide ${action}.`,
    continueLabel: "Continuar",
    activity: "Seguir com a decisão"
  };
}

function validateTemporalEffects(node: StoryNode, effects: readonly Effect[]): void {
  const transitions = effects.filter((effect) => effect.type === "time_transition");
  if (transitions.length === 0) return;
  if (transitions.length > 1) {
    throw new Error("Uma escolha não pode executar mais de uma transição temporal.");
  }

  const transition = transitions[0];
  if (!transition) return;
  const requiredBoundary = transition.kind === "sleep" ? "day-end" : "montage";
  if (node.timeBoundary !== requiredBoundary) {
    throw new Error(
      transition.kind === "sleep"
        ? "A história só pode avançar pelo sono depois que o dia estiver encerrado."
        : "Este salto de tempo só pode acontecer em uma passagem narrativa preparada para isso."
    );
  }

  if (node.nextCommitment && compareClocks(transition.clock, node.nextCommitment.clock) > 0) {
    throw new Error(
      `A transição tentaria pular o compromisso '${node.nextCommitment.label}'.`
    );
  }
}

export function chooseStoryOption(state: GameState, node: StoryNode, choiceId: string): GameState {
  if (state.pendingOutcome) {
    throw new Error("Conclua a consequência narrativa antes de fazer outra escolha.");
  }
  if (node.id !== state.currentNodeId) {
    throw new Error(`Nó atual é ${state.currentNodeId}, mas foi recebido ${node.id}.`);
  }

  const choice = node.choices.find((candidate) => candidate.id === choiceId);
  if (!choice) throw new Error(`Escolha inexistente: ${choiceId}`);
  if (!conditionsAreMet(state, choice.conditions)) throw new Error(`Escolha indisponível: ${choiceId}`);

  validateTemporalEffects(node, choice.effects);
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
    validateTemporalEffects(node, outcome.effects);
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
  const outcome = choice.outcome ?? defaultChoiceOutcome(choice);

  return {
    ...nextState,
    currentNodeId: node.id,
    pendingOutcome: {
      ...outcome,
      sourceNodeId: node.id,
      sourceChoiceId: choice.id,
      nextNodeId
    },
    history: [...state.history, historyEntry]
  };
}

export function continueStoryAfterOutcome(state: GameState): GameState {
  if (!state.pendingOutcome) {
    throw new Error("Não existe consequência narrativa aguardando continuidade.");
  }
  const { pendingOutcome, ...rest } = state;
  return {
    ...rest,
    currentNodeId: pendingOutcome.nextNodeId
  };
}