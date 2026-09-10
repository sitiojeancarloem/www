# RCF — Governança da TO-DO

Esta seção de governança DEVE permanecer no topo do arquivo, NÃO PODE ser removida nem editada e rege todas as TO-DOs posteriores até o marcador explícito de início das TO-DOs operacionais.

O arquivo TODO.ia.md não pode ser removido.

## 1. Estrutura normativa do arquivo

Este arquivo constitui uma lista normativa e operacional de TO-DOs convergentes.

Todo item de topo DEVE:

- iniciar exatamente com `- [ ]` ou `- [x]`;
- começar sem indentação;
- representar uma frente autônoma subordinada às normas deste RCF.

Todo conteúdo imediatamente posterior a um item de topo, enquanto não houver outro item iniciado sem indentação por `- [ ]` ou `- [x]`, DEVE ser interpretado como subordinado ao item de topo imediatamente anterior.

A forma interna dessa subordinação é livre: PODE conter subtítulos, subitens, regras em estilo RCF, ordens, critérios, listas de afazeres, etapas, notas ou estruturas equivalentes. A semântica hierárquica prevalece sobre a forma.

A formatação do arquivo DEVE preservar indentação visual coerente e inequívoca de todo conteúdo subordinado. Títulos, listas, blocos e demais conteúdos pertencentes a um item de topo DEVEM permanecer visualmente aninhados a ele.

## 2. Status, andamento e conclusão

A marcação `[x]` NÃO significa conclusão: indica apenas que o item foi lido, teve sua FT criada e encontra-se em andamento. Itens NÃO iniciados DEVEM permanecer como `[ ]`.

TO-DOs integralmente concluídas DEVEM ser removidas, mantendo o arquivo limpo.

## 3. Regra perene de convergência

- [ ] Equalizar e executar as TO-DOs como frentes convergentes de um único objetivo
  - Este item rege todas as demais TO-DOs. Cada uma DEVE ser tratada como frente complementar de uma única execução, conciliada com as demais e convergente ao objetivo principal do projeto.

  - Contradições aparentes DEVEM ser presumidas como imprecisão redacional e resolvidas por equalização, sem perda de intenção, requisito, restrição ou nuance. Havendo conflito material não solucionável pelas normas e pelo contexto, o desenvolvedor DEVE ser consultado.

  - Considerações, comparações ou solicitações PODEM não ser plenamente aderentes ao projeto, especialmente quando previamente processadas por IA. Salvo dúvida material, a IA DEVE interpretá-las conforme o contexto já normatizado no RCF e no `README.md`; persistindo ambiguidade ou incompatibilidade, DEVE consultar o desenvolvedor antes de prosseguir.

  - O `AGENTS.md` prevalece absolutamente; o RCF vigente prevalece sobre as demais fontes subordinadas. Toda alteração DEVE aprimorar o projeto, ampliar capacidades e recursos, preservar compatibilidade e força normativa e NÃO PODE introduzir regressão.

  - Antes de executar qualquer TO-DO, a IA DEVE:
    1. ler integralmente todas as TO-DOs e normas aplicáveis;
    2. equalizar objetivos, requisitos, dependências, precedências e terminologia;
    3. resolver incompatibilidades, ambiguidades, sobreposições e lacunas;
    4. adaptar, consolidar, desmembrar, reordenar ou eliminar itens somente quando isso aumentar a coerência sem reduzir o objetivo material.

  - Toda TO-DO DEVE ser separada em fases:
    - **Normatização (RCF):** atualização de RCFs, contratos, precedências e documentação normativa necessária;
    - **Implementação:** código, migrações, testes, validações e alterações funcionais.

  - Após a equalização, a IA DEVE iniciar e concluir imediatamente a **Normatização RCF de todas as TO-DOs**, mantendo rastreabilidade entre cada regra e sua implementação futura.

  - Concluída a normatização, a IA DEVE INTERROMPER antes de qualquer implementação e solicitar autorização expressa do desenvolvedor, informando sucintamente:
    - implementações pendentes;
    - dependências e ordem recomendada;
    - impedimentos materiais identificados.

  - Somente quando aplicável ao contexto do repositório, toda alteração que modifique o modo de codificar Markdown DEVE ser documentada no respectivo modo de uso.

  - Este item e toda a seção `# RCF — Governança da TO-DO` são perenes: NÃO PODEM ser marcados como concluídos, removidos ou alterados. Sua contabilização somente é necessária enquanto existir ao menos uma TO-DO por eles regida.

## 4. Legenda de Status

Emojis substituem os checkboxes do GitHub e indicam o ciclo de vida da tarefa (status):

- ⬜ **Não iniciada `[ ]`:** na fila, aguardando início.
- 📌 **Registrada:** possui **FT (Frente de Trabalho)** equivalente criada.
- 📜 **Normatizada:** revisada, alinhada aos requisitos técnicos e incorporada ao RCF ou norma equivalente.
- ⚖️ **Equalizada:** compatibilizada com as demais TO-DOs, podendo ter sido ajustada/adaptada para eliminar conflitos, redundâncias ou inconsistências.
- ⏳ **Em desenvolvimento:** implementação em andamento.
- 🔄 **Retomada:** retornou ao desenvolvimento após feedback ou correção de bugs solicitada pelo dev.
- 🔎 **A revisar:** já percorreu uma ou mais etapas, mas deve ser reavaliada frente a novas demandas, TO-DOs ou revisões do projeto quanto à **adequação, pertinência, atualidade e ajustes necessários**.
- ✅ **Concluída — pendente de validação:** implementação finalizada, aguardando aprovação humana (Code Review/QA).

