<!-- AI-PROCESSED -->
# RCF-JCEM-CITACOES-001

Status: vigente; implementação material validada em 2026-08-09.

Escopo: citação inline, subcitação e bloco semântico de citação em artigo ou post processado por Markdown, HTML, Jekyll e adaptações equivalentes.

Documentação de autoria: [`docs/MODO-DE-USO-BLOCKQUOTE.md`](../docs/MODO-DE-USO-BLOCKQUOTE.md), derivada do registro canônico `config/editorial-quotes.json`.

## Conceitos e fronteiras

- **Bloco de citação** ou `blockquote` DEVE significar conteúdo citado estruturalmente destacado, independentemente de ser materializado por `<blockquote>`, `div`, `table`, componente ou elemento customizado. A tag isolada NÃO DEVE ser a definição do conceito.
- Estrutura diferente de `<blockquote>` somente DEVE integrar o conceito quando possuir marcador semântico inequívoco e acessível. Aparência, classe acidental, tag, profundidade, texto ou posição no DOM NÃO DEVEM provar equivalência.
- **Citação inline** DEVE significar trecho citado dentro de um parágrafo comum, sem ancestral de bloco de citação e sem estar contido em outra citação. O trecho DEVE conservar delimitadores, texto, nós e significado originais.
- **Subcitação** DEVE significar citação semanticamente aninhada em outra citação inline ou em bloco, independentemente da estrutura visual da citação externa. Citação dentro de bloco NÃO DEVE ser classificada como citação inline externa.
- Citação, código, ênfase autoral, referência, link, nota e pontuação DEVEM permanecer conceitos distintos. Detecção NÃO DEVE usar substituição textual ingênua sobre Markdown ou HTML bruto quando AST, DOM, token ou marcador semântico estiver disponível.

## Contrato de autoria Markdown e HTML

- Bloco Markdown comum DEVE continuar sendo escrito com `>` e DEVE receber o modelo padrão quando não houver marcação específica.
- Linha Markdown iniciada exatamente por `>`, seguida de zero ou mais espaços ou tabs e de `--` como token de autoria, DEVE convergir para `> —` antes da conversão Markdown. A normalização DEVE substituir somente esse prefixo, conservar byte a byte o conteúdo subsequente e as terminações de linha e ser idempotente.
- A normalização de autoria NÃO DEVE alcançar `--` fora do início direto do bloco, conteúdo inline, bloco aninhado com outro marcador entre `>` e `--`, código, front matter ou sequência de três ou mais hifens. O pipeline PODE normalizar o conteúdo em memória, mas o acervo controlado DEVE usar diretamente o travessão canônico.
- Modelo por ocorrência DEVE ser declarado por Kramdown Inline Attribute List imediatamente após o bloco, usando `data-jcem-quote-model` com identificador registrado, por exemplo:

  ```markdown
  > Conteúdo citado.
  {: data-jcem-quote-model="futuristic"}
  ```

- O mesmo atributo DEVE selecionar tanto variante meramente visual quanto modelo que altere a estrutura construída; o registro do modelo, não uma segunda sintaxe, DEVE declarar renderer, classes, semântica, suporte a tema e impressão.
- `standard` e `futuristic` DEVEM identificar, respectivamente, bloco sem transformação estrutural e painel futurista já existente. Novo identificador DEVE ser documentado, versionado, validado e incorporado sem reestruturar o contrato.
- Estrutura HTML equivalente DEVE declarar `data-jcem-blockquote` e, quando necessário, `data-jcem-quote-model`; `role`, elemento nativo, `cite` ou metadado equivalente DEVE preservar a semântica e a acessibilidade. O adaptador DEVE normalizar esse contrato para a API agnóstica antes de aplicar renderer.
- Citação inline delimitada por par de aspas retas ou tipográficas dentro de parágrafo elegível DEVE receber representação semântica de ênfase sem perder os delimitadores. Apóstrofo, aspas sem par, delimitador vazio e texto atravessando nós incompatíveis NÃO DEVEM ser convertidos por inferência.
- Backtick Markdown DEVE permanecer código inline por padrão, preservando posts técnicos. Quando o conteúdo entre backticks representar citação, a autoria DEVE declará-lo inequivocamente com IAL, por exemplo `` `conteúdo citado`{: .jcem-inline-quote}``; essa declaração DEVE preservar o texto e substituir somente a classificação de código pela de citação.
- Marcação explícita existente de ênfase ou citação DEVE prevalecer sobre detecção automática e NÃO DEVE ser duplicada. Conteúdo em `pre`, código não marcado como citação, `kbd`, `samp`, `script`, `style`, referência, bibliografia ou footnote NÃO DEVE ser reclassificado.
- Alteração futura desta sintaxe, identificador ou precedência DEVE atualizar este RCF, o README e migração compatível na mesma FT.

