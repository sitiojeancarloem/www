<!-- AI-PROCESSED -->
# RCF-JCEM-COMPONENTES-COMPARTILHADOS-001

Status: vigente.

Escopo: cabeçalho, masthead, `noscript`, rodapé, subpostbar, menus compartilhados, avisos institucionais e páginas especiais do tema.

## Regras Normativas

- Componentes estruturais compartilhados devem possuir uma única fonte editável.
- O controle claro/escuro DEVE conservar aparência, teclado e semântica, e clique ou toque em qualquer ponto de seu contêiner interativo DEVE alternar para o tema oposto; os ícones internos não podem constituir a única área acionável.
- A troca de tema DEVE preservar contraste suficiente durante todo o estado transitório; propriedades cuja interpolação atravesse cor ilegível DEVEM mudar atomicamente ou usar uma trajetória comprovadamente acessível.
- Controles internos de tema, paginação, compartilhamento e links de taxonomia DEVEM conservar nome acessível, ordem de títulos e alvo mínimo de toque; ocultação visual não autoriza remover rótulo semântico.
- O botão de menu adjacente ao controle de tema DEVE usar o ícone Font Awesome `bars` de código `f0c9`, sem alterar iconizações não relacionadas.
- Agrupamento e desagrupamento responsivo de navegação DEVEM preservar todos os links e controles, funcionar com redimensionamento e orientação e degradar sem JavaScript.
- Cópias manuais de cabeçalho, masthead, `noscript`, rodapé, subpostbar, menus compartilhados e avisos institucionais são proibidas.
- Variações por contexto devem ser implementadas por composição Liquid, includes parametrizadas, slots, placeholders ou mecanismo equivalente de build.
- Diferenças de páginas especiais, como `404` e `noscript`, podem omitir recursos não aplicáveis, mas não podem duplicar estrutura, conteúdo comum ou identidade visual.
- `404.html` é artefato gerado e não deve existir como fonte editável no repositório.
- A fonte editável da página 404 é `404.main.html`, transpilada pelo Jekyll para `/404.html` por `permalink`.
- Alteração em componente compartilhado deve refletir automaticamente em páginas normais, `noscript` e 404 durante o build.
- Hidratação client-side de fragmentos compartilhados só é permitida como comportamento funcional realmente necessário, nunca como substituto para composição em tempo de build.

## Implementação

- `_includes/masthead.html` é a fonte da masthead em modo completo e reduzido.
- `_includes/jcem/footer-shell.html` encapsula o rodapé com `_includes/footer/custom.html` e `_includes/footer/after_footer.html`.
- `_includes/jcem/noscript-content.html` e `_includes/jcem/noscript-style.html` são as fontes do fallback sem JavaScript.
- `404.main.html` usa includes compartilhadas para masthead, `noscript`, subpostbar e footer, mantendo apenas conteúdo e scripts próprios da 404.
- `_plugins/jcem_html_compactor.rb` compacta o HTML final sem sincronizar ou substituir componentes compartilhados após o build.

## Validação

- `npm run check:html` deve falhar se `404.html` voltar a existir como fonte editável.
- Validação renderizada DEVE acionar o contêiner inteiro do switch por mouse, toque simulado e teclado, confirmar persistência e verificar o glifo `f0c9` somente no botão de menu.
- `npm run check:html` deve confirmar que `404.main.html` gera `/404.html` e referencia masthead, `noscript` e footer por includes.
- Build Jekyll deve gerar `_site/404.html` e não deve gerar `_site/404.main.html`.
