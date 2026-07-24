import {
  createGameState,
  type GameScenarioSetup,
  type PlayerProfile
} from "@vidas-possiveis/game-engine";
import { describe, expect, it } from "vitest";
import { MemorySaveRepository } from "../src";

const setup: GameScenarioSetup = {
  id: "persistence-test",
  contentVersion: "test-1",
  entryNodeId: "start",
  clock: { date: "2026-02-16", minuteOfDay: 6 * 60 },
  location: "home",
  moneyCents: 10_000,
  flags: {},
  people: {},
  usedNames: { lia: "player" },
  variables: {}
};

describe("MemorySaveRepository", () => {
  it("salva, carrega e remove uma partida", async () => {
    const repository = new MemorySaveRepository();
    const player: PlayerProfile = {
      id: "p",
      name: "Lia",
      presentation: "woman",
      origin: "middle_income",
      romanticPreference: "undefined"
    };
    const state = createGameState(player, setup);

    await repository.save("slot-1", state);
    expect(await repository.load("slot-1")).toEqual(state);

    await repository.delete("slot-1");
    expect(await repository.load("slot-1")).toBeNull();
  });
});
