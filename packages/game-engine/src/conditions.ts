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
    case "stat":
      return compare(state.stats[condition.stat], condition.operator, condition.value);
    case "flag":
      return (state.flags[condition.flag] ?? false) === condition.value;
    case "money":
      return compare(state.moneyCents, condition.operator, condition.valueCents);
    case "location":
      return state.location === condition.value;
  }
}

export function conditionsAreMet(state: GameState, conditions: readonly Condition[]): boolean {
  return conditions.every((condition) => evaluateCondition(state, condition));
}
