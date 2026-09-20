# FT-077 — Isolamento inter páginas da impressão

Estado: terceira correção humana registrada e autorizada; implementação, rastreabilidade e validação humana pendentes. Fontes: `.ia.rules/state/requests/FT-077/prompt.md`, `.ia.rules/state/requests/FT-077/segunda-correcao-footnotes-impressao.md` e `.ia.rules/state/requests/FT-077/terceira-correcao-referencias-links-controles.md`.

## Objetivo

Eliminar, pela camada compartilhada do adaptador IEEE, qualquer chrome, decoração ou controle web ainda visível em impressão e tornar a regressão diagnóstica e inter páginas.

## Baseline e hipótese inicial

- O workflow falhou em `/p/devaneios/` porque `hiddenChrome` resultou falso, mas a mensagem não identifica o seletor visível.
- O contrato já determina isolamento geral e proíbe correção rígida por consumidor ou rota; não é necessária redução nem exceção normativa.
- O adaptador compartilhado oculta parte do chrome, enquanto a matriz de validação audita um conjunto mais amplo; a divergência será medida no build atual antes da alteração.

## Ordem

1. Reproduzir em build produtivo isolado e listar cada elemento visível do conjunto auditado.
2. Ajustar o adaptador-fonte compartilhado e regenerar seu artefato oficial.
3. Fortalecer os testes para apontar seletores/elementos e cobrir artigos estruturalmente distintos.
4. Executar testes focados, matriz visual inter páginas e gates de regressão aplicáveis.
5. Registrar comparação anterior/posterior e manter a TO-DO em avaliação humana.

## Restrições

- Não criar exceção por URL, texto, post ou profundidade acidental do DOM.
- Não ocultar conteúdo editorial, metadados acadêmicos ou estrutura institucional impressa.
- Não modificar o `_site` compartilhado; build e evidências usam destino isolado.
- Não encerrar a TO-DO sem aceite humano efetivo.

## Aceite

- Nenhum seletor auditado de chrome fica visualmente presente na impressão de artigos.
- A falha informa exatamente os elementos que violam o contrato.
- Artigos com COVER/Hero/imagem e artigos sem esses recursos aprovam desktop e mobile.
- Home, mapa, 404 e páginas sem artigo conservam impressão natural.
- `check:print`, runtime de impressão, validação visual focada, TypeScript, documentação e rastreabilidade aprovam sem regressão.

## Diagnóstico e correção

- A migração recente da COVER wide legada para dentro de `[data-print-article]` fez a imagem passar a receber o reset IEEE `all: revert !important`.
- Esse reset usa `:is(#print-isolation-specificity-guard, [data-print-article])`; sua especificidade de ID prevalecia sobre as regras anteriores que ocultavam `.jcem-featured-image`, restaurando `display: block`/`inline` na figura e na imagem.
- O adaptador compartilhado passou a ocultar Hero, COVER, imagem destacada e variantes com a mesma guarda de especificidade, sem seletor de rota e sem alterar a apresentação web.
- `validate-visual.js` agora informa seletor, nó, classes, dimensões, folhas carregadas, estado de preparo e mídia quando algum chrome continua visível.
- A prova inter páginas foi incorporada a `test_print_runtime.mjs`, cobrindo quatro artigos reais estruturalmente distintos em desktop e mobile sem duplicar a matriz visual pesada.

## Comparação e preservação

- Antes: as regras `display: none !important` existiam, mas perdiam para o reset após a COVER entrar no artigo; o teste emitia somente uma mensagem genérica e não localizava a causa.
- Depois: a neutralização prevalece deterministicamente sobre o reset, e qualquer reincidência lista os elementos concretos que continuam visíveis.
- Foram preservados: conteúdo e metadados IEEE, carregamento pós-crítico, impressão natural fora do artigo, COVER/Hero e imagens na tela, temas, responsividade, modelos de citação e compatibilidade legada.
- Nenhuma regra por URL, conteúdo textual ou profundidade circunstancial foi introduzida.

## Validação

- Build produtivo final isolado em `.tmp/ft077-final-site`: aprovado em 164,3 s.
- Comando equivalente ao CI, sob `ci_timed_step.rb` com 420 s: `visual_validation=ok`, 405,8 s.
- Matriz focada anterior: quatro artigos reais em wide/mobile aprovada; prova consolidada em `check:print:runtime`: `profiles=desktop,mobile pages=4`, 28,9 s.
- `check:print`, `check:ts`, `check:covers`, `check:performance`, `check:accessibility`, `check:documentation` e `check:publication`: aprovados.
- `check:accessible-runtime` reproduziu somente a lacuna preexistente dos marcadores falados de início/fim da citação na fixture TTS, sem nexo causal com os artefatos de impressão alterados.
- `rcf-trace finalize` vinculou seis sentenças materiais ao commit causal `11a0fc7f24`; a validação aprovou 435 entradas e 394 sentenças materiais.
- A primeira tentativa de build final encontrou `ENOSPC`; somente os dois builds temporários desta FT foram removidos, recuperando cerca de 9,8 GB, e a repetição integral foi aprovada.

