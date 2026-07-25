# Vidas Possíveis — Prólogo Canônico

**Versão:** 2.0  
**Data:** 25/07/2026  
**Recorte canônico:** personagem de classe média urbana brasileira, aproximadamente 16 anos, iniciando o segundo ano do Ensino Médio em 2026 e concluindo o terceiro ano em 2027, aos 17 ou 18 anos.  
**Estado:** tratamento narrativo canônico aprovado para orientar reescrita, implementação, testes e revisão. A versão jogável atual ainda não representa integralmente esta arquitetura de dois anos.  
**Base obrigatória:** Handoff canônico, Estado do Projeto, Arquitetura de Pacotes Narrativos e **Bíblia narrativa de Vidas Possíveis**.

> Este documento substitui a arquitetura narrativa do Prólogo Canônico v1.1.  
> Contratos técnicos já aprovados — relógio, persistência, pessoas, memórias, nomes, atributos, condições, conhecimentos, pacotes e migração de saves — permanecem válidos.

---

## 1. Premissa dramática

O prólogo acompanha dois anos em que o personagem ainda não possui uma profissão, uma renda própria estável nem autonomia completa, mas já está construindo a pessoa que chegará à vida adulta.

A pergunta central não é:

> “Que profissão você vai escolher?”

A pergunta central é:

> **“Quem você começa a ser quando as escolhas ainda parecem pequenas?”**

O jogador começa tentando chegar à escola no horário e termina do lado de fora do portão, depois da formatura, escolhendo qual vida tentará construir. Entre esses dois pontos, ônibus perdidos, trabalhos em grupo, refeições, provas, convites, brigas, cuidados familiares, treinos, faltas, promessas e silêncios passam a carregar história.

O prólogo deve provar, pela experiência, que:

- tempo é uma forma de escolha;
- dinheiro amplia opções, mas não apaga consequências;
- cansaço muda o modo como uma pessoa age;
- reputação é uma versão de você que circula sem sua presença;
- relações não mudam por um único gesto, mas um gesto pode mudar a direção;
- uma memória pequena pode voltar com outro peso meses ou anos depois;
- o futuro profissional começa como curiosidade, oportunidade, hábito, renúncia e vínculo;
- terminar a escola não resolve tudo, mas transforma convivência obrigatória em distância possível.

---

## 2. Promessa emocional ao jogador

A narrativa deve produzir cinco sensações ao longo dos dois anos:

1. **Reconhecimento**  
   O jogador identifica a vida escolar brasileira sem encontrar caricatura: o portão, o ônibus, a merenda, a lanchonete, a quadra, o grupo de mensagens, o professor substituto, a prova, o trabalho que alguém não terminou, o passeio que custa dinheiro e a pergunta insistente sobre o futuro.

2. **Pertencimento instável**  
   O jogador percebe que está sempre ocupando uma posição provisória entre pessoas: amigo, colega, reserva, líder, alguém confiável, alguém difícil, alguém que sumiu, alguém que ficou.

3. **Pressão crescente**  
   No segundo ano, escolhas parecem experimentos. No terceiro, as mesmas escolhas passam a competir com datas, inscrições, expectativas familiares, trabalho, provas, treinos e despedidas.

4. **Memória**  
   O jogo lembra sem transformar cada retorno em punição ou prêmio. Uma ajuda pode voltar como confiança; uma humilhação pode voltar como cautela; uma promessa quebrada pode tornar uma conversa mais curta; um afastamento pode permanecer sem resolução.

5. **Fechamento imperfeito**  
   A formatura encerra uma geografia emocional, não todos os conflitos. Algumas pessoas se despedem, outras prometem contato, outras já estão distantes antes da última foto. O final deve parecer merecido, mesmo quando não é feliz.

---

## 3. Eixo de escrita

Toda cena do prólogo segue o eixo:

> **Narração direta na ação, complexidade indireta nas relações, subtexto no diálogo, consequência no tempo.**

Isso exige:

- situação clara;
- horário, local, atividade e compromisso coerentes;
- descrição concreta e seletiva;
- diálogos que não expliquem tudo;
- escolhas legíveis antes de surpreender;
- mudança real após a cena;
- memória ou custo preservado quando caminhos convergem.

A prosa não deve tentar parecer “grande literatura” em todas as telas. A força deve vir da precisão.

Exemplo correto:

> O ônibus passa em doze minutos. Seu café ainda está quente, e a mensagem do grupo continua sem resposta. Um carro chegaria em quatro minutos, mas custaria quase o que você separou para a semana.

Exemplo inadequado:

> O destino batia à porta enquanto a juventude escorria inexoravelmente entre os dedos do tempo.

---

## 4. Estrutura geral dos dois anos

O prólogo é dividido em cinco movimentos.

### Movimento I — Impressões
**Fevereiro a março de 2026**

O jogador descobre quem está ao redor, como administra tempo e dinheiro, o que faz sob pressão e que posição ocupa num grupo.

Pergunta dramática:

> **“Como você age quando ainda ninguém decidiu quem você é?”**

### Movimento II — Pertencimento
**Abril a dezembro de 2026**

As primeiras escolhas ganham testemunhas. Amizades, atritos, família, dinheiro e interesses vocacionais passam a disputar o mesmo calendário.

Pergunta dramática:

> **“Onde você pertence, e o que aceita fazer para continuar pertencendo?”**

### Movimento III — Distância
**Férias e passagem para 2027**

O corredor desaparece. Sem a convivência diária, algumas relações sobrevivem e outras revelam que existiam apenas por proximidade.

Pergunta dramática:

> **“Quem continua existindo na sua vida quando ninguém é obrigado a aparecer?”**

### Movimento IV — Prazo
**Fevereiro a novembro de 2027**

O futuro deixa de ser uma conversa distante. Provas, inscrições, dinheiro, trabalho, treinos, saúde e expectativas familiares criam decisões sem solução limpa.

Pergunta dramática:

> **“O que você sustenta quando já não cabe tudo?”**

### Movimento V — Saída
**Dezembro de 2027**

A escola termina. O jogador encerra relações, aceita incertezas e escolhe um caminho pós-escola carregado pela vida que viveu.

Pergunta dramática:

> **“Que vida você está disposto a tentar, sabendo o que ela já começou a exigir?”**

---

## 5. Arquitetura: marcos fixos e módulos variáveis

O prólogo não é uma árvore infinita nem uma sequência rígida idêntica em todas as vidas.

### 5.1. Marcos fixos

Toda vida deve conter:

1. manhã de abertura e escolha de deslocamento;
2. formação do primeiro grupo de trabalho;
3. falha do colega principal;
4. apresentação e consequência;
5. ao menos um conflito entre vida escolar e vida fora da escola;
6. encerramento visível do segundo ano;
7. passagem de ano com retorno de memórias;
8. abertura do terceiro ano;
9. retorno de pessoa ou consequência de 2026;
10. conflito entre futuro e obrigação presente;
11. despedida/formatura;
12. escolha pós-escola.

### 5.2. Módulos variáveis

Cada vida seleciona combinações diferentes de:

