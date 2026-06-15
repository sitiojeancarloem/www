# JeanCarloEM Blog

Blog Jekyll com tema Minimal Mistakes e extensões customizadas em Liquid, SCSS e TypeScript.

## Build local

```bash
npm run check
npm run build:prod
```

No Ruby 4, os scripts npm usam `scripts/jekyll_local.rb` e `scripts/jekyll_compat.rb` para carregar dependências internas do Jekyll/Liquid que não são resolvidas por autoload nesse ambiente.

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
<div class="c-markdown-columns c-markdown-columns--2">

Conteúdo em Markdown.

Outro parágrafo preservado.

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

Notas de rodapé usam o formato Kramdown:

```markdown
Texto referenciado.[^1]

[^1]: Referência completa.
```

Quando `page.references` existir no front matter, o include `_includes/jcem/components/references.html` renderiza a seção em `<details>` automaticamente.

## Tabelas

Tabelas Markdown GFM são suportadas pelo Kramdown:

```markdown
| Coluna A | Coluna B |
| --- | --- |
| Valor A | Valor B |
```

Quando a tabela estiver dentro de blockquote ou em trecho sensível ao parser, usar HTML semântico evita exibição literal:

```html
<table>
<thead>
<tr><th>Coluna A</th><th>Coluna B</th></tr>
</thead>
<tbody>
<tr><td>Valor A</td><td>Valor B</td></tr>
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
