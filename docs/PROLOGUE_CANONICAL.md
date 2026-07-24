# Vidas Possíveis — Prólogo Canônico

**Versão:** 1.0  
**Data:** 24/07/2026  
**Recorte:** adolescente de classe média, 17 anos, terceiro ano do Ensino Médio  
**Status:** fonte obrigatória para implementação e testes

## Regra de consulta

Antes de alterar o prólogo, pessoas, relações, horários ou eventos escolares, consultar este arquivo e `docs/HANDOFF_REFERENCE.md`.

As regras gerais de domínio ficam no Handoff. A sequência, os contextos e os critérios do prólogo ficam neste documento. A decisão mais recente registrada explicitamente prevalece.

## Banco de nomes do prólogo

Femininos:

- Tamires;
- Solange;
- Paula;
- Julia.

Masculinos:

- Miguel;
- Israel;
- Luiz;
- Rodrigo;
- Carlos.

O colega principal é gerado deterministicamente por vida. O gênero é sorteado entre mulher e homem; depois, um nome disponível é escolhido no banco correspondente. O nome fica reservado por toda a vida e a mesma pessoa sempre retorna com o mesmo `personId`, gênero, passado e memórias.

## Colega principal

O papel é **colega do grupo que não conseguiu cumprir sua parte**. Não existe nome obrigatório.

O passado é escolhido entre quatro modelos:

1. já ajudou o jogador em outra matéria;
2. já provocou o jogador, mas também agiu corretamente em outra situação;
3. normalmente é responsável, porém enfrenta um problema excepcional;
4. costuma deixar tarefas para os outros.

O jogador deve poder abrir **“Quem é esta pessoa?”** antes de tomar uma decisão relevante. O contexto exibido deve justificar Confiança, Proximidade e Tensão.

A pessoa começa como conhecida. Pode virar importante, rival, distante ou inativa conforme novas interações. Não existe vingança automática nem recompensa automática.

## Estrutura obrigatória

O prólogo começa em 16/02/2026 às 06:10 e termina no fim do ano letivo.

O primeiro arco deve conter:

1. despertar e preparação;
2. café, ônibus ou carro por aplicativo;
3. espera antes da aula;
4. anúncio do trabalho;
5. colega variável e contexto consultável;
6. merenda ou lanchonete;
7. Educação Física;
8. aula vaga ou professor substituto;
9. possibilidade de faltar para sair com amigos;
10. mensagem do grupo às 16:00;
11. investigação antes da decisão;
12. ajudar, organizar, excluir ou expor;
13. trabalho em casa, biblioteca ou chamada;
14. prova em dupla;
15. convite social em conflito com responsabilidade familiar;
16. intriga ou fofoca com origem rastreável;
17. chegada antecipada ou atrasada para a apresentação;
18. apresentação às 08:00;
19. consequência relacional;
20. passagem modular pelo restante do ano;
21. escolha inicial de formação.

## Contextos de vida adolescente

Os módulos podem utilizar:

- amizades;
- rivalidades;
- namoro opcional;
- brigas e reconciliações;
- faltas para ficar com amigos;
- trabalhos em casa;
- provas individuais ou em dupla;
- professores substitutos;
- aulas vagas;
- shopping, parque, cinema, festa ou balada adequada à idade;
- trabalho temporário;
- castigo;
- responsabilidade com irmãos;
- cuidado de parente doente;
- responsáveis viajando;
- festa de família recusada;
- jogos entre turmas;
- transporte público e aplicativo;
- merenda e lanchonete.

Nem todos os eventos devem aparecer na mesma vida. Cada vida recebe ao menos um módulo acadêmico, social, familiar/financeiro, físico/conflito e relacional.

## Classe média

O personagem possui celular, internet, acesso a computador familiar, dinheiro limitado, merenda disponível, possibilidade de comprar lanche, ônibus e uso ocasional de aplicativo.

Classe média não significa dinheiro ilimitado. Gastos com transporte, lanchonete, shopping e festas competem entre si.

## Pessoas e romance

Papéis neutros podem ser ocupados por homens ou mulheres, independentemente do gênero do jogador.

Romance é opcional e depende de preferência afetiva, reciprocidade, idade, contexto e escolhas. Proximidade não significa romance; tensão não significa atração.

## Tempo

Data e horário são calculados pelo motor.

- deslocamentos não são instantâneos;
- ações não podem ocorrer em locais incompatíveis;
- chegar cedo cria espera ou preparação;
- chegar tarde cria atraso;
- a apresentação não pode começar antes de 08:00;
- o relógio nunca pode retroceder;
- refeições, sono, passeios e retornos consomem tempo;
- o texto da atividade deve corresponder ao horário.

Casos mínimos de teste:

- 05:40 → 08:00 = 140 minutos;
- segunda 18:10 → terça 05:40 = 690 minutos;
- 06:35 → 10:30 = 235 minutos;
- 08:20 para compromisso às 08:00 = atraso de 20 minutos.

## Arquitetura narrativa

O prólogo é um **pacote narrativo** composto por módulos. O motor não conhece nomes, cenas escolares ou profissões.

O pacote declara:

- identificador e versão;
- nó inicial;
- módulos;
- cenas;
- compromissos;
- escolhas;
- efeitos;
- pessoas por papel;
- condições;
- resultados;
- finais.

Os módulos atuais são:

- rotina escolar;
- projeto em grupo;
- alimentação e dinheiro;
- atividade física;
- vida social escolar;
- evento acadêmico;
- conflito;
- apresentação;
- passagem modular do ano;
- ponte para formação;
- encerramento.

## Critérios de aceite

A implementação só pode ser aprovada quando:

1. usa exclusivamente os nove nomes autorizados neste recorte;
2. gênero, nome e passado permanecem após recarregar;
3. o nome não é reutilizado em outra pessoa;
4. “Quem é esta pessoa?” aparece antes da decisão relevante;
5. existem quatro históricos possíveis;
6. merenda, lanchonete, ônibus e aplicativo são escolhas reais;
7. Educação Física afeta estado ou relações;
8. há aula vaga ou substituta;
9. faltar possui duração e consequência;
10. existe prova em dupla;
11. existe apresentação às 08:00;
12. intriga possui origem;
13. há conflito entre lazer e responsabilidade;
14. romance não é obrigatório;
15. pessoas podem mudar de categoria;
16. nenhuma rota retrocede o relógio;
17. nenhuma rota fica sem escolha;
18. todos os textos visíveis evitam termos técnicos;
19. testes automatizados simulam múltiplas vidas;
20. o final registra formação e pessoas persistentes.

## Código fonte

A implementação canônica está distribuída em:

- `packages/game-engine/src/identity.ts`;
- `packages/game-engine/src/game.ts`;
- `packages/game-engine/src/types.ts`;
- `packages/narrative/src/content.ts`;
- `packages/narrative/src/schema.ts`;
- `apps/web/src/components/game-shell.tsx`;
- testes unitários, de integridade e E2E.
