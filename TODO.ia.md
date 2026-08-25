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
  - O logotipo da 404 DEVE reproduzir o comportamento normatizado das páginas corretas, extrapolando suavemente a barra sem crop indevido.
  - Alteração estritamente cirúrgica: NÃO regredir nem contornar estilos, responsividade, sobreposição, clipping, navegação ou recursos já evoluídos. Validar também no resultado efetivamente publicado.

- [ ] Normatizar e rotear o modus operandi especializado da IA (específico do projeto)
  - Consolidar primeiramente no RCF e, após isso, refletir de forma semanticamente equivalente e ultraotimizada em `agents.local.md` e subarquivos roteados aplicáveis as regras de **modus operandi da IA** específicas do projeto.
  - O RCF permanece como especificação detalhada/canônica subordinada ao `AGENTS.md`; `agents.local.md` e seus subarquivos DEVEM funcionar como representação operacional condensada para reduzir leitura, tokens e tempo de processamento, sem perda de força normativa, exceções, precedências ou significado.
  - Roteamento DEVE permitir carregar somente regras pertinentes ao contexto/tarefa, sem duplicação divergente nem necessidade de leitura integral do RCF quando dispensável.
  - Incluir, entre outras regras especializadas efetivamente existentes/aplicáveis:
    - avaliação contínua da aderência das otimizações do site ao `pagespeed.web.dev`, segundo os critérios já normatizados;
    - modus operandi para criação/edição de conteúdo editorial;
    - modus operandi para síntese de bate-papos;
    - padrões e decisões operacionais de TTS/acessibilidade definidos pelas TO-DOs correlatas;
    - outros que existam no RCF.

  - NÃO inventar taxonomia, caminhos, arquitetura ou fragmentação. Inspecionar o roteamento vigente e especializar somente onde produzir redução real de contexto sem romper precedência, persistência normativa ou compatibilidade.

- [ ] Tornar todo conteúdo editorial e navegação essencial semanticamente compatíveis com TTS
  - Todo artigo existente e futuro DEVE possuir representação de leitura completa, natural e inequívoca, sem exigir alteração ou inserção de explicações no texto visual original.
  - O escopo obrigatório compreende o conteúdo redacional e, ainda que não todo elemento visual do site, tudo necessário à compreensão/navegação da leitura: títulos/subtítulos, enumerações, `Anterior`, `Próximo`, paginação, identificação verbal da própria navegação, títulos e excertos dos artigos nela apresentados, links/botões sociais e separação verbal explícita entre fim de um artigo e início de outro.
  - Rodapé, avisos e alertas editoriais/legais também DEVEM ser integralmente legíveis, incluindo `IMPORTANTE`, `AVISO DE CONTEÚDO SENSÍVEL E PÚBLICO-ALVO`, `LIBERDADE DE EXPRESSÃO, LIMITES E INTERPRETAÇÃO DO CONTEÚDO`, `ATENÇÃO`, `Legal`, `Advertências`, `Privacidade`, `Licença` e equivalentes existentes.
  - Elementos exclusivamente visuais/iconográficos essenciais DEVEM possuir nome/função verbal inequívocos. Estrutura, headings, regiões e relações DEVEM permanecer programaticamente determináveis; priorizar semântica web interoperável e usar mecanismos complementares somente quando necessários.
  - Conteúdo exclusivamente auditivo/acessível PODE permanecer invisível visualmente, mas NÃO PODE ser removido da representação acessível.
  - NÃO vincular desnecessariamente a solução a motor, biblioteca ou API TTS específica; maximizar compatibilidade entre navegadores e tecnologias assistivas tecnicamente viáveis.

- [ ] Padronizar ligações, marcadores e prosódia exclusivos do TTS
  - Palavras, expressões de ligação, identificadores de contexto e informações de entonação/prosódia adicionadas exclusivamente à leitura DEVEM, tanto quanto possível, ser padronizadas no RCF e roteadas para `agents.local.md`/subarquivos aplicáveis.
  - Manter tabela normativa compacta indicando, para cada padrão: finalidade, contexto de uso, forma falada/prosódica e situações em que NÃO se aplica.
  - Abranger transições relevantes, incluindo autoria↔citação, blocos, referências, tabelas, imagens, gráficos, navegação, avisos, fim/início de artigos e equivalentes.
  - A padronização NÃO PODE produzir fala mecânica nem impedir, rara e justificadamente, expressão, entonação ou construção personalizada mais adequada ao contexto específico de uma publicação.
  - Personalizações DEVEM complementar/substituir somente a ocorrência pertinente, sem alterar o texto visual nem descaracterizar o padrão global.

