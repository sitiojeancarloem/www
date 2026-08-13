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

  - Toda TO-DO DEVE ser separada em:
    - **Normatização (RCF):** atualização de RCFs, contratos, precedências e documentação normativa necessária;
    - **Implementação:** código, migrações, testes, validações e alterações funcionais.

  - Após a equalização, a IA DEVE iniciar e concluir imediatamente a **Normatização RCF de todas as TO-DOs**, mantendo rastreabilidade entre cada regra e sua implementação futura.

  - Concluída a normatização, a IA DEVE INTERROMPER antes de qualquer implementação e solicitar autorização expressa do desenvolvedor, informando sucintamente:
    - implementações pendentes;
    - dependências e ordem recomendada;
    - impedimentos materiais identificados.

  - Somente quando aplicável ao contexto do repositório, toda alteração que modifique o modo de codificar Markdown DEVE ser documentada no respectivo modo de uso.

  - Este item e toda a seção `# RCF — Governança da TO-DO` são perenes: NÃO PODEM ser marcados como concluídos, removidos ou alterados. Sua contabilização somente é necessária enquanto existir ao menos uma TO-DO por eles regida.

---

# TO-DOs

Este marcador encerra a seção de governança e inicia exclusivamente as TO-DOs operacionais. Todo item de topo abaixo dele está sujeito integralmente ao RCF acima.

---

- [ ] Corrigir definitivamente a regressão do logotipo na página 404
  - A FT destinada a corrigir `.ia.rules\state\requests\evidencias\evidencia1.png` NÃO resolveu o defeito, ao menos no GitHub Pages atualmente publicado.
  - Usar `evidencia1a.png` como referência do comportamento esperado e `evidencia1b.png` como estado efetivamente observado nas páginas 404.
  - Inspecionar causa, FT, fontes, build e artefato publicado conforme necessário; corrigir a causa real, NÃO apenas o caso local/visual.
  - O logotipo da 404 DEVE reproduzir o mesmo comportamento normatizado das páginas corretas, extrapolando suavemente a barra sem crop indevido.
  - Alteração estritamente cirúrgica: NÃO regredir nem contornar estilos, responsividade, sobreposição, clipping, navegação ou recursos já evoluídos. Validar também no resultado efetivamente publicado.

- [ ] Tornar todo conteúdo editorial e navegação essencial semanticamente compatíveis com TTS
  - Todo artigo existente e futuro DEVE possuir representação de leitura completa, natural e inequívoca, sem exigir alteração ou inserção de explicações no texto visual original.
  - O escopo obrigatório compreende o conteúdo redacional e, ainda que não todo elemento visual do site, tudo que seja necessário à compreensão/navegação da leitura: títulos/subtítulos, enumerações, `Anterior`, `Próximo`, paginação, identificação da própria navegação, títulos e excertos dos artigos nela apresentados, links/botões sociais e separação verbal explícita entre fim de um artigo e início do seguinte.
  - Rodapé, avisos e alertas editoriais/legais também DEVEM ser integralmente legíveis, incluindo `IMPORTANTE`, `AVISO DE CONTEÚDO SENSÍVEL E PÚBLICO-ALVO`, `LIBERDADE DE EXPRESSÃO, LIMITES E INTERPRETAÇÃO DO CONTEÚDO`, `ATENÇÃO`, `Legal`, `Advertências`, `Privacidade`, `Licença` e equivalentes existentes.
  - Elementos apenas visuais/iconográficos DEVEM possuir nome/função verbal inequívocos. Estrutura de página, headings, regiões e relações DEVEM continuar programaticamente determináveis; HTML semântico é prioritário e ARIA somente complementa onde necessário. W3C documenta que essa estrutura é exposta pelas APIs de acessibilidade e utilizada por tecnologias assistivas.
  - Conteúdo adicional destinado exclusivamente à fala/acessibilidade PODE permanecer visualmente oculto, mas DEVE continuar disponível à representação acessível; NÃO usar mecanismo que o elimine também da leitura.
  - NÃO vincular a solução desnecessariamente a motor, biblioteca ou API TTS específica. Maximizar interoperabilidade por semântica web padronizada e aplicar recursos específicos somente como aprimoramento quando a implementação real justificar.

