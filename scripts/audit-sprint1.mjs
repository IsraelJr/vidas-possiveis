import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";

const requiredFiles = [
  "packages/game-engine/src/types.ts",
  "packages/game-engine/src/game.ts",
  "packages/game-engine/src/effects.ts",
  "packages/game-engine/tests/game.test.ts",
  "packages/narrative/src/content.ts",
  "packages/narrative/src/schema.ts",
  "packages/narrative/tests/integrity.test.ts",
  "apps/web/src/components/game-shell.tsx",
  "apps/web/tests/e2e/game.spec.ts",
  "docs/HANDOFF_REFERENCE.md"
];

const failures = [];
for (const file of requiredFiles) {
  try {
    await access(file, constants.R_OK);
  } catch {
    failures.push(`Arquivo obrigatório ausente: ${file}`);
  }
}

const types = await readFile("packages/game-engine/src/types.ts", "utf8");
for (const marker of [
  "relationships",
  "schedule_consequence",
  "StorySkillCheck",
  "TriggeredConsequence",
  "schemaVersion: 2"
]) {
  if (!types.includes(marker)) failures.push(`Contrato da Sprint 1 não contém: ${marker}`);
}

const game = await readFile("packages/game-engine/src/game.ts", "utf8");
for (const marker of ["migrateGameState", "runSkillCheck", "processDueConsequences", "rollIndex"]) {
  if (!game.includes(marker)) failures.push(`Motor da Sprint 1 não contém: ${marker}`);
}

const narrative = await readFile("packages/narrative/src/content.ts", "utf8");
for (const marker of [
  "school.group-conflict",
  "school.presentation",
  "schedule_consequence",
  "school.formation-choice",
  "ending.technical",
  "ending.university",
  "ending.online-work",
  "ending.self-study"
]) {
  if (!narrative.includes(marker)) failures.push(`Narrativa da Sprint 1 não contém: ${marker}`);
}

const gameShell = await readFile("apps/web/src/components/game-shell.tsx", "utf8");
for (const marker of [
  "migrateGameState",
  'data-testid="skill-result"',
  'data-testid="triggered-consequence"',
  "Pessoas importantes",
  "Esta etapa da sua história chegou ao fim."
]) {
  if (!gameShell.includes(marker)) failures.push(`Interface da Sprint 1 não contém: ${marker}`);
}

for (const forbidden of [
  "O save foi registrado e o relógio reflete o tempo consumido.",
  "SPRINT 0 · VERTICAL SLICE TEXTUAL",
  "Save local:"
]) {
  if (gameShell.includes(forbidden)) failures.push(`Texto técnico ainda visível ao jogador: ${forbidden}`);
}

const e2e = await readFile("apps/web/tests/e2e/game.spec.ts", "utf8");
for (const marker of [
  "A promessa da noite anterior",
  "skill-result",
  "O último dia de aula",
  "Aprender fazendo",
  "page.reload()"
]) {
  if (!e2e.includes(marker)) failures.push(`E2E da Sprint 1 não cobre: ${marker}`);
}

if (failures.length > 0) {
  console.error("Auditoria da Sprint 1 reprovada:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Auditoria da Sprint 1 aprovada.");
console.log(`Arquivos obrigatórios verificados: ${requiredFiles.length}`);
console.log("Prólogo, habilidade, relação, consequência futura, formação e linguagem do jogador verificados.");
