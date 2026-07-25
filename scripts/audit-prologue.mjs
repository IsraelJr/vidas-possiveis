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
  "docs/HANDOFF_REFERENCE.md",
  "docs/NARRATIVE_BIBLE.md",
  "docs/PROLOGUE_CANONICAL.md",
  "docs/PROLOGUE_CANONICAL_SOURCE_POINTER.md",
  "docs/PROLOGUE_IMPLEMENTATION_AUDIT.md",
  "docs/NARRATIVE_PACKAGE_ARCHITECTURE.md",
  "packages/game-engine/src/random.ts",
  "packages/game-engine/src/game.ts",
  "packages/narrative/src/pack.ts",
  "packages/narrative/src/registry.ts",
  "packages/narrative/src/validation.ts",
  "packages/narrative/src/packs/prologue/cast.ts",
  "packages/narrative/src/packs/prologue/endings.ts",
  "packages/narrative/src/packs/prologue/two-year-transition.ts",
  "packages/narrative/src/packs/prologue/third-year.ts",
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
  "prologue.module-relationship",
  "footballBridgeActive",
  "prologue.second-year-vocational-review"
]) {
  if (!yearModules.includes(marker)) failures.push(`Módulos do segundo ano não contêm: ${marker}`);
}

const transition = await readFile("packages/narrative/src/packs/prologue/two-year-transition.ts", "utf8");
for (const marker of [
  "prologue.second-year-close",
  "prologue.vacation-transition",
  "2027-02-08",
  "prologue.third-year-opening",
  "completedSecondYear"
]) {
  if (!transition.includes(marker)) failures.push(`Passagem de ano não contém: ${marker}`);
}

const thirdYear = await readFile("packages/narrative/src/packs/prologue/third-year.ts", "utf8");
for (const marker of [
  "prologue.third-year-deadline",
  "prologue.third-year-return",
  "prologue.third-year-schedule-conflict",
  "prologue.third-year-health",
  "prologue.last-ordinary-day",
  "prologue.graduation",
  "completedTwoYearSchool"
]) {
  if (!thirdYear.includes(marker)) failures.push(`Terceiro ano não contém: ${marker}`);
}

const engine = await readFile("packages/game-engine/src/game.ts", "utf8");
for (const marker of [
  "migrateCompatibleContent",
  "fromContentVersions",
  "completionNodeIds",
  "resumeNodeId",
  "candidate.history"
]) {
  if (!engine.includes(marker)) failures.push(`Migração compatível não contém: ${marker}`);
}

const tests = await readFile("packages/narrative/tests/integrity.test.ts", "utf8");
for (const marker of [
  "Tempo retrocedeu",
  "não reutiliza nome",
  "contexto antes da decisão",
  "25",
  "activity === \"Apresentar o trabalho\"",
  "prologue.vacation-transition",
  "prologue.third-year-return",
  "prologue.graduation",
  "preserva pessoas, memórias e recursos",
  "confirma respeitosamente"
]) {
  if (!tests.includes(marker)) failures.push(`Testes canônicos não cobrem: ${marker}`);
}

const e2e = await readFile("apps/web/tests/e2e/game.spec.ts", "utf8");
for (const marker of [
  "Quando a escola some",
  "A cadeira que ficou vazia",
  "Alguém lembra",
  "O último dia comum",
  "Formatura",
  "Do lado de fora do portão",
  "page.reload"
]) {
  if (!e2e.includes(marker)) failures.push(`E2E dos dois anos não contém: ${marker}`);
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
  "aproximadamente 16 anos · 2º ano do Ensino Médio",
  "atravesse dois anos do Ensino Médio",
  "migratedToTwoYearPrologue",
  "pessoas e lembranças compatíveis foram preservadas",
  "person-context",
  "Possível interesse romântico",
  "pack.presentation",
  "Object.entries(state.knowledge)"
]) {
  if (!shell.includes(marker)) failures.push(`Interface do prólogo não contém: ${marker}`);
}

const prologuePack = await readFile("packages/narrative/src/packs/prologue/index.ts", "utf8");
for (const marker of [
  "prologue-2.0",
  "twoYearTransitionNodes",
  "thirdYearNodes",
  "contentMigration",
  "footballLifeOwned",
  "Reputação na escola",
  "knowledgeLabels",
  "locationLabels",
  "initialKnowledge"
]) {
  if (!prologuePack.includes(marker)) failures.push(`Pacote do prólogo não contém: ${marker}`);
}

const endings = await readFile("packages/narrative/src/packs/prologue/endings.ts", "utf8");
for (const marker of [
  "ending.football",
  "prologue.confirm-technical",
  "continuará disponível em novas vidas",
  "completedSchoolPrologue"
]) {
  if (!endings.includes(marker)) failures.push(`Transição pós-escola não contém: ${marker}`);
}

const architecture = await readFile("docs/NARRATIVE_PACKAGE_ARCHITECTURE.md", "utf8");
for (const marker of [
  "Nova profissão significa",
  "Controle de bola",
  "A interface não mantém catálogos próprios"
]) {
  if (!architecture.includes(marker)) failures.push(`Arquitetura canônica não contém: ${marker}`);
}

const bible = await readFile("docs/NARRATIVE_BIBLE.md", "utf8");
for (const marker of [
  "Narração direta na ação",
  "Convergência com marcas",
  "Modelo universal de cena",
  "Rubrica de avaliação de cena"
]) {
  if (!bible.includes(marker)) failures.push(`Bíblia narrativa não contém: ${marker}`);
}

if (failures.length > 0) {
  console.error("Auditoria do Prólogo Canônico reprovada:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Auditoria do Prólogo Canônico aprovada.");
console.log("Dois anos escolares, migração de saves, retorno de memórias, formatura, escolha pós-escola e modularidade profissional foram verificados.");
