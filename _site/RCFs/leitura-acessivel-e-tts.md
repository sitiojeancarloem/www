<!-- AI-PROCESSED -->

# RCF-JCEM-LEITURA-ACESSIVEL-TTS-001

Status: vigente; implementação-base concluída nas FTs 035–037 e refinamento de fluidez concluído na FT-039.

Escopo: representação acessível e falada de artigos, posts, páginas, navegação essencial, avisos, citações, referências, idiomas, tabelas, imagens e gráficos do JeanCarloEM Blog.

## 0. Autoridade canônica e delta local

- Preparação semântico-fonética, classificação contextual, delimitadores, referências e forma própria para fala DEVEM aplicar primeiro `.ia.rules/resources/spoken-normalization.md`; quando a mesma tarefa transformar texto autoral, `.ia.rules/resources/editorial-authoring.md` também DEVE reger preservação, organização e marcação. Esta RCF NÃO PODE duplicar nem reduzir esses contratos gerenciados. [1e64180]
- O normalizador de build, o HTML acessível estático, os controles Web Speech, os modos `continuous|summary|full`, os manifestos por página e os gráficos condicionais DEVEM permanecer especializações locais de produto porque materializam a entrega Web e não são implementações fornecidas pela Norma Operacional. [1e64180]
- `agent:editorial` e `agent:spoken` DEVEM continuar delegando exclusivamente aos runtimes gerenciados; plugin, include ou script deste produto NÃO PODE assumir seus nomes, sua finalidade operacional genérica nem preceder sua autoridade. [1e64180]
- Atualização futura de `agents.md` DEVE ser confrontada com a matriz da FT-068 antes de remover especialização local; equivalência por nome é insuficiente, e remoção só PODE ocorrer após prova bidirecional de comportamento, força normativa, testes e ausência de regressão. [1e64180]

## 1. Conceitos, precedência e invariantes

- **Representação acessível** é o conteúdo e a estrutura expostos por HTML semântico e pela árvore de acessibilidade. Ela DEVE existir no artefato estático e permanecer completa sem JavaScript, sintetizador específico ou serviço externo. [e8e5b5f]
- **Projeção falada** é a sequência natural derivada dessa representação para leitor de tela, TTS ou recurso de leitura. **TTS opcional** é apenas um consumidor progressivo; NÃO PODE ser a fonte da semântica. [e8e5b5f]
- Texto visual, grafia, voz autoral, pontuação editorial e conteúdo de referência DEVEM permanecer intactos. Marcador exclusivamente falado PODE complementar a ocorrência pertinente, mas NÃO PODE reescrever, ocultar ou substituir informação visível na árvore acessível sem equivalência comprovada. [e8e5b5f]
- HTML nativo, ordem DOM, headings, regiões, `article`, `nav`, listas, links, botões, `figure`, `figcaption`, `table`, `caption`, `th`, `lang` e texto visível DEVEM ser preferidos. ARIA só PODE preencher lacuna semântica real; `aria-label` NÃO DEVE rebatizar texto estático nem substituir rótulo visível suficiente. [e8e5b5f]
- As sub-RCFs de citações, referências, componentes, carregamento, desempenho, impressão e publicação permanecem autoritativas em seus conceitos de origem. Esta RCF governa somente sua projeção acessível/falada e a integração transversal.
- Todo artigo, post ou página elegível DEVE passar pelo mesmo normalizador determinístico no build. Conteúdo legado e futuro obedecem ao mesmo contrato; caso ambíguo é diagnóstico ou revisão humana, nunca inferência fabricada. [e8e5b5f]

## 2. Estrutura de leitura e navegação