## Modelos e precedência

- Cada ocorrência DEVE resolver exatamente um modelo pela ordem: `data-jcem-quote-model` da própria ocorrência → configuração contextual aplicável → front matter do artigo → configuração global → `standard`.
- O contrato legado `blockquote_panels: true|false` DEVE permanecer compatível e mapear para `futuristic|standard`; configuração específica por ocorrência DEVE prevalecer sobre esse booleano.
- Modelo desconhecido em fonte controlada DEVE falhar na validação de build com identificação da ocorrência. Artefato legado ou runtime sem registro DEVE degradar para `standard`, conservar todo o conteúdo e emitir diagnóstico, nunca remover ou ocultar a citação.
- Registro de modelo DEVE declarar identificador, versão, estrutura ou estilo, entrada semântica, classes ou atributos emitidos, suporte a tema, impressão, acessibilidade, transformação reversível ou fallback e testes. Renderer NÃO DEVE depender de estrutura privada do artigo.
- Transformação estrutural DEVE preservar ou reconstruir a semântica de citação, atributos, conteúdo, links, notas, referências, idioma, direção, foco e ordem de leitura. Ausência de JavaScript DEVE manter o bloco nativo legível.
- Padrão global NÃO DEVE sobrescrever configuração contextual, de artigo ou da ocorrência. Novo modelo NÃO DEVE alterar implicitamente ocorrências já resolvidas.

### Modelos tipados de aviso

- O registro DEVE incluir `notice`, `info`, `alerta1` e `alerta2` como modelos semânticos responsivos, além de `standard` e `futuristic`. A referência conceitual é, respectivamente, aviso documental, informação em uso, revisão recente e ausência de referência; estrutura ou dependência da Wikipédia NÃO DEVE ser copiada.
- A autoria DEVE usar a sintaxe única vigente, por exemplo `{: data-jcem-quote-model="alerta1"}`. Ícone opcional PODE ser declarado por `data-jcem-quote-icon` para emoji/texto curto ou por `data-jcem-quote-icon-src` acompanhado de `data-jcem-quote-icon-alt` para imagem ou recurso permitido.
- URL de ícone DEVE ser relativa segura ou HTTPS, sem esquema executável; imagem sem texto alternativo DEVE falhar. Na ausência de ícone, o registro PODE fornecer padrão contextual decorativo com `aria-hidden`.
- Modelo tipado DEVE preservar `blockquote`, conteúdo, referências, contraste, foco e ordem de leitura; tema claro/escuro e viewport estreito DEVEM ajustar tokens e composição sem truncamento.
- Impressão DEVE ignorar integralmente a aparência web dos modelos tipados e usar o estilo IEEE padrão, salvo exceção seletiva registrada exclusivamente na sub-RCF de impressão.
- Ícone de modelo tipado DEVE ocupar somente a área necessária à sua própria apresentação e alinhar-se ao início do conteúdo. A composição NÃO PODE criar linha implícita, altura mínima ou vazio inferior artificial; o padding legítimo do contêiner permanece uniforme e independente da quantidade de conteúdo.

## Apresentação de citações inline e subcitações

