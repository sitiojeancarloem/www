# Especialização local do JCEM

Subordinada a `AGENTS.md`, microconceitos e RCF. Precedência: `AGENTS.md` → RCF → este arquivo → README → memória → demais. Conflito: `CONTRADIÇÃO DETECTADA: <origem> vs <regra> — Aplicando a regra de maior precedência.` Preservar a menor alteração compatível.

## Ambiente e escopo

- Stack: Jekyll, GitHub Pages/Actions, Minimal Mistakes, Gem, Sass e Node; compatibilidade obrigatória em build remoto, Windows e Linux.
- Não alterar core Jekyll/Minimal Mistakes, `_posts`, `_drafts` ou arquivo fora do escopo sem ordem explícita. Preferir CSS/Sass, TypeScript, layouts, includes e extensões; respeitar `.gitignore`, salvo regra superior ou referência explícita.
- Dependências, `package.json` e Gemfile devem manter compatibilidade GitHub Pages. JS novo prioriza TypeScript; componentes permanecem Liquid/HTML+SCSS. Vite não é adotado: usar `tsc` e JS estático até validação integral de vantagem, então atualizar esta especialização.

## Tema, navegação e carregamento

- Tema: CSS/Sass Custom Properties, seletor compacto e focável, Font Awesome já existente, contraste em claro/escuro, preferência persistida por JS redundante e default escuro. Ocultar visualmente `site-title` por CSS, sem remover HTML; preservar logo e estrutura.
- Menu: HTML/CSS/nativo é funcional; JS somente aprimora. Quando colapsável: ícone, um painel, backdrop de viewport com blur, conteúdo legível, fechamento externo e por item quando aplicável, `[ícone | rótulo]` alinhado. Não criar menu se links couberem integralmente.
- Sem sidebar. Retorno ao topo discreto, responsivo, clicável/tocável, só após rolagem e suave; CSS/Sass primeiro, TS se necessário.
- `carregandoPagina`: animação central e barra fixa superior de `0.5rem`, sincronizadas e leves; rastrear DOM/recursos quando viável, degradar sem falha, baseline 2018+, sem dependência externa. 404 tem fallback mínimo equivalente.
- Validar visualmente textos, bordas, ícones, componentes e contraste nos dois temas; comentar cores novas com uso curto.

## 404 e noscript

- `404.main.html` é fonte no root com `permalink: /404.html`; `404.html` é gerado. Compor masthead, noscript, subpostbar e footer por includes; saída usa `/assets/css/main.css`, sem CSS duplicado.
- 404: recursos locais mínimos para terminal/fallback, sem switch, busca, Silktide/consentimento, cookie/localStorage nem dependência equivalente; terminal escuro, compacto, responsivo, aparência Windows 11. Após loader, carregar até 6 recentes do JSON/feed próprio com DOM+`textContent`, sem HTML remoto, sem bloquear em falha e reutilizando cards.
- Não usar hidratação como substituto do build; fragmento importado somente quando funcionalmente necessário e sanitizado. Antes de validação local, reutilizar servidor existente e nunca encerrá-lo sem confirmação.
- Noscript de todas as páginas e 404 usa somente HTML/CSS, paridade estrutural/visual com origem, sem controles dependentes de JS, rolagem vertical, sem overflow e sem loader bloqueante. Fonte: `_includes/jcem/noscript-content.html`; imagem destacada usa wide e fundo `#010203`; validar home/404 com JS desativado.
- Redirect canônico executa antes do DOM, assíncrono e sem dependência: normalizar pathname por decode seguro, Unicode, lowercase, espaços, barras e remoção de `index|default|home|main` e extensões `html|htm|php|asp|aspx|jsp|cgi`; comparar diretórios do mapa, usar `replace`, preservar origem/query/hash e não alterar sem match.

## Conteúdo e publicação

