# Contexto mestre — FT-082 a FT-084

Estado: FT-082 normatizada; FT-083 aguarda implementação já autorizada. Fonte material: `TODO.ia.md`. Autorização e pedido de execução: `.ia.rules/state/requests/FT-082/prompt.md`.

## Objetivo

Especializar a revisão editorial deste produto para aplicar capitalização reverencial somente a referências inequivocamente cristãs, preservar ênfases autorais legítimas e respeitar citações, ambiguidade e correferência, sem copiar ou alterar a capacidade gerenciada `editorial-authoring`.

## Inventário inicial

- A autoridade genérica vigente é `.ia.rules/resources/editorial-authoring.md`; ela preserva voz, representação editorial, citações e forma ambígua.
- `agents.local.md` já roteia edição autoral primeiro ao recurso gerenciado e depois às sub-RCFs locais.
- Não existe Skill ou Subagent local especializado em capitalização reverencial, revisão autoral ou pré-publicação.
- O núcleo gerenciado sob `.ia.rules/resources`, `.ia.rules/core`, `.ia.rules/skills` e `.ia.rules/subagents` é imutável neste repositório Final.
- `.ia.rules/local/` é a extensão oficial preservável pelo atualizador e será avaliada como destino da especialização.

## Decisão de mecanismo da FT-082

Skill é o menor mecanismo suficiente: trata-se de procedimento recorrente, estreito, contextual e sequencial, sem objetivo independente que justifique Subagent. A implementação ficará em `.ia.rules/local/skills/reverential-editorial-review/`, dependerá da capacidade canônica e declarará gatilhos positivos, negativos e limítrofes, recursos sob demanda inexistentes e operação essencial sem a extensão.

A sub-RCF `RCFs/revisao-editorial-reverencial.md` centraliza a regra do produto; `RCFs/operacao-da-ia.md` somente roteia a especialização após `editorial-authoring`. O adaptador `agents.local.md` será alterado apenas na FT-083 para apontar a rota, sem copiar o contrato.

## Fases e ordem

1. FT-082 — equalização e normatização: consolidar contrato, precedências, casos e destino oficial; nenhum artefato executável da Skill entra nesta fase.
2. FT-083 — implementação: criar somente a Skill local, descritor, roteamento e testes necessários, após o commit normativo já autorizado.
3. FT-084 — integração e validação: executar matriz completa, regressões e rastreabilidade; manter a TO-DO em validação humana.

## Dependências e preservação

- FT-083 depende integralmente da conclusão de FT-082; FT-084 depende de FT-083.
- FTs 068–081 já iniciadas ou concluídas não serão recriadas nem reexecutadas.
- A regra não altera automaticamente o corpus, não introduz substituição cega e não decide referente materialmente ambíguo.
- Citação conserva a capitalização editorial de origem; caixa alta localizada e deliberada não é reduzida.
- Sentença integral em caixa alta é normalizada sem apagar nomes próprios, siglas, capitalização reverencial ou destaques localizados inequivocamente preserváveis.

## Aceite global

- A origem inteira está mapeada a contrato normativo e a casos de validação.
- O mecanismo local contém somente o delta do produto e permanece removível.
- Referentes cristãos, não cristãos, humanos, genéricos, mistos e ambíguos são distinguidos por contexto.
- Cadeia correferente recebe capitalização adicional apenas na forma mais estrita quando ela está presente.
- Citações e ênfases autorais permanecem intactas.
- A frente termina em `✅` pendente de aprovação humana; aprovação posterior autoriza sua remoção integral.
