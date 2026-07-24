# Vidas Possíveis — Handoff Canônico Operacional

**Versão:** 1.0.0  
**Data:** 24/07/2026  
**Status:** Sprints 0 e 1 concluídas; Prólogo Canônico v1.0 implementado; arquitetura modular de pacotes consolidada e em auditoria final.

Este arquivo é leitura obrigatória para qualquer novo chat ou agente que altere o projeto. Também devem ser consultados:

- `docs/PROLOGUE_CANONICAL.md` para o conteúdo escolar;
- `docs/NARRATIVE_PACKAGE_ARCHITECTURE.md` para novas vidas e profissões.

Em caso de divergência, prevalece a decisão mais recente registrada explicitamente em documento canônico.

## 1. Visão do produto

Vidas Possíveis é um RPG narrativo sobre vida, relações, tempo, formação e carreira.

Cada ação pode:

- consumir tempo;
- alterar atributos ou condições;
- mudar dinheiro e reputação;
- criar memórias;
- aproximar ou afastar pessoas;
- produzir consequência futura;
- abrir ou fechar oportunidades.

O produto deve suportar prólogos, profissões gratuitas e vidas pagas sem duplicar motor, persistência ou interface.

## 2. Arquitetura obrigatória

- `packages/game-engine`: regras universais do jogo;
- `packages/narrative`: pacotes, módulos, cenas e validação;
- `packages/persistence`: progresso local e futuro contrato de sincronização;
- `apps/web`: interface genérica;
- `docs`: regras, narrativas e auditorias.

O motor não pode conter:

- nomes de NPCs;
- cenas escolares;
- matérias específicas;
- locais de uma profissão;
- textos narrativos;
- condicionais por profissão.

Conteúdo novo entra como `NarrativePack`, composto por `NarrativeModule`s.

Regra canônica:

> Nova profissão significa novo pacote narrativo, não novo motor.

## 3. Pacote narrativo

Cada pacote declara:

- id e versão;
- nó inicial;
- módulos e nós;
- relógio e local iniciais;
- dinheiro e reputação iniciais;
- ajustes de atributos e condições;
- conhecimentos próprios;
- pessoas, nomes e memórias;
- variáveis do cenário;
- rótulos de locais, conhecimentos, flags e reputação;
- renderização de texto;
- caminhos finais.

A interface consulta o pacote atual para mostrar nomes humanos. Ela não mantém catálogos próprios de matérias ou locais.

## 4. Estado e progresso

O schema atual é o 3 e contém:

- jogador;
- cenário e nó atual;
- data, horário e local;
- atributos;
- condições;
- conhecimentos do pacote;
- reputação;
- dinheiro;
- flags;
- pessoas e memórias;
- nomes reservados;
- variáveis;
- histórico;
- consequências futuras;
- seed e índice determinísticos.

Migrações devem:

- preservar a identidade do jogador;
- preservar o que for semanticamente compatível;
- nunca fingir compatibilidade;
- explicar ao jogador quando uma narrativa precisa recomeçar.

## 5. Atributos universais

- Raciocínio;
- Percepção;
- Comunicação;
- Autocontrole;
- Vigor;
- Agilidade.

Não criar atributo específico de profissão no motor sem provar que é universal.

## 6. Condições momentâneas

- Energia;
- Estresse;
- Saúde.

Energia não é Vigor. Uma pessoa vigorosa pode estar exausta.

## 7. Conhecimentos

Conhecimentos são definidos pelo pacote.

O prólogo escolar declara:

- Matemática;
- Português;
- Física;
- Tecnologia.

Uma vida de futebol pode declarar:

- Controle de bola;
- Tática;
- Finalização;
- Preparação física.

Psicologia, Arquitetura e Bombeiros podem declarar seus próprios conhecimentos sem alterar o motor.

Raciocínio não substitui conhecimento aprendido.

## 8. Locais

Locais também são definidos pelo pacote.

