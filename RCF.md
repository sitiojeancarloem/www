<!-- AI-PROCESSED -->
# RCF-JCEM-COMPONENTES-COMPARTILHADOS-001

Status: vigente.

Escopo: cabeçalho, masthead, `noscript`, rodapé, subpostbar, menus compartilhados, avisos institucionais e páginas especiais do tema.

## Regras Normativas

- Componentes estruturais compartilhados devem possuir uma única fonte editável.
- Cópias manuais de cabeçalho, masthead, `noscript`, rodapé, subpostbar, menus compartilhados e avisos institucionais são proibidas.
- Variações por contexto devem ser implementadas por composição Liquid, includes parametrizadas, slots, placeholders ou mecanismo equivalente de build.
- Diferenças de páginas especiais, como `404` e `noscript`, podem omitir recursos não aplicáveis, mas não podem duplicar estrutura, conteúdo comum ou identidade visual.
- `404.html` é artefato gerado e não deve existir como fonte editável no repositório.
- A fonte editável da página 404 é `404.main.html`, transpilada pelo Jekyll para `/404.html` por `permalink`.
- Alteração em componente compartilhado deve refletir automaticamente em páginas normais, `noscript` e 404 durante o build.
- Hidratação client-side de fragmentos compartilhados só é permitida como comportamento funcional realmente necessário, nunca como substituto para composição em tempo de build.

## Implementação

- `_includes/masthead.html` é a fonte da masthead em modo completo e reduzido.
- `_includes/jcem/footer-shell.html` encapsula o rodapé com `_includes/footer/custom.html` e `_includes/footer/after_footer.html`.
- `_includes/jcem/noscript-content.html` e `_includes/jcem/noscript-style.html` são as fontes do fallback sem JavaScript.
- `404.main.html` usa includes compartilhadas para masthead, `noscript`, subpostbar e footer, mantendo apenas conteúdo e scripts próprios da 404.
- `_plugins/jcem_html_compactor.rb` compacta o HTML final sem sincronizar ou substituir componentes compartilhados após o build.

## Validação

- `npm run check:html` deve falhar se `404.html` voltar a existir como fonte editável.
- `npm run check:html` deve confirmar que `404.main.html` gera `/404.html` e referencia masthead, `noscript` e footer por includes.
- Build Jekyll deve gerar `_site/404.html` e não deve gerar `_site/404.main.html`.

<!-- AI-PROCESSED -->
# RCF-JCEM-FOOTNOTES-001

Status: vigente.

Escopo: notas de rodapé, referências e bibliografia renderizadas por Jekyll/Kramdown no blog.

## Regras Normativas

- O formato preferencial de chamada de nota de rodapé é `[^id]`, com `id` alfanumérico único no documento.
- O identificador da nota nunca define a numeração exibida ao leitor.
- A numeração exibida é automática e determinada exclusivamente pela ordem da primeira ocorrência da chamada no documento.
- Reutilizações posteriores da mesma referência mantêm exatamente o mesmo número da primeira ocorrência.
- O marcador `[^*]` representa referência descartável e deve ser convertido antes do processamento Markdown principal para um identificador alfanumérico único.
- Definições descartáveis `[^*]:` são pareadas com chamadas descartáveis pela ordem de ocorrência.
- A lista final de definições deve aparecer em ordem numérica crescente, sem alterar as chamadas existentes no texto.
- Referências reutilizadas devem usar o padrão visual da Wikipédia: identificadores alfabéticos `a`, `b`, `c`, ... apontando para cada ocorrência da chamada no documento.
- O modelo de múltiplas setas de retorno não deve ser exibido ao leitor.
- Em impressão, as seções `Referências` e `Bibliografia` devem permanecer semanticamente expandidas com atributo `open` ativo.

## Implementação

- Kramdown permanece como biblioteca Markdown principal porque já suporta identificadores nomeados, numeração por primeira ocorrência e reordenação da lista final.
- Não há fork local em `./vendor/custom/` para Kramdown nesta etapa.
- `_plugins/jcem_footnotes.rb` executa somente a preparação local de `[^*]` antes do Kramdown.
- `assets/jcem/ts/site.ts` normaliza a ordem final, substitui backlinks de notas reutilizadas por links alfabéticos e força `open` em `Referências` e `Bibliografia` antes da impressão.
- `_sass/minimal-mistakes/skins/_variables-custom.scss` define a apresentação dos backlinks alfabéticos e mantém fallback visual de expansão em impressão.

## Validação

- `npm run check` deve incluir regressão específica para `[^*]`, pareamento de definições, preservação de blocos de código e comportamento Kramdown com referências reutilizadas.
- `npm run build:prod` deve confirmar integração Jekyll completa.
- Alterações visíveis em footnotes devem ser validadas em página renderizada com post que possua reutilização de nota.

# RCF-JCEM-CITACOES-001

Status: vigente; implementação material pendente.

Escopo: citação inline, subcitação e bloco semântico de citação em artigo ou post processado por Markdown, HTML, Jekyll e adaptações equivalentes.

## Conceitos e fronteiras