## Pendência

- Commits integrados: registro `087f2d5d08`, causal `11a0fc7f24` e rastreabilidade `0218a7e49d`.
- Manter a TO-DO de impressão em avaliação humana, sem marcar conclusão ou removê-la.

## Segunda correção humana — footnotes e ritmo vertical

- O DOM real de `/p/devaneios/` confirmou 57 chamadas de footnote e 57 `<sup data-print-link-note>` indevidamente aninhados nelas.
- A causa estrutural é a materialização de URLs: `href="#fn:…"` é resolvido contra `document.baseURI`, passa a parecer HTTP e recebe uma nova referência impressa dentro do `<sup>` já existente.
- O reset IEEE também devolve aos sobrescritos a métrica vertical nativa; sem normalização impressa própria, a caixa do `<sup>` pode alterar a altura efetiva da linha.
- A correção deve classificar o `href` original antes de resolvê-lo, excluir referências semânticas e fragmentos intradocumentais, impedir qualquer `<sup>` descendente de outro `<sup>` e manter links sobrescritos legítimos sem perda.
- A métrica deve partir do `line-height` do bloco textual: sobrescritos permanecem legíveis e elevados, mas com `line-height: 0` e posicionamento relativo proporcional, inclusive para marcadores de URL.
- A regressão deve combinar prova estrutural em fixture genérica, auditoria interartigos do DOM real e medição geométrica em mídia de impressão.

## Resultado e validação da segunda correção

- O coletor passou a classificar o `href` literal antes de resolvê-lo e exclui fragmentos, noterefs, backlinks, footnotes e seções de referências. Um link HTTP legítimo dentro de `<sup>` conserva seu sobrescrito e recebe a chamada de URL como irmão externo.
- Tela e impressão fixam `line-height: 0` na caixa de sobrescrito; o perfil IEEE posiciona o glifo relativamente a uma linha cuja métrica continua sendo definida pelo bloco textual.
- A fixture estrutural cobre chamada única, 4/5/6 consecutivas, referências separadas, número 10, reuso, destino, backlink, fragmento, URL repetida e `<sup>` legítimo, inclusive com link.
- O runtime percorreu quatro artigos reais em desktop e mobile: nenhum `<sup>` de footnote aninhado, marcador de URL interno, destino ausente, backlink inválido ou URL `#fn` espúria.
- Sete linhas alternadas com e sem `<sup>` mantiveram altura e passo uniformes de `14,40625 px`; caixas continuaram visíveis, sem clipping nem saída da faixa tipográfica segura.
- O build produtivo isolado em `.tmp/ft077-footnotes-site` aprovou em 215,6 s. `check:print`, `check:print:runtime`, `check:ts`, `check:footnotes`, `check:accessibility`, `check:publication`, `check:documentation` e `git diff --check` aprovaram.
- O PDF A4 real de `Devaneios` manteve sete páginas; inspeção raster da página 1 confirmou chamadas 4, 5 e 6 independentes, sem numeração secundária e com ritmo vertical contínuo.
- Commit causal da segunda correção: `3cb143ed2e`. O finalizador oficial não sincronizou as três sentenças novas porque interrompe primeiro na pendência preexistente da FT-066 `9fd169d66f75a7866950f6d5`, cujos artefatos não pertencem a este commit.

## Terceira correção humana — gramática, namespaces, decoração e controles

- A evidência real de `/p/devaneios/` é apenas caso reproduzível; a correção permanece obrigatoriamente global e interartigos.
- A inspeção confirmou que os colchetes das chamadas ordinárias são hoje gerados por `::before`/`::after` na skin web, enquanto o texto real do link contém somente o número. O reset IEEE remove esses pseudo-elementos e revela `<sup>N</sup>` no papel.
- A lista de URLs impressas materializa marcadores numéricos reais, compartilhando a aparência da sequência ordinária sem possuir namespace próprio.
- O perfil impresso aplica `text-decoration: underline` a todo link, transferindo ao papel decoração originada exclusivamente do hyperlink; ao mesmo tempo, a correção deve preservar decoração editorial externa, inclusive de ancestral semântico ou estilizado.
- O componente de leitura e outros controles interativos internos ao artigo não pertencem à classificação estrutural de chrome atualmente neutralizada pelo adaptador.
- A implementação autorizada deve consolidar texto real `[N]` nas chamadas ordinárias, reservar identificadores alfabéticos determinísticos aos links impressos, manter associações e sequências independentes, neutralizar somente a decoração própria do link e excluir controles web sem resíduo geométrico.
- Cada microetapa funcional concluída deve receber commit próprio e validação correspondente; `_site` compartilhado permanece intocado.
