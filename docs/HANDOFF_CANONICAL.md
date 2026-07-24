# Vidas Possíveis — Handoff Canônico Operacional

**Versão:** 1.1.0  
**Data:** 24/07/2026  
**Status:** Sprints 0 e 1 concluídas; Prólogo Canônico v1.0 implementado; arquitetura modular consolidada; expansão para dois anos escolares e pontes profissionais aprovada como próximo escopo, ainda não implementada.

Este arquivo é leitura obrigatória para qualquer novo chat ou agente que altere o projeto. Também devem ser consultados:

- `docs/PROLOGUE_CANONICAL.md` para conteúdo e estrutura da vida escolar;
- `docs/NARRATIVE_PACKAGE_ARCHITECTURE.md` para novas vidas e profissões;
- `docs/PROJECT_STATUS.md` para o estado operacional mais recente.

Em caso de divergência:

1. decisões de domínio e produto: este Handoff;
2. sequência e conteúdo escolar: Prólogo Canônico;
3. contratos de reutilização: Arquitetura de Pacotes;
4. a decisão explicitamente mais recente prevalece.

---

## 1. Visão do produto

Vidas Possíveis é um RPG narrativo sobre vida, relações, tempo, formação, trabalho e patrimônio.

Cada ação pode:

- consumir tempo;
- alterar atributos ou condições;
- mudar dinheiro, reputação e recursos;
- criar memórias;
- aproximar ou afastar pessoas;
- produzir consequências futuras;
- abrir ou fechar oportunidades.

O produto deve suportar uma vida escolar obrigatória, profissões gratuitas e, futuramente, vidas profissionais adquiridas, cosméticos e bens diferenciados sem duplicar motor, persistência ou interface.

---

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
- locais exclusivos de uma profissão;
- textos narrativos;
- condicionais como `profissão === futebol`.

Conteúdo novo entra como `NarrativePack`, composto por `NarrativeModule`s.

> Nova profissão significa novo pacote narrativo, não novo motor.

---

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

---

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
- explicar ao jogador quando uma narrativa precisar recomeçar;
- manter a mesma pessoa com o mesmo `personId`.

---

## 5. Atributos universais

- Raciocínio;
- Percepção;
- Comunicação;
- Autocontrole;
- Vigor;
- Agilidade.

Não criar atributo específico de profissão no motor sem provar que ele é universal.

---

## 6. Condições momentâneas

- Energia;
- Estresse;
- Saúde.

Energia não é Vigor. Uma pessoa vigorosa pode estar exausta.

---

## 7. Conhecimentos

Conhecimentos são definidos pelo pacote.

O pacote escolar pode declarar:

- Matemática;
- Português;
- Física;
- Tecnologia.

Uma vida de futebol pode declarar:

- Controle de bola;
- Tática;
- Finalização;
- Preparação física.

Psicologia, Arquitetura, Bombeiros e outras vidas declaram seus próprios conhecimentos sem alterar o motor.

Raciocínio não substitui conhecimento aprendido.

---

## 8. Locais

Locais são definidos pelo pacote.

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

---

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

---

## 10. Indicadores de relacionamento

Toda pessoa persistente utiliza somente:

- Confiança;
- Proximidade;
- Tensão.

Isso vale para colega, vizinho, cônjuge, chefe, rival ou familiar.

Amor, lealdade, admiração, atração e rivalidade são interpretações do papel, das memórias e desses indicadores; não são barras próprias nesta fase.

---

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

---

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

---

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

O resolvedor automático ainda não está implementado. Retornos atuais podem ser escritos por `personId`, desde que respeitem história, localização, idade, papel e memórias.

---

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

---

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

O prólogo utiliza temporariamente:

- Tamires, Solange, Paula e Julia;
- Miguel, Israel, Luiz, Rodrigo e Carlos.

O banco geral de nomes será definido posteriormente.

---

## 16. Contexto prévio

Quando o jogador já conhece alguém, deve existir “Quem é esta pessoa?” antes de decisões relevantes.

O contexto informa:

- como se conhecem;
- ajuda ou conflito anterior;
- impressão atual;
- motivo de presença na cena.

Nenhuma memória material pode ficar escondida e depois ser usada para julgar uma decisão.

Desconhecidos reais não precisam de passado inventado.

---

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

---

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

---

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

---

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

---

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

---

## 22. Vida escolar obrigatória de dois anos

Toda nova vida deve passar pela escola, mesmo quando o jogador já possui uma profissão adquirida.

A vida escolar canônica passa a durar dois anos letivos:

- início no segundo ano do Ensino Médio, aproximadamente aos 16 anos;
- conclusão no fim do terceiro ano, aos 17 ou 18 anos;
- início de referência: fevereiro de 2026;
- encerramento de referência: dezembro de 2027.

