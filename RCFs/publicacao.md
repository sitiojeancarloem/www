<!-- AI-PROCESSED -->
# RCF-JCEM-PUBLICACAO-001

Status: vigente.

Escopo: publicação do site Jekyll no GitHub Pages, comandos locais, workflows remotos, publicações agendadas e distribuição externa posterior.

## Regras Normativas

- `main` é exclusivamente branch de desenvolvimento.
- Push em `main` não deve publicar o site, salvo quando contiver o arquivo de controle `publicar`.
- O branch de publicação é `gh-pages`, por alinhamento com a convenção histórica do GitHub Pages.
- `gh-pages` é artefato automatizado, temporário e exclusivo de publicação.
- `gh-pages` não deve receber desenvolvimento manual.
- Sempre que o deploy for validado, `gh-pages` deve ser removido do remoto.
- Toda publicação local deve ser iniciada por `npm run publish -- [commit]`.
- Quando o commit for informado, a publicação deve usar exatamente o estado desse commit.
- Quando o commit não for informado em execução local, a publicação deve usar a árvore de trabalho atual, incluindo alterações não commitadas e arquivos não ignorados.
- Quando a publicação remota não receber commit explícito, o workflow deve usar o commit selecionado pela execução remota.
- A publicação pela interface Web usa o arquivo raiz `publicar`, contendo o hash do commit a publicar.
- O arquivo `publicar` deve ser removido automaticamente por commit após publicação validada.
- Builds, deploys e validações de disponibilidade devem terminar com sucesso antes de qualquer distribuição externa.
- A validação visual claro/escuro do workflow de publicação DEVE ser bloqueante, usar modo estrito e possuir orçamento mínimo de 420 segundos enquanto a matriz integral medida exceder 180 segundos; timeout ou falha DEVE impedir deploy e distribuição externa.
- Publicações agendadas devem gerar `gh-pages` antes do build público e só migrar `_scheduled` para `_posts` após deploy validado.
- Cache do GitHub Actions, cache incremental do Jekyll, `_site` cacheado, manifestos de coesão e builds incrementais são requisitos arquiteturais permanentes.
- A remoção temporária de `gh-pages` não pode eliminar a reutilização de cache; `.jekyll-cache/jcem-source-state.json` deve preservar o estado necessário para comparação quando não houver base Git anterior.

## Implementação

- `scripts/publish.rb` cria uma cópia temporária da origem, gera um commit novo para `gh-pages`, substitui o branch remoto com `--force-with-lease` e remove referência local de publicação quando existir com segurança.
- `scripts/publish.ps1` e `scripts/publish.sh` são apenas wrappers do comando NPM.
- `.github/workflows/jekyll.yml` aceita push em `gh-pages`, `workflow_dispatch` e push em `main` com `publicar`.
- Push em `gh-pages` deve apenas reencaminhar a publicação para uma execução `workflow_dispatch` em `main`, porque o ambiente `github-pages` pode restringir deploys por branch.
- Push em `main` sem `publicar` deve atualizar o cache coeso de `_site` no escopo de `main`, sem upload de artefato Pages e sem deploy.
- O commit automático que remove `publicar` em `main` deve acionar o mesmo caminho de atualização de cache, sem marcador `[skip ci]`.
- Publicações iniciadas por `workflow_dispatch` ou `publicar` criam `gh-pages` e continuam build/deploy no mesmo workflow, sem depender de novo evento de push.
- `scripts/jekyll_build_scope.rb` decide entre build completo e incremental por diff Git quando disponível, ou por estado de fonte cacheado quando o branch temporário foi recriado.
- `scripts/jekyll_build_manifest.rb` grava manifesto de `_site`, estado de build e estado de fonte para preservar coesão entre cache, commit e artefato publicado.
- `.github/workflows/scheduled.yml` prepara posts agendados, gera `gh-pages`, publica o artefato e só depois persiste a migração para `_posts`.

## Validação

- `ruby -c scripts/publish.rb` deve validar a sintaxe do comando de publicação.
- `ruby -c scripts/jekyll_build_scope.rb` e `ruby -c scripts/jekyll_build_manifest.rb` devem validar os scripts de escopo e manifesto.
- Alterações de workflow devem passar por parse YAML local.
- `npm run check` deve permanecer obrigatório para regressões do projeto.
- `npm run build:prod` deve confirmar integração Jekyll quando `_site` não estiver bloqueado; caso contrário, usar destino temporário em `tmp/`.