- **Bloco de citação** ou `blockquote` DEVE significar conteúdo citado estruturalmente destacado, independentemente de ser materializado por `<blockquote>`, `div`, `table`, componente ou elemento customizado. A tag isolada NÃO DEVE ser a definição do conceito.
- Estrutura diferente de `<blockquote>` somente DEVE integrar o conceito quando possuir marcador semântico inequívoco e acessível. Aparência, classe acidental, tag, profundidade, texto ou posição no DOM NÃO DEVEM provar equivalência.
- **Citação inline** DEVE significar trecho citado dentro de um parágrafo comum, sem ancestral de bloco de citação e sem estar contido em outra citação. O trecho DEVE conservar delimitadores, texto, nós e significado originais.
- **Subcitação** DEVE significar citação semanticamente aninhada em outra citação inline ou em bloco, independentemente da estrutura visual da citação externa. Citação dentro de bloco NÃO DEVE ser classificada como citação inline externa.
- Citação, código, ênfase autoral, referência, link, nota e pontuação DEVEM permanecer conceitos distintos. Detecção NÃO DEVE usar substituição textual ingênua sobre Markdown ou HTML bruto quando AST, DOM, token ou marcador semântico estiver disponível.

## Contrato de autoria Markdown e HTML

- Bloco Markdown comum DEVE continuar sendo escrito com `>` e DEVE receber o modelo padrão quando não houver marcação específica.
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

## Apresentação de citações inline e subcitações

- Toda citação inline elegível DEVE ser renderizada em itálico por elemento ou classe semântica, preservando ênfase interna preexistente e demais estilos legítimos. Corpo de bloco de citação NÃO DEVE receber itálico automático.
- Subcitação DEVE receber marcador semântico próprio e fundo por token `rgba`, derivado do tema e do contexto do modelo externo; cor fixa independente do tema NÃO DEVE ser usada.
- O fundo DEVE adaptar contraste e composição em tema claro, escuro, `standard`, `futuristic` e demais modelos registrados sem sobrescrever arbitrariamente borda, tipografia, estrutura ou estilo legítimo do contexto.
- A diferenciação de subcitação DEVE permanecer na impressão. Como impressão de fundo PODE ser desativada pelo usuário ou engine, um segundo indício não dependente somente de cor DEVE preservar distinção e legibilidade.
- Subcitação em parágrafo, `<blockquote>`, painel construído por `div` ou `table` e estrutura customizada registrada DEVE usar o mesmo contrato semântico. Se a relação de aninhamento não puder ser determinada de modo inequívoco, o conteúdo DEVE ser preservado sem classificação automática e a fonte DEVE exigir marcador explícito.

## Integração com impressão e progressividade

- `RCF-JCEM-IMPRESSAO-IEEE-001` DEVE consumir a semântica normalizada deste RCF; estilo de tela e renderer estrutural do consumidor NÃO DEVEM determinar a semântica impressa.
- Bloco comum DEVE permanecer no fluxo regular de colunas. Travessia de ambas as colunas DEVE depender de marcador ou configuração explícita, nunca de aparência ou modelo visual.
- Citação inline, subcitação, referência e modelo por ocorrência DEVEM sobreviver a build, transformação client-side, impressão nativa, fallback sem JavaScript e motor paginado, com conteúdo e ordem equivalentes.
- Transformação estática DEVERIA prevalecer quando o pipeline possuir semântica suficiente. Runtime TypeScript PODE complementar conteúdo legado, mas NÃO DEVE ser a única fonte da semântica nem tornar conteúdo essencial dependente de JavaScript.

## Validação

- Testes DEVEM cobrir aspas retas e tipográficas, backtick explicitamente classificado, código preservado, delimitadores sem par, apóstrofos, ênfase preexistente, nós divididos, links, notas, referências, conteúdo positivo, negativo, aninhado e ambíguo.
- Matriz de bloco DEVE cobrir `<blockquote>`, `div`, `table`, elemento customizado efetivamente suportado, `standard`, `futuristic`, default global, default de artigo, contexto, override por ocorrência, identificador inválido e fallback sem JavaScript.
- Matriz de subcitação DEVE cobrir parágrafo, cada modelo estrutural registrado, temas claro e escuro, impressão com e sem fundos e ausência de marcador confiável.
- Validação DEVE comparar Markdown fonte, HTML estático, DOM preparado e saída impressa, comprovando preservação textual e semântica, precedência determinística, acessibilidade, ausência de regressão visual e compatibilidade com `RCF-JCEM-IMPRESSAO-IEEE-001`.

# RCF-JCEM-IMPRESSAO-IEEE-001

Status: vigente; implementação material pendente.

Escopo: biblioteca Web agnóstica para impressão ou exportação PDF de artigo editorial completo, integração inicial com este blog e adaptadores futuros de plataforma.

## Resultado e níveis de conformidade

- Somente artigo, `article` ou post editorial completo identificado pelo contrato público da biblioteca DEVE receber a composição IEEE; home, arquivo, mapa, 404, listagem e página sem artigo integral DEVEM manter impressão natural.
- Navegação, menu, atalho, compartilhamento do sistema, botão próprio e mecanismo equivalente DEVEM continuar aptos a iniciar a impressão nativa; a biblioteca NÃO DEVE bloquear, substituir, sequestrar nem tornar obrigatório um iniciador específico.
- A apresentação em tela NÃO DEVE ser alterada pela biblioteca, e falha, ausência ou carregamento parcial de JavaScript, fonte ou motor externo NÃO DEVE produzir página vazia, truncada ou inutilizável.
- A biblioteca DEVE expor estados distinguíveis de conformidade: `legivel`, para fallback sem preparação completa; `nativo-preparado`, para impressão nativa preparada e validada; e `ieee-validado`, exclusivamente para saída aferida contra o perfil de referência aplicável. Interface, metadado e diagnóstico NÃO DEVEM declarar conformidade superior à efetivamente obtida.
- “Compatível com IEEE” DEVE significar equivalência física, estrutural e composicional mensurável no PDF ou papel final, ressalvadas somente Noto Sans, chamadas referenciais sobrescritas, preservação controlada de cores, tabelas e avisos institucionais e demais exceções expressas neste RCF.

