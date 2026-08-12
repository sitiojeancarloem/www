---
layout: mapa
permalink: /_fixtures/pagespeed/map/
title: Fixture estrutural do mapa
description: Amostra controlada do layout de mapa para aferição estrutural.
author_profile: false
sidebar: false
sitemap: false
pagespeed_fixture: true
jcem_mapa:
  title: Fixture estrutural do mapa
  description: Conteúdo controlado, excluído de navegação e indexação.
  post_total: 2
  posts_per_page: 50
  page: 1
  page_count: 1
  offset: 0
  path: /_fixtures/pagespeed/map/
  url: /_fixtures/pagespeed/map/
  navigation_groups:
    - title: Navegação de controle
      links:
        - title: Início
          url: /
        - title: Sobre
          url: /sobre/
  taxonomies:
    - key: categories
      title: Categorias de controle
      path: /c/
      items:
        - title: Ciência
          count: 1
          url: /c/#ciencia
        - title: Filosofia
          count: 1
          url: /c/#filosofia
  posts:
    - title: Publicação estrutural A
      url: /p/como-identificar-falacias/
      excerpt: Texto curto e controlado para exercitar a composição do mapa.
    - title: Publicação estrutural B
      url: /p/sola-scriptura/
      excerpt: Segundo volume controlado para distinguir a amostra do mapa real.
---
