# FT-088/FT-089 — Fronteiras faladas de citação em bloco

Estado: FT-088 concluída; FT-089 tecnicamente concluída e pendente de validação auditiva humana. Fonte: `.ia.rules/state/requests/FT-088/prompt.md`.

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

## Implementação e validação

- `assets/jcem/js/read-aloud.js` reutiliza um único seletor semântico para `<blockquote>`, `[data-jcem-blockquote]` e `[role="blockquote"]`; o walker continua encerrando a descida ao formar a unidade do bloco externo.
- A regressão runtime combina o bloco real da fixture com um bloco sintético que possui seletores coexistentes e subcitação, exigindo exatamente dois pares de fronteiras nos modos `continuous`, `summary` e `full`.
- `check:accessible-runtime` passou com `spoken_units=23`; a falha `MARCADORES_CITACAO_AUSENTES` deixou de ocorrer.
- O build isolado em `.tmp/ft089-site` e o gate agregado `npm run check` passaram integralmente, incluindo TypeScript, footnotes, citações, acessibilidade, impressão, desempenho, COVER, política editorial, publicação e documentação.
- A página renderizada confirmou o caso real como `<blockquote data-jcem-blockquote>` sem `role`, com leitor pronto, runtime local carregado e ausência de erros no console.
- A rastreabilidade escopada da RCF TTS aprovou 75 entradas e 75 sentenças materiais. A validação global conserva pendências antigas de outras FTs e a sentença preexistente não mapeada em `RCFs/citacoes.md:53`.

## Commits

- Registro: `4b3e3f278c`.
- Norma: `42764912c3`.
- Causal: `9111da9d5f`.
