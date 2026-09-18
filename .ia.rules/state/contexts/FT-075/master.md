# Contexto mestre — FT-075/FT-076

## Objetivo

Corrigir cumulativamente a implementação visual dos cinco modelos derivados de `e1.png`–`e6.png`, usando as imagens como referência estrita e mantendo as capacidades normativas, semânticas, temáticas, responsivas e impressas já existentes.

## Ordem e fases

1. FT-075: equalização e correção normativa.
2. FT-076: implementação, testes, documentação e integração.

## Mapa de fidelidade

- `framed-accent` (`e1/e2`): moldura lateral/inferior, superfície interna, cabeçalho destacado e adorno lateral, com accent parametrizável.
- `pull-quote` (`e3`): aspas grandes laterais, recuo pequeno, corpo à esquerda e autoria abaixo à esquerda.
- `centered-mark` (`e4`): aspas superiores centrais, corpo estreito centralizado e sem fundo externo incorporado.
- `editorial-statement` (`e5`): aspas superiores centrais, declaração forte centralizada, autoria inferior e sem fundo externo fixo.
- `thematic-rail` (`e6`): haste vertical com intervalo fixo centralizado, aspas visíveis dentro do intervalo, corpo e autoria à esquerda e paleta temática.

## Restrições

- Não remover modelos, aliases, accents, seletores explícitos, compatibilidade legada ou semântica acessível.
- Não contaminar a impressão IEEE.
- Não tocar no `_site` compartilhado já modificado; construir em destino isolado.
- Não concluir nem remover a TO-DO antes do aceite humano.

## Aceite global

- Comparação visual de todos os cinco modelos com `e1.png`–`e6.png` em claro/escuro e desktop/mobile.
- Testes geométricos detectam adornos invisíveis, alinhamento incorreto e haste dependente da altura do texto.
- Seis modelos preexistentes, aliases, build-time, runtime, acessibilidade e impressão IEEE permanecem aprovados.

## Resultado técnico da FT-076

- A falha comum era composta por pseudo-elementos com `content` calculado, porém ainda ocultos por `display: none`, alinhamento justificado genérico e haste do `thematic-rail` baseada em percentuais da altura total.
- Os cinco modelos foram revalidados e corrigidos: adornos materializados, alinhamentos específicos restaurados e ilustrações/documentação sincronizadas.
- O `thematic-rail` usa vão fixo centralizado e aspas visíveis; fixtures curta e longa comprovam que o vão não varia com a quantidade de texto.
- O runtime focado aprovou claro/escuro em 1280/320 px e o isolamento de impressão IEEE. Os gates TypeScript, semântico, documental, impresso, acessível estático e de desempenho também aprovaram.
- O gate geral `validate:visual` permaneceu inconclusivo por timeout após 301 segundos sem falha emitida. `check:accessible-runtime` reproduziu a lacuna preexistente dos marcadores falados de início/fim da citação, sem nexo com a correção visual.
- A FT-076 está tecnicamente corrigida, mas a TO-DO e a integração FT-074 continuam pendentes do aceite visual humano.

## Segunda correção humana — 2026-09-17

- Fonte: `../../requests/FT-075/segunda-correcao-blockquote-padrao.md`.
- Evidência real: na primeira citação de `Devaneios`, fora do limiar otimizado, as duas aspas aparecem; nas demais, `content-visibility: auto` ativa contenção de pintura e recorta a metade do pseudo-elemento deslocada para fora da caixa.
- Lacuna de teste: a matriz anterior desativava `content-visibility` antes da comparação agregada e verificava a caixa calculada do pseudo-elemento, não a área efetivamente pintada na rota real.
- Correção normativa: o corpo do `thematic-rail` é justificado; a autoria permanece à esquerda; aspas devem ficar inteiras dentro da área de pintura e opticamente centralizadas.
- Correção técnica: deslocar haste e pseudo-elemento para um inset interno comum, preservar a distância até o conteúdo, aplicar compensação vertical óptica e testar o artigo real com a otimização ativa.
- Preservação: `_site` compartilhado continua intocado como fonte; build e evidências posteriores usam destino isolado.

## Validação da segunda correção — 2026-09-18

- O build produtivo isolado foi refeito a partir da árvore corrente em `.tmp/ft076-blockquote-current-site`, com `TEMP` e `TMP` confinados ao repositório por insuficiência de espaço no temporário do sistema.
- A rota real `/p/devaneios/` foi inspecionada em desktop e em 390 px: a primeira citação e as subsequentes exibem o glifo duplo integralmente e com centralização óptica, inclusive sob `content-visibility: auto`.
- O corpo computado permanece `text-align: justify`; a autoria permanece `text-align: left` e em itálico.
- Os runtimes de citação e impressão, documentação e desempenho aprovaram contra o build isolado corrente; o teste de citação agora mede a tinta efetivamente rasterizada na rota real.
- A integração continua pendente de aceite visual humano; nenhuma TO-DO foi encerrada.
