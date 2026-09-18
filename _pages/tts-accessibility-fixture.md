---
title: "Fixture de leitura acessível e TTS"
layout: single
permalink: /_fixtures/tts-accessibility/
pagespeed_layout: article
locale: pt-BR
toc: true
toc_label: "Sumário"
share: false
sitemap: false
robots: noindex, nofollow
excerpt: "Fixture técnica controlada para validar semântica, TTS e gráficos condicionais."
---

Esta página técnica valida a leitura sequencial sem substituir a semântica HTML.

Consulte a [documentação de leitura acessível](/docs/MODO-DE-USO-LEITURA-ACESSIVEL-E-TTS/) para detalhes.

## Citações e [referência](/docs/MODO-DE-USO-LEITURA-ACESSIVEL-E-TTS/)[^fixture]

> A estrutura acessível permanece completa mesmo sem JavaScript.
> — Fixture técnica JCEM.[^fixture]

Uma ocorrência com `citação inline`{:.jcem-inline-quote} preserva a unidade da frase.

### Título de terceiro nível

#### Título de quarto nível

[^fixture]: JCEM. Fixture de leitura acessível. 2026.

## Idiomas

O nome <span lang="en">Web Speech API</span> mantém seu idioma, enquanto <span lang="grc">λόγος</span> identifica explicitamente o grego antigo sem transliteração inventada.

## Tabela e imagem

<table>
<caption>Estados do aprimoramento progressivo</caption>
<thead><tr><th>Camada</th><th>Resultado</th></tr></thead>
<tbody>
<tr><th>HTML</th><td>Conteúdo completo</td></tr>
<tr><th>JavaScript</th><td>Visualização opcional</td></tr>
</tbody>
</table>

![Cidade luminosa ao horizonte, usada como imagem informativa da fixture.](/assets/images/posts/eventos-finais/eventos-finais.svg)

## Gráfico runtime

{% jcem_chart assets/data/charts/tts-accessibility.json %}
