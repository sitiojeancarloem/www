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
- Toda chamada ordinária renderizada DEVE possuir no próprio DOM a gramática textual `<sup>[N]</sup>`, com identificador numérico automático preservado; colchetes NÃO PODEM depender de pseudo-elemento, chamada sem colchetes é proibida e ocorrências contíguas DEVEM permanecer semanticamente distintas como `[4][5][6]`. [PENDENTE-CODIGO]
- A chamada de footnote já renderizada é uma referência semântica final: preparação, lista de URLs ou transformação de impressão NÃO DEVE reprocessá-la, renumerá-la, duplicá-la nem inserir outro `<sup>` em seu interior; número, ordem, `href`, `id`, destino e backlinks DEVEM permanecer em correspondência 1:1. [PENDENTE-CODIGO]
- Em tela e impressão, a caixa de um `<sup>` editorial NÃO DEVE alterar o ritmo vertical do bloco textual; o sobrescrito DEVE permanecer legível, elevado e sem clipping ou colisão, enquanto a altura de linha continua determinada pelo bloco, inclusive em chamadas isoladas, consecutivas e usos semânticos não ligados a footnotes. [PENDENTE-CODIGO]

## Implementação

- Kramdown permanece como biblioteca Markdown principal porque já suporta identificadores nomeados, numeração por primeira ocorrência e reordenação da lista final.
- Não há fork local em `./vendor/custom/` para Kramdown nesta etapa.
- `_plugins/jcem_footnotes.rb` executa somente a preparação local de `[^*]` antes do Kramdown.
- `_plugins/jcem_zz_accessible_reading.rb` consolida a gramática textual das chamadas ordinárias no HTML final, em conjunto com sua semântica acessível.
- `assets/jcem/ts/site.ts` normaliza a ordem final, substitui backlinks de notas reutilizadas por links alfabéticos e força `open` em `Referências` e `Bibliografia` antes da impressão.
- `_sass/minimal-mistakes/skins/_variables-custom.scss` apresenta o marcador já materializado sem fabricar colchetes e define os backlinks alfabéticos, mantendo fallback visual de expansão em impressão.

## Validação

- `npm run check` deve incluir regressão específica para `[^*]`, pareamento de definições, preservação de blocos de código e comportamento Kramdown com referências reutilizadas.
- `npm run build:prod` deve confirmar integração Jekyll completa.
- Alterações visíveis em footnotes devem ser validadas em página renderizada com post que possua reutilização de nota.
