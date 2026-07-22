import type { StoryNode } from "@vidas-possiveis/game-engine";
import { storyNodeSchema } from "./schema";

const rawNodes = [
  {
    id: "school.computer-assignment",
    title: "O trabalho que vale o bimestre",
    text: "A professora anuncia um trabalho em grupo que exige pesquisa, apresentação e acesso a um computador. A entrega será amanhã cedo. Você ainda precisa decidir como organizar a noite.",
    choices: [
      {
        id: "use-own-computer",
        label: "Voltar para casa e usar o computador da família",
        conditions: [{ type: "flag", flag: "hasComputer", value: true }],
        effects: [
          { type: "advance_time", minutes: 45 },
          { type: "set_location", location: "home" },
          { type: "stat", stat: "energy", delta: -5 },
          { type: "stat", stat: "knowledge", delta: 2 },
          { type: "flag", flag: "preparedAssignment", value: true }
        ],
        nextNodeId: "school.assignment-result"
      },
      {
        id: "go-library",
        label: "Ir à biblioteca pública antes que ela feche",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 90 },
          { type: "set_location", location: "library" },
          { type: "stat", stat: "energy", delta: -10 },
          { type: "stat", stat: "discipline", delta: 2 },
          { type: "stat", stat: "knowledge", delta: 3 },
          { type: "flag", flag: "preparedAssignment", value: true }
        ],
        nextNodeId: "school.assignment-result"
      },
      {
        id: "use-phone",
        label: "Tentar fazer tudo pelo celular durante o trajeto",
        conditions: [],
        effects: [
          { type: "advance_time", minutes: 60 },
          { type: "set_location", location: "public_transport" },
          { type: "stat", stat: "energy", delta: -8 },
          { type: "stat", stat: "stress", delta: 8 },
          { type: "stat", stat: "knowledge", delta: 1 }
        ],
        nextNodeId: "school.assignment-result"
      }
    ]
  },
  {
    id: "school.assignment-result",
    title: "O fim da tarde",
    text: "A decisão consumiu parte do seu tempo e alterou como você chegará à noite. O relógio, a energia e os recursos disponíveis já mudaram — e amanhã haverá uma apresentação.",
    ending: true,
    choices: []
  }
] satisfies readonly StoryNode[];

export const storyNodes = new Map<string, StoryNode>(
  rawNodes.map((node) => {
    const parsed = storyNodeSchema.parse(node) as StoryNode;
    return [parsed.id, parsed] as const;
  })
);

export function getStoryNode(nodeId: string): StoryNode {
  const node = storyNodes.get(nodeId);
  if (!node) throw new Error(`Nó narrativo inexistente: ${nodeId}`);
  return node;
}
