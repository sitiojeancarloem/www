# FT-078/FT-079 — Correção da projeção falada de referências, links, títulos e TOC

- Origem: solicitação humana no Codex.
- Data: 2026-09-18.
- Estado: incorporada nas FTs 078 e 079.
- RCF de destino: `RCFs/leitura-acessivel-e-tts.md`.

## Solicitação integral

> Enquanto está lendo os parágrafos, e encontra um <sup> (de referência ao footnote) o TTS AINDA lê apenas um ou número diretamente, SEM  falar nata como "citação" ou "referência" a fim de evitar que a leitura do número se confunda com eventual contexto presente no texto. O mesmo ocorre quando é encontrado um link e um título (h2, h3, h4). Especificamente no caso dos títulos, que possuem links, NÃO deve ser lido a referência em modo algum, e isso se aplica também ao TOC, que por sí só possui links, e não convém ler os números de cada link. Aplique as correções de forma cirurgica, sem regredir ouros pontos.
>
> continue.

## Decomposição vinculante

- Marcador de footnote em parágrafo não pode ser pronunciado como número ou glifo isolado; deve possuir indicação humana inequívoca de referência conforme o modo TTS.
- Link editorial no corpo deve ser distinguível na fala sem alterar o texto visual ou duplicar semântica nativa fora do TTS opcional.
- `h2`, `h3` e `h4` devem ser distinguíveis como títulos na fala.
- Link permanente, marcador de footnote ou referência inseridos dentro de título não devem ser verbalizados como link ou referência.
- Links e numeração estrutural do TOC não devem ser verbalizados; o TOC preserva seus modos de inclusão já contratados.
- A correção deve reutilizar o runtime e os testes vigentes, sem regressão dos modos `continuous`, `summary` e `full`, citações, tabelas, gráficos, idiomas, controles ou acessibilidade estática.
