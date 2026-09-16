# Validação FT-066/FT-067 — COVER, barra e FLAG

## Quinta correção — bordas por modalidade e primeiro paint do backdrop

- Fonte humana: `.ia.rules/state/requests/FT-066/quinta-correcao-geometria-inicializacao-blur.md`; evidências: `evidencia21.png` e `evidencia22.png`.
- Diagnóstico: a rota mostrada nas evidências usa `featured_image_style: wide`, modalidade explicitamente full-width. Ela conserva stage de janela e crop central próprio; não pode ser estreitada para a zona do artigo. A rota real `/p/sola-scriptura/` usa `content` e já deriva frame, stage, mídia e deck das bordas canônicas do artigo.
- Correção de composição: depois de imagem e skeleton estabilizarem, o deck recebe por um frame `--jcem-cover-backdrop-saturation: 1.140001` e volta ao valor CSS `1.14`. A invalidação é local, consolidada por `requestAnimationFrame`, repetida somente em resize/orientação e não mantém polling, timeout, `will-change` ou estilo inline final.
- Preservação manual comprovada: `background-image: none`, alpha computado `0,35`, blur `10–15 px`, saturação `1.14`, bordas/sombra vigentes e filhos sem filtro.
- Build produtivo isolado aprovado em `202,5 s` sob `tmp/ft066-fifth-final`; a etapa Jekyll concluiu em `169,57 s`, com 12 assets sociais, 24 variantes e zero alterações.
- `npm run check:covers`: aprovado; quatro modos legados, seis estendidos, seis zonas Hero, resize, orientação, DPR 2, rotas reais `content`/`wide` e primeiro carregamento em Chrome e Brave por navegação direta, reload e cache desabilitado.
- Matriz visual focada: oito combinações aprovadas para as duas rotas reais, temas claro/escuro e viewports desktop/mobile. Inspeção no navegador confirmou `content` com bordas idênticas em `1169×900` e `391×844`, `wide` preservado e uma composição final sem estilo transitório.
- `npm run check:ts` e `rcf-trace validate` aprovaram; este último registrou `361` entradas e `334` sentenças materiais.
- `npm run check:documentation` permaneceu não aprovado por três itens preexistentes de outras frentes em `TODO.ia.md` que usam checkbox, fora do escopo desta correção; o item COVER continua corretamente em `⏳`.
- Commits: fonte `0ce72f5121`, norma `5d4a99b7d0`, causal `280d5f69ac`, sincronização `33b7dcad12` e testes `5865727247`.
- `_site`, `tmp/` e artefatos visuais permanecem derivados locais fora dos commits. Estado técnico concluído, pendente de validação humana.

## Quarta correção — blur integral perceptível

- Fonte humana: `.ia.rules/state/requests/FT-066/quarta-correcao-blur.md`; o fumê foi reconhecido como `98% aderente`, restando somente o desfoque perceptível de todo o conteúdo subjacente dentro da barra.
- Preservação: alpha `0,55 → 0,94`, gradiente, geometria, FLAG, título, sombra e demais recursos permaneceram inalterados.
- Correção: o `backdrop-filter` do próprio deck passou de `clamp(9px, 1.35vw, 14px)` para `clamp(20px, 2.5vw, 30px)`. A saída do backdrop continua recortada ao border-box da barra; os filhos permanecem sem filtro.
- Regressão causal: contra `tmp/ft066-third-candidate`, o teste novo falhou ao medir `blur(14px)`; o candidato corrigido aprovou exigindo raio computado mínimo de `20px`.
- Inspeção no navegador da rota `/p/devaneios/`: deck `1177,03 × 92,85 px`, `blur(30px) saturate(1.14)`; `upper`, `lower`, título e FLAG com filtros `none`. A faixa amarela e a pista ficam desfocadas somente na área da barra.
- Evidência local: `visual-artifacts/ft066-fourth-devaneios/browser-dark-blur.png`.
- Commit causal: `308608a70b4f27a37da21959fd5189cc461d4836`; rastreabilidade RCF: `301f53152d428c211a173a087d37e2db4c29e3d6`.
- Build isolado aprovado em `159,411 s` sob `tmp/ft066-fourth-candidate`; `check:covers` aprovado com quatro modos legados, seis estendidos, seis zonas Hero, resize, orientação e DPR 2.
- `/p/devaneios/`: 14 combinações aprovadas em sete viewports e dois temas. Matriz compartilhada: 140 combinações aprovadas nos dez modos, sete viewports e dois temas.
- Acessibilidade estrutural/runtime, impressão, desempenho, publicação e documentação aprovaram. `rcf-trace validate` aprovou `354` entradas e `332` sentenças materiais.
- Estado técnico: concluído, pendente de validação humana; a TO-DO operacional permanece `⏳`.

## Terceira correção — fumê perceptível após `evidencia20.png`

