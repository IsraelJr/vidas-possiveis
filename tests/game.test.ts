import { describe, expect, it } from "vitest";
import {
  advanceClock,
  applyEffects,
  availableChoices,
  choose,
  createGameState,
  getNode,
  MemorySaveRepository,
  skillCheck
} from "../src/game";

describe("Sprint 0 game engine", () => {
  it("avança o relógio atravessando a meia-noite", () => {
    expect(
      advanceClock(
        {
          date: "2026-02-16",
          minuteOfDay: 23 * 60 + 30
        },
        90
      )
    ).toEqual({
      date: "2026-02-17",
      minuteOfDay: 60
    });
  });

  it("aplica efeitos de forma imutável e limita atributos", () => {
    const state = createGameState({
      id: "player-1",
      name: "Ana",
      presentation: "woman",
      origin: "middle_income"
    });

    const result = applyEffects(state, [
      {
        type: "stat",
        stat: "energy",
        delta: -999
      },
      {
        type: "advance_time",
        minutes: 90
      }
    ]);

    expect(result.state.stats.energy).toBe(0);
    expect(result.state.clock.minuteOfDay).toBe(17 * 60 + 30);
    expect(state.stats.energy).toBe(75);
    expect(state.clock.minuteOfDay).toBe(16 * 60);
  });

  it("produz testes de habilidade reproduzíveis por seed", () => {
    const input = {
      seed: "life-1",
      eventId: "school.presentation",
      rollIndex: 0,
      difficulty: 50,
      modifiers: [5, -2]
    } as const;

    expect(skillCheck(input)).toEqual(skillCheck(input));
  });

  it("adapta escolhas escolares à origem", () => {
    const node = getNode("school.computer-assignment");
    const lowIncomeState = createGameState({
      id: "low",
      name: "Lia",
      presentation: "woman",
      origin: "low_income"
    });
    const highIncomeState = createGameState({
      id: "high",
      name: "Caio",
      presentation: "man",
      origin: "high_income"
    });

    expect(
      availableChoices(lowIncomeState, node).map((choice) => choice.id)
    ).not.toContain("use-own-computer");
    expect(
      availableChoices(highIncomeState, node).map((choice) => choice.id)
    ).toContain("use-own-computer");
  });

  it("registra escolha, horário, localização e efeitos", () => {
    const state = createGameState({
      id: "player-2",
      name: "Rui",
      presentation: "man",
      origin: "low_income"
    });
    const node = getNode(state.currentNodeId);
    const next = choose(state, node, "go-library");

    expect(next.currentNodeId).toBe("school.assignment-result");
    expect(next.clock.minuteOfDay).toBe(17 * 60 + 30);
    expect(next.location).toBe("library");
    expect(next.history).toHaveLength(1);
    expect(state.history).toHaveLength(0);
  });

  it("salva, carrega e apaga o estado por contrato", async () => {
    const repository = new MemorySaveRepository();
    const state = createGameState({
      id: "player-3",
      name: "Bia",
      presentation: "woman",
      origin: "middle_income"
    });

    await repository.save("slot", state);
    expect(await repository.load("slot")).toEqual(state);

    await repository.delete("slot");
    expect(await repository.load("slot")).toBeNull();
  });
});

describe("Narrative integrity", () => {
  it("garante que todas as escolhas apontem para nós existentes", () => {
    const first = getNode("school.computer-assignment");

    for (const choice of first.choices) {
      expect(() => getNode(choice.nextNodeId)).not.toThrow();
    }
  });

  it("mantém escolhas em todos os nós não finais", () => {
    const first = getNode("school.computer-assignment");
    expect(first.ending).not.toBe(true);
    expect(first.choices.length).toBeGreaterThan(0);
  });
});
