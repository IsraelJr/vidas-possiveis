# Vidas Possíveis

RPG narrativo de vida, relações, formação e carreira. O projeto possui um prólogo escolar jogável e uma arquitetura de pacotes que permite criar novas vidas profissionais sem reescrever o motor.

## Stack

- Next.js + React + TypeScript
- pnpm workspaces
- Vitest
- Playwright
- Zod
- IndexedDB

## Estrutura

```text
apps/web                 Interface genérica
packages/game-engine     Tempo, estado, escolhas, efeitos, pessoas e memórias
packages/narrative       Pacotes, módulos, cenas e validação
packages/persistence     Progresso local e contratos de persistência
docs                     Regras canônicas e auditorias
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
pnpm audit:prologue
pnpm audit:actions
pnpm test:e2e
```

A CI executa uma validação por pull request e na `main`, cancela execuções substituídas, usa instalação congelada e não possui cron de negócio.

## Prólogo escolar

- personagem de classe média com 17 anos;
- colega principal sorteado deterministicamente;
- nomes Tamires, Solange, Paula, Julia, Miguel, Israel, Luiz, Rodrigo e Carlos;
- quatro históricos possíveis;
- nomes reservados durante toda a vida;
- contexto “Quem é esta pessoa?”;
- merenda e lanchonete;
- ônibus e carro por aplicativo;
- Educação Física;
- aula vaga ou professor substituto;
- prova em dupla;
- trabalho em grupo e apresentação;
- convites sociais e responsabilidades familiares;
- intrigas, conflitos e relações;
- eventos modulares ao longo do ano;
- quatro caminhos iniciais de formação;
- progresso automático e migração de saves anteriores.

## Domínio canônico

### Atributos

Raciocínio, Percepção, Comunicação, Autocontrole, Vigor e Agilidade.

### Condições

Energia, Estresse e Saúde.

### Relacionamentos

Confiança, Proximidade e Tensão para pessoas de cena persistentes, conhecidas e importantes.

### Conhecimentos e locais

São declarados por cada pacote narrativo. O motor e a interface não possuem listas fechadas de matérias ou ambientes profissionais.

## Pacotes narrativos

Um `NarrativePack` contém:

- id e versão;
- setup inicial;
- módulos e cenas;
- conhecimentos e locais;
- rótulos de apresentação;
- pessoas e variáveis;
- caminhos finais.

O teste de modularidade cria e executa uma pequena vida de jogador de futebol com Centro de treinamento, Vestiário, Controle de bola e Tática, usando o mesmo motor do prólogo escolar.

## Decisões arquiteturais

- O motor não depende de React, Next.js, Firebase, DOM, escola ou profissão.
- A interface consulta o pacote atual para exibir locais, conhecimentos e reputação.
- O relógio nunca retrocede e toda ação relevante ocupa tempo.
- O conteúdo é validado antes da execução.
- A persistência usa IndexedDB e serializa gravações.
- Geração e testes de habilidade são determinísticos por seed.
- Nova profissão significa novo pacote, não novo motor.

## Documentação obrigatória

- `docs/HANDOFF_CANONICAL.md`
- `docs/PROLOGUE_CANONICAL.md`
- `docs/NARRATIVE_PACKAGE_ARCHITECTURE.md`

## Estado

- Sprint 0: concluída;
- Sprint 1: concluída;
- Prólogo Canônico: implementado;
- consolidação modular: em auditoria final no PR #7.

O próximo passo de produto, depois da consolidação verde, é expandir os caminhos de formação e criar o catálogo de vidas/profissões.
