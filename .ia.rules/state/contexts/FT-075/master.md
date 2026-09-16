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
