import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";

const requiredFiles = [
  "packages/game-engine/src/types.ts",
  "packages/game-engine/src/game.ts",
  "packages/game-engine/src/effects.ts",
  "packages/narrative/src/pack.ts",
  "packages/narrative/src/registry.ts",
  "packages/narrative/src/templates.ts",
  "packages/narrative/src/validation.ts",
  "apps/web/src/components/game-shell.tsx",
  "apps/web/tests/e2e/game.spec.ts"
];
const failures = [];
for (const file of requiredFiles) {
  try { await access(file, constants.R_OK); }
  catch { failures.push(`Arquivo obrigatório ausente: ${file}`); }
}

const types = await readFile("packages/game-engine/src/types.ts", "utf8");
for (const marker of [
  "schemaVersion: 3",
  "ATTRIBUTE_KEYS",
  "CONDITION_KEYS",
  "KnowledgeKey = string",
  "LocationId = string",
  "PersonState",
  "ScheduledConsequence"
]) {
  if (!types.includes(marker)) failures.push(`Contrato evoluído não contém: ${marker}`);
}

const shell = [
  await readFile("apps/web/src/components/game-shell.tsx", "utf8"),
  await readFile("apps/web/src/components/game-presentation.ts", "utf8")
].join("\n");
for (const marker of [
  "Atributos",
  "Condições do momento",
  "Conhecimentos",
  "Pessoas da sua história",
  "Quem é",
  "Escolhas guardadas"
]) {
  if (!shell.includes(marker)) failures.push(`Interface evoluída não contém: ${marker}`);
}
for (const forbidden of ["Pessoas importantes</h2>", "Disciplina", "Save local:"]) {
  if (shell.includes(forbidden)) failures.push(`Conceito substituído ainda aparece: ${forbidden}`);
}

if (failures.length > 0) {
  console.error("Auditoria de compatibilidade da Sprint 1 reprovada:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Auditoria de compatibilidade da Sprint 1 aprovada.");