- Toda citação inline elegível em texto comum DEVE ser renderizada em itálico por elemento ou classe semântica, preservando ênfase interna preexistente e demais estilos legítimos. O contêiner semântico já distingue um bloco de citação; por isso, seu corpo e seus parágrafos NÃO DEVEM receber itálico automático.
- A profundidade citacional DEVE ser calculada pela cadeia de ancestrais semânticos, não pela tag isolada. Subcitação imediata, com profundidade um, DEVE receber somente itálico, sem fundo, borda, sombra ou ornamento próprio. Somente profundidade dois ou superior PODE receber fundo discreto por token `rgba`, quando necessário para distinguir inequivocamente os níveis.
- Fundo de subcitação possui finalidade única de diferenciação sutil de hierarquia; NÃO PODE funcionar como alerta, destaque, ênfase editorial ou ornamento. Deve adaptar contraste e composição em tema claro, escuro, `standard`, `futuristic` e demais modelos registrados, com intensidade proporcional, sem sobrescrever tipografia, estrutura ou estilo legítimo do contexto.
- Borda de bloco DEVE pertencer somente ao contêiner semântico previsto. Parágrafo, `span`, citação inline ou subcitação interna NÃO DEVE herdar, repetir ou receber `border-left`/`border-inline-start` do bloco ou painel; bloco semanticamente aninhado continua sendo contêiner próprio e PODE receber a borda de seu modelo.
- A diferenciação hierárquica DEVE permanecer na impressão sem importar a aparência web. Subcitação imediata conserva apenas itálico; profundidade adicional PODE usar fundo discreto e DEVE possuir segundo indício não dependente somente de cor para o caso de fundos desativados pelo usuário ou engine.
- Subcitação em parágrafo, `<blockquote>`, painel construído por `div` ou `table` e estrutura customizada registrada DEVE usar o mesmo contrato semântico. Se a relação de aninhamento não puder ser determinada de modo inequívoco, o conteúdo DEVE ser preservado sem classificação automática e a fonte DEVE exigir marcador explícito.

## Integração com impressão e progressividade

- `RCF-JCEM-IMPRESSAO-IEEE-001` DEVE consumir a semântica normalizada deste RCF; estilo de tela e renderer estrutural do consumidor NÃO DEVEM determinar a semântica impressa.
- Bloco comum DEVE permanecer no fluxo regular de colunas. Travessia de ambas as colunas DEVE depender de marcador ou configuração explícita, nunca de aparência ou modelo visual.
- Citação inline, subcitação, referência e modelo por ocorrência DEVEM sobreviver a build, transformação client-side, impressão nativa, fallback sem JavaScript e motor paginado, com conteúdo e ordem equivalentes.
- Transformação estática DEVERIA prevalecer quando o pipeline possuir semântica suficiente. Runtime TypeScript PODE complementar conteúdo legado, mas NÃO DEVE ser a única fonte da semântica nem tornar conteúdo essencial dependente de JavaScript.

## Validação

- Testes DEVEM cobrir aspas retas e tipográficas, backtick explicitamente classificado, código preservado, delimitadores sem par, apóstrofos, ênfase preexistente, nós divididos, links, notas, referências, conteúdo positivo, negativo, aninhado e ambíguo.
- Matriz de bloco DEVE cobrir `<blockquote>`, `div`, `table`, elemento customizado efetivamente suportado, `standard`, `futuristic`, default global, default de artigo, contexto, override por ocorrência, identificador inválido e fallback sem JavaScript.
- A matriz Markdown DEVE cobrir zero, um e múltiplos espaços, tab, CRLF, conteúdo posterior, idempotência, `--` fora de bloco, `---`, bloco aninhado e texto sem separador após `--`, comprovando que somente o prefixo autorizado muda.
- A matriz DEVE cobrir também os quatro modelos tipados, ícone padrão, emoji, imagem válida/inválida, temas, 320 px e isolamento impresso.
- Matriz de subcitação DEVE cobrir texto comum, profundidade um, duas ou mais profundidades, cada modelo estrutural registrado, ausência de bordas internas, temas claro e escuro, impressão com e sem fundos e ausência de marcador confiável.
- Validação DEVE comparar Markdown fonte, HTML estático, DOM preparado e saída impressa, comprovando preservação textual e semântica, precedência determinística, acessibilidade, ausência de regressão visual e compatibilidade com `RCF-JCEM-IMPRESSAO-IEEE-001`.
