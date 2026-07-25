# Referência canônica

Este projeto segue:

- **Handoff Canônico Vidas Possíveis v1.0.0**;
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
5. `docs/NARRATIVE_PACKAGE_ARCHITECTURE.md` ao criar ou alterar pacotes.

Em caso de divergência:

- domínio e regras universais: Handoff;
- situação atual, PRs, commits e evidências: Estado do Projeto;
- estilo, dramaturgia, construção de personagens, cenas e revisão: Bíblia Narrativa;
- sequência, arquitetura emocional e conteúdo escolar: Prólogo;
- contratos de reutilização e profissões: Arquitetura de Pacotes;
- decisão explicitamente mais recente prevalece.

`docs/PROJECT_STATUS.md` substitui informações operacionais antigas do Handoff quando houver PR, commit, teste ou deploy mais recente.

## Estado de implementação

- Sprint 0: concluída;
- Sprint 1: concluída;
- Prólogo Canônico v2.0: tratamento narrativo canônico salvo;
- versão jogável atual: ainda não implementa integralmente os dois anos escolares descritos no Prólogo v2.0;
- schema do progresso: versão 3;
- narrativa: pacotes e módulos;
- conhecimentos e locais: definidos por pacote;
- interface: rótulos fornecidos pelo pacote;
- prova de modularidade: pacote executável de jogador de futebol;
- consolidação modular: concluída pelo PR #7;
- commit operacional de referência anterior: `03646550a2cf75ab48ee9d56ee07a8028ae3c5fd`;
- CI operacional anterior: `30113406692`, aprovada;
- produção anterior na Vercel: aprovada.

A inclusão da Bíblia Narrativa e a reescrita do Prólogo são mudanças documentais. Elas não devem ser apresentadas como implementação jogável antes de código, migrações, testes, merge e verificação em produção.

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
- novo pacote exige pesquisa, autoria, validação, simulação e E2E;
- cenas devem preservar consequências em memória, relação, custo, tempo ou disponibilidade;
- convergência não pode apagar escolhas;
- adolescentes não podem ser escritos como adultos em miniatura;
- exposição técnica, rolagens e modificadores não aparecem na interface comum;
- a passagem entre 2026 e 2027 deve ser visível e baseada no histórico da vida;
- o Prólogo v2.0 só estará implementado após os dois anos, retornos, formatura, escolha profissional, migração e E2E serem aprovados.
