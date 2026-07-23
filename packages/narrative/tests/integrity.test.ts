import { describe, expect, it } from "vitest";
import { chooseStoryOption, createGameState, getAvailableChoices } from "@vidas-possiveis/game-engine";
import { getStoryNode, rawNodes, storyNodes } from "../src";

const forbiddenPlayerTerms = [
  "o save foi registrado",
  "schema",
  "engine",
  "persistência",
  "vertical slice"
];

describe("narrative integrity", () => {
  it("possui IDs únicos", () => {
    expect(storyNodes.size).toBe(rawNodes.length);
    expect(storyNodes.size).toBeGreaterThanOrEqual(15);
  });

  it("todas as escolhas e resultados apontam para nós existentes", () => {
    for (const node of storyNodes.values()) {
      for (const choice of node.choices) {
        expect(storyNodes.has(choice.nextNodeId), `${node.id} -> ${choice.nextNodeId}`).toBe(true);
        if (choice.skillCheck) {
          for (const outcome of Object.values(choice.skillCheck.outcomes)) {
            expect(storyNodes.has(outcome.nextNodeId), `${node.id} -> ${outcome.nextNodeId}`).toBe(true);
          }
        }
      }
    }
  });

  it("nós não finais possuem escolhas", () => {
    for (const node of storyNodes.values()) {
      if (!node.ending) expect(node.choices.length).toBeGreaterThan(0);
    }
  });

  it("inclui teste de habilidade, relação, consequência futura e quatro caminhos de formação", () => {
    const allChoices = rawNodes.flatMap((node) => node.choices);
    expect(allChoices.some((choice) => "skillCheck" in choice)).toBe(true);
    expect(allChoices.some((choice) => choice.effects.some((effect) => effect.type === "schedule_consequence"))).toBe(true);
    expect(storyNodes.get("school.presentation")?.choices.some((choice) => choice.conditions.some((condition) => condition.type === "relationship"))).toBe(true);
    expect([...storyNodes.values()].filter((node) => node.ending)).toHaveLength(4);
  });

  it("permite concluir o prólogo nas três origens sem beco sem saída", () => {
    for (const origin of ["low_income", "middle_income", "high_income"] as const) {
      let state = createGameState({ id: `player-${origin}`, name: "Teste", presentation: "woman", origin });
      let steps = 0;

      while (!getStoryNode(state.currentNodeId).ending && steps < 30) {
        const node = getStoryNode(state.currentNodeId);
        const choice = getAvailableChoices(state, node)[0];
        expect(choice, `Sem escolha em ${node.id}`).toBeDefined();
        state = chooseStoryOption(state, node, choice!.id);
        steps += 1;
      }

      expect(getStoryNode(state.currentNodeId).ending).toBe(true);
      expect(steps).toBeLessThan(30);
    }
  });

  it("mantém termos técnicos fora do texto apresentado ao jogador", () => {
    const playerText = rawNodes.flatMap((node) => [
      node.title,
      node.text,
      node.activity,
      ...node.choices.map((choice) => choice.label)
    ]).join(" ").toLowerCase();

    for (const term of forbiddenPlayerTerms) expect(playerText).not.toContain(term);
  });
});
