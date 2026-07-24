# Vidas Possíveis — Handoff Canônico Operacional

**Versão:** 0.9.0  
**Data:** 24/07/2026  
**Status:** Sprints 0 e 1 concluídas; Prólogo Canônico v1.0 implementado em arquitetura de pacotes e módulos.

Este arquivo é fonte obrigatória para qualquer novo chat ou agente que altere o projeto. O documento completo arquivado nas Fontes do projeto continua válido; este arquivo contém as regras operacionais que o código deve respeitar.

## 1. Visão do produto

Vidas Possíveis é um RPG narrativo de vida, relações, tempo, formação e carreira. O jogador não escolhe apenas respostas: cada ação ocupa tempo, altera condições, cria memórias e pode reaparecer anos depois.

O produto deve permitir várias trajetórias, inclusive vidas profissionais gratuitas ou pagas, sem duplicar o motor.

## 2. Arquitetura obrigatória

O projeto é dividido em:

- `packages/game-engine`: regras genéricas de estado, tempo, escolhas, efeitos, testes e relações;
- `packages/narrative`: pacotes narrativos e validação de conteúdo;
- `packages/persistence`: progresso local e futuro contrato de sincronização;
- `apps/web`: apresentação e interação;
- `docs`: regras canônicas e auditorias.

O motor não pode depender de escola, Bia, tecnologia, futebol ou qualquer profissão específica.

Conteúdo novo deve entrar como `NarrativePack`, composto por `NarrativeModule`s e nós. Exemplo: `school-prologue`, `profession-football`, `profession-psychology`.

## 3. Estado e progresso

O estado atual usa schema 3 e contém:

- perfil do jogador;
- relógio e localização;
- pacote e nó atuais;
- atributos;
- condições momentâneas;
- conhecimentos;
- reputação e dinheiro;
- flags;
- pessoas e memórias;
- nomes reservados;
- variáveis do cenário;
- histórico de decisões;
- consequências futuras;
- seed determinística.

Migrações devem preservar a identidade do personagem e explicar ao jogador quando uma narrativa precisar reiniciar por mudança canônica.

## 4. Atributos, condições e conhecimentos

### Atributos duradouros

- Raciocínio;
- Percepção;
- Comunicação;
- Autocontrole;
- Vigor;
- Agilidade.

### Condições momentâneas

- Energia;
- Estresse;
- Saúde.

### Conhecimentos aprendidos

O pacote escolar inicia com:

- Matemática;
- Português;
- Física;
- Tecnologia.

Pacotes profissionais podem declarar outros domínios futuramente. Raciocínio não é conhecimento; Vigor não é Energia; Reputação não é atributo pessoal.

## 5. Pessoas

Existem três categorias narrativas:

- pessoa de cena;
- pessoa conhecida;
- pessoa importante.

Categoria, papel e presença são separados. Uma pessoa pode ser conhecida, chefe e distante; importante, rival e ativa; ou conhecida, inativa e ainda guardada na memória.

Toda pessoa nomeada e persistente utiliza somente:

- Confiança;
- Proximidade;
- Tensão.

Esses indicadores servem para colega, vizinho, esposa, chefe, rival ou familiar. Romance, lealdade, admiração e rivalidade são interpretações do papel, das memórias e dos três indicadores, não barras próprias nesta fase.

Pessoas afastadas não são apagadas. O mesmo `personId` preserva nome, gênero, contexto, memórias e trajetória.

## 6. Valores e mudanças relacionais

Não iniciar relações em 50 por padrão. Valores nascem do contexto.

Faixas de referência:

- desconhecido: Confiança 5, Proximidade 0, Tensão 0;
- recém-apresentado: 10, 5, 0;
- colega de turma: aproximadamente 25–30, 15–20, 5;
- amigo: aproximadamente 45–60, 45–60, 5–10.

Mudanças típicas:

- interação leve: 1–3;
- ação relevante: 3–7;
- evento marcante: 8–15;
- ruptura extrema: acima de 15 somente com justificativa.

Nenhuma mudança grande pode existir apenas para preparar uma cena futura.

## 7. Memórias

Números mostram como está a relação. Memórias explicam por quê.

Memórias podem registrar:

- ajuda;
- promessa;
- conflito;
- humilhação;
- reconciliação;
- trabalho conjunto;
- lazer compartilhado;
- evento familiar;
- evento acadêmico;
- romance.

Toda consequência futura precisa apontar para uma escolha, pessoa ou memória de origem. Uma pessoa tratada mal pode voltar, mas não recebe vingança automática.

## 8. Resolvedor de reencontros

