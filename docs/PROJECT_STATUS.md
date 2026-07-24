# Estado Canônico do Projeto

**Data:** 24/07/2026  
**Status:** consolidação modular concluída, integrada à `main` e publicada em produção; expansão para dois anos escolares e pontes profissionais aprovada, ainda não implementada.

As regras estão em `docs/HANDOFF_CANONICAL.md`. A estrutura escolar está em `docs/PROLOGUE_CANONICAL.md`.

## Evidências da versão publicada

- PR funcional da consolidação: `#7`;
- SHA validado antes do merge: `36523f968325918ac4a629a0ef1403324030fd03`;
- execução definitiva da CI: `30113406692`;
- resultado da CI: aprovado integralmente;
- commit squash na `main`: `03646550a2cf75ab48ee9d56ee07a8028ae3c5fd`;
- preview da Vercel: aprovado;
- deploy de produção da `main`: aprovado;
- encerramento documental: PR `#8`, commit `d97d15e3ef3094c7aef5da17bff5593abe695545`.

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

### Implementado e publicado

- Sprint 0;
- Sprint 1;
- Prólogo Canônico v1.0 com um ano escolar jogável;
- arquitetura de pacotes;
- locais e conhecimentos definidos por pacote;
- interface textual genérica;
- pessoas, categorias e memórias;
- prova de reutilização profissional;
- save local em IndexedDB.

### Decisão canônica aprovada, ainda não implementada

- toda nova vida passa obrigatoriamente pela escola;
- vida escolar com dois anos letivos;
- início no segundo ano e conclusão no terceiro;
- eventos escolares diferentes em novas vidas;
- pontes profissionais durante a escola;
- ponte Futebol com treinos semanais e jogos aos finais de semana;
- escolha textual de profissão depois da formatura;
- confirmação ao não escolher uma profissão adquirida;
- profissão adquirida permanece disponível para futuras vidas;
- Firebase para saves remotos e snapshots.

## Itens adiados

- catálogo visual de vidas;
- conteúdo pago em produção;
- cosméticos;
- casas e automóveis diferenciados;
- resolvedor automático de reencontros;
- banco geral de nomes;
- sincronização Firebase efetiva.

## Próximo passo recomendado

Executar uma sprint de expansão escolar que:

1. migre o recorte atual para dois anos;
2. preserve as cenas já válidas;
3. crie o terceiro ano;
4. implemente o contrato de ponte vocacional;
5. mantenha a seleção pós-escola totalmente textual;
6. preserve saves por migração explícita;
7. valide tempo, pessoas, consequências e rotas em CI e E2E.