- prova em dupla;
- professor substituto;
- aula vaga;
- Educação Física;
- jogos entre turmas;
- shopping;
- parque;
- festa;
- encontro;
- falta à escola;
- castigo;
- casa sem responsáveis;
- cuidado com parente;
- trabalho eventual;
- dificuldade financeira;
- fofoca;
- provocação;
- briga;
- reconciliação;
- romance opcional;
- curso livre;
- oficina;
- treino;
- peneira;
- visita profissional;
- projeto comunitário;
- inscrição, entrevista ou teste.

### 5.3. Regra de convergência

Dois jogadores podem chegar à mesma apresentação, ao mesmo início de terceiro ano ou à mesma formatura. O jogo não pode apagar o caminho.

A convergência preserva:

- quem está presente;
- o modo como a pessoa fala;
- Confiança, Proximidade e Tensão;
- promessas e conflitos;
- dinheiro gasto ou preservado;
- Energia, Estresse e Saúde;
- reputação;
- conhecimentos;
- oportunidades;
- memórias;
- interpretação do acontecimento.

---

## 6. Elenco funcional

Os nomes são gerados deterministicamente e persistidos. A função dramática não depende de um nome fixo.

### 6.1. Colega principal do grupo

**Papel:** primeira relação em que o jogador precisa decidir entre desempenho, justiça, compaixão e limite.  
**Desejo:** evitar fracassar publicamente e continuar pertencendo ao grupo.  
**Medo:** ser exposto como incapaz, irresponsável ou dispensável.  
**Contradição:** pode ser confiável e falhar; pode ser irresponsável e, desta vez, possuir um motivo real.  
**Ponto cego:** acredita que explicar tarde ainda é quase o mesmo que avisar antes.  
**Modo de pedir:** reduz o tamanho do problema antes de admitir o que precisa.  
**Gesto recorrente:** confere o celular ou reorganiza um caderno quando evita uma resposta.  
**Possíveis vínculos:** colega, amizade, rivalidade, romance opcional, afastamento, contato profissional futuro.  
**Retornos plausíveis:** prova em dupla, festa, pedido de ajuda, indicação, reencontro profissional, conflito não resolvido.

A pessoa começa como **pessoa conhecida**, nunca automaticamente como pessoa importante.

### 6.2. Amigo ou amiga de convivência

**Papel:** representa pertencimento, diversão, pressão social e a diferença entre companhia e intimidade.  
**Desejo:** manter o grupo unido e evitar ficar de fora.  
**Medo:** ser substituído ou parecer desinteressante.  
**Contradição:** convida e acolhe, mas pode pressionar; faz piada para aliviar, mas às vezes ultrapassa o limite.  
**Retornos:** convites, faltas, festas, confidências, apoio, distanciamento nas férias, despedida.

### 6.3. Colega de atrito

**Papel:** cria tensão sem funcionar como vilão.  
**Desejo:** reconhecimento, posição, nota, atenção ou controle da própria imagem.  
**Medo:** parecer inferior ou irrelevante.  
**Contradição:** pode provocar o jogador e defendê-lo em outro contexto; pode competir com honestidade e perder o limite sob pressão.  
**Retornos:** fofoca, disputa acadêmica, jogo, briga, reconciliação, colaboração inesperada.

### 6.4. Pessoa de ponte profissional

**Papel:** transforma curiosidade em possibilidade concreta.  
**Desejo:** encontrar alguém que leve a oportunidade a sério.  
**Medo:** investir tempo em quem não sustenta compromisso.  
**Contradição:** pode ser exigente e generoso; pode reconhecer potencial sem prometer sucesso.  
**Retornos:** treino, oficina, teste, indicação, avaliação, convite, recusa fundamentada.

### 6.5. Família

A família não é um obstáculo genérico nem uma fonte automática de apoio.

Cada responsável ou parente possui:

- rotina;
- cansaço;
- preocupações;
- limites financeiros;
- modo próprio de demonstrar afeto;
- expectativas;
- memória das escolhas do jogador.

Conflitos familiares devem nascer de interesses legítimos: segurança, dinheiro, cuidado, confiança, trabalho, notas, autonomia e tempo.

### 6.6. Possível romance

Romance não é personagem obrigatório nem recompensa por elevar Proximidade.

Ele exige:

- preferência compatível;
- reciprocidade;
- convivência;
- abertura;
- contexto;
- ausência de impedimento relevante;
- escolha explícita ou aproximação gradual.

Amizade, afastamento e relação não correspondida são resultados completos.

---

# PARTE I — SEGUNDO ANO DO ENSINO MÉDIO

## 7. Capítulo 1 — Antes do portão

**Data de referência:** segunda-feira, 16/02/2026  
**Horário inicial:** 06:10  
**Local:** casa  
**Compromisso:** primeira aula às 07:30

### Função dramática

A primeira escolha apresenta o tema central: não cabe tudo.

### Situação

O despertador toca enquanto o grupo da turma acumula mensagens. A mochila está quase pronta. O café depende de tempo. O ônibus possui horário. O motorista de aplicativo resolve parte do atraso, mas consome dinheiro que também serve para lanche, passeio ou emergência.

### Texto-base de abertura

> O despertador toca às 06:10 e para de tocar quando você acerta a tela pela segunda vez. A casa ainda está mais escura do que silenciosa. Na cozinha, alguém deixou café na garrafa. No celular, o grupo da turma já discute sala, professor e quem mudou de horário.
>
> A primeira aula começa às 07:30. O ônibus que costuma dar margem passa em vinte minutos. O seguinte ainda chega a tempo, desde que o trânsito não pare. Um carro por aplicativo chegaria rápido, mas levaria quase o dinheiro que você separou para pequenos gastos da semana.
>
> Antes de sair, ainda existe a possibilidade de comer. Existe também a possibilidade de fechar os olhos por mais dez minutos e transformar o resto da manhã numa corrida.

### Escolhas canônicas

- tomar café e pegar o ônibus com margem;
- comer rápido e tentar o ônibus mais cedo;
- dormir mais e chamar um carro;
- sair sem comer e preservar dinheiro;
- pedir ajuda a alguém da casa, quando a relação e o contexto permitirem.

### Consequências

A escolha altera:

- Energia;
- dinheiro;
- Estresse;
- horário de chegada;
- primeira interação na escola;
- percepção familiar sobre responsabilidade;
- memória de deslocamento, quando houver promessa ou conflito.

Nenhuma opção é apresentada como moralmente correta.

---

## 8. Capítulo 2 — Quem já chegou

**Horário:** entre 07:05 e 07:35  
**Local:** portão, pátio ou sala

### Função dramática

Apresentar o elenco por comportamento e não por ficha.

### Variação por chegada

**Chegada cedo:**  
O jogador encontra poucas pessoas. Pode ajudar alguém, revisar, observar uma discussão ou conversar sem o ruído da turma.

**Chegada no limite:**  
O corredor já se move. A decisão é entre guardar o celular, responder alguém, correr ou aceitar entrar depois do sinal.

**Atraso:**  
O jogador encontra portão fechando, justificativa a dar ou colega tentando segurar a porta. A cena não pune apenas com ponto; ela cria testemunhas.

### Regra

Antes de uma decisão relevante envolvendo pessoa conhecida, o jogador pode acessar **“Quem é esta pessoa?”**, com contexto que o personagem já saberia.

