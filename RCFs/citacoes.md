<!-- AI-PROCESSED -->
# RCF-JCEM-CITACOES-001

Status: vigente; implementação material validada em 2026-08-09.

Escopo: citação inline, subcitação e bloco semântico de citação em artigo ou post processado por Markdown, HTML, Jekyll e adaptações equivalentes.

Documentação de autoria: [`docs/MODO-DE-USO-BLOCKQUOTE.md`](../docs/MODO-DE-USO-BLOCKQUOTE.md), derivada do registro canônico `config/editorial-quotes.json`.

## Conceitos e fronteiras

- **Bloco de citação** ou `blockquote` DEVE significar conteúdo citado estruturalmente destacado, independentemente de ser materializado por `<blockquote>`, `div`, `table`, componente ou elemento customizado. A tag isolada NÃO DEVE ser a definição do conceito. [860dfdf]
- Estrutura diferente de `<blockquote>` somente DEVE integrar o conceito quando possuir marcador semântico inequívoco e acessível. Aparência, classe acidental, tag, profundidade, texto ou posição no DOM NÃO DEVEM provar equivalência. [860dfdf]
- **Citação inline** DEVE significar trecho citado dentro de um parágrafo comum, sem ancestral de bloco de citação e sem estar contido em outra citação. O trecho DEVE conservar delimitadores, texto, nós e significado originais. [860dfdf]
- **Subcitação** DEVE significar citação semanticamente aninhada em outra citação inline ou em bloco, independentemente da estrutura visual da citação externa. Citação dentro de bloco NÃO DEVE ser classificada como citação inline externa. [860dfdf]
- Citação, código, ênfase autoral, referência, link, nota e pontuação DEVEM permanecer conceitos distintos. Detecção NÃO DEVE usar substituição textual ingênua sobre Markdown ou HTML bruto quando AST, DOM, token ou marcador semântico estiver disponível. [860dfdf]

## Contrato de autoria Markdown e HTML

- Bloco Markdown comum DEVE continuar sendo escrito com `>` e DEVE receber o modelo padrão quando não houver marcação específica. [860dfdf]
- Linha Markdown iniciada exatamente por `>`, seguida de zero ou mais espaços ou tabs e de `--` como token de autoria, DEVE convergir para `> —` antes da conversão Markdown. A normalização DEVE substituir somente esse prefixo, conservar byte a byte o conteúdo subsequente e as terminações de linha e ser idempotente. [6257fc8]
- A normalização de autoria NÃO DEVE alcançar `--` fora do início direto do bloco, conteúdo inline, bloco aninhado com outro marcador entre `>` e `--`, código, front matter ou sequência de três ou mais hifens. O pipeline PODE normalizar o conteúdo em memória, mas o acervo controlado DEVE usar diretamente o travessão canônico. [6257fc8]
- Modelo por ocorrência DEVE ser declarado por Kramdown Inline Attribute List imediatamente após o bloco, usando `data-jcem-quote-model` com identificador registrado, por exemplo: [860dfdf]

  ```markdown
  > Conteúdo citado.
  {: data-jcem-quote-model="futuristic"}
  ```

- O mesmo atributo DEVE selecionar tanto variante meramente visual quanto modelo que altere a estrutura construída; o registro do modelo, não uma segunda sintaxe, DEVE declarar renderer, classes, semântica, suporte a tema e impressão. [860dfdf]
- `standard` e `futuristic` DEVEM identificar, respectivamente, bloco sem transformação estrutural e painel futurista já existente. `framed-accent`, `pull-quote`, `centered-mark`, `editorial-statement` e `thematic-rail` DEVEM identificar, respectivamente, o card parametrizável derivado de e1/e2 e os modelos derivados de e3, e4, e5 e e6; novo identificador DEVE ser documentado, versionado, validado e incorporado sem reestruturar o contrato. [9d82ae0]
- Estrutura HTML equivalente DEVE declarar `data-jcem-blockquote` e, quando necessário, `data-jcem-quote-model`; `role`, elemento nativo, `cite` ou metadado equivalente DEVE preservar a semântica e a acessibilidade. O adaptador DEVE normalizar esse contrato para a API agnóstica antes de aplicar renderer. [860dfdf]
- Citação inline delimitada por par de aspas retas ou tipográficas dentro de parágrafo elegível DEVE receber representação semântica de ênfase sem perder os delimitadores. Apóstrofo, aspas sem par, delimitador vazio e texto atravessando nós incompatíveis NÃO DEVEM ser convertidos por inferência. [860dfdf]
- Backtick Markdown DEVE permanecer código inline por padrão, preservando posts técnicos. Quando o conteúdo entre backticks representar citação, a autoria DEVE declará-lo inequivocamente com IAL, por exemplo `` `conteúdo citado`{: .jcem-inline-quote}``; essa declaração DEVE preservar o texto e substituir somente a classificação de código pela de citação. [860dfdf]
- Marcação explícita existente de ênfase ou citação DEVE prevalecer sobre detecção automática e NÃO DEVE ser duplicada. Conteúdo em `pre`, código não marcado como citação, `kbd`, `samp`, `script`, `style`, referência, bibliografia ou footnote NÃO DEVE ser reclassificado. [860dfdf]
- Alteração futura desta sintaxe, identificador ou precedência DEVE atualizar este RCF, o README e migração compatível na mesma FT. [860dfdf]

