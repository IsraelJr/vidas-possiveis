# Auditoria da Sprint 0

## Escopo auditado

- organização por workspaces;
- motor puro e independente;
- relógio e calendário;
- atributos e efeitos imutáveis;
- condições;
- rolagem determinística;
- narrativa validada por schema;
- primeira cena jogável;
- relógio visível;
- persistência IndexedDB;
- testes unitários e E2E;
- CI.

## Evidências executadas

### Auditoria estrutural

Comando:

```bash
node scripts/audit-sprint0.mjs
```

Resultado:

```text
Auditoria da Sprint 0 aprovada.
Arquivos obrigatórios verificados: 9
```

### Compilação e smoke test do motor

O pacote `game-engine` foi compilado isoladamente com TypeScript estrito, sem React, Next.js ou Firebase.

Fluxo validado:

- criação de personagem de baixa renda;
- escolha de ir à biblioteca;
- avanço de 90 minutos: `16:00 → 17:30`;
- localização: `school → library`;
- energia: `71 → 61`;
- histórico da decisão registrado;
- rolagem percentual reproduzível pela mesma seed.

Resultado da rolagem de auditoria:

```json
{
  "roll": 94,
  "modifierTotal": 0,
  "score": 94,
  "outcome": "exceptional_success"
}
```

### Integridade arquitetural

- `game-engine` não importa React, Next.js, Firebase, DOM ou persistência;
- narrativa está isolada e validada por Zod;
- persistência depende do contrato `SaveRepository`;
- IndexedDB é aberto de maneira lazy, evitando acesso durante pré-renderização;
- interface consome contratos públicos dos pacotes;
- relógio, localização e próximo compromisso permanecem perceptíveis.

## GitHub Actions — bloqueio externo confirmado

Foram executados workflows convencionais, sem reusable actions e um smoke test mínimo contendo apenas:

```bash
echo "GitHub Actions runner started successfully."
node --version
```

Todos falharam antes de iniciar qualquer step. O GitHub não gerou logs, steps ou artefatos para os jobs.

Evidências:

- workflow CI: execuções `29892621366`, `29893264934`, `29893375329` e `29893497869`;
- workflow diagnóstico: execução `29893650080`;
- smoke test de runner: execução `29893686749`;
- todos concluíram como `failure` antes da execução do primeiro comando;
- o endpoint de logs retornou `BlobNotFound`;
- o smoke test independente comprova que a falha não é causada pelo código da Sprint 0.

A causa provável é configuração ou disponibilidade de GitHub Actions para o repositório privado, como Actions desabilitado, limite de consumo ou configuração de cobrança. Isso precisa ser resolvido nas configurações da conta/repositório para que a pipeline execute.

A CI final permanece configurada para executar:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm audit:sprint0
pnpm test:e2e
```

## Limitações conhecidas

- O vertical slice contém apenas a primeira cena escolar.
- A rolagem percentual está implementada no motor, mas ainda não é usada pela interface.
- O lockfile será gerado após a primeira instalação em ambiente com acesso ao registry.
- Firebase, eventos globais, energia narrativa e camada visual permanecem fora da Sprint 0.
- A validação completa de dependências, build Next.js e Playwright permanece pendente exclusivamente porque o runner do GitHub não inicia e o ambiente local não possui acesso ao npm registry.

## Correções preventivas da auditoria

- A abertura do IndexedDB foi tornada lazy para evitar acesso a APIs do navegador durante o pré-render do Next.js.
- A construção do mapa narrativo retorna tuplas readonly explicitamente tipadas.
- O monólito inicial foi substituído por um monorepo modular antes da entrega.
- Workflows temporários de diagnóstico foram removidos; somente a CI de produção permanece.
