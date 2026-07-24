# Auditoria de implementação do Prólogo Canônico

## Escopo implementado

- colega principal gerado deterministicamente;
- banco temporário com nove nomes;
- quatro passados possíveis;
- registro de identidade e reserva de nome;
- pessoa conhecida com contexto consultável;
- Confiança, Proximidade e Tensão;
- promoção para pessoa importante;
- despertar, café, ônibus e aplicativo;
- espera antes da aula;
- trabalho em grupo;
- merenda e lanchonete;
- Educação Física;
- aula vaga e possibilidade de sair da escola;
- conflito do grupo;
- trabalho em casa, biblioteca ou chamada;
- prova em dupla;
- shopping versus responsabilidade familiar;
- fofoca e confronto;
- chegada antecipada ou atrasada;
- apresentação às 08:00;
- passagem modular pelo ano;
- trabalho temporário, família ou festa;
- quatro escolhas de formação;
- migração do save anterior;
- documentação de pacote narrativo.

## Evidências automatizadas esperadas

A CI deve validar:

- lint;
- TypeScript;
- testes unitários;
- integridade narrativa;
- build;
- auditorias estruturais;
- jornada E2E;
- restauração após recarregar.

## Limitações atuais

- o banco geral de 100 nomes por gênero ainda não foi implementado; o prólogo usa os nove nomes autorizados;
- o resolvedor completo de reencontros futuros ainda será implementado em etapa posterior;
- preferência romântica ainda não aparece no formulário, portanto o prólogo não força romance;
- alguns nomes técnicos internos antigos permanecem nos campos de código para compatibilidade de save, embora a interface já use linguagem canônica;
- os módulos do restante do ano são um primeiro recorte jogável, não todos os eventos listados no documento canônico.

## Critério de merge

O PR não deve ser mesclado até a CI e o E2E passarem integralmente.