Exemplos escolares:

- casa;
- escola;
- biblioteca;
- transporte público;
- shopping;
- parque.

Exemplos profissionais:

- centro de treinamento;
- vestiário;
- clínica;
- escritório de arquitetura;
- quartel de bombeiros;
- local de ocorrência.

Criar novo local não pode exigir alteração no motor ou na interface.

## 9. Pessoas e categorias

Existem três categorias:

- pessoa de cena;
- pessoa conhecida;
- pessoa importante.

Categoria, papel e presença são separados.

Uma pessoa pode ser:

- conhecida, chefe e distante;
- importante, rival e ativa;
- conhecida, inativa e ainda guardada na memória.

Pessoas afastadas não são apagadas.

## 10. Indicadores de relacionamento

Toda pessoa persistente utiliza somente:

- Confiança;
- Proximidade;
- Tensão.

Isso vale para colega, vizinho, cônjuge, chefe, rival ou familiar.

Amor, lealdade, admiração, atração e rivalidade são interpretações do papel, das memórias e desses indicadores; não são barras próprias nesta fase.

## 11. Valores iniciais e mudanças

Não iniciar tudo em 50.

Referências:

- desconhecido: 5 / 0 / 0;
- recém-apresentado: 10 / 5 / 0;
- colega de turma: aproximadamente 25–30 / 15–20 / 5;
- amigo: aproximadamente 45–60 / 45–60 / 5–10.

Mudanças típicas:

- interação leve: 1–3;
- ação relevante: 3–7;
- evento marcante: 8–15;
- ruptura extrema: acima de 15 somente com justificativa.

Nenhum número pode mudar apenas para preparar uma cena futura.

## 12. Memórias

Os números mostram como está a relação. As memórias explicam por quê.

Memórias podem registrar:

- ajuda;
- promessa;
- conflito;
- humilhação;
- reconciliação;
- trabalho conjunto;
- lazer;
- família;
- estudo;
- romance.

Toda consequência futura deve apontar para escolha, pessoa ou memória de origem.

Uma pessoa tratada mal pode voltar, mas não recebe vingança automática.

## 13. Reencontros

A vida inteira não é escrita previamente.

Modelo híbrido:

1. marcos fixos para personagens centrais;
2. papéis abertos, como “pessoa capaz de indicar uma vaga”;
3. busca de pessoa coerente no histórico;
4. criação de pessoa nova quando ninguém servir.

Elegibilidade considera:

- idade;
- localização;
- profissão;
- disponibilidade;
- memória;
- Confiança;
- Proximidade;
- Tensão;
- tempo desde a última aparição.

NPCs usam trajetória resumida por marcos, não uma vida diária completa.

## 14. Gênero e romance

Gênero e preferência afetiva são conceitos separados.

Preferências:

- mulheres;
- homens;
- homens e mulheres;
- sem romance;
- ainda não definido.

Papéis neutros aceitam qualquer gênero.

Compatibilidade não cria romance. Romance exige convivência, reciprocidade, consentimento, idade e contexto.

O jogador pode concluir qualquer vida sem romance e sem punição.

## 15. Escalação e nomes

NPCs variáveis são criados por papel narrativo e seed.

Cada pessoa recebe:

- `personId`;
- nome;
- gênero;
- papel;
- histórico;
- situação atual;
- personalidade;
- relação inicial;
- possíveis marcos.

O nome é reservado durante toda a vida.

Outra pessoa não pode reutilizá-lo. Um retorno usa o mesmo `personId`.

## 16. Contexto prévio

Quando o jogador já conhece alguém, deve existir “Quem é esta pessoa?” antes de decisões relevantes.

O contexto informa:

- como se conhecem;
- ajuda ou conflito anterior;
- impressão atual;
- motivo de presença na cena.

Nenhuma memória material pode ficar escondida e depois ser usada para julgar uma decisão.

Desconhecidos reais não precisam de passado inventado.