- [ ] Diferenciar citações e referências na leitura TTS sem alterar o texto editorial
  - Toda citação DEVE ser verbalmente distinguível da voz autoral, inclusive quando sua estrutura visual/HTML NÃO utilizar `<blockquote>`; a classificação DEVE decorrer da semântica editorial real, não do nome técnico da tag.
  - Citação em bloco e inline DEVEM possuir tratamento fonético distinto:
    - **bloco:** delimitação verbal inequívoca de entrada/saída, com expressão humana/natural (`citação` ou equivalente), jamais jargão técnico;
    - **inline:** indicação mais breve e integrada à frase, distinguindo fonte/autoria sem destruir a unidade prosódica pretendida pelo autor.

  - A camada falada PODE adicionar marcadores exclusivamente auditivos; NÃO PODE modificar, reescrever nem inserir adendo visível no texto original.
  - Toda citação vinculada a `<sup>`, nota ou mecanismo equivalente DEVE verbalizar a fonte no ponto da ocorrência; a ausência visual de parênteses NÃO PODE tornar sua origem incompreensível.
  - Em build, gerar para cada **ocorrência** referência falada mínima e fiel, distinta da bibliografia integral:
    - `Bíblia, NVI, Isaías 53:22` → `Isaías 53:22 NVI`;
    - referência agrupada, como `Bíblia, NVI, Isaías 12:3,7;53:10,22;53:2`, quando a ocorrência usar somente `Isaías 53:10` → `Isaías 53:10 NVI`;
    - `COELHO, Paulo. O Alquimista. 1. ed. Rio de Janeiro: Rocco, 2020` → `COELHO, 2020` ou, quando necessário à desambiguação/compreensão, `COELHO, 2020. O Alquimista.`.

  - A redução DEVE derivar exclusivamente dos dados e associações reais. Se a ocorrência não puder ser vinculada inequivocamente à parcela correta da referência, NÃO inventar: preservar informação suficiente para fidelidade e tratar a insuficiência conforme mecanismos normativos existentes.

- [ ] Tratar corretamente idiomas e pronúncia no TTS
  - Palavras/expressões em outros idiomas, inclusive grego koiné, línguas antigas e equivalentes, DEVEM receber, tanto quanto tecnicamente possível, representação fonética correta no TTS.
  - A pronúncia NÃO DEVE ser inferida arbitrariamente quando houver dúvida material; pesquisar/derivar a forma adequada por mecanismos/fontes tecnicamente confiáveis.
  - Avaliar e, quando necessário, integrar mecanismos inteligentes adequados à obtenção/representação de pronúncia, exigindo gratuidade para o projeto, manutenção ativa e preferindo soluções open source quando tecnicamente equivalentes.
  - Preservar grafia visual original; adaptações fonéticas pertencem exclusivamente à camada de leitura.
  - NÃO impor ferramenta antes de avaliar compatibilidade, cobertura linguística, peso, manutenção, licenciamento e integração com a arquitetura real.
  - Todo artigo, post, página, ao ser publicada, deve ser efetivamente normalizada com o TTS.

