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
- Metadados de assets constituem camada opcional de otimização; o tema jamais deve depender deles para funcionar corretamente.
- Quando disponíveis, metadados de assets devem ser usados para otimizar desempenho percebido, responsividade, reserva antecipada de espaço, estruturação automática de componentes e precisão do skeleton loading.
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
- `404.html` mantém implementação local equivalente para loader, imagem destacada e cards recentes.
- A implementação atual não grava EXIF nos arquivos originais porque a camada sidecar atende ao contrato com menor risco, sem nova dependência e sem mutação de assets autorais.

## Validação

- A validação visual deve simular asset pesado pendente e confirmar que `.jcem-page-loaded` é aplicado antes de `document.readyState === "complete"`.
- A validação visual deve confirmar que o conteúdo permanece oculto antes dos recursos essenciais e visível após a liberação essencial.
- A validação visual deve confirmar presença, geometria, pseudo-elemento e estado final dos skeletons em componentes elegíveis.
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
