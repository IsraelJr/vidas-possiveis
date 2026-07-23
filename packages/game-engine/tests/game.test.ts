import { describe, expect, it } from "vitest";
import {
  chooseStoryOption,
  createGameState,
  getAvailableChoices,
  getChoiceAvailability,
  migrateGameState,
  type GameState,
  type StoryNode,
  type StorySkillCheck
} from "../src";

const basicNode: StoryNode = {
  id: "school.computer-assignment",
  title: "Trabalho escolar",
  text: "A turma precisa de um computador.",
  activity: "Organizar o trabalho",
  choices: [
    {
      id: "use-own-computer",
      label: "Usar computador próprio",
      conditions: [{ type: "flag", flag: "hasComputer", value: true }],
      effects: [{ type: "advance_time", minutes: 60 }],
      nextNodeId: "school.result"
    },
    {
      id: "go-library",
      label: "Ir à biblioteca",
      conditions: [],
      effects: [
        { type: "advance_time", minutes: 90 },
        { type: "set_location", location: "library" }
      ],
      nextNodeId: "school.result"
    }
  ]
};

const outcomes: StorySkillCheck["outcomes"] = {
  critical_failure: { nextNodeId: "result.critical", effects: [{ type: "stat", stat: "stress", delta: 10 }] },
  failure: { nextNodeId: "result.failure", effects: [{ type: "stat", stat: "stress", delta: 5 }] },
  partial_success: { nextNodeId: "result.partial", effects: [{ type: "stat", stat: "reputation", delta: 1 }] },
  success: { nextNodeId: "result.success", effects: [{ type: "stat", stat: "reputation", delta: 3 }] },
  exceptional_success: { nextNodeId: "result.exceptional", effects: [{ type: "stat", stat: "reputation", delta: 5 }] }
};

const skillNode: StoryNode = {
  id: "school.presentation",
  title: "Apresentação",
  text: "Chegou a hora.",
  activity: "Apresentar o trabalho",
  choices: [
    {
      id: "present",
      label: "Apresentar",
      conditions: [],
      effects: [{ type: "advance_time", minutes: 20 }],
      nextNodeId: "result.partial",
      skillCheck: {
        eventId: "presentation",
        stat: "communication",
        difficulty: 50,
        bonusFlags: [{ flag: "preparedAssignment", label: "Preparação", value: 10 }],
        outcomes
      }
    }
  ]
};

describe("game", () => {
  it("filtra escolhas pelo estado", () => {
    const state = createGameState({ id: "p", name: "Rui", presentation: "man", origin: "low_income" });
    expect(getAvailableChoices(state, basicNode).map((choice) => choice.id)).toEqual(["go-library"]);
  });

  it("informa por que uma escolha está bloqueada", () => {
    const state = createGameState({ id: "p", name: "Rui", presentation: "man", origin: "low_income" });
    const availability = getChoiceAvailability(state, basicNode);
    const blocked = availability.find((item) => item.choice.id === "use-own-computer");

    expect(blocked).toEqual({
      choice: basicNode.choices[0],
      available: false,
      failedConditions: [{ type: "flag", flag: "hasComputer", value: true }]
    });
  });

  it("libera a mesma escolha quando a condição é atendida", () => {
    const state = createGameState({ id: "p", name: "Rui", presentation: "man", origin: "middle_income" });
    const availability = getChoiceAvailability(state, basicNode);
    const ownComputer = availability.find((item) => item.choice.id === "use-own-computer");

    expect(ownComputer?.available).toBe(true);
    expect(ownComputer?.failedConditions).toEqual([]);
  });

  it("registra a escolha e avança o nó", () => {
    const state = createGameState({ id: "p", name: "Rui", presentation: "man", origin: "low_income" });
    const next = chooseStoryOption(state, basicNode, "go-library");
    expect(next.currentNodeId).toBe("school.result");
    expect(next.location).toBe("library");
    expect(next.history).toHaveLength(1);
  });

  it("usa um teste de habilidade para decidir o próximo nó", () => {
    const initial = createGameState({ id: "p", name: "Rui", presentation: "man", origin: "middle_income" });
    const state: GameState = {
      ...initial,
      currentNodeId: skillNode.id,
      flags: { ...initial.flags, preparedAssignment: true }
    };
    const next = chooseStoryOption(state, skillNode, "present");
    const result = next.history.at(-1)?.skillCheck;

    expect(result).toBeDefined();
    expect(next.currentNodeId).toBe(outcomes[result!.outcome].nextNodeId);
    expect(next.rollIndex).toBe(1);
  });

  it("dispara uma consequência quando o tempo definido chega", () => {
    const state = createGameState({ id: "p", name: "Rui", presentation: "man", origin: "middle_income" });
    const consequenceNode: StoryNode = {
      id: state.currentNodeId,
      title: "Promessa",
      text: "Uma escolha terá efeito depois.",
      activity: "Cumprir uma promessa",
      choices: [
        {
          id: "promise",
          label: "Prometer",
          conditions: [],
          effects: [
            {
              type: "schedule_consequence",
              consequenceId: "promise-return",
              delayMinutes: 30,
              title: "A promessa voltou",
              text: "Agora é preciso cumprir.",
              effects: [{ type: "stat", stat: "stress", delta: 8 }]
            },
            { type: "advance_time", minutes: 60 }
          ],
          nextNodeId: "after"
        }
      ]
    };

    const next = chooseStoryOption(state, consequenceNode, "promise");
    expect(next.scheduledConsequences).toHaveLength(0);
    expect(next.stats.stress).toBe(state.stats.stress + 8);
    expect(next.history.at(-1)?.triggeredConsequences?.[0]?.title).toBe("A promessa voltou");
  });

  it("migra o progresso criado na Sprint 0", () => {
    const current = createGameState({ id: "p", name: "Rui", presentation: "man", origin: "low_income" });
    const legacy = {
      ...current,
      schemaVersion: 1,
      contentVersion: "sprint-0.2",
      relationships: undefined,
      scheduledConsequences: undefined,
      currentNodeId: "school.assignment-result"
    } as unknown as GameState;

    const migrated = migrateGameState(legacy);
    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.contentVersion).toBe("sprint-1.0");
    expect(migrated.relationships.bia?.name).toBe("Bia");
    expect(migrated.currentNodeId).toBe("school.assignment-result");
  });
});
