# Sprint 0 — Fundação do MVP textual

## Fonte canônica

Implementação baseada no Handoff canônico v0.3.0 do projeto Vidas Possíveis.

## Objetivo

Provar que o motor produz uma vida coerente antes da camada visual.

## Entregas

- aplicação Next.js em TypeScript estrito;
- domínio independente da interface em `src/game.ts`;
- narrativa versionada e validada por schema;
- persistência local em IndexedDB;
- criação básica do personagem;
- origem socioeconômica afetando recursos, sem definir inteligência inata;
- primeira decisão escolar;
- atributos, condições, efeitos e rolagem percentual determinística;
- relógio permanentemente perceptível;
- avanço explícito do horário após ações;
- painel de atributos, consequências e depuração;
- testes unitários, E2E, CI e auditoria automatizada.

## Critérios do relógio

A interface mostra continuamente:

- data;
- horário atual;
- localização;
- próximo compromisso.

Toda ação narrativa relevante que consome tempo registra no histórico o horário anterior e o horário resultante.

## Fora do escopo

- Firebase;
- imagens e backgrounds;
- Android e iOS;
- monetização e energia narrativa;
- eventos globais e vidas cruzadas;
- múltiplas profissões;
- narrativa produzida por IA em tempo real.

## Validação

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm audit:sprint0
```

## Limitações conhecidas

- O vertical slice contém somente o primeiro evento escolar.
- O sistema percentual está disponível no motor, mas ainda não participa da cena inicial.
- A sincronização em nuvem permanece para sprint posterior.