## Perfil de referência e determinismo

- Geometria, composição, hierarquia, paginação e tolerâncias DEVEM provir de perfil externo versionado, formado por identificador, título, edição, origem, data de obtenção, licença ou condição de uso, hash do documento ou template de controle, papel, escala, unidades, margens, colunas, tipografia de referência e tolerâncias reproduzíveis.
- Valor físico, versão, medida, navegador, engine ou equivalência visual NÃO DEVE ser imaginado, inferido por semelhança em tela nem atualizado silenciosamente. Ausência do perfil versionado DEVE bloquear a classificação `ieee-validado`, sem bloquear o fallback legível.
- A conformidade DEVE ser aferida no PDF ou papel final em escala `100%`; ajuste automático de encaixe e cabeçalho ou rodapé acrescentado pelo navegador NÃO DEVEM ser pressupostos.
- Adaptação de consumidor ou plataforma NÃO DEVE alterar invariante do perfil; exceção DEVE residir em configuração ou adaptador, ser identificada no relatório de conformidade e possuir teste próprio.

## Arquitetura, autoridade e API

- A solução DEVE nascer como biblioteca autônoma, importada explicitamente pelo blog, ainda que armazenada inicialmente em sua estrutura-fonte; localização inicial NÃO DEVE acoplar o núcleo ao tema, ao site, ao Jekyll nem à árvore privada do consumidor.
- A biblioteca DEVE separar núcleo genérico, CSS/Sass, preparação de runtime, adaptadores de engine, plugins de plataforma, configuração do consumidor e overrides locais. Núcleo e contratos públicos NÃO DEVEM importar alias, helper, template, front matter, estado, classe acidental nem arquivo privado do primeiro consumidor.
- O contrato público DEVE permitir identificar o artigo, fornecer e mapear metadados, declarar conteúdo omitido ou preservado, registrar elemento indivisível ou de largura total, selecionar parâmetro autorizado, fornecer transformação estática e consultar ou acionar preparação. `[data-print-article]` DEVERIA ser o marcador declarativo padrão; outro seletor DEVE ser configurável.
- API, configuração e schema DEVEM ser mínimos, estáveis, versionados, validados e sem efeito colateral na importação. Inicialização automática DEVE depender de ativação explícita.
- Dependência opcional NÃO DEVE ser carregada nem instalada pelo consumidor que não usa seu recurso. Consumidor Node.js NÃO DEVE depender de Ruby, e consumidor Jekyll NÃO DEVE executar Node.js no navegador; dependência de build DEVE pertencer ao adaptador correspondente.
- Integração Jekyll DEVE permanecer em plugin, filtro, hook, include, Liquid, Ruby ou adaptador próprio e PODE mapear front matter, enriquecer HTML, gerar metadados, preparar conteúdo e rejeitar build inválido. Saída DEVE ser HTML estático funcional sem Ruby no navegador.
- Transformação equivalente em Ruby, Node.js ou outra integração DEVE consumir o mesmo schema, fixtures e contrato e produzir semântica equivalente. Remover o adaptador Jekyll NÃO DEVE comprometer o núcleo nem o uso básico por HTML, CSS e JavaScript padronizados.
- Correção originada no primeiro site DEVE resolver a classe geral do problema e produzir teste genérico, de contrato e do adaptador aplicável. Identificador privado, profundidade fixa de DOM, ordem circunstancial, conteúdo textual, path ou classe acidental NÃO DEVEM integrar o núcleo; caso não generalizável DEVE exigir marcação ou configuração explícita.

## Progressividade, ciclo de impressão e custo

- A progressividade DEVE preferir HTML semântico → CSS/Sass → transformação estática de build → TypeScript de runtime → motor externo, admitida inversão somente quando comprovadamente mais simples, leve, robusta e determinística.
- CSS Paged Media e fallback exclusivamente CSS DEVEM permanecer funcionais. TypeScript DEVE limitar-se a estado ou preparação inviável em CSS; Ruby e mecanismos nativos da plataforma DEVEM ser usados no adaptador quando eliminarem custo de runtime ou ampliarem compatibilidade.
- `beforeprint`, `afterprint`, `matchMedia("print")`, preparação antecipada assíncrona e transformação estática DEVEM ser combinados conforme a matriz de suporte. Preparação incompleta DEVE preservar conteúdo e PODE exibir aviso discreto e temporário; aviso NÃO DEVE permanecer após sucesso nem integrar o artigo.
- PubCSS DEVE ser avaliado como base estrutural inicial. Vivliostyle, Paged.js ou motor equivalente PODEM ser adotados somente após medição de tamanho, rede, inicialização, paginação, compatibilidade, manutenção e fallback; motor DEVE permanecer substituível atrás de adaptador e NÃO DEVE vazar à API pública.
- Download ou processamento exclusivo de impressão DEVE ser mínimo, assíncrono, posterior ao conteúdo crítico e preferencialmente ocioso, com preparação imediata segura diante de impressão antecipada. Recurso existente, cacheado, gerado ou hospedado pelo consumidor DEVE ser reutilizável sem duplicação.
- Dispositivo móvel DEVE ser tratado por capacidade real e matriz declarada, não somente por agente de usuário. Recurso sem benefício verificável ou sem impressão tecnicamente disponível NÃO DEVE gerar rede, atraso, reflow perceptível nem processamento adicional.

