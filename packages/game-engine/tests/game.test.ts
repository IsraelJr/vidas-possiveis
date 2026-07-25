import { describe, expect, it } from "vitest";
import {
  chooseStoryOption,
  createGameState,
  getChoiceAvailability,
  migrateGameState,
  readPersistedPlayerProfile,
  type GameScenarioSetup,
  type PlayerProfile,
  type StoryNode,
  type StorySkillCheck
} from "../src";

const player: PlayerProfile = {
  id: "p",
  name: "Rui",
  presentation: "man",
  origin: "middle_income",
  romanticPreference: "women"
};

const setup: GameScenarioSetup = {
  id: "generic-life",
  contentVersion: "generic-1",
  entryNodeId: "start",
  clock: { date: "2026-02-16", minuteOfDay: 6 * 60 },
  location: "home",
  moneyCents: 10_000,
  flags: { allowed: false },
  usedNames: { rui: "player", paula: "person-1" },
  variables: {},
  people: {
    "person-1": {
      id: "person-1",
      name: "Paula",
      gender: "woman",
      role: "Colega",
      category: "known",
      presence: "active",
      contextSummary: "Colega conhecida.",
      trust: 30,
      closeness: 20,
      tension: 5,
      memories: []
    }
  }
};

const outcomes: StorySkillCheck["outcomes"] = {
  critical_failure: { nextNodeId: "critical", effects: [{ type: "condition", condition: "stress", delta: 10 }] },
  failure: { nextNodeId: "failure", effects: [{ type: "condition", condition: "stress", delta: 5 }] },
  partial_success: { nextNodeId: "partial", effects: [{ type: "reputation", delta: 1 }] },
  success: { nextNodeId: "success", effects: [{ type: "reputation", delta: 3 }] },
  exceptional_success: { nextNodeId: "exceptional", effects: [{ type: "reputation", delta: 5 }] }
};

const node: StoryNode = {
  id: "start",
  title: "Decisão",
  text: "Escolha.",
  activity: "Decidir",
  choices: [
    {
      id: "blocked",
      label: "Bloqueada",
      conditions: [{ type: "flag", flag: "allowed", value: true }],
      effects: [],
      nextNodeId: "after"
    },
    {
      id: "present",
      label: "Agir",
      conditions: [],
      effects: [
        { type: "advance_time", minutes: 20 },
        { type: "relationship", personId: "person-1", dimension: "trust", delta: 4 }
      ],
      nextNodeId: "partial",
      skillCheck: {
        eventId: "generic-action",
        attribute: "communication",
        difficulty: 50,
        bonusFlags: [],
        outcomes
      }
    }
  ]
};

