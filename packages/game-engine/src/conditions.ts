import type { ComparisonOperator, Condition, GameState } from "./types";

function compare(left: number, operator: ComparisonOperator, right: number): boolean {
  switch (operator) {
    case ">=": return left >= right;
    case "<=": return left <= right;
    case ">": return left > right;
    case "<": return left < right;
    case "==": return left === right;
  }
}

export function evaluateCondition(state: GameState, condition: Condition): boolean {
  switch (condition.type) {
    case "attribute":
      return compare(state.attributes[condition.attribute], condition.operator, condition.value);
    case "condition":
      return compare(state.conditions[condition.condition], condition.operator, condition.value);
    case "knowledge":
      return compare(state.knowledge[condition.knowledge], condition.operator, condition.value);
    case "reputation":
      return compare(state.reputation, condition.operator, condition.value);
    case "flag":
      return (state.flags[condition.flag] ?? false) === condition.value;
    case "money":
      return compare(state.moneyCents, condition.operator, condition.valueCents);
    case "location":
      return state.location === condition.value;
    case "relationship": {
      const person = state.people[condition.personId];
      return person ? compare(person[condition.dimension], condition.operator, condition.value) : false;
    }
  }
}

export function conditionsAreMet(state: GameState, conditions: readonly Condition[]): boolean {
  return conditions.every((condition) => evaluateCondition(state, condition));
}
