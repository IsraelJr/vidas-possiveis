export const ATTRIBUTE_KEYS = [
  "reasoning",
  "perception",
  "communication",
  "selfControl",
  "vigor",
  "agility"
] as const;
export type AttributeKey = (typeof ATTRIBUTE_KEYS)[number];
export type Attributes = Readonly<Record<AttributeKey, number>>;

export const CONDITION_KEYS = ["energy", "stress", "health"] as const;
export type ConditionKey = (typeof CONDITION_KEYS)[number];
export type ConditionsState = Readonly<Record<ConditionKey, number>>;

/** Conhecimentos são definidos pelo pacote narrativo, não pelo motor. */
export type KnowledgeKey = string;
export type KnowledgeState = Readonly<Record<KnowledgeKey, number>>;

export type Origin = "low_income" | "middle_income" | "high_income";
export type PersonGender = "woman" | "man";
export type RomanticPreference = "women" | "men" | "both" | "none" | "undefined";
/** Locais são identificadores livres definidos por cada pacote narrativo. */
export type LocationId = string;

export interface GameClock {
  readonly date: string;
  readonly minuteOfDay: number;
}

export interface PlayerProfile {
  readonly id: string;
  readonly name: string;
  readonly presentation: PersonGender;
  readonly origin: Origin;
  readonly romanticPreference: RomanticPreference;
}

export const RELATIONSHIP_DIMENSIONS = ["trust", "closeness", "tension"] as const;
export type RelationshipDimension = (typeof RELATIONSHIP_DIMENSIONS)[number];
export type PersonCategory = "scene" | "known" | "important";
export type PersonPresence = "active" | "distant" | "inactive" | "unavailable" | "deceased";

export interface PersonMemory {
  readonly id: string;
  readonly summary: string;
  readonly kind:
    | "help"
    | "promise"
    | "conflict"
    | "humiliation"
    | "reconciliation"
    | "shared_work"
    | "shared_leisure"
    | "family"
    | "academic"
    | "romance"
    | "other";
  readonly occurredAt: GameClock;
  readonly intensity: number;
  readonly resolved: boolean;
  readonly tags: readonly string[];
}

export interface PersonState {
  readonly id: string;
  readonly name: string;
  readonly gender: PersonGender;
  readonly role: string;
  readonly category: PersonCategory;
  readonly presence: PersonPresence;
  readonly contextSummary: string;
  readonly trust: number;
  readonly closeness: number;
  readonly tension: number;
  readonly memories: readonly PersonMemory[];
}

export type OutcomeTier =
  | "critical_failure"
  | "failure"
  | "partial_success"
  | "success"
  | "exceptional_success";

export interface SkillModifier { readonly label: string; readonly value: number; }
export interface SkillCheckInput {
  readonly seed: string;
  readonly eventId: string;
  readonly rollIndex: number;
  readonly difficulty: number;
  readonly modifiers: readonly SkillModifier[];
}
export interface SkillCheckResult {
  readonly roll: number;
  readonly modifierTotal: number;
  readonly score: number;
  readonly outcome: OutcomeTier;
}

export type ComparisonOperator = ">=" | "<=" | ">" | "<" | "==";
export type Condition =
  | { readonly type: "attribute"; readonly attribute: AttributeKey; readonly operator: ComparisonOperator; readonly value: number }
  | { readonly type: "condition"; readonly condition: ConditionKey; readonly operator: ComparisonOperator; readonly value: number }
  | { readonly type: "knowledge"; readonly knowledge: KnowledgeKey; readonly operator: ComparisonOperator; readonly value: number }
  | { readonly type: "reputation"; readonly operator: ComparisonOperator; readonly value: number }
  | { readonly type: "flag"; readonly flag: string; readonly value: boolean }
  | { readonly type: "money"; readonly operator: ComparisonOperator; readonly valueCents: number }
  | { readonly type: "location"; readonly value: LocationId }
  | { readonly type: "relationship"; readonly personId: string; readonly dimension: RelationshipDimension; readonly operator: ComparisonOperator; readonly value: number };

export type ImmediateEffect =
  | { readonly type: "attribute"; readonly attribute: AttributeKey; readonly delta: number }
  | { readonly type: "condition"; readonly condition: ConditionKey; readonly delta: number }
  | { readonly type: "knowledge"; readonly knowledge: KnowledgeKey; readonly delta: number }
  | { readonly type: "reputation"; readonly delta: number }
  | { readonly type: "money"; readonly deltaCents: number }
  | { readonly type: "flag"; readonly flag: string; readonly value: boolean }
  | { readonly type: "advance_time"; readonly minutes: number }
  | { readonly type: "set_clock"; readonly clock: GameClock }
  | { readonly type: "set_location"; readonly location: LocationId }
  | { readonly type: "relationship"; readonly personId: string; readonly dimension: RelationshipDimension; readonly delta: number }
  | { readonly type: "add_memory"; readonly personId: string; readonly memory: Omit<PersonMemory, "occurredAt"> }
  | { readonly type: "set_person_category"; readonly personId: string; readonly category: PersonCategory }
  | { readonly type: "set_person_presence"; readonly personId: string; readonly presence: PersonPresence };

export interface ScheduleConsequenceEffect {
  readonly type: "schedule_consequence";
  readonly consequenceId: string;
  readonly delayMinutes: number;
  readonly title: string;
  readonly text: string;
  readonly effects: readonly ImmediateEffect[];
}
export type Effect = ImmediateEffect | ScheduleConsequenceEffect;