describe("game", () => {
  it("explica escolhas bloqueadas", () => {
    const state = createGameState(player, setup);
    const blocked = getChoiceAvailability(state, node).find((item) => item.choice.id === "blocked");
    expect(blocked?.available).toBe(false);
    expect(blocked?.failedConditions).toEqual([{ type: "flag", flag: "allowed", value: true }]);
  });

  it("usa teste determinístico e mantém o personId", () => {
    const state = createGameState(player, setup);
    const next = chooseStoryOption(state, node, "present");
    const result = next.history.at(-1)?.skillCheck;
    expect(result).toBeDefined();
    expect(next.currentNodeId).toBe(outcomes[result!.outcome].nextNodeId);
    expect(next.people["person-1"]?.name).toBe("Paula");
    expect(next.people["person-1"]?.trust).toBe(34);
  });

  it("migra progresso antigo para o pacote atual sem perder o personagem", () => {
    const legacy = {
      schemaVersion: 2,
      contentVersion: "sprint-1.0",
      player: { id: "old", name: "Lia", presentation: "woman", origin: "low_income" }
    };
    const migrated = migrateGameState(legacy, setup);
    expect(migrated.schemaVersion).toBe(3);
    expect(migrated.player.name).toBe("Lia");
    expect(migrated.player.origin).toBe("middle_income");
    expect(migrated.currentNodeId).toBe(setup.entryNodeId);
    expect(migrated.flags.migratedFromEarlierPrologue).toBe(true);
  });

  it("preserva uma vida em andamento ao atualizar o conteúdo do mesmo pacote", () => {
    const oldState = {
      ...createGameState(player, { ...setup, contentVersion: "generic-1" }),
      currentNodeId: "middle",
      clock: { date: "2026-06-10", minuteOfDay: 14 * 60 },
      moneyCents: 42_500,
      flags: { allowed: true, rememberedChoice: true },
      reputation: 27,
      history: [
        {
          nodeId: "start",
          choiceId: "present",
          decidedAt: { date: "2026-02-16", minuteOfDay: 6 * 60 },
          changes: []
        }
      ]
    };
    const upgradedSetup: GameScenarioSetup = {
      ...setup,
      contentVersion: "generic-2",
      initialKnowledge: { planning: 20 },
      flags: { allowed: false, newDefault: true },
      contentMigration: {
        fromContentVersions: ["generic-1"],
        completionNodeIds: ["old-ending"],
        resumeNodeId: "new-chapter",
        resumeClock: { date: "2027-01-01", minuteOfDay: 9 * 60 },
        noticeFlag: "contentUpdated"
      }
    };

    const migrated = migrateGameState(oldState, upgradedSetup);
    expect(migrated.contentVersion).toBe("generic-2");
    expect(migrated.currentNodeId).toBe("middle");
    expect(migrated.clock).toEqual(oldState.clock);
    expect(migrated.moneyCents).toBe(42_500);
    expect(migrated.reputation).toBe(27);
    expect(migrated.flags.rememberedChoice).toBe(true);
    expect(migrated.flags.newDefault).toBe(true);
    expect(migrated.flags.contentUpdated).toBe(true);
    expect(migrated.history).toHaveLength(1);
    expect(migrated.people["person-1"]?.id).toBe("person-1");
  });

  it("reposiciona somente uma vida que concluiu a versão anterior", () => {
    const oldState = {
      ...createGameState(player, { ...setup, contentVersion: "generic-1" }),
      currentNodeId: "old-ending",
      clock: { date: "2026-12-18", minuteOfDay: 18 * 60 },
      moneyCents: 31_000,
      flags: { allowed: true, oldCompleted: true, oldPath: true },
      people: {
        ...createGameState(player, setup).people,
        "person-1": {
          ...createGameState(player, setup).people["person-1"]!,
          trust: 44,
          memories: [
            {
              id: "kept-memory",
              summary: "Uma escolha antiga foi preservada.",
              kind: "shared_work" as const,
              occurredAt: { date: "2026-05-01", minuteOfDay: 10 * 60 },
              intensity: 7,
              resolved: true,
              tags: ["migration"]
            }
          ]
        }
      }
    };
    const upgradedSetup: GameScenarioSetup = {
      ...setup,
      contentVersion: "generic-2",
      flags: { allowed: false, newDefault: true },
      contentMigration: {
        fromContentVersions: ["generic-1"],
        completionNodeIds: ["old-ending"],
        completionFlag: "oldCompleted",
        resumeNodeId: "new-chapter",
        resumeClock: { date: "2027-02-08", minuteOfDay: 7 * 60 + 10 },
        resumeLocation: "school",
        resetFlags: ["oldCompleted", "oldPath"],
        noticeFlag: "contentUpdated"
      }
    };

    const migrated = migrateGameState(oldState, upgradedSetup);
    expect(migrated.currentNodeId).toBe("new-chapter");
    expect(migrated.clock).toEqual({ date: "2027-02-08", minuteOfDay: 7 * 60 + 10 });
    expect(migrated.location).toBe("school");
    expect(migrated.moneyCents).toBe(31_000);
    expect(migrated.flags.oldCompleted).toBe(false);
    expect(migrated.flags.oldPath).toBe(false);
    expect(migrated.flags.contentUpdated).toBe(true);
    expect(migrated.people["person-1"]?.trust).toBe(44);
    expect(migrated.people["person-1"]?.memories[0]?.id).toBe("kept-memory");
  });

  it("lê perfil antigo e não presume preferência romântica", () => {
    expect(readPersistedPlayerProfile({ player: { id: "x", name: "Leo", presentation: "man" } })).toEqual({
      id: "x",
      name: "Leo",
      presentation: "man",
      origin: "middle_income",
      romanticPreference: "undefined"
    });
  });
});
