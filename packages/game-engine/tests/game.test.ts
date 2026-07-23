import { describe, expect, it } from "vitest";
import {
  chooseStoryOption,
  createGameState,
  getAvailableChoices,
  getChoiceAvailability,
  type StoryNode
} from "../src";

const node: StoryNode = {
  id: "school.computer-assignment",
  title: "Trabalho escolar",
  text: "A turma precisa de um computador.",
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

describe("game", () => {
  it("filtra escolhas pelo estado", () => {
    const state = createGameState({ id: "p", name: "Rui", presentation: "man", origin: "low_income" });
    expect(getAvailableChoices(state, node).map((choice) => choice.id)).toEqual(["go-library"]);
  });

  it("informa por que uma escolha está bloqueada", () => {
    const state = createGameState({ id: "p", name: "Rui", presentation: "man", origin: "low_income" });
    const availability = getChoiceAvailability(state, node);
    const blocked = availability.find((item) => item.choice.id === "use-own-computer");

    expect(blocked).toEqual({
      choice: node.choices[0],
      available: false,
      failedConditions: [{ type: "flag", flag: "hasComputer", value: true }]
    });
  });

  it("libera a mesma escolha quando a condição é atendida", () => {
    const state = createGameState({ id: "p", name: "Rui", presentation: "man", origin: "middle_income" });
    const availability = getChoiceAvailability(state, node);
    const ownComputer = availability.find((item) => item.choice.id === "use-own-computer");

    expect(ownComputer?.available).toBe(true);
    expect(ownComputer?.failedConditions).toEqual([]);
  });

  it("registra a escolha e avança o nó", () => {
    const state = createGameState({ id: "p", name: "Rui", presentation: "man", origin: "low_income" });
    const next = chooseStoryOption(state, node, "go-library");
    expect(next.currentNodeId).toBe("school.result");
    expect(next.location).toBe("library");
    expect(next.history).toHaveLength(1);
  });
});
