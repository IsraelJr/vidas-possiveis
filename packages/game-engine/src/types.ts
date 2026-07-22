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

export interface ScheduledConsequence {
  readonly id: string;
  readonly sourceChoiceId: string;
  readonly triggerAt: GameClock;
  readonly effects: readonly Effect[];
}

export interface DecisionHistoryEntry {
  readonly nodeId: string;
  readonly choiceId: string;
  readonly decidedAt: GameClock;
  readonly changes: readonly AppliedChange[];
}

export interface GameState {
  readonly schemaVersion: 1;
  readonly contentVersion: string;
  readonly player: PlayerProfile;
  readonly clock: GameClock;
  readonly location: LocationId;
  readonly currentNodeId: string;
  readonly stats: Stats;
  readonly moneyCents: number;
  readonly flags: Readonly<Record<string, boolean>>;
  readonly rollIndex: number;
  readonly seed: string;
  readonly history: readonly DecisionHistoryEntry[];
  readonly scheduledConsequences: readonly ScheduledConsequence[];
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
    };

export type Effect =
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
      readonly type: "set_location";
      readonly location: LocationId;
    };

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
    };

export interface StoryChoice {
  readonly id: string;
  readonly label: string;
  readonly conditions: readonly Condition[];
  readonly effects: readonly Effect[];
  readonly nextNodeId: string;
}

export interface StoryNode {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  readonly choices: readonly StoryChoice[];
  readonly ending?: boolean;
}
