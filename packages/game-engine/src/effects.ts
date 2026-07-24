import { advanceClock, assertValidClock, compareClocks } from "./clock";
import { clampValue } from "./stats";
import type {
  AppliedChange,
  Attributes,
  ConditionsState,
  Effect,
  GameState,
  KnowledgeState,
  PersonState,
  ScheduledConsequence
} from "./types";

export interface EffectsResult {
  readonly state: GameState;
  readonly changes: readonly AppliedChange[];
}

export interface EffectContext {
  readonly sourceChoiceId?: string;
}

export function applyEffects(
  state: GameState,
  effects: readonly Effect[],
  context: EffectContext = {}
): EffectsResult {
  let nextState = state;
  const changes: AppliedChange[] = [];

  for (const effect of effects) {
    switch (effect.type) {
      case "attribute": {
        const before = nextState.attributes[effect.attribute];
        const after = clampValue(before + effect.delta);
        const attributes: Attributes = { ...nextState.attributes, [effect.attribute]: after };
        nextState = { ...nextState, attributes };
        changes.push({ type: "attribute", attribute: effect.attribute, before, after });
        break;
      }
      case "condition": {
        const before = nextState.conditions[effect.condition];
        const after = clampValue(before + effect.delta);
        const conditions: ConditionsState = { ...nextState.conditions, [effect.condition]: after };
        nextState = { ...nextState, conditions };
        changes.push({ type: "condition", condition: effect.condition, before, after });
        break;
      }
      case "knowledge": {
        const before = nextState.knowledge[effect.knowledge] ?? 0;
        const after = clampValue(before + effect.delta);
        const knowledge: KnowledgeState = { ...nextState.knowledge, [effect.knowledge]: after };
        nextState = { ...nextState, knowledge };
        changes.push({ type: "knowledge", knowledge: effect.knowledge, before, after });
        break;
      }
      case "reputation": {
        const before = nextState.reputation;
        const after = clampValue(before + effect.delta);
        nextState = { ...nextState, reputation: after };
        changes.push({ type: "reputation", before, after });
        break;
      }
      case "money": {
        const beforeCents = nextState.moneyCents;
        const afterCents = Math.max(0, beforeCents + effect.deltaCents);
        nextState = { ...nextState, moneyCents: afterCents };
        changes.push({ type: "money", beforeCents, afterCents });
        break;
      }
      case "flag": {
        const before = nextState.flags[effect.flag] ?? false;
        nextState = { ...nextState, flags: { ...nextState.flags, [effect.flag]: effect.value } };
        changes.push({ type: "flag", flag: effect.flag, before, after: effect.value });
        break;
      }
      case "advance_time": {
        const before = nextState.clock;
        const after = advanceClock(before, effect.minutes);
        nextState = { ...nextState, clock: after };
        changes.push({ type: "clock", before, after });
        break;
      }
      case "set_clock": {
        assertValidClock(effect.clock);
        if (compareClocks(effect.clock, nextState.clock) < 0) {
          throw new Error(`O relógio não pode retroceder de ${nextState.clock.date} para ${effect.clock.date}.`);
        }
        const before = nextState.clock;
        const after = effect.clock;
        nextState = { ...nextState, clock: after };
        changes.push({ type: "clock", before, after });
        break;
      }
      case "set_location": {
        const before = nextState.location;
        nextState = { ...nextState, location: effect.location };
        changes.push({ type: "location", before, after: effect.location });
        break;
      }
      case "relationship": {
        const person = nextState.people[effect.personId];
        if (!person) throw new Error(`Pessoa inexistente: ${effect.personId}`);
        const before = person[effect.dimension];
        const after = clampValue(before + effect.delta);
        const updated: PersonState = { ...person, [effect.dimension]: after };
        nextState = {
          ...nextState,
          people: { ...nextState.people, [effect.personId]: updated }
        };
        changes.push({
          type: "relationship",
          personId: effect.personId,
          dimension: effect.dimension,
          before,
          after
        });
        break;
      }
      case "add_memory": {
        const person = nextState.people[effect.personId];
        if (!person) throw new Error(`Pessoa inexistente: ${effect.personId}`);
        if (person.memories.some((memory) => memory.id === effect.memory.id)) break;
        const memory = { ...effect.memory, occurredAt: nextState.clock };
        const updated: PersonState = { ...person, memories: [...person.memories, memory] };
        nextState = {
          ...nextState,
          people: { ...nextState.people, [effect.personId]: updated }
        };
        changes.push({ type: "memory", personId: effect.personId, memoryId: memory.id });
        break;
      }
      case "set_person_category": {
        const person = nextState.people[effect.personId];
        if (!person) throw new Error(`Pessoa inexistente: ${effect.personId}`);
        const before = person.category;
        const updated: PersonState = { ...person, category: effect.category };
        nextState = { ...nextState, people: { ...nextState.people, [effect.personId]: updated } };
        changes.push({ type: "person_category", personId: effect.personId, before, after: effect.category });
        break;
      }
      case "set_person_presence": {
        const person = nextState.people[effect.personId];
        if (!person) throw new Error(`Pessoa inexistente: ${effect.personId}`);
        const before = person.presence;
        const updated: PersonState = { ...person, presence: effect.presence };
        nextState = { ...nextState, people: { ...nextState.people, [effect.personId]: updated } };
        changes.push({ type: "person_presence", personId: effect.personId, before, after: effect.presence });
        break;
      }
      case "schedule_consequence": {
        const triggerAt = advanceClock(nextState.clock, effect.delayMinutes);
        const scheduled: ScheduledConsequence = {
          id: effect.consequenceId,
          sourceChoiceId: context.sourceChoiceId ?? "system",
          title: effect.title,
          text: effect.text,
          triggerAt,
          effects: effect.effects
        };
        nextState = {
          ...nextState,
          scheduledConsequences: [
            ...nextState.scheduledConsequences.filter((item) => item.id !== scheduled.id),
            scheduled
          ]
        };
        changes.push({ type: "scheduled_consequence", consequenceId: scheduled.id, triggerAt });
        break;
      }
    }
  }

  return { state: nextState, changes };
}
