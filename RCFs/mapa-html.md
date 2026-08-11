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

