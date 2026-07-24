# Estado Canônico do Projeto

**Data:** 24/07/2026  
**Status:** consolidação modular concluída, integrada à `main` e publicada em produção.

Este arquivo substitui somente informações operacionais antigas sobre o estado do PR #7. As regras continuam em `docs/HANDOFF_CANONICAL.md`.

## Evidências

- PR funcional: `#7`;
- SHA validado antes do merge: `36523f968325918ac4a629a0ef1403324030fd03`;
- execução definitiva da CI: `30113406692`;
- resultado da CI: aprovado integralmente;
- commit squash na `main`: `03646550a2cf75ab48ee9d56ee07a8028ae3c5fd`;
- preview da Vercel: aprovado;
- deploy de produção da `main`: aprovado.

A execução definitiva aprovou:

1. instalação congelada;
2. lint;
3. TypeScript;
4. 37 testes unitários e de integridade;
5. execução de pacote independente de jogador de futebol;
6. build Next.js;
7. auditoria da fundação;
8. auditoria de compatibilidade da Sprint 1;
9. auditoria canônica do prólogo;
10. auditoria econômica do GitHub Actions;
11. instalação do Chromium;
12. jornada E2E completa.

## Estado das entregas

- Sprint 0: concluída;
- Sprint 1: concluída;
- Prólogo Canônico v1.0: implementado e jogável;
- arquitetura de pacotes: consolidada;
- locais e conhecimentos definidos por pacote: implementados;
- interface genérica: implementada;
- pessoas, categorias e memórias: implementadas;
- prova de reutilização profissional: aprovada;
- produção: publicada.

## Pendências de produto

- catálogo de vidas e profissões;
- seleção de pacote na interface;
- controle de acesso gratuito/pago;
- resolvedor executável de reencontros;
- banco geral de nomes;
- sincronização entre dispositivos;
- expansão dos caminhos de formação.

Nenhuma dessas pendências exige reescrever o motor.

## Próximo passo recomendado

Criar o catálogo de vidas/profissões e, depois, adicionar novos pacotes profissionais seguindo `docs/NARRATIVE_PACKAGE_ARCHITECTURE.md`.
