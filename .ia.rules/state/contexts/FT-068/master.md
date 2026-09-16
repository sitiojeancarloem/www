# FT-068 — Migração TTS e edição redacional

Estado: em andamento. Fonte: `TODO.ia.md`. Dependências: capacidades gerenciadas `resource.editorial-authoring` e `resource.spoken-normalization`.

## Matriz de equivalência inicial

| Capacidade local | Equivalente canônico | Equivalência | Especialização local necessária | Destino |
|---|---|---|---|---|
| preservação de voz, conteúdo, pontuação e peculiaridades | `editorial-authoring.md` | total para modus operandi | somente classificação editorial do produto | rota canônica + RCF local |
| organização lógico-discursiva e marcação mínima de IA | `editorial-authoring.md` + `WEB-EDITORIAL` | parcial e cumulativa | política de publicação/markup deste blog | RCF local |
| normalização contextual de fala, delimitadores e referências | `spoken-normalization.md` | total para operação genérica | schema HTML e projeção do artigo | rota canônica + RCF TTS |
| HTML acessível estático, controles Web Speech e modos continuous/summary/full | ausente como produto no núcleo | ausente de propósito | integralmente local | plugin/includes/TS/RCF do produto |
| gráficos acessíveis e assets condicionais | ausente como produto no núcleo | ausente de propósito | integralmente local | plugin/manifesto/RCF do produto |
| comandos genéricos `agent:editorial` e `agent:spoken` | runtime gerenciado | total | nenhuma implementação paralela | `package.json` delega ao núcleo |

## Preservação

- Não editar o núcleo gerenciado nem copiar seus textos para extensão local.
- Não remover pipeline de acessibilidade/TTS do produto, porque ele materializa comportamento Web que o recurso canônico deliberadamente não implementa.
- Reduzir somente duplicação operacional comprovada em `agents.local.md`/RCF, mantendo requisitos de negócio e testes.

## Validação

- inventário antes/depois por path e finalidade;
- comandos canônicos e testes do produto;
- ausência de regra local que preceda ou substitua a capacidade gerenciada.
