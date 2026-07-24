# Arquitetura de Pacotes Narrativos

## Objetivo

Permitir que o mesmo motor execute vidas e profissões diferentes sem conhecer o conteúdo específico delas.

## Camadas

### Motor de jogo

Responsável por:

- tempo;
- condições;
- efeitos;
- dinheiro;
- atributos;
- relações;
- consequências futuras;
- testes de habilidade;
- identidade persistente;
- migração de save.

O motor não deve importar nomes, profissões, escola ou textos narrativos.

### Pacote narrativo

Declara:

- identificador e versão;
- nó inicial;
- módulos;
- cenas;
- compromissos;
- escolhas;
- condições;
- efeitos;
- papéis de pessoas;
- resultados e finais.

### Módulos

Agrupam eventos reutilizáveis ou substituíveis, como:

- rotina;
- formação;
- trabalho;
- conflito;
- família;
- relacionamento;
- saúde;
- finanças;
- oportunidade;
- avaliação;
- transição de carreira.

### Interface

Renderiza qualquer pacote usando os mesmos componentes:

- relógio;
- cena;
- escolhas;
- contexto de pessoa;
- consequências;
- estado atual;
- relações.

## Criação de uma nova profissão

Uma nova vida profissional não exige reescrever o motor, a persistência ou a interface.

Exige criar um novo pacote com:

1. pesquisa e regras reais da profissão;
2. fases da trajetória;
3. módulos específicos;
4. elenco por papéis;
5. escolhas e consequências;
6. testes de integridade;
7. simulações de rotas;
8. textos próprios.

## O que pode ser reaproveitado

- relógio e compromissos;
- deslocamentos;
- condições e efeitos;
- dinheiro;
- energia, estresse e saúde;
- relações e memórias;
- identidade e nomes;
- consequências futuras;
- testes de habilidade;
- componentes de interface;
- save e migração;
- auditorias estruturais;
- resolvedor futuro de reencontros.

## O que precisa ser criado para cada profissão

- contexto profissional;
- eventos autênticos;
- conhecimentos específicos;
- progressão de carreira;
- riscos e dilemas;
- personagens e instituições típicos;
- critérios de sucesso e fracasso;
- textos narrativos;
- balanceamento de tempo, renda e desgaste.

## Exemplo: jogador de futebol

Pode reaproveitar o motor e módulos genéricos, mas precisa de conteúdo próprio:

- peneira;
- categorias de base;
- treinos;
- escola versus esporte;
- empresário;
- contrato;
- banco de reservas;
- lesão;
- transferência;
- imprensa;
- torcida;
- aposentadoria.

## Exemplo: psicologia

- vestibular ou bolsa;
- estágio;
- supervisão;
- ética profissional;
- clínica;
- concurso;
- especialização;
- desgaste emocional;
- construção de clientela.

## Regra de qualidade

Modularidade não significa trocar substantivos em um texto genérico.

Cada profissão precisa de pesquisa, autoria e testes próprios. A vantagem da arquitetura é não repetir a infraestrutura e permitir montar novas trajetórias com blocos já estáveis.