A vida inteira não será escrita antecipadamente. O modelo é híbrido:

1. marcos fixos para personagens centrais;
2. papéis narrativos abertos, como “pessoa capaz de indicar uma vaga”;
3. seleção da pessoa mais coerente no histórico;
4. criação de pessoa nova quando ninguém antigo servir.

Elegibilidade considera idade, localização, profissão, disponibilidade, memórias, Confiança, Proximidade, Tensão e tempo desde a última aparição.

NPCs usam trajetória resumida por marcos, não simulação diária completa.

## 9. Gênero e romance

Gênero do personagem e preferência afetiva são conceitos separados.

Preferências disponíveis:

- mulheres;
- homens;
- homens e mulheres;
- sem interesse romântico;
- ainda não definido.

Papéis neutros aceitam homem ou mulher independentemente do jogador. Compatibilidade não cria romance. Romance depende de convivência, reciprocidade, consentimento, idade e contexto. O jogador pode terminar qualquer trajetória sem romance.

## 10. Escalação e nomes

NPCs variáveis são criados por papel narrativo. A geração é determinística pela seed e ocorre uma vez.

Cada pessoa recebe:

- `personId`;
- nome;
- gênero;
- papel;
- histórico;
- situação atual;
- personalidade;
- relação inicial;
- possíveis marcos futuros.

O nome é reservado durante toda a vida. Outra pessoa não pode reutilizá-lo. Uma reaparição deve reutilizar o mesmo `personId`.

## 11. Contexto prévio

Quando o personagem já conhece alguém, a interface deve oferecer “Quem é esta pessoa?” antes de escolhas relevantes.

O contexto deve explicar:

- como se conhecem;
- ajuda ou conflitos anteriores;
- impressão atual;
- motivo de presença na cena.

Nenhuma memória materialmente importante pode ficar escondida do jogador e depois ser usada para julgá-lo.

Desconhecidos reais, como um motorista encontrado pela primeira vez, não precisam de passado inventado.

## 12. Tempo

O relógio é fonte única da verdade.

Regras obrigatórias:

- diferenças calculadas pelo motor;
- relógio nunca retrocede;
- deslocamentos ocupam tempo;
- sono e refeições ocupam tempo;
- atividade precisa ser compatível com horário e local;
- chegar cedo cria espera ou preparação;
- chegar tarde cria atraso;
- compromissos podem estar futuros, em andamento, atrasados, perdidos, remarcados ou cancelados;
- atividades incompatíveis não podem ocorrer simultaneamente.

Casos mínimos de teste:

- 05:40 → 08:00 = 140 minutos;
- segunda 18:10 → terça 05:40 = 690 minutos;
- 06:35 → 10:30 = 235 minutos;
- 08:20 para compromisso às 08:00 = atraso de 20 minutos.

## 13. Construção narrativa

Todo evento precisa declarar ou implicar de modo testável:

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
- consequências imediatas e futuras;
- destinos.

Nenhuma escolha consome tempo silenciosamente. Fofoca, castigo, briga, oportunidade ou retorno precisam de origem rastreável.

Plausibilidade tem prioridade sobre surpresa.

## 14. Modularidade

A unidade de publicação é `NarrativePack`.

Um pacote contém:

- id e versão;
- nó de entrada;
- módulos;
- mapa de nós;
- criação de setup;
- renderização de variáveis;
- validação genérica.

Módulos recomendados e reutilizáveis:

- deslocamento;
- avaliação;
- treino ou prática;
- evento social;
- evento familiar;
- conflito;
- relacionamento;
- oportunidade;
- encerramento.

Conteúdo profissional não deve adicionar `if profissão === ...` ao motor. Deve compor módulos em um novo pacote.

## 15. Limites atuais

A arquitetura já separa motor e conteúdo, mas ainda existem vocabulários fechados para localização e conhecimento na versão atual. Antes de dezenas de profissões, esses catálogos deverão se tornar configuráveis por pacote ou ampliar-se por extensões de domínio.

Também faltam:

- catálogo de pacotes na interface;
- controle de acesso gratuito/pago;
- resolvedor de reencontros executável;
- biblioteca compartilhada de contratos, salários, lesões, certificações e rotinas profissionais;
- sincronização entre dispositivos.

## 16. Documentos obrigatórios

Antes de alterar o prólogo, consultar também `docs/PROLOGUE_CANONICAL.md`.

As auditorias devem impedir:

- nomes fora do banco autorizado;
- nomes duplicados;
- contexto ausente;
- atividade antecipada;
- tempo retrocedendo;
- destinos inexistentes;
- pacote sem módulo;
- termos técnicos na experiência do jogador.
