import { describe, expect, it } from "vitest";
import { applyEffects } from "./effects";
import { chooseStoryOption, createGameState } from "./game";
import type {
  GameScenarioSetup,
  GameState,
  PlayerProfile,
  StoryNode
} from "./types";

const player: PlayerProfile = {
  id: "player-time-test",
  name: "Alex",
  presentation: "man",
  origin: "middle_income",
  romanticPreference: "undefined"
};

const setup: GameScenarioSetup = {
  id: "time-test",
  contentVersion: "time-test-1",
  entryNodeId: "bedtime",
  clock: { date: "2026-02-18", minuteOfDay: 22 * 60 },
  location: "home",
  moneyCents: 10_000,
  flags: {},
  people: {},
  usedNames: {},
  variables: {}
};

function stateAt(overrides: Partial<GameState> = {}): GameState {
  return { ...createGameState(player, setup), ...overrides };
}

function bedtimeNode(overrides: Partial<StoryNode> = {}): StoryNode {
  return {
    id: "bedtime",
    title: "Fim do dia",
    text: "O dia terminou.",
    activity: "Dormir",
    timeBoundary: "day-end",
    nextCommitment: {
      label: "Compromisso",
      clock: { date: "2026-02-20", minuteOfDay: 8 * 60 }
    },
    choices: [
      {
        id: "sleep",
        label: "Dormir",
        conditions: [{ type: "location", value: "home" }],
        effects: [
          {
            type: "time_transition",
            kind: "sleep",
            requiredLocation: "home",
            clock: { date: "2026-02-19", minuteOfDay: 6 * 60 + 30 }
          }
        ],
        nextNodeId: "morning"
      }
    ],
    ...overrides
  };
}

describe("guarded temporal transitions", () => {
  it("permite dormir depois que o dia terminou e o personagem está em casa", () => {
    const result = chooseStoryOption(stateAt(), bedtimeNode(), "sleep");

    expect(result.clock).toEqual({ date: "2026-02-19", minuteOfDay: 6 * 60 + 30 });
    expect(result.pendingOutcome?.nextNodeId).toBe("morning");
  });

  it("impede usar o sono como salto fora de uma cena de fim de dia", () => {
    expect(() =>
      chooseStoryOption(stateAt(), bedtimeNode({ timeBoundary: undefined }), "sleep")
    ).toThrow("só pode avançar pelo sono depois que o dia estiver encerrado");
  });

  it("impede dormir em casa quando o personagem ainda está na escola", () => {
    expect(() =>
      applyEffects(stateAt({ location: "school" }), [
        {
          type: "time_transition",
          kind: "sleep",
          requiredLocation: "home",
          clock: { date: "2026-02-19", minuteOfDay: 6 * 60 + 30 }
        }
      ])
    ).toThrow("precisa estar em home");
  });

  it("impede chegar em casa e saltar no tempo na mesma escolha", () => {
    expect(() =>
      applyEffects(stateAt({ location: "school" }), [
        { type: "set_location", location: "home" },
        {
          type: "time_transition",
          kind: "sleep",
          requiredLocation: "home",
          clock: { date: "2026-02-19", minuteOfDay: 6 * 60 + 30 }
        }
      ])
    ).toThrow("Conclua o deslocamento antes");
  });

  it("impede saltar uma consequência programada antes do horário de destino", () => {
    const state = stateAt({
      scheduledConsequences: [
        {
          id: "family-call",
          sourceChoiceId: "earlier-choice",
          title: "Ligação da família",
          text: "A família telefona.",
          triggerAt: { date: "2026-02-19", minuteOfDay: 6 * 60 },
          effects: []
        }
      ]
    });

    expect(() =>
      applyEffects(state, [
        {
          type: "time_transition",
          kind: "sleep",
          requiredLocation: "home",
          clock: { date: "2026-02-19", minuteOfDay: 6 * 60 + 30 }
        }
      ])
    ).toThrow("não pode pular 'Ligação da família'");
  });

  it("impede ultrapassar o próximo compromisso conhecido", () => {
    const node = bedtimeNode({
      nextCommitment: {
        label: "Apresentação",
        clock: { date: "2026-02-19", minuteOfDay: 6 * 60 }
      }
    });

    expect(() => chooseStoryOption(stateAt(), node, "sleep")).toThrow(
      "tentaria pular o compromisso 'Apresentação'"
    );
  });

  it("impede um salto por sono que não chegue ao dia seguinte", () => {
    expect(() =>
      applyEffects(stateAt(), [
        {
          type: "time_transition",
          kind: "sleep",
          requiredLocation: "home",
          clock: { date: "2026-02-18", minuteOfDay: 23 * 60 }
        }
      ])
    ).toThrow("precisa levar ao menos ao dia seguinte");
  });
});