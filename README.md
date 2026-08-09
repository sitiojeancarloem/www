# JeanCarloEM Blog

Blog Jekyll com tema Minimal Mistakes e extensões customizadas em Liquid, SCSS e TypeScript.

## Build local

```bash
npm run check
npm run build:prod
```

No Ruby 4, os scripts npm usam `scripts/jekyll_local.rb` e `scripts/jekyll_compat.rb` para carregar dependências internas do Jekyll/Liquid que não são resolvidas por autoload nesse ambiente.

## Publicação

<!-- AI-PROCESSED -->
`main` é branch de desenvolvimento. Publicação ocorre pelo branch temporário `gh-pages`, gerado automaticamente:

```bash
npm run publish
npm run publish -- <commit>
```

Sem commit explícito, a execução local publica a árvore de trabalho atual. Com commit explícito, publica exatamente aquele commit.

Pela interface Web do GitHub, crie o arquivo raiz `publicar` contendo apenas o hash do commit. O workflow valida o hash, gera `gh-pages`, publica o site, valida os posts publicados, remove `gh-pages` e apaga `publicar` por commit automático. O commit de remoção atualiza o cache de `main`, sem novo deploy.

Push comum em `main`, sem `publicar`, não publica o site; apenas atualiza o cache coeso de `_site` usado pelas próximas execuções.

Quando `gh-pages` receber push direto, o workflow reencaminha a publicação para uma execução em `main`, mantendo compatibilidade com regras do ambiente `github-pages` que restringem branches de deploy.

## Equações LaTeX

<!-- AI-PROCESSED -->
Equações são detectadas automaticamente durante o build. Não é necessário declarar `math: true` ou qualquer outro metadado no front matter.

Formatos suportados:

```markdown
Texto inline com \(a^2 + b^2 = c^2\).

\[a^2 + b^2 = c^2\]

$$
E = mc^2
$$

\begin{equation}
qLinhas = r^p
\end{equation}
```

Shortcodes legados `[latex]...[/latex]` e o marcador `[latexpage]` também são tratados pelo build para compatibilidade com conteúdo importado.

O build usa KaTeX em server-side rendering por `_plugins/jcem_math.rb` e `scripts/render_math.mjs`. O HTML da fórmula fica pronto no artefato final; o navegador não executa KaTeX nem MathJax. O CSS público do KaTeX e suas fontes são carregados por CDN versionado somente em páginas nas quais o plugin detecta fórmulas. O CSS local `assets/jcem/css/math.css` contém apenas os controles e ajustes próprios do projeto.

Fórmulas em bloco recebem controles visuais com Font Awesome para ampliar a largura e abrir em tela cheia quando o navegador oferece suporte. Sem JavaScript, a fórmula permanece renderizada e rolável horizontalmente.

## Imagem destacada

Posts podem declarar imagem destacada no front matter:

```yaml
featured_image:
  path: /assets/images/post/imagem.jpg
  alt: Descrição da imagem
featured_image_style: content
```

Valores suportados:

- `content`: imagem dentro do cabeçalho do artigo.
- `wide`: imagem destacada ampla, acima do artigo.
- vazio/ausente: usa o comportamento padrão do tema, sem forçar `wide`.

Aliases aceitos: `inline` equivale a `content`; `full`, `full-width` e `bleed` equivalem a `wide`.

## Carregamento inicial

<!-- AI-PROCESSED -->
O loader inicial bloqueia apenas recursos essenciais: HTML, CSS, JavaScript de inicialização e dependências leves. Imagens, backgrounds, mídias e fontes opcionais continuam carregando de forma progressiva depois que a página é liberada.

Componentes elegíveis com assets potencialmente lentos usam skeleton loading em CSS puro. Cards, thumbnails e imagens destacadas já recebem a marcação automaticamente; componentes futuros podem optar pelo mesmo comportamento com `data-jcem-skeleton`.

### Metadados de assets

<!-- AI-PROCESSED -->
Durante o build, `_plugins/jcem_asset_metadata.rb` gera metadados opcionais para imagens públicas e publica o índice consolidado em `assets/jcem/asset-metadata.json`. O cache incremental fica em `.jekyll-cache/jcem-asset-metadata.json`.