- [ ] Diferenciar citações e referências na leitura TTS sem alterar o texto editorial
  - Toda citação DEVE ser verbalmente distinguível da voz autoral, inclusive quando a marcação visual/HTML utilizada pelo projeto NÃO for `<blockquote>`. A classificação DEVE decorrer da semântica editorial existente, não do nome técnico da tag.
  - Citação em bloco e citação inline DEVEM possuir tratamentos foneticamente distintos:
    - **bloco:** delimitação verbal inequívoca de entrada/saída, com expressão humana e natural (`citação` ou equivalente), jamais jargão técnico;
    - **inline:** indicação mais breve e integrada à frase, suficiente para distinguir fonte e autoria sem romper desnecessariamente a unidade prosódica pretendida pelo autor.

  - A camada falada PODE adicionar marcadores exclusivamente auditivos; NÃO PODE modificar, reescrever ou acrescentar adendos visíveis ao texto original.
  - Preservar semântica própria de citações longas e curtas; W3C distingue estruturalmente citações em bloco e conteúdo citado inline e recomenda marcação semântica capaz de ser percebida por agentes de usuário.
  - Toda citação vinculada a nota/referência por `<sup>` ou mecanismo equivalente DEVE verbalizar sua fonte no ponto da menção; a ausência visual de parênteses NÃO PODE tornar a origem incompreensível ao ouvinte.
  - Em build, gerar para cada **ocorrência** uma referência falada mínima e fiel, separada da referência bibliográfica integral, sem alterá-la:
    - `Bíblia, NVI, Isaías 53:22` → `Isaías 53:22 NVI`;
    - referência agrupada contendo diversos versículos → verbalizar somente o(s) versículo(s) efetivamente citado(s) naquela ocorrência, por exemplo `Isaías 53:10 NVI`;
    - `COELHO, Paulo. O Alquimista. 1. ed. Rio de Janeiro: Rocco, 2020` → `COELHO, 2020` ou, somente quando necessário à desambiguação/compreensão, `COELHO, 2020. O Alquimista.`.

  - A redução DEVE derivar exclusivamente dos dados e da associação reais da citação. Se a ocorrência não puder ser relacionada inequivocamente à parcela correta da referência, NÃO inventar: preservar informação suficiente para fidelidade e sinalizar a insuficiência conforme os mecanismos normativos existentes.

- [ ] Tornar tabelas e imagens compreensíveis por leitura assistiva/TTS
  - Antes da implementação, confrontar o estado real com práticas consolidadas de acessibilidade, críticas documentadas e comportamento de tecnologias assistivas; NÃO escolher solução por conveniência ou preferência arbitrária.
  - **Tabelas:** preservar estrutura tabular real e relações entre células e cabeçalhos; fornecer identificação/caption quando necessária e garantir que cada dado possa ser relacionado aos respectivos cabeçalhos durante a leitura. Para estruturas complexas, representar explicitamente relações que não possam ser inferidas da estrutura simples. W3C destaca caption como mecanismo de identificação e associação de cabeçalhos como requisito para manutenção do contexto durante leitura por screen reader.
  - A leitura linear de tabela NÃO DEVE resultar em sequência de valores sem contexto nem em repetição excessiva que destrua a compreensão; adaptar a representação falada à estrutura real preservando integralmente dados e relações.
  - **Imagens:** fornecer alternativa textual conforme função e contexto, NÃO descrição literal indiscriminada. Imagem informativa DEVE comunicar seu significado; funcional, sua função; meramente decorativa NÃO DEVE gerar ruído; imagem complexa DEVE possuir identificação curta e descrição textual suficiente para transmitir a informação essencial. Essas distinções seguem a orientação WAI consolidada.
  - Abranger retroativamente imagens editoriais já publicadas e normatizar o mesmo requisito para novas publicações, sem fabricar conteúdo descritivo quando não houver informação suficiente para descrevê-las fielmente.

- [ ] Validar TTS/acessibilidade como contrato permanente, sem regressões
  - Validar artigos reais com citações em bloco/inline, `<sup>`/referências simples e agrupadas, tabelas simples/complexas, imagens informativas/decorativas/complexas, headings, listas, paginação, artigos anterior/próximo, redes sociais, avisos e rodapé.
  - Testar leitura sequencial, navegação estrutural e compreensão auditiva, verificando explicitamente autoria versus citação, origem das referências, limites entre artigos, contexto de tabelas e finalidade das imagens.
  - Maximizar compatibilidade entre navegadores e tecnologias assistivas tecnicamente viáveis sem inventar matriz de suporte: identificar os alvos efetivamente aplicáveis ao projeto, preferir padrões interoperáveis e degradar graciosamente quando um recurso complementar não existir.
  - NÃO sacrificar texto visível, SEO, impressão, navegação, layout, desempenho ou recursos já normatizados para obter TTS; toda adaptação DEVE ser aditiva ou semanticamente equivalente e permanecer compatível com WCAG/semântica web aplicável.