- Cada página DEVE declarar idioma principal, título único, hierarquia de headings sem salto causado por apresentação, regiões nomeadas quando houver repetição e ordem DOM equivalente à leitura pretendida. [e8e5b5f]
- Cada publicação DEVE constituir um `article` identificável por seu título. Início e fim de artigo DEVEM ser programaticamente determináveis; marcadores falados explícitos só entram quando a estrutura isolada não produzir limite inequívoco no fluxo composto. [e8e5b5f]
- Paginação, `Anterior`, `Próximo`, artigos relacionados e recentes DEVEM ser agrupados em navegação nomeada. Cada destino DEVE expor função e título do artigo sem depender de ícone, posição ou contexto visual. [e8e5b5f]
- Links e botões sociais DEVEM possuir nome que identifique ação e plataforma. Ícone decorativo fica fora da árvore acessível; ícone essencial sem texto recebe nome funcional equivalente. [e8e5b5f]
- Rodapé, avisos editoriais e legais, inclusive `IMPORTANTE`, `AVISO DE CONTEÚDO SENSÍVEL E PÚBLICO-ALVO`, `LIBERDADE DE EXPRESSÃO, LIMITES E INTERPRETAÇÃO DO CONTEÚDO`, `ATENÇÃO`, `Legal`, `Advertências`, `Privacidade` e `Licença`, DEVEM permanecer íntegros, alcançáveis e ordenados na leitura. [e8e5b5f]
- Conteúdo acessível exclusivo PODE ser visualmente oculto por técnica comprovada de `visually-hidden`, mas NÃO PODE usar `hidden`, `display:none`, `visibility:hidden`, dimensão nula impraticável ou outro mecanismo que o retire da árvore acessível. [e8e5b5f]
- O conjunto de controles do TTS DEVE ser compacto, discreto e adjacente ao início do artigo, sem competir com título, cover ou texto. A ação visível PODE usar ícone, mas cada botão DEVE conservar nome acessível, dica textual, estado e alvo mínimo de toque; `play`, `pause`/`resume` e `stop` DEVEM permanecer inequívocos por mouse, toque e teclado. [e983edf]
- Preferência de modo de referências pertence ao TTS opcional e NÃO PODE alterar o HTML editorial, o destino das notas nem a configuração de verbosidade do leitor de tela do usuário. [e983edf]

### 2.1 Sumário automático do artigo

- Publicação elegível com `toc: true` DEVE receber no build um sumário derivado dos headings renderizados, sem inserir, remover ou reescrever bytes do Markdown-fonte. [86b8972]
- O sumário DEVE ser inserido imediatamente depois do primeiro parágrafo real do corpo do artigo; parágrafo descendente de `blockquote`, `q`, `[data-jcem-blockquote]`, `[data-jcem-subquote]` ou estrutura semanticamente citacional NÃO PODE satisfazer essa posição. [86b8972]
- Na ausência de parágrafo real, o build DEVE usar fallback determinístico antes do primeiro nó de conteúdo elegível; ausência de heading navegável omite o componente sem produzir caixa vazia. [86b8972]
- O componente DEVE usar navegação e lista semânticas, links para identificadores estáveis dos headings e controle nativo retraível; permanece retraído por padrão, operável sem JavaScript e nomeado como `Sumário do artigo`. [86b8972]
- A apresentação DEVE ser temática, responsiva e visualmente subordinada ao artigo, sem largura, altura, cor, sombra ou espaçamento que a convertam em banner; foco, contraste, teclado, toque e 320 px permanecem obrigatórios. [86b8972]
- O sumário integra a representação acessível estática, mas sua projeção no TTS opcional DEVE ser seletiva: `continuous` e `summary` o omitem, e somente `full` o pronuncia antes de prosseguir para o restante do corpo. [86b8972]

## 3. Ligações, marcadores e prosódia

O normalizador DEVE gerar no máximo um marcador por fronteira semântica. Leitor de tela que já anuncia função nativa NÃO DEVE receber duplicação mecânica equivalente. [e8e5b5f]

