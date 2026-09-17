# FT-077 — Correção inter páginas do isolamento de impressão

- Origem: solicitação humana no Codex e falha do workflow GitHub Actions.
- Data: 2026-09-16.
- Estado: incorporada na FT-077.
- RCF de destino: `RCFs/impressao-ieee.md`.
- Frente relacionada: TO-DO de impressão IEEE, ainda em avaliação humana.

## Solicitação integral

> Corrija:
>
> ```text
> Run ruby scripts/ci_timed_step.rb "Validate light and dark visuals" 420 -- npm run validate:visual
> [ci-time] 2026-09-17T02:32:20Z START stage="Validate light and dark visuals" timeout=420s
>
> > blog@1.0.0 validate:visual
> > node scripts/validate-visual.js
>
> Error: Impressao exibe elementos decorativos ou controles em http://127.0.0.1:40607/p/devaneios/
>     at fail (file:///home/runner/work/www/www/scripts/validate-visual.js:93:8)
>     at validatePrintTheme (file:///home/runner/work/www/www/scripts/validate-visual.js:2883:3)
>     at async file:///home/runner/work/www/www/scripts/validate-visual.js:4173:5
> node:internal/modules/run_main:107
>     triggerUncaughtException(
>     ^
>
> Error: Impressao exibe elementos decorativos ou controles em http://127.0.0.1:40607/p/devaneios/
>     at fail (file:///home/runner/work/www/www/scripts/validate-visual.js:93:8)
>     at validatePrintTheme (file:///home/runner/work/www/www/scripts/validate-visual.js:2883:3)
>     at async file:///home/runner/work/www/www/scripts/validate-visual.js:4173:5
>
> Node.js v24.20.0
> [ci-time] 2026-09-17T02:34:40Z END stage="Validate light and dark visuals" duration=139.3s status=1
> Error: Process completed with exit code 1.
> ```

## Complementação de escopo e autorização

> Autorizo expressamente a concluir a correção completamente, não apenas para esta página, mas de forma inter páginas.

## Decomposição vinculante

- Identificar qual elemento do conjunto auditado continua visível em impressão e registrar diagnóstico acionável no teste.
- Corrigir a causa na camada compartilhada de impressão; seletor específico de `/p/devaneios/` ou hardcode de rota é proibido.
- Validar artigos com composições distintas e páginas sem artigo, em desktop e mobile, preservando a impressão natural fora do contrato IEEE.
- Manter o carregamento pós-crítico, o conteúdo acadêmico, os modelos web, COVER/Hero e demais capacidades existentes.
- A TO-DO permanece em avaliação humana mesmo depois da correção técnica.
