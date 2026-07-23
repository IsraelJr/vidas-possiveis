# Política de uso econômico do GitHub Actions

## Objetivo

Usar GitHub Actions somente quando a tarefa depende do contexto do repositório, de pull requests, de commits, de status checks ou de auditoria vinculada a um SHA.

O projeto não usará Actions como scheduler genérico, fila, banco de estado, mecanismo de polling prolongado ou substituto do backend.

## Inventário atual

| Workflow | Finalidade | Classificação | Gatilhos |
|---|---|---|---|
| `.github/workflows/ci.yml` | Validar código e o vertical slice | Essencial no GitHub Actions | Pull request, push em `main` e execução manual |

Não existem workflows de cron, deploy, recovery ou processamento de negócio.

## Antes da otimização

A CI possuía dois jobs independentes:

- `validate`;
- `e2e`.

Cada job repetia:

- checkout;
- setup do pnpm;
- setup do Node.js;
- instalação completa das dependências.

Além disso, o workflow reagia simultaneamente a:

- `pull_request`;
- `push` em `agent/**`.

Com um PR aberto, um único commit poderia produzir duas execuções completas.

Teto configurado anterior:

```text
validate: até 20 minutos
e2e: até 20 minutos
execução duplicada por commit de PR: até 80 minutos teóricos
```

## Depois da otimização

A CI utiliza um único job sequencial.

As validações rápidas são executadas antes da instalação do Chromium e do E2E. Se lint, tipagem, testes, build ou auditoria falharem, a etapa mais cara não é iniciada.

Controles aplicados:

- `push` somente em `main`;
- `pull_request` para branches de desenvolvimento;
- execução manual por `workflow_dispatch`;
- mudanças exclusivamente documentais ignoradas;
- `concurrency` com cancelamento da execução anterior;
- uma única instalação de dependências;
- cache do store do pnpm;
- checkout raso;
- timeout total de 25 minutos;
- auditoria automática da política.

Teto configurado novo:

```text
uma execução por commit de PR: até 25 minutos teóricos
```

A redução teórica do pior caso por commit de PR é de aproximadamente 68,75%:

```text
80 minutos → 25 minutos
```

Na prática, a economia esperada também vem do cancelamento de execuções antigas e do encerramento antes do E2E quando uma validação rápida falha.

## Quando usar GitHub Actions

- lint;
- typecheck;
- testes unitários;
- testes de integração ligados ao código;
- build de validação;
- integridade da narrativa e dos schemas;
- auditoria arquitetural;
- E2E do vertical slice;
- checks obrigatórios antes do merge;
- auditoria curta vinculada a um commit ou release.

## Quando não usar GitHub Actions

- cron da economia ou do mundo do jogo;
- recuperação de energia por tempo real;
- eventos globais;
- filas de vidas assíncronas;
- polling prolongado;
- espera por deploy;
- processamento narrativo contínuo;
- analytics;
- armazenamento de checkpoint operacional;
- commits automáticos para provocar novas execuções;
- tarefas que pertencem ao backend, Firebase, Vercel Cron ou ferramentas administrativas.

## Limites obrigatórios

- timeout máximo padrão: 30 minutos;
- `sleep` máximo: 60 segundos;
- nenhuma escrita automática em `main`;
- nenhuma rotina `schedule` sem revisão arquitetural explícita;
- nenhuma instalação duplicada no mesmo workflow;
- nenhuma execução por `push` em branches já cobertas por pull request;
- artefatos somente quando houver evidência que não possa ser registrada de forma mais econômica.

## Processos pesados futuros

Backtests, simulações Monte Carlo e validações de milhares de vidas deverão ser executados preferencialmente:

1. localmente durante desenvolvimento;
2. em um serviço de backend ou job dedicado;
3. manualmente em Actions somente quando a evidência precisar estar vinculada ao SHA.

Quando permanecerem no GitHub Actions, deverão possuir:

- gatilho manual ou condicional;
- amostra reduzida no PR;
- execução completa somente antes de release;
- timeout documentado;
- idempotência;
- ausência de polling prolongado;
- ausência de commits de retry.

## Auditoria automática

Executar:

```bash
pnpm audit:actions
```

A auditoria reprova workflows com:

- timeout acima de 30 minutos;
- `sleep` acima de 60 segundos;
- push automático em `main`;
- cron;
- mais de uma instalação do pnpm;
- ausência de cancelamento de concorrência;
- retorno do gatilho redundante em `agent/**`.

## Pendência conhecida

O projeto ainda não possui `pnpm-lock.yaml`, pois o ambiente de implementação não teve acesso ao registry do npm. Após a primeira instalação válida, o lockfile deverá ser versionado e a CI deverá trocar para:

```bash
pnpm install --frozen-lockfile --prefer-offline
```
