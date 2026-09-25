# Contexto mestre — FT-090 a FT-092

Estado: fases registradas; FT-090 apta à equalização após o commit exclusivo de inicialização; FT-091 e FT-092 bloqueadas por dependência e autorização. Fonte material: `TODO.ia.md` no commit `d6e48a9b90defd21b6ff07760b82cec1456c4362`.

## Objetivo

Evoluir COVER, OG e overlays para a proporção vertical vigente 4:5, com resolução determinística por namespace, composição segura, formatos adequados, metadados estruturados e otimização idempotente, sem regredir os modos atuais.

## Estado real inventariado

- `config/cover-system.json` governa COVER e mantém `1200x630` como razão visual larga; não contém catálogo de overlays.
- `config/social-images.json`, `scripts/generate-social-images.mjs`, `_plugins/jcem_social_images.rb` e `_data/jcem_social_images.json` formam o pipeline social atual; a variante ainda se chama `square` e usa `400x400`.
- `scripts/generate-social-images.mjs` já usa `sharp`, hash de fonte/parâmetros, manifesto e reutilização de saída válida, oferecendo infraestrutura para evitar otimização duplicada.
- `assets/images/overlays/bate-papo/primeiros-escritos/` contém variantes `2026.png` e `2026-wide.png`; `assets/images/overlays/modelo-prompt.md` é não rastreado e permanece propriedade concorrente do usuário, sem incorporação automática.
- RCFs, documentação, includes, plugins e testes existentes tratam COVER e imagens sociais, mas ainda não normatizam discovery/dominância de overlay nem a proporção vertical 4:5.

## Fases

1. FT-090 — equalização e normatização: consolidar vocabulário, precedências, resolução, formatos, metadados, safe areas, idempotência e falhas, sem código.
2. FT-091 — implementação e documentação: adaptar somente mecanismos existentes ou extensões oficiais após FT-090 e autorização humana nova.
3. FT-092 — integração e validação: cobrir casos unitários, ambiguidades, casos reais, metadados, cache e inspeção visual após FT-091 e autorização própria.

## Decisões e conflitos a resolver na norma

- O termo histórico `square` deve migrar para conceito de proporção vertical vigente sem quebrar leitura de dados legados durante a transição.
- A instrução de hard error em ambiguidade e a instrução posterior de “fail-safe como não falhar” são materialmente incompatíveis; a equalização deve preservar segurança e pedir decisão humana se o estado real não oferecer precedência inequívoca.
- Overlays são read-only para IA/Subagents; implementação pode ler e validar, nunca gerar, substituir ou editar esses binários sem pedido específico.
- O texto do TODO contém referências externas de ferramenta (`turn...`) não resolvíveis no repositório; elas não serão promovidas a requisito factual sem fonte determinística.

## Próxima retomada

Após autorização explícita do commit de inicialização, criar o commit exclusivo das FTs. Só então iniciar FT-090, atualizar RCFs aplicáveis e interromper novamente no gate normativo antes de FT-091.
