import type {
  Effect,
  GameState,
  ImmediateEffect,
  StoryChoice,
  StoryNode
} from "@vidas-possiveis/game-engine";

export function renderTemplate(template: string, values: Readonly<Record<string, string>>): string {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key: string) => values[key] ?? match);
}

function renderImmediateEffect(
  effect: ImmediateEffect,
  values: Readonly<Record<string, string>>
): ImmediateEffect {
  if (effect.type !== "add_memory") return effect;
  return {
    ...effect,
    memory: {
      ...effect.memory,
      summary: renderTemplate(effect.memory.summary, values)
    }
  };
}

function renderEffect(effect: Effect, values: Readonly<Record<string, string>>): Effect {
  if (effect.type === "schedule_consequence") {
    return {
      ...effect,
      title: renderTemplate(effect.title, values),
      text: renderTemplate(effect.text, values),
      effects: effect.effects.map((item) => renderImmediateEffect(item, values))
    };
  }
  return renderImmediateEffect(effect, values);
}

function renderChoice(choice: StoryChoice, values: Readonly<Record<string, string>>): StoryChoice {
  return {
    ...choice,
    label: renderTemplate(choice.label, values),
    effects: choice.effects.map((effect) => renderEffect(effect, values)),
    ...(choice.outcome
      ? {
          outcome: {
            ...choice.outcome,
            title: renderTemplate(choice.outcome.title, values),
            text: renderTemplate(choice.outcome.text, values),
            ...(choice.outcome.continueLabel
              ? { continueLabel: renderTemplate(choice.outcome.continueLabel, values) }
              : {}),
            ...(choice.outcome.activity
              ? { activity: renderTemplate(choice.outcome.activity, values) }
              : {})
          }
        }
      : {}),
    ...(choice.skillCheck
      ? {
          skillCheck: {
            ...choice.skillCheck,
            bonusFlags: choice.skillCheck.bonusFlags.map((bonus) => ({
              ...bonus,
              label: renderTemplate(bonus.label, values)
            })),
            outcomes: Object.fromEntries(
              Object.entries(choice.skillCheck.outcomes).map(([tier, outcome]) => [
                tier,
                {
                  ...outcome,
                  effects: outcome.effects.map((effect) => renderImmediateEffect(effect, values))
                }
              ])
            ) as unknown as NonNullable<StoryChoice["skillCheck"]>["outcomes"]
          }
        }
      : {})
  };
}

export function renderStoryNode(state: GameState, node: StoryNode): StoryNode {
  const values = {
    playerName: state.player.name,
    ...state.scenario.variables
  };

  return {
    ...node,
    title: renderTemplate(node.title, values),
    text: renderTemplate(node.text, values),
    activity: renderTemplate(node.activity, values),
    ...(node.nextCommitment
      ? {
          nextCommitment: {
            ...node.nextCommitment,
            label: renderTemplate(node.nextCommitment.label, values)
          }
        }
      : {}),
    choices: node.choices.map((choice) => renderChoice(choice, values))
  };
}
