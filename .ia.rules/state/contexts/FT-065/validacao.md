# Validação FT-066/FT-067 — COVER, barra e FLAG

## Rejeição humana e reabertura

- Em `2026-09-14T09:16:59.4158588-03:00`, o resultado foi rejeitado explicitamente com captura da página real `/p/devaneios/` e a declaração `resultado incorreto`.
- A captura contradiz a conclusão anterior: a FLAG aparece apenas com o dia `16`, sem a hierarquia visível de ano/mês/dia da referência, e a faixa superior não comunica com a mesma clareza o vidro e a sustentação pretendidos.
- A validação anterior mediu geometria e estilos, mas não impôs à página real Devaneios a semântica visual da referência; a aprovação registrada abaixo permanece como histórico da tentativa rejeitada, não como aceite vigente.
- FT-066 e FT-067 foram reabertas. Novo encerramento exige regressão explícita sobre `/p/devaneios/`, nova matriz e nova validação humana.

## Correção e revalidação após a rejeição

- Causa real: o seletor genérico do skeleton elevava a imagem da COVER a `z-index: 4` num ramo irmão do cabeçalho. O deck usava o mesmo nível e não assegurava a ordem de pintura; assim, mídia/skeleton cobriam SVG, ano, mês e vidro, deixando visível apenas a parcela da FLAG abaixo da COVER.
- Correção: nos modos sobrepostos, `#main` forma uma camada `z-index: 7` acima da COVER e do conteúdo útil Hero; o deck mantém o mesmo nível explícito dentro desse ramo.
- Regressão causal: `elementsFromPoint` compara FLAG e barra superior com o stage da COVER. Overlays globais legítimos podem permanecer acima de ambos sem mascarar a ordem relativa. A página real `/p/devaneios/` é exercida em `1119×900` e exige `2014 / ABR / 16` integralmente pintado.
- Commit causal corrigido: `c76224ba644a96d1371208169a4f396feb9acdfa`; rastreabilidade RCF: `8e982882751489c92cfaaa51efa1b29db90fa339`.
- Build produtivo isolado: aprovado em 78,61 s no destino temporário `jcem-cover-ft066-20260914-0935`.
- `npm run check:covers`: aprovado; quatro modos legados, seis estendidos, seis zonas Hero, resize, orientação e DPR 2.
- Página real Devaneios: 14 combinações aprovadas em sete viewports e dois temas. Capturas de viewport desktop/escuro e mobile/claro foram abertas e confirmaram a FLAG inteira e o vidro à frente da COVER.
- Matriz final: 140 combinações aprovadas nos dez modos, sete viewports e dois temas com a nova prova de ordem de pintura.
- Acessibilidade estrutural e runtime, impressão, desempenho, publicação e documentação: aprovados.
- `rcf-trace.js validate` com Node 24.19.0: 347 entradas e 332 materiais aprovados.

### Falha ambiental isolada

- Comando: `npm run build:prod`; destino compartilhado `_site`; Windows NT 10.0.26100.0, PowerShell 7.6.6, Ruby 4.0.5, Bundler 4.0.14 e Node 22.21.0.
- Resultado: `Errno::EINVAL` em `IO.binwrite` de `_site/assets/jcem/accessibility-manifest.json`, durante a presença de dois processos Ruby iniciados às 09:09, antes desta correção.
- Conduta: os processos do usuário não foram encerrados. A repetição em destino temporário isolado aprovou, evidenciando concorrência específica do destino, não falha do código COVER.
- `_site`, destino temporário e `visual-artifacts` continuam derivados e não integram commits.

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
