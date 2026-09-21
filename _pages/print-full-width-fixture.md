---
layout: single
title: "Fixture: figuras IEEE em largura total"
description: "Matriz técnica para validar figuras comuns, manuais e automaticamente classificadas na impressão IEEE."
abstract: "Technical matrix for validating ordinary, manual, and automatically classified full-width figures in IEEE print."
permalink: /fixtures/print-full-width/
pagespeed_layout: article
sidebar: false
sitemap: false
---

Este parágrafo antecede a primeira figura e comprova que o texto começa no fluxo normal de duas colunas. O conteúdo editorial permanece na ordem do DOM tanto na tela quanto na impressão.

<figure id="print-full-width-manual">
  <img src="/assets/images/fixtures/print-ieee/simple-wide.svg" alt="Ilustração horizontal simples marcada manualmente" data-print-span="all">
  <figcaption>Figura manual: o atributo da imagem é promovido ao contêiner semântico.</figcaption>
</figure>

O texto posterior à figura manual deve retomar a composição em duas colunas sem sobreposição, duplicação ou salto de leitura.

<figure id="print-full-width-auto-text">
  <img src="/assets/images/fixtures/print-ieee/text-dense.svg" alt="Diagrama textual denso de controle">
  <figcaption>Figura automática por densidade textual.</figcaption>
</figure>

Entre as figuras automáticas há conteúdo corrente suficiente para medir a retomada do fluxo e a posição relativa dos elementos.

<figure id="print-full-width-auto-visual">
  <img src="/assets/images/fixtures/print-ieee/visual-dense.svg" alt="Malha visual densa sem texto">
  <figcaption>Figura automática por densidade visual não textual.</figcaption>
</figure>

<figure id="print-full-width-negative-simple">
  <img src="/assets/images/fixtures/print-ieee/simple-wide.svg" alt="Ilustração horizontal simples sem marcação">
  <figcaption>Controle negativo: geometria horizontal isolada não autoriza automarcação.</figcaption>
</figure>

<figure id="print-full-width-near-limit">
  <img src="/assets/images/fixtures/print-ieee/near-limit.svg" alt="Diagrama denso próximo ao limite de altura">
  <figcaption>Controle limítrofe positivo: projeção imediatamente abaixo de 35%.</figcaption>
</figure>

<figure id="print-full-width-over-height">
  <img src="/assets/images/fixtures/print-ieee/over-height.svg" alt="Diagrama textual acima do limite de altura">
  <figcaption>Controle negativo: densidade positiva não supera a rejeição geométrica.</figcaption>
</figure>

Este parágrafo encerra a matriz e deve permanecer depois de todas as figuras em tela e no documento impresso.
