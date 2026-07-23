# Vidas Possíveis

RPG narrativo de vida e carreira. A Sprint 0 concluiu a fundação técnica do MVP textual com motor independente, relógio explícito, primeira cena jogável, persistência local e testes automatizados.

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
docs                     Referência canônica, políticas e auditorias
```

## Desenvolvimento

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Acesse `http://localhost:3000`.

## Validação

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm audit:sprint0
pnpm audit:actions
pnpm test:e2e
```

A CI executa essas verificações uma vez por pull request e na `main`, com cancelamento de execuções substituídas, instalação congelada e sem cron ou retries baseados em commits.

## Entrega funcional da Sprint 0

- criação básica da vida e três origens socioeconômicas;
- primeira decisão escolar contextualizada;
- relógio persistente com data, horário, local, atividade atual, próximo compromisso e tempo restante;
- atributos, dinheiro, flags e efeitos imutáveis;
- opções condicionais com motivo de bloqueio no painel técnico;
- consequências visíveis da última escolha;
- save automático observável e gravações serializadas no IndexedDB;
- restauração da vida após recarregar a página;
- rolagens determinísticas por seed;
- lockfile versionado;
- auditoria estrutural e política econômica de GitHub Actions.

## Decisões arquiteturais

- O motor não depende de React, Next.js, Firebase ou DOM.
- O relógio é parte da mecânica e permanece visível.
- O conteúdo narrativo é validado antes da execução.
- O save inicial usa IndexedDB, com contrato preparado para sincronização futura.
- As gravações locais são executadas em ordem para impedir que um estado antigo substitua uma decisão recente.
- Rolagens são determinísticas por seed para permitir testes e auditoria.
- A CI usa permissões somente de leitura e gera diagnóstico apenas em falhas.

## Estado

**Sprint 0 concluída e integrada à `main` em 23/07/2026.**

A execução definitiva `29978807024` aprovou instalação congelada, lint, typecheck, 18 testes unitários e de integridade, build Next.js, duas auditorias, instalação do Chromium e a jornada E2E completa.

Próxima etapa: Sprint 1 — ampliar o vertical slice narrativo do prólogo escolar.
