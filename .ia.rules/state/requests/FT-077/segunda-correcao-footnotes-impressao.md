# FT-077 — Segunda correção humana: footnotes e ritmo vertical impresso

- Origem: solicitação humana no Codex, com especificação textual e duas capturas.
- Data: 2026-09-19.
- Estado: incorporada à correção de implementação e validação FT-077.
- RCFs de destino: `RCFs/impressao-ieee.md` e `RCFs/referencias-e-footnotes.md`.
- Solicitação integral: `segunda-correcao-footnotes-impressao.txt`.
- SHA-256 da solicitação integral: `DA12F005A64C37009CB46C507150FF6F5341583683076040203D83CDD58D2F17`.
- Evidência impressa: `segunda-correcao-footnotes-impressao.png`.
- SHA-256 da evidência impressa: `012A30E5E709D0AE0E1D4BBEF5D2AB1899DC8A2CFAE3965730E823AF30D866BA`.
- Evidência web: `segunda-correcao-footnotes-web.png`.
- SHA-256 da evidência web: `F2D82D0B97F7BA4A0B77D47617351C02D344320CE69A7AFD84C6948D8284A71A`.

## Decomposição vinculante

- `Devaneios` e a sequência 4, 5 e 6 são exemplos reproduzíveis, nunca escopo de seletor, rota, conteúdo ou numeração.
- A materialização da lista de URLs não pode reinterpretar chamada de footnote, backlink, fragmento intradocumental nem referência já materializada como link comum.
- Cada chamada de footnote conserva cardinalidade, ordem, número, `href`, `id`, destino e backlinks, com exatamente um nível de sobrescrito.
- Links legítimos dentro de um `<sup>` não podem receber outro `<sup>` descendente; quando elegíveis à lista de URLs, o marcador impresso deve ficar depois da caixa sobrescrita existente.
- O sobrescrito impresso, seja chamada de nota, marcador de URL ou uso semântico legítimo, não pode expandir a caixa de linha do bloco textual.
- A equalização tipográfica deve preservar legibilidade, posição, seleção, navegação, tamanhos relativos e ausência de clipping, colisão ou sobreposição.
- Regressões devem cobrir chamada única, consecutivas, separadas, múltiplos parágrafos, número acima de 9, uso legítimo de `<sup>`, múltiplos artigos e medição reproduzível de linhas alternadas com e sem sobrescrito.
- O HTML/DOM deve ser validado estruturalmente; ocultar a duplicação apenas por CSS é insuficiente.
- A TO-DO de impressão permanece pendente de validação humana depois da correção técnica.
