# FT-078/FT-079 — Projeção falada contextual

Estado: registrada, aguardando commit inicial de governança. Fonte: `.ia.rules/state/requests/FT-078/prompt.md`.

## Objetivo

Normatizar e corrigir cirurgicamente a verbalização contextual de referências de footnote, links e títulos no TTS opcional, excluindo links/referências internos a headings e a numeração dos links do TOC.

## Diagnóstico inicial

- `assets/jcem/js/read-aloud.js` reconhece referências somente por `[role="doc-noteref"]`, embora o produto aceite ocorrências equivalentes de footnote em `<sup>`.
- O runtime remove a ocorrência reconhecida e acrescenta a expansão por modo, mas não possui contrato explícito para links editoriais nem prefixo contextual para `h2`, `h3` e `h4`.
- Headings recebem link permanente após o carregamento e o TOC é composto exclusivamente por links; ambos precisam de exclusão explícita para não produzir anúncio ou número espúrio.
- `scripts/test_accessible_runtime.mjs` cobre modos de referência e presença seletiva do TOC, mas não cobre esses limites combinados.

## Ordem

1. Refinar somente as sentenças aplicáveis de `RCFs/leitura-acessivel-e-tts.md`.
2. Preparar a rastreabilidade material para runtime, fixture e testes afetados.
3. Ampliar a fixture e a regressão runtime com casos positivos, negativos e combinados.
4. Corrigir o runtime local sem alterar o HTML editorial nem o normalizador gerenciado.
5. Executar testes focados, build isolado, regressões acessíveis e revisão do diff.

## Restrições

- Não alterar a numeração visual, destinos, backlinks ou conteúdo integral das notas.
- Não verbalizar link permanente, link interno de heading, marcador de referência em heading nem número ordinal do TOC.
- Não remover a inclusão seletiva do TOC no modo `full`.
- Não alterar leitor de tela nativo, ARIA estática ou verbosidade configurada pelo usuário.
- Não tocar o runtime gerenciado em `.ia.rules/`; a correção pertence ao adaptador local do produto.

## Aceite

- Nenhuma unidade falada contém marcador numérico solto originado de footnote.
- Links editoriais do corpo e headings `h2`–`h4` recebem contexto humano coerente.
- Headings com links/referências e os links do TOC não verbalizam link, referência ou número estrutural.
- Modos `continuous`, `summary` e `full` preservam seus contratos e os demais recursos TTS continuam aprovados.
