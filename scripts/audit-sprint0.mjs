import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";

const requiredFiles = [
  "pnpm-lock.yaml", "apps/web/src/components/game-shell.tsx", "apps/web/tests/e2e/game.spec.ts",
  "packages/game-engine/src/clock.ts", "packages/game-engine/src/effects.ts", "packages/game-engine/src/game.ts",
  "packages/narrative/src/content.ts", "packages/persistence/src/indexed-db-save-repository.ts",
  ".github/workflows/ci.yml", "docs/HANDOFF_REFERENCE.md", "scripts/audit-actions-usage.mjs"
];
const failures = [];
for (const file of requiredFiles) try { await access(file, constants.R_OK); } catch { failures.push(`Arquivo obrigatório ausente: ${file}`); }

const shell = await readFile("apps/web/src/components/game-shell.tsx", "utf8");
for (const marker of ['data-testid="game-clock"', 'data-testid="time-until-commitment"', 'data-testid="save-status"', "Atividade atual", "Próximo compromisso", "Tempo até compromisso"]) if (!shell.includes(marker)) failures.push(`Interface não contém: ${marker}`);

const clock = await readFile("packages/game-engine/src/clock.ts", "utf8");
for (const marker of ["advanceClock", "minutesBetweenClocks", "formatDatePtBr", "formatTime"]) if (!clock.includes(marker)) failures.push(`Motor de tempo não contém: ${marker}`);

const game = await readFile("packages/game-engine/src/game.ts", "utf8");
for (const marker of ["getChoiceAvailability", "chooseStoryOption", "migrateGameState"]) if (!game.includes(marker)) failures.push(`Motor narrativo não contém: ${marker}`);

const workflow = await readFile(".github/workflows/ci.yml", "utf8");
for (const command of ["pnpm install --frozen-lockfile", "pnpm lint", "pnpm typecheck", "pnpm test", "pnpm build", "pnpm audit:sprint0", "pnpm audit:sprint1", "pnpm audit:actions", "pnpm test:e2e"]) if (!workflow.includes(command)) failures.push(`CI não executa: ${command}`);

if (failures.length) { console.error("Auditoria da fundação reprovada:"); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Auditoria da fundação aprovada.");
console.log(`Arquivos obrigatórios verificados: ${requiredFiles.length}`);