| Finalidade                | Contexto                                            | Forma falada padrão                                                 | Não se aplica quando                                                                   |
| ------------------------- | --------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| início/fim de artigo      | fluxo que agrega mais de uma publicação             | `Início do artigo: <título>.` / `Fim do artigo: <título>.`          | um único `article` já está isolado e seu limite é inequívoco                           |
| bloco citado              | citação semântica em bloco                          | `Início da citação.` / `Fim da citação.`                            | a tecnologia alvo já anuncia os limites sem ambiguidade comprovada                     |
| citação inline            | trecho citado dentro da frase                       | pausa breve e, havendo fonte real, `citação de <fonte curta>`       | a indicação quebrar a unidade prosódica ou repetir fonte adjacente                     |
| referência por ocorrência | nota ou citação vinculada                           | no modo contínuo, um aviso agrupado ao fim da fronteira semântica   | a fronteira não contiver referência ou o aviso já tiver sido emitido para o mesmo grupo |
| aviso tipado              | entrada de aviso editorial/legal                    | rótulo humano do tipo uma única vez                                 | o próprio heading/rótulo já for anunciado no ponto correto                             |
| tabela                    | entrada de tabela de dados                          | `Tabela: <caption>.`                                                | apresentação não tabular ou caption já anunciado sem ambiguidade                       |
| imagem informativa        | imagem que acrescenta conteúdo                      | alternativa breve focada na função                                  | imagem decorativa com alternativa vazia                                                |
| gráfico                   | visualização de dados                               | `Gráfico: <síntese principal>.` seguido de acesso à descrição/dados | renderer apenas duplicar representação já anunciada e estiver oculto à árvore          |
| navegação                 | anterior/próximo, paginação, relacionados ou social | nome da região, função e destino                                    | informação já compuser o nome acessível sem repetição                                  |

- Personalização rara DEVE ser explícita, local, revisável e limitada ao prefixo, sufixo, pronúncia ou forma falada da ocorrência. Ela NÃO PODE alterar padrão global, HTML visual ou outras ocorrências. [e8e5b5f]
- Pausa, ênfase e entonação DEVEM decorrer primeiro de pontuação e estrutura. SSML NÃO PODE ser inserido no HTML nem assumido por leitores de tela; qualquer exportador SSML futuro exige adaptador separado e não altera a fonte. [e8e5b5f]
- Texto exclusivamente falado DEVE usar frases humanas e curtas. Jargões como `blockquote`, `sup`, `aria`, `link node` ou nome de tag são proibidos na fala editorial. [e8e5b5f]

### 3.1 Modos de referências no TTS opcional

- **Contínuo** é o modo inicial obrigatório. A unidade principal é pronunciada sem expansão das notas e recebe, no máximo uma vez ao final da frase, parágrafo ou outra fronteira semântica efetivamente usada pelo sintetizador, o aviso breve de que a passagem possui referência ou referências. Múltiplas chamadas na mesma unidade DEVEM ser agrupadas; número, backlink e conteúdo integral NÃO PODEM interromper a proposição. [e983edf]
- **Resumido** é opt-in e pronuncia após a unidade cada fonte curta inequivocamente derivável, como `<SOBRENOME>, <ano>`, passagem/versão bíblica ou título mínimo necessário para desambiguação. Fonte repetida na mesma fronteira DEVE ser deduplicada sem apagar associações distintas. [e983edf]
- **Completo** é opt-in e conserva a capacidade já existente de pronunciar a definição integral vinculada. O mecanismo NÃO PODE ser removido, mas DEVE permanecer desabilitado por padrão e executar a expansão somente depois da unidade principal. [e983edf]
- Nos modos `summary` e `full`, cada expansão DEVE começar por `Referência <marcador>:`; o marcador decorre da ocorrência visual real e NÃO PODE ser anunciado como número ou glifo solto. [86b8972]
- No modo `continuous`, o aviso quantitativo DEVE ocorrer uma única vez ao fim de cada unidade, usar singular ou plural conforme as ocorrências distintas e NÃO PODE antecipar, intercalar ou repetir marcadores individuais. [86b8972]
- A mudança de modo DEVE ser acessível durante a sessão e anunciada sem reiniciar silenciosamente, perder posição ou misturar unidades construídas sob modos diferentes. Ausência de escolha explícita sempre resolve para `contínuo`. [e983edf]
- Referência ambígua conserva a nota integral como destino navegável. No modo resumido, ela recebe aviso de indisponibilidade de redução e acesso deliberado ao conteúdo completo; a ambiguidade NÃO autoriza inventar autor, ano, título ou passagem.

