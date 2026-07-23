import { describe, expect, it } from "vitest";
import { SerialOperationQueue } from "../src/serial-operation-queue";

describe("SerialOperationQueue", () => {
  it("executa operações na ordem em que foram enfileiradas", async () => {
    const queue = new SerialOperationQueue();
    const events: string[] = [];
    let releaseFirst: (() => void) | undefined;

    const first = queue.enqueue(async () => {
      events.push("first:start");
      await new Promise<void>((resolve) => {
        releaseFirst = resolve;
      });
      events.push("first:end");
      return 1;
    });

    const second = queue.enqueue(async () => {
      events.push("second:start");
      return 2;
    });

    await Promise.resolve();
    expect(events).toEqual(["first:start"]);

    releaseFirst?.();
    await expect(Promise.all([first, second])).resolves.toEqual([1, 2]);
    expect(events).toEqual(["first:start", "first:end", "second:start"]);
  });

  it("continua processando depois de uma operação rejeitada", async () => {
    const queue = new SerialOperationQueue();

    await expect(queue.enqueue(async () => {
      throw new Error("falha simulada");
    })).rejects.toThrow("falha simulada");

    await expect(queue.enqueue(async () => 42)).resolves.toBe(42);
  });
});
