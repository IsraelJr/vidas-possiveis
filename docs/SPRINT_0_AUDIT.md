# Auditoria da Sprint 0

## Resultado executivo

A implementação funcional da Sprint 0 está concluída no branch do pull request.

O encerramento formal depende apenas da execução integral da pipeline remota, atualmente bloqueada porque a franquia mensal de GitHub Actions da conta foi consumida.

O PR deve permanecer em rascunho e não deve ser mesclado enquanto lint, typecheck completo, Vitest, build Next.js e Playwright não produzirem evidência verde no mesmo SHA.

## Escopo auditado

- organização por workspaces;
- motor puro e independente;
- relógio e calendário;
- cálculo do tempo até o próximo compromisso;
- atributos e efeitos imutáveis;
- condições e justificativa de opções bloqueadas;
- rolagem determinística;
- narrativa validada por schema;
- primeira cena jogável;
- relógio sempre visível;
- save observável;
- persistência IndexedDB serializada;
- retomada depois de recarregar;
- testes unitários e E2E;
- CI econômica;
- auditorias preventivas.

## Critérios de aceite

| Critério | Estado | Evidência |
|---|---|---|
| Monorepo modular | Atendido | `apps/web` e pacotes independentes |
| Motor sem React, Next.js ou Firebase | Atendido | compilação isolada do `game-engine` |
| Criação de vida | Atendido | nome, apresentação e três origens |
| Primeira cena jogável | Atendido | trabalho escolar com escolhas contextuais |
| Relógio perceptível | Atendido | data, horário, local, atividade e compromisso |
| Tempo até compromisso | Atendido | cálculo entre dias no motor |
| Avanço explícito | Atendido | `16:00 → 17:30` no fluxo da biblioteca |
| Opções condicionais | Atendido | computador próprio bloqueado para baixa renda |
| Motivo de bloqueio | Atendido | painel técnico mostra a condição não atendida |
| Atributos e efeitos | Atendido | energia, conhecimento, disciplina e estresse |
| Save automático | Atendido | status `Salvando…`, `Salvo` ou erro visível |
| Ordem das gravações | Atendido | `SerialOperationQueue` impede sobrescrita antiga |
| Retomada | Coberto por E2E | reload deve restaurar horário, nó e save |
| Rolagem reproduzível | Atendido | mesma seed produz o mesmo resultado |
| Testes e build completos | Pendente externo | GitHub Actions sem minutos disponíveis |
| Lockfile versionado | Pendente | depende da primeira instalação com acesso ao registry |

## Evidências executadas localmente

### Compilação estrita do motor

O pacote `game-engine` foi reconstruído isoladamente e compilado com TypeScript 5.8.3 em modo estrito, sem React, Next.js, Firebase ou dependências externas.

Resultado: aprovado.

### Smoke test funcional do motor

Foram validados no mesmo fluxo:

- personagem de baixa renda;
- opção de computador próprio bloqueada;
- condição bloqueante `hasComputer == true` identificada;
- intervalo entre `16/02 às 16:00` e `17/02 às 08:00`: `960 minutos`;
- escolha da biblioteca;
- avanço para `17:30`;
- localização alterada para `library`;
- histórico atualizado;
- rolagem determinística.

Saída registrada:

```json
{
  "blockedReason": {
    "type": "flag",
    "flag": "hasComputer",
    "value": true
  },
  "timeUntilCommitment": 960,
  "afterChoice": {
    "clock": {
      "date": "2026-02-16",
      "minuteOfDay": 1050
    },
    "location": "library"
  },
  "deterministicRoll": {
    "roll": 8,
    "modifierTotal": 0,
    "score": 8,
    "outcome": "critical_failure"
  }
}
```

### Persistência ordenada

A fila de operações foi compilada e executada fora do navegador.

Validações:

- segunda gravação não começa antes da primeira terminar;
- resultados preservam a ordem de entrada;
- uma operação rejeitada não bloqueia gravações futuras.

Saída registrada:

```json
{
  "events": ["first:start", "first:end", "second:start"],
  "values": [1, 2],
  "recovered": 42
}
```

## Testes automatizados adicionados

### Motor

- avanço para o dia seguinte;
- intervalo positivo entre dias;
- intervalo negativo para compromisso atrasado;
- filtragem de escolhas;
- justificativa de escolha bloqueada;
- liberação da escolha quando a condição é atendida;
- aplicação de efeitos e avanço narrativo;
- rolagem por seed;
- limites dos atributos.

### Persistência

- gravações executadas na ordem de entrada;
- fila continua funcional depois de uma rejeição;
- contrato do repositório em memória;
- retomada pelo IndexedDB coberta no E2E.

### E2E

A jornada automatizada verifica:

1. criação de uma vida de baixa renda;
2. relógio visível às `16:00`;
3. `16h` até a apresentação;
4. save confirmado como `Salvo`;
5. motivo do computador próprio estar bloqueado;
6. escolha da biblioteca;
7. avanço para `17:30`;
8. redução para `14h 30min` até o compromisso;
9. confirmação de save antes do reload;
10. restauração do nó e do horário após recarregar.

## Auditoria estrutural automatizada

Comando:

```bash
pnpm audit:sprint0
```

O script agora exige 15 arquivos e valida marcadores de:

- relógio completo;
- tempo restante;
- estado do save;
- diagnóstico de bloqueio;
- motor de tempo;
- fila de persistência;
- cobertura E2E;
- comandos obrigatórios da CI.

## GitHub Actions

A CI foi otimizada para:

- executar uma vez por PR;
- executar em `push` apenas na `main`;
- ignorar alterações exclusivamente documentais;
- cancelar execução substituída;
- usar um único job e uma única instalação;
- instalar Chromium somente depois das verificações rápidas;
- limitar o timeout a 25 minutos;
- impedir cron, sleeps longos, commits automáticos e gatilhos redundantes.

A execução `29969923401`, já com a CI econômica, falhou antes de criar qualquer step ou log. Isso confirma bloqueio de disponibilidade da conta, não falha observada em um comando do projeto.

## Pendências para o encerramento formal

1. disponibilizar minutos para o repositório privado ou aguardar a renovação mensal;
2. executar a pipeline no SHA final;
3. corrigir qualquer falha real que apareça;
4. gerar e versionar `pnpm-lock.yaml` em ambiente com acesso ao registry;
5. executar novamente a CI com instalação congelada;
6. marcar o PR como pronto para revisão;
7. fazer merge somente com todos os checks verdes.

## Fora do escopo da Sprint 0

- Firebase;
- eventos globais;
- energia narrativa;
- imagens e backgrounds;
- Android e iOS;
- monetização;
- múltiplas profissões;
- campanha completa do MVP.
