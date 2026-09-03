# FT-058 a FT-060 - correção estrutural do COVER

- Fonte: `.ia.rules/state/requests/FT-058/prompt.md` (SHA-256 `E2F8281827A814BB75856352B82B5E3C2AFA88EDB10D3B6A463A6DDCAED96F83`).
- Evidência normativa: `.ia.rules/state/requests/evidencias/projeto-cover.pdf` (SHA-256 `05E30E9959AC095867A4096C1BADDC387037CEFFFB194E7342905FA5494FA8CB`).
- Evidências negativas: `evidencia13.png`, `evidencia14.png`, `evidencia15.png` e `evidencia16.png`, já versionadas no commit `b1a2e70e39`.
- Objetivo global: restaurar a geometria estrutural entre masthead, COVER, flag e duas barras, sem regressar modalidades comuns, infinite, viewport, inner, Hero, temas, impressão ou acessibilidade.
- Ordem: FT-058 normatização; FT-059 implementação; FT-060 integração, validação, publicação e convergência.
- Causa preliminar a comprovar no runtime: o modo comum usa stage de altura independente com mídia `object-fit: contain`, enquanto o deck é separado por margem e a flag é deslocada negativamente na mesma barra que recebeu o título.
- Restrições: nenhum remendo por pixels de captura; nenhuma alteração editorial; `_site/` preexistente permanece excluído; PageSpeed somente diante de necessidade estrita.
- Aceite global: invariantes geométricas com tolerância de subpixel, inspeção de CSS calculado, matriz visual real equivalente às evidências 13-16 e preservação integral de todos os modos/aliases.
