import type { StoryNode } from "@vidas-possiveis/game-engine";

export function addWednesdayTemporalContinuity(
  nodes: readonly StoryNode[]
): readonly StoryNode[] {
  return nodes.map((node) => {
    if (node.id === "prologue.social-transition") {
      return {
        ...node,
        choices: node.choices.map((choice) => ({
          ...choice,
          nextNodeId: "prologue.tuesday-route-home"
        }))
      };
    }

    if (node.id === "prologue.after-social-choice") {
      return {
        ...node,
        choices: node.choices.map((choice) => ({
          ...choice,
          effects: choice.effects.filter((effect) => effect.type !== "set_clock")
        }))
      };
    }

    return node;
  });
}