---

## 9. Capítulo 3 — Um nome na mesma folha

**Horário:** 07:30  
**Local:** sala  
**Evento:** trabalho de Português com apresentação na sexta-feira às 08:00

### Função dramática

Criar o primeiro compromisso coletivo e estabelecer que desempenho depende de pessoas.

### Situação

A professora organiza os grupos ou permite uma escolha parcial. O colega principal entra no grupo. Seu passado é apresentado por detalhe específico, não por rótulo:

- já ajudou o jogador;
- já provocou e também o defendeu;
- costuma ser responsável;
- costuma abandonar tarefas.

### Tensão

O grupo precisa dividir partes sem saber como será a semana de cada integrante.

### Escolhas

- assumir a organização;
- propor divisão equilibrada;
- escolher a parte mais simples;
- deixar outra pessoa coordenar;
- tentar evitar o colega principal;
- aceitar o grupo e observar antes de confiar.

### Memória criada

`primeiro_acordo_trabalho_2026`

A memória registra:

- quem definiu as tarefas;
- quem prometeu o quê;
- quem demonstrou confiança ou desconfiança;
- prazo combinado;
- testemunhas.

---

## 10. Capítulo 4 — A bandeja e o balcão

**Horário:** 10:00  
**Local:** refeitório e lanchonete

### Função dramática

Transformar alimentação e dinheiro em cena social, não em botão de recurso.

### Situação

A bandeja da merenda bate no balcão. A lanchonete vende algo mais atraente. Um colega está sem dinheiro. Outro comenta o passeio do fim de semana. O jogador pode comer, gastar, dividir ou fingir que não está com fome.

### Escolhas

- comer a merenda e sentar com alguém;
- comprar lanche;
- dividir o que comprou;
- ajudar alguém com parte do dinheiro;
- não comer para economizar;
- comer sozinho para evitar uma conversa.

### Subtexto possível

A decisão pode revelar:

- vergonha;
- cuidado;
- desejo de pertencer;
- receio de gastar;
- tentativa de evitar conflito;
- generosidade com custo real.

### Memórias

O jogo não registra “foi bom”. Registra fatos específicos, como:

- dividiu lanche quando a pessoa estava sem dinheiro;
- recusou ajuda de forma respeitosa;
- fez piada com a situação;
- gastou o dinheiro reservado para transporte.

---

## 11. Capítulo 5 — O lado da quadra

**Horário:** 10:20  
**Local:** quadra  
**Atividade variável:** futsal, vôlei, corrida ou revezamento

### Função dramática

Usar o corpo como parte da identidade social adolescente.

### Conflitos possíveis

- vontade de competir versus medo de passar vergonha;
- talento versus falta de preparo;
- necessidade de descansar versus pressão da turma;
- oportunidade de ajudar alguém versus chance de se destacar;
- provocação versus autocontrole.

### Escolhas

- jogar com intensidade;
- participar sem se expor;
- ajudar uma pessoa insegura;
- pedir para ficar de fora;
- assumir liderança;
- reagir a provocação;
- observar uma habilidade ligada a uma ponte profissional.

### Ponte Futebol

Quando o pacote Futebol estiver disponível, a cena pode introduzir:

- comentário de professor ou treinador;
- convite para treino;
- observação de Controle de bola, Tática ou Preparação física;
- rivalidade esportiva;
- percepção de que talento não substitui rotina.

A cena não pode anunciar “você será jogador”. Ela apresenta uma possibilidade que exigirá tempo.

---

## 12. Capítulo 6 — Cinquenta minutos sem professor

**Horário:** 11:10  
**Local:** sala, corredor ou pátio

### Função dramática

Mostrar quem o personagem é quando a autoridade desaparece.

### Situações possíveis

- aula vaga;
- professor substituto;
- turma testando limites;
- colega sendo ridicularizado;
- oportunidade de terminar parte do trabalho;
- convite para sair escondido.

### Escolhas

- usar o tempo para o trabalho;
- conversar;
- colaborar com o substituto;
- permanecer neutro;
- defender alguém;
- liderar a bagunça;
- sair escondido;
- aproveitar para outra obrigação.

### Consequências

- frequência;
- reputação;
- relação com a turma;
- conteúdo;
- advertência;
- tempo disponível depois;
- memória com professor ou colega.

Sair da escola altera local, horário e deslocamento. Não existe ausência abstrata.

---

## 13. Capítulo 7 — O arquivo que não chegou

**Horário:** quarta-feira, 16:05  
**Local inicial:** corredor lateral, biblioteca, casa ou conversa por mensagem  
**Compromisso:** apresentação na sexta-feira às 08:00

### Função dramática

É o primeiro grande dilema relacional. O jogador precisa decidir sem possuir certeza completa.

### Situação

O colega principal admite que não terminou a parte. O motivo atual precisa ser compatível com o passado, mas o passado não decide sozinho a verdade.

### Texto-base

> O corredor já está quase vazio. De uma sala no fim vêm carteiras arrastando no piso. Você confere o celular de novo. O arquivo continua sem aparecer.
>
> {nome} dobra a esquina com o caderno apertado contra o corpo. Não chega sorrindo. Também não evita seu olhar.
>
> — Eu não terminei.
>
> A frase sai rápida, como se a velocidade diminuísse o tamanho do problema.
>
> Faltam menos de dois dias. Você já fez a sua parte. O resto do grupo ainda acredita que o material está quase pronto.
>
> {nome} passa o polegar pela borda do caderno.
>
> — Eu consigo explicar. Só não sei se vai fazer diferença agora.

### Primeira decisão

Antes de resolver, o jogador pode:

- perguntar o que aconteceu;
- lembrar do histórico;
- pedir para ver o que já foi feito;
- chamar outro integrante;
- decidir sem ouvir.

### Escolhas principais

1. **Ajudar a terminar**  
   Custa tempo, Energia e talvez outra obrigação. Pode construir confiança, mas também criar dependência.

2. **Criar um plano com prazo e divisão clara**  
   Preserva limite e oferece chance. Exige acompanhamento e pode falhar.

3. **Dar uma última chance sem assumir a tarefa**  
   Preserva o próprio tempo, mas aumenta risco da apresentação.

4. **Retirar a pessoa da parte principal e reorganizar o grupo**  
   Protege o trabalho, mas afeta pertencimento, reputação e relação.

5. **Expor a falha diante do grupo ou da professora**  
   Pode parecer transparência ou humilhação, conforme linguagem, contexto e necessidade.

6. **Encerrar a conversa e fazer tudo sozinho**  
   Garante controle parcial, aumenta cansaço e pode ensinar aos outros que o jogador sempre absorverá o problema.

### Memórias possíveis

- `ajuda_em_prazo_curto`;
- `limite_com_segunda_chance`;
- `retirada_do_grupo`;
- `exposicao_publica`;
- `promessa_de_entrega`;
- `trabalho_assumido_sozinho`;
- `motivo_ouvido`;
- `motivo_ignorado`.

### Retorno obrigatório

A decisão volta:

- na apresentação;
- depois da nota;
- em ao menos uma cena do segundo ou terceiro ano;
- potencialmente na vida adulta, por meio do Resolvedor de Reencontros.

