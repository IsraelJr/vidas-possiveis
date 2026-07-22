import { describe, expect, it } from "vitest";
import { storyNodes } from "../src";

describe("narrative integrity", () => {
  it("possui IDs únicos", () => {
    expect(storyNodes.size).toBeGreaterThan(0);
  });

  it("todas as escolhas apontam para nós existentes", () => {
    for (const node of storyNodes.values()) {
      for (const choice of node.choices) {
        expect(storyNodes.has(choice.nextNodeId), `${node.id} -> ${choice.nextNodeId}`).toBe(true);
      }
    }
  });

  it("nós não finais possuem escolhas", () => {
    for (const node of storyNodes.values()) {
      if (!node.ending) expect(node.choices.length).toBeGreaterThan(0);
    }
  });
});