A escola deve reaparecer em toda nova vida porque pode gerar combinações diferentes de:

- colegas;
- amizades;
- rivalidades;
- namoro;
- professores;
- notas;
- faltas;
- situações familiares;
- dinheiro;
- trabalho;
- convites;
- eventos esportivos;
- pontes profissionais;
- consequências futuras.

A repetição da escola não deve significar repetir exatamente os mesmos eventos.

---

## 23. Função de cada ano escolar

### Segundo ano do Ensino Médio

Foco principal:

- adaptação ao grupo;
- descoberta de interesses;
- construção de amizades e rivalidades;
- primeiras responsabilidades mais sérias;
- exploração de atividades, cursos e profissões;
- início de pontes vocacionais;
- consequências que ainda terão tempo para retornar.

### Terceiro ano do Ensino Médio

Foco principal:

- cobrança acadêmica maior;
- provas e conclusão;
- decisões de futuro;
- trabalho, dinheiro e família competindo por tempo;
- consolidação ou ruptura de relações;
- continuidade das pontes profissionais;
- oportunidades, testes, inscrições e propostas;
- escolha do caminho após a escola.

Os dois anos devem possuir passagem de tempo clara, eventos próprios e retorno de escolhas anteriores.

---

## 24. Pontes profissionais durante a escola

Uma profissão adquirida pode desbloquear um módulo vocacional dentro da vida escolar.

A ponte não substitui a escola e não inicia antecipadamente o pacote profissional completo.

Ela cria acontecimentos coerentes durante os dois anos, por exemplo:

- aulas ou cursos durante a semana;
- treinos depois da escola;
- jogos ou atividades aos finais de semana;
- deslocamentos;
- equipamentos e custos;
- conflito com provas, trabalhos, família, lazer e descanso;
- pessoas próprias da área;
- reputação específica;
- lesões, falhas, oportunidades e desistências.

A ponte deve produzir estado aproveitável pelo pacote profissional depois da formatura.

Comprar uma vida profissional desbloqueia o conteúdo, mas não garante sucesso, emprego, contrato ou carreira de destaque.

---

## 25. Ponte canônica da vida Futebol

Quando a vida Futebol estiver disponível para a conta, a escola deve poder incluir:

- treinos durante a semana;
- preparação física;
- deslocamento até centro de treinamento, campo ou clube;
- jogos aos finais de semana;
- viagens e torneios;
- disputa por posição;
- relação com treinador, colegas e adversários;
- conflito entre treino e estudo;
- cansaço em provas e trabalhos;
- perda de festas, passeios ou compromissos familiares;
- custos de transporte e equipamentos;
- risco de lesão;
- reputação no clube;
- evolução de conhecimentos esportivos.

Ao terminar a escola, o estado da ponte pode determinar entradas diferentes na profissão:

- base forte;
- reserva;
- clube menor;
- peneira ou teste;
- retorno após lesão;
- futebol amador;
- abandono do caminho esportivo.

A vida adquirida não deve transformar automaticamente o personagem em atleta profissional bem-sucedido.

---

## 26. Escolha de profissão após a escola

As profissões devem aparecer quando o jogador concluir a vida escolar.

A tela textual de transição deve mostrar:

- caminhos gratuitos disponíveis;
- formações e trabalhos compatíveis;
- profissões adquiridas pela conta;
- contexto gerado pelos dois anos anteriores;
- consequências de cada escolha.

A seleção de pacote ocorre internamente depois que o jogador escolhe seu caminho.

Exemplo:

```text
Pacote escolar
→ conclusão do Ensino Médio
→ escolha do jogador
→ pacote de formação ou profissão
```

Não é necessária uma tela visual de catálogo neste momento. A escolha pode ser integralmente textual.

---

## 27. Confirmação ao não escolher uma vida adquirida

Quando o jogador possuir uma profissão adquirida e escolher outro caminho, o jogo deve confirmar a decisão de forma respeitosa.

Exemplo de sentido:

> Você possui a vida Futebol e construiu uma trajetória esportiva durante a escola. Nesta vida, está escolhendo seguir outro caminho. A vida Futebol continuará disponível para futuras vidas. Deseja confirmar?

Opções:

- seguir com o caminho escolhido;
- voltar às opções.

Regras:

- não usar pressão comercial;
- não sugerir perda da compra;
- não bloquear outra escolha;
- manter a profissão disponível na conta;
- permitir escolher a profissão adquirida em uma nova vida;
- evitar uma confirmação separada para cada profissão quando houver várias; uma confirmação geral é suficiente.

---

## 28. Conteúdo gratuito, adquirido e bens futuros

No estágio atual, não haverá conteúdo pago em produção.

A arquitetura deve apenas preservar a separação futura entre:

### Cosméticos

- cabelos;
- roupas;
- acessórios;
- aparência visual.