## Composição física e conteúdo

- `@page`, papel, margens, área útil, largura e intervalo de colunas, órfãs, viúvas, títulos, fragmentação, balanceamento, referências e elementos de largura total DEVEM seguir o perfil de referência.
- O fluxo padrão de duas colunas DEVE reiniciar e fragmentar por página; uma região multicoluna única para todo o documento NÃO DEVE ser classificada como conforme. Elemento indivisível que caiba na página seguinte NÃO DEVE ser fragmentado, e quebra manual vazia ou meramente visual NÃO DEVE ser usada.
- Noto Sans DEVE ser a família principal, com fallback sans-serif local metricamente aferido. Pesos, subconjuntos, incorporação, caracteres por linha, linhas por coluna, altura, densidade e quebras DEVEM ser calibrados na saída física; unidade essencial DEVE usar `pt`, `in` ou `mm`, não `px`, `rem` ou viewport.
- Fonte remota PODE ser usada somente se carregar antes da paginação final, possuir versão e fallback determinísticos e não tornar a impressão dependente de conectividade tardia. Hospedagem local DEVERIA prevalecer quando reduzir risco, latência ou dependência.
- Navegação, barras, publicidade, comentários, compartilhamento, controles, formulários, tags sociais e decoração alheia ao artigo DEVEM ser ocultados. Título, autoria, afiliação, resumo, palavras-chave, seções, figuras, tabelas, equações, notas, referências e avisos essenciais DEVEM permanecer.
- Primeira página DEVE apresentar URL canônica e data de obtenção ou impressão e, quando disponíveis, publicação e atualização, integradas discretamente à identificação editorial. URL de link comum NÃO DEVE ser anexada automaticamente ao texto.
- Imagem DEVE preservar proporção, resolução suficiente e cor; thumbnail ou destaque DEVE ser omitido salvo relevância editorial e compatibilidade comprovadas. Fundo decorativo, sombra, filtro, animação, transição e transparência não essencial DEVEM ser removidos.
- Tabela preexistente DEVE conservar aparência legítima, inclusive zebra, cabeçalho escuro e destaque de coluna, salvo intervenção mínima para largura, contraste, legibilidade ou fragmentação. Tabela larga DEVE usar estratégia configurável e determinística.
- Bloco de citação e subcitação DEVEM obedecer ao `RCF-JCEM-CITACOES-001`; travessia de colunas DEVE ser declarada, nunca inferida por aparência.
- Rodapé visual do site NÃO DEVE ser reproduzido integralmente. Publicador, disclaimer, licença, aviso legal e atribuição obrigatória DEVEM compor bloco institucional discreto e não redundante, mapeado pelo consumidor.
- Reset, namespace, seletor ou `!important` DEVE permanecer limitado ao artigo e ao contexto de impressão; `!important` PODE ser usado somente para isolamento determinístico. Estilo de tela ou de outro componente NÃO DEVE ser afetado.

## Suporte, empacotamento e validação

- Biblioteca e adaptadores DEVEM declarar e versionar navegadores, engines, Jekyll, Ruby, Liquid, Node.js, modos de build e fluxos suportados. “Compatibilidade integral com Jekyll” DEVE significar cobertura testada dessa matriz, não de versão, plugin ou ambiente desconhecido.
- Estrutura DEVE permitir workspace ou pacote local, pacote Node.js, entrada CSS/Sass, plugin ou gem auxiliar, artefato distribuível, SemVer e extração futura sem reescrita substancial. Histórico, API, testes, build, documentação, licença e atribuições DEVEM acompanhar a extração; licença NÃO DEVE ser inferida antes de decisão autoritativa.
- Validação DEVE cobrir unidade do núcleo, schema e contrato, integração por adaptador, projeto Node.js de referência distinto, Jekyll com e sem runtime JavaScript, remoção do adaptador Jekyll, impressão nativa por todos os iniciadores, fallback sem fonte ou motor, temas, carregamento parcial, mobile e navegadores declarados.
- Comparação DEVE medir visual e geometricamente cada página contra o controle, incluindo reinício de colunas, escala, fontes, conteúdo, imagem, tabela, citação, metadado e bloco institucional. Relatório DEVE registrar perfil, hashes, navegador, engine, versões, papel, escala, fonte, dependências, parâmetros, desvios e nível obtido.
- Teste DEVE comprovar ausência de efeito fora do artigo, independência do núcleo, equivalência semântica entre transformações, ausência de correção rígida do consumidor e saída final utilizável. Similaridade de tela, funcionamento somente em fluxo controlado ou dependência exclusiva de motor NÃO DEVEM constituir aceite.

# RCF-JCEM-BATE-PAPOS-001

