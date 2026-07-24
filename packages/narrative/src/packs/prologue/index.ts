import type { StoryNode } from "@vidas-possiveis/game-engine";
import type { NarrativeModule, NarrativePack } from "../../pack";
import { renderStoryNode } from "../../templates";
import { storyNodeSchema } from "../../schema";
import { assertValidNarrativePack } from "../../validation";
import { createPrologueSetup } from "./cast";
import { endingNodes } from "./endings";
import { firstWeekNodes } from "./first-week/index";
import { yearModuleNodes } from "./year-modules/index";

const allNodes = [...firstWeekNodes, ...yearModuleNodes, ...endingNodes];

function createModules(nodes: readonly StoryNode[]): readonly NarrativeModule[] {
  const groups = new Map<string, StoryNode[]>();
  for (const node of nodes) {
    const moduleId = node.moduleId ?? "unassigned";
    const moduleNodes = groups.get(moduleId) ?? [];
    moduleNodes.push(node);
    groups.set(moduleId, moduleNodes);
  }
  return Array.from(groups, ([id, moduleNodes]) => ({ id, nodes: moduleNodes }));
}

export const prologueModules = createModules(allNodes);

export const rawPrologueNodes: readonly StoryNode[] = allNodes.map(
  (node) => storyNodeSchema.parse(node) as StoryNode
);

export const prologueNodes = new Map<string, StoryNode>(
  rawPrologueNodes.map((node) => [node.id, node])
);

export const schoolProloguePack: NarrativePack = {
  id: "school-prologue",
  version: "prologue-1.0",
  entryNodeId: "prologue.wakeup",
  modules: prologueModules,
  nodes: prologueNodes,
  createSetup: createPrologueSetup,
  getNode(nodeId) {
    const node = prologueNodes.get(nodeId);
    if (!node) throw new Error(`Nó narrativo inexistente: ${nodeId}`);
    return node;
  },
  renderNode: renderStoryNode
};

assertValidNarrativePack(schoolProloguePack);

export {
  createPrologueSetup,
  PROLOGUE_FEMALE_NAMES,
  PROLOGUE_HISTORY_MODELS,
  PROLOGUE_MALE_NAMES,
  PROLOGUE_PERSON_IDS
} from "./cast";
