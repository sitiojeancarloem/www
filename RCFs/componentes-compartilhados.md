<!-- AI-PROCESSED -->
# RCF-JCEM-COMPONENTES-COMPARTILHADOS-001

Status: vigente.

Escopo: cabeçalho, masthead, `noscript`, rodapé, subpostbar, menus compartilhados, avisos institucionais e páginas especiais do tema.

## Regras Normativas

- A masthead de página especial DEVE preservar a mesma extrapolação visual do logotipo usada nas páginas comuns. Quando a composição especial inserir a masthead em ancestral com contenção horizontal, a exceção DEVE limitar-se a liberar o overflow vertical da masthead e de seus ancestrais imediatos, sem alterar largura, navegação, clipping horizontal ou geometria compartilhada. [de992a9]
- Tabelas editoriais em tela DEVEM derivar fundo, texto, cabeçalho, faixas alternadas e bordas dos tokens do tema ativo. No modo escuro, nenhum valor legado claro, inline ou herdado PODE produzir superfície luminosa, texto ilegível ou contraste incoerente; a correção NÃO PODE alterar a paleta válida do modo claro nem tabelas de apresentação internas a componentes. [de992a9]
- Flag de data sobreposta a card DEVE permanecer fora do clipping do teaser e integralmente visível acima da borda superior. Otimização de pintura, contenção, skeleton, stacking context ou ancestral do card NÃO PODE recortar a parcela sobreposta nem cobri-la; a ancoragem continua pertencendo ao card e não altera sua geometria interna. [54a9a7d]
- Cabeçalho editorial de artigo DEVE usar uma única estrutura compartilhada para título, duas barras e flag, independentemente do modo de COVER; modalidade visual só PODE alterar tokens ou posicionamento previstos, nunca duplicar o conjunto. [PENDENTE-CODIGO]
- A barra inferior DEVE ser sólida; a barra superior DEVE transicionar de RGBA translúcido para opaco em sua extensão e conservar uma borda superior visível. Ambas DEVEM respeitar a largura útil do cabeçalho e permanecer alinhadas em claro, escuro, mobile e desktop. [PENDENTE-CODIGO]
- A flag DEVE permanecer acima da COVER e alinhada ao conjunto de barras, com dobra triangular íntegra, sem corte, gap, sobreposição indevida ou clipping por stage, wrapper, pattern, Hero ou viewport. [PENDENTE-CODIGO]
- Masthead translúcida sobre COVER externa DEVE reutilizar a estrutura compartilhada, manter conteúdo e controles legíveis e tornar-se sólida após scroll; páginas sem COVER externa e modos `inner*` preservam o comportamento vigente. [PENDENTE-CODIGO]

- Componentes estruturais compartilhados devem possuir uma única fonte editável. [860dfdf]
- O controle claro/escuro DEVE conservar aparência, teclado e semântica, e clique ou toque em qualquer ponto de seu contêiner interativo DEVE alternar para o tema oposto; os ícones internos não podem constituir a única área acionável. [860dfdf]
- A troca de tema DEVE preservar contraste suficiente durante todo o estado transitório; propriedades cuja interpolação atravesse cor ilegível DEVEM mudar atomicamente ou usar uma trajetória comprovadamente acessível. [1898b7b]
- Controles internos de tema, paginação, compartilhamento e links de taxonomia DEVEM conservar nome acessível, ordem de títulos e alvo mínimo de toque; ocultação visual não autoriza remover rótulo semântico. [99ebadb]
- Link apresentado como botão, inclusive paginação anterior, numérica e próxima, NÃO DEVE exibir glifo ou indicador visual automático de hyperlink. [81772fa]
- Grade de cards DEVE usar no máximo três colunas em qualquer viewport. A data de publicação/modificação DEVE existir exclusivamente na flag; metadado redundante abaixo do título é proibido. Flag e tipografia DEVEM escalar juntas, permanecer legíveis, sem crop, e sua base lateral DEVE ancorar na borda do card/thumbnail. Estado visitado em tema escuro DEVE continuar distinguível com contraste legível. [81772fa]
- O botão de menu adjacente ao controle de tema DEVE usar o ícone Font Awesome `bars` de código `f0c9`, sem alterar iconizações não relacionadas. [860dfdf]
- Agrupamento e desagrupamento responsivo de navegação DEVEM preservar todos os links e controles, funcionar com redimensionamento e orientação e degradar sem JavaScript. [860dfdf]
- Cópias manuais de cabeçalho, masthead, `noscript`, rodapé, subpostbar, menus compartilhados e avisos institucionais são proibidas. [860dfdf]
- Variações por contexto devem ser implementadas por composição Liquid, includes parametrizadas, slots, placeholders ou mecanismo equivalente de build. [860dfdf]
- Diferenças de páginas especiais, como `404` e `noscript`, podem omitir recursos não aplicáveis, mas não podem duplicar estrutura, conteúdo comum ou identidade visual. [860dfdf]
- `404.html` é artefato gerado e não deve existir como fonte editável no repositório. [860dfdf]
- A fonte editável da página 404 é `404.main.html`, transpilada pelo Jekyll para `/404.html` por `permalink`.
- Alteração em componente compartilhado deve refletir automaticamente em páginas normais, `noscript` e 404 durante o build. [860dfdf]
- Hidratação client-side de fragmentos compartilhados só é permitida como comportamento funcional realmente necessário, nunca como substituto para composição em tempo de build.

## Implementação

- `_includes/masthead.html` é a fonte da masthead em modo completo e reduzido.
- `_includes/jcem/footer-shell.html` encapsula o rodapé com `_includes/footer/custom.html` e `_includes/footer/after_footer.html`.
- `_includes/jcem/noscript-content.html` e `_includes/jcem/noscript-style.html` são as fontes do fallback sem JavaScript.
- `404.main.html` usa includes compartilhadas para masthead, `noscript`, subpostbar e footer, mantendo apenas conteúdo e scripts próprios da 404.
- `_plugins/jcem_html_compactor.rb` compacta o HTML final sem sincronizar ou substituir componentes compartilhados após o build.

## Validação

- A validação renderizada da 404 DEVE comparar a caixa do logotipo com a masthead e comprovar extrapolação vertical visível, ausência de clipping e preservação do alinhamento horizontal nas viewports representativas. [de992a9]
- A validação renderizada DEVE aferir tabela editorial real em claro e escuro, incluindo cabeçalho, linhas, células, bordas, alternância e contraste computado; `jcem-panel__table` e demais tabelas de apresentação ficam fora desse contrato. [de992a9]
- `npm run check:html` deve falhar se `404.html` voltar a existir como fonte editável. [860dfdf]
- Validação renderizada DEVE acionar o contêiner inteiro do switch por mouse, toque simulado e teclado, confirmar persistência e verificar o glifo `f0c9` somente no botão de menu. [860dfdf]
- `npm run check:html` deve confirmar que `404.main.html` gera `/404.html` e referencia masthead, `noscript` e footer por includes. [860dfdf]
- Build Jekyll deve gerar `_site/404.html` e não deve gerar `_site/404.main.html`. [860dfdf]
