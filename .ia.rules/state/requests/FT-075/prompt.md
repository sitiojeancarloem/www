# FT-075 — Correção visual estrita dos templates de blockquote

- Origem: solicitação humana no Codex.
- Data: 2026-09-16.
- Estado: incorporada em FT-075 e FT-076.
- RCFs de destino: `RCFs/citacoes.md` e `RCFs/documentacao-e-metadados.md`.
- Evidências normativas: `../evidencias/e1.png` a `../evidencias/e6.png`.
- Evidência de rejeição: `defeito-e6.png`.
- SHA-256 da evidência de rejeição: `E74F8EBB507DFD47884A8ABD4335F432AB0CC77644839525B5FCC0A284BAF36E`.

## Solicitação integral

> A imagem em anexo demonstra claramente que o blockquote correspondente a `e6.png` incorporado NÃO produz o mesmo estilo visual, possuindo muitas divergências, dentre as quais eu cito apenas algumas, mas há outras: alinhamento right (onde é justificado left) e ausência do `"' no espaço entre as duas linhas verticais ´´a esquerda; também verificou-se que o espaçamento entras as linhas modifica-se conforme o tamanho do texto (e consequente altura da caixa que ele ocupa), mas isso não deve ocorrer, pois aquele espaço DEVE ficar verticalmente centralizado e bem alinhado com `"`, não podendo sofrer alterações com base na quantidade de texto. As imagens de `e1.png` a `e6.png` na pasta de evidencia, DEVEM ser usadas como referencial visual estrita salvo exceção expressa em contrário. Aproveite e revise os demais blockquotes inseridos recentemente pendente de validação, para garantir que visualmente estão iguais.

## Decomposição vinculante

- As referências `e1.png`–`e6.png` são visuais estritas para os cinco modelos derivados, salvo exceção expressa já registrada.
- O relato enumera exemplos, não uma lista exaustiva; todos os modelos recentes devem ser confrontados integralmente.
- `thematic-rail` deve manter corpo e autoria alinhados à esquerda, aspas visíveis no intervalo fixo da haste e intervalo verticalmente centralizado sem depender da altura textual.
- Claro, escuro, desktop, mobile, aliases, seleção explícita, acessibilidade, fallback e impressão IEEE devem permanecer funcionais.
- A TO-DO permanece em avaliação humana mesmo depois da correção técnica.
