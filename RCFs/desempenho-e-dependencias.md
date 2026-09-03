<!-- AI-PROCESSED -->
# RCF-JCEM-PERFORMANCE-DEPENDENCIAS-001

Status: vigente.

Escopo: scripts, estilos, fontes, bibliotecas externas, assets de terceiros e recursos client-side carregados pelo blog.

## Orçamento permanente e cobertura

- Implementação, manutenção, refatoração e evolução DEVEM buscar e manter pontuação PageSpeed Insights igual ou superior a 90 em todas as categorias aplicáveis, em mobile e desktop, para cada modelo, template ou layout real publicado, nunca para cada página ou publicação individual. [2f061ba]
- Cada layout DEVE ser aferido por no mínimo duas amostras representativas, com conteúdo, volume e assets distintos. Quando não houver duas rotas reais adequadas, fixture pública controlada, `noindex` e excluída de navegação, feed e sitemap DEVE exercitar o mesmo template e o mesmo caminho estrutural. [2f061ba]
- A aprovação do layout DEVE usar a mediana das amostras por categoria e estratégia, mantendo os resultados individuais visíveis para diagnóstico. Página editorialmente pesada NÃO PODE reprovar isoladamente a estrutura compartilhada nem ser escolhida, removida ou alterada para manipular o agregado. [2f061ba]
- A amostra mínima DEVE representar home, post/artigo, mapa/índice, about e cada outro layout público efetivamente descoberto. Não se mede indiscriminadamente toda URL equivalente nem se declara aprovação para layout não aferido. [860dfdf]
- Resultado agregado inferior a 90 DEVE bloquear nova regressão e produzir diagnóstico do gargalo estrutural compartilhado; resultado individual inferior a 90 DEVE permanecer como diagnóstico de custo editorial. Indisponibilidade externa, variação de laboratório ou limitação comprovada DEVE ser registrada separadamente e não convertida em sucesso. [2f061ba]
- Amostra de gate DEVE isolar custo estrutural e PODE usar fixture sem asset editorial; publicação real com mídia própria DEVE permanecer na matriz como diagnóstico observável, mas sua categoria de desempenho NÃO PODE integrar o agregado do gate quando o custo dominante for editorial. Categorias estruturais ainda aplicáveis, como acessibilidade, boas práticas e SEO, DEVEM continuar no gate. A distinção por `gateCategories` e as categorias aplicáveis DEVEM estar declaradas por amostra no mesmo manifesto versionado. [81772fa]
- Conteúdo editorial, redação, citação, imagem, mídia ou asset próprio de uma publicação NÃO PODE ser removido, fragmentado, recomprimido, reduzido ou alterado para elevar a pontuação. Otimização PageSpeed DEVE limitar-se a tema, layout, bootstrap, plugins, CSS/JS, carregamento e mecanismos compartilhados de entrega. [2f061ba]
- É PROIBIDO abrir ciclo de otimização por URL. Uma amostra específica só PODE motivar correção quando a causa for reproduzida em outra amostra ou fixture do mesmo layout e demonstrada como estrutural. [2f061ba]
- Categoria só é aplicável quando não contradiz a semântica HTTP/editorial da rota. Em particular, SEO de indexação NÃO se aplica à página 404 deliberadamente `noindex`; desempenho, acessibilidade e boas práticas continuam obrigatórios nessa rota. [99ebadb]
- Medição DEVE ser reproduzível, condensada, cacheada por URL, estratégia, versão e hash de artefato. Cache válido DEVE evitar nova consulta; saída para IA DEVE preservar pontuações, Core Web Vitals, auditorias determinantes e evidência, sem payload prolixo. [860dfdf]

## Regras Normativas

