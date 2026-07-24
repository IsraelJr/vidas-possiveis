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

export interface NarrativePresentation {
  readonly locationLabels: Readonly<Record<string, string>>;
  readonly knowledgeLabels: Readonly<Record<string, string>>;
  readonly flagLabels?: Readonly<Record<string, string>>;
  readonly reputationLabel: string;
}

export interface NarrativePack {
  readonly id: string;
  readonly version: string;
  readonly entryNodeId: string;
  readonly modules: readonly NarrativeModule[];
  readonly nodes: ReadonlyMap<string, StoryNode>;
  readonly presentation: NarrativePresentation;
  createSetup(player: PlayerProfile): GameScenarioSetup;
  getNode(nodeId: string): StoryNode;
  renderNode(state: GameState, node: StoryNode): StoryNode;
}
