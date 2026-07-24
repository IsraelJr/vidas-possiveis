# Referência canônica

Este projeto segue o **Handoff canônico Vidas Possíveis v0.9.0** e o **Prólogo Canônico v1.0**, consolidados em 24/07/2026.

## Fontes obrigatórias

Antes de ampliar o jogo, consultar:

1. o Handoff canônico completo mantido nas Fontes do projeto;
2. `docs/PROLOGUE_CANONICAL.md`;
3. os contratos em `packages/game-engine/src/types.ts`;
4. o pacote narrativo em `packages/narrative/src/content.ts`.

Em caso de divergência:

- regras gerais de domínio: Handoff;
- história e critérios do prólogo: Prólogo Canônico;
- código só prevalece quando a alteração estiver documentada como substituição canônica.

## Estado de implementação

- Sprint 0: concluída;
- Sprint 1 original: concluída;
- adequação canônica do prólogo: em validação no branch `agent/prologue-canonical-v1`;
- Sprint 2 profissional não deve começar antes da aprovação desta adequação.

## Regras obrigatórias de pessoas

- pessoa de cena, conhecida e importante são categorias narrativas;
- papel social e categoria são conceitos separados;
- pessoas persistentes usam Confiança, Proximidade e Tensão;
- pessoas afastadas permanecem no histórico;
- retorno não é vingança automática;
- nomes são reservados por vida;
- `personId` é a fonte de identidade;
- o jogador recebe contexto sobre pessoas que seu personagem já conhece;
- nenhuma memória materialmente relevante pode ficar escondida antes de uma decisão dependente dela.

## Banco do prólogo

Femininos: Tamires, Solange, Paula e Julia.

Masculinos: Miguel, Israel, Luiz, Rodrigo e Carlos.

O colega principal é gerado deterministicamente entre esses nomes, com um de quatro passados possíveis. O gênero do jogador não determina o gênero desse papel neutro.

## Regras obrigatórias de tempo

- o motor é a fonte única de data e horário;
- deslocamentos consomem tempo;
- atividade precisa ser compatível com o horário;
- chegada antecipada cria espera ou preparação;
- atraso produz estado próprio;
- relógio não pode retroceder;
- rotas devem ser simuladas automaticamente;
- a apresentação do prólogo começa às 08:00, nunca antes.

## Arquitetura narrativa

O motor deve permanecer independente de:

- profissão;
- nomes;
- escola;
- tecnologia;
- React;
- Next.js;
- banco de dados.

Cada trajetória é um pacote narrativo composto por módulos reutilizáveis. Um novo pacote pode representar, por exemplo:

- jogador de futebol;
- psicólogo;
- arquiteto;
- bombeiro;
- desenvolvedor;
- outra vida gratuita ou paga.

O pacote deve declarar elenco por papéis, cenas, escolhas, efeitos, compromissos, memórias, condições, resultados e finais.

## Limite atual

A infraestrutura de pacote, módulos, identidade e efeitos é reutilizável. O conteúdo específico de cada profissão ainda precisa ser escrito, pesquisado e testado. Não se deve copiar cenas escolares trocando apenas nomes.

## Critério de conclusão da adequação

A adequação só estará concluída quando CI e E2E aprovarem:

- geração e persistência do colega;
- quatro históricos;
- contexto “Quem é esta pessoa?”;
- nomes únicos;
- alimentação e transporte;
- Educação Física;
- aula vaga;
- prova em dupla;
- conflito social;
- apresentação no horário;
- eventos modulares;
- quatro caminhos de formação;
- migração do save anterior;
- ausência de termos técnicos na interface.
