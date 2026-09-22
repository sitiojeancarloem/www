# FT-088/FT-089 — Fronteiras faladas de citação em bloco

Estado: FT-088 concluída; FT-089 em andamento com autorização humana. Fonte: `.ia.rules/state/requests/FT-088/prompt.md`.

## Objetivo

Normatizar e implementar a verbalização determinística das fronteiras de citação em bloco no TTS opcional, sem alterar a apresentação visual nem regredir capacidades consolidadas pelas FTs posteriores.

## Diagnóstico

- O build materializa o modelo padrão como `<blockquote data-jcem-blockquote>` sem `role="blockquote"`, preservando corretamente a semântica nativa.
- `assets/jcem/js/read-aloud.js` anuncia fronteiras somente para `[role="blockquote"]`; o bloco padrão não entra nessa rota e seus parágrafos são pronunciados como unidades comuns.
- O seletor semântico já usado pelo produto combina `blockquote`, `[data-jcem-blockquote]` e `[role="blockquote"]`; a correção deve reutilizar essa identidade, sem alterar o runtime gerenciado em `.ia.rules/`.
- A fixture e o teste de ponta a ponta já exercitam um bloco padrão e falham exclusivamente em `MARCADORES_CITACAO_AUSENTES`.

## Ordem

1. Consolidar no RCF o reconhecimento agnóstico da materialização e a regra de uma única fronteira por bloco externo.
2. Preparar a rastreabilidade material somente para a sentença e os artefatos afetados.
3. Corrigir o adaptador TTS local e ampliar os testes positivos, negativos e de aninhamento.
4. Executar gates focados, build isolado, runtime completo e páginas reais.
5. Consolidar estado, rastreabilidade e commits causais sem encerrar validações humanas alheias.

## Restrições

- Não editar o runtime gerenciado em `.ia.rules/`.
- Não alterar HTML autoral, modelos visuais de blockquote, impressão ou árvore semântica estática para acomodar o TTS.
- Não duplicar abertura/fechamento quando um mesmo bloco possuir tag nativa, atributo e papel simultaneamente.
- Não anunciar como bloco citações inline nem repetir marcadores em cascata para subcitações.
- Não alterar as projeções de footnotes, links, headings, TOC ou referências bíblicas.

## Aceite

- O payload efetivo contém `Início da citação.` e `Fim da citação.` ao redor do bloco padrão.
- Cada bloco externo produz exatamente um par de marcadores, inclusive com seletores coexistentes.
- Subcitação permanece hierárquica sem cascata redundante.
- Citação inline e parágrafo comum não recebem marcadores de bloco.
- Os três modos TTS e todos os gates vigentes aprovam sem regressão.

## Norma consolidada

- O RCF passou a reconhecer a identidade semântica do bloco por `<blockquote>`, `role="blockquote"` ou `data-jcem-blockquote`, independentemente da materialização visual.
- Seletores coexistentes no mesmo elemento resultam em uma única fronteira falada.
- Apenas o bloco externo recebe o par completo; citação inline e subcitação conservam suas projeções próprias sem cascata redundante.
