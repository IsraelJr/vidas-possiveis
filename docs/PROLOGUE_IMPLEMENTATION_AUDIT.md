# Auditoria de implementação do Prólogo Canônico

**Data:** 24/07/2026  
**PR:** #7  
**Estado:** implementação aprovada em CI, E2E e preview da Vercel; aguardando integração à `main`.

## Escopo implementado

- colega principal gerado deterministicamente;
- banco temporário com nove nomes autorizados;
- quatro passados possíveis;
- identidade persistente e reserva de nome;
- pessoa conhecida com contexto consultável;
- Confiança, Proximidade e Tensão;
- promoção para pessoa importante;
- preferência romântica opcional;
- despertar, alimentação e transporte;
- ônibus e carro por aplicativo;
- espera antes da aula;
- trabalho em grupo;
- merenda e lanchonete;
- Educação Física;
- aula vaga;
- prova em dupla;
- encontro do grupo em casa, biblioteca ou chamada;
- convite social e responsabilidade familiar;
- fofoca e confronto;
- chegada antecipada ou atrasada;
- apresentação somente a partir das 08:00;
- módulos do restante do ano;
- quatro caminhos de formação;
- migração de progresso anterior;
- documentação canônica.

## Adequação do domínio

- Disciplina substituída por Autocontrole;
- atributos separados de condições;
- conhecimentos separados e definidos por pacote;
- reputação separada dos atributos;
- pessoa de cena, conhecida e importante implementadas;
- memórias persistentes implementadas;
- interface prioriza descrições humanas;
- números relacionais permanecem em detalhes.

## Modularidade comprovada

O motor não possui nomes, cenas, matérias ou locais escolares.

O teste automatizado cria e executa um pacote de jogador de futebol com:

- `training_ground`;
- `locker_room`;
- `ball_control`;
- `tactics`;
- reputação no clube;
- treino de duas horas;
- consumo de Energia;
- evolução de Controle de bola.

Esse pacote usa o mesmo motor, efeitos, relógio e estado do prólogo.

## Evidências automatizadas

A execução definitiva do PR deve registrar:

- instalação congelada;
- lint;
- TypeScript;
- testes unitários;
- teste profissional executável;
- build;
- auditoria da fundação;
- auditoria de compatibilidade;
- auditoria do prólogo;
- auditoria econômica de Actions;
- Playwright E2E;
- Vercel verde.

## Limitações atuais

- o banco geral de 100 nomes por gênero ainda não foi implementado;
- o prólogo usa os nove nomes aprovados;
- o resolvedor completo de reencontros ainda é uma etapa futura;
- os eventos do restante do ano são um recorte jogável, não todos os módulos futuros;
- catálogo de profissões e acesso gratuito/pago ainda não existem;
- seleção de pacote na interface será implementada junto do catálogo.

Essas limitações não exigem reescrever o motor.

## Critério de conclusão

A consolidação só pode ser integrada quando:

1. CI integralmente verde;
2. E2E verde;
3. preview da Vercel verde;
4. PR mesclável;
5. documentação canônica atualizada;
6. CI e Vercel da `main` confirmadas depois do merge.
