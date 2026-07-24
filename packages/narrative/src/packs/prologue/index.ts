import type { GameScenarioSetup, PlayerProfile, StoryNode } from "@vidas-possiveis/game-engine";
import type { NarrativeModule, NarrativePack } from "../../pack";
import { renderStoryNode } from "../../templates";
import { storyNodeSchema } from "../../schema";
import { assertValidNarrativePack } from "../../validation";
import { createPrologueSetup as createPrologueCastSetup } from "./cast";
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

export function createPrologueSetup(player: PlayerProfile): GameScenarioSetup {
  return {
    ...createPrologueCastSetup(player),
    initialKnowledge: {
      mathematics: 35,
      portuguese: 40,
      physics: 32,
      technology: 20
    }
  };
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
  presentation: {
    locationLabels: {
      home: "Casa",
      school: "Escola",
      library: "Biblioteca",
      work: "Trabalho",
      public_transport: "Transporte público",
      street: "Na rua",
      shopping_mall: "Shopping",
      park: "Parque",
      party: "Festa"
    },
    knowledgeLabels: {
      mathematics: "Matemática",
      portuguese: "Português",
      physics: "Física",
      technology: "Tecnologia"
    },
    flagLabels: {
      ateBreakfast: "Tomou café",
      ateSchoolMeal: "Comeu a merenda",
      boughtCanteenSnack: "Comprou lanche",
      skippedClass: "Saiu durante a aula vaga",
      promisedHelp: "Prometeu ajudar o colega",
      sharedPlan: "Organizou o grupo",
      removedGroupMate: "Retirou o colega do trabalho",
      humiliatedGroupMate: "Expôs o colega no grupo",
      preparedAssignment: "Preparou o trabalho",
      lateForPresentation: "Chegou atrasado à apresentação",
      schoolFight: "Envolveu-se em uma briga",
      supportedFamily: "Ajudou a família",
      liedToFamily: "Mentiu para sair",
      formationUniversity: "Escolheu faculdade",
      formationTechnical: "Escolheu curso técnico",
      formationOnlineWork: "Escolheu trabalhar e estudar online",
      formationSelfStudy: "Escolheu trabalho e estudo independente"
    },
    reputationLabel: "Reputação na escola"
  },
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
  PROLOGUE_FEMALE_NAMES,
  PROLOGUE_HISTORY_MODELS,
  PROLOGUE_MALE_NAMES,
  PROLOGUE_PERSON_IDS
} from "./cast";
