# JeanCarloEM Blog

Blog Jekyll com tema Minimal Mistakes e extensões customizadas em Liquid, SCSS e TypeScript.

## Build local

```bash
npm run check
npm run build:prod
```

No Ruby 4, os scripts npm usam `scripts/jekyll_local.rb` e `scripts/jekyll_compat.rb` para carregar dependências internas do Jekyll/Liquid que não são resolvidas por autoload nesse ambiente.

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

## Compactação HTML

Builds de produção executam `_plugins/jcem_html_compactor.rb` depois da escrita do site. O hook remove linhas vazias e margens de linha do HTML final, inclusive do `404.html`, mas preserva byte a byte o conteúdo interno de `script`, `style`, `pre`, `textarea` e `template`.

O mesmo hook sincroniza o conteúdo e os estilos noscript compilados da 404 com os fragmentos renderizados da home. O teste específico faz parte de `npm run check` e também pode ser executado com `npm run check:html`.

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

Com o recurso ativo, `assets/jcem/js/site.js` transforma cada `blockquote` dentro de `.page__content` em `div.jcem-panel.jcem-panel--futuristic`, preservando o conteúdo original.

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
