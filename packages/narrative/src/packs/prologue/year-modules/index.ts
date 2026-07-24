import { yearModulePart1 } from "./module-1";
import { yearModulePart2 } from "./module-2";
import { yearModulePart3 } from "./module-3";
import { yearModulePart4 } from "./module-4";
import { yearModulePart5 } from "./module-5";

export const yearModuleNodes = [
  ...yearModulePart1,
  ...yearModulePart2,
  ...yearModulePart3,
  ...yearModulePart4,
  ...yearModulePart5
] as const;