- URLs: posts `/p/titulo`; taxonomias `/{inicial}/{nome}` (`/c/`, `/t/`), preservando rotas existentes/reservadas. Paginação curta, estável, indexável e sem `blog` redundante.
- `_scheduled/` guarda conteúdo aprovado por data futura, isolado de build/URL até elegível. Workflow `scheduled` diário às `00:01` executa verificar → preparar → compilar → atualizar → publicar; migração para público somente após deploy validado.
- Publicação de post, imediata ou agendada, só inicia distribuição externa após build, disponibilidade e validação. Facebook, Instagram e X são obrigatórios quando houver integração: avaliar solução open source madura antes de criar, workflow por plataforma, segredo isolado, estado persistente, retry/fallback limitado, encerramento registrado e encadeamento somente após estado final anterior.

## Editorial e estrutura renderizada

- Home e relacionados: máximo 6 cards, relacionados sem repetir atual. Recentes: até 6 via `/recent-posts.json` após loader; HTML inicial só título/contêiner, card reutilizado, DOM seguro, sem cookie/localStorage e falha não bloqueante. Grades sem overflow em 320px.
- `article_authors`: lista opcional; `name`+`bio` obrigatórios, `url`/`avatar` opcionais, inválido não renderiza, fallback local, primeiro em destaque, demais compactos e 3+ densos; semântica `Person`; não migrar post legado só para exibir bloco.
- Compactação HTML somente no artefato de produção, inclusive HTML copiado/404: remover vazios/margens comuns, preservar integralmente `script|style|pre|textarea|template`, quebras não vazias, JS/CSS/Base64 e teste sensível; não introduzir dependência sem vantagem.
- Formatação de post: conteúdo textual somente; parágrafo comum com `text-indent:4em` por CSS/Sass, exceto títulos/listas/tabelas/imagens/legendas/notas/blockquote/painéis. Corpo de citação não itálico; subcitação entre aspas pode ser; referência em linha própria inicia `—`, menor e com contexto ultrassintético seguro. Citação inline entre aspas é itálica; preservar itálico semântico. Footnote inline compacta e `sup` proporcional.
- Em arquivo textual autorizado, corrigir somente erro ortográfico, gramatical ou tipográfico no trecho alterado e declarar os arquivos/categoria ao final. Revisão preserva voz, vocabulário, ritmo, raciocínio, pontuação, pausas e retórica; prioridade: identidade, intenção, problema real, clareza.

## Estado, autoria e referências

- Memória canônica: `./.agents/continue.ia`, única, lida antes de operar e atualizada após alteração relevante. Registrar FT, plano, pendências, validações, ambiente, tentativas, resultado e próximo passo; reter concluído apenas se necessário à continuidade, sem duplicar norma superior.
- Mudança semântica editorial por IA recebe `<!-- AI-PROCESSED -->` na menor região; não para correção ortográfica/gramatical/tipográfica/link/metadado. Amostra de estilo: original não marcado → draft não marcado → publicado não marcado → correção mecânica → IA.
- Exceto reflexão, testemunho, opinião, narrativa ou poesia identificada, buscar fonte válida/rastreável para fatos, dados, estudos, técnica e citações. Texto técnico/sermão segue `Afirmação → referência imediata`; evitar fonte distante e alegação relevante sem fonte disponível.
- Footnotes e bibliografia usam mecanismo Jekyll/GitHub Pages/Markdown consolidado, sem implementação manual repetitiva; referências apontam à bibliografia ABNT quando aplicável, marcador discreto, ida/retorno exato, tooltip quando suportado e padrão visual Wikipédia.

## Atualização normativa

- Adaptadores locais declarados: `scripts/.agents/repo-tools.js` e `scripts/.agents/generate-agents-status.js`. Eles preservam o dispatcher filtrado e a projeção de estado do blog; `agents:update` não os sobrescreve nem remove. Mudança genérica nesses paths exige reconciliação explícita em FT.