Status: vigente.

Escopo: artigos que sintetizam bate-papos, conversas, estudos dialogados ou encontros equivalentes.

## Regras Normativas

- Todo conteúdo deste escopo deve iniciar, após os metadados, com o aviso padronizado, sucinto e claramente visível: **“Nota editorial: Esta é uma síntese fiel de um bate-papo, editada apenas para tornar a leitura mais clara e agradável. O material foi produzido e processado de forma automatizada, inclusive com uso de inteligência artificial, e pode conter erros, imprecisões ou interpretações inadequadas. Nem tudo o que foi dito foi necessariamente aceito por todos: formulações coletivas não significam unanimidade, aprovação integral ou ausência de objeções; cada participante pode ter ponderado, discordado, preferido não se manifestar ou silenciado por razões distintas.”**
- O resultado deve ser síntese temática do bate-papo, nunca transcrição, ata ou reconstrução cronológica. A organização deve desenvolver os temas e argumentos, preservando a ordem cronológica dos fatos quando ela for material à compreensão.
- A linguagem deve ser acessível a públicos com diferentes níveis de formação. Termos técnicos são admitidos quando necessários à exatidão, sem rebuscamento dispensável.
- A síntese deve explicar o tema e seu desenvolvimento argumentativo, preservando integralmente ideias, filosofias, conceitos, detalhes, nuances, divergências, hipóteses, raciocínios intermediários, hesitações, condicionais e mudanças de posição materialmente relevantes.
- A condição de síntese não autoriza converter o conteúdo em artigo autoral do redator, apagar a autoria intelectual dos participantes nem apresentar como elaboração editorial o que foi efetivamente dito, defendido, citado ou desenvolvido no bate-papo. Atribuições discretas — como “o participante argumenta” e “o instrutor observa” — devem ser usadas quando necessárias para preservar autoria, origem e contexto das ideias.
- Maximizar densidade informacional não autoriza reducionismo: cada ideia relevante deve conservar, tanto quanto possível, sua importância e ênfase proporcionais no bate-papo; somente repetição, redundância e prolixidade devem ser eliminadas.
- Áudio, software ou processo de transcrição e posições temporais não devem ser mencionados, salvo quando estritamente indispensáveis à compreensão de ponto material.
- Participantes devem receber nomes fictícios ou identificadores funcionais, salvo indicação humana inequívoca em contrário ou identificador previamente definido que deva prevalecer. Quando uma pessoa conduzir ou nortear predominantemente a discussão, a identificação funcional deve prevalecer sobre seu nome real; no artigo que originou esta regra, Emerson deve ser apresentado como **Instrutor principal**.
- Ausência de manifestação nunca deve ser interpretada como concordância. Consenso, aceitação, rejeição, aprovação, conclusão ou ausência de conclusão do grupo somente podem ser mencionados quando explicitamente demonstrados e materiais ao tema; ressalvas já cobertas pelo aviso editorial não devem ser reiteradas.
- Fala documentada, síntese editorial, inferência e conjectura devem permanecer semanticamente distinguíveis, sem acrescentar conclusões não sustentadas ou apresentadas.
- A primeira ocorrência explícita de cada citação textual deve apresentar integralmente o trecho preservado na fonte disponível e sua referência nomeada `[^id]`; ocorrência posterior deve reutilizar a referência e não repetir integralmente o texto sem necessidade editorial comprovada.
- Todas as citações e referências preexistentes devem ser preservadas integralmente. A vedação a menções processuais não autoriza abreviar, parafrasear, deslocar ou suprimir conteúdo já integrante de citação ou referência; eventual menção dessa natureza dentro de referência preservada constitui a exceção estritamente necessária.
- Quando a fonte disponível conservar apenas um excerto, a edição deve identificá-lo como parcial e nunca completar por memória, hipótese ou texto não documentado.
- Referências devem obedecer integralmente ao `RCF-JCEM-FOOTNOTES-001`; sistema numérico manual ou paralelo é proibido.

## Namespace e roteamento

- Namespace é o identificador de classe anteposto ao título lógico na URL, de modo análogo aos namespaces da Wikipédia: separa o domínio editorial da identidade do conteúdo sem transformar essa classe em diretório-fonte ou taxonomia comum.
- `bate-papo:` é o namespace canônico das sínteses deste escopo. O título público deve iniciar com `Bate-papo:` e a URL pública deve usar literalmente `/p/bate-papo:<titulo-normalizado>/`; `%3A` e `bate-papo-` não são representações públicas canônicas.
- O arquivo-fonte e seu diretório devem usar o prefixo físico `bate-papo-`, sem `:`. Namespace lógico, URL pública e nome físico são representações distintas e não devem ser confundidos.
- A configuração `content_namespaces` é a única autoridade de conversão. O plugin de namespace deve derivar a URL do prefixo físico, validar título e disclaimer e manter o mapeamento determinístico em build, desenvolvimento local e publicação, sem permalink individual ou decisão ad hoc do ambiente.
- Em sistema de arquivos que não aceite `:` — inclusive Windows — somente o destino físico local deve usar o prefixo configurado `bate-papo-`; a URL gerada, canônica e apresentada ao cliente permanece literal com `bate-papo:`. Em ambiente publicável compatível, o artefato deve materializar o segmento literal.

## Validação

