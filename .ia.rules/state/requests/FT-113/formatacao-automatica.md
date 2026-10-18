# Continuação humana — formatação automática

Origem: chat Codex `01a12c51-f180-7c12-95dd-ade8bbc280d7`, 2026-10-18. Continuidade de FT-113–FT-115; autorização para diagnóstico e correção pertinente somente neste repositório. Implementação e validação serão segmentadas após diagnóstico reproduzível.

Sem mudar o contexto do pedido, mas em continuidade a novos problemas que surgiram:

# PROMPT — CORREÇÃO CIRÚRGICA DA FORMATAÇÃO AUTOMÁTICA · SEM REGRESSÕES

Investigue e corrija a configuração efetivamente responsável por inserir automaticamente uma linha vazia entre tabelas e seus atributos associados, tanto **durante a edição quanto ao salvar**.

**Contrato obrigatório:** o atributo DEVE permanecer **imediatamente após a tabela, sem linha vazia intermediária**, inclusive após qualquer formatação automática.

1. **Diagnóstico:** inspecionar sintaxe, arquivos afetados, configuração vigente, Prettier, extensões/formatadores do VS Code, formatador padrão, ações ao salvar e demais mecanismos aplicáveis. Identificar a causa real e eventuais conflitos; NÃO presumir responsável, sintaxe, tecnologia ou suporte à configuração.
2. **Correção mínima:** ajustar exclusivamente as configurações ou regras de formatação pertinentes, preferencialmente no escopo específico da sintaxe/arquivo afetado, preservando a formatação dos demais elementos. Avaliar configuração nativa antes de soluções adicionais; NÃO inventar opções inexistentes nem introduzir ferramentas, scripts ou dependências desnecessárias.
3. **Preservação:** **É PROIBIDO desabilitar, contornar ou degradar a formatação automática**, global ou localmente, desativar `formatOnSave`, `formatOnType` ou mecanismos equivalentes, ignorar arquivos inteiros, modificar conteúdo para mascarar o defeito ou impor alterações incompatíveis com as normas existentes.
4. **Validação:** reproduzir o problema antes da correção; verificar edição, salvamento e formatação explícita, assegurando que a tabela e seu atributo permaneçam adjacentes, sem alteração indevida de outros conteúdos. Confirmar estabilidade e idempotência após formatações e salvamentos sucessivos.
5. **Compatibilidade:** respeitar configurações, contratos e precedências existentes; evitar mudanças globais quando houver solução localizada. Se o formatador responsável não oferecer suporte à regra, comprovar a limitação e avaliar alternativas compatíveis, sem sacrificar a formatação vigente nem simular resolução.

**ACEITE BLOQUEANTE:** o problema só estará resolvido quando a adjacência tabela–atributo for preservada automaticamente, de modo reproduzível e estável, **sem perda das demais funcionalidades de formatação**. Implementar apenas a correção necessária e relatar objetivamente causa, alterações e testes efetivamente realizados.

## Complementação humana no mesmo turno — 2026-10-18

### ADENDO BLOQUEANTE — ATRIBUTOS EQUIVALENTES · ADJACÊNCIA CONDICIONAL

Amplie a investigação para **TODOS os atributos sintaticamente equivalentes**, incluindo, como mero exemplo não exaustivo, atributos de personalização/customização de `blockquote`, tabelas e demais elementos.

1. **Inspecionar:** identificar sintaxes, regras de associação, requisitos reais de adjacência, comportamento dos parsers/renderizadores e interferência dos formatadores, sem presumir que todos os atributos compartilhem as mesmas exigências.
2. **Priorizar flexibilidade:** verificar se a associação entre elemento e atributo PODE funcionar corretamente **com ou sem linha vazia**. Se viável, admitir ambas as formas é uma **correção válida e preferível**, desde que preserve semântica, renderização, compatibilidade e formatação automática.
3. **Adjacência obrigatória:** quando tecnicamente indispensável, garantir que o formatador preserve o atributo imediatamente após seu elemento, inclusive durante edição, salvamento e formatação explícita.
4. **Correção na origem:** avaliar parser, sintaxe e formatador efetivamente envolvidos; alterar somente o necessário, respeitando contratos e precedências. NÃO modificar normas para encobrir defeitos nem ampliar artificialmente a gramática.
5. **Validação:** testar cada categoria identificada, com e sem linha vazia, verificando associação correta, renderização, ausência de regressões e idempotência após formatações sucessivas.

**ACEITE:** nenhum atributo DEVE perder sua associação semântica por intervenção do formatador. **NÃO exigir adjacência quando ela puder ser dispensada com segurança; NÃO dispensá-la quando for necessária.** Preservar integralmente a autoformatação existente, sem desativações, contornos ou degradações.

Checkpoint de supervisão: job `bd98a7c5-1785-46c9-8267-0048dd9ade26` já iniciado somente para diagnóstico delimitado da tabela/configuração; não implementa solução nem cobre o aceite ampliado. Reaproveitar seu resultado e segmentar a investigação das demais categorias antes da implementação.

Checkpoint após resultado único de `bd98a7c5`: reprodução Prettier 3.7.4 insere linha vazia; workspace configura Prettier Markdown e formatOnSave=true. Unidade read-only, sem commits/mutações de implementação; Git determinístico dev ahead 2, alterações herdadas preservadas. Não aceitas como comprovadas: ausência universal de opção nativa, exclusão de conflitos e equivalência CLI/editor. Recomendações de novos plugins/formatadores não aprovadas. Próxima unidade delimitada: inventário das categorias IAL usadas e matriz Kramdown GFM antes/depois do Prettier, com/sem linha vazia, sem implementar nem modificar conteúdo ou normas.

Checkpoint `bec20b0f`, resultado consultado uma vez: comando attribute_matrix exit0, Kramdown2.5.2/Prettier3.7.4. Conferência da saída persistida em evidence.jsonl corrige o resumo do Worker: table/heading/pre/hr perdem associação para p; blockquote/ALD passam para p interno; listas ul/ol adjacentes perdem data-probe. Definition list/HTML e spans preservaram os alvos nas fixtures. Formatações eram idempotentes textualmente, mas isso não prova semântica. Com linha vazia, atributos de blocos podem atingir o parágrafo seguinte: não admitir ambas formas sem prova por categoria. Inventário real incompleto: o guia docs/MODO-DE-USO-BLOCKQUOTE.md:11 contém data-jcem-quote-model e data-jcem-quote-icon, contrariando a alegada ausência. Nenhuma alteração funcional ou commit do Worker; Git determinístico dev ahead3 com alterações herdadas. Rejeitadas desativação do Prettier e dependências especulativas. Próxima unidade determinística: inventário limitado correto, opções nativas e AST/API locais para escolher extensão mínima sem mudar gramática nem conteúdo.
