export const STAT_KEYS = [
  "knowledge",
  "communication",
  "discipline",
  "ethics",
  "energy",
  "stress",
  "health",
  "reputation"
] as const;

export type StatKey = (typeof STAT_KEYS)[number];
export type Stats = Readonly<Record<StatKey, number>>;

export type Origin = "low_income" | "middle_income" | "high_income";

export type LocationId =
  | "home"
  | "school"
  | "library"
  | "work"
  | "public_transport"
  | "street";

export interface GameClock {
  readonly date: string;
  readonly minuteOfDay: number;
}

export interface PlayerProfile {
  readonly id: string;
  readonly name: string;
  readonly presentation: "man" | "woman";
  readonly origin: Origin;
}

export const RELATIONSHIP_DIMENSIONS = ["trust", "affection", "conflict"] as const;
export type RelationshipDimension = (typeof RELATIONSHIP_DIMENSIONS)[number];

export interface RelationshipState {
  readonly id: string;
  readonly name: string;
  readonly role: "friend" | "family" | "teacher" | "partner";
  readonly trust: number;
  readonly affection: number;
  readonly conflict: number;
}

export type OutcomeTier =
  | "critical_failure"
  | "failure"
  | "partial_success"
  | "success"
  | "exceptional_success";

export interface SkillModifier {
  readonly label: string;
  readonly value: number;
}

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
  | {
      readonly type: "stat";
      readonly stat: StatKey;
      readonly operator: ComparisonOperator;
      readonly value: number;
    }
  | {
      readonly type: "flag";
      readonly flag: string;
      readonly value: boolean;
    }
  | {
      readonly type: "money";
      readonly operator: ComparisonOperator;
      readonly valueCents: number;
    }
  | {
      readonly type: "location";
      readonly value: LocationId;
    }
  | {
      readonly type: "relationship";
      readonly relationshipId: string;
      readonly dimension: RelationshipDimension;
      readonly operator: ComparisonOperator;
      readonly value: number;
    };

export type ImmediateEffect =
  | {
      readonly type: "stat";
      readonly stat: StatKey;
      readonly delta: number;
    }
  | {
      readonly type: "money";
      readonly deltaCents: number;
    }
  | {
      readonly type: "flag";
      readonly flag: string;
      readonly value: boolean;
    }
  | {
      readonly type: "advance_time";
      readonly minutes: number;
    }
  | {
      readonly type: "set_clock";
      readonly clock: GameClock;
    }
  | {
      readonly type: "set_location";
      readonly location: LocationId;
    }
  | {
      readonly type: "relationship";
      readonly relationshipId: string;
      readonly dimension: RelationshipDimension;
      readonly delta: number;
    };

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
  | {
      readonly type: "stat";
      readonly stat: StatKey;
      readonly before: number;
      readonly after: number;
    }
  | {
      readonly type: "money";
      readonly beforeCents: number;
      readonly afterCents: number;
    }
  | {
      readonly type: "flag";
      readonly flag: string;
      readonly before: boolean;
      readonly after: boolean;
    }
  | {
      readonly type: "clock";
      readonly before: GameClock;
      readonly after: GameClock;
    }
  | {
      readonly type: "location";
      readonly before: LocationId;
      readonly after: LocationId;
    }
  | {
      readonly type: "relationship";
      readonly relationshipId: string;
      readonly dimension: RelationshipDimension;
      readonly before: number;
      readonly after: number;
    }
  | {
      readonly type: "scheduled_consequence";
      readonly consequenceId: string;
      readonly triggerAt: GameClock;
    };

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

export interface GameState {
  readonly schemaVersion: 2;
  readonly contentVersion: string;
  readonly player: PlayerProfile;
  readonly clock: GameClock;
  readonly location: LocationId;
  readonly currentNodeId: string;
  readonly stats: Stats;
  readonly moneyCents: number;
  readonly flags: Readonly<Record<string, boolean>>;
  readonly relationships: Readonly<Record<string, RelationshipState>>;
  readonly rollIndex: number;
  readonly seed: string;
  readonly history: readonly DecisionHistoryEntry[];
  readonly scheduledConsequences: readonly ScheduledConsequence[];
}

export interface SkillCheckBonusFlag {
  readonly flag: string;
  readonly label: string;
  readonly value: number;
}

export interface SkillCheckOutcome {
  readonly nextNodeId: string;
  readonly effects: readonly ImmediateEffect[];
}

export interface StorySkillCheck {
  readonly eventId: string;
  readonly stat: StatKey;
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

export interface StoryCommitment {
  readonly label: string;
  readonly clock: GameClock;
}

export interface StoryNode {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  readonly activity: string;
  readonly nextCommitment?: StoryCommitment;
  readonly choices: readonly StoryChoice[];
  readonly ending?: boolean;
}
