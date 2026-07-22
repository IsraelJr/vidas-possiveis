import type { GameClock } from "./types";

const MINUTES_PER_DAY = 24 * 60;

function parseDate(date: string): Date {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) throw new Error(`Data inválida: ${date}`);
  return parsed;
}

function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function assertValidClock(clock: GameClock): void {
  parseDate(clock.date);
  if (!Number.isInteger(clock.minuteOfDay) || clock.minuteOfDay < 0 || clock.minuteOfDay >= MINUTES_PER_DAY) {
    throw new Error(`Minuto do dia inválido: ${clock.minuteOfDay}`);
  }
}

export function advanceClock(clock: GameClock, minutes: number): GameClock {
  assertValidClock(clock);
  if (!Number.isInteger(minutes) || minutes < 0) throw new Error("O avanço deve ser um inteiro não negativo.");

  const total = clock.minuteOfDay + minutes;
  const days = Math.floor(total / MINUTES_PER_DAY);
  const nextDate = parseDate(clock.date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);

  return {
    date: formatIsoDate(nextDate),
    minuteOfDay: total % MINUTES_PER_DAY
  };
}

export function compareClocks(left: GameClock, right: GameClock): number {
  assertValidClock(left);
  assertValidClock(right);
  const leftMs = parseDate(left.date).getTime() + left.minuteOfDay * 60_000;
  const rightMs = parseDate(right.date).getTime() + right.minuteOfDay * 60_000;
  return Math.sign(leftMs - rightMs);
}

export function formatTime(minuteOfDay: number): string {
  if (!Number.isInteger(minuteOfDay) || minuteOfDay < 0 || minuteOfDay >= MINUTES_PER_DAY) {
    throw new Error(`Minuto do dia inválido: ${minuteOfDay}`);
  }
  const hours = Math.floor(minuteOfDay / 60).toString().padStart(2, "0");
  const minutes = (minuteOfDay % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatDatePtBr(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    timeZone: "UTC"
  }).format(parseDate(date));
}
