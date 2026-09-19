# Leitura acessível, TTS e gráficos — modo de uso

Este guia é o contrato físico de autoria subordinado ao `RCF-JCEM-LEITURA-ACESSIVEL-TTS-001`. O texto editorial continua em Markdown/Kramdown; os recursos abaixo só acrescentam semântica comprovável.

## Conteúdo comum

- Use headings em ordem, listas nativas, links com texto suficiente e citações reais em `>`.
- Toda imagem informativa precisa de alternativa breve: `![Função ou informação essencial.](/caminho/imagem.svg)`.
- Imagem estritamente decorativa usa alternativa vazia e declaração explícita: `![](/caminho/textura.svg){: data-jcem-decorative="true" role="presentation"}`.
- Trecho em outro idioma usa BCP 47: `<span lang="en">Web Speech API</span>`; grego antigo ou koiné editorialmente confirmado usa `<span lang="grc">λόγος</span>`.
- Não crie transliteração ou pronúncia por semelhança. A ausência de voz instalada preserva a grafia e o `lang`.

## Tabelas

Tabela de dados deve ter `caption` e cabeçalhos reais. O normalizador acrescenta `scope` de coluna/linha, mas não inventa caption ou converte células editoriais.

```html
<table>
<caption>Valores por período</caption>
<thead><tr><th>Período</th><th>Total</th></tr></thead>
<tbody><tr><th>Janeiro</th><td>12</td></tr></tbody>
</table>
```

Quando o caption não deve mudar a composição visual legada, use `class="visually-hidden"`. Tabela apenas de layout deve declarar `role="presentation"` e não recebe semântica de dados.

## Referências e fala local

Links Kramdown de footnote são associados à definição no build. Para referências bíblicas cuja versão e passagem aparecem junto da ocorrência, o normalizador seleciona a parcela exata e o leitor interpreta sua estrutura globalmente. No modo curto, `Isaías 53:10 NVI` é falado como `Isaías, 53, 10, NVI`; no modo longo, como `Isaías, capítulo 53, versículo 10, NVI`. Intervalos, listas e mudanças de capítulo preservam seus conectivos e pausas; `:` nunca é falado como `para`. Quando a parcela exata não é demonstrável, o sistema preserva a definição integral em vez de inventar uma redução.

Uma forma falada excepcional exige todos os metadados abaixo na própria ocorrência:

```html
<span lang="grc"
      data-jcem-spoken-form="forma revisada"
      data-jcem-spoken-purpose="pronúncia"
      data-jcem-spoken-source="léxico ou revisão identificável"
      data-jcem-spoken-review="aprovado por nome/data">γραφία</span>
```

Campo vazio, órfão ou sem revisão falha no build. A forma falada não substitui a grafia visual.

## Sumário automático e modos TTS

Defina `toc: true` no front matter para gerar o sumário exclusivamente no build. Não escreva nem replique o sumário no Markdown: o componente é inserido depois do primeiro parágrafo real, ignora citações iniciais, inicia retraído e não aparece na impressão.

O modo contínuo lê o texto sem interrompê-lo por marcadores e informa a quantidade de referências ao fim de cada unidade. O resumido e o completo anunciam cada entrada como `Referência N:`; somente o completo inclui o sumário na sequência falada. O conteúdo e os links das notas continuam disponíveis em todos os modos.

## Gráfico runtime

O dataset canônico fica em JSON ou CSV versionado. Para JSON, são obrigatórios `id`, `type`, `title`, `summary`, `conclusion`, `labels` e ao menos uma série com `label` e `data`; `source` e `color` são opcionais. As cardinalidades devem coincidir e os valores devem ser numéricos finitos.

```liquid
{% raw %}{% jcem_chart assets/data/charts/meu-grafico.json %}{% endraw %}
```

O mesmo dataset gera síntese, conclusão, tabela estática e configuração visual. O canvas fica fora da árvore acessível. Chart.js `4.5.1+` é a decisão normativa; a versão efetiva `4.5.1` está fixada no `package.json`/lock e copiada localmente por `npm run assets:chartjs`. Os assets do renderer e do adaptador só aparecem na página que contém a tag válida.

## Validação

```powershell
npm run check:accessibility
npm run build:prod
npm run validate:visual
```

Após o build, `_site/assets/jcem/accessibility-manifest.json` registra capacidades e assets por página sem copiar o texto editorial. O teste automatizado não substitui a escuta humana de pronúncia e prosódia.
