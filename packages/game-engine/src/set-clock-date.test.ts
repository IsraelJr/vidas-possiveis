import { describe, expect, it } from "vitest";
import { applyEffects } from "./effects";
import { createGameState } from "./game";
import type { GameScenarioSetup, PlayerProfile } from "./types";

const player: PlayerProfile = {
  id: "clock-date-test",
  name: "Alex",
  presentation: "man",
  origin: "middle_income",
  romanticPreference: "undefined"
};

const setup: GameScenarioSetup = {
  id: "clock-date-test",
  contentVersion: "1",
  entryNodeId: "start",
  clock: { date: "2026-02-18", minuteOfDay: 8 * 60 },
  location: "home",
  moneyCents: 0,
  flags: {},
  people: {},
  usedNames: {},
  variables: {}
};

describe("set_clock", () => {
  it("não pode substituir uma transição temporal", () => {
    const state = createGameState(player, setup);

    expect(() =>
      applyEffects(state, [
        { type: "set_clock", clock: { date: "2026-02-19", minuteOfDay: 8 * 60 } }
      ])
    ).toThrow("Mudar de dia exige uma transição temporal explícita");
  });
});