Quando disponíveis, esses dados são usados para emitir `width`, `height` e proporção em imagens destacadas, cards e posts recentes. Imagens externas sem arquivo local devem declarar metadados em `_data/jcem_asset_metadata.yml`, preservando a reserva exata de espaço desde o HTML inicial. Sem o índice, a página continua funcional; o skeleton apenas usa a reserva genérica definida por CSS.

## Autores de artigos

O bloco de autoria só é renderizado quando o post declara pelo menos uma entrada válida em `article_authors`. A ordem da lista define o autor principal e os coautores:

```yaml
article_authors:
  - name: Jean Carlo EM
    bio: Cientista da Computação e autor do artigo.
    url: https://www.jeancarloem.com
    avatar: /assets/jcem/img/jeancarlo-avatar.png
  - name: Nome do coautor
    bio: Formação ou contexto profissional relevante.
```

`name` e `bio` são obrigatórios. `url` e `avatar` são opcionais. Sem avatar, o componente usa `assets/jcem/img/author-placeholder.svg`. Entradas incompletas são ignoradas; sem autor válido, nenhum espaço é reservado ao final do artigo.

O primeiro autor recebe o painel principal. Autores seguintes usam composição compacta; com três ou mais autores, os coautores passam para uma grade responsiva mais densa.

## Mapa HTML do site

<!-- AI-PROCESSED -->
`/mapa/` é a versão HTML indexável do sitemap do blog. A página é gerada automaticamente por `_plugins/jcem_site_map.rb`, usa o layout `_layouts/mapa.html` e lista navegação principal, taxonomias e artigos publicados sem imagens.

Configuração global:

```yaml
jcem:
  mapa:
    path: /mapa/
    posts_per_page: 50
```

Cada item de artigo exibe somente título, excerto e link. A paginação usa `posts_per_page` e cria rotas como `/mapa/2/` quando o volume de posts excede o limite configurado.

## Compactação HTML

Builds de produção executam `_plugins/jcem_html_compactor.rb` depois da escrita do site. O hook remove linhas vazias e margens de linha do HTML final, inclusive do `404.html` gerado, mas preserva byte a byte o conteúdo interno de `script`, `style`, `pre`, `textarea` e `template`.

`404.html` não é fonte editável. A página 404 é mantida em `404.main.html`, que usa `permalink: /404.html` e compõe masthead, `noscript`, subpostbar e footer por includes compartilhadas. `npm run check:html` falha se `404.html` voltar a existir como fonte editável ou se `404.main.html` deixar de usar as fontes compartilhadas.

## Blockquotes

Por padrão, `blockquote` em posts é convertido para painel futurista.

Configuração global:

```yaml
jcem:
  blockquote_panels: true
```

Para desativar:

```yaml
jcem:
  blockquote_panels: false
```

Override por post:

```yaml
blockquote_panels: false
```

ou:

```yaml
jcem:
  blockquote_panels: false
```

Com o recurso ativo, `assets/jcem/js/site.js` transforma cada `blockquote` normalizado dentro de `.page__content` em `div.jcem-panel.jcem-panel--futuristic`, preservando conteúdo, atributos e semântica acessível.

O contrato por ocorrência do `RCF-JCEM-CITACOES-001` está implementado. Um bloco pode selecionar `standard`, `futuristic` ou outro modelo registrado por Kramdown IAL:

```markdown
> Conteúdo citado.
{: data-jcem-quote-model="futuristic"}
```

A configuração da ocorrência prevalece sobre contexto, post e configuração global. O mesmo identificador seleciona estilos simples ou modelos que alterem a estrutura, sem uma segunda sintaxe; identificador desconhecido falha no build controlado.

Citação inline em texto comum usa pares de aspas retas ou tipográficas e recebe marcação semântica sem perder os delimitadores. Backticks continuam significando código; quando representarem citação, devem receber marcação explícita:

```markdown
`conteúdo citado`{: .jcem-inline-quote}
```

O formatador exclui links, ênfase, código, notas e referências, preserva apóstrofos e aspas sem par e marca citações dentro de bloco ou citação externa como subcitações. A subcitação usa fundo contextual por tema e borda dupla também na impressão, para não depender somente de cor.

## Impressão editorial IEEE

Posts completos carregam sob demanda a biblioteca agnóstica `@jcem/print-ieee`, localizada em `src/jcem-print-ieee`; home, mapas, arquivos, 404 e listagens não carregam seus recursos. A importação não produz efeito colateral, e o estado automático máximo é `nativo-preparado`.

