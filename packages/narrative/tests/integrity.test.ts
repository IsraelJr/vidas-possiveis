import { describe, expect, it } from "vitest";
import { chooseStoryOption, createGameState, getAvailableChoices, PROLOGUE_NAMES } from "@vidas-possiveis/game-engine";
import { getStoryNode, rawNodes, schoolProloguePackage, storyNodes } from "../src";

const forbiddenPlayerTerms = ["schema", "engine", "persistência", "vertical slice", "rolagem", "modificador"];

describe("canonical prologue integrity", () => {
  it("possui IDs únicos, módulos e pacote explícito", () => {
    expect(storyNodes.size).toBe(rawNodes.length);
    expect(rawNodes.length).toBeGreaterThanOrEqual(20);
    expect(schoolProloguePackage.moduleIds.length).toBeGreaterThanOrEqual(7);
    expect(schoolProloguePackage.startNodeId).toBe("prologue.morning");
  });

  it("todas as escolhas e resultados apontam para nós existentes", () => {
    for (const node of storyNodes.values()) {
      for (const choice of node.choices) {
        expect(storyNodes.has(choice.nextNodeId), `${node.id} -> ${choice.nextNodeId}`).toBe(true);
        if (choice.skillCheck) for (const outcome of Object.values(choice.skillCheck.outcomes)) expect(storyNodes.has(outcome.nextNodeId)).toBe(true);
      }
    }
  });

  it("simula cem vidas sem beco sem saída nem regressão do relógio", () => {
    const names = new Set<string>();
    const genders = new Set<string>();
    for (let index = 0; index < 100; index += 1) {
      let state = createGameState({ id: `life-${index}`, name: `Jogador ${index}`, presentation: index % 2 ? "woman" : "man", origin: "middle_income" });
      const person = state.relationships["school.groupMate"]!;
      names.add(person.name);
      genders.add(person.gender);
      let steps = 0;
      while (!getStoryNode(state.currentNodeId, state).ending && steps < 40) {
        const node = getStoryNode(state.currentNodeId, state);
        const choice = getAvailableChoices(state, node)[0];
        expect(choice, `Sem escolha em ${node.id}`).toBeDefined();
        const before = state.clock;
        state = chooseStoryOption(state, node, choice!.id);
        const beforeTotal = new Date(`${before.date}T00:00:00Z`).getTime() / 60000 + before.minuteOfDay;
        const afterTotal = new Date(`${state.clock.date}T00:00:00Z`).getTime() / 60000 + state.clock.minuteOfDay;
        expect(afterTotal).toBeGreaterThanOrEqual(beforeTotal);
        steps += 1;
      }
      expect(getStoryNode(state.currentNodeId, state).ending).toBe(true);
      expect(steps).toBeLessThan(40);
    }
    expect(genders).toEqual(new Set(["woman", "man"]));
    for (const name of names) expect([...PROLOGUE_NAMES.woman, ...PROLOGUE_NAMES.man]).toContain(name);
  });

  it("não apresenta atividade de apresentação antes das oito", () => {
    for (const node of rawNodes) {
      if (node.activity === "Apresentar o trabalho") expect(node.id).toBe("prologue.presentation");
    }
    expect(getStoryNode("prologue.wait-presentation").activity).toBe("Revisar e aguardar a apresentação");
  });

  it("mantém termos técnicos fora do texto do jogador", () => {
    const text = rawNodes.flatMap((node) => [node.title, node.text, node.activity, ...node.choices.map((choice) => choice.label)]).join(" ").toLowerCase();
    for (const term of forbiddenPlayerTerms) expect(text).not.toContain(term);
  });
});
