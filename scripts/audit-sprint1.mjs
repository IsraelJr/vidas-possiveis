import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";

const requiredFiles = [
  "packages/game-engine/src/identity.ts",
  "packages/game-engine/src/types.ts",
  "packages/game-engine/src/game.ts",
  "packages/narrative/src/content.ts",
  "packages/narrative/tests/integrity.test.ts",
  "apps/web/src/components/game-shell.tsx",
  "apps/web/tests/e2e/game.spec.ts",
  "docs/HANDOFF_REFERENCE.md",
  "docs/PROLOGUE_CANONICAL.md"
];
const failures = [];
for (const file of requiredFiles) try { await access(file, constants.R_OK); } catch { failures.push(`Arquivo obrigatório ausente: ${file}`); }

const identity = await readFile("packages/game-engine/src/identity.ts", "utf8");
for (const marker of ["Tamires", "Solange", "Paula", "Julia", "Miguel", "Israel", "Luiz", "Rodrigo", "Carlos", "school.groupMate", "helped-before", "provoked-before", "usually-responsible", "repeated-delays"]) if (!identity.includes(marker)) failures.push(`Identidade não contém: ${marker}`);

const types = await readFile("packages/game-engine/src/types.ts", "utf8");
for (const marker of ["schemaVersion: 3", "IdentityRegistryEntry", "PersonCategory", "NarrativePackage", "moduleId", "contextPersonId"]) if (!types.includes(marker)) failures.push(`Contrato não contém: ${marker}`);

const narrative = await readFile("packages/narrative/src/content.ts", "utf8");
for (const marker of ["school-routine", "group-project", "food-and-money", "physical-school", "academic-event", "social-life", "conflict", "presentation", "modular-year", "formation-bridge", "contextPersonId", "prologue.wait-presentation"]) if (!narrative.includes(marker)) failures.push(`Narrativa modular não contém: ${marker}`);

const shell = await readFile("apps/web/src/components/game-shell.tsx", "utf8");
for (const marker of ["Quem é", "Pessoas na sua vida", "Pessoa conhecida", "Pessoa importante", "Autocontrole", "Informações adicionais"]) if (!shell.includes(marker)) failures.push(`Interface não contém: ${marker}`);

for (const forbidden of ["O save foi registrado", "Detalhes de teste", "Amiga da escola"]) if (shell.includes(forbidden)) failures.push(`Texto antigo ainda presente: ${forbidden}`);

if (failures.length) { console.error("Auditoria do prólogo canônico reprovada:"); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Auditoria do prólogo canônico aprovada.");
console.log(`Arquivos obrigatórios verificados: ${requiredFiles.length}`);