## 17. Tempo

O relógio é a fonte única da verdade.

Regras:

- diferenças calculadas pelo motor;
- relógio nunca retrocede;
- deslocamentos ocupam tempo;
- sono e refeições ocupam tempo;
- atividade combina com horário e local;
- chegada antecipada cria espera ou preparação;
- atraso produz estado e consequência;
- atividades incompatíveis não se sobrepõem.

Casos mínimos:

- 05:40 → 08:00 = 140 minutos;
- segunda 18:10 → terça 05:40 = 690 minutos;
- 06:35 → 10:30 = 235 minutos;
- 08:20 para compromisso às 08:00 = atraso de 20 minutos.

Às 06:35, com apresentação às 08:00, a atividade não pode ser “Apresentar o trabalho”.

## 18. Construção narrativa

Todo evento deve declarar ou tornar testável:

- data ou janela;
- horário;
- duração;
- local;
- atividade;
- compromisso;
- condições;
- escolhas;
- efeitos;
- pessoas;
- memórias;
- consequências;
- destinos.

Nenhuma escolha consome tempo silenciosamente.

Fofoca, castigo, briga, oportunidade e retorno precisam de origem rastreável.

Plausibilidade tem prioridade sobre surpresa.

## 19. Módulos recomendados

- rotina;
- deslocamento;
- treino ou prática;
- avaliação;
- trabalho;
- família;
- social;
- conflito;
- relacionamento;
- saúde;
- finanças;
- oportunidade;
- transição;
- encerramento.

Módulos podem ser reaproveitados quando o comportamento é realmente equivalente. Textos e dilemas específicos continuam sendo autoria própria.

## 20. Prova de modularidade

A suíte automatizada contém um pacote independente de jogador de futebol.

Ele declara:

- `training_ground` e `locker_room`;
- Controle de bola e Tática;
- reputação no clube;
- treino com duração de duas horas;
- consumo de Energia;
- evolução de Controle de bola;
- final no vestiário.

Esse pacote executa no mesmo motor sem importar o prólogo escolar.

## 21. O que é reaproveitado em novas profissões

Integralmente:

- motor;
- save;
- relógio;
- efeitos;
- atributos e condições;
- dinheiro e reputação;
- pessoas e memórias;
- geração determinística;
- consequências futuras;
- testes de habilidade;
- interface;
- validação e auditorias.

Precisa ser criado para cada profissão:

- pesquisa;
- fases;
- conhecimentos;
- locais;
- personagens e instituições;
- eventos;
- escolhas;
- progressão;
- riscos;
- textos;
- balanceamento.

## 22. Pendências futuras

A base modular não encerra todas as funcionalidades do produto.

Ainda faltam:

- catálogo de vidas e profissões;
- seleção de pacote na interface;
- controle de acesso gratuito/pago;
- resolvedor executável de reencontros;
- biblioteca crescente de módulos profissionais;
- sincronização entre dispositivos.

Essas pendências não exigem reescrever o motor.

## 23. Critérios de aceite de um pacote

Um pacote só pode ser publicado quando:

- possui id, versão e nó inicial;
- todos os nós pertencem a módulos;
- todos os destinos existem;
- nós não finais possuem escolhas;
- conhecimentos e locais têm rótulos;
- não há termos técnicos visíveis;
- não há regressão temporal;
- atividades e compromissos são coerentes;
- rotas principais são alcançáveis;
- save preserva identidade;
- testes, auditorias, build e E2E passam.

## 24. Estado atual

- Sprint 0: concluída;
- Sprint 1: concluída;
- Prólogo Canônico: implementado;
- pacote escolar: jogável;
- atributos, condições e conhecimentos: separados;
- pessoas e memórias: persistentes;
- pacote profissional independente: executado em teste;
- modularidade de locais e conhecimentos: implementada;
- PR de consolidação: deve permanecer sem merge até CI e Vercel verdes.
