# Referência canônica

Este projeto segue o **Handoff Canônico Vidas Possíveis v0.9.0** e o **Prólogo Canônico v1.0**, consolidados em 24/07/2026.

Antes de alterar motor, narrativa, personagens, relógio, atributos, relacionamentos ou conteúdo do prólogo, consulte obrigatoriamente:

1. `docs/HANDOFF_CANONICAL.md`;
2. `docs/PROLOGUE_CANONICAL.md`.

Em caso de divergência:

- regras gerais de domínio e arquitetura: Handoff;
- sequência, contexto e conteúdo escolar: Prólogo;
- a decisão explicitamente mais recente prevalece.

## Estado de implementação

- Sprint 0: concluída;
- Sprint 1: concluída;
- Prólogo Canônico v1.0: implementado no pacote `school-prologue`;
- schema do progresso: versão 3;
- arquitetura narrativa: pacotes e módulos;
- próxima expansão: somente após validação completa do prólogo canônico.

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
- conteúdo profissional deve entrar como novo pacote narrativo, não como regra especial no motor.
