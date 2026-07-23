import type { GameClock } from "./types";

const MINUTES_PER_DAY = 24 * 60;
const MILLISECONDS_PER_MINUTE = 60_000;

function parseDate(date: string): Date {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) throw new Error(`Data inválida: ${date}`);
  return parsed;
}

function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function toEpochMinutes(clock: GameClock): number {
  assertValidClock(clock);
  return Math.trunc(parseDate(clock.date).getTime() / MILLISECONDS_PER_MINUTE) + clock.minuteOfDay;
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

export function minutesBetweenClocks(from: GameClock, to: GameClock): number {
  return toEpochMinutes(to) - toEpochMinutes(from);
}

export function compareClocks(left: GameClock, right: GameClock): number {
  return Math.sign(minutesBetweenClocks(right, left));
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
