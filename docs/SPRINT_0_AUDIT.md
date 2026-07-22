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

## Evidências esperadas

A auditoria automatizada `pnpm audit:sprint0` verifica arquivos obrigatórios, presença do relógio e comandos do CI. A pipeline executa lint, typecheck, testes, build, auditoria e Playwright.

## Limitações conhecidas

- O vertical slice contém apenas a primeira cena escolar.
- A rolagem percentual está implementada no motor, mas ainda não é usada pela interface.
- O pacote de dependências será travado em lockfile após a primeira instalação em ambiente com acesso ao registry.
- Firebase, eventos globais, energia narrativa e camada visual permanecem fora da Sprint 0.

## Correções preventivas da auditoria

- A abertura do IndexedDB foi tornada lazy para evitar acesso a APIs do navegador durante o pré-render do Next.js.
- A construção do mapa narrativo passou a retornar tuplas readonly explicitamente tipadas.
