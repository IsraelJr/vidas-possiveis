# Vidas Possíveis

RPG narrativo textual de vida e carreira. O jogador constrói sua trajetória desde a escola, administra tempo, energia e recursos, e enfrenta consequências profissionais e pessoais.

## Sprint 0

A fundação do MVP entrega:

- Next.js, React e TypeScript estrito;
- motor de domínio independente da interface;
- relógio, data, localização e próximo compromisso sempre perceptíveis;
- criação básica da vida e origem socioeconômica;
- primeira cena escolar jogável;
- escolhas condicionais, efeitos imutáveis e avanço explícito do tempo;
- teste percentual determinístico por seed;
- save automático no IndexedDB;
- painel de atributos, consequências e depuração;
- testes unitários, E2E, CI e auditoria automatizada.

O escopo detalhado está em [`docs/SPRINT_0.md`](docs/SPRINT_0.md).

## Executar localmente

Requisitos:

- Node.js 22 ou superior;
- pnpm 10.

```bash
corepack enable
pnpm install
pnpm dev
```

Abra `http://localhost:3000`.

## Validar

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
pnpm audit:sprint0
```

## Arquitetura inicial

```text
src/game.ts             motor, narrativa e persistência
src/app/                interface Next.js
tests/                  testes unitários e de integridade
e2e/                    jornada jogável no navegador
scripts/                 auditoria automatizada
docs/                    escopo e evidências da Sprint 0
```

## Fora da Sprint 0

Firebase, ilustrações, aplicativos móveis, monetização, eventos globais, vidas cruzadas e múltiplas profissões permanecem fora deste recorte.
