import { openDB, type DBSchema } from "idb";
import { z } from "zod";

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
export type Presentation = "man" | "woman";
export type LocationId =
  | "home"
  | "school"
  | "library"
  | "public_transport"
  | "work"
  | "street";

export interface GameClock {
  readonly date: string;
  readonly minuteOfDay: number;
}

export interface PlayerProfile {
  readonly id: string;
  readonly name: string;
  readonly presentation: Presentation;
  readonly origin: Origin;
}

export type Operator = ">=" | "<=" | ">" | "<" | "==";

export type Condition =
  | {
      readonly type: "stat";
      readonly stat: StatKey;
      readonly operator: Operator;
      readonly value: number;
    }
  | {
      readonly type: "flag";
      readonly flag: string;
      readonly value: boolean;
    }
  | {
      readonly type: "money";
      readonly operator: Operator;
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
      readonly key: StatKey;
      readonly before: number;
      readonly after: number;
    }
  | {
      readonly type: "money";
      readonly before: number;
      readonly after: number;
    }
  | {
      readonly type: "flag";
      readonly key: string;
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

export interface DecisionEntry {
  readonly nodeId: string;
  readonly choiceId: string;
  readonly decidedAt: GameClock;
  readonly changes: readonly AppliedChange[];
}

export interface GameState {
  readonly schemaVersion: 1;
  readonly contentVersion: "sprint-0.1";
  readonly player: PlayerProfile;
  readonly clock: GameClock;
  readonly location: LocationId;
  readonly currentNodeId: string;
  readonly stats: Stats;
  readonly moneyCents: number;
  readonly flags: Readonly<Record<string, boolean>>;
  readonly seed: string;
  readonly rollIndex: number;
  readonly history: readonly DecisionEntry[];
}

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

const MINUTES_PER_DAY = 1_440;

const BASE_STATS: Stats = {
  knowledge: 35,
  communication: 35,
  discipline: 40,
  ethics: 50,
  energy: 75,
  stress: 20,
  health: 80,
  reputation: 10
};

const ORIGIN_STAT_DELTAS: Readonly<
  Record<Origin, Partial<Record<StatKey, number>>>
> = {
  low_income: {
    discipline: 3,
    energy: -4,
    stress: 5
  },
  middle_income: {},
  high_income: {
    knowledge: 2,
    stress: -2
  }
};

function parseDate(value: string): Date {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Data inválida: ${value}`);
  }
  return parsed;
}

export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function formatTime(minuteOfDay: number): string {
  if (
    !Number.isInteger(minuteOfDay) ||
    minuteOfDay < 0 ||
    minuteOfDay >= MINUTES_PER_DAY
  ) {
    throw new Error("Horário inválido.");
  }

  const hours = String(Math.floor(minuteOfDay / 60)).padStart(2, "0");
  const minutes = String(minuteOfDay % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatDatePtBr(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    timeZone: "UTC"
  }).format(parseDate(date));
}

export function advanceClock(
  clock: GameClock,
  minutes: number
): GameClock {
  if (!Number.isInteger(minutes) || minutes < 0) {
    throw new Error("O avanço deve ser inteiro e não negativo.");
  }

  const total = clock.minuteOfDay + minutes;
  const date = parseDate(clock.date);
  date.setUTCDate(date.getUTCDate() + Math.floor(total / MINUTES_PER_DAY));

  return {
    date: date.toISOString().slice(0, 10),
    minuteOfDay: total % MINUTES_PER_DAY
  };
}

function compare(
  left: number,
  operator: Operator,
  right: number
): boolean {
  switch (operator) {
    case ">=":
      return left >= right;
    case "<=":
      return left <= right;
    case ">":
      return left > right;
    case "<":
      return left < right;
    case "==":
      return left === right;
  }
}

export function conditionIsMet(
  state: GameState,
  condition: Condition
): boolean {
  switch (condition.type) {
    case "stat":
      return compare(
        state.stats[condition.stat],
        condition.operator,
        condition.value
      );
    case "flag":
      return (state.flags[condition.flag] ?? false) === condition.value;
    case "money":
      return compare(
        state.moneyCents,
        condition.operator,
        condition.valueCents
      );
    case "location":
      return state.location === condition.value;
  }
}

export function createInitialStats(origin: Origin): Stats {
  const deltas = ORIGIN_STAT_DELTAS[origin];

  return Object.fromEntries(
    STAT_KEYS.map((key) => [
      key,
      clampStat(BASE_STATS[key] + (deltas[key] ?? 0))
    ])
  ) as unknown as Stats;
}

export function createGameState(player: PlayerProfile): GameState {
  return {
    schemaVersion: 1,
    contentVersion: "sprint-0.1",
    player,
    clock: {
      date: "2026-02-16",
      minuteOfDay: 16 * 60
    },
    location: "school",
    currentNodeId: "school.computer-assignment",
    stats: createInitialStats(player.origin),
    moneyCents:
      player.origin === "low_income"
        ? 3_000
        : player.origin === "middle_income"
          ? 12_000
          : 30_000,
    flags: {
      hasComputer: player.origin !== "low_income"
    },
    seed: `${player.id}:${player.origin}`,
    rollIndex: 0,
    history: []
  };
}

export function availableChoices(
  state: GameState,
  node: StoryNode
): readonly StoryChoice[] {
  return node.choices.filter((choice) =>
    choice.conditions.every((condition) =>
      conditionIsMet(state, condition)
    )
  );
}

export function applyEffects(
  state: GameState,
  effects: readonly Effect[]
): {
  readonly state: GameState;
  readonly changes: readonly AppliedChange[];
} {
  let next = state;
  const changes: AppliedChange[] = [];

  for (const effect of effects) {
    switch (effect.type) {
      case "stat": {
        const before = next.stats[effect.stat];
        const after = clampStat(before + effect.delta);
        next = {
          ...next,
          stats: {
            ...next.stats,
            [effect.stat]: after
          }
        };
        changes.push({
          type: "stat",
          key: effect.stat,
          before,
          after
        });
        break;
      }
      case "money": {
        const before = next.moneyCents;
        const after = Math.max(0, before + effect.deltaCents);
        next = {
          ...next,
          moneyCents: after
        };
        changes.push({
          type: "money",
          before,
          after
        });
        break;
      }
      case "flag": {
        const before = next.flags[effect.flag] ?? false;
        next = {
          ...next,
          flags: {
            ...next.flags,
            [effect.flag]: effect.value
          }
        };
        changes.push({
          type: "flag",
          key: effect.flag,
          before,
          after: effect.value
        });
        break;
      }
      case "advance_time": {
        const before = next.clock;
        const after = advanceClock(before, effect.minutes);
        next = {
          ...next,
          clock: after
        };
        changes.push({
          type: "clock",
          before,
          after
        });
        break;
      }
      case "set_location": {
        const before = next.location;
        next = {
          ...next,
          location: effect.location
        };
        changes.push({
          type: "location",
          before,
          after: effect.location
        });
        break;
      }
    }
  }

  return {
    state: next,
    changes
  };
}

export function choose(
  state: GameState,
  node: StoryNode,
  choiceId: string
): GameState {
  if (node.id !== state.currentNodeId) {
    throw new Error("Nó narrativo fora de sincronia.");
  }

  const choice = node.choices.find(
    (candidate) => candidate.id === choiceId
  );

  if (!choice) {
    throw new Error(`Escolha inexistente: ${choiceId}`);
  }

  if (
    !choice.conditions.every((condition) =>
      conditionIsMet(state, condition)
    )
  ) {
    throw new Error("Escolha indisponível.");
  }

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

export type Outcome =
  | "critical_failure"
  | "failure"
  | "partial_success"
  | "success"
  | "exceptional_success";

function hash(value: string): number {
  let result = 2_166_136_261;

  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16_777_619);
  }

  return result >>> 0;
}

function random(seed: number): number {
  let value = seed + 0x6d2b79f5;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
}

export function skillCheck(input: {
  readonly seed: string;
  readonly eventId: string;
  readonly rollIndex: number;
  readonly difficulty: number;
  readonly modifiers: readonly number[];
}): {
  readonly roll: number;
  readonly score: number;
  readonly outcome: Outcome;
} {
  const roll =
    Math.floor(
      random(hash(`${input.seed}:${input.eventId}:${input.rollIndex}`)) *
        100
    ) + 1;

  const score = Math.max(
    1,
    Math.min(
      100,
      roll +
        input.modifiers.reduce((sum, value) => sum + value, 0) -
        input.difficulty +
        50
    )
  );

  const outcome: Outcome =
    score <= 10
      ? "critical_failure"
      : score <= 35
        ? "failure"
        : score <= 60
          ? "partial_success"
          : score <= 90
            ? "success"
            : "exceptional_success";

  return {
    roll,
    score,
    outcome
  };
}

const nodeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  text: z.string().min(1),
  ending: z.boolean().optional(),
  choices: z.array(
    z.object({
      id: z.string().min(1),
      label: z.string().min(1),
      conditions: z.array(z.unknown()),
      effects: z.array(z.unknown()),
      nextNodeId: z.string().min(1)
    })
  )
});

const rawNodes = [
  {
    id: "school.computer-assignment",
    title: "O trabalho que vale o bimestre",
    text:
      "A professora anuncia um trabalho em grupo que exige pesquisa, apresentação e acesso a um computador. A entrega será amanhã cedo. Você precisa decidir como organizar o fim da tarde.",
    choices: [
      {
        id: "use-own-computer",
        label: "Voltar para casa e usar o computador da família",
        conditions: [
          {
            type: "flag",
            flag: "hasComputer",
            value: true
          }
        ],
        effects: [
          {
            type: "advance_time",
            minutes: 45
          },
          {
            type: "set_location",
            location: "home"
          },
          {
            type: "stat",
            stat: "energy",
            delta: -5
          },
          {
            type: "stat",
            stat: "knowledge",
            delta: 2
          },
          {
            type: "flag",
            flag: "preparedAssignment",
            value: true
          }
        ],
        nextNodeId: "school.assignment-result"
      },
      {
        id: "go-library",
        label: "Ir à biblioteca pública antes que ela feche",
        conditions: [],
        effects: [
          {
            type: "advance_time",
            minutes: 90
          },
          {
            type: "set_location",
            location: "library"
          },
          {
            type: "stat",
            stat: "energy",
            delta: -10
          },
          {
            type: "stat",
            stat: "discipline",
            delta: 2
          },
          {
            type: "stat",
            stat: "knowledge",
            delta: 3
          },
          {
            type: "flag",
            flag: "preparedAssignment",
            value: true
          }
        ],
        nextNodeId: "school.assignment-result"
      },
      {
        id: "use-phone",
        label: "Tentar fazer tudo pelo celular durante o trajeto",
        conditions: [],
        effects: [
          {
            type: "advance_time",
            minutes: 60
          },
          {
            type: "set_location",
            location: "public_transport"
          },
          {
            type: "stat",
            stat: "energy",
            delta: -8
          },
          {
            type: "stat",
            stat: "stress",
            delta: 8
          },
          {
            type: "stat",
            stat: "knowledge",
            delta: 1
          }
        ],
        nextNodeId: "school.assignment-result"
      }
    ]
  },
  {
    id: "school.assignment-result",
    title: "O fim da tarde",
    text:
      "A decisão consumiu parte do seu tempo e alterou como você chegará à noite. O relógio, a energia e os recursos disponíveis já mudaram — e amanhã haverá uma apresentação.",
    ending: true,
    choices: []
  }
] as const;

export const storyNodes = new Map<string, StoryNode>(
  rawNodes.map((raw) => {
    nodeSchema.parse(raw);
    return [raw.id, raw as unknown as StoryNode];
  })
);

export function getNode(id: string): StoryNode {
  const node = storyNodes.get(id);

  if (!node) {
    throw new Error(`Nó inexistente: ${id}`);
  }

  return node;
}

interface GameDatabase extends DBSchema {
  saves: {
    key: string;
    value: GameState;
  };
}

export interface SaveRepository {
  load(slot: string): Promise<GameState | null>;
  save(slot: string, state: GameState): Promise<void>;
  delete(slot: string): Promise<void>;
}

export class IndexedDbSaveRepository implements SaveRepository {
  readonly #database = openDB<GameDatabase>("vidas-possiveis", 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains("saves")) {
        database.createObjectStore("saves");
      }
    }
  });

  async load(slot: string): Promise<GameState | null> {
    return (await (await this.#database).get("saves", slot)) ?? null;
  }

  async save(slot: string, state: GameState): Promise<void> {
    await (await this.#database).put("saves", state, slot);
  }

  async delete(slot: string): Promise<void> {
    await (await this.#database).delete("saves", slot);
  }
}

export class MemorySaveRepository implements SaveRepository {
  readonly #items = new Map<string, GameState>();

  async load(slot: string): Promise<GameState | null> {
    return this.#items.get(slot) ?? null;
  }

  async save(slot: string, state: GameState): Promise<void> {
    this.#items.set(slot, structuredClone(state));
  }

  async delete(slot: string): Promise<void> {
    this.#items.delete(slot);
  }
}
