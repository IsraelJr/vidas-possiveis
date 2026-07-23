import { describe, expect, it } from "vitest";
import { advanceClock, formatTime, minutesBetweenClocks } from "../src";

describe("clock", () => {
  it("avança para o dia seguinte", () => {
    expect(advanceClock({ date: "2026-02-16", minuteOfDay: 23 * 60 + 30 }, 90)).toEqual({
      date: "2026-02-17",
      minuteOfDay: 60
    });
  });

  it("calcula o tempo restante entre dias diferentes", () => {
    expect(minutesBetweenClocks(
      { date: "2026-02-16", minuteOfDay: 16 * 60 },
      { date: "2026-02-17", minuteOfDay: 8 * 60 }
    )).toBe(16 * 60);
  });

  it("retorna intervalo negativo quando o compromisso já passou", () => {
    expect(minutesBetweenClocks(
      { date: "2026-02-17", minuteOfDay: 9 * 60 },
      { date: "2026-02-17", minuteOfDay: 8 * 60 }
    )).toBe(-60);
  });

  it("formata horário com zero à esquerda", () => {
    expect(formatTime(7 * 60 + 5)).toBe("07:05");
  });
});
