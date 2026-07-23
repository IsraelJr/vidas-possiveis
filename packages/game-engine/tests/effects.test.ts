import { describe, expect, it } from "vitest";
import { applyEffects, createGameState } from "../src";

const state = createGameState({ id: "player-1", name: "Ana", presentation: "woman", origin: "middle_income" });

describe("effects", () => {
  it("aplica efeitos sem alterar o estado original", () => {
    const result = applyEffects(state, [
      { type: "stat", stat: "energy", delta: -20 },
      { type: "advance_time", minutes: 90 },
      { type: "flag", flag: "studied", value: true }
    ]);

    expect(result.state.stats.energy).toBe(55);
    expect(result.state.clock.minuteOfDay).toBe(17 * 60 + 30);
    expect(result.state.flags.studied).toBe(true);
    expect(state.stats.energy).toBe(75);
  });

  it("limita atributos entre zero e cem", () => {
    const result = applyEffects(state, [{ type: "stat", stat: "energy", delta: -999 }]);
    expect(result.state.stats.energy).toBe(0);
  });

  it("altera relações sem modificar o estado anterior", () => {
    const result = applyEffects(state, [
      { type: "relationship", relationshipId: "bia", dimension: "trust", delta: 12 }
    ]);

    expect(result.state.relationships.bia?.trust).toBe(62);
    expect(state.relationships.bia?.trust).toBe(50);
  });

  it("permite saltar para uma data futura de forma explícita", () => {
    const result = applyEffects(state, [
      { type: "set_clock", clock: { date: "2026-12-18", minuteOfDay: 14 * 60 } }
    ]);

    expect(result.state.clock).toEqual({ date: "2026-12-18", minuteOfDay: 14 * 60 });
  });
});
