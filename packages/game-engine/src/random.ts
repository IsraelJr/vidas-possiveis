export function hashString(input: string): number {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

export function deterministicUnit(seed: string, key: string): number {
  let value = hashString(`${seed}:${key}`) + 0x6d2b79f5;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
}

export function deterministicIndex(seed: string, key: string, length: number): number {
  if (!Number.isInteger(length) || length <= 0) throw new Error("A coleção precisa ter ao menos um item.");
  return Math.floor(deterministicUnit(seed, key) * length);
}

export function deterministicPick<T>(seed: string, key: string, values: readonly T[]): T {
  return values[deterministicIndex(seed, key, values.length)] as T;
}