---

## 14. Capítulo 8 — O que cabe antes de dormir

**Horário:** quarta ou quinta-feira, fim da tarde e noite  
**Locais:** biblioteca, casa, chamada de vídeo, comércio familiar ou casa de parente

### Função dramática

Colocar o trabalho escolar em conflito com uma obrigação legítima.

### Obrigações possíveis

- ajudar em casa;
- cuidar de irmão ou irmã;
- acompanhar parente;
- trabalhar algumas horas;
- cumprir castigo;
- resolver algo prometido;
- descansar por exaustão;
- comparecer a treino ou atividade vocacional.

### Escolhas

- renegociar horário;
- cumprir a obrigação e reduzir preparação;
- abandonar a obrigação;
- pedir ajuda;
- trabalhar de madrugada;
- aceitar uma apresentação menos preparada;
- mentir sobre o motivo.

### Regra emocional

A família não deve dizer “você não se importa com seus estudos” apenas para criar drama. O conflito surge porque todos possuem necessidades reais.

---

## 15. Capítulo 9 — Confiança em dupla

**Data:** quinta-feira  
**Evento:** exercício ou prova em dupla

### Função dramática

Testar a relação após a decisão do trabalho.

### Variações

- o colega principal sabe uma resposta importante;
- o jogador sabe mais e precisa decidir quanto ajuda;
- alguém propõe copiar;
- o professor permite consulta limitada;
- a dupla é formada com pessoa de atrito;
- o jogador precisa escolher parceiro e deixa alguém de fora.

### Consequências

A cena registra:

- cooperação;
- apropriação de resposta;
- ajuda respeitosa;
- dependência;
- mentira;
- confiança;
- ressentimento;
- memória de ter sido escolhido ou rejeitado.

---

## 16. Capítulo 10 — Sexta-feira, 08:00

**Data:** 20/02/2026  
**Compromisso:** apresentação às 08:00

### Função dramática

Recompensar preparação sem fingir que o resultado depende de uma única escolha.

### Antes da apresentação

O jogador precisa administrar:

- sono;
- café;
- ônibus ou aplicativo;
- material;
- mensagens;
- presença dos integrantes;
- nervosismo;
- possível atraso;
- conflito ainda aberto.

Chegar cedo cria atividade de espera, revisão ou conversa. “Apresentar o trabalho” só começa no horário ou depois.

### Resultado

Considera:

- Comunicação;
- Raciocínio;
- conhecimento do tema;
- preparação;
- Energia;
- Estresse;
- atraso;
- materiais;
- organização;
- presença;
- relação do grupo;
- decisões anteriores.

### Faixas narrativas

- excelente;
- boa;
- irregular;
- fraca;
- desastrosa com possibilidade de recuperação.

A interface não mostra rolagem, modificadores ou fórmula.

### Transformação

O ponto central não é a nota. É o que a apresentação confirma ou desmente sobre cada pessoa.

---

## 17. Capítulo 11 — Depois que todo mundo senta

**Horário:** após a apresentação ou depois da nota

### Função dramática

Encerrar o primeiro arco sem fechar a relação de maneira automática.

### Reações possíveis do colega

- agradece sem saber como continuar;
- pede desculpas;
- minimiza o que aconteceu;
- assume a responsabilidade;
- culpa o grupo;
- evita o jogador;
- convida para algo;
- devolve ajuda;
- permanece em silêncio.

### Mudança de categoria

A pessoa pode:

- continuar conhecida;
- aproximar-se gradualmente;
- tornar-se importante após continuidade real;
- ficar distante;
- permanecer com tensão;
- tornar-se inativa;
- abrir possibilidade de romance sem iniciá-lo automaticamente.

---

# PARTE II — O RESTO DO SEGUNDO ANO

## 18. Capítulo 12 — Um convite com preço

**Período:** abril ou maio  
**Locais:** shopping, parque, praça, lanchonete ou encontro simples

### Função dramática

Mostrar que lazer custa dinheiro, tempo, autorização e presença em outras responsabilidades.

### Tensão

O grupo combina algo. O jogador quer participar, mas:

- o dinheiro é curto;
- o último ônibus possui horário;
- existe tarefa em casa;
- haverá prova;
- alguém que o jogador evita também irá;
- o convite pode ser uma tentativa de aproximação.

### Escolhas

- ir de ônibus e voltar cedo;
- gastar com aplicativo;
- negociar em casa;
- recusar e explicar;
- mentir;
- sugerir programa mais barato;
- ir sem gastar;
- priorizar outra obrigação.

### Memória

O que importa não é apenas “foi ao shopping”. Importa:

- quem tentou incluí-lo;
- quem julgou sua limitação;
- quem aceitou mudar o plano;
- quem ficou esperando;
- qual promessa foi feita para a volta.

---

## 19. Capítulo 13 — O dia em que você poderia desaparecer

**Período:** maio ou junho  
**Situação:** aula vaga, manhã cansativa ou convite para faltar

### Função dramática

Criar uma escolha de autonomia com custo real, sem moral pronta.

### Opções

- permanecer na escola;
- sair e ir ao parque;
- acompanhar amigos;
- voltar para casa;
- usar o tempo para trabalho;
- mentir para a família;
- avisar e assumir a consequência.

### Retornos

A falta pode alterar:

- presença;
- conteúdo;
- confiança familiar;
- intimidade com o grupo;
- testemunhas;
- reputação;
- acesso a evento futuro;
- versão de uma fofoca.

---

## 20. Capítulo 14 — A casa também tem horário

**Período:** junho ou julho  
**Situação variável:** cuidar de parente, buscar criança, ajudar em comércio, organizar casa, acompanhar consulta ou ficar sozinho

### Função dramática

Tratar responsabilidades familiares como parte central da adolescência.

### Conflito

O jogador não escolhe entre “família” e “egoísmo”. Escolhe entre necessidades que não cabem juntas.

### Possíveis transformações

- família reconhece responsabilidade;
- promessa é quebrada;
- amigo interpreta ausência como desinteresse;
- oportunidade escolar é perdida;
- jogador encontra solução criativa;
- cansaço acumulado afeta prova ou treino;
- parente compartilha uma história que muda a percepção do futuro.

---

## 21. Capítulo 15 — A sala testa quem chegou

**Período:** agosto  
**Evento:** professor substituto

### Função dramática

Criar conflito social sem depender de um antagonista único.

### Situação

A turma percebe insegurança ou rigidez no substituto. Alguns testam limites. Outra pessoa vira alvo de piada.

### Escolhas

- colaborar;
- permanecer neutro;
- participar da bagunça;
- usar a aula para outra matéria;
- defender alguém;
- confrontar o professor;
- tentar vantagem indevida.

### Subtexto

A cena pode falar sobre autoridade, covardia coletiva, necessidade de aprovação e medo de ser o próximo alvo.

---

## 22. Capítulo 16 — A versão que circula

**Período:** agosto ou setembro  
**Evento:** fofoca nascida de acontecimento real

### Função dramática

Mostrar que reputação é uma narrativa compartilhada.

### Fontes possíveis

- retirada do colega do grupo;
- falta;
- festa;
- conversa íntima;
- briga;
- desempenho na quadra;
- castigo;
- recusa de convite;
- proximidade com alguém.

