import type {
  GameScenarioSetup,
  GameState,
  PlayerProfile,
  StoryNode
} from "@vidas-possiveis/game-engine";
import type { NarrativeModule, NarrativePack } from "../../pack";
import { storyNodeSchema } from "../../schema";
import { renderStoryNode } from "../../templates";
import { assertValidNarrativePack } from "../../validation";
import {
  createPrologueSetup as createPrologueCastSetup,
  PROLOGUE_PERSON_IDS
} from "./cast";
import { endingNodes } from "./endings";
import { firstWeekNodes } from "./first-week/index";
import { thirdYearNodes } from "./third-year";
import { twoYearTransitionNodes } from "./two-year-transition";
import { yearModuleNodes } from "./year-modules/index";

const allNodes = [
  ...firstWeekNodes,
  ...yearModuleNodes,
  ...twoYearTransitionNodes,
  ...thirdYearNodes,
  ...endingNodes
];

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

export interface PrologueSetupOptions {
  readonly footballLifeOwned?: boolean;
}

export function createPrologueSetup(
  player: PlayerProfile,
  options: PrologueSetupOptions = {}
): GameScenarioSetup {
  const base = createPrologueCastSetup(player);
  const footballLifeOwned = options.footballLifeOwned === true;

  return {
    ...base,
    contentVersion: "prologue-2.0",
    flags: {
      ...base.flags,
      footballLifeOwned,
      footballBridgeActive: false,
      completedSecondYear: false,
      completedTwoYearSchool: false,
      migratedToTwoYearPrologue: false
    },
    initialKnowledge: {
      mathematics: 35,
      portuguese: 40,
      physics: 32,
      technology: 20,
      ...(footballLifeOwned ? { ballControl: 12, tactics: 10 } : {})
    },
    contentMigration: {
      fromContentVersions: ["prologue-1.0"],
      completionNodeIds: [
        "prologue.school-year-end",
        "prologue.formation-choice",
        "ending.university",
        "ending.technical",
        "ending.online-work",
        "ending.self-study"
      ],
      completionFlag: "completedSchoolPrologue",
      resumeNodeId: "prologue.vacation-transition",
      resumeClock: { date: "2026-12-18", minuteOfDay: 17 * 60 },
      resumeLocation: "street",
      resetFlags: [
        "completedSchoolPrologue",
        "formationUniversity",
        "formationTechnical",
        "formationOnlineWork",
        "formationSelfStudy"
      ],
      noticeFlag: "migratedToTwoYearPrologue"
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

function renderPrologueNode(state: GameState, node: StoryNode): StoryNode {
  const rendered = renderStoryNode(state, node);
  if (node.id !== "prologue.third-year-return") return rendered;

  const groupName = state.people[PROLOGUE_PERSON_IDS.groupMate]?.name ?? "essa pessoa";
  if (state.flags.humiliatedGroupMate === true) {
    return {
      ...rendered,
      text: `${groupName} entra no novo grupo, mas não senta perto de você. A exposição do ano passado não desapareceu com as férias. Quando alguém sugere dividir as tarefas, ${groupName} pergunta quem ficará responsável por registrar cada entrega. A frase parece prática. O tom deixa claro que também é memória.`
    };
  }
  if (state.flags.removedGroupMate === true) {
    return {
      ...rendered,
      text: `${groupName} volta a trabalhar perto de você no terceiro ano. A retirada do primeiro grupo ainda pesa, embora nenhum dos dois fale disso diretamente. Desta vez, ${groupName} traz anotações prontas e pergunta, antes de qualquer conversa, como as tarefas serão divididas.`
    };
  }
  if (state.flags.promisedHelp === true || state.flags.sharedPlan === true) {
    return {
      ...rendered,
      text: `${groupName} coloca o material sobre a mesa antes de você pedir. O trabalho do ano passado não é mencionado, mas aparece no modo como ${groupName} já separou uma parte para você e deixou outra aberta para decisão conjunta. A ajuda que vocês construíram voltou como uma possibilidade, não como uma dívida.`
    };
  }
  return rendered;
}

export const schoolProloguePack: NarrativePack = {
  id: "school-prologue",
  version: "prologue-2.0",
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
      party: "Festa",
      sports_field: "Campo ou centro de treinamento",
      graduation_hall: "Formatura"
    },
    knowledgeLabels: {
      mathematics: "Matemática",
      portuguese: "Português",
      physics: "Física",
      technology: "Tecnologia",
      ballControl: "Controle de bola",
      tactics: "Tática"
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
      footballBridgeActive: "Mantém uma trajetória no futebol",
      completedSecondYear: "Concluiu o segundo ano",
      completedTwoYearSchool: "Concluiu o Ensino Médio",
      migratedToTwoYearPrologue: "Progresso atualizado para dois anos escolares",
      formationUniversity: "Escolheu faculdade",
      formationTechnical: "Escolheu curso técnico",
      formationOnlineWork: "Escolheu trabalhar e estudar online",
      formationSelfStudy: "Escolheu trabalho e estudo independente",
      formationFootball: "Escolheu seguir a trajetória no futebol"
    },
    reputationLabel: "Reputação na escola"
  },
  createSetup: createPrologueSetup,
  getNode(nodeId) {
    const node = prologueNodes.get(nodeId);
    if (!node) throw new Error(`Nó narrativo inexistente: ${nodeId}`);
    return node;
  },
  renderNode: renderPrologueNode
};

assertValidNarrativePack(schoolProloguePack);

export {
  PROLOGUE_FEMALE_NAMES,
  PROLOGUE_HISTORY_MODELS,
  PROLOGUE_MALE_NAMES,
  PROLOGUE_PERSON_IDS
} from "./cast";
