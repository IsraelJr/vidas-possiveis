import { describe, expect, it } from "vitest";
import { rawNodes, storyNodes } from "../src";

const forbiddenMetaPhrases = [
  "a ação se completa",
  "produz seus efeitos",
  "próximo momento da história",
  "a ação acontece antes que",
  "viver a consequência da escolha"
];

describe("cinematic scene continuity", () => {
  it("remove textos metanarrativos de todas as respostas do prólogo", () => {
    for (const node of rawNodes) {
      for (const choice of node.choices) {
        const outcomeText = [
          choice.outcome?.title ?? "",
          choice.outcome?.text ?? "",
          choice.outcome?.continueLabel ?? "",
          choice.outcome?.activity ?? ""
        ].join(" ").toLocaleLowerCase("pt-BR");

        expect(choice.outcome, `${node.id}/${choice.id} sem ponte narrativa`).toBeDefined();
        for (const phrase of forbiddenMetaPhrases) {
          expect(outcomeText, `${node.id}/${choice.id} contém '${phrase}'`).not.toContain(phrase);
        }
      }
    }
  });

  it("transforma a pergunta sobre o atraso em conversa que leva à explicação", () => {
    const choice = storyNodes
      .get("prologue.group-message")
      ?.choices.find((candidate) => candidate.id === "ask-what-happened");

    expect(choice?.outcome?.text).toContain("A cobrança no grupo desacelera");
    expect(choice?.outcome?.text).toContain("As mensagens chegam em partes");
    expect(choice?.outcome?.continueLabel).toBe("Ler a explicação");
  });

  it("leva cada resposta da Educação Física até a sala por um caminho próprio", () => {
    const choices = storyNodes.get("prologue.physical-education")?.choices ?? [];
    const outcomes = new Map(choices.map((choice) => [choice.id, choice.outcome?.text ?? ""]));

    expect(outcomes.get("participate-seriously")).toContain("vai direto para a sala");
    expect(outcomes.get("participate-lightly")).toContain("volta para a sala com calma");
    expect(outcomes.get("help-classmate")).toContain("passa rapidamente no banheiro");
    expect(outcomes.get("sit-out")).toContain("chega primeiro à sala");
    expect(new Set(outcomes.values()).size).toBe(4);
  });

  it("garante que pontes automáticas conheçam a cena de destino", () => {
    const source = storyNodes.get("prologue.group-explanation");
    const choice = source?.choices.find((candidate) => candidate.id === "make-clear-plan");

    expect(choice?.outcome?.text).toContain("ainda falta escolher onde");
    expect(choice?.outcome?.continueLabel).toContain("Onde terminar o trabalho");
  });

  it("não pula da agressão diretamente para a semana seguinte", () => {
    const fightChoice = storyNodes
      .get("prologue.conflict")
      ?.choices.find((candidate) => candidate.id === "physical-fight");

    expect(fightChoice?.nextNodeId).toBe("prologue.fight-intervention");
    expect(fightChoice?.outcome?.text).toContain("O primeiro golpe");
    expect(fightChoice?.outcome?.text).toContain("tentam separar a briga");
    expect(fightChoice?.nextNodeId).not.toBe("prologue.friday-transition");
  });

  it("conclui o pequeno arco da briga antes de permitir o salto temporal", () => {
    const intervention = storyNodes.get("prologue.fight-intervention");
    const coordination = storyNodes.get("prologue.fight-coordination");
    const consequence = storyNodes.get("prologue.fight-consequence");
    const closure = storyNodes.get("prologue.fight-closure");

    expect(intervention?.text).toContain("A coordenação já foi chamada");
    expect(intervention?.choices.every((choice) => choice.nextNodeId === "prologue.fight-coordination")).toBe(true);

    expect(coordination?.text).toContain("os responsáveis serão avisados");
    expect(coordination?.choices.every((choice) => choice.nextNodeId === "prologue.fight-consequence")).toBe(true);

    expect(consequence?.text).toContain("registra a ocorrência");
    expect(consequence?.choices.every((choice) => choice.nextNodeId === "prologue.fight-closure")).toBe(true);

    expect(closure?.text).toContain("O confronto físico acabou");
    expect(closure?.choices.every((choice) => choice.nextNodeId === "prologue.friday-transition")).toBe(true);
  });

  it("proíbe consequências graves e ainda abertas de desembocarem direto em transições", () => {
    for (const node of rawNodes) {
      for (const choice of node.choices) {
        const leavesCriticalUnresolvedMemory = choice.effects.some(
          (effect) =>
            effect.type === "add_memory" &&
            effect.memory.resolved === false &&
            effect.memory.intensity >= 8
        );
        const causesSeriousImmediateHarm = choice.effects.some(
          (effect) =>
            effect.type === "condition" &&
            effect.condition === "health" &&
            effect.delta <= -5
        );

        if (!leavesCriticalUnresolvedMemory && !causesSeriousImmediateHarm) continue;

        expect(
          choice.nextNodeId,
          `${node.id}/${choice.id} tenta saltar de um acontecimento grave sem fechar o arco local`
        ).not.toMatch(/transition$/);
      }
    }
  });
});