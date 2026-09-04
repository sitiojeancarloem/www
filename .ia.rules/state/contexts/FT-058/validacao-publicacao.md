# FT-060 — validação da publicação do COVER

Data: 2026-09-04

## Estado publicado

- Commit-fonte: `5a5736fdbb29cdca00432c0ad1593f9c50bc66ed`.
- Artefato temporário: `31f45e5f2376dcb1f0865d08a1c90e8fc0fd9747`.
- Gate de cache de `main`: workflow `33833548278`, aprovado integralmente.
- Publicação: workflow `33834178087`, aprovado integralmente.
- Jobs de publicação: `prepare`, `jekyll`, `deploy` e `cleanup` aprovados; `pagespeed` corretamente ignorado por não ter sido solicitado.
- `gh-pages` remoto ausente após o cleanup.
- `dev`, `main`, `origin/dev` e `origin/main` convergentes no commit-fonte antes deste fechamento operacional.

## Provas remotas

- A instalação fria de Node concluiu em 179–181 segundos com orçamento de 240 segundos; o comando permaneceu `npm ci`.
- Build Jekyll, matriz visual claro/escuro estrita, caminhos de raiz, upload do artefato e deploy GitHub Pages concluíram com sucesso.
- `https://www.jeancarloem.com/p/devaneios/` e `https://www.jeancarloem.com/p/sola-scriptura/` responderam HTTP 200.
- O HTML servido manteve duas barras distintas, título descendente exclusivo da barra inferior e COVER comum com `jcem-featured-image--content` e stage `1200 / 630`.

## Equalizer e isolamento

- Nova varredura de `TODO.ia.md` encontrou somente o Equalizer perene, literal e desmarcado.
- `_site/` permaneceu fora de staging, commits e push; builds e artefatos locais ficaram em `tmp/`.
