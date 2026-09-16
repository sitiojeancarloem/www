# FT-072 — Templates de blockquote e aliases

Estado: pendente. Fonte: `TODO.ia.md`. Evidências preservadas em `.ia.rules/state/requests/evidencias/e1.png` a `e6.png`.

## Ledger visual inicial

| Evidência/região | Observação | Regra de destino |
|---|---|---|
| e1/e2, moldura completa | mesma estrutura com accent ciano/âmbar, faixa lateral/inferior pontilhada, ícone e cápsula de título | um modelo parametrizável por cor, sem fonte global nova |
| e3, bloco completo | aspas grandes à esquerda, texto justificado e autoria abaixo, com pequeno recuo do conjunto | modelo próprio com recuo preservado |
| e4, centro | citação centralizada, aspas superiores e texto em destaque; branco externo não pertence ao modelo | modelo próprio sem importar o fundo da screenshot |
| e5, centro | citação editorial centralizada, aspas e autoria, superfície oliva da amostra é contexto externo | modelo próprio temático, sem fixar fundo externo |
| e6, faixa esquerda | linha vertical interrompida por aspas, texto e autoria à direita | modelo próprio com tokens de tema; alias primário inicial |

## Arquitetura-alvo

- registro central declara `aliases.primary` e `aliases.highlight`, modelos concretos, parâmetros permitidos e classes;
- resolução: modelo explícito > alias `destaque` > alias primário;
- defaults iniciais: primário → modelo derivado de e6; destaque → `futuristic`;
- e1/e2 compartilham estrutura e aceitam accent validada por atributo/configuração; demais são modelos concretos;
- todo CSS web fica sob `@media screen`; adaptador IEEE neutraliza estrutura, adornos, cores, fundos, margens e tipografia web;
- documentação e ilustrações derivam do registro e permanecem sob `docs/`/`assets/images/documentacao/blockquote/`.

## Matriz obrigatória

- claro/escuro, 320 px e desktop;
- cada modelo preexistente e novo;
- alias primário, destaque e override explícito;
- rebuild após troca central de alias;
- HTML estático, fallback sem JS e impressão IEEE.
