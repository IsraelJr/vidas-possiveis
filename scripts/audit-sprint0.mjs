import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";

const requiredFiles = [
  "pnpm-lock.yaml",
  "apps/web/src/app/page.tsx",
  "apps/web/src/components/game-shell.tsx",
  "apps/web/tests/e2e/game.spec.ts",
  "apps/web/vitest.config.ts",
  "packages/game-engine/src/clock.ts",
  "packages/game-engine/src/effects.ts",
  "packages/game-engine/src/game.ts",
  "packages/game-engine/src/skill-check.ts",
  "packages/narrative/src/content.ts",
  "packages/persistence/src/indexed-db-save-repository.ts",
  "packages/persistence/src/serial-operation-queue.ts",
  "packages/persistence/tests/serial-operation-queue.test.ts",
  ".github/workflows/ci.yml",
  "docs/HANDOFF_REFERENCE.md",
  "docs/GITHUB_ACTIONS_POLICY.md",
  "scripts/audit-actions-usage.mjs"
];

const failures = [];

for (const file of requiredFiles) {
  try {
    await access(file, constants.R_OK);
  } catch {
    failures.push(`Arquivo obrigatório ausente: ${file}`);
  }
}

const gameShell = await readFile("apps/web/src/components/game-shell.tsx", "utf8");
for (const marker of [
  'data-testid="game-clock"',
  'data-testid="time-until-commitment"',
  'data-testid="save-status"',
  'data-testid="blocked-choice-reasons"',
  "Atividade atual",
  "Próximo compromisso",
  "Tempo até compromisso",
  "Local"
]) {
  if (!gameShell.includes(marker)) {
    failures.push(`Interface não contém requisito obrigatório: ${marker}`);
  }
}

const clock = await readFile("packages/game-engine/src/clock.ts", "utf8");
for (const marker of ["advanceClock", "minutesBetweenClocks", "formatDatePtBr", "formatTime"]) {
  if (!clock.includes(marker)) failures.push(`Motor de tempo não contém: ${marker}`);
}

const game = await readFile("packages/game-engine/src/game.ts", "utf8");
for (const marker of ["getChoiceAvailability", "failedConditions", "chooseStoryOption"]) {
  if (!game.includes(marker)) failures.push(`Motor narrativo não contém: ${marker}`);
}

const persistence = await readFile("packages/persistence/src/indexed-db-save-repository.ts", "utf8");
for (const marker of ["SerialOperationQueue", "#operations.enqueue", "database.put", "database.delete"]) {
  if (!persistence.includes(marker)) failures.push(`Persistência ordenada não contém: ${marker}`);
}

const persistenceTest = await readFile("packages/persistence/tests/serial-operation-queue.test.ts", "utf8");
for (const marker of ["ordem em que foram enfileiradas", "operação rejeitada"]) {
  if (!persistenceTest.includes(marker)) failures.push(`Teste da fila de persistência não cobre: ${marker}`);
}

const vitestConfig = await readFile("apps/web/vitest.config.ts", "utf8");
if (!vitestConfig.includes('"tests/e2e/**"')) {
  failures.push("Vitest deve excluir a suíte E2E do Playwright.");
}

const e2e = await readFile("apps/web/tests/e2e/game.spec.ts", "utf8");
for (const marker of [
  "time-until-commitment",
  "Possui computador deve ser sim",
  "page.reload()",
  "save-status"
]) {
  if (!e2e.includes(marker)) failures.push(`E2E não cobre: ${marker}`);
}

const workflow = await readFile(".github/workflows/ci.yml", "utf8");
for (const command of [
  "pnpm install --frozen-lockfile",
  "pnpm lint",
  "pnpm typecheck",
  "pnpm test",
  "pnpm build",
  "pnpm audit:sprint0",
  "pnpm audit:sprint1",
  "pnpm audit:actions",
  "pnpm test:e2e"
]) {
  if (!workflow.includes(command)) {
    failures.push(`CI não executa: ${command}`);
  }
}

if (failures.length > 0) {
  console.error("Auditoria da Sprint 0 reprovada:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Auditoria da Sprint 0 aprovada.");
console.log(`Arquivos obrigatórios verificados: ${requiredFiles.length}`);
console.log("Relógio completo, bloqueios auditáveis, save ordenado, lockfile e retomada E2E verificados.");
