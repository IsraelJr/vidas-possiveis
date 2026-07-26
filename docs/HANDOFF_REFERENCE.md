# Referência canônica

Este projeto segue:

- **Handoff Canônico Vidas Possíveis v1.1.0**;
- **Estado Canônico do Projeto**;
- **Bíblia Narrativa de Vidas Possíveis v1.0**;
- **Prólogo Canônico v2.0**;
- **Arquitetura Canônica de Pacotes Narrativos v1.0.0**.

Documentos consolidados em 26/07/2026.

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
- continuidade pós-escolha: implementada; toda escolha mostra sua consequência antes da próxima cena;
- pequenos arcos graves: a briga escolar possui intervenção, coordenação, consequência, saída acompanhada, conversa familiar e encerramento da noite;
- progressão temporal protegida: implementada no branch `fix/day-closure-before-time-skip`, PR `#16`, aguardando CI definitiva e integração;
- narrativa: pacotes e módulos;
- conhecimentos e locais: definidos por pacote;
- interface: rótulos fornecidos pelo pacote;
- prova de modularidade: pacote executável independente de jogador de futebol;
- último commit integrado à `main`: `0322fa5de4f7005d61bfa65483f55f22ca673579` pelo PR `#15`;
- PR temporal atual: `#16`;
- head funcional temporal antes desta atualização documental: `21265828f6ca79b167c75e19cfb0c7e4f790213c`;
- CI do PR temporal: ainda precisa ficar totalmente verde após os últimos ajustes;
- produção na Vercel: ainda não validada porque o plano recusou novos builds por `build-rate-limit`.

A correção temporal não deve ser descrita como integrada ou publicada enquanto o PR `#16` não estiver aprovado, mesclado e, para produção, publicado pela Vercel com teste de fumaça.

## Contrato obrigatório de progressão temporal

- `set_clock` serve apenas para ajustar o horário dentro da mesma data;
- qualquer mudança de data exige o efeito explícito `time_transition`;
- dormir e avançar para outro dia só pode acontecer em uma cena marcada como `day-end`;
- antes do sono, o personagem deve já estar no local declarado para dormir;
- uma escolha não pode transportar o personagem para casa e fazê-lo dormir ao mesmo tempo;
- deslocamento, chegada, atividades domésticas e sono são etapas narrativas separadas;
- resolver uma discussão não autoriza mandar o personagem diretamente para casa;
- chegar em casa não significa que o dia terminou;
- o salto de dias só acontece depois que o arco local foi concluído, o restante do dia foi vivido e o personagem dormiu;
- montagens temporais longas exigem uma cena marcada como `montage`;
- uma montagem não pode atravessar consequência programada nem compromisso conhecido;
- consequências que vencem durante o sono devem ser processadas ao acordar;
- o pacote narrativo deve ser invalidado quando uma transição temporal não declarar fronteira, local ou condição coerente;
- nenhuma cena pode mudar de dia silenciosamente por meio de `set_clock`.

## Regras que não podem ser ignoradas

- relógio calculado pelo motor e sem regressão;
- data apresentada ao jogador deve incluir o ano quando a narrativa atravessar anos letivos;
- atividade compatível com horário e local;
- deslocamentos devem ser vividos ou narrados com duração e destino coerentes;
- pequenos arcos precisam terminar antes da transição para outro assunto;
- cenas não podem usar casa, sono ou salto temporal apenas para encobrir um corte narrativo;
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
