# Vidas Possíveis

RPG narrativo de vida e carreira. A Sprint 0 entrega a fundação técnica do MVP textual com motor independente, relógio explícito, primeira cena jogável, persistência local e testes automatizados.

## Stack

- Next.js + React + TypeScript
- pnpm workspaces
- Vitest
- Playwright
- Zod
- IndexedDB

## Estrutura

```text
apps/web                 Interface Next.js
packages/game-engine     Regras puras do domínio
packages/narrative       Conteúdo e validação narrativa
packages/persistence     Save local e contratos de persistência
docs                     referência canônica e auditorias
```

## Desenvolvimento

```bash
corepack enable
pnpm install
pnpm dev
```

Acesse `http://localhost:3000`.

## Validação

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm audit:sprint0
```

## Decisões arquiteturais

- O motor não depende de React, Next.js, Firebase ou DOM.
- O relógio é parte da mecânica e permanece visível.
- O conteúdo narrativo é validado antes da execução.
- O save inicial usa IndexedDB, com contrato preparado para sincronização futura.
- Rolagens são determinísticas por seed para permitir testes e auditoria.
