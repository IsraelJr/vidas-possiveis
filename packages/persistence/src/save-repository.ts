import type { GameState } from "@vidas-possiveis/game-engine";

export interface SaveRepository {
  load(slotId: string): Promise<GameState | null>;
  save(slotId: string, state: GameState): Promise<void>;
  delete(slotId: string): Promise<void>;
}
