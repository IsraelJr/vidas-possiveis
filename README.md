# Vidas Possíveis

RPG narrativo de vida e carreira. As Sprints 0 e 1 entregam a fundação técnica e um prólogo escolar completo, com escolhas condicionais, relações, passagem do tempo, consequências futuras e quatro primeiros caminhos de formação.

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
packages/persistence     Progresso local e contratos de persistência
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
pnpm audit:sprint1
pnpm audit:actions
pnpm test:e2e
```

A CI executa essas verificações uma vez por pull request e na `main`, com cancelamento de execuções substituídas, instalação congelada e sem cron ou tentativas baseadas em commits.

## Entrega funcional atual

- criação da vida com três origens socioeconômicas;
- sequência de 15 cenas escolares;
- relógio com data, horário, local, atividade, compromisso e tempo restante;
- acesso desigual a recursos sem atribuir inteligência à origem;
- conflito e relação persistente com Bia;
- confiança, proximidade e tensão;
- preparação, descanso e deslocamento antes da apresentação;
- teste de habilidade determinístico que altera a história;
- consequência futura de uma escolha;
- atributos, dinheiro, flags e efeitos imutáveis;
- quatro caminhos iniciais de formação;
- progresso automático e retomada após recarregar;
- migração do progresso criado na Sprint 0;
- linguagem voltada ao jogador, sem termos de desenvolvimento.

## Decisões arquiteturais

- O motor não depende de React, Next.js, Firebase ou DOM.
- O relógio é parte da mecânica e permanece visível.
- O conteúdo narrativo é validado antes da execução.
- O progresso inicial usa IndexedDB, com contrato preparado para sincronização futura.
- As gravações locais são executadas em ordem para impedir que um estado antigo substitua uma decisão recente.
- Rolagens são determinísticas por seed para permitir testes e auditoria.
- A CI usa permissões somente de leitura e gera diagnóstico apenas em falhas.

## Estado

**Sprint 1 concluída e integrada à `main` em 23/07/2026.**

A execução `30015682906` aprovou instalação congelada, lint, typecheck, 26 testes unitários e de integridade, build Next.js, três auditorias, instalação do Chromium e a jornada E2E completa.

Próxima etapa recomendada: Sprint 2 — desenvolver os diferentes caminhos de formação e fazê-los convergir para a primeira oportunidade em tecnologia.