## Modelos e precedência

- O registro canônico DEVE declarar aliases configuráveis `primary` e `destaque`, inicialmente resolvidos para `thematic-rail` e `futuristic`; bloco sem indicação DEVE consumir `primary`, enquanto `data-jcem-quote-model="destaque"` DEVE consumir o destino vigente de `destaque`. [9d82ae0]
- Cada ocorrência DEVE resolver exatamente um modelo pela ordem: identificador concreto em `data-jcem-quote-model` → alias `destaque` da ocorrência → alias `primary`; a resolução DEVE ocorrer no build, materializar o identificador concreto somente no HTML derivado e preservar a fonte autoral vinculada ao alias para que mudança central regenere todas as dependências. [9d82ae0]
- O contrato legado de artigo `blockquote_panels: true|false`, inclusive sob `jcem`, DEVE permanecer compatível e mapear para `futuristic|standard`; configuração específica por ocorrência DEVE prevalecer sobre esse booleano, e o alias primário central DEVE reger artigos sem override legado local. [9d82ae0]
- Modelo desconhecido em fonte controlada DEVE falhar na validação de build com identificação da ocorrência. Artefato legado ou runtime sem registro DEVE degradar para `standard`, conservar todo o conteúdo e emitir diagnóstico, nunca remover ou ocultar a citação. [860dfdf]
- Registro de modelo DEVE declarar identificador, versão, estrutura ou estilo, entrada semântica, classes ou atributos emitidos, suporte a tema, impressão, acessibilidade, transformação reversível ou fallback e testes. Renderer NÃO DEVE depender de estrutura privada do artigo. [860dfdf]
- Transformação estrutural DEVE preservar ou reconstruir a semântica de citação, atributos, conteúdo, links, notas, referências, idioma, direção, foco e ordem de leitura. Ausência de JavaScript DEVE manter o bloco nativo legível. [860dfdf]
- Padrão global NÃO DEVE sobrescrever configuração contextual, de artigo ou da ocorrência. Novo modelo NÃO DEVE alterar implicitamente ocorrências já resolvidas. [860dfdf]

### Modelos derivados de e1–e6

