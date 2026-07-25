import { dayClosureNodes } from "./day-closure";
import { firstWeekPart1 } from "./part-1";
import { firstWeekPart2 } from "./part-2";
import { firstWeekPart3 } from "./part-3";
import { firstWeekPart4 } from "./part-4";
import { firstWeekPart5 } from "./part-5";
import { tuesdayClosureNodes } from "./tuesday-closure";

export const firstWeekNodes = [
  ...firstWeekPart1,
  ...firstWeekPart2,
  ...firstWeekPart3,
  ...tuesdayClosureNodes,
  ...firstWeekPart4,
  ...dayClosureNodes,
  ...firstWeekPart5
] as const;