### Escolhas

- conversar com a origem;
- corrigir sem espetáculo;
- responder com humor;
- ignorar;
- confrontar em público;
- pedir ajuda;
- espalhar outra versão;
- partir para agressão em situação extrema.

### Regra

A fofoca nunca surge por sorteio sem causa. A informação pode ser distorcida, mas precisa ter raiz em algo vivido.

---

## 23. Capítulo 17 — O corpo em público

**Período:** setembro ou outubro  
**Evento:** jogos entre turmas, treino, apresentação física, lesão leve ou avaliação

### Função dramática

Aprofundar vergonha, orgulho, disciplina, saúde e pertencimento.

### Possibilidades

- jogador se destaca;
- falha diante de testemunhas;
- ajuda rival lesionado;
- esconde dor;
- recusa participar;
- recebe convite profissional;
- perde posição;
- descobre prazer em uma atividade;
- percebe que o corpo está pagando pelo excesso de compromissos.

### Ponte Futebol

A partir daqui, a trajetória pode ganhar rotina:

- treino depois da escola;
- deslocamento;
- posição;
- disputa;
- orientação;
- banco;
- jogo no fim de semana;
- recuperação;
- conflito com família, prova ou festa.

---

## 24. Capítulo 18 — O que não foi dito no passeio

**Período:** outubro ou novembro  
**Evento:** parque, festa, encontro ou casa sem responsáveis

### Função dramática

Criar intimidade, conflito ou afastamento com subtexto.

### Possíveis núcleos

- alguém tenta falar sobre interesse afetivo e desvia;
- amigo pede ajuda sem admitir;
- pessoa de atrito revela vulnerabilidade;
- jogador percebe que ficou de fora de algo;
- promessa é feita;
- limite é respeitado ou atravessado;
- responsabilidade pelo retorno recai sobre alguém;
- colega passa mal e precisa de cuidado.

### Romance

Pode surgir como:

- convite individual;
- conversa interrompida;
- aproximação física consentida;
- mensagem posterior;
- recusa respeitosa;
- ambiguidade ainda não resolvida.

Não existe “romance desbloqueado” por pontuação.

---

## 25. Capítulo 19 — A última nota do ano

**Período:** novembro e dezembro

### Função dramática

Fechar o segundo ano por acumulação.

### Pressões

- prova final;
- recuperação;
- trabalho;
- treino;
- dinheiro;
- festa;
- família;
- cansaço;
- relação em crise;
- promessa pendente.

### Escolhas

O jogador precisa aceitar que alguma coisa receberá menos tempo.

### Resultado

O encerramento registra:

- notas e frequência;
- pessoas próximas;
- pessoas apenas conhecidas;
- pessoas afastadas;
- conflitos abertos;
- promessas;
- dinheiro;
- saúde;
- interesses;
- conhecimentos;
- ponte profissional;
- reputação;
- cenas elegíveis para retorno.

---

# PARTE III — A PASSAGEM DE ANO

## 26. Capítulo 20 — Quando a escola some

**Período:** dezembro de 2026 a fevereiro de 2027

### Função dramática

Transformar tempo em narrativa, sem salto silencioso.

### Estrutura

A passagem escolhe de três a cinco imagens específicas baseadas na vida:

- uma mensagem respondida ou ignorada;
- um grupo que ficou silencioso;
- uma foto de pessoas saindo sem o jogador;
- treino em manhã de férias;
- turno de trabalho;
- visita a parente;
- conversa familiar;
- material de curso;
- encontro breve;
- promessa adiada;
- aniversário;
- pessoa que mudou de cidade ou de turma.

### Texto-base adaptativo

> Sem o sinal, os dias perdem a divisão que a escola impunha. Algumas pessoas continuam no celular. Outras desaparecem depressa demais para quem, até dezembro, ocupava a cadeira ao lado.
>
> {memória 1}
>
> {memória 2}
>
> {memória 3}
>
> Quando fevereiro se aproxima, o uniforme ainda serve, mas nem tudo volta ao mesmo lugar.

### Regras

- data anterior e posterior visíveis;
- nenhuma relação muda fortemente sem fato narrado;
- pessoas podem ficar distantes sem conflito;
- férias não curam automaticamente tensão;
- compromisso profissional pode continuar;
- trabalho, família e saúde podem avançar;
- ao menos uma escolha de 2026 prepara retorno em 2027.

---

# PARTE IV — TERCEIRO ANO DO ENSINO MÉDIO

## 27. Capítulo 21 — A cadeira que ficou vazia

**Período:** fevereiro de 2027  
**Local:** sala

### Função dramática

Mostrar mudança sem discurso expositivo.

### Situação

A sala parece igual até o jogador notar:

- pessoa em outra turma;
- cadeira vazia;
- novo lugar escolhido;
- casal que terminou;
- amigo mais distante;
- colega que voltou diferente;
- professor que fala sobre “último ano” cedo demais.

### Escolhas

- sentar com pessoa conhecida;
- procurar alguém afastado;
- escolher lugar novo;
- evitar conflito;
- acolher pessoa nova;
- permanecer sozinho.

### Transformação

O terceiro ano começa pela reorganização social, não por uma palestra sobre vestibular.

---

## 28. Capítulo 22 — O formulário, a taxa e a data

**Período:** março ou abril  
**Evento:** inscrição, curso, processo seletivo, prova, peneira ou oportunidade

### Função dramática

Dar forma concreta ao futuro.

### Componentes

- prazo;
- documento;
- dinheiro;
- deslocamento;
- preparação;
- autorização;
- medo de tentar;
- informação incompleta;
- ajuda possível.

### Escolhas

- inscrever-se;
- pedir ajuda;
- adiar;
- abandonar;
- escolher opção mais acessível;
- trabalhar para pagar;
- priorizar outra oportunidade;
- esconder a inscrição da família;
- conversar antes de decidir.

### Consequência

Não se inscrever pode ser coerente. Inscrever-se não garante sucesso. A escolha registra que oportunidade foi perseguida, abandonada ou adiada.

---

## 29. Capítulo 23 — Alguém lembra

**Período:** abril ou maio  
**Evento:** retorno obrigatório de pessoa ou consequência de 2026

### Função dramática

Provar que o jogo possui memória social.

### Papéis possíveis do retorno

- colega pede nova parceria;
- pessoa evita trabalhar com o jogador;
- amigo cobra promessa;
- rival oferece colaboração;
- professor lembra esforço;
- pessoa ajudada oferece informação;
- pessoa humilhada mantém distância;
- colega do grupo devolve ajuda;
- contato profissional indica teste;
- alguém menciona o jogador de forma indireta.

### Regra

O retorno não é vingança automática nem recompensa mecânica. Ele precisa ser plausível no papel, na localização, no tempo e na trajetória da pessoa.

---

## 30. Capítulo 24 — Duas obrigações às 16:00

**Período:** maio ou junho  
**Evento:** conflito de agenda

### Possibilidades

- prova e trabalho;
- cuidado familiar e curso;
- treino e apresentação;
- entrevista e compromisso com amigo;
- turno pago e revisão;
- festa importante e jogo;
- encontro afetivo e responsabilidade doméstica.

