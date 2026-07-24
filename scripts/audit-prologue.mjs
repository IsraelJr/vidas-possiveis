import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";

const firstWeekFiles = [
  "packages/narrative/src/packs/prologue/first-week/shared.ts",
  "packages/narrative/src/packs/prologue/first-week/index.ts",
  "packages/narrative/src/packs/prologue/first-week/part-1.ts",
  "packages/narrative/src/packs/prologue/first-week/part-2.ts",
  "packages/narrative/src/packs/prologue/first-week/part-3.ts",
  "packages/narrative/src/packs/prologue/first-week/part-4.ts",
  "packages/narrative/src/packs/prologue/first-week/part-5.ts"
];

const yearModuleFiles = [
  "packages/narrative/src/packs/prologue/year-modules/shared.ts",
  "packages/narrative/src/packs/prologue/year-modules/index.ts",
  "packages/narrative/src/packs/prologue/year-modules/module-1.ts",
  "packages/narrative/src/packs/prologue/year-modules/module-2.ts",
  "packages/narrative/src/packs/prologue/year-modules/module-3.ts",
  "packages/narrative/src/packs/prologue/year-modules/module-4.ts",
  "packages/narrative/src/packs/prologue/year-modules/module-5.ts"
];

const requiredFiles = [
  "docs/HANDOFF_CANONICAL.md",
  "docs/PROLOGUE_CANONICAL.md",
  "packages/game-engine/src/random.ts",
  "packages/narrative/src/pack.ts",
  "packages/narrative/src/registry.ts",
  "packages/narrative/src/validation.ts",
  "packages/narrative/src/packs/prologue/cast.ts",
  "packages/narrative/src/packs/prologue/endings.ts",
  "packages/narrative/tests/integrity.test.ts",
  "packages/narrative/tests/modularity.test.ts",
  ...firstWeekFiles,
  ...yearModuleFiles
];

const failures = [];
for (const file of requiredFiles) {
  try { await access(file, constants.R_OK); }
  catch { failures.push(`Arquivo canônico ausente: ${file}`); }
}

const cast = await readFile("packages/narrative/src/packs/prologue/cast.ts", "utf8");
for (const name of ["Tamires", "Solange", "Paula", "Julia", "Miguel", "Israel", "Luiz", "Rodrigo", "Carlos"]) {
  if (!cast.includes(`"${name}"`)) failures.push(`Nome do prólogo ausente: ${name}`);
}
for (const marker of ["deterministicIndex", "usedNames", "PROLOGUE_HISTORY_MODELS", "romanticCompatible"]) {
  if (!cast.includes(marker)) failures.push(`Geração do elenco não contém: ${marker}`);
}

const firstWeek = (await Promise.all(firstWeekFiles.map((file) => readFile(file, "utf8")))).join("\n");
for (const marker of [
  "prologue.wakeup",
  "prologue.interval",
  "prologue.physical-education",
  "prologue.class-gap",
  "prologue.pair-test",
  "prologue.group-message",
  "prologue.presentation-wait",
  "prologue.presentation"
]) {
  if (!firstWeek.includes(marker)) failures.push(`Primeira semana não contém: ${marker}`);
}

const yearModules = (await Promise.all(yearModuleFiles.map((file) => readFile(file, "utf8")))).join("\n");
for (const marker of [
  "prologue.module-academic",
  "prologue.module-social",
  "prologue.module-family",
  "prologue.module-physical",
  "prologue.module-relationship"
]) {
  if (!yearModules.includes(marker)) failures.push(`Módulos do ano não contêm: ${marker}`);
}

const tests = await readFile("packages/narrative/tests/integrity.test.ts", "utf8");
for (const marker of [
  "Tempo retrocedeu",
  "não reutiliza nome",
  "contexto antes da decisão",
  "25",
  "activity === \"Apresentar o trabalho\""
]) {
  if (!tests.includes(marker)) failures.push(`Testes canônicos não cobrem: ${marker}`);
}

const modularity = await readFile("packages/narrative/tests/modularity.test.ts", "utf8");
for (const marker of [
  "profession-football",
  "validateNarrativePack",
  "training_ground",
  "ball_control",
  "chooseStoryOption",
  "missing-destination"
]) {
  if (!modularity.includes(marker)) failures.push(`Teste de modularidade não contém: ${marker}`);
}

const shell = await readFile("apps/web/src/components/game-shell.tsx", "utf8");
for (const marker of [
  "Classe média · 17 anos · 3º ano do Ensino Médio",
  "person-context",
  "Possível interesse romântico",
  "pack.presentation",
  "Object.entries(state.knowledge)"
]) {
  if (!shell.includes(marker)) failures.push(`Interface do prólogo não contém: ${marker}`);
}

const prologuePack = await readFile("packages/narrative/src/packs/prologue/index.ts", "utf8");
for (const marker of [
  "Reputação na escola",
  "knowledgeLabels",
  "locationLabels",
  "initialKnowledge"
]) {
  if (!prologuePack.includes(marker)) failures.push(`Pacote do prólogo não contém: ${marker}`);
}

if (failures.length > 0) {
  console.error("Auditoria do Prólogo Canônico reprovada:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Auditoria do Prólogo Canônico aprovada.");
console.log("Elenco, identidade, contexto, tempo e execução de pacote profissional independente foram verificados.");