export interface ScheduledConsequence {
  readonly id: string;
  readonly sourceChoiceId: string;
  readonly title: string;
  readonly text: string;
  readonly triggerAt: GameClock;
  readonly effects: readonly ImmediateEffect[];
}

export type AppliedChange =
  | { readonly type: "attribute"; readonly attribute: AttributeKey; readonly before: number; readonly after: number }
  | { readonly type: "condition"; readonly condition: ConditionKey; readonly before: number; readonly after: number }
  | { readonly type: "knowledge"; readonly knowledge: KnowledgeKey; readonly before: number; readonly after: number }
  | { readonly type: "reputation"; readonly before: number; readonly after: number }
  | { readonly type: "money"; readonly beforeCents: number; readonly afterCents: number }
  | { readonly type: "flag"; readonly flag: string; readonly before: boolean; readonly after: boolean }
  | { readonly type: "clock"; readonly before: GameClock; readonly after: GameClock }
  | { readonly type: "location"; readonly before: LocationId; readonly after: LocationId }
  | { readonly type: "relationship"; readonly personId: string; readonly dimension: RelationshipDimension; readonly before: number; readonly after: number }
  | { readonly type: "memory"; readonly personId: string; readonly memoryId: string }
  | { readonly type: "person_category"; readonly personId: string; readonly before: PersonCategory; readonly after: PersonCategory }
  | { readonly type: "person_presence"; readonly personId: string; readonly before: PersonPresence; readonly after: PersonPresence }
  | { readonly type: "scheduled_consequence"; readonly consequenceId: string; readonly triggerAt: GameClock };

export interface TriggeredConsequence {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  readonly changes: readonly AppliedChange[];
}
export interface DecisionHistoryEntry {
  readonly nodeId: string;
  readonly choiceId: string;
  readonly decidedAt: GameClock;
  readonly changes: readonly AppliedChange[];
  readonly skillCheck?: SkillCheckResult;
  readonly triggeredConsequences?: readonly TriggeredConsequence[];
}

export interface ScenarioState {
  readonly id: string;
  readonly variables: Readonly<Record<string, string>>;
}

export interface GameState {
  readonly schemaVersion: 3;
  readonly contentVersion: string;
  readonly player: PlayerProfile;
  readonly clock: GameClock;
  readonly location: LocationId;
  readonly currentNodeId: string;
  readonly attributes: Attributes;
  readonly conditions: ConditionsState;
  readonly knowledge: KnowledgeState;
  readonly reputation: number;
  readonly moneyCents: number;
  readonly flags: Readonly<Record<string, boolean>>;
  readonly people: Readonly<Record<string, PersonState>>;
  readonly usedNames: Readonly<Record<string, string>>;
  readonly scenario: ScenarioState;
  readonly rollIndex: number;
  readonly seed: string;
  readonly history: readonly DecisionHistoryEntry[];
  readonly scheduledConsequences: readonly ScheduledConsequence[];
}

/**
 * Migração declarativa entre versões do mesmo pacote narrativo.
 * O motor preserva o estado compatível e só reposiciona vidas que já haviam
 * concluído a versão anterior.
 */
export interface ScenarioContentMigration {
  readonly fromContentVersions: readonly string[];
  readonly completionNodeIds?: readonly string[];
  readonly completionFlag?: string;
  readonly resumeNodeId?: string;
  readonly resumeClock?: GameClock;
  readonly resumeLocation?: LocationId;
  readonly resetFlags?: readonly string[];
  readonly noticeFlag?: string;
}

export interface GameScenarioSetup {
  readonly id: string;
  readonly contentVersion: string;
  readonly entryNodeId: string;
  readonly clock: GameClock;
  readonly location: LocationId;
  readonly moneyCents: number;
  readonly initialKnowledge?: KnowledgeState;
  readonly attributeAdjustments?: Partial<Record<AttributeKey, number>>;
  readonly conditionAdjustments?: Partial<Record<ConditionKey, number>>;
  readonly initialReputation?: number;
  readonly flags: Readonly<Record<string, boolean>>;
  readonly people: Readonly<Record<string, PersonState>>;
  readonly usedNames: Readonly<Record<string, string>>;
  readonly variables: Readonly<Record<string, string>>;
  readonly contentMigration?: ScenarioContentMigration;
}

export interface SkillCheckBonusFlag { readonly flag: string; readonly label: string; readonly value: number; }
export interface SkillCheckOutcome { readonly nextNodeId: string; readonly effects: readonly ImmediateEffect[]; }
export interface StorySkillCheck {
  readonly eventId: string;
  readonly attribute: AttributeKey;
  readonly difficulty: number;
  readonly bonusFlags: readonly SkillCheckBonusFlag[];
  readonly outcomes: Readonly<Record<OutcomeTier, SkillCheckOutcome>>;
}
export interface StoryChoice {
  readonly id: string;
  readonly label: string;
  readonly conditions: readonly Condition[];
  readonly effects: readonly Effect[];
  readonly nextNodeId: string;
  readonly skillCheck?: StorySkillCheck;
}
export interface StoryChoiceAvailability {
  readonly choice: StoryChoice;
  readonly available: boolean;
  readonly failedConditions: readonly Condition[];
}
export interface StoryCommitment { readonly label: string; readonly clock: GameClock; }
export interface StoryNode {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  readonly activity: string;
  readonly nextCommitment?: StoryCommitment;
  readonly contextPersonIds?: readonly string[];
  readonly moduleId?: string;
  readonly choices: readonly StoryChoice[];
  readonly ending?: boolean;
}