### Função dramática

Fazer o jogador escolher o que sustenta quando já não cabe tudo.

### Escolhas

- priorizar uma obrigação;
- negociar;
- dividir tempo e aceitar desempenho menor;
- pedir substituição;
- mentir;
- desistir de algo;
- assumir custo financeiro;
- sacrificar descanso.

### Memória

A pessoa afetada lembra não apenas a ausência, mas:

- se houve aviso;
- quando houve aviso;
- como o jogador falou;
- se tentou reparar;
- se já existia histórico parecido.

---

## 31. Capítulo 25 — A noite antes

**Período:** junho ou agosto  
**Evento:** festa, encontro, passeio ou casa sem responsáveis na véspera de prova, treino ou entrevista

### Função dramática

Evitar a escolha simplista “diversão ruim versus estudo bom”.

### Tensões

- despedida de alguém;
- oportunidade de intimidade;
- necessidade de descanso;
- medo de ficar de fora;
- compromisso no dia seguinte;
- transporte de volta;
- dinheiro;
- autorização;
- cuidado com amigo.

### Resultados possíveis

- noite boa com custo real;
- recusa que protege objetivo e afasta alguém;
- presença curta e responsável;
- mentira descoberta;
- transporte perdido;
- conversa decisiva;
- cansaço que afeta desempenho;
- memória afetiva que ainda assim valeu o custo para aquele personagem.

---

## 32. Capítulo 26 — Quando o corpo pede pausa

**Período:** agosto ou setembro  
**Evento:** exaustão, lesão, doença, ansiedade situacional ou queda de rendimento

### Função dramática

Impedir que Energia e Saúde sejam apenas barras.

### Situação

O corpo interfere no plano. O jogador pode:

- descansar;
- esconder;
- procurar ajuda;
- insistir;
- abandonar compromisso;
- reduzir carga;
- aceitar perder posição;
- transferir responsabilidade;
- automedicar-se de forma inadequada, com consequência responsável e sem glamourização.

### Ponte Futebol

Lesão, fadiga ou queda técnica pode:

- retirar o jogador de um jogo;
- mudar posição;
- gerar banco;
- abrir recuperação;
- alterar reputação;
- testar relação com treinador;
- encerrar ou redirecionar a trajetória.

---

## 33. Capítulo 27 — O futuro que os outros imaginam

**Período:** setembro ou outubro  
**Local:** casa, escola, trabalho ou conversa após treino

### Função dramática

Confrontar expectativas sem transformar família ou mentor em porta-voz da moral.

### Vozes possíveis

- responsável quer estabilidade;
- professor percebe potencial acadêmico;
- treinador exige compromisso;
- amigo deseja que o grupo continue junto;
- pessoa romântica teme distância;
- chefe oferece mais horas;
- jogador deseja algo que ainda não sabe defender.

### Escolhas

- concordar;
- confrontar;
- pedir tempo;
- apresentar plano;
- esconder dúvida;
- aceitar caminho provisório;
- recusar;
- combinar teste com prazo;
- escolher sem aprovação.

### Subtexto

Muitas falas sobre carreira são falas sobre medo, dinheiro, orgulho, separação e controle.

---

## 34. Capítulo 28 — A decisão que não acontece de uma vez

**Período:** outubro e novembro

### Função dramática

Construir escolha profissional por acumulação, não por menu solto.

### Estrutura

O jogo reúne sinais da trajetória:

- conhecimentos;
- hábitos;
- desempenho;
- dinheiro;
- saúde;
- pessoas;
- oportunidades;
- pontes;
- inscrições;
- recusas;
- responsabilidades;
- preferências demonstradas;
- experiências de trabalho.

O jogador ainda pode escolher caminhos diferentes, mas o texto reconhece o que cada um exigirá naquela vida específica.

### Exemplo

Futebol não aparece apenas como “seguir Futebol”. Aparece como:

- continuar numa base que exige deslocamento e treino;
- aceitar teste em outro clube;
- insistir após lesão;
- conciliar trabalho e futebol amador;
- abandonar a trajetória;
- priorizar estudo mantendo esporte;
- seguir outro caminho apesar de ter construído a ponte.

---

## 35. Capítulo 29 — O último dia comum

**Período:** novembro ou início de dezembro

### Função dramática

Criar emoção pela normalidade que está acabando.

### Cena

Não é a formatura. É o último dia em que algo ainda parece rotina:

- chamada;
- fila da merenda;
- quadro sujo;
- quadra vazia;
- professor pedindo silêncio;
- grupo discutindo foto;
- colega devolvendo objeto;
- alguém dizendo “amanhã a gente vê” quando talvez não exista amanhã igual.

### Escolhas

- procurar alguém;
- devolver algo;
- pedir desculpas;
- evitar conversa;
- registrar foto;
- ficar até mais tarde;
- sair cedo;
- fazer uma promessa;
- não prometer o que não acredita que cumprirá.

### Memória

A cena seleciona uma imagem física para representar a escola na vida adulta: caderno, foto, mensagem, uniforme, bilhete, objeto emprestado ou som do sinal.

---

# PARTE V — SAÍDA

## 36. Capítulo 30 — Formatura

**Período:** dezembro de 2027  
**Local:** escola, salão ou espaço comunitário

### Função dramática

Fechar a convivência obrigatória sem resolver artificialmente todas as relações.

### Elementos

- espera;
- roupa;
- família;
- fotos;
- nomes chamados;
- ausência de alguém;
- encontro com pessoa afastada;
- conversa curta;
- humor;
- constrangimento;
- orgulho;
- cansaço;
- silêncio.

### Retornos possíveis

O colega do primeiro trabalho pode:

- lembrar a apresentação;
- agradecer;
- brincar para evitar emoção;
- pedir desculpas tarde;
- manter distância;
- oferecer contato;
- aparecer apenas na foto;
- não comparecer, com motivo coerente;
- ter se tornado pessoa importante;
- permanecer apenas uma memória específica.

### Regra

A formatura não deve virar desfile de todos os sistemas. Escolher de dois a quatro retornos com maior peso narrativo é melhor do que recapitular tudo.

---

## 37. Capítulo 31 — Do lado de fora do portão

**Horário:** depois da cerimônia ou no dia seguinte  
**Local:** portão, ponto de ônibus, carro, calçada ou casa

### Função dramática

Transformar escolha profissional em continuação da história.

### Texto-base adaptativo

> A escola fica para trás sem desaparecer de uma vez.
>
> Ainda existem mensagens chegando, fotos repetidas e gente prometendo marcar alguma coisa. Também existem formulários, horários, contas, treinos, cursos e respostas que não chegaram.
>
> Você não sai daqui pronto. Sai com pessoas que confiaram em você, pessoas que não confiam mais, coisas que aprendeu, coisas que adiou e uma ideia mais concreta do preço de cada caminho.
>
> O portão fecha para a rotina que acabou. A próxima escolha não decide toda a sua vida. Decide apenas qual vida você vai tentar primeiro.

### Caminhos apresentados

- faculdade;
- curso técnico;
- trabalho e estudo online;
- trabalho e estudo independente;
- profissão adquirida;
- ponte profissional construída;
- oportunidade imediata;
- caminho provisório;
- pausa planejada, quando existir sustentação narrativa.

