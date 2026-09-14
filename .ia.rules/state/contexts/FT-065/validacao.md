# Validação FT-066/FT-067 — COVER, barra e FLAG

Data: 2026-09-14T02:10:35.8727673-03:00

## Causa e correção

- Antes: o marcador da FLAG e o topo de sua caixa coincidiam artificialmente com `upper-bar.top`; a barra superior não sobrepunha a COVER nem aplicava blur real.
- Depois: os testes extraem o primeiro `path` de `flagVermelho.svg` e `flagCinza.svg`, derivam `18.724 / 111.12 = 0.16850252` e conferem o token e a geometria renderizada.
- O hero legado, `content`, `wide single` e `wide triptych` usam `upper-bar.bottom = cover.bottom = lower-bar.top`; os seis modos de viewport mantêm `cover.bottom = upper-bar.top`.
- A região superior usa gradiente RGBA e `backdrop-filter`; a inferior é sólida, recebe sombra somente abaixo e contém o título amarelo sem adereços de link.
- Os SVGs de FLAG e conteúdo editorial foram preservados; cards ficaram fora da especialização.

## Evidência executada

- Commit causal: `2fafaf46693edbff045cfb579101aaf8f19f3015`.
- Commit de sincronização RCF: `4ff450b152c3ffc8803222fa10f57c2ef3f473a8`.
- `npm run build:prod`: aprovado; 164,1 s; 12 assets sociais; 24 variantes; zero regenerações.
- `npm run check:covers`: aprovado; 4 modos legados, 6 estendidos, 6 zonas Hero e 2 classes de viewport; inclui resize, orientação e DPR 2.
- `VISUAL_PROFILE=covers npm run validate:visual`: aprovado duas vezes; matriz estrita de 140 combinações, com 10 modos, 7 viewports e 2 temas.
- Capturas inspecionadas em `visual-artifacts/`: `content` escuro desktop/mobile e `wide-triptych` claro desktop, apó inclusão de datas nas quatro fixtures sobrepostas.
- `npm run check:documentation`: aprovado; 10 COVERs, 6 quotes e 2 manifestos.
- Gates de TypeScript, HTML, footnotes, math, assets, authors, namespaces, quotes, acessibilidade, runtime acessível, citações inline, impressão, desempenho, social images, atribuíções e publicação: aprovados.
- `rcf-trace.js validate` com Node 24: aprovado; 347 entradas e 332 materiais.

## Lacunas alheias preservadas

- `npm run check` parou em `check:editorial-assets` porque `_drafts` não existe no worktree; a falha ocorre em `readdir` antes de avaliar o domínio COVER. Nenhum diretório ou conteúdo foi fabricado para contornar o gate.
- `npm run agent:rcf` permanece bloqueado por `GAP-RCF-MODULE-2026-001`: `package-registry.js` usa `module.exports` enquanto o pacote raiz é ESM. O runtime gerenciado não foi alterado.
- `_site` e `visual-artifacts` são derivados locais e não integram os commits.