## 4. Citações e referências

- A classificação semântica de `RCF-JCEM-CITACOES-001` prevalece sobre tag ou aparência. Bloco, inline, subcitação e voz autoral DEVEM permanecer distinguíveis na sequência falada. [e8e5b5f]
- Citação em bloco recebe fronteira de entrada/saída somente quando necessária à compreensão; inline usa indicação breve integrada. Subcitação preserva hierarquia sem repetir marcadores em cascata a cada nó.
- Toda ocorrência ligada a nota, `<sup>` ou equivalente DEVE possuir associação estável com a definição e, quando aplicável, com a parcela exata da bibliografia. O marcador curto identifica a existência e o destino da nota; a projeção contínua agrupa essa indicação, e os modos resumido/completo fornecem o detalhamento deliberado. [e983edf]
- Referência bíblica agrupada DEVE selecionar somente livro, capítulo, versículo e versão efetivamente usados na ocorrência. Referência autor-data usa sobrenome, ano e título apenas para desambiguar ou preservar compreensão. [e8e5b5f]
- A redução falada DEVE ser derivada de dados reais e manter vínculo com a referência integral. Se a parcela não puder ser resolvida inequivocamente, o build NÃO PODE inventar: preserva informação mais completa e emite diagnóstico rastreável. [e8e5b5f]
- Backlinks, letras de reuso e numeração visual continuam regidos por `RCF-JCEM-FOOTNOTES-001`; a projeção falada não pode expor glifo de retorno como conteúdo editorial. [e8e5b5f]
- Nota longa ou estruturada NÃO DEVE ser achatada automaticamente como descrição do marcador por `aria-describedby`. O link nativo bidirecional entre `doc-noteref` e `doc-footnote` permanece obrigatório; `aria-details` PODE complementar a relação quando suportado, mas não substitui link, foco, destino nem retorno operável. [e983edf]

## 5. Idiomas e pronúncia

- Página e trechos em idioma diferente DEVEM usar tag BCP 47 aplicável. Grego koiné/antigo DEVE ser identificado como `grc` quando essa for a classificação editorial real; grafia original permanece visível. [e8e5b5f]
- Nome próprio, termo técnico incorporado ao vernáculo e idioma indeterminado seguem as exceções de WCAG; a IA NÃO DEVE marcar idioma ou pronúncia por semelhança lexical isolada. [e8e5b5f]
- Pronúncia personalizada só PODE ser criada a partir de dicionário, gramática, publicação acadêmica, léxico confiável ou revisão humana identificada. IPA PODE ser guardado como evidência, mas NÃO DEVE ser lido cru ao usuário. [e8e5b5f]
- Quando `lang` e vozes instaladas não bastarem, a fonte PODE declarar uma forma falada textual local para a ocorrência. Essa forma DEVE conservar significado, ser específica do idioma de saída e não substituir a grafia visual. [e8e5b5f]
- Ferramenta inteligente de pronúncia futura DEVE ser gratuita para o projeto, preferencialmente open source, mantida, licenciada, reproduzível e incapaz de publicar conteúdo privado. Saída automática permanece proposta até validação humana quando houver dúvida material. [e8e5b5f]
- Ausência de voz para um idioma DEVE degradar para texto acessível e metadado de idioma corretos; jamais autoriza transliteração arbitrária ou remoção do trecho. [e8e5b5f]

## 6. Tabelas

- Tabela de dados DEVE manter `caption`, `th` e associação de cabeçalhos. Tabela simples usa `scope`; tabela irregular ou multinível usa grupos e, quando necessário, `id`/`headers` explícitos. [e8e5b5f]
- Estrutura visual responsiva NÃO PODE destruir relações tabulares na árvore acessível. Layout tabular recebe semântica de apresentação e NÃO PODE ganhar caption/cabeçalhos falsos. [e8e5b5f]
- Resumo curto de organização é exigido somente para tabela complexa e não repete o caption. Leitura célula a célula DEVE obter contexto dos cabeçalhos reais; lista falada duplicada é proibida. [e8e5b5f]
- Complexidade evitável DEVE ser dividida em tabelas simples por assunto. Conversão para cards em viewport estreita só é válida se todas as relações permanecerem programaticamente determináveis. [e8e5b5f]

