import type {
  GameScenarioSetup,
  GameState,
  PlayerProfile,
  StoryNode
} from "@vidas-possiveis/game-engine";

export interface NarrativeModule {
  readonly id: string;
  readonly nodes: readonly StoryNode[];
}

export interface NarrativePack {
  readonly id: string;
  readonly version: string;
  readonly entryNodeId: string;
  readonly modules: readonly NarrativeModule[];
  readonly nodes: ReadonlyMap<string, StoryNode>;
  createSetup(player: PlayerProfile): GameScenarioSetup;
  getNode(nodeId: string): StoryNode;
  renderNode(state: GameState, node: StoryNode): StoryNode;
}
