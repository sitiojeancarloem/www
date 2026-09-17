# FT-077 — Isolamento inter páginas da impressão

Estado: tecnicamente corrigida, pendente de integração Git e validação humana. Fonte: `.ia.rules/state/requests/FT-077/prompt.md`.

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
- `rcf-trace prepare` registrou seis sentenças materiais da FT-077; finalização aguarda o commit causal autorizado.
- A primeira tentativa de build final encontrou `ENOSPC`; somente os dois builds temporários desta FT foram removidos, recuperando cerca de 9,8 GB, e a repetição integral foi aprovada.

## Pendência

- Integrar o commit causal e finalizar a rastreabilidade após autorização Git específica.
- Manter a TO-DO de impressão em avaliação humana, sem marcar conclusão ou removê-la.
