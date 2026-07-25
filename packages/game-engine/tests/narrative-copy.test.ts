import { describe, expect, it } from "vitest";
import {
  chooseStoryOption,
  createGameState,
  type GameScenarioSetup,
  type PlayerProfile,
  type StoryNode
} from "../src";

const player: PlayerProfile = {
  id: "copy-test",
  name: "Rui",
  presentation: "man",
  origin: "middle_income",
  romanticPreference: "undefined"
};

const setup: GameScenarioSetup = {
  id: "copy-test-life",
  contentVersion: "copy-1",
  entryNodeId: "start",
  clock: { date: "2026-01-01", minuteOfDay: 8 * 60 },
  location: "home",
  moneyCents: 0,
  flags: {},
  people: {},
  usedNames: {},
  variables: {}
};

const node: StoryNode = {
  id: "start",
  title: "Uma escolha",
  text: "O que fazer?",
  activity: "Decidir",
  choices: [{
    id: "act",
    label: "Guardar o caderno",
    conditions: [],
    effects: [],
    nextNodeId: "after"
  }]
};

describe("narrative fallback copy", () => {
  it("não expõe explicações metanarrativas quando um pacote omite a ponte", () => {
    const pending = chooseStoryOption(createGameState(player, setup), node, "act");
    const text = pending.pendingOutcome?.text ?? "";

    expect(text).toBe("Você decide guardar o caderno.");
    expect(text).not.toContain("próximo momento da história");
    expect(text).not.toContain("produz seus efeitos");
    expect(pending.pendingOutcome?.activity).toBe("Seguir com a decisão");
  });
});
