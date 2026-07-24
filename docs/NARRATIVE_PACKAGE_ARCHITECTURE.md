# Arquitetura Canônica de Pacotes Narrativos

**Versão:** 1.0.0  
**Data:** 24/07/2026  
**Status:** contrato implementado e coberto por testes automatizados.

## 1. Objetivo

Permitir que o mesmo motor execute prólogos, vidas profissionais gratuitas e conteúdos pagos sem conhecer escola, futebol, psicologia, arquitetura, bombeiros ou qualquer profissão específica.

Modularidade não significa trocar palavras em um texto genérico. Cada profissão continua exigindo pesquisa, autoria, balanceamento e testes próprios. O que não pode ser refeito é a infraestrutura.

## 2. Camadas

### Motor de jogo

`packages/game-engine` é responsável somente por:

- relógio, datas e duração;
- condições e escolhas;
- efeitos imediatos e futuros;
- atributos universais;
- condições momentâneas;
- conhecimentos declarados pelo pacote;
- dinheiro e reputação;
- pessoas, relações e memórias;
- testes de habilidade;
- estado e migração.

O motor não pode conter:

- nomes de NPCs;
- textos narrativos;
- matérias escolares;
- locais de uma profissão;
- regras exclusivas de uma carreira;
- condicionais como `profissão === futebol`.

### Pacote narrativo

Um `NarrativePack` declara:

- identificador e versão;
- nó inicial;
- módulos e cenas;
- criação do cenário inicial;
- conhecimentos iniciais;
- locais;
- pessoas e variáveis;
- rótulos de apresentação;
- regras de renderização;
- finais.

### Módulos

Um pacote é composto por `NarrativeModule`s. Exemplos:

- rotina;
- deslocamento;
- treino ou prática;
- avaliação;
- trabalho;
- família;
- evento social;
- conflito;
- relacionamento;
- saúde;
- finanças;
- oportunidade;
- transição de carreira;
- encerramento.

Módulos podem ser compartilhados quando o comportamento é realmente igual, mas textos e consequências devem permanecer coerentes com o contexto.

### Interface

`apps/web` renderiza qualquer pacote por meio dos mesmos componentes:

- relógio;
- local e atividade;
- compromisso;
- cena e escolhas;
- contexto de pessoas;
- mudanças;
- atributos e condições;
- conhecimentos do pacote;
- reputação nomeada pelo pacote;
- relações e memórias.

A interface não mantém catálogos próprios de matérias ou locais. Ela recebe esses rótulos do pacote atual.

## 3. Elementos universais e configuráveis

### Universais

- Raciocínio;
- Percepção;
- Comunicação;
- Autocontrole;
- Vigor;
- Agilidade;
- Energia;
- Estresse;
- Saúde;
- Confiança;
- Proximidade;
- Tensão;
- dinheiro;
- tempo;
- reputação, cujo nome visível depende do pacote.

### Configuráveis pelo pacote

- conhecimentos;
- locais;
- nomes visíveis dos conhecimentos;
- nome visível da reputação;
- flags narrativas;
- elenco;
- calendário;
- dinheiro inicial;
- ajustes iniciais;
- eventos e finais.

## 4. Criação de uma nova profissão

Para criar uma vida de jogador de futebol, psicólogo, arquiteto ou bombeiro, não se altera o motor.

O trabalho necessário é:

1. pesquisar a trajetória real;
2. definir fases e marcos;
3. declarar conhecimentos profissionais;
4. declarar locais;
5. criar papéis de pessoas e instituições;
6. escrever módulos e cenas;
7. configurar tempo, renda, desgaste e riscos;
8. registrar o pacote;
9. validar destinos e coerência;
10. simular rotas e executar E2E.

## 5. Prova automatizada: jogador de futebol

A suíte `packages/narrative/tests/modularity.test.ts` cria e executa um pacote que não importa o prólogo escolar.

Esse pacote:

- inicia em `training_ground`;
- exibe o local como “Centro de treinamento”;
- declara `ball_control` e `tactics`;
- exibe “Controle de bola” e “Tática”;
- reduz Energia;
- aumenta Controle de bola;
- avança duas horas;
- muda para `locker_room`;
- encerra no vestiário.

A execução usa o mesmo `createGameState`, `chooseStoryOption`, relógio, efeitos e tipos usados pelo prólogo.

## 6. Reaproveitamento real

Uma nova profissão reaproveita integralmente:

- motor;
- save;
- relógio;
- efeitos;
- atributos e condições;
- dinheiro;
- reputação;
- pessoas e memórias;
- geração determinística;
- consequências futuras;
- testes de habilidade;
- validação de pacotes;
- componentes da interface;
- auditorias estruturais.

Ela não reaproveita automaticamente:

- pesquisa profissional;
- textos;
- dilemas autênticos;
- progressão de carreira;
- valores de salário;
- riscos específicos;
- personagens e instituições típicos;
- balanceamento.

## 7. Catálogo e monetização

A arquitetura suporta vários pacotes, mas a tela de catálogo e as regras de acesso gratuito/pago ainda são uma camada futura.

A inclusão futura deve selecionar um `NarrativePack` e chamar `pack.createSetup(player)`. Não deve duplicar `GameShell`, persistência ou motor.

## 8. Critérios de aceite de um pacote

Um pacote só pode ser publicado quando:

- possui id e versão;
- possui nó inicial existente;
- todos os nós pertencem a módulos;
- nenhum destino está ausente;
- nós não finais possuem escolhas;
- conhecimentos e locais têm rótulos;
- não há termos técnicos visíveis;
- não há regressão do relógio;
- compromissos e atividades são coerentes;
- todas as rotas principais são alcançáveis;
- save e recarga preservam identidade;
- testes e E2E passam.

## 9. Regra canônica

Nova profissão significa **novo pacote**, não novo motor.

Uma alteração no motor só é aceita quando cria uma capacidade universal que mais de um pacote pode usar e vem acompanhada de testes de regressão.
