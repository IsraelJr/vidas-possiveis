import { describe, expect, it } from "vitest";
import {
  chooseStoryOption,
  continueStoryAfterOutcome,
  createGameState,
  getAvailableChoices,
  type PlayerProfile
} from "@vidas-possiveis/game-engine";
import {
  createPrologueSetup,
  getStoryNodeForState,
  renderNodeForState
} from "../src";

function profile(id: string): PlayerProfile {
  return {
    id,
    name: "Teste temporal",
    presentation: "woman",
    origin: "middle_income",
    romanticPreference: "undefined"
  };
}

describe("temporal simulation diagnostics", () => {
  it("identifica a cena e a escolha caso um caminho tente mudar de dia incorretamente", () => {
    const player = profile("temporal-diagnostic");
    let state = createGameState(player, createPrologueSetup(player));
    let steps = 0;

    while (!getStoryNodeForState(state).ending && steps < 120) {
      const node = renderNodeForState(state);
      const choice = getAvailableChoices(state, node)[0];
      expect(choice, `Sem escolha em ${node.id}`).toBeDefined();

      try {
        const pending = chooseStoryOption(state, node, choice!.id);
        state = continueStoryAfterOutcome(pending);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(
          `${node.id}/${choice!.id} em ${state.clock.date} ${state.clock.minuteOfDay}: ${message}`
        );
      }

      steps += 1;
    }

    expect(getStoryNodeForState(state).ending).toBe(true);
  });
});