Cosméticos não devem alterar resultados do jogo.

### Vidas ou profissões

- pacotes narrativos completos;
- podem ser gratuitos ou adquiridos no futuro;
- aquisição libera conteúdo, não sucesso garantido.

### Bens do personagem

- casas;
- automóveis;
- outros patrimônios.

Quando alterarem deslocamento, custo, manutenção, conforto ou oportunidades, não serão apenas skins: serão bens da simulação.

---

## 29. Persistência futura com Firebase

O save local em IndexedDB continua útil para gravação imediata e funcionamento com conexão instável.

A sincronização futura deverá usar Firebase para:

- saves por usuário;
- múltiplas vidas;
- snapshots do personagem;
- recuperação em outro dispositivo;
- migrações;
- proteção contra perda de progresso.

Estrutura conceitual:

```text
users/{userId}/lives/{lifeId}
users/{userId}/lives/{lifeId}/snapshots/{snapshotId}
```

Snapshots devem ser criados em marcos relevantes, como:

- início ou fim de ano escolar;
- conclusão da escola;
- entrada em formação ou profissão;
- mudança de cidade;
- casamento;
- nascimento de filho;
- compra importante;
- migração de schema;
- fim de capítulo.

O save deve possuir revisão ou mecanismo equivalente para impedir que um estado antigo sobrescreva um estado mais novo.

As regras de segurança devem garantir que cada usuário acesse somente suas próprias vidas.

---

## 30. Estado implementado versus decisão aprovada

### Já implementado e publicado

- Prólogo Canônico v1.0 com um ano escolar jogável;
- arquitetura de pacotes e módulos;
- interface textual;
- relógio, escolhas, efeitos e save local;
- pessoas, categorias, relações e memórias;
- geração determinística de NPCs;
- prova técnica com pacote de futebol.

### Aprovado, ainda não implementado

- dois anos escolares obrigatórios;
- início no segundo ano e conclusão no terceiro;
- variação escolar em toda nova vida;
- pontes vocacionais durante a escola;
- ponte completa da vida Futebol;
- transição textual para profissão após a escola;
- confirmação ao ignorar profissão adquirida;
- Firebase para saves e snapshots.

Nenhum documento ou resposta futura deve afirmar que esses itens já estão jogáveis antes de evidências, testes, merge e produção.

---

## 31. Próximo escopo recomendado

Antes de ampliar a vida adulta, executar uma sprint de expansão escolar que:

1. migre o recorte para dois anos letivos;
2. preserve as cenas já válidas como módulos do segundo ano;
3. crie passagem clara entre segundo e terceiro ano;
4. adicione eventos próprios do terceiro ano;
5. implemente o contrato de ponte vocacional;
6. implemente a primeira ponte real, preferencialmente Futebol quando o conteúdo for aprovado;
7. crie a transição textual de fim da escola;
8. preserve saves existentes por migração explícita;
9. simule rotas dos dois anos;
10. audite datas, horários, relações e consequências.

---

## 32. Pendências futuras

- expansão escolar de dois anos;
- ponte Futebol completa;
- seleção textual de profissão após a escola;
- resolvedor executável de reencontros;
- banco geral de nomes;
- Firebase e snapshots;
- controle futuro de propriedade de conteúdo;
- cosméticos;
- bens patrimoniais diferenciados;
- biblioteca crescente de módulos profissionais.

Essas pendências não exigem reescrever o motor.

---

## 33. Critérios de aceite de um pacote

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

---

## 34. Critérios de aceite da expansão escolar

A vida escolar de dois anos somente será considerada concluída quando:

- começar no segundo ano e terminar no terceiro;
- exibir datas e passagem de ano de forma inequívoca;
- conservar eventos escolares variáveis entre vidas;
- permitir que relações evoluam, desapareçam ou retornem durante os dois anos;
- possuir eventos acadêmicos, sociais, familiares, físicos e financeiros nos dois anos;
- transferir estado coerente para a escolha pós-escola;
- pontes profissionais não substituírem a escola;
- a ponte Futebol respeitar treinos, jogos, deslocamentos, descanso, escola e risco de lesão;
- escolher outra profissão não apagar uma vida adquirida;
- todas as rotas respeitarem horário e localização;
- migração de saves anteriores estar testada;
- CI, auditorias e E2E passarem;
- produção ser validada.

---

## 35. Estado atual

- Sprint 0: concluída;
- Sprint 1: concluída;
- Prólogo Canônico v1.0: implementado e publicado;
- arquitetura modular: implementada e publicada;
- pacote escolar atual: um ano, jogável;
- decisão canônica seguinte: dois anos escolares obrigatórios;
- ponte profissional real: planejada, não implementada;
- conteúdo pago: adiado;
- Firebase: tecnologia definida para etapa futura.