- As imagens canônicas `e1.png` a `e6.png` DEVEM reger como referências visuais estritas toda a composição dos cinco modelos derivados, e a enumeração humana de divergências NÃO DEVE ser tratada como exaustiva. Somente exceção expressa neste RCF PODE afastar característica visível da referência; permanecem autorizadas a font-family canônica, a adaptação cromática aos temas, a exclusão dos fundos externos de e4/e5 e a unificação estrutural de e1/e2 com parametrização de accent. [961101f]
- `framed-accent` DEVE usar uma única estrutura responsiva para as evidências e1/e2 e aceitar `data-jcem-quote-accent` somente com token cromático registrado; `cyan` e `amber` DEVEM reproduzir as duas referências iniciais sem estilo inline, e token desconhecido DEVE falhar no build controlado. [9d82ae0]
- `framed-accent` DEVE preservar moldura lateral e inferior, superfície interna, cabeçalho destacado e adorno lateral; `pull-quote` DEVE preservar aspas grandes laterais, corpo alinhado à esquerda, autoria inferior à esquerda e pequeno recuo do conjunto; `centered-mark` DEVE preservar aspas superiores, corpo estreito centralizado e ausência de fundo externo; `editorial-statement` DEVE preservar aspas superiores, declaração forte centralizada, autoria inferior e ausência de fundo externo fixo. [961101f]
- `thematic-rail` DEVE preservar corpo justificado, autoria alinhada à esquerda, duas hastes verticais colineares e as duas aspas integralmente visíveis dentro do intervalo entre elas. O intervalo e as hastes DEVEM possuir geometria própria estável; a área efetivamente pintada das aspas DEVE permanecer verticalmente centralizada no intervalo e inteiramente contida na caixa de pintura mesmo sob `content-visibility`, sem mudar de proporção ou posição conforme quantidade, quebra ou altura do texto. [b182de6]
- Todo modelo novo e preexistente DEVE possuir estado claro e escuro legível, atraente e coerente, usar a font-family canônica no conteúdo, limitar tipografia diferenciada a adornos decorativos e adaptar-se a 320 px sem corte, overflow ou perda de ordem. [3f5a0f9]
- Modelo visual, alias e token cromático DEVEM permanecer dimensões distintas no registro, no renderer e na documentação; não se PODE duplicar estrutura, criar hardcode por artigo ou congelar em conteúdo o modelo concreto resultante de alias. [9d82ae0]

### Modelos tipados de aviso

- O registro DEVE incluir `notice`, `info`, `alerta1` e `alerta2` como modelos semânticos responsivos, além de `standard` e `futuristic`. A referência conceitual é, respectivamente, aviso documental, informação em uso, revisão recente e ausência de referência; estrutura ou dependência da Wikipédia NÃO DEVE ser copiada. [860dfdf]
- A autoria DEVE usar a sintaxe única vigente, por exemplo `{: data-jcem-quote-model="alerta1"}`. Ícone opcional PODE ser declarado por `data-jcem-quote-icon` para emoji/texto curto ou por `data-jcem-quote-icon-src` acompanhado de `data-jcem-quote-icon-alt` para imagem ou recurso permitido. [860dfdf]
- URL de ícone DEVE ser relativa segura ou HTTPS, sem esquema executável; imagem sem texto alternativo DEVE falhar. Na ausência de ícone, o registro PODE fornecer padrão contextual decorativo com `aria-hidden`. [860dfdf]
- Modelo tipado DEVE preservar `blockquote`, conteúdo, referências, contraste, foco e ordem de leitura; tema claro/escuro e viewport estreito DEVEM ajustar tokens e composição sem truncamento. [860dfdf]
- Impressão DEVE ignorar integralmente a aparência web dos modelos tipados e usar o estilo IEEE padrão, salvo exceção seletiva registrada exclusivamente na sub-RCF de impressão. [860dfdf]
- Ícone de modelo tipado DEVE ocupar somente a área necessária à sua própria apresentação e alinhar-se ao início do conteúdo. A composição NÃO PODE criar linha implícita, altura mínima ou vazio inferior artificial; o padding legítimo do contêiner permanece uniforme e independente da quantidade de conteúdo. [54a9a7d]

## Apresentação de citações inline e subcitações

- Toda citação inline elegível em texto comum DEVE ser renderizada em itálico por elemento ou classe semântica, preservando ênfase interna preexistente e demais estilos legítimos. O contêiner semântico já distingue um bloco de citação; por isso, seu corpo e seus parágrafos NÃO DEVEM receber itálico automático. [5eb4ab6]
- A profundidade citacional DEVE ser calculada pela cadeia de ancestrais semânticos, não pela tag isolada. Subcitação imediata, com profundidade um, DEVE receber somente itálico, sem fundo, borda, sombra ou ornamento próprio. Somente profundidade dois ou superior PODE receber fundo discreto por token `rgba`, quando necessário para distinguir inequivocamente os níveis. [5eb4ab6]
- Fundo de subcitação possui finalidade única de diferenciação sutil de hierarquia; NÃO PODE funcionar como alerta, destaque, ênfase editorial ou ornamento. Deve adaptar contraste e composição em tema claro, escuro, `standard`, `futuristic` e demais modelos registrados, com intensidade proporcional, sem sobrescrever tipografia, estrutura ou estilo legítimo do contexto. [5eb4ab6]
- Borda de bloco DEVE pertencer somente ao contêiner semântico previsto. Parágrafo, `span`, citação inline ou subcitação interna NÃO DEVE herdar, repetir ou receber `border-left`/`border-inline-start` do bloco ou painel; bloco semanticamente aninhado continua sendo contêiner próprio e PODE receber a borda de seu modelo. [5eb4ab6]
- A diferenciação hierárquica DEVE permanecer na impressão sem importar a aparência web. Subcitação imediata conserva apenas itálico; profundidade adicional PODE usar fundo discreto e DEVE possuir segundo indício não dependente somente de cor para o caso de fundos desativados pelo usuário ou engine. [5eb4ab6]
- Subcitação em parágrafo, `<blockquote>`, painel construído por `div` ou `table` e estrutura customizada registrada DEVE usar o mesmo contrato semântico. Se a relação de aninhamento não puder ser determinada de modo inequívoco, o conteúdo DEVE ser preservado sem classificação automática e a fonte DEVE exigir marcador explícito. [860dfdf]

