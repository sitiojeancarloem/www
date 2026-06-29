<!-- AI-PROCESSED -->
# RCF-JCEM-FOOTNOTES-001

Status: vigente.

Escopo: notas de rodapé, referências e bibliografia renderizadas por Jekyll/Kramdown no blog.

## Regras Normativas

- O formato preferencial de chamada de nota de rodapé é `[^id]`, com `id` alfanumérico único no documento.
- O identificador da nota nunca define a numeração exibida ao leitor.
- A numeração exibida é automática e determinada exclusivamente pela ordem da primeira ocorrência da chamada no documento.
- Reutilizações posteriores da mesma referência mantêm exatamente o mesmo número da primeira ocorrência.
- O marcador `[^*]` representa referência descartável e deve ser convertido antes do processamento Markdown principal para um identificador alfanumérico único.
- Definições descartáveis `[^*]:` são pareadas com chamadas descartáveis pela ordem de ocorrência.
- A lista final de definições deve aparecer em ordem numérica crescente, sem alterar as chamadas existentes no texto.
- Referências reutilizadas devem usar o padrão visual da Wikipédia: identificadores alfabéticos `a`, `b`, `c`, ... apontando para cada ocorrência da chamada no documento.
- O modelo de múltiplas setas de retorno não deve ser exibido ao leitor.
- Em impressão, as seções `Referências` e `Bibliografia` devem permanecer semanticamente expandidas com atributo `open` ativo.

## Implementação

- Kramdown permanece como biblioteca Markdown principal porque já suporta identificadores nomeados, numeração por primeira ocorrência e reordenação da lista final.
- Não há fork local em `./vendor/custom/` para Kramdown nesta etapa.
- `_plugins/jcem_footnotes.rb` executa somente a preparação local de `[^*]` antes do Kramdown.
- `assets/jcem/ts/site.ts` normaliza a ordem final, substitui backlinks de notas reutilizadas por links alfabéticos e força `open` em `Referências` e `Bibliografia` antes da impressão.
- `_sass/minimal-mistakes/skins/_variables-custom.scss` define a apresentação dos backlinks alfabéticos e mantém fallback visual de expansão em impressão.

## Validação

- `npm run check` deve incluir regressão específica para `[^*]`, pareamento de definições, preservação de blocos de código e comportamento Kramdown com referências reutilizadas.
- `npm run build:prod` deve confirmar integração Jekyll completa.
- Alterações visíveis em footnotes devem ser validadas em página renderizada com post que possua reutilização de nota.

<!-- AI-PROCESSED -->
# RCF-JCEM-PERFORMANCE-DEPENDENCIAS-001

Status: vigente.

Escopo: scripts, estilos, fontes, bibliotecas externas, assets de terceiros e recursos client-side carregados pelo blog.

## Regras Normativas

- Recurso externo não modificado deve ser carregado por CDN versionado quando existir CDN estável, pública e compatível com o build do projeto.
- Bibliotecas, estilos, fontes e assets de terceiros não devem ser versionados localmente quando forem idênticos ao pacote público e não houver exigência de segurança, privacidade, disponibilidade ou compatibilidade que justifique cópia local.
- Nenhum script, estilo, fonte ou asset externo deve ser carregado em páginas que não utilizam o recurso correspondente.
- Recursos client-side legados só podem permanecer quando necessários para comportamento vigente; o carregamento deve ser condicionado automaticamente por página, componente ou estado inferido pelo build.
- Dependências usadas somente no build, sem envio de JavaScript client-side ao navegador, podem permanecer em `package.json`, `Gemfile` ou ferramenta equivalente quando forem necessárias para gerar artefato estático.
- Includes, layouts e plugins devem priorizar inferência automática em vez de metadados manuais no front matter.
- Quando tecnicamente aplicável, recursos de CDN devem usar versão fixa, `integrity`, `crossorigin` e política de referência restritiva.
- Exceções à CDN exigem motivo técnico rastreável: modificação local do asset, indisponibilidade de CDN estável, licença incompatível, privacidade, segurança, necessidade offline, bloqueio de rede previsível ou ganho mensurável de performance com cópia local.

## Implementação

- O carregamento condicional deve ocorrer no menor ponto de composição possível, preferencialmente no include ou layout que conhece o estado real da página.
- Para matemática, `_plugins/jcem_math.rb` marca `page.jcem_math` durante o build; `_includes/head/custom.html` carrega KaTeX por CDN e o CSS local de controles apenas quando essa marca existir.
- JavaScript de varredura no navegador para decidir carregamento de bibliotecas deve ser evitado quando o build consegue inferir o uso com custo menor.
- Bibliotecas client-side amplas devem ser auditadas antes de qualquer inclusão global; ausência de uso na página implica ausência de carga.

## Validação

- `npm run check` deve permanecer sem regressões após alterações de dependências ou carregamento condicional.
- Build Jekyll deve confirmar que páginas sem o recurso não recebem o asset externo.
- Alterações que mudem carregamento visível ou interativo devem ser validadas em artefato renderizado.
