import type { GameState } from "@vidas-possiveis/game-engine";
import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { SaveRepository } from "./save-repository";
import { SerialOperationQueue } from "./serial-operation-queue";

interface SaveDatabase extends DBSchema {
  saves: {
    key: string;
    value: GameState;
  };
}

export class IndexedDbSaveRepository implements SaveRepository {
  readonly #databaseName: string;
  readonly #operations = new SerialOperationQueue();
  #databasePromise: Promise<IDBPDatabase<SaveDatabase>> | null = null;

  constructor(databaseName = "vidas-possiveis") {
    this.#databaseName = databaseName;
  }

  #getDatabase(): Promise<IDBPDatabase<SaveDatabase>> {
    if (typeof indexedDB === "undefined") {
      throw new Error("IndexedDB não está disponível neste ambiente.");
    }

    this.#databasePromise ??= openDB<SaveDatabase>(this.#databaseName, 1, {
      upgrade(database) {
        if (!database.objectStoreNames.contains("saves")) {
          database.createObjectStore("saves");
        }
      }
    });

    return this.#databasePromise;
  }

  load(slotId: string): Promise<GameState | null> {
    return this.#operations.enqueue(async () => {
      const database = await this.#getDatabase();
      return (await database.get("saves", slotId)) ?? null;
    });
  }

  save(slotId: string, state: GameState): Promise<void> {
    return this.#operations.enqueue(async () => {
      const database = await this.#getDatabase();
      await database.put("saves", state, slotId);
    });
  }

  delete(slotId: string): Promise<void> {
    return this.#operations.enqueue(async () => {
      const database = await this.#getDatabase();
      await database.delete("saves", slotId);
    });
  }
}
