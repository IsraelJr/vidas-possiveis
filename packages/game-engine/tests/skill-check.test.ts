import { describe, expect, it } from "vitest";
import { runSkillCheck } from "../src";

describe("skill check", () => {
  it("é reproduzível com a mesma seed", () => {
    const input = {
      seed: "life-1",
      eventId: "school.presentation",
      rollIndex: 0,
      difficulty: 50,
      modifiers: [{ label: "Preparação", value: 8 }]
    } as const;

    expect(runSkillCheck(input)).toEqual(runSkillCheck(input));
  });

  it("aplica modificadores e limites", () => {
    const result = runSkillCheck({
      seed: "life-2",
      eventId: "school.presentation",
      rollIndex: 1,
      difficulty: 20,
      modifiers: [{ label: "Preparação", value: 40 }]
    });

    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.modifierTotal).toBe(40);
  });
});
