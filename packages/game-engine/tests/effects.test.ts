import { describe, expect, it } from "vitest";
import { applyEffects, createGameState, type GameScenarioSetup, type PlayerProfile } from "../src";

const player: PlayerProfile = {
  id: "player-1",
  name: "Ana",
  presentation: "woman",
  origin: "middle_income",
  romanticPreference: "undefined"
};

const setup: GameScenarioSetup = {
  id: "test-pack",
  contentVersion: "test-1",
  entryNodeId: "start",
  clock: { date: "2026-02-16", minuteOfDay: 6 * 60 + 10 },
  location: "home",
  moneyCents: 15_000,
  initialKnowledge: { physics: 32 },
  flags: {},
  usedNames: { ana: "player" },
  variables: {},
  people: {
    colleague: {
      id: "colleague",
      name: "Paula",
      gender: "woman",
      role: "Colega",
      category: "known",
      presence: "active",
      contextSummary: "Colega da escola.",
      trust: 30,
      closeness: 20,
      tension: 5,
      memories: []
    }
  }
};

const state = createGameState(player, setup);

describe("effects", () => {
  it("separa atributos, condições e conhecimentos sem alterar o estado original", () => {
    const result = applyEffects(state, [
      { type: "attribute", attribute: "selfControl", delta: 4 },
      { type: "condition", condition: "energy", delta: -20 },
      { type: "knowledge", knowledge: "physics", delta: 5 },
      { type: "advance_time", minutes: 90 }
    ]);

    expect(result.state.attributes.selfControl).toBe(state.attributes.selfControl + 4);
    expect(result.state.conditions.energy).toBe(55);
    expect(result.state.knowledge.physics).toBe(37);
    expect(result.state.clock).toEqual({ date: "2026-02-16", minuteOfDay: 7 * 60 + 40 });
    expect(state.conditions.energy).toBe(75);
  });

  it("cria conhecimento definido apenas pelo pacote quando necessário", () => {
    const result = applyEffects(state, [
      { type: "knowledge", knowledge: "ball_control", delta: 5 }
    ]);
    expect(result.state.knowledge.ball_control).toBe(5);
  });

  it("registra memória e muda categoria preservando a identidade", () => {
    const result = applyEffects(state, [
      {
        type: "add_memory",
        personId: "colleague",
        memory: {
          id: "helped",
          summary: "Você ajudou no trabalho.",
          kind: "help",
          intensity: 5,
          resolved: true,
          tags: ["school"]
        }
      },
      { type: "set_person_category", personId: "colleague", category: "important" }
    ]);

    expect(result.state.people.colleague?.id).toBe("colleague");
    expect(result.state.people.colleague?.category).toBe("important");
    expect(result.state.people.colleague?.memories[0]?.occurredAt).toEqual(state.clock);
  });

  it("impede o relógio de retroceder", () => {
    expect(() => applyEffects(state, [
      { type: "set_clock", clock: { date: "2026-02-15", minuteOfDay: 12 * 60 } }
    ])).toThrow(/retroceder/);
  });
});
