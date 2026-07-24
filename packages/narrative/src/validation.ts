import type { StoryNode } from "@vidas-possiveis/game-engine";
import type { NarrativePack } from "./pack";

export interface NarrativeValidationIssue {
  readonly code: string;
  readonly message: string;
}

export function validateNarrativePack(pack: NarrativePack): readonly NarrativeValidationIssue[] {
  const issues: NarrativeValidationIssue[] = [];
  const nodeIds = new Set<string>();
  const moduleNodeIds = new Set<string>();

  if (!pack.nodes.has(pack.entryNodeId)) {
    issues.push({ code: "missing-entry", message: `Entrada inexistente: ${pack.entryNodeId}` });
  }

  for (const [nodeId, node] of pack.nodes) {
    if (nodeIds.has(nodeId)) {
      issues.push({ code: "duplicate-node", message: `Nó duplicado: ${nodeId}` });
    }
    nodeIds.add(nodeId);
    if (node.id !== nodeId) {
      issues.push({ code: "node-key-mismatch", message: `Chave ${nodeId} difere do id ${node.id}` });
    }
    if (!node.ending && node.choices.length === 0) {
      issues.push({ code: "dead-end", message: `Nó sem saída: ${nodeId}` });
    }

    for (const choice of node.choices) {
      const destinations = [
        choice.nextNodeId,
        ...Object.values(choice.skillCheck?.outcomes ?? {}).map((outcome) => outcome.nextNodeId)
      ];
      for (const destination of destinations) {
        if (!pack.nodes.has(destination)) {
          issues.push({
            code: "missing-destination",
            message: `${nodeId}/${choice.id} aponta para ${destination}`
          });
        }
      }
    }
  }

  for (const module of pack.modules) {
    for (const node of module.nodes as readonly StoryNode[]) {
      if (moduleNodeIds.has(node.id)) {
        issues.push({ code: "duplicate-module-node", message: `${node.id} aparece em mais de um módulo` });
      }
      moduleNodeIds.add(node.id);
      if (node.moduleId && node.moduleId !== module.id) {
        issues.push({
          code: "module-mismatch",
          message: `${node.id} declara ${node.moduleId}, mas está no módulo ${module.id}`
        });
      }
    }
  }

  for (const nodeId of nodeIds) {
    if (!moduleNodeIds.has(nodeId)) {
      issues.push({ code: "unassigned-node", message: `${nodeId} não pertence a um módulo` });
    }
  }

  return issues;
}

export function assertValidNarrativePack(pack: NarrativePack): void {
  const issues = validateNarrativePack(pack);
  if (issues.length > 0) {
    throw new Error(issues.map((issue) => `${issue.code}: ${issue.message}`).join("\n"));
  }
}
