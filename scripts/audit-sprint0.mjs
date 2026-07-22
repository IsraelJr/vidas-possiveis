import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";

const requiredFiles = [
  "apps/web/src/app/page.tsx",
  "apps/web/src/components/game-shell.tsx",
  "packages/game-engine/src/clock.ts",
  "packages/game-engine/src/effects.ts",
  "packages/game-engine/src/skill-check.ts",
  "packages/narrative/src/content.ts",
  "packages/persistence/src/indexed-db-save-repository.ts",
  ".github/workflows/ci.yml",
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

const gameShell = await readFile("apps/web/src/components/game-shell.tsx", "utf8");
for (const marker of ['data-testid="game-clock"', "Próximo compromisso", "Local:"]) {
  if (!gameShell.includes(marker)) {
    failures.push(`Relógio/contexto não contém marcador obrigatório: ${marker}`);
  }
}

const workflow = await readFile(".github/workflows/ci.yml", "utf8");
for (const command of ["pnpm lint", "pnpm typecheck", "pnpm test", "pnpm build", "pnpm test:e2e"]) {
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