Tela e impressão possuem contratos de apresentação isolados, obrigatórios também para recursos futuros e componentes de terceiros. A impressão reutiliza somente conteúdo e marcadores semânticos declarados, neutraliza tipografia, títulos, recuos, bordas, fundos, sombras, pseudo-elementos e estruturas decorativas da web e então aplica o perfil impresso. Componentes exclusivos de impressão permanecem ocultos em tela. `blockquote` usa exclusivamente o estilo IEEE por padrão; exceção precisa de autorização expressa, aplicação seletiva e registro no ponto único de exceções do `RCF-JCEM-IMPRESSAO-IEEE-001`.

O perfil versionado `ieee-conference-a4-ieeetran-1.8b` usa A4 a 100%, duas colunas e Noto Sans. Ele referencia o IEEEtran 1.8b externo sob LPPL-1.3c sem redistribuí-lo; a biblioteca, o pacote e os artefatos próprios usam MPL-2.0. O relatório aferido inicial está em `src/jcem-print-ieee/reports/2026-08-09-devaneios-chromium-148.json`.

Build, teste e inspeção do pacote:

```bash
npm run build:print
npm run check:print
npm pack --dry-run --json ./src/jcem-print-ieee
```

## Colunas Markdown

Use HTML com classes do projeto para blocos em múltiplas colunas:

```html
<div class="c-markdown-columns c-markdown-columns--2" markdown="1">
	Conteúdo em Markdown. Outro parágrafo preservado.
</div>
```

Classes disponíveis:

- `c-markdown-columns` ou `jcem-markdown-columns`
- `c-markdown-columns--2`
- `c-markdown-columns--3`

Em telas estreitas e impressão, as colunas são reduzidas para uma coluna.

## Seções Recolhíveis

Seções recolhíveis usam `<details>`:

```html
<details class="c-collapsible jcem-collapsible">
	<summary>Título</summary>

	Conteúdo em Markdown ou HTML.
</details>
```

O ícone de expandir/recolher é aplicado por CSS com Font Awesome.

## Referências e Bibliografia

Títulos `## Bibliografia` e `## Referências` são recolhidos automaticamente no carregamento da página.

<!-- AI-PROCESSED -->
Na impressão, essas seções são abertas automaticamente.

Notas de rodapé usam preferencialmente identificadores alfanuméricos Kramdown:

```markdown
Texto referenciado.[^fonteA]
Outro trecho com a mesma fonte.[^fonteA]

[^fonteA]: Referência completa.
```

A numeração exibida é automática e segue a ordem da primeira ocorrência no documento; o identificador não define o número. Para referência descartável, use `[^*]` com definição `[^*]:`; o build converte cada ocorrência para um identificador único antes do Kramdown.

Quando `page.references` existir no front matter, o include `_includes/jcem/components/references.html` renderiza a seção em `<details>` automaticamente.

## Tabelas

Tabelas Markdown GFM são suportadas pelo Kramdown:

```markdown
| Coluna A | Coluna B |
| -------- | -------- |
| Valor A  | Valor B  |
```

Quando a tabela estiver dentro de blockquote ou em trecho sensível ao parser, usar HTML semântico evita exibição literal:

```html
<table>
	<thead>
		<tr>
			<th>Coluna A</th>
			<th>Coluna B</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Valor A</td>
			<td>Valor B</td>
		</tr>
	</tbody>
</table>
```

## Validação visual

Instalação do Chromium do Playwright com CDN oficial direto:

```bash
npm run playwright:install
```

Mirror ESRP oficial exposto pelo pacote Playwright:

```bash
npm run playwright:install:esrp
```

Se o download do browser gerenciado falhar, `scripts/validate-visual.js` tenta usar Chrome/Edge instalado localmente. Caminhos customizados podem ser informados por `PLAYWRIGHT_CHROMIUM_EXECUTABLE`, `CHROME_EXECUTABLE` ou `EDGE_EXECUTABLE`.

Validação:

```bash
npm run validate:visual
```

## Autoria

Jean Carlo EM — https://www.jeancarloem.com

## Repositório

https://github.com/sitiojeancarloem/blog

## Licença

Mozilla Public License 2.0 — https://mozilla.org/MPL/2.0/
