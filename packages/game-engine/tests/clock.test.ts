import { describe, expect, it } from "vitest";
import { advanceClock, formatDatePtBr, formatTime, minutesBetweenClocks } from "../src";

describe("clock", () => {
  it("avança para o dia seguinte", () => {
    expect(advanceClock({ date: "2026-02-16", minuteOfDay: 23 * 60 + 30 }, 90)).toEqual({
      date: "2026-02-17",
      minuteOfDay: 60
    });
  });

  it.each([
    [{ date: "2026-02-17", minuteOfDay: 5 * 60 + 40 }, { date: "2026-02-17", minuteOfDay: 8 * 60 }, 140],
    [{ date: "2026-02-16", minuteOfDay: 18 * 60 + 10 }, { date: "2026-02-17", minuteOfDay: 5 * 60 + 40 }, 690],
    [{ date: "2026-02-17", minuteOfDay: 6 * 60 + 35 }, { date: "2026-02-17", minuteOfDay: 10 * 60 + 30 }, 235],
    [{ date: "2026-02-17", minuteOfDay: 8 * 60 + 20 }, { date: "2026-02-17", minuteOfDay: 8 * 60 }, -20]
  ])("calcula diferenças canônicas sem arredondamento", (from: { date: string; minuteOfDay: number }, to: { date: string; minuteOfDay: number }, expected: number) => {
    expect(minutesBetweenClocks(from, to)).toBe(expected);
  });

  it("atravessa mês e ano", () => {
    expect(advanceClock({ date: "2026-12-31", minuteOfDay: 23 * 60 + 50 }, 20)).toEqual({
      date: "2027-01-01",
      minuteOfDay: 10
    });
  });

  it("mantém o ano visível na data apresentada ao jogador", () => {
    expect(formatDatePtBr("2027-02-08")).toContain("2027");
  });

  it("formata horário com zero à esquerda", () => {
    expect(formatTime(7 * 60 + 5)).toBe("07:05");
  });
});
