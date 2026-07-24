import type { GameState, StoryNode } from "@vidas-possiveis/game-engine";
import type { NarrativePack } from "./pack";
import { schoolProloguePack } from "./packs/prologue";

const PACKS = new Map<string, NarrativePack>([
  [schoolProloguePack.id, schoolProloguePack]
]);

export function getNarrativePack(packId: string): NarrativePack {
  const pack = PACKS.get(packId);
  if (!pack) throw new Error(`Pacote narrativo inexistente: ${packId}`);
  return pack;
}

export function getStoryNode(nodeId: string, packId = schoolProloguePack.id): StoryNode {
  return getNarrativePack(packId).getNode(nodeId);
}

export function getStoryNodeForState(state: GameState): StoryNode {
  return getNarrativePack(state.scenario.id).getNode(state.currentNodeId);
}

export function renderNodeForState(state: GameState, node?: StoryNode): StoryNode {
  const pack = getNarrativePack(state.scenario.id);
  return pack.renderNode(state, node ?? pack.getNode(state.currentNodeId));
}

export function listNarrativePacks(): readonly NarrativePack[] {
  return Array.from(PACKS.values());
}
