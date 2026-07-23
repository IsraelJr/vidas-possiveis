import { createGameState } from "@vidas-possiveis/game-engine";
import { describe, expect, it } from "vitest";
import { MemorySaveRepository } from "../src";

describe("MemorySaveRepository", () => {
  it("salva, carrega e remove uma partida", async () => {
    const repository = new MemorySaveRepository();
    const state = createGameState({ id: "p", name: "Lia", presentation: "woman", origin: "middle_income" });

    await repository.save("slot-1", state);
    expect(await repository.load("slot-1")).toEqual(state);

    await repository.delete("slot-1");
    expect(await repository.load("slot-1")).toBeNull();
  });
});
