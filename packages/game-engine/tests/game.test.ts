import { describe, expect, it } from "vitest";
import { chooseStoryOption, createGameState, getAvailableChoices, migrateGameState, PROLOGUE_NAMES, type GameState, type StoryNode } from "../src";

const node: StoryNode = {
  id: "prologue.morning", moduleId: "test", title: "Manhã", text: "Teste", activity: "Sair",
  choices: [{ id: "go", label: "Ir", conditions: [], effects: [{ type: "advance_time", minutes: 60 }], nextNodeId: "after" }]
};

describe("game", () => {
  it("gera e reserva uma pessoa persistente do prólogo", () => {
    const state = createGameState({ id: "life-1", name: "Rui", presentation: "man", origin: "middle_income" });
    const person = state.relationships["school.groupMate"]!;
    expect([...PROLOGUE_NAMES.woman, ...PROLOGUE_NAMES.man]).toContain(person.name);
    expect(person.category).toBe("known");
    expect(state.identityRegistry[person.name.toLocaleLowerCase("pt-BR")]?.personId).toBe(person.id);
  });

  it("é determinístico para a mesma vida", () => {
    const player = { id: "same-life", name: "Rui", presentation: "man", origin: "middle_income" } as const;
    expect(createGameState(player).relationships).toEqual(createGameState(player).relationships);
  });

  it("registra escolha e avança o relógio", () => {
    const state = createGameState({ id: "p", name: "Rui", presentation: "man", origin: "middle_income" });
    const next = chooseStoryOption(state, node, getAvailableChoices(state, node)[0]!.id);
    expect(next.clock.minuteOfDay).toBe(state.clock.minuteOfDay + 60);
    expect(next.currentNodeId).toBe("after");
  });

  it("migra saves antigos sem apagar a identidade anterior", () => {
    const current = createGameState({ id: "p", name: "Rui", presentation: "man", origin: "middle_income" });
    const legacy = { ...current, schemaVersion: 2, narrativePackageId: undefined, identityRegistry: undefined } as unknown as GameState;
    const migrated = migrateGameState(legacy);
    expect(migrated.schemaVersion).toBe(3);
    expect(migrated.narrativePackageId).toBe("school-prologue-br-v1");
    expect(migrated.relationships["school.groupMate"]).toBeDefined();
  });
});
