import { describe, expect, it } from "vitest";
import { deterministicIndex, deterministicPick, deterministicUnit } from "../src";

describe("deterministic random", () => {
  it("repete o resultado para a mesma vida e papel", () => {
    expect(deterministicUnit("life", "group-mate")).toBe(deterministicUnit("life", "group-mate"));
    expect(deterministicIndex("life", "name", 9)).toBe(deterministicIndex("life", "name", 9));
  });

  it("seleciona apenas itens existentes", () => {
    expect(["a", "b", "c"]).toContain(deterministicPick("life", "item", ["a", "b", "c"]));
  });

  it("rejeita coleções vazias", () => {
    expect(() => deterministicPick("life", "empty", [])).toThrow();
  });
});
