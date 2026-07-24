import type { Effect, ImmediateEffect, StoryNode } from "@vidas-possiveis/game-engine";
import type { NarrativePack } from "./pack";

export interface NarrativeValidationIssue {
  readonly code: string;
  readonly message: string;
}

function immediateEffects(effects: readonly Effect[]): readonly ImmediateEffect[] {
  return effects.flatMap((effect) =>
    effect.type === "schedule_consequence" ? [...effect.effects] : [effect]
  );
}

export function validateNarrativePack(pack: NarrativePack): readonly NarrativeValidationIssue[] {
  const issues: NarrativeValidationIssue[] = [];
  const nodeIds = new Set<string>();
  const moduleNodeIds = new Set<string>();

  if (!pack.nodes.has(pack.entryNodeId)) {
    issues.push({ code: "missing-entry", message: `Entrada inexistente: ${pack.entryNodeId}` });
  }
  if (pack.presentation.reputationLabel.trim().length === 0) {
    issues.push({ code: "missing-reputation-label", message: "O pacote não nomeia sua reputação." });
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

      for (const condition of choice.conditions) {
        if (condition.type === "location" && !pack.presentation.locationLabels[condition.value]) {
          issues.push({
            code: "missing-location-label",
            message: `${nodeId}/${choice.id} usa o local sem rótulo ${condition.value}`
          });
        }
        if (condition.type === "knowledge" && !pack.presentation.knowledgeLabels[condition.knowledge]) {
          issues.push({
            code: "missing-knowledge-label",
            message: `${nodeId}/${choice.id} usa o conhecimento sem rótulo ${condition.knowledge}`
          });
        }
      }

      const effects = [
        ...immediateEffects(choice.effects),
        ...Object.values(choice.skillCheck?.outcomes ?? {}).flatMap((outcome) => outcome.effects)
      ];
      for (const effect of effects) {
        if (effect.type === "set_location" && !pack.presentation.locationLabels[effect.location]) {
          issues.push({
            code: "missing-location-label",
            message: `${nodeId}/${choice.id} define o local sem rótulo ${effect.location}`
          });
        }
        if (effect.type === "knowledge" && !pack.presentation.knowledgeLabels[effect.knowledge]) {
          issues.push({
            code: "missing-knowledge-label",
            message: `${nodeId}/${choice.id} altera o conhecimento sem rótulo ${effect.knowledge}`
          });
        }
      }
    }
  }

  for (const narrativeModule of pack.modules) {
    for (const node of narrativeModule.nodes as readonly StoryNode[]) {
      if (moduleNodeIds.has(node.id)) {
        issues.push({ code: "duplicate-module-node", message: `${node.id} aparece em mais de um módulo` });
      }
      moduleNodeIds.add(node.id);
      if (node.moduleId && node.moduleId !== narrativeModule.id) {
        issues.push({
          code: "module-mismatch",
          message: `${node.id} declara ${node.moduleId}, mas está no módulo ${narrativeModule.id}`
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
