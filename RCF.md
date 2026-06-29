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
- Em impressão, as seções `Referências` e `Bibliografia` devem permanecer expandidas.

## Implementação

- Kramdown permanece como biblioteca Markdown principal porque já suporta identificadores nomeados, numeração por primeira ocorrência e reordenação da lista final.
- Não há fork local em `./vendor/custom/` para Kramdown nesta etapa.
- `_plugins/jcem_footnotes.rb` executa somente a preparação local de `[^*]` antes do Kramdown.
- `assets/jcem/ts/site.ts` normaliza a ordem final e substitui backlinks de notas reutilizadas por links alfabéticos.
- `_sass/minimal-mistakes/skins/_variables-custom.scss` define a apresentação dos backlinks alfabéticos e a expansão em impressão.

## Validação

- `npm run check` deve incluir regressão específica para `[^*]`, pareamento de definições, preservação de blocos de código e comportamento Kramdown com referências reutilizadas.
- `npm run build:prod` deve confirmar integração Jekyll completa.
- Alterações visíveis em footnotes devem ser validadas em página renderizada com post que possua reutilização de nota.
