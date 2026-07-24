# Referência canônica

Este projeto segue:

- **Handoff Canônico Vidas Possíveis v1.0.0**;
- **Prólogo Canônico v1.0**;
- **Arquitetura Canônica de Pacotes Narrativos v1.0.0**.

Documentos consolidados em 24/07/2026.

Antes de alterar motor, narrativa, personagens, relógio, atributos, relacionamentos, prólogo ou profissão, consulte obrigatoriamente:

1. `docs/HANDOFF_CANONICAL.md`;
2. `docs/PROLOGUE_CANONICAL.md` quando houver conteúdo escolar;
3. `docs/NARRATIVE_PACKAGE_ARCHITECTURE.md` ao criar ou alterar pacotes.

Em caso de divergência:

- domínio e regras universais: Handoff;
- sequência e conteúdo escolar: Prólogo;
- contratos de reutilização e profissões: Arquitetura de Pacotes;
- decisão explicitamente mais recente prevalece.

## Estado de implementação

- Sprint 0: concluída;
- Sprint 1: concluída;
- Prólogo Canônico v1.0: implementado no pacote `school-prologue`;
- schema do progresso: versão 3;
- narrativa: pacotes e módulos;
- conhecimentos e locais: definidos por pacote;
- interface: rótulos fornecidos pelo pacote;
- prova de modularidade: pacote executável de jogador de futebol;
- consolidação: PR #7, condicionado a CI, E2E e Vercel verdes.

## Regras que não podem ser ignoradas

- relógio calculado pelo motor e sem regressão;
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
- novo pacote exige pesquisa, autoria, validação, simulação e E2E.