- Recurso externo não modificado deve ser carregado por CDN versionado quando existir CDN estável, pública e compatível com o build do projeto. [860dfdf]
- Bibliotecas, estilos, fontes e assets de terceiros não devem ser versionados localmente quando forem idênticos ao pacote público e não houver exigência de segurança, privacidade, disponibilidade ou compatibilidade que justifique cópia local. [860dfdf]
- Nenhum script, estilo, fonte ou asset externo deve ser carregado em páginas que não utilizam o recurso correspondente. [860dfdf]
- Recursos client-side legados só podem permanecer quando necessários para comportamento vigente; o carregamento deve ser condicionado automaticamente por página, componente ou estado inferido pelo build. [860dfdf]
- Dependências usadas somente no build, sem envio de JavaScript client-side ao navegador, podem permanecer em `package.json`, `Gemfile` ou ferramenta equivalente quando forem necessárias para gerar artefato estático. [860dfdf]
- Includes, layouts e plugins devem priorizar inferência automática em vez de metadados manuais no front matter. [860dfdf]
- Quando tecnicamente aplicável, recursos de CDN devem usar versão fixa, `integrity`, `crossorigin` e política de referência restritiva. [860dfdf]
- Exceções à CDN exigem motivo técnico rastreável: modificação local do asset, indisponibilidade de CDN estável, licença incompatível, privacidade, segurança, necessidade offline, bloqueio de rede previsível ou ganho mensurável de performance com cópia local.
- Leituras de layout e mutações visuais acionadas por `resize`, orientação ou observer DEVEM ocorrer em fases separadas e consolidadas por frame. Listener duplicado, medição repetida sem mudança, leitura/escrita intercalada e reconstrução integral desnecessária são proibidos. [860dfdf]
- Agrupamento da barra responsiva NÃO PODE ser removido; DEVE usar `ResizeObserver` ou sinal equivalente com cache de dimensões e `requestAnimationFrame`, preservando fallback de `resize`/orientação. [860dfdf]
- Runtime exclusivo de impressão IEEE NÃO DEVE integrar o caminho crítico. O módulo DEVE carregar após período ocioso ou atraso configurado suficientemente distante da primeira renderização e também imediatamente, sem bloquear o iniciador nativo, diante de `beforeprint` ou `matchMedia('print')`. [860dfdf]

## Implementação

