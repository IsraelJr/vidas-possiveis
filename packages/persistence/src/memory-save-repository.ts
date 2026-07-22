import type { GameState } from "@vidas-possiveis/game-engine";
import type { SaveRepository } from "./save-repository";

export class MemorySaveRepository implements SaveRepository {
  readonly #saves = new Map<string, GameState>();

  async load(slotId: string): Promise<GameState | null> {
    return this.#saves.get(slotId) ?? null;
  }

  async save(slotId: string, state: GameState): Promise<void> {
    this.#saves.set(slotId, structuredClone(state));
  }

  async delete(slotId: string): Promise<void> {
    this.#saves.delete(slotId);
  }
}
