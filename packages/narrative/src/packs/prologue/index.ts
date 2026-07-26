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
import { addChoiceContinuity } from "./choice-continuity";
import { endingNodes } from "./endings";
import { firstWeekNodes } from "./first-week/index";
import { addMondayTemporalContinuity } from "./monday-temporal-continuity";
import { addTemporalContinuity } from "./temporal-continuity";
import { thirdYearNodes } from "./third-year";
import { twoYearTransitionNodes } from "./two-year-transition";
import { yearModuleNodes } from "./year-modules/index";

const sourceNodes = [
  ...firstWeekNodes,
  ...yearModuleNodes,
  ...twoYearTransitionNodes,
  ...thirdYearNodes,
  ...endingNodes
];

const allNodes = addChoiceContinuity(
  addTemporalContinuity(addMondayTemporalContinuity(sourceNodes))
);

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
      conflictDeescalated: "Recuou antes da briga",
      conflictMediated: "Aceitou mediação no conflito",
      conflictArcClosed: "Encerrou a discussão imediata",
      fightStoppedAfterSeparation: "Parou após ser separado",
      fightKeptProvoking: "Continuou provocando após a separação",
      admittedFightResponsibility: "Assumiu responsabilidade pela agressão",
      blamedRivalForFight: "Culpou o rival pela briga",
      silentAtCoordination: "Ficou em silêncio na coordenação",
      toldGroupAboutFight: "Contou a verdade ao grupo",
      hidFightFromGroup: "Escondeu a briga do grupo",
      apologizedAfterFight: "Pediu desculpas depois da briga",
      fightArcClosed: "Concluiu as consequências imediatas da briga",
      finishedWednesdayClasses: "Concluiu as aulas de quarta-feira",
      finishedWednesdayAtHome: "Concluiu a quarta-feira em casa",
      talkedDuringFightCommute: "Conversou no trajeto depois da briga",
      silentDuringFightCommute: "Ficou em silêncio no trajeto depois da briga",
      admittedFightAtHome: "Assumiu a briga diante da família",
      minimizedFightAtHome: "Diminuiu a gravidade da briga em casa",
      silentAboutFightAtHome: "Evitou explicar a briga em casa",
      sleptWednesday: "Dormiu depois de encerrar a quarta-feira",
      rehearsedThursday: "Ensaiou com o grupo na quinta-feira",
      reviewedThursday: "Revisou sua parte na quinta-feira",
      preparedNightBeforePresentation: "Preparou o material na véspera",
      restedNightBeforePresentation: "Descansou na véspera",
      sleptBeforePresentation: "Dormiu antes da apresentação",
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