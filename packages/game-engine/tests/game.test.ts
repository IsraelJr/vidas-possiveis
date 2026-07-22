import { describe, expect, it } from "vitest";
import { chooseStoryOption, createGameState, getAvailableChoices, type StoryNode } from "../src";

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

  it("registra a escolha e avança o nó", () => {
    const state = createGameState({ id: "p", name: "Rui", presentation: "man", origin: "low_income" });
    const next = chooseStoryOption(state, node, "go-library");
    expect(next.currentNodeId).toBe("school.result");
    expect(next.location).toBe("library");
    expect(next.history).toHaveLength(1);
  });
});
