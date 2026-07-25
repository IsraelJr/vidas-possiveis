import type { Effect, StoryChoice, StoryNode } from "@vidas-possiveis/game-engine";

function removeNextDayTeleport(effects: readonly Effect[]): readonly Effect[] {
  return effects.filter(
    (effect) => effect.type !== "set_clock" && effect.type !== "set_location"
  );
}

function rewireNightChoice(choice: StoryChoice): StoryChoice {
  const outcomes: Record<string, NonNullable<StoryChoice["outcome"]>> = {
    "review-and-sleep": {
      title: "Uma última revisão antes do sono",
      text: "Você revisa por uma hora, guarda o material e encerra a noite em casa. A escola não aparece imediatamente: primeiro você dorme e acorda na manhã seguinte.",
      continueLabel: "Dormir e acordar na terça-feira",
      activity: "Encerrar a segunda-feira"
    },
    "sleep-early": {
      title: "Uma noite de descanso",
      text: "Você decide confiar no que já estudou, prepara o despertador e dorme em casa. O próximo dia só começa depois desse descanso.",
      continueLabel: "Acordar na terça-feira",
      activity: "Encerrar a segunda-feira"
    },
    "scroll-late": {
      title: "O celular prolonga a noite",
      text: "Você passa mais tempo no celular do que pretendia. Quando finalmente larga a tela, ainda está em casa e precisa dormir antes que a terça-feira possa começar.",
      continueLabel: "Dormir e acordar na terça-feira",
      activity: "Encerrar a segunda-feira"
    }
  };
  const outcome = outcomes[choice.id];
  if (!outcome) return choice;

  return {
    ...choice,
    conditions: [
      ...choice.conditions,
      { type: "location", value: "home" }
    ],
    effects: [
      ...removeNextDayTeleport(choice.effects),
      {
        type: "time_transition",
        kind: "sleep",
        requiredLocation: "home",
        clock: { date: "2026-02-17", minuteOfDay: 6 * 60 + 30 }
      }
    ],
    nextNodeId: "prologue.tuesday-school-morning",
    outcome
  };
}

export function addMondayTemporalContinuity(
  nodes: readonly StoryNode[]
): readonly StoryNode[] {
  return nodes.map((node) => {
    if (node.id === "prologue.work-session") {
      return {
        ...node,
        choices: node.choices.map((choice) => ({
          ...choice,
          nextNodeId: "prologue.monday-return-home"
        }))
      };
    }

    if (node.id === "prologue.night-plan") {
      return {
        ...node,
        timeBoundary: "day-end",
        choices: node.choices.map(rewireNightChoice)
      };
    }

    return node;
  });
}