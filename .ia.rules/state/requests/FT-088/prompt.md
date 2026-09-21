# FT-088/FT-089 — Marcadores falados de citação em bloco

- Origem: solicitação humana no Codex.
- Data: 2026-09-21.
- Estado: incorporada nas FTs 088 e 089.
- RCF de destino: `RCFs/leitura-acessivel-e-tts.md`.

## Solicitação integral

> autorizo implementar completamente `MARCADORES_CITACAO_AUSENTES`, desde que não haja regressões.

## Contexto preservado

- A regressão global `check:accessible-runtime` já identifica a ausência de `Início da citação.` e `Fim da citação.` no payload efetivamente entregue ao sintetizador.
- A lacuna foi isolada das FTs 077, 079 e 081; essas frentes permanecem concluídas tecnicamente e não devem ser reabertas nem regredidas.
- O HTML visual, a semântica nativa, as referências, os links, os headings, o TOC, os modos `continuous`, `summary` e `full`, tabelas, gráficos, idiomas, controles e a gramática bíblica devem permanecer inalterados fora da projeção falada necessária.

## Decomposição vinculante

- Reconhecer bloco de citação por sua semântica canônica, independentemente de a materialização final usar `<blockquote>`, `role="blockquote"` ou `data-jcem-blockquote`.
- Emitir exatamente uma fronteira humana de abertura e uma de fechamento para cada bloco externo falado.
- Não duplicar marcadores quando os seletores semânticos coexistirem no mesmo elemento.
- Não transformar citação inline, parágrafo comum, tabela de apresentação ou estrutura visual em bloco citado.
- Preservar texto, referências e links internos do bloco segundo os modos TTS vigentes.
- Cobrir positivos, negativos, coexistência de marcadores, aninhamento e regressão integral do runtime acessível.