- Fonte da rejeição: `.ia.rules/state/requests/FT-066/terceira-rejeicao.md`; estado rejeitado: `evidencia20.png`; alvo vigente: `como-deveria-ser.png`.
- Causa confirmada: o topo do gradiente possuía somente `0,28` de alpha e a validação aceitava presença nominal de alpha/blur, sem patamar de densidade; a arte de alto contraste permanecia visualmente quase intacta sob a faixa superior.
- Correção: o próprio `.jcem-post-header__deck` passou a pintar o gradiente vertical e aplicar `backdrop-filter`, eliminando a camada material intermediária. O alpha progride por `0,55 → 0,70 → 0,84 → 0,94`, sempre abaixo de `1`; filhos continuam transparentes e sem filtros, e a sombra permanece externa no deck.
- Regressão causal: o build anterior falhou em `material fumê contínuo ou perceptível incompleto`; o teste novo exige ao menos quatro patamares crescentes, início mínimo `0,52`, término máximo `0,96`, ausência de opacidade total, blur real e zero COVER duplicada.
- Commit causal: `f1c833355d7298fb0ac6e069f9ee6bcd5870709e`; rastreabilidade RCF: `7ca24ce280`.
- Build isolado: aprovado em `126,215 s` sob `tmp/ft066-third-candidate`.
- `npm run check:covers`: aprovado com quatro modos legados, seis estendidos, seis zonas Hero, resize, orientação e DPR 2; inclui a rota real em `1119×900`.
- `/p/devaneios/`: 14 combinações aprovadas em sete viewports e dois temas; a captura `visual-artifacts/ft066-third-devaneios/browser-dark-smoke.png` foi inspecionada no navegador e mostra a faixa real da COVER escurecida/desfocada sob o fumê, com título e FLAG nítidos.
- Matriz compartilhada: 140 combinações aprovadas nos dez modos, sete viewports e dois temas.
- Acessibilidade estrutural/runtime, impressão, desempenho, publicação e documentação aprovaram. `rcf-trace validate` aprovou `354` entradas e `332` sentenças materiais.
- `_site`, `tmp/` e `visual-artifacts/` permanecem derivados locais fora dos commits.
- Estado técnico: concluído, pendente de validação humana; a TO-DO operacional permanece `⏳`.

## Correção final e revalidação após `evidencia19.png`

- Correção normativa: `92c44d7d0173997d9097e096942400da8bf5b82d`; commit causal: `96f220e1b76a24f5357892132efdcc146d867062`; rastreabilidade RCF: `e8a858774e36c34bd20431e12ff3c0bb06cbd2e2`.
- A profundidade superior deixou de ser apenas `27%` da altura da FLAG e passou a somar o deslocamento intrínseco de sustentação `16,850252%`; em `1515×990`, resultou em `34,53125 px`, sem pixel de viewport nem regra por artigo.
- No mesmo viewport, `upper.bottom = lower.top = cover.bottom = 722,48694 px`; a linha de sustentação da FLAG divergiu de `upper.top` por somente `0,001385 px` de subpixel.
- O `deck::before` forma a única superfície material: gradiente vertical com alpha `0,28 → 0,48 → 0,72 → 0,90` e `backdrop-filter: blur(14px) saturate(1.14)` no viewport medido. Não há `url(...)`, imagem ou COVER duplicada dentro do deck.
- `upper`, `lower` e título computaram fundo transparente quando aplicável, `filter: none` e `backdrop-filter: none`; a FLAG e o texto permanecem em foreground nítido. A sombra positiva pertence ao contorno externo do deck, e as regiões não possuem sombra própria.
- Teste causal contra o build anterior falhou primeiro por ausência do novo token estrutural e depois pela profundidade antiga, comprovando que a regressão distingue o estado rejeitado.
- `check:covers` aprovou quatro modos legados, seis estendidos, seis zonas Hero, resize, orientação e DPR 2. O teste de resize também exige material com alpha/blur, zero cópia de COVER e mudança efetiva das coordenadas da região real sob o vidro.
- `/p/devaneios/` aprovou 14 combinações de sete viewports e dois temas. Capturas desktop/escuro, wide/escuro e mobile/claro foram inspecionadas em resolução de viewport.
- A matriz integral aprovou 140 combinações dos dez modos em sete viewports e dois temas. Uma tentativa anterior sem `VISUAL_PAGES` foi inválida por direcionar o perfil COVER à raiz `/`, que não possui COVER; a repetição com os dez caminhos canônicos aprovou.
- Acessibilidade estrutural e runtime, impressão, desempenho, publicação e documentação aprovaram. `rcf-trace validate` aprovou `354` entradas e `332` sentenças materiais.
- Build candidato isolado: aprovado em `126,6 s` sob `tmp/ft066-bar-candidate`; `_site`, `tmp/` e `visual-artifacts/` não integram os commits.
- Evidências posteriores locais: `visual-artifacts/ft066-final-devaneios/` e `visual-artifacts/ft066-final-matrix/`.
- Estado técnico: concluído, pendente de validação humana; a TO-DO operacional permanece `⏳`.

## Segunda rejeição humana — acabamento final

- Em `2026-09-15T00:55:36.0204346-03:00`, `evidencia19.png` foi declarada estado atual rejeitado e `como-deveria-ser.png` permaneceu como alvo visual.
- O pedido complementar integral está preservado em `.ia.rules/state/requests/FT-066/acabamento-final.md`.
- A inspeção real do baseline em `1402×1157`, DPR efetivo `1,2`, mediu `upper=21,25 px`, `lower=58,32 px` e sobreposição `cover ∩ upper=21,25 px`.
- Somente `upper` possuía `backdrop-filter: blur(12px) saturate(1.18)` e gradiente com alpha; `lower` usava fundo opaco e nenhum backdrop. Assim, a presença formal de blur não produzia vidro contínuo na superfície percebida.
- A nova especialização exige mais entrada estrutural no COVER, alpha e gradiente contínuos nas duas regiões, backdrop real dinâmico, foreground nítido e sombra somente externa. FLAG, SVGs, estrutura única e correção de stacking anterior permanecem preservados.
- FT-065, FT-066 e FT-067 foram reabertas; nenhum aceite visual anterior vale como conclusão desta rodada.

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