### Apresentação de cada caminho

Cada opção informa em linguagem narrativa:

- por que está disponível;
- que pessoas ou experiências a sustentam;
- custo;
- duração;
- rotina inicial;
- risco;
- vantagem;
- dificuldade específica daquela vida.

### Profissão adquirida não escolhida

Quando o jogador escolhe outro caminho, a confirmação é respeitosa e clara. A profissão permanece disponível em futuras vidas. O texto não pressiona nem sugere desperdício da compra.

---

## 38. Pontes profissionais

### 38.1. Regra universal

Uma ponte profissional é um arco escolar, não uma propaganda e não uma garantia.

Ela possui:

1. **semente** — primeiro contato;
2. **teste de interesse** — escolha voluntária;
3. **rotina** — repetição com custo;
4. **pessoa de referência** — mentor, treinador, professor ou profissional;
5. **conflito** — concorrência com escola, família, saúde, dinheiro ou relações;
6. **avaliação** — resultado parcial;
7. **estado transferível** — conhecimentos, reputação, contatos, saúde, memórias e oportunidade.

### 38.2. Futebol

A ponte Futebol pode atravessar os dois anos:

- destaque ou curiosidade na Educação Física;
- convite para treino;
- primeira dificuldade de deslocamento;
- disputa por posição;
- jogo em fim de semana;
- ausência em passeio ou compromisso familiar;
- relação com treinador;
- vitória sem garantia;
- banco;
- lesão;
- recuperação;
- peneira;
- proposta de teste;
- decisão pós-escola.

O jogador pode terminar como destaque, reserva, lesionado, atleta amador, candidato a teste, pessoa que abandonou a trajetória ou alguém que escolheu outro caminho.

### 38.3. Psicologia

Possíveis sementes:

- projeto sobre convivência;
- conversa com orientador;
- voluntariado;
- interesse por comportamento;
- leitura;
- atividade de escuta com limites.

A narrativa não deve transformar o adolescente em terapeuta dos colegas. A ponte destaca estudo, ética, escuta, observação e formação longa.

### 38.4. Arquitetura

Possíveis sementes:

- maquete;
- desenho técnico;
- observação do bairro;
- projeto de espaço escolar;
- oficina;
- conversa com profissional.

A ponte trabalha percepção espacial, criatividade com restrições, matemática, apresentação e acesso a ferramentas.

### 38.5. Bombeiro

Possíveis sementes:

- atividade de primeiros socorros;
- visita;
- projeto comunitário;
- preparo físico;
- situação de emergência tratada com responsabilidade.

A ponte trabalha disciplina, equipe, preparo, risco, serviço público e formação, sem transformar perigo em espetáculo.

### 38.6. Outras profissões

Cada pacote futuro deve substituir exemplos, não a estrutura. A profissão precisa entrar pela vida real do personagem e competir por tempo.

---

## 39. Matriz dos principais dilemas

| Situação | Opções sem resposta perfeita | Custos possíveis | Memórias futuras |
|---|---|---|---|
| Ônibus ou aplicativo | economizar tempo ou dinheiro | atraso, gasto, fome, Estresse | responsabilidade, ajuda familiar |
| Merenda ou lanche pago | conforto, economia, convivência | dinheiro, Energia, vergonha | dividir comida, excluir, acolher |
| Colega não terminou | ajudar, limitar, retirar, expor | tempo, nota, relação, reputação | promessa, humilhação, dívida |
| Prova em dupla | cooperar, assumir, copiar, recusar | nota, confiança, risco escolar | parceria, apropriação, honestidade |
| Aula vaga | ficar, estudar, conversar, sair | frequência, conteúdo, pertencimento | falta, defesa, advertência |
| Convite social | ir, negociar, recusar, mentir | dinheiro, família, prova, vínculo | inclusão, ausência, mentira |
| Cuidar de parente | cumprir, negociar, pedir ajuda, abandonar | tempo, Energia, confiança | cuidado, promessa quebrada |
| Trabalhar | aceitar, recusar, reduzir, conciliar | dinheiro, estudo, descanso | responsabilidade, oportunidade |
| Fofoca | conversar, ignorar, confrontar, retaliar | reputação, tensão, exposição | versão pública, reconciliação |
| Provocação | humor, limite, saída, agressão | imagem, Saúde, Estresse | autocontrole, briga |
| Romance | aproximar, esperar, falar, recusar | vulnerabilidade, amizade, distância | reciprocidade, limite |
| Ponte profissional | insistir, pausar, abandonar, conciliar | tempo, dinheiro, saúde, relações | mentor, avaliação, oportunidade |
| Escolha pós-escola | formação, trabalho, profissão, caminho híbrido | custo, prazo, risco, autonomia | início da vida adulta |

---

## 40. Regras de diálogo adolescente

### Fazer

- frases relativamente curtas;
- desvios quando a pessoa evita assunto;
- humor de observação;
- interrupções;
- mensagens com diferença de tom em relação à fala presencial;
- vocabulário brasileiro contemporâneo sem depender de moda;
- mudança de voz conforme intimidade, autoridade e grupo;
- silêncio como resposta;
- gesto substituindo explicação.

### Evitar

- adolescentes explicando a própria psicologia;
- gíria em cada frase;
- fala adulta com aparência juvenil;
- professor transmitindo toda a moral da cena;
- personagem entrando apenas para entregar informação;
- discursos perfeitos durante conflito;
- romance com declarações grandiosas precoces;
- agressividade constante para parecer “real”.

---

## 41. Regras de descrição

A descrição precisa ser filmável e funcional.

Objetos recorrentes possíveis:

- tela rachada;
- bandeja metálica;
- caderno usado para esconder nervosismo;
- uniforme molhado;
- cartão de ônibus;
- garrafa de água;
- arquivo sem nome;
- tênis gasto;
- foto de turma;
- bilhete;
- chave de casa;
- formulário amassado.

Um objeto só se torna símbolo porque retorna com novo significado. O texto não deve anunciar o símbolo.

---

## 42. Memórias obrigatórias

Ao fim do prólogo, o save pode conter muitas memórias, mas algumas classes precisam existir quando acionadas:

- promessa cumprida;
- promessa quebrada;
- ajuda com custo;
- limite respeitado;
- limite atravessado;
- exposição pública;
- defesa;
- abandono;
- trabalho conjunto;
- falta;
- cuidado;
- mentira;
- reconciliação;
- oportunidade compartilhada;
- escolha profissional;
- despedida.

Cada memória registra:

- data;
- local;
- pessoas;
- fato;
- intensidade;
- efeitos;
- estado de resolução;
- tags;
- possível papel de retorno.

---

## 43. Reencontros futuros

Pessoas da escola podem reaparecer na vida adulta como:

- colega de formação;
- indicação de vaga;
- cliente;
- chefe;
- rival;
- vizinho;
- profissional de outra área;
- pessoa que precisa de ajuda;
- pessoa capaz de oferecer ajuda;
- parceiro afetivo;
- contato distante;
- referência indireta.

O reencontro precisa passar por:

