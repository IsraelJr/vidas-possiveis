import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "src/game.ts",
  "src/app/page.tsx",
  "src/app/layout.tsx",
  "src/app/globals.css",
  "tests/game.test.ts",
  "e2e/game.spec.ts",
  "playwright.config.ts",
  ".github/workflows/ci.yml",
  "docs/SPRINT_0.md"
];

const failures = [];

for (const file of requiredFiles) {
  try {
    await access(file);
  } catch {
    failures.push(`Arquivo obrigatório ausente: ${file}`);
  }
}

const page = await readFile("src/app/page.tsx", "utf8");

for (const marker of [
  'data-testid="game-clock"',
  "Próximo compromisso",
  "Local:"
]) {
  if (!page.includes(marker)) {
    failures.push(`Relógio sem marcador obrigatório: ${marker}`);
  }
}

const workflow = await readFile(".github/workflows/ci.yml", "utf8");

for (const command of [
  "pnpm lint",
  "pnpm typecheck",
  "pnpm test",
  "pnpm build",
  "pnpm test:e2e"
]) {
  if (!workflow.includes(command)) {
    failures.push(`CI não executa: ${command}`);
  }
}

if (failures.length > 0) {
  console.error("Auditoria da Sprint 0 reprovada:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Auditoria da Sprint 0 aprovada.");
console.log(`Arquivos obrigatórios verificados: ${requiredFiles.length}`);