- A validação editorial deve confirmar o aviso na abertura, caráter temático, anonimização, linguagem acessível, preservação proporcional do conteúdo e da autoria intelectual, ausência das referências processuais vedadas fora da exceção documental, ausência de presunção coletiva, distinção entre conteúdo documentado e elaboração editorial, preservação integral das citações e referências e ausência de repetição textual desnecessária.
- Todas as chamadas e definições `[^id]` devem ser pareadas, reutilizar identificadores semanticamente equivalentes e renderizar pelo mecanismo Jekyll/Kramdown vigente.
- O build com rascunhos deve confirmar hierarquia de títulos, blockquotes, linhas de referência, notas de rodapé e legibilidade da página renderizada.
- A validação deve confirmar o título `Bate-papo:`, a URL pública literal `/p/bate-papo:`, o path físico local hifenizado, a conversão central e a resolução da rota sem erro, redirecionamento involuntário ou divergência canônica.

<!-- AI-PROCESSED -->
# RCF-JCEM-PERFORMANCE-DEPENDENCIAS-001

Status: vigente.

Escopo: scripts, estilos, fontes, bibliotecas externas, assets de terceiros e recursos client-side carregados pelo blog.

## Regras Normativas

- Recurso externo não modificado deve ser carregado por CDN versionado quando existir CDN estável, pública e compatível com o build do projeto.
- Bibliotecas, estilos, fontes e assets de terceiros não devem ser versionados localmente quando forem idênticos ao pacote público e não houver exigência de segurança, privacidade, disponibilidade ou compatibilidade que justifique cópia local.
- Nenhum script, estilo, fonte ou asset externo deve ser carregado em páginas que não utilizam o recurso correspondente.
- Recursos client-side legados só podem permanecer quando necessários para comportamento vigente; o carregamento deve ser condicionado automaticamente por página, componente ou estado inferido pelo build.
- Dependências usadas somente no build, sem envio de JavaScript client-side ao navegador, podem permanecer em `package.json`, `Gemfile` ou ferramenta equivalente quando forem necessárias para gerar artefato estático.
- Includes, layouts e plugins devem priorizar inferência automática em vez de metadados manuais no front matter.
- Quando tecnicamente aplicável, recursos de CDN devem usar versão fixa, `integrity`, `crossorigin` e política de referência restritiva.
- Exceções à CDN exigem motivo técnico rastreável: modificação local do asset, indisponibilidade de CDN estável, licença incompatível, privacidade, segurança, necessidade offline, bloqueio de rede previsível ou ganho mensurável de performance com cópia local.

## Implementação

- O carregamento condicional deve ocorrer no menor ponto de composição possível, preferencialmente no include ou layout que conhece o estado real da página.
- Para matemática, `_plugins/jcem_math.rb` marca `page.jcem_math` durante o build; `_includes/head/custom.html` carrega KaTeX por CDN e o CSS local de controles apenas quando essa marca existir.
- JavaScript de varredura no navegador para decidir carregamento de bibliotecas deve ser evitado quando o build consegue inferir o uso com custo menor.
- Bibliotecas client-side amplas devem ser auditadas antes de qualquer inclusão global; ausência de uso na página implica ausência de carga.

## Validação

- `npm run check` deve permanecer sem regressões após alterações de dependências ou carregamento condicional.
- Build Jekyll deve confirmar que páginas sem o recurso não recebem o asset externo.
- Alterações que mudem carregamento visível ou interativo devem ser validadas em artefato renderizado.

<!-- AI-PROCESSED -->
# RCF-JCEM-CARREGAMENTO-PROGRESSIVO-001

Status: vigente.

Escopo: carregamento inicial, loader global, recursos pesados, skeleton loading e indicadores de progresso do blog.

## Regras Normativas

