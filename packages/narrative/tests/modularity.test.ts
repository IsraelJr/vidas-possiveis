import {
  chooseStoryOption,
  createGameState,
  type GameScenarioSetup,
  type PlayerProfile,
  type StoryNode
} from "@vidas-possiveis/game-engine";
import { describe, expect, it } from "vitest";
import type { NarrativePack } from "../src";
import { validateNarrativePack } from "../src";

const footballNodes: readonly StoryNode[] = [
  {
    id: "football.training",
    moduleId: "football.training-module",
    title: "Primeiro treino",
    text: "Você chega ao centro de treinamento para disputar uma vaga nas categorias de base.",
    activity: "Participar do treino",
    choices: [{
      id: "train",
      label: "Participar do treino técnico",
      conditions: [{ type: "knowledge", knowledge: "ball_control", operator: ">=", value: 10 }],
      effects: [
        { type: "advance_time", minutes: 120 },
        { type: "condition", condition: "energy", delta: -10 },
        { type: "knowledge", knowledge: "ball_control", delta: 5 },
        { type: "set_location", location: "locker_room" }
      ],
      nextNodeId: "football.end"
    }]
  },
  {
    id: "football.end",
    moduleId: "football.training-module",
    title: "Fim do primeiro treino",
    text: "O treino termina e a comissão registra seu desempenho.",
    activity: "Recuperar-se no vestiário",
    ending: true,
    choices: []
  }
];

function footballSetup(): GameScenarioSetup {
  return {
    id: "profession-football",
    contentVersion: "football-1.0",
    entryNodeId: "football.training",
    clock: { date: "2027-01-10", minuteOfDay: 8 * 60 },
    location: "training_ground",
    moneyCents: 5_000,
    initialKnowledge: {
      ball_control: 25,
      tactics: 15
    },
    conditionAdjustments: { energy: 5 },
    initialReputation: 2,
    flags: {},
    people: {},
    usedNames: {},
    variables: {}
  };
}

const footballNodeMap = new Map(footballNodes.map((node) => [node.id, node] as const));
const footballPack: NarrativePack = {
  id: "profession-football",
  version: "football-1.0",
  entryNodeId: "football.training",
  modules: [{ id: "football.training-module", nodes: footballNodes }],
  nodes: footballNodeMap,
  presentation: {
    locationLabels: {
      training_ground: "Centro de treinamento",
      locker_room: "Vestiário"
    },
    knowledgeLabels: {
      ball_control: "Controle de bola",
      tactics: "Tática"
    },
    reputationLabel: "Reputação no clube"
  },
  createSetup: footballSetup,
  getNode(nodeId) {
    const node = footballNodeMap.get(nodeId);
    if (!node) throw new Error(`Nó inexistente: ${nodeId}`);
    return node;
  },
  renderNode(_state, node) {
    return node;
  }
};

const player: PlayerProfile = {
  id: "football-life",
  name: "Rui",
  presentation: "man",
  origin: "middle_income",
  romanticPreference: "undefined"
};

describe("narrative modularity", () => {
  it("valida um pacote profissional sem depender do prólogo escolar", () => {
    expect(validateNarrativePack(footballPack)).toEqual([]);
  });

  it("executa uma vida de futebol no mesmo motor", () => {
    const initial = createGameState(player, footballPack.createSetup(player));
    expect(initial.scenario.id).toBe("profession-football");
    expect(initial.location).toBe("training_ground");
    expect(initial.knowledge.ball_control).toBe(25);
    expect(initial.knowledge.mathematics).toBeUndefined();

    const next = chooseStoryOption(initial, footballPack.getNode(initial.currentNodeId), "train");
    expect(next.currentNodeId).toBe("football.end");
    expect(next.location).toBe("locker_room");
    expect(next.knowledge.ball_control).toBe(30);
    expect(next.conditions.energy).toBe(initial.conditions.energy - 10);
    expect(next.clock.minuteOfDay).toBe(10 * 60);
    expect(footballPack.getNode(next.currentNodeId).ending).toBe(true);
  });

  it("aceita conhecimentos e locais definidos apenas pela profissão", () => {
    expect(footballPack.presentation.knowledgeLabels.ball_control).toBe("Controle de bola");
    expect(footballPack.presentation.locationLabels.training_ground).toBe("Centro de treinamento");
  });

  it("detecta destino ausente em qualquer pacote", () => {
    const brokenTraining = {
      ...footballNodes[0]!,
      choices: [{ ...footballNodes[0]!.choices[0]!, nextNodeId: "missing" }]
    };
    const broken = {
      ...footballPack,
      nodes: new Map([
        [brokenTraining.id, brokenTraining],
        [footballNodes[1]!.id, footballNodes[1]!]
      ])
    };
    expect(validateNarrativePack(broken).some((issue) => issue.code === "missing-destination")).toBe(true);
  });
});