## Integração com impressão e progressividade

- `RCF-JCEM-IMPRESSAO-IEEE-001` DEVE consumir a semântica normalizada deste RCF; estilo de tela e renderer estrutural do consumidor NÃO DEVEM determinar a semântica impressa. [860dfdf]
- Bloco comum DEVE permanecer no fluxo regular de colunas. Travessia de ambas as colunas DEVE depender de marcador ou configuração explícita, nunca de aparência ou modelo visual. [860dfdf]
- Citação inline, subcitação, referência e modelo por ocorrência DEVEM sobreviver a build, transformação client-side, impressão nativa, fallback sem JavaScript e motor paginado, com conteúdo e ordem equivalentes. [860dfdf]
- Transformação estática DEVERIA prevalecer quando o pipeline possuir semântica suficiente. Runtime TypeScript PODE complementar conteúdo legado, mas NÃO DEVE ser a única fonte da semântica nem tornar conteúdo essencial dependente de JavaScript. [860dfdf]

## Validação

- Testes DEVEM cobrir aspas retas e tipográficas, backtick explicitamente classificado, código preservado, delimitadores sem par, apóstrofos, ênfase preexistente, nós divididos, links, notas, referências, conteúdo positivo, negativo, aninhado e ambíguo. [860dfdf]
- Matriz de bloco DEVE cobrir `<blockquote>`, `div`, `table`, elemento customizado efetivamente suportado, `standard`, `futuristic`, default global, default de artigo, contexto, override por ocorrência, identificador inválido e fallback sem JavaScript. [860dfdf]
- A matriz Markdown DEVE cobrir zero, um e múltiplos espaços, tab, CRLF, conteúdo posterior, idempotência, `--` fora de bloco, `---`, bloco aninhado e texto sem separador após `--`, comprovando que somente o prefixo autorizado muda. [6257fc8]
- A matriz DEVE cobrir também os quatro modelos tipados, ícone padrão, emoji, imagem válida/inválida, temas, 320 px e isolamento impresso. [860dfdf]
- A matriz dos cinco modelos derivados DEVE confrontar integralmente cada composição com `e1.png`–`e6.png` em claro, escuro, desktop e 320 px e medir, ao menos, alinhamento do corpo e autoria, visibilidade e posição dos adornos, recuos, fundos autorizados e geometria estável da haste de `thematic-rail` com textos de alturas diferentes. Para o modelo padrão, a matriz DEVE exercitar também artigo real com `content-visibility` ativo e comprovar no raster as duas aspas completas e seu centro óptico. Teste que verifique somente `content` computado, presença de classe ou ausência de overflow NÃO DEVE comprovar fidelidade visual. [b182de6]
- Matriz de subcitação DEVE cobrir texto comum, profundidade um, duas ou mais profundidades, cada modelo estrutural registrado, ausência de bordas internas, temas claro e escuro, impressão com e sem fundos e ausência de marcador confiável. [5eb4ab6]
- Validação DEVE comparar Markdown fonte, HTML estático, DOM preparado e saída impressa, comprovando preservação textual e semântica, precedência determinística, acessibilidade, ausência de regressão visual e compatibilidade com `RCF-JCEM-IMPRESSAO-IEEE-001`. [860dfdf]
