import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const workflowDirectory = ".github/workflows";
const entries = await readdir(workflowDirectory, { withFileTypes: true });
const workflowFiles = entries
  .filter((entry) => entry.isFile() && /\.ya?ml$/i.test(entry.name))
  .map((entry) => path.join(workflowDirectory, entry.name));

const failures = [];

if (workflowFiles.length === 0) {
  failures.push("Nenhum workflow foi encontrado em .github/workflows.");
}

for (const workflowFile of workflowFiles) {
  const source = await readFile(workflowFile, "utf8");
  const label = path.basename(workflowFile);

  for (const match of source.matchAll(/timeout-minutes:\s*(\d+)/g)) {
    const timeout = Number(match[1]);
    if (timeout > 30) {
      failures.push(`${label}: timeout de ${timeout} minutos excede o limite de 30 minutos.`);
    }
  }

  for (const match of source.matchAll(/\bsleep\s+(\d+)\b/g)) {
    const seconds = Number(match[1]);
    if (seconds > 60) {
      failures.push(`${label}: sleep de ${seconds}s excede o limite de 60 segundos.`);
    }
  }

  if (/\bgit\s+push\b/.test(source)) {
    failures.push(`${label}: workflow não pode criar commits ou pushes automáticos.`);
  }

  if (/^\s*schedule:\s*$/m.test(source) || /^\s*-?\s*cron:\s*/m.test(source)) {
    failures.push(`${label}: cron de negócio deve ser executado fora do GitHub Actions.`);
  }

  const installs = source.match(/pnpm install/g)?.length ?? 0;
  if (installs > 1) {
    failures.push(`${label}: pnpm install aparece ${installs} vezes; reutilize uma única instalação por execução.`);
  }

  for (const match of source.matchAll(/retention-days:\s*(\d+)/g)) {
    const retentionDays = Number(match[1]);
    if (retentionDays > 7) {
      failures.push(`${label}: retenção de ${retentionDays} dias excede o padrão econômico de 7 dias.`);
    }
  }
}

const ciPath = path.join(workflowDirectory, "ci.yml");
const ci = await readFile(ciPath, "utf8");

const requiredMarkers = [
  "pull_request:",
  "workflow_dispatch:",
  "cancel-in-progress: true",
  "- main",
  '"docs/**"',
  '"**/*.md"',
  "contents: read",
  "hashFiles('pnpm-lock.yaml')",
  "pnpm install --frozen-lockfile",
  "pnpm audit:actions"
];

for (const marker of requiredMarkers) {
  if (!ci.includes(marker)) {
    failures.push(`ci.yml não contém o controle obrigatório: ${marker}`);
  }
}

if (/--no-frozen-lockfile/.test(ci)) {
  failures.push("ci.yml não pode instalar dependências sem respeitar o lockfile.");
}

if (/contents:\s*write/.test(ci)) {
  failures.push("ci.yml deve operar com permissão de conteúdo somente leitura.");
}

if (/agent\/\*\*/.test(ci)) {
  failures.push("ci.yml não pode executar push CI em agent/**; o pull_request já cobre essas branches.");
}

if (failures.length > 0) {
  console.error("Auditoria de consumo do GitHub Actions reprovada:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Auditoria de consumo do GitHub Actions aprovada.");
console.log(`Workflows verificados: ${workflowFiles.length}`);
console.log("CI somente leitura, reproduzível e sem gatilhos operacionais inadequados.");