## 7. Imagens e gráficos

- Imagem decorativa usa alternativa vazia e não gera fala. Imagem informativa usa alternativa breve que comunica função/contexto; texto legível essencial existente na imagem DEVE ser transcrito fielmente quando não estiver disponível no conteúdo adjacente. [e8e5b5f]
- OCR ou descrição automática constitui rascunho: texto, entidade, número ou significado só entra após confronto com o asset e evidência suficiente. Incerteza bloqueia a publicação da projeção inventada, não a preservação do original.
- Imagem complexa e gráfico rasterizado exigem alternativa curta e descrição estruturada da informação essencial. Tendência, direção, relação, contraste e conclusão pertinente prevalecem sobre enumeração exaustiva; dados disponíveis DEVEM permanecer acessíveis por tabela ou estrutura equivalente. [e8e5b5f]
- `figure`/`figcaption` e conteúdo estruturado adjacente DEVEM ser preferidos para descrição complexa. `aria-describedby` só PODE apontar texto simples, pois não preserva navegação interna de headings/tabelas como descrição achatada. [e8e5b5f]
- Gráfico runtime DEVE nascer de dataset canônico versionado em CSV ou JSON, validado no build. A mesma fonte gera resumo, tabela/descrição estática e configuração visual; fontes duplicadas ou divergentes são proibidas. [e8e5b5f]
- Renderer visual é aprimoramento. Sem JavaScript, falha de asset ou tecnologia assistiva, título, síntese, dados e conclusão editorial continuam disponíveis. Se o canvas duplicar integralmente essa representação, ele DEVE ficar fora da árvore acessível; caso contrário recebe papel/nome conciso e vínculo com a descrição. [e8e5b5f]

## 8. Renderer gráfico e dependências condicionais

- A solução aprovada é **Chart.js 4.5.1+**, licença MIT, somente como renderer client-side opcional. A versão efetiva DEVE ser fixada em manifesto/lock e qualquer atualização material reabre compatibilidade, licença, segurança, peso e acessibilidade. [64e0ea2]
- A escolha considera: Chart.js ativo, integração por script/ESM, componentes registráveis e suporte explícito a fallback/ARIA sob responsabilidade do autor; Apache ECharts oferece ARIA/decal e escopo visual mais amplo, porém maior superfície; Vega-Lite oferece gramática declarativa e leitura nativa de CSV/JSON, porém adiciona compilador/runtime mais abrangente. A fonte acessível independente reduz a vantagem de engines maiores neste projeto.
- CSV/JSON DEVEM ser analisados no build pelo pipeline vigente e convertidos a uma projeção única validada. Chart.js não é parser nem autoridade de dados. [e8e5b5f]
- A implementação inicial NÃO PODE introduzir bundler novo apenas para gráficos. Deve usar distribuição local auditável compatível com o pipeline atual; otimização por componentes só pode acrescentar ferramenta após FT normativa própria e ganho líquido comprovado. [e8e5b5f]
- Asset do renderer, adaptador e dados visuais só PODE ser emitido/carregado em página cujo build detecte gráfico runtime válido. Página sem gráfico deve comprovar ausência desses bytes e requisições. [e8e5b5f]
- Carregamento ocorre após HTML essencial e fora do caminho crítico. Falha conserva a representação estática e registra diagnóstico sem esconder conteúdo.
- Orçamento de transferência/processamento segue `RCF-JCEM-PERFORMANCE-DEPENDENCIAS-001`; excedê-lo bloqueia a integração e reabre a comparação, sem degradar conteúdo ou tornar a biblioteca global.

## 9. Contrato de autoria e publicação

