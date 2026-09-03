# COVER e Hero — modo de uso

Este guia é o contrato físico de autoria subordinado ao `RCF-JCEM-CARREGAMENTO-PROGRESSIVO-001`. Os campos legados `featured_image`, `featured_image_style` e `header.*` continuam válidos; `cover` somente especializa o que for declarado.

## Exemplo completo

```yaml
featured_image:
  path: /assets/images/post/central.jpg
  alt: Descrição da imagem
featured_image_style: wide
cover:
  composition: triptych
  mode: FullWindow
  fit: auto
  header_opacity: 0.30
  patterns:
    left: "#202735"
    right: "linear-gradient(90deg, #202735 0%, #35435a 100%)"
  og:
    wide_source: /assets/images/social/fonte-wide.jpg
    square_source: /assets/images/social/fonte-square.jpg
  hero:
    zone: center
    align: center
    valign: center
    max_width: 42rem
    protection: auto
    content: |
      ## Título do Hero

      Texto editorial em mais de um parágrafo.
    cta:
      label: Continuar leitura
      url: "#inicio-do-artigo"
```

## Modos e composição

- `content` e `inline`: zona do artigo, conteúdo integral.
- `wide`, `full`, `full-width` e `bleed`: COVER infinita; `composition` aceita `single` ou `triptych`.
- `FullWindow`, `windowHeight` e `windowWidth`: modos externos, atrás da masthead.
- `innerFullWindow`, `innerWindowHeight` e `innerWindowWidth`: modos abaixo da masthead completa.

`patterns.left` e `patterns.right` aceitam path público de imagem, hexadecimal ou `linear-gradient(...)`. Em `triptych`, ambos são obrigatórios. Os aliases legados `header.image_wide_left`, `header.image_wide_right` e `header.image_wide_mode: triptych` permanecem equivalentes para patterns de imagem.

## Hero

`hero.zone` aceita `top-left`, `top-right`, `bottom-left`, `bottom-right`, `center` ou `full`. `align`, `valign`, `max_width` e `protection` são independentes; omitir Hero conserva a COVER anterior sem qualquer camada vazia. O CTA só é válido com `label` e `url` juntos.

## Open Graph

`cover.og.wide_source` e `cover.og.square_source` são overrides opcionais exclusivamente sociais. Na ausência deles, o pipeline reutiliza as fontes legadas e gera `header.og_image`/`header.og_image_square`; a imagem visível nunca é trocada por causa do override.
