# Auditoria da Sprint 0

## Resultado executivo

**Sprint 0 concluída, validada e integrada à `main` em 23/07/2026.**

- PR: `#1`;
- SHA validado no PR: `2e369c5cd8561305ef30037c079238a945795076`;
- execução definitiva da CI: `29978807024`;
- commit squash na `main`: `21fad7b19373f789116bd2d602c491a69e795b8f`;
- issue de infraestrutura `#2`: encerrada.

## Escopo entregue

- monorepo com pnpm workspaces;
- aplicação Next.js;
- motor de domínio puro e independente;
- narrativa validada por Zod;
- persistência IndexedDB por contrato;
- primeira cena escolar jogável;
- três origens socioeconômicas;
- atributos, dinheiro, flags e efeitos imutáveis;
- relógio e calendário;
- data, horário, local e atividade atual sempre perceptíveis;
- próximo compromisso e tempo restante;
- condições e justificativa de escolhas bloqueadas;
- consequências visíveis da última escolha;
- rolagem percentual determinística;
- save automático observável;
- fila serial para impedir gravações fora de ordem;
- retomada exata após recarregar;
- lockfile versionado;
- CI econômica e auditada.

## Critérios de aceite

| Critério | Estado | Evidência |
|---|---|---|
| Monorepo modular | Aprovado | `apps/web` e três pacotes independentes |
| Motor sem React, Next.js ou Firebase | Aprovado | typecheck e testes do `game-engine` |
| Criação de vida | Aprovado | nome, apresentação e três origens |
| Primeira cena jogável | Aprovado | trabalho escolar contextualizado |
| Relógio perceptível | Aprovado | data, hora, local, atividade e compromisso |
| Tempo até compromisso | Aprovado | cálculo entre dias e E2E |
| Avanço explícito | Aprovado | `16:00 → 17:30` |
| Opções condicionais | Aprovado | computador bloqueado na origem de baixa renda |
| Motivo de bloqueio | Aprovado | painel técnico e teste unitário |
| Efeitos e limites | Aprovado | testes do motor |
| Rolagem reproduzível | Aprovado | mesma seed produz mesmo resultado |
| Save automático | Aprovado | estados `Salvando…`, `Salvo` e erro |
| Ordem das gravações | Aprovado | `SerialOperationQueue` e testes |
| Retomada | Aprovado | reload no Playwright |
| Lockfile | Aprovado | `pnpm-lock.yaml` versionado |
| Instalação reproduzível | Aprovado | `pnpm install --frozen-lockfile` |
| Lint e typecheck | Aprovado | CI `29978807024` |
| Testes unitários | Aprovado | 18 testes |
| Build Next.js | Aprovado | CI `29978807024` |
| Auditorias | Aprovado | `audit:sprint0` e `audit:actions` |
| E2E | Aprovado | jornada completa no Chromium |

## Evidência da CI definitiva

A execução `29978807024` aprovou, na ordem:

1. checkout raso;
2. setup do pnpm e Node.js 22;
3. cache por `pnpm-lock.yaml`;
4. instalação congelada;
5. lint;
6. typecheck de todos os workspaces;
7. 18 testes unitários e de integridade;
8. build Next.js;
9. auditoria da Sprint 0;
10. auditoria de consumo de GitHub Actions;
11. instalação do Chromium;
12. E2E de criação, relógio, bloqueio, escolha, save e retomada.

Nenhum artefato de diagnóstico foi gerado porque a execução terminou verde.

## Cobertura automatizada

### Motor

- mudança de dia;
- intervalo positivo e negativo entre relógios;
- formatação de horário;
- aplicação imutável de efeitos;
- limites dos atributos;
- filtragem de opções;
- explicação de condições não atendidas;
- transição narrativa;
- rolagem determinística e cinco resultados.

### Narrativa

- schema válido;
- IDs únicos;
- destinos existentes;
- finais alcançáveis no recorte.

### Persistência

- contrato do repositório em memória;
- gravações executadas em ordem;
- fila continua após operação rejeitada;
- IndexedDB exercitado pela jornada E2E.

### Jornada E2E

1. cria personagem de baixa renda;
2. confirma relógio às `16:00`;
3. confirma `16h` até o compromisso;
4. aguarda save `Salvo`;
5. verifica motivo da opção bloqueada;
6. escolhe a biblioteca;
7. confirma `17:30`;
8. confirma `14h 30min` restantes;
9. aguarda o save mais recente;
10. recarrega a página;
11. restaura nó, horário e estado.

## Política econômica de GitHub Actions

A CI final possui:

- execução em `pull_request`;
- `push` somente na `main`;
- alterações exclusivamente documentais ignoradas;
- cancelamento de execuções substituídas;
- um job e uma instalação;
- cache por lockfile;
- timeout máximo de 25 minutos;
- permissões somente de leitura;
- diagnóstico somente em falhas, com retenção de um dia;
- proibição automatizada de cron, sleeps longos, pushes automáticos, instalação não congelada e retenção excessiva.

Estimativa teórica do pior caso por commit com PR aberto:

```text
Antes: até 80 minutos
Depois: até 25 minutos
Redução: aproximadamente 68,75%
```

## Correções encontradas durante a auditoria

- migração do ESLint 9 para `FlatCompat` compatível com Next.js 15;
- separação dos testes Vitest e Playwright;
- inclusão explícita de `@eslint/eslintrc`;
- versionamento do `pnpm-lock.yaml`;
- instalação congelada;
- diagnóstico de falhas por artefato temporário;
- cálculo do tempo até compromisso;
- justificativa de escolha bloqueada;
- estado observável do save;
- proteção contra confirmação de save antigo;
- serialização das operações IndexedDB.

## Fora do escopo da Sprint 0

- Firebase;
- sincronização entre dispositivos;
- eventos globais;
- energia narrativa;
- ilustrações e backgrounds;
- Android e iOS;
- monetização;
- múltiplas profissões;
- campanha completa do MVP.

## Próxima etapa

Sprint 1: ampliar o prólogo escolar em um vertical slice narrativo maior, preservando todos os contratos técnicos e guardrails aprovados nesta Sprint.
