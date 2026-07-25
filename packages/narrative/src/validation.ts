import {
  compareClocks,
  type Condition,
  type Effect,
  type ImmediateEffect,
  type StoryNode
} from "@vidas-possiveis/game-engine";
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

function validateTemporalEffectGroup(
  pack: NarrativePack,
  node: StoryNode,
  choiceId: string,
  effects: readonly ImmediateEffect[],
  conditions: readonly Condition[],
  issues: NarrativeValidationIssue[]
): void {
  const transitions = effects.filter((effect) => effect.type === "time_transition");
  if (transitions.length === 0) return;

  if (transitions.length > 1) {
    issues.push({
      code: "multiple-time-transitions",
      message: `${node.id}/${choiceId} executa mais de uma transição temporal`
    });
  }
  if (effects.some((effect) => effect.type === "set_location")) {
    issues.push({
      code: "mixed-location-time-transition",
      message: `${node.id}/${choiceId} muda de local e salta no tempo na mesma escolha`
    });
  }

  for (const transition of transitions) {
    const expectedBoundary = transition.kind === "sleep" ? "day-end" : "montage";
    if (node.timeBoundary !== expectedBoundary) {
      issues.push({
        code: "invalid-time-boundary",
        message: `${node.id}/${choiceId} usa ${transition.kind} fora de ${expectedBoundary}`
      });
    }
    if (transition.requiredLocation && !pack.presentation.locationLabels[transition.requiredLocation]) {
      issues.push({
        code: "missing-location-label",
        message: `${node.id}/${choiceId} exige o local sem rótulo ${transition.requiredLocation}`
      });
    }
    if (transition.kind === "sleep" && !transition.requiredLocation) {
      issues.push({
        code: "missing-sleep-location",
        message: `${node.id}/${choiceId} tenta dormir sem declarar onde o personagem está`
      });
    }
    if (
      transition.requiredLocation &&
      !conditions.some(
        (condition) =>
          condition.type === "location" && condition.value === transition.requiredLocation
      )
    ) {
      issues.push({
        code: "missing-time-transition-location-condition",
        message: `${node.id}/${choiceId} não exige que o personagem já esteja em ${transition.requiredLocation}`
      });
    }
    if (
      node.nextCommitment &&
      compareClocks(transition.clock, node.nextCommitment.clock) > 0
    ) {
      issues.push({
        code: "time-transition-skips-commitment",
        message: `${node.id}/${choiceId} ultrapassa o compromisso ${node.nextCommitment.label}`
      });
    }
  }
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

      const directEffects = choice.effects.filter(
        (effect): effect is ImmediateEffect => effect.type !== "schedule_consequence"
      );
      validateTemporalEffectGroup(
        pack,
        node,
        choice.id,
        directEffects,
        choice.conditions,
        issues
      );

      for (const scheduled of choice.effects.filter(
        (effect) => effect.type === "schedule_consequence"
      )) {
        if (scheduled.effects.some((effect) => effect.type === "time_transition")) {
          issues.push({
            code: "scheduled-time-transition",
            message: `${nodeId}/${choice.id} agenda um salto de tempo sem uma cena de encerramento`
          });
        }
      }

      for (const [outcomeTier, outcome] of Object.entries(choice.skillCheck?.outcomes ?? {})) {
        validateTemporalEffectGroup(
          pack,
          node,
          `${choice.id}/${outcomeTier}`,
          outcome.effects,
          choice.conditions,
          issues
        );
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