- Apenas recursos essenciais podem bloquear a primeira renderização visível da página.
- Recursos essenciais são HTML, CSS, JavaScript próprio necessário à inicialização e dependências leves do JavaScript, como JSON, XML ou formatos equivalentes.
- Imagens, `background-image`, vídeos, áudios, iframes, fontes opcionais e demais assets pesados não devem bloquear a liberação inicial da página.
- Recursos pesados devem carregar de forma assíncrona, progressiva e tolerante a falhas.
- Todo componente elegível que dependa de asset potencialmente lento deve exibir automaticamente skeleton loading em CSS puro até que o asset esteja carregado ou falhe.
- Componentes elegíveis incluem banners, imagens destacadas, cards, thumbnails, galerias, backgrounds visuais e componentes opt-in com `data-jcem-skeleton`.
- Skeleton loading deve preservar o espaço do componente no fluxo sempre que a geometria do componente for conhecida por CSS ou marcação.
- A base visual do skeleton deve permanecer visível durante todo o ciclo de animação; somente o brilho de varredura pode se deslocar.
- O brilho de varredura deve permanecer em camada visual própria e perceptível sobre o espaço reservado do componente, sem depender da visibilidade do asset final.
- O contêiner do skeleton deve possuir textura ou padrão visual próprio enquanto estiver em `loading`, para que o placeholder permaneça reconhecível mesmo se pseudo-elementos falharem ou forem sobrepostos.
- Quando o recurso estava pendente, o skeleton deve permanecer visível por janela mínima perceptível antes da transição para o conteúdo final.
- Metadados de assets constituem camada opcional de otimização; o tema jamais deve depender deles para funcionar corretamente.
- Quando disponíveis, metadados de assets devem ser usados para otimizar desempenho percebido, responsividade, reserva antecipada de espaço, estruturação automática de componentes e precisão do skeleton loading.
- Imagens externas elegíveis devem possuir metadados declarativos em `_data/jcem_asset_metadata.yml` ou fonte equivalente consumida no build; cards e imagens destacadas não podem depender do carregamento da imagem para definir a altura final.
- A primeira renderização de cards com imagem deve emitir `width`, `height` e/ou `aspect-ratio` suficientes para impedir expansão, contração ou reposicionamento após o carregamento do asset.
- O skeleton de imagens deve combinar padrão/textura fixa com brilho de varredura esquerda-para-direita em camada própria, com contraste ajustado por tema.
- A geração de metadados de assets deve ocorrer automaticamente durante o build.
- A geração deve ser incremental sempre que tecnicamente viável, evitando reprocessamento de assets não alterados.
- O índice consolidado de metadados deve ser cacheável, possuir baixa latência e minimizar requisições HTTP.
- Metadados incorporados diretamente ao arquivo original, como EXIF ou mecanismo equivalente, só devem ser gravados quando houver suporte seguro, preservação integral dos metadados existentes e ausência de impacto relevante no build.
- A substituição do skeleton pelo conteúdo definitivo deve usar transição suave, sem flickering perceptível.
- A implementação não deve introduzir mudança visual deliberada na identidade do componente carregado.
- Indicadores de carregamento e progresso devem possuir contraste suficiente durante toda a exibição, inclusive em tema claro, tema escuro, telas de baixo brilho e conexões lentas.
- Estas regras constituem o comportamento padrão para componentes atuais e futuros, salvo justificativa técnica explícita registrada no ponto de implementação.

## Implementação

- `_includes/head/custom.html` define o loader inicial e a barra superior com contraste próprio, independente do tema ativo.
- `assets/jcem/ts/site.ts` libera a página após `DOMContentLoaded` e preparação leve dos fragmentos essenciais, sem aguardar `window.load`.
- `assets/jcem/ts/site.ts` monitora imagens e backgrounds elegíveis, aplicando estados `loading`, `loaded` e `error` em `.jcem-skeleton`.
- `_includes/archive-single.html` e `_includes/jcem/post-featured-image.html` marcam cards e imagens destacadas com skeleton server-side.
- `_plugins/jcem_asset_metadata.rb` gera metadados opcionais de imagens, mantém cache incremental em `.jekyll-cache/jcem-asset-metadata.json` e publica índice consolidado em `assets/jcem/asset-metadata.json`.
- `_includes/archive-single.html`, `_includes/jcem/post-featured-image.html` e `recent-posts.json` usam metadados disponíveis para emitir `width`, `height` e proporção sem criar dependência funcional.
- `_sass/minimal-mistakes/skins/_variables-custom.scss` define tokens e animação de skeleton em CSS puro.
- `404.main.html` mantém implementação local equivalente para loader, imagem destacada e cards recentes, gerando `/404.html` em tempo de build.
- A implementação atual não grava EXIF nos arquivos originais porque a camada sidecar atende ao contrato com menor risco, sem nova dependência e sem mutação de assets autorais.

## Validação

- A validação visual deve simular asset pesado pendente e confirmar que `.jcem-page-loaded` é aplicado antes de `document.readyState === "complete"`.
- A validação visual deve confirmar que o conteúdo permanece oculto antes dos recursos essenciais e visível após a liberação essencial.
- A validação visual deve confirmar presença, geometria, pseudo-elemento e estado final dos skeletons em componentes elegíveis.
- A validação visual deve aceitar skeleton pendente quando a animação estiver ativa e o asset correspondente ainda não estiver disponível.
- A validação visual deve confirmar variação perceptível do skeleton entre dois momentos distintos de carregamento pendente.
- A validação visual deve confirmar geometria e contraste mínimo operacional da barra superior de progresso.
- `npm run check` deve validar o extrator de metadados em imagens reais do repositório.
- Build Jekyll deve confirmar a geração de `assets/jcem/asset-metadata.json` e o uso opcional dos metadados no HTML renderizado.

<!-- AI-PROCESSED -->
# RCF-JCEM-PUBLICACAO-001

Status: vigente.

Escopo: publicação do site Jekyll no GitHub Pages, comandos locais, workflows remotos, publicações agendadas e distribuição externa posterior.

## Regras Normativas

- `main` é exclusivamente branch de desenvolvimento.
- Push em `main` não deve publicar o site, salvo quando contiver o arquivo de controle `publicar`.
- O branch de publicação é `gh-pages`, por alinhamento com a convenção histórica do GitHub Pages.
- `gh-pages` é artefato automatizado, temporário e exclusivo de publicação.
- `gh-pages` não deve receber desenvolvimento manual.
- Sempre que o deploy for validado, `gh-pages` deve ser removido do remoto.
- Toda publicação local deve ser iniciada por `npm run publish -- [commit]`.
- Quando o commit for informado, a publicação deve usar exatamente o estado desse commit.
- Quando o commit não for informado em execução local, a publicação deve usar a árvore de trabalho atual, incluindo alterações não commitadas e arquivos não ignorados.
- Quando a publicação remota não receber commit explícito, o workflow deve usar o commit selecionado pela execução remota.
- A publicação pela interface Web usa o arquivo raiz `publicar`, contendo o hash do commit a publicar.
- O arquivo `publicar` deve ser removido automaticamente por commit após publicação validada.
- Builds, deploys e validações de disponibilidade devem terminar com sucesso antes de qualquer distribuição externa.
- Publicações agendadas devem gerar `gh-pages` antes do build público e só migrar `_scheduled` para `_posts` após deploy validado.
- Cache do GitHub Actions, cache incremental do Jekyll, `_site` cacheado, manifestos de coesão e builds incrementais são requisitos arquiteturais permanentes.
- A remoção temporária de `gh-pages` não pode eliminar a reutilização de cache; `.jekyll-cache/jcem-source-state.json` deve preservar o estado necessário para comparação quando não houver base Git anterior.

