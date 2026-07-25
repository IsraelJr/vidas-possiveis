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
});