- O carregamento condicional deve ocorrer no menor ponto de composição possível, preferencialmente no include ou layout que conhece o estado real da página. [860dfdf]
- Para matemática, `_plugins/jcem_math.rb` marca `page.jcem_math` durante o build; `_includes/head/custom.html` carrega KaTeX por CDN e o CSS local de controles apenas quando essa marca existir.
- JavaScript de varredura no navegador para decidir carregamento de bibliotecas deve ser evitado quando o build consegue inferir o uso com custo menor. [860dfdf]
- Bibliotecas client-side amplas devem ser auditadas antes de qualquer inclusão global; ausência de uso na página implica ausência de carga. [860dfdf]
- O projeto DEVE fornecer medidor PageSpeed representativo com cache e resumo estruturado, sem exigir credencial para validações locais que não consultem a API. [860dfdf]
- A publicação automatizada DEVE manter a consulta PageSpeed desativada por padrão e executá-la somente mediante sinalização explícita `run_pagespeed` quando houver necessidade estrita não coberta pelas provas diretas; essa seleção NÃO reduz a meta por layout nem autoriza ignorar falha da auditoria quando solicitada. [287137e]
- Falhas transitórias `5xx`, `TimeoutError` ou `AbortError` da API PageSpeed DEVEM receber repetição curta, limitada, determinística e observável; esgotadas as tentativas, o erro externo DEVE permanecer explícito e jamais ser convertido em pontuação aprovada. A matriz PODE usar concorrência pequena, fixa e versionada para reduzir a janela total sem produzir rajada de API, preservando a ordem declarada dos resultados. O resumo DEVE expor progresso por alvo, FCP, LCP, TBT e auditorias determinantes sem revelar credencial ou payload prolixo. [13d0040]
- Conteúdo acima da dobra que possa se tornar LCP NÃO DEVE usar lazy loading; deve ser descoberto no HTML e receber prioridade compatível. Scripts de consentimento não essenciais à primeira pintura PODEM ser descobertos no `<head>` somente com execução não bloqueante e ordenada, como `defer`; jamais podem impedir a análise do HTML ou ocultar o conteúdo. [00251f5]
- Skeleton de recurso prioritário NÃO PODE manter o candidato a LCP invisível depois que o navegador já dispõe de seus bytes. O placeholder PODE permanecer como fundo até a resolução do carregamento, sem impor atraso mínimo artificial à pintura do recurso real. [cfb1409]
- Imagens editoriais abaixo da dobra DEVEM nascer no HTML com carregamento tardio, dimensões e seleção responsiva quando houver variantes; adicionar `loading` somente depois da descoberta pelo navegador não satisfaz este contrato. [cfb1409]
- Imagem visual não candidata a LCP, ainda que próxima da primeira dobra, DEVE usar variante proporcional e prioridade inferior quando o original competir desnecessariamente com texto, CSS ou outro candidato crítico. [c2db821]
- Contenção de layout/pintura para conteúdo distante da viewport PODE ser aplicada exclusivamente em mídia de tela, com tamanho intrínseco de reserva e renderização automática ao aproximar-se da viewport. Essa otimização NÃO PODE integrar, limitar nem alterar o fluxo de impressão. [cfb1409]
- O adaptador de masthead DEVE manter uma única fila de sincronização responsiva e aplicar mutações somente quando o estado calculado mudar. [860dfdf]
- O runtime global do tema de terceiros NÃO DEVE ser enviado quando suas funções ativas já estiverem cobertas pelo conector local. `_includes/scripts.html` condiciona o pacote amplo à busca realmente habilitada; `assets/jcem/ts/site.ts` preserva perfil do autor, links permanentes, rolagem interna e realce do sumário sem jQuery ou plugins globais. [00251f5]
- Clonagem de fallback oculto e alimentação de blocos recentes DEVEM ocorrer somente após a liberação visual e fora da janela crítica inicial; o fallback sem JavaScript permanece estático e funcional sem depender dessas tarefas. [c2db821]
- O fallback estático em `noscript` DEVE permanecer funcional sem JavaScript, mas sua serialização NÃO DEVE preceder o conteúdo principal no fluxo HTML entregue a navegadores com JavaScript, quando isso atrasar a descoberta do candidato a LCP. A ordem física PODE colocá-lo após o wrapper principal desde que o modo sem JavaScript continue exibindo exclusivamente o fallback e preserve navegação, conteúdo e rodapé. [4da7cbc]
- Em coleções e taxonomias, somente o primeiro candidato efetivamente acima da dobra DEVE receber carregamento `eager` e prioridade alta por padrão. Sua variante responsiva DEVE ser antecipada no `<head>` quando o build conhecer deterministicamente o asset; cards seguintes não podem competir pela mesma prioridade sem evidência de que também compõem a primeira viewport. [4da7cbc]
- A exceção de otimização editorial limita-se às imagens exibidas por cards e thumbnails. Cada variante DEVE ser derivada uma única vez diretamente do original, com hash SHA-256, tamanho e commit de origem declarados; o gerador DEVE reutilizar saída já vinculada à mesma origem e recusar origem divergente até atualização explícita da declaração. Variante derivada NUNCA PODE servir de entrada para nova compressão. [2f061ba]
- Taxonomia que repita o mesmo artigo em muitos agrupamentos DEVE preservar título, destino e metadado essencial de cada ocorrência sem replicar card rico, imagem, excerto ou estrutura decorativa em todas elas. O modo compacto DEVE ser opt-in por página ou adaptador, sem alterar coleções cuja representação rica permaneça válida. [74afc28]
- A liberação visual em `DOMContentLoaded` DEVE possuir uma oportunidade real de pintura antes de percursos amplos do DOM, formatação editorial automática, conexão de skeletons ou aprimoramentos equivalentes. Tema e estado mínimo contra FOUC permanecem sincronizados antes da primeira pintura; os demais conectores DEVEM ser acoplados no primeiro turno posterior sem bloquear a apresentação do conteúdo estático já válido. [d45a16e]
- Componente que altera estrutura e geometria do conteúdo inicial, como renderer de painel citacional, DEVE ser materializado no build pelo plugin/conector da plataforma. O runtime PODE manter fallback idempotente para conteúdo inserido dinamicamente, mas NÃO PODE reconstruir após a primeira pintura a estrutura já conhecida no build. [81772fa]

## Validação

- `npm run check` deve permanecer sem regressões após alterações de dependências ou carregamento condicional. [860dfdf]
- Build Jekyll deve confirmar que páginas sem o recurso não recebem o asset externo. [860dfdf]
- Alterações que mudem carregamento visível ou interativo devem ser validadas em artefato renderizado. [860dfdf]
- Testes DEVEM simular sequência contínua de resize/orientation, contar medições e mutações por frame, comprovar agrupamento/desagrupamento e ausência de erro. [860dfdf]
- Validação de rede DEVE comprovar que o chunk de impressão não é solicitado antes do agendamento tardio em artigo, não é solicitado em páginas sem artigo e continua disponível para impressão antecipada. [860dfdf]