## Implementação

- `scripts/publish.rb` cria uma cópia temporária da origem, gera um commit novo para `gh-pages`, substitui o branch remoto com `--force-with-lease` e remove referência local de publicação quando existir com segurança.
- `scripts/publish.ps1` e `scripts/publish.sh` são apenas wrappers do comando NPM.
- `.github/workflows/jekyll.yml` aceita push em `gh-pages`, `workflow_dispatch` e push em `main` com `publicar`.
- Push em `gh-pages` deve apenas reencaminhar a publicação para uma execução `workflow_dispatch` em `main`, porque o ambiente `github-pages` pode restringir deploys por branch.
- Push em `main` sem `publicar` deve atualizar o cache coeso de `_site` no escopo de `main`, sem upload de artefato Pages e sem deploy.
- O commit automático que remove `publicar` em `main` deve acionar o mesmo caminho de atualização de cache, sem marcador `[skip ci]`.
- Publicações iniciadas por `workflow_dispatch` ou `publicar` criam `gh-pages` e continuam build/deploy no mesmo workflow, sem depender de novo evento de push.
- `scripts/jekyll_build_scope.rb` decide entre build completo e incremental por diff Git quando disponível, ou por estado de fonte cacheado quando o branch temporário foi recriado.
- `scripts/jekyll_build_manifest.rb` grava manifesto de `_site`, estado de build e estado de fonte para preservar coesão entre cache, commit e artefato publicado.
- `.github/workflows/scheduled.yml` prepara posts agendados, gera `gh-pages`, publica o artefato e só depois persiste a migração para `_posts`.

## Validação

- `ruby -c scripts/publish.rb` deve validar a sintaxe do comando de publicação.
- `ruby -c scripts/jekyll_build_scope.rb` e `ruby -c scripts/jekyll_build_manifest.rb` devem validar os scripts de escopo e manifesto.
- Alterações de workflow devem passar por parse YAML local.
- `npm run check` deve permanecer obrigatório para regressões do projeto.
- `npm run build:prod` deve confirmar integração Jekyll quando `_site` não estiver bloqueado; caso contrário, usar destino temporário em `tmp/`.

<!-- AI-PROCESSED -->
# RCF-JCEM-MAPA-HTML-001

Status: vigente.

Escopo: página HTML indexável `/mapa/`, navegação para todos os artigos e taxonomias navegáveis do blog.

## Regras Normativas

- `/mapa/` é a representação HTML indexável do sitemap do site.
- Acesso rotulado como `Todos os Artigos`, `Mapa` ou `Mapa do Site` deve apontar para `/mapa/`, salvo configuração explícita equivalente em `site.jcem.mapa.path`.
- A página centraliza artigos publicados, pontos principais de navegação e todas as taxonomias navegáveis suportadas pelo projeto.
- A listagem de artigos deve usar exclusivamente título, excerto e link para o artigo.
- A listagem de artigos não deve usar miniaturas, imagens, backgrounds ilustrativos ou qualquer asset visual equivalente.
- O componente deve ser reutilizável, responsivo, paginado e configurável.
- A paginação padrão deve listar 50 artigos por página e deve escalar para grandes volumes de conteúdo.
- A apresentação deve alternar ritmo visual entre blocos de uma coluna e grades de até três colunas sem depender de imagens.
- A identidade visual deve priorizar leveza, acessibilidade, organização, legibilidade e SEO.
- Como qualquer página pública, `/mapa/` deve preservar cabeçalho, rodapé, noscript e demais requisitos estruturais definidos neste RCF.

## Implementação

- `_plugins/jcem_site_map.rb` gera as páginas paginadas de `/mapa/` a partir de `site.posts.docs`.
- `_layouts/mapa.html` compõe a página e delega seções reutilizáveis para includes em `_includes/jcem/mapa-*.html`.
- `site.jcem.mapa.path` controla a rota raiz do mapa.
- `site.jcem.mapa.posts_per_page` controla a quantidade de artigos por página.
- Taxonomias padrão usam `category_archive.path` e `tag_archive.path`; taxonomias adicionais podem ser configuradas em `site.jcem.mapa.taxonomies`.

## Validação

- Build Jekyll deve confirmar geração de `/mapa/index.html`.
- Validação renderizada deve confirmar ausência de imagens no conteúdo do mapa, presença de artigos, taxonomias, links principais e ausência de overflow horizontal.
- Validação responsiva deve confirmar que a lista de artigos permanece entre uma e três colunas conforme largura disponível.
