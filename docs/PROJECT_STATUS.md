# Estado Canônico do Projeto

**Data:** 25/07/2026  
**Status:** Prólogo Canônico v2.0 implementado e integrado à `main`; CI aprovada integralmente; publicação na Vercel ainda pendente porque o plano recusou novos builds por limite temporário, sem falha de código.

As regras estão em `docs/HANDOFF_CANONICAL.md`. A Bíblia de escrita está em `docs/NARRATIVE_BIBLE.md`. A estrutura escolar está em `docs/PROLOGUE_CANONICAL.md`.

## Evidências da implementação atual

- PR funcional: `#11`;
- SHA validado antes do merge: `55900740c91e58426c18d2ac4ac51dd8bd6ad72f`;
- execução definitiva da CI: `30147307322`;
- resultado da CI: aprovado integralmente;
- commit squash na `main`: `5d19911e5c9ba17e93db5e78b45ed534d974fae2`;
- preview e produção Vercel: bloqueados por `build-rate-limit` do plano, sem diagnóstico de erro no aplicativo.

A execução definitiva aprovou:

1. instalação congelada;
2. lint;
3. TypeScript;
4. 43 testes unitários e de integridade;
5. simulação automatizada de 25 vidas completas;
6. migração compatível de saves da versão de um ano;
7. build Next.js;
8. auditoria da fundação;
9. auditoria de compatibilidade da Sprint 1;
10. auditoria canônica do prólogo;
11. auditoria econômica do GitHub Actions;
12. instalação do Chromium;
13. jornada Playwright E2E dos dois anos, formatura, final e restauração após recarregar.

## Estado das entregas

### Implementado na `main`

- Sprint 0;
- Sprint 1;
- Prólogo Canônico v2.0 como trajetória escolar jogável de dois anos;
- início no segundo ano do Ensino Médio, em 2026;
- encerramento do segundo ano e férias visíveis;
- passagem explícita para o terceiro ano, em 2027;
- eventos próprios do terceiro ano;
- retorno de pessoa e memória do primeiro trabalho;
- conflito entre escola, família, trabalho, vida social, saúde e futuro;
- último dia comum e formatura;
- escolha textual do caminho depois da escola;
- cinco finais: faculdade, curso técnico, trabalho com estudo online, trabalho com estudo independente e Futebol quando disponível;
- primeira ponte escolar funcional da vida Futebol;
- confirmação respeitosa quando Futebol está disponível e outro caminho é escolhido;
- datas apresentadas com ano visível;
- arquitetura de pacotes;
- pessoas, categorias, memórias e nomes persistentes;
- save local em IndexedDB;
- migração que preserva pessoas, lembranças, dinheiro, atributos, flags e histórico quando o save é semanticamente compatível.

### Implementado, mas ainda sem validação de produção

Todo o escopo do PR `#11` está na `main` e foi aprovado pela CI. A Vercel recusou o preview e o deploy de produção porque o projeto atingiu o limite temporário de builds do plano. O projeto não deve ser anunciado como publicado enquanto o status Vercel não ficar verde.

### Decisões canônicas para etapas futuras

- toda nova vida continuará passando pela escola;
- a escola poderá selecionar combinações diferentes de eventos entre vidas;
- a ponte Futebol deverá crescer com mais treinos, partidas, viagens, treinador, posição e progressão antes do pacote profissional completo;
- novas profissões entram como novos pacotes e novas pontes, não como regras especiais do motor;
- Firebase será usado para saves remotos e snapshots;
- profissão adquirida permanece disponível para futuras vidas quando o jogador escolhe outro caminho.

## Itens adiados

- catálogo visual de vidas;
- conteúdo pago em produção;
- sistema real de propriedade de profissão por conta;
- pacote profissional completo de Futebol;
- cosméticos de cabelo, roupa e acessórios;
- casas e automóveis diferenciados;
- resolvedor automático completo de reencontros;
- banco geral de nomes;
- sincronização Firebase efetiva;
- biblioteca ampla de módulos e variações para aumentar a duração e o replay do prólogo.

## Limites honestos do escopo atual

- a escola possui um percurso jogável completo de dois anos, mas a Bíblia Narrativa prevê uma biblioteca maior de variações e cenas que continuará crescendo;
- a ponte Futebol já influencia escola, conhecimentos, custos, cansaço, risco físico, peneira e escolha final, mas ainda não substitui o futuro pacote profissional completo;
- o retorno do terceiro ano é executável e baseado em flags e `personId`; o resolvedor geral para escolher automaticamente qualquer pessoa do passado continua futuro;
- o acesso a Futebol é testado por contrato do pacote, pois ainda não existe conta com compra real em produção.

## Próximo passo operacional

1. aguardar a liberação do limite de builds da Vercel;
2. confirmar o deploy de produção da `main`;
3. executar teste de fumaça na versão publicada;
4. atualizar este documento com a evidência de produção;
5. depois iniciar a ampliação de variedade narrativa ou o Firebase, conforme prioridade de produto.

Nenhuma falha funcional conhecida impede o código. O único bloqueio atual é externo ao aplicativo: limite temporário de builds na Vercel.
