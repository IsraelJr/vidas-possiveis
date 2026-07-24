import { describe, expect, it } from "vitest";
import { applyEffects, createGameState } from "../src";

const state = createGameState({ id: "player-1", name: "Ana", presentation: "woman", origin: "middle_income" });
const personId = "school.groupMate";

describe("effects", () => {
  it("aplica efeitos sem alterar o estado original", () => {
    const result = applyEffects(state, [{ type: "stat", stat: "energy", delta: -20 }, { type: "advance_time", minutes: 90 }, { type: "flag", flag: "studied", value: true }]);
    expect(result.state.stats.energy).toBe(55);
    expect(result.state.clock.minuteOfDay).toBe(7 * 60 + 40);
    expect(result.state.flags.studied).toBe(true);
    expect(state.stats.energy).toBe(75);
  });

  it("limita atributos entre zero e cem", () => {
    expect(applyEffects(state, [{ type: "stat", stat: "energy", delta: -999 }]).state.stats.energy).toBe(0);
  });

  it("altera relações e promove uma pessoa sem modificar o estado anterior", () => {
    const initialTrust = state.relationships[personId]!.trust;
    const result = applyEffects(state, [
      { type: "relationship", relationshipId: personId, dimension: "trust", delta: 12 },
      { type: "promote_person", relationshipId: personId, category: "important" }
    ]);
    expect(result.state.relationships[personId]?.trust).toBe(initialTrust + 12);
    expect(result.state.relationships[personId]?.category).toBe("important");
    expect(state.relationships[personId]?.category).toBe("known");
  });

  it("permite saltar para uma data futura de forma explícita", () => {
    expect(applyEffects(state, [{ type: "set_clock", clock: { date: "2026-12-18", minuteOfDay: 14 * 60 } }]).state.clock).toEqual({ date: "2026-12-18", minuteOfDay: 14 * 60 });
  });
});
