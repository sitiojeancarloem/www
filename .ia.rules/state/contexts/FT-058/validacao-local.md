# FT-060 — validação local da correção estrutural do COVER

Data: 2026-09-03

## Estado causal

- Norma: `eaf3a3059c` (`Normatiza geometria do COVER`).
- Implementação: `ecb4bd3ac0` (`Corrige geometria do COVER`).
- Rastreabilidade: 13 sentenças materiais finalizadas contra `ecb4bd3ac0`; mapa com 293 entradas, 286 materiais.

## Provas aprovadas

- Build Jekyll de desenvolvimento isolado em `tmp/site-cover-after`.
- Build Jekyll de produção isolado em `tmp/site-cover-prod`, inclusive HTML compactado.
- `npm run check`: TypeScript, HTML, notas, matemática, assets, autores, namespaces, citações, acessibilidade/TTS, impressão IEEE, performance estrutural, imagens sociais, assets editoriais, COVER, atribuições e estado de publicação.
- Runtime COVER: quatro modalidades legadas, seis modos estendidos, seis zonas de Hero, resize contínuo, orientação e DPR 2.
- Matriz COVER estrita: dez modalidades, sete viewports (`2560x1080`, `1920x1080`, `1366x768`, `900x700`, `720x768`, `390x844`, `320x720`) e temas claro/escuro, totalizando 140 combinações.
- Reproduções equivalentes às evidências 13–16: quatro páginas reais, desktop/mobile e claro/escuro no build produtivo, totalizando 16 combinações.
- Validação visual geral e impressão em `Devaneios`, claro/escuro e desktop.
- `git diff --check`, `npm run agent:rcf` e `rcf-trace validate` aprovados.
- O primeiro gate remoto de cache identificou, em `Devaneios` ultrawide escuro, recuos independentes entre título e tempo de leitura. A causa foi eliminada por um único token geométrico compartilhado, sem alterar tolerâncias.
- A reprodução focal `Devaneios` ultrawide em claro/escuro, `npm run check:performance`, `npm run check:covers` e a matriz oficial completa de `npm run validate:visual` aprovaram após a correção.
- O teste de retorno sólido da masthead passou a aguardar simultaneamente o estado semântico e a mudança de cor computada após a transição, mantendo a asserção visual estrita e eliminando a condição de corrida.

## Invariantes verificadas

- COVER comum: `left/right == article-zone`, `top == site-header.bottom`, `bottom == upper-title-bar.top` e razão `1200:630` com tolerância máxima de `0,51px` para geometria de subpixel.
- Triptych: centro colinear à zona do artigo; laterais ocupam a window-zone sem overflow horizontal.
- COVER, barras e flag não se intersectam; a base geométrica do triângulo coincide com o topo da barra superior.
- Título pertence exclusivamente à barra inferior; a barra superior mantém gradiente vertical e a inferior mantém fundo sólido contínuo.
- Modos externos ocupam a janela completa; modos `inner*` começam após o cabeçalho integral e terminam na borda inferior do viewport.
- Header externo permanece translúcido no topo e sólido após scroll; modos inner não recebem esse estado.

## Delimitações

- PageSpeed não foi executado: nenhuma prova direta revelou necessidade estrita, e a alteração foi coberta por geometria computada, runtime, build produtivo e regressão visual.
- O perfil visual geral, quando ampliado adicionalmente para `Sola Scriptura`, encontrou uma exigência editorial preexistente de referência normalizada em painel de citação. Markdown, semântica de citação e normalizador não foram alterados por FT-058–060; o gate agregado oficial permaneceu aprovado. O achado não foi mascarado nem incorporado ao escopo do COVER.
- `_site/` não foi usado como fonte nem incluído em staging; todos os builds foram isolados em `tmp/`.
