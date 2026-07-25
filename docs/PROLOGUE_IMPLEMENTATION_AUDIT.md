# Auditoria de implementação do Prólogo Canônico v2.0

**Data:** 25/07/2026  
**PR funcional:** #11  
**Estado:** implementação integrada à `main` e aprovada pela CI; validação em produção pendente por limite temporário de builds da Vercel.

## Escopo implementado

### Base preservada

- colega principal gerado deterministicamente;
- banco temporário com nove nomes autorizados;
- quatro passados possíveis;
- identidade persistente e reserva de nome;
- pessoa conhecida com contexto consultável;
- Confiança, Proximidade e Tensão;
- promoção gradual para pessoa importante;
- preferência romântica opcional;
- despertar, alimentação, transporte, ônibus e carro por aplicativo;
- trabalho em grupo, merenda, Educação Física, aula vaga e prova em dupla;
- encontro do grupo em casa, biblioteca ou chamada;
- convite social, responsabilidade familiar, fofoca, confronto e apresentação.

### Expansão escolar v2.0

- vida escolar começando no segundo ano, em 2026;
- encerramento visível do segundo ano;
- escolha do que manter nas férias;
- férias com relações ativas, distantes ou silenciosas;
- passagem explícita para 2027;
- terceiro ano com data e ano visíveis;
- escolha de lugar e reorganização social da turma;
- inscrição, curso, trabalho ou oportunidade futura;
- retorno da pessoa do primeiro trabalho;
- texto de retorno diferente quando houve ajuda, organização, retirada ou humilhação;
- conflito entre duas obrigações no mesmo horário;
- noite social com custo de tempo, dinheiro, energia e confiança;
- desgaste físico e decisão sobre descanso, carga ou insistência;
- expectativas familiares e autonomia profissional;
- preparação contextualizada da escolha pós-escola;
- último dia comum;
- formatura;
- cinco caminhos finais.

### Ponte Futebol

- propriedade da vida representada por contrato do pacote;
- convite escolar para treino durante a semana e jogos aos fins de semana;
- Controle de bola e Tática;
- custos de transporte e prática;
- conflito com escola, grupo, família e descanso;
- peneira ou avaliação;
- cansaço e risco físico;
- escolha Futebol disponível somente quando a vida está liberada;
- confirmação respeitosa quando outro caminho é escolhido;
- profissão preservada para futuras vidas;
- sucesso não garantido pela disponibilidade do conteúdo.

A ponte é funcional em nível escolar. O pacote profissional completo de Futebol continua sendo uma etapa futura.

## Migração de saves

A migração passou a diferenciar:

- save incompatível antigo, que precisa recomeçar com explicação;
- save da versão `prologue-1.0` em andamento, que preserva o nó e o estado compatível;
- save da versão de um ano já concluída, que retoma nas férias antes do terceiro ano.

A migração compatível preserva:

- identidade do jogador;
- pessoas e `personId`;
- nomes reservados;
- memórias;
- Confiança, Proximidade e Tensão;
- dinheiro;
- atributos;
- condições;
- conhecimentos;
- reputação;
- flags semanticamente compatíveis;
- histórico de decisões;
- consequências agendadas;
- seed determinística.

Flags antigas de encerramento e formação são removidas somente quando a vida concluída precisa continuar para o terceiro ano.

## Evidências automatizadas

- SHA validado: `55900740c91e58426c18d2ac4ac51dd8bd6ad72f`;
- execução definitiva: `30147307322`;
- job: `89651535405`;
- commit squash na `main`: `5d19911e5c9ba17e93db5e78b45ed534d974fae2`.

A execução definitiva aprovou:

1. instalação congelada;
2. lint;
3. TypeScript;
4. 43 testes unitários e de integridade;
5. simulação de 25 vidas escolares completas;
6. teste de nomes, gênero, contexto e determinismo;
7. teste de retorno baseado no primeiro trabalho;
8. teste de migração com preservação de pessoas, memórias e dinheiro;
9. teste de acesso e confirmação da vida Futebol;
10. build Next.js;
11. auditoria da fundação;
12. auditoria de compatibilidade da Sprint 1;
13. auditoria canônica do Prólogo v2.0;
14. auditoria econômica de Actions;
15. instalação do Chromium;
16. Playwright E2E do início de 2026 ao final de 2027;
17. formatura, final técnico e restauração após recarregar a página.

## Problemas encontrados e correções

### Tipagem da migração

A primeira execução falhou porque `exactOptionalPropertyTypes` não aceita declarar uma propriedade opcional com valor `undefined`. O teste legado foi corrigido para remover a propriedade do objeto, sem enfraquecer o contrato.

### Ano invisível na interface

A data mostrava dia e mês, o que tornava a passagem entre 2026 e 2027 pouco clara. O formatador passou a exibir o ano e recebeu teste unitário permanente.

### E2E de data muito específico

O primeiro E2E procurava uma frase exata da data. A validação foi generalizada para verificar o ano dentro do relógio do jogo, mantendo o teste independente de pequenas variações naturais de formatação regional.

### Preview da Vercel

A Vercel recusou os builds do branch e da `main` com `build-rate-limit`. O link de status não apontou erro de compilação, runtime ou configuração do aplicativo. O build Next.js e a jornada no Chromium passaram na CI.

## Modularidade preservada

O motor continua sem conhecer:

- nomes escolares;
- cenas do prólogo;
- matérias fixas;
- campos ou locais exclusivos de Futebol;
- textos narrativos;
- regra especial do tipo `profissão === futebol`.

A migração de conteúdo foi implementada como contrato genérico de pacote. Uma futura vida de Psicologia, Arquitetura ou Bombeiro pode usar a mesma estratégia de atualização sem modificar o motor.

## Limitações atuais

- produção ainda não foi validada por bloqueio de builds da Vercel;
- banco geral de nomes ainda não existe;
- Firebase e snapshots ainda não foram implementados;
- o resolvedor geral de reencontros continua futuro;
- o retorno atual do terceiro ano usa a pessoa principal por `personId` e memórias/flags conhecidas;
- o sistema real de compra e propriedade de profissões ainda não existe;
- o pacote profissional completo de Futebol ainda não existe;
- a Bíblia Narrativa prevê mais variações e densidade do que o primeiro recorte jogável atual.

## Conclusão

Os critérios técnicos de integração do Prólogo Canônico v2.0 foram atendidos no código e na CI. A implementação não pode ser chamada de publicada em produção até a Vercel aceitar um novo build e o teste de fumaça da versão pública ser concluído.