- idade plausível;
- tempo transcorrido;
- localização;
- profissão;
- disponibilidade;
- memória;
- função dramática;
- trajetória resumida da pessoa.

Não usar coincidência apenas porque a pessoa foi popular no prólogo.

---

## 44. Duração e densidade

Meta do prólogo escolar completo:

- **5 a 7 horas** na primeira vida;
- sessões comuns de **30 a 60 minutos**;
- leitura acelerável em replay;
- sem opção principal de pular automaticamente toda a escola.

Distribuição recomendada:

- 20% primeira semana e primeiro arco;
- 30% restante do segundo ano;
- 10% passagem de ano;
- 30% terceiro ano;
- 10% formatura e escolha.

Cenas:

- rotina com decisão: 80 a 180 palavras antes da escolha;
- tensão maior: 200 a 350 palavras, divididas em batidas quando necessário;
- consequências curtas, específicas e variáveis;
- cenas longas só quando possuem transformações intermediárias.

---

## 45. Critérios de seleção de módulos

Cada vida precisa receber, no mínimo:

### Segundo ano

- um evento acadêmico;
- um evento social;
- um evento familiar ou financeiro;
- um evento físico ou de conflito;
- um evento de relação;
- uma semente vocacional.

### Terceiro ano

- um evento acadêmico decisivo;
- um conflito de agenda;
- um retorno de 2026;
- um evento familiar ou financeiro;
- um evento de saúde, corpo ou desgaste;
- um evento de despedida;
- uma decisão profissional;
- um encerramento de relação relevante.

### Diversidade

O sistema evita:

- repetir o mesmo conflito com nomes diferentes;
- usar sempre a pessoa com maior Confiança;
- colocar romance em toda vida;
- transformar toda pessoa de atrito em rival;
- apresentar toda ponte profissional;
- retornar todos os personagens na formatura.

---

## 46. Rubrica mínima de qualidade

Toda cena é avaliada de 0 a 100 em:

- autenticidade;
- conflito;
- personagem;
- diálogo;
- subtexto;
- emoção;
- clareza;
- ritmo;
- consequência;
- interatividade;
- coerência temporal;
- potencial de memória futura.

Faixas:

- **0–44 — fraca:** vazia, expositiva, incoerente ou cosmética;
- **45–64 — funcional:** cumpre a tarefa, mas ainda não possui força;
- **65–79 — boa:** gera interesse, coerência e alguma reverberação;
- **80–89 — excelente:** une voz, atrito, clareza e consequência;
- **90–100 — excepcional:** específica, inevitável, reaproveitável e capaz de voltar anos depois com significado maior.

### Regra de publicação

Nenhuma cena canônica entra no pacote com nota inferior a 75.  
Marcos fixos precisam alcançar ao menos 82.  
Abertura, falha do colega, passagem de ano, retorno do terceiro ano, formatura e escolha final precisam alcançar ao menos 85 em revisão humana e automatizada de estrutura.

---

## 47. Falhas que invalidam uma cena

Uma cena deve ser reescrita quando:

- a escolha correta é óbvia e sem custo;
- o NPC existe apenas para ajudar ou atrapalhar;
- o personagem explica tudo que sente;
- a tensão depende apenas de gritos;
- o texto esconde contexto que o protagonista saberia;
- a consequência muda só uma frase;
- a convergência apaga memória e custo;
- o horário contradiz atividade ou deslocamento;
- romance aparece por pontuação;
- fofoca surge sem causa;
- coincidência substitui preparação;
- sofrimento existe apenas para chocar;
- a prosa tenta parecer profunda pelo excesso de adjetivos;
- o adolescente fala como adulto em palestra;
- a cena repete outro módulo com nomes trocados.

---

## 48. Contratos de implementação

A implementação desta versão exige:

1. preservar saves existentes com migração explícita;
2. manter a primeira semana já funcional enquanto o texto é substituído gradualmente;
3. expandir o calendário de 2026 para 2027;
4. tornar a passagem de ano visível;
5. persistir pessoas ativas, distantes e inativas;
6. persistir memórias estruturadas;
7. permitir retorno baseado em histórico;
8. integrar ponte profissional sem substituir a escola;
9. preservar nomes e `personId` após recarga;
10. calcular todos os horários no motor;
11. validar local e atividade;
12. impedir deslocamento instantâneo;
13. testar rotas com ônibus, aplicativo, falta, trabalho, cuidado, festa, treino e lesão;
14. garantir ao menos um caminho viável após a escola;
15. apresentar consequências em linguagem humana;
16. ocultar fórmulas, sementes e modificadores da interface comum;
17. manter detalhes técnicos somente em área de teste;
18. simular combinações para detectar becos sem saída e repetição excessiva.

---

## 49. Estado de implementação

### Já existe na versão jogável

- motor narrativo modular;
- relógio;
- data, horário, local, atividade e compromisso;
- primeira sequência escolar;
- trabalho em grupo;
- relação persistente;
- memória e efeitos diferidos iniciais;
- teste de habilidade;
- save;
- migração de versões anteriores;
- quatro caminhos provisórios de formação;
- prova técnica de pacote Futebol.

### Ainda precisa ser implementado para cumprir o Prólogo v2.0

- arco completo do segundo ano;
- arco completo do terceiro ano;
- passagem de férias baseada em memórias;
- retorno social no terceiro ano;
- elenco com desejos e trajetórias mais completas;
- módulos com subtexto e identidade própria;
- ponte profissional integrada ao calendário escolar;
- formatura com retornos selecionados;
- escolha profissional contextualizada;
- rubrica automatizada de estrutura;
- auditoria de repetição e genericidade;
- E2E de dois anos;
- verificação em produção.

Nenhuma resposta futura deve tratar esses itens como concluídos antes de merge, testes e evidências.

---

## 50. Resumo canônico da história

A história começa numa manhã comum, com um adolescente escolhendo entre tempo, dinheiro e café. Na escola, ele entra num grupo com uma pessoa que possui passado próprio. Quando essa pessoa falha, o jogador decide como reage sem saber tudo. A apresentação transforma a relação e cria uma memória.

Ao longo do segundo ano, o personagem tenta pertencer: escolhe onde senta, com quem come, se falta, se ajuda em casa, se trabalha, se aceita convites, como reage a fofoca e o que faz com o próprio corpo diante dos outros. Uma possibilidade profissional pode surgir, mas exige rotina e renúncia. O ano termina sem resolver tudo.

Durante as férias, a escola desaparece e revela quais vínculos sobrevivem sem convivência obrigatória. O terceiro ano reorganiza a sala e aumenta a pressão. Uma pessoa ou consequência de 2026 retorna. Prazos, inscrições, provas, dinheiro, família, saúde, trabalho, amor e oportunidades disputam o mesmo tempo. O futuro deixa de ser ideia e vira formulário, deslocamento, treino, taxa, entrevista e ausência.

No último dia comum, o jogador percebe que uma rotina inteira está acabando. Na formatura, algumas relações se fecham, outras permanecem abertas e outras já terminaram sem cerimônia. Do lado de fora do portão, o jogador escolhe não a vida inteira, mas a primeira vida adulta que tentará construir.

O prólogo termina com a escola atrás do personagem e todas as suas memórias ainda à frente.
