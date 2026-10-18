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
