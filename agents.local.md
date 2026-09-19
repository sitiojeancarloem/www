# Adaptação operacional local — JeanCarloEM Blog

Autoridade: `AGENTS.md` → `RCF.md` → sub-RCF aplicável → este adaptador. Este arquivo somente roteia e condensa invariantes operacionais; regra detalhada permanece na autoridade vinculada.

## Entrada obrigatória

- Ler `.ia.rules/continue.ia` e a fonte/FT ativa antes de operação material.
- Consultar `.ia.rules/normative-index.json`, papéis cumulativos e recusas conforme `AGENTS.md`.
- Carregar `RCF.md` e apenas as sub-RCFs disparadas pela tarefa; rotas são cumulativas quando o escopo cruza domínios.
- A árvore predecessora `.agents/` não é fonte, fallback nem destino. Núcleo ativo, estado e adaptação usam exclusivamente `AGENTS.md`, `.ia.rules/` e este arquivo raiz.

## Rotas do produto

| Gatilho | Rota mínima após o núcleo |
|---|---|
| conteúdo editorial ou revisão autoral | recurso canônico `.ia.rules/resources/editorial-authoring.md` + capacidade `WEB-EDITORIAL` + sub-RCFs do conteúdo alterado; havendo referência potencialmente divina, cadeia correferente ou caixa alta material, carregar depois `RCFs/revisao-editorial-reverencial.md` + Skill local `.ia.rules/local/skills/reverential-editorial-review/SKILL.md` |
| síntese `bate-papo:` | `RCFs/bate-papo.md` + namespaces + publicação quando aplicável |
| citação, nota ou bibliografia | `RCFs/citacoes.md` + `RCFs/referencias-e-footnotes.md` |
| TTS, forma falada, idioma, pronúncia, tabela, imagem ou gráfico acessível | recurso canônico `.ia.rules/resources/spoken-normalization.md` + `RCFs/leitura-acessivel-e-tts.md` + contrato semântico de origem; carregar `editorial-authoring.md` também somente quando houver transformação autoral |
| PageSpeed, dependência ou asset client-side | `RCFs/desempenho-e-dependencias.md` + `RCFs/carregamento-progressivo.md` |
| 404, masthead, rodapé, navegação ou componente comum | `RCFs/componentes-compartilhados.md` |
| impressão/PDF | `RCFs/impressao-ieee.md` + contrato do conteúdo afetado |
| build, Pages ou publicação | `RCFs/publicacao.md` + cenário operacional correspondente |
| documentação `.md`, metadado público ou interface de uso alterada | `RCFs/documentacao-e-metadados.md` + sub-RCF do recurso documentado |

## Invariantes de execução

- Auditar e reutilizar fonte, configuração, implementação, testes, build e artefato publicado antes de criar mecanismo.
- Equalizer é perene, literal e desmarcado; frentes subordinadas convergem sem alterá-lo.
- Norma e implementação permanecem em FTs distintas; gate não executado, bloqueado ou inconclusivo nunca é apresentado como aprovado.
- Conteúdo editorial preserva texto, voz, referências e nuances. Camada acessível/falada é aditiva e não reescreve o original visual.
- Capacidades genéricas de edição autoral e normalização falada pertencem ao núcleo gerenciado; a adaptação local contém somente roteamento e requisitos de produto que não existam nele.
- Bate-papo distingue fala, síntese e inferência; preserva divergências, citações e disclaimers cumulativos.
- PageSpeed é aferido por layout e amostras representativas, sem degradar publicação individual.
- Alteração visível valida claro/escuro, viewport, teclado e artefato renderizado aplicáveis. Publicação conclui somente com commit-fonte, artefato e URL servida convergentes.
- Alteração de sintaxe, configuração, comportamento público ou aparência documentada atualiza no mesmo ciclo a página temática, o exemplo funcional, a ilustração aplicável e o índice do `README.md`; inventários fechados derivam dos schemas e registros canônicos.
- Página canônica de modo de uso reside obrigatoriamente em `./docs/`; nenhuma equivalente é criada na raiz, em `RCFs/` ou em outro diretório.

Detalhamento autoritativo: `RCFs/operacao-da-ia.md`.