- [ ] Tornar tabelas, imagens e gráficos compreensíveis por TTS
  - Antes da implementação, confrontar o estado real com práticas consolidadas de acessibilidade, experiência documentada de usuários e comportamento de tecnologias assistivas; NÃO escolher solução por conveniência.
  - **Tabelas:** preservar estrutura tabular e relações entre dados/cabeçalhos; garantir leitura contextual, evitando tanto sequência de valores sem significado quanto repetição excessiva. Estruturas complexas DEVEM preservar relações que não possam ser inferidas de forma simples.
  - **Imagens:** para TTS, priorizar a leitura de eventual texto legível existente na própria imagem quando pertinente ao conteúdo e, opcionalmente, uma descrição **breve e ultrasucinta** suficiente para contextualizá-la. NÃO transformar automaticamente toda imagem em descrição longa nem fabricar conteúdo ausente.
  - A descrição DEVE considerar função/contexto: imagens meramente decorativas NÃO DEVEM gerar ruído; informação visual necessária à compreensão NÃO PODE ser perdida.
  - Abranger retroativamente conteúdo editorial já publicado e normatizar o mesmo comportamento para futuras publicações, sem inventar texto ou significado quando não houver evidência suficiente.
  - **Gráficos:** o TTS DEVE extrair e verbalizar, de forma sucinta, eloquente e contextual, a informação condensada realmente relevante — intenção, tendência, direção, relações, contrastes ou conclusão pertinente — em vez de simplesmente enumerar todos os dados.
  - O requisito vale para gráficos rasterizados/imagens e gráficos construídos em runtime; preservar acesso aos dados necessários para derivar a síntese quando tecnicamente disponível.
  - Pesquisar e normatizar no RCF uma solução/biblioteca para gráficos que seja open source, mantida, tecnicamente adequada, leve em tamanho/processamento, client-side quando aplicável, capaz de cobrir os tipos/formas necessários e trabalhar com dados como CSV/JSON.
  - NÃO escolher biblioteca arbitrariamente: comparar alternativas reais quanto a capacidades, peso, manutenção, licenciamento, acessibilidade e aderência arquitetural.
  - Assets da solução de gráficos que só sejam necessários a páginas com gráficos DEVEM ser incluídos/carregados somente nelas; essa decisão DEVE ser inferida automaticamente em build a partir do conteúdo/estado real da página.

- [ ] Condicionar bibliotecas e assets auxiliares de TTS ao uso efetivo
  - Bibliotecas adicionais que complementem/estendam TTS e sejam necessárias para cumprir requisitos DEVEM ser utilizadas quando justificadas tecnicamente; NÃO evitar dependência necessária apenas por preferência arquitetural.
  - Para qualquer dependência que precise existir no client-side, seus assets DEVEM ser carregados **somente** nas páginas em que o recurso TTS específico dependente dela seja efetivamente utilizado.
  - A decisão de inclusão DEVE ser automática por página e inferida em build, sem exigir manutenção manual redundante.
  - Priorizar baixo custo de processamento e transferência, sem sacrificar correção, acessibilidade ou requisitos funcionais.
  - NÃO consolidar dependências opcionais em bundle global quando tecnicamente separáveis e desnecessárias à maioria das páginas.
  - Inspecionar o mecanismo de build/bundling vigente antes de definir a implementação; NÃO inventar pipeline, formato ou estratégia inexistente.

- [ ] Validar TTS/acessibilidade como contrato permanente, sem regressões
  - Validar artigos reais com citações em bloco/inline, `<sup>`/referências simples e agrupadas, termos estrangeiros, tabelas simples/complexas, imagens com/sem texto, gráficos em imagem/runtime, headings, listas, paginação, artigos anterior/próximo, redes sociais, avisos e rodapé.
  - Testar leitura sequencial, navegação estrutural, compreensão auditiva e naturalidade, verificando explicitamente autoria versus citação, origem das referências, pronúncia, limites entre artigos, contexto de tabelas, conteúdo relevante de imagens e síntese de gráficos.
  - Validar também a seleção/inclusão automática por página das dependências condicionais e a ausência delas onde não necessárias.
  - Maximizar compatibilidade entre navegadores e tecnologias assistivas tecnicamente viáveis sem inventar matriz de suporte; identificar alvos aplicáveis, preferir padrões interoperáveis e degradar graciosamente quando recurso complementar não existir.
  - NÃO sacrificar texto visível, SEO, impressão, navegação, layout, PageSpeed/desempenho, qualidade editorial ou recursos já normatizados para obter TTS.
  - Toda adaptação DEVE ser aditiva ou semanticamente equivalente, aderente ao `AGENTS.md`/RCF vigentes e implementada sem regressão direta ou indireta de recursos já evoluídos.
