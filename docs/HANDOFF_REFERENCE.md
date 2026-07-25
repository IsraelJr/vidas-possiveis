# Referência canônica

Este projeto segue:

- **Handoff Canônico Vidas Possíveis v1.1.0**;
- **Estado Canônico do Projeto**;
- **Bíblia Narrativa de Vidas Possíveis v1.0**;
- **Prólogo Canônico v2.0**;
- **Arquitetura Canônica de Pacotes Narrativos v1.0.0**.

Documentos consolidados em 25/07/2026.

Antes de alterar motor, narrativa, personagens, relógio, atributos, relacionamentos, prólogo ou profissão, consulte obrigatoriamente:

1. `docs/HANDOFF_CANONICAL.md`;
2. `docs/PROJECT_STATUS.md` para o estado operacional mais recente;
3. `docs/NARRATIVE_BIBLE.md` para voz, personagens, cenas, conflito, diálogo, subtexto, emoção, escolhas e rubrica de qualidade;
4. `docs/PROLOGUE_CANONICAL.md` quando houver conteúdo escolar;
5. `docs/NARRATIVE_PACKAGE_ARCHITECTURE.md` ao criar ou alterar pacotes;
6. `docs/PROLOGUE_IMPLEMENTATION_AUDIT.md` para evidências e limites da implementação atual.

Em caso de divergência:

- domínio e regras universais: Handoff;
- situação atual, PRs, commits, testes e deploys: Estado do Projeto;
- estilo, dramaturgia, construção de personagens, cenas e revisão: Bíblia Narrativa;
- sequência, arquitetura emocional e conteúdo escolar: Prólogo;
- contratos de reutilização e profissões: Arquitetura de Pacotes;
- evidências técnicas da versão escolar: Auditoria de Implementação;
- decisão explicitamente mais recente prevalece.

`docs/PROJECT_STATUS.md` substitui informações operacionais antigas do Handoff quando houver PR, commit, teste ou deploy mais recente.

## Estado de implementação

- Sprint 0: concluída;
- Sprint 1: concluída;
- Prólogo Canônico v2.0: implementado no pacote `school-prologue`;
- versão do pacote escolar: `prologue-2.0`;
- schema do progresso: versão 3;
- período jogável: segundo ano em 2026 até a formatura no fim de 2027;
- passagem de férias e mudança de ano: implementadas e visíveis;
- retorno de pessoa e consequência do primeiro trabalho no terceiro ano: implementado;
- último dia comum, formatura e escolha textual pós-escola: implementados;
- caminhos finais: faculdade, curso técnico, trabalho com estudo online, trabalho com estudo independente e Futebol quando disponível;
- ponte Futebol escolar: implementada em nível inicial;
- confirmação ao não escolher uma vida Futebol disponível: implementada;
- migração de saves da versão de um ano: implementada com preservação do estado compatível;
- narrativa: pacotes e módulos;
- conhecimentos e locais: definidos por pacote;
- interface: rótulos fornecidos pelo pacote;
- prova de modularidade: pacote executável independente de jogador de futebol;
- PR funcional: `#11`;
- SHA validado: `55900740c91e58426c18d2ac4ac51dd8bd6ad72f`;
- CI definitiva: `30147307322`, aprovada;
- testes: 43 testes unitários e de integridade, 25 vidas simuladas e E2E completo;
- commit funcional na `main`: `5d19911e5c9ba17e93db5e78b45ed534d974fae2`;
- produção na Vercel: ainda não validada porque o plano recusou novos builds por `build-rate-limit`.

A implementação está integrada à `main`, mas não deve ser descrita como publicada em produção até a Vercel aceitar um novo build e o teste de fumaça público ser concluído.

## Regras que não podem ser ignoradas

- relógio calculado pelo motor e sem regressão;
- data apresentada ao jogador deve incluir o ano quando a narrativa atravessar anos letivos;
- atividade compatível com horário e local;
- nomes únicos por vida;
- mesma pessoa mantém o mesmo `personId`;
- contexto acessível para pessoas já conhecidas;
- Confiança, Proximidade e Tensão universais;
- atributos separados de condições e conhecimentos;
- romance opcional e sem presunção pela identidade do jogador;
- pessoas afastadas permanecem na memória;
- locais e conhecimentos não podem ser codificados no motor;
- a interface não pode manter catálogos próprios de uma profissão;
- conteúdo profissional entra como novo pacote, não como regra especial no motor;
- novo pacote exige pesquisa, autoria, validação, simulação e E2E;
- cenas devem preservar consequências em memória, relação, custo, tempo ou disponibilidade;
- convergência não pode apagar escolhas;
- adolescentes não podem ser escritos como adultos em miniatura;
- exposição técnica, rolagens e modificadores não aparecem na interface comum;
- a passagem entre 2026 e 2027 deve ser visível e baseada no histórico da vida;
- atualização compatível de conteúdo deve preservar pessoas, memórias, dinheiro, atributos, flags, histórico e consequências quando semanticamente possível;
- profissão adquirida libera conteúdo, não sucesso automático;
- escolher outro caminho não apaga uma profissão disponível para futuras vidas;
- não afirmar que a versão está publicada enquanto o status de produção da Vercel não estiver aprovado.
