# Contexto-mestre - Equalizer de TOC, TTS, COVER e Hero

## Identidade

- FT normativa condutora: `FT-053`
- fonte: `.ia.rules/state/requests/FT-053/prompt.md`
- TODO canônico da solicitação: `TODO.ia.md`
- evidência COVER: `.ia.rules/state/requests/evidencias/projeto-cover.pdf`, 12 páginas, inspecionada integralmente em texto e imagem
- objetivo único: ampliar navegação, leitura falada e sistema editorial de covers/heroes sem alterar Markdown-fonte, eliminar modo vigente ou regredir acessibilidade, impressão, publicação, desempenho e comportamento visual restaurado.

## Equalização e ordem

1. `FT-053` normatiza TOC automático e projeção TTS correspondente.
2. `FT-055` normatiza COVER responsivo, modos de viewport, patterns, barras/flag, OG independente e Hero declarativo.
3. `FT-054` implementa TOC/TTS após as duas normatizações estarem concluídas.
4. `FT-056` implementa COVER/Hero preservando cumulativamente as FT-040, FT-048 a FT-052.
5. `FT-057` valida a matriz cruzada, sincroniza rastreabilidade, limpa TO-DOs concluídas, publica e converge branches.

## Decisões e compatibilização

- A autorização humana atual cobre expressamente todas as fases e dispensa nova confirmação após a normatização; a separação entre FTs e commits permanece obrigatória.
- O TOC é derivado no build e inserido no HTML após o primeiro parágrafo real do corpo; o Markdown-fonte permanece byte a byte intacto.
- O modo TTS `continuous` preserva o resumo quantitativo ao final de cada unidade e não verbaliza marcadores individuais; `summary` e `full` preservam detalhamento deliberado, e somente `full` inclui o TOC.
- COVER comum/content, wide single, wide triptych e hero legado continuam existentes. FullWindow e variantes são modos novos ou aliases semânticos, não substitutos.
- Zona do artigo e zona da janela são coordenadas distintas. A área útil central 1,91:1 é o limite do Hero; patterns e excedentes de crop permanecem decorativos.
- `windowWidth` reconcilia-se com o contrato legado equivalente por alias, sem ultrapassar a altura disponível; não será criado modo redundante.
- OG wide e square continuam derivados sociais independentes da mídia visível e ganham somente overrides editoriais opcionais.
- Alteração de header é restrita aos modos externos FullWindow/windowHeight/windowWidth; modos inner não recebem translucidez especial.
- Impressão não herda TOC ou apresentação de cover web; qualquer inclusão futura do TOC exige exceção IEEE explícita. Neste ciclo, o TOC permanece excluído da impressão.

## Preservação e fora de escopo

- Nenhum texto editorial, rascunho, referência, asset original, modo de cover, fallback noscript, 404 ou feature TTS será removido.
- `_site/` preexistente é artefato gerado concorrente e permanece fora de commits.
- Não será introduzida biblioteca externa de layout; HTML/Liquid, CSS/Sass, Ruby de build e TypeScript vigente são suficientes.
- PageSpeed só será executado se uma evidência direta revelar necessidade estrita não coberta pelos gates focados.

## Aceite global

- origem, TODO, FTs, RCF, schema, implementação e testes possuem vínculo bidirecional;
- Markdown-fonte não muda por TOC;
- todos os modos antigos e novos coexistem e degradam com segurança;
- matriz real cobre tema, viewport, orientação, teclado, TTS, impressão, header/scroll, patterns, Hero e OG independente;
- build isolado, testes agregados, publicação, commit-fonte e branches convergem sem absorver `_site/`.

## Resultado final

- FTs 053 a 057 concluídas sem alteração de Markdown-fonte ou remoção de modalidade vigente.
- Build isolado, gate agregado, matriz visual estrita local e workflow remoto `33810019978` aprovados.
- Publicação concluída a partir de `e3d5975f66d3029bace1444014cc6089ade08ffe`; `gh-pages` temporário removido.
- PageSpeed passou a exigir acionamento explícito por necessidade estrita, preservando integralmente o medidor e a meta normativa por layout.
- `dev` e `main` convergiram e `_site/` preexistente permaneceu fora do escopo Git.
