import { describe, expect, it } from "vitest";
import type { NarrativePack } from "../src";
import { validateNarrativePack } from "../src";

const tinyProfessionPack: NarrativePack = {
  id: "profession-football",
  version: "1.0",
  entryNodeId: "football.training",
  modules: [{
    id: "football.training-module",
    nodes: [{
      id: "football.training",
      moduleId: "football.training-module",
      title: "Primeiro treino",
      text: "Você chega ao clube.",
      activity: "Treinar",
      choices: [{
        id: "train",
        label: "Participar do treino",
        conditions: [],
        effects: [{ type: "condition", condition: "energy", delta: -10 }],
        nextNodeId: "football.end"
      }]
    }, {
      id: "football.end",
      moduleId: "football.training-module",
      title: "Fim do recorte",
      text: "O treino terminou.",
      activity: "Descansar",
      ending: true,
      choices: []
    }]
  }],
  nodes: new Map(),
  createSetup() {
    throw new Error("Fixture não cria estado.");
  },
  getNode() {
    throw new Error("Fixture não executa nós.");
  },
  renderNode(_state, node) {
    return node;
  }
};

const moduleNodes = tinyProfessionPack.modules[0]!.nodes;
(tinyProfessionPack as { nodes: ReadonlyMap<string, typeof moduleNodes[number]> }).nodes = new Map(
  moduleNodes.map((node) => [node.id, node])
);

describe("narrative modularity", () => {
  it("valida um pacote profissional sem depender do prólogo escolar", () => {
    expect(validateNarrativePack(tinyProfessionPack)).toEqual([]);
  });

  it("detecta destino ausente em qualquer pacote", () => {
    const broken = {
      ...tinyProfessionPack,
      nodes: new Map([
        ["football.training", {
          ...moduleNodes[0]!,
          choices: [{ ...moduleNodes[0]!.choices[0]!, nextNodeId: "missing" }]
        }],
        ["football.end", moduleNodes[1]!]
      ])
    };
    expect(validateNarrativePack(broken).some((issue) => issue.code === "missing-destination")).toBe(true);
  });
});