> ⚠️ **Regras:** nem todo item/subitem precisa percorrer todos os status. Apenas **⬜ Não iniciada**, **⏳ Em desenvolvimento** e **✅ Concluída** são obrigatórios; os demais aplicam-se quando pertinentes. Após validação e aprovação efetiva pelo dev, a tarefa DEVE ser **removida integralmente da lista**. ✅ significa apenas **implementada**, não **aprovada/encerrada**.

# TO-DOs

Este marcador encerra a seção de governança e inicia exclusivamente as TO-DOs operacionais. Todo item de topo abaixo dele está sujeito integralmente ao RCF acima.

---

- [x] Manter documentação de uso, referências normativas e metadados do projeto sincronizados com o estado real
  - [ ] Atualizar continuamente `README.md` sempre que modo de uso, configuração, comportamento ou recurso documentável for adicionado ou alterado.
    - [ ] Evitar concentrar documentação densa em uma única página: distribuir conteúdo por subpáginas `.md` por contexto/função.
    - [ ] No `README.md`, indexar as subpáginas preferencialmente em tabela, com:
      - link direto;
      - descrição ultrassucinta, porém suficiente para identificar contexto, aplicação real, função e, quando relevante, horizonte de uso/oportunidades.
    - [ ] NÃO depender apenas do nome de um termo/recurso quando ele não for suficiente para explicar seu alcance ou aplicação.
  - [ ] Criar e manter uma única página `.md` de uso e configuração de `Cover`, ligada diretamente pelo `README.md` e pelo RCF aplicável.
    - [ ] Explicar, de forma sucinta e suficiente para humanos, os modos/estilos de `Cover`, formas de uso em artigos e configurações aplicáveis.
    - [ ] Incluir ao menos um exemplo prático, copiável, funcional sem erro e aplicável a um cenário real.
    - [ ] Incluir uma ilustração SVG simples para cada variação/modo de `Cover`.
      - [ ] Todos os SVGs DEVEM compartilhar padrão, estilo, dimensões/formato e linguagem visual, permitindo comparação direta entre modos.
      - [ ] Cada SVG DEVE expressar visualmente, de forma simples mas suficiente, o conceito e a diferença do respectivo modo.
      - [ ] Os SVGs DEVEM permanecer legíveis no GitHub em temas claro e escuro.
    - [ ] Atualizar a página e os SVGs sempre que um modo for criado/removido, ou quando sua apresentação visual/semântica mudar.
  - [ ] Criar e manter uma única página `.md` de uso, configuração e estilos de `blockquote`, ligada diretamente pelo `README.md` e pelo RCF aplicável.
    - [ ] Documentar todos os modelos de `blockquote`, inclusive variantes implementadas por HTML derivado com tag/estrutura diferente da tag `<blockquote>`.
    - [ ] Para cada modelo, incluir representação visual fiel à aparência real, por SVG ou imagem adequada, legível no GitHub em temas claro e escuro.
    - [ ] Cada modelo DEVE ser representado pelo menos uma vez.
      - [ ] Quando um mesmo modelo admitir apenas variações de cor, NÃO é necessário ilustrar cada cor; dois exemplos com cores distintas são suficientes.
      - [ ] Quando um mesmo modelo admitir apenas variações de ícone, NÃO é necessário ilustrar cada ícone; dois exemplos com ícons distintoss são suficientes.
      - [ ] Se as cores/ícones forem selecionadas por nomes arbitrários, documentar todos os nomes disponíveis.
      - [ ] Se os ícones puderem ser informados a partir de links externos,a partir de fonte de ícones ou, de recursos internos, explicar o modo de uso de cada situação e, em caso de recursos internos, listar de forma suscinta mas completa, todos os disponíveis.
      - [ ] Quando um nome representar combinação de múltiplas cores, inclusive tons distintos, exibir uma pequena paleta visual que mostre a combinação real correspondente.
    - [ ] Explicar, de forma sucinta e suficiente para humanos, sintaxe, estrutura, formas de uso e configurações aplicáveis.
    - [ ] Incluir ao menos um exemplo prático, copiável, funcional sem erro e aplicável a um cenário real.
    - [ ] Atualizar a página e suas ilustrações sempre que estilos, modelos, sintaxe, configuração ou aparência forem adicionados ou alterados.
  - [ ] Garantir que toda documentação de modo de uso contenha pelo menos um exemplo prático que:
    - [ ] simule uso real;
    - [ ] possa ser copiado sem alterações obrigatórias;
    - [ ] seja funcional e sem erro;
    - [ ] demonstre a aplicação concreta do recurso documentado.
  - [ ] Incorporar ao `AGENTS.local.md`, em rota/subarquivo específico, as regras deste TO-DO que constituam modus operandi permanente de codificação/desenvolvimento e atualização/criação do(s) .md.
    - [ ] Essas regras DEVEM ser carregadas sempre — e apenas — quando houver necessidade de:
      - alterar documentação `.md`;
      - adicionar/alterar recurso cuja forma de uso exija atualização documental;
      - atualizar documentação análoga afetada por mudança de comportamento, configuração ou interface de uso.
    - [ ] A regra operacional DEVE exigir que alterações na forma de uso impliquem atualização das páginas correspondentes e de seus exemplos/ilustrações aplicáveis.
  - [ ] Completar metadados de projeto em `package.json` e arquivos equivalentes, quando aplicável.
    - [ ] Informar a URL do repositório upstream.
    - [ ] Informar licença.
    - [ ] Informar autor principal (JeanCarloEM, www.jeancarloem.com).
    - [ ] Preservar/adicionar demais metadados equivalentes aplicáveis ao formato.
  - [ ] Adicionar ao `README.md` link explícito para o repositório upstream.