- Autoria comum continua em Markdown/Kramdown vigente. Semântica nativa deve ser usada antes de atributo local. Exceções explícitas usam IAL já suportada e namespace `data-jcem-*`; a sintaxe física final DEVE ser documentada no modo de uso antes da primeira publicação. [e8e5b5f]
- O contrato mínimo por publicação inclui idioma principal, headings válidos, regiões/navegação essenciais, citações/referências resolvíveis, alternativas de imagens, tabelas estruturadas e descrição/dataset de gráficos existentes.
- Metadado falado personalizado DEVE conter finalidade, ocorrência, forma falada, origem/evidência e estado de revisão. Campo vazio, órfão, duplicado ou não consumido falha. [e8e5b5f]
- Build DEVE inferir automaticamente capacidades por página e emitir manifesto de TTS/acessibilidade com recursos requeridos, diagnósticos e assets condicionais, sem incluir texto privado, payload de serviço ou dado não publicado. [e8e5b5f]
- Publicação DEVE falhar diante de perda de conteúdo acessível, referência ambígua sem fallback fiel, idioma inventado, imagem informativa sem alternativa, tabela sem associação ou gráfico sem resumo/dados. Aviso é permitido apenas quando o conteúdo original continua integral e a correção depende legitimamente de revisão humana registrada. [e8e5b5f]

## 10. Validação permanente

- Fixtures controladas e artigos reais DEVEM cobrir: headings, listas, regiões, artigo único/múltiplo, paginação, anterior/próximo, social, avisos, rodapé, citação inline/bloco/subcitação, referências simples/reutilizadas/agrupadas, idioma estrangeiro, grego koiné, tabela simples/complexa, imagem decorativa/informativa/com texto e gráfico raster/runtime. [e8e5b5f]
- Validação estrutural DEVE inspecionar HTML estático e árvore de acessibilidade; validação auditiva DEVE exercitar leitura sequencial, navegação por headings/regiões/tabelas, fronteiras autorais e naturalidade em combinações reais de navegador/tecnologia assistiva identificadas no ambiente, sem inventar suporte não testado. [e8e5b5f]
- Teste automatizado NÃO substitui escuta humana para pronúncia, prosódia, distinção de vozes, síntese de gráfico ou ausência de repetição mecânica. Evidência manual registra ferramenta, versão, voz/idioma, página, sequência, resultado e limitação.
- Matriz DEVE provar ausência de dependência opcional em página sem uso e presença somente na página elegível; falha do renderer, JavaScript desativado e voz ausente preservam conteúdo. [e8e5b5f]
- Testes do TTS DEVEM cobrir os três modos, agrupamento de chamadas múltiplas, referência repetida, nota ambígua, troca de modo em execução, pausa/retomada, acesso deliberado à nota completa e ausência de expansão integral no modo contínuo. [e983edf]
- Web claro/escuro, teclado, foco, toque, 320 px, impressão/PDF, SEO, PageSpeed, build Windows/Linux e GitHub Pages permanecem gates independentes. Aprovação de um não encobre falha, bloqueio ou inconclusão de outro.
- Publicação final exige correspondência entre commit-fonte, artefato renderizado, manifesto condicional e URL servida, seguida da remoção das TO-DOs concluídas sem alterar o equalizer perene.

## 11. Referências técnicas da decisão

- [WCAG 2.2 — W3C](https://www.w3.org/TR/WCAG22/)
- [WAI — tabelas acessíveis](https://www.w3.org/WAI/tutorials/tables/)
- [WAI — imagens complexas](https://www.w3.org/WAI/tutorials/images/complex/)
- [Chart.js — acessibilidade](https://www.chartjs.org/docs/latest/general/accessibility.html)
- [Chart.js — integração e tree shaking](https://www.chartjs.org/docs/latest/getting-started/integration.html)
- [Apache ECharts — ARIA](https://apache.github.io/echarts-handbook/en/best-practices/aria/)
- [Vega-Lite — dados CSV/JSON](https://vega.github.io/vega-lite/docs/data.html)
- [Vega-Lite — configuração ARIA](https://vega.github.io/vega-lite/docs/config.html#aria-configuration)
