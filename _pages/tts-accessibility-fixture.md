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

## Referências bíblicas globais

Casos bíblicos: Gênesis 2:7; Apocalipse 14:12; Gênesis 2:7-8,15; Apocalipse 14:12,22;15:3-7;16:1,3 e 5; Êxodo 12:1-3,7; 1 João 3:16; 1 Coríntios 13:4,7 e 13; II Coríntios 11:14; I João 2:3-6; Sl 23:1 NVI.

O horário 14:30 continua sendo horário, e a sintaxe técnica `Gênesis 2:7` permanece literal.

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
