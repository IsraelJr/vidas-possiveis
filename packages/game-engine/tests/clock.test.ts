import { describe, expect, it } from "vitest";
import { advanceClock, formatTime } from "../src";

describe("clock", () => {
  it("avança para o dia seguinte", () => {
    expect(advanceClock({ date: "2026-02-16", minuteOfDay: 23 * 60 + 30 }, 90)).toEqual({
      date: "2026-02-17",
      minuteOfDay: 60
    });
  });

  it("formata horário com zero à esquerda", () => {
    expect(formatTime(7 * 60 + 5)).toBe("07:05");
  });
});
