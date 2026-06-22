# DIRETRIZ_MÁXIMA: PROJETO

# PRIORIDADE

Estas regras são mandatórias.
Em caso de conflito, aplicar:

1. Este arquivo (.clinerules)
2. Documentação/cabeçalho original do arquivo
3. Instrução contextual atual

Conflito:

"CONTRADIÇÃO DETECTADA: [origem] vs [regra] - Aplicando prioridade máxima."

[AMBIENTE]

STACK:

- Jekyll
- GitHub Pages
- Tema Minimal Mistakes
- GitHub Actions
- Gem
- Sass
- Node

Compatibilidade obrigatória:

- Build remoto
- Build local Windows
- Build local Linux

---

[ESCOPO]

Permitido:

- CSS/Sass
- JavaScript customizado
- layouts
- includes
- extensões

Proibido:

- Alterar Core Jekyll
- Alterar Core Minimal Mistakes
- Alterar `_posts` e `_drafts`
- Arquivos fora do escopo

Exceção:
Somente ordem explícita.

---

[ANÁLISE]

Idioma:
PT-BR

Antes de alterar:

- Detectar falhas
- Prevenir regressões
- Validar impacto
- Entregar solução final

Não entregar hipótese sem validação.
Ser rigoroso
ser minucioso
Codificar de forma blindada, tratando potenciais bugs e falhas
Usar sempre melhores práticas

---

[ALTERAÇÃO]

Objetivo:

Git Diff mínimo.

Preservar:

- Estrutura existente
- Fluxo atual
- Comentários existentes
- Compatibilidade

Proibido:

- Refatoração ampla
- Reorganização sem necessidade
- Alteração comportamental não solicitada

Permitido:

Refatoração cirúrgica:

- Alteração localizada
- Mesmo objetivo
- Mesmo contrato

Alterações extensas:

Executar progressivamente:

- Moderada: mínimo 2 commits
- Agressiva: mínimo 4 commits

Documentar:

- motivo
- objetivo
- impacto
- validação

Após estabilização:
Manter somente comentários necessários.

---

[BUGS]

Não remover código apenas por aparência de redundância.
Código existente pode conter correções não documentadas.

Dúvida:
Preservar.

Adicionar:

// PRESERVADO: potencial correção de bug não documentada

Correções/prevenções:

Adicionar:

// FIX-BUG: [descrição mínima]

ou

// PROTECAO: [descrição mínima]

Não remover sem análise:

- catches vazios
- tratamentos de erro
- validações existentes

---

[ESTILO]

Proibido:

- eu
- você
- nós

Evitar:

- talvez
- pode ser
- provavelmente

Evitar:

- adjetivos subjetivos

Priorizar:

- declarações determinísticas
- baixa redundância
- baixo acoplamento
- baixo custo cognitivo

---

[PRESERVAÇÃO]

Manter:

- Cabeçalho original
- Comentários úteis
- Convenções existentes

Alterar comentário somente quando:

- ficar incorreto após mudança
- causar interpretação errada

Comentários novos:

Somente necessários.

Máximo:
1 linha - salvo estritamente necessários.

---

[AMBIGUIDADE]

Aplicar interpretação:

- mais restritiva
- menor alteração
- maior preservação

Conflito interno:

Prevalece a regra que altera menos comportamento.

Caso insolúvel:

"AMBIGUIDADE INSOLUVEL: [ponto]. Preservando original."

---

[MINIMAL_MISTAKES]

[DARK_LIGHT]

Implementar:

- Pure CSS/Sass como implementação principal
- Custom Properties
- Switch visual compacto

Switch:

Requisitos:

- dimensões discretas
- menor destaque visual que a versão padrão do tema
- compatível com desktop e mobile
- ícone de sol para modo claro
- ícone de lua para modo escuro
- transição visual suave
- contraste validado

Ícones:

Utilizar padrão Font Awesome do projeto.

Definir Font Awesome como biblioteca padrão de ícones do tema.

Não duplicar bibliotecas equivalentes.

Requisitos:

- Todos componentes visíveis nos dois modos
- Contraste validado
- Persistência via JavaScript
- Preferência salva
- Default: Dark

---

[HEADER]

Site title:

Ocultar visualmente `site-title` exibido ao lado do logotipo.

Preservar:

- logotipo
- estrutura do header
- funcionamento original do tema

Não remover HTML se apenas CSS resolver.

[MENU]

Prioridade:

CSS/Sass puro.

Estado:

Nunca depender exclusivamente de JavaScript.

Implementação principal:

- Sass
- seletores estruturais
- estados CSS nativos

JavaScript:

Permitido como camada redundante:

- leve
- confiável
- sem criar dependência funcional

Nunca usar JavaScript como requisito único para:

- abrir
- fechar
- expandir
- recolher

Conteúdo colapsável:

Quando necessário:

- criar ícone clicável
- expandir/recolher via CSS

Se exibível integralmente:

- não criar menu desnecessário

Requisitos:

- somente um menu aberto quando aplicável
- layer externo cobrindo toda a janela
- conteúdo da página abaixo do menu visualmente ofuscado
- menu e seu conteúdo permanecem sem obstrução
- fechamento por clique no layer externo
- fechamento pelo clique em um dos itens quando aplicável
- blur do conteúdo da página via backdrop-filter
  JavaScript:
  Em geral é recurso opcional para:
  - criação
  - montagem
  - posicionamento
  - monitorar estado

  Nunca essencial/obrigatório.

Itens:

Suportar:

[ícone | label]

Alinhamento uniforme obrigatório e independente da existência de ícone.

---

[LAYOUT]

Sidebar:

O blog não deve exibir sidebar/aside.

Aplicar por configuração ou extensão do tema,
sem alterar core.

[SCROLL_TOP]

Implementar botão de retorno ao topo.

Requisitos:

- canto inferior direito
- exibido somente quando a página estiver rolada
- oculto quando estiver no topo
- não obstruir conteúdo
- compatível com desktop e mobile
- tamanho adequado para toque e clique

Comportamento:

- retorno suave ao topo
- animação fluida
- transição visual discreta

Implementação:

Prioridade:

- CSS/Sass

Quando insuficiente:

- TypeScript

JavaScript não deve ser requisito estrutural da página.

---

[LOADING_GLOBAL]

`carregandoPagina`:

- deve conter animação central e barra de progresso
- barra de progresso deve ficar fixa no topo da página
- largura: lado a lado da viewport
- altura: `0.5rem`
- visual limpo e coerente com o tema
- deve ser exibida e ocultada junto com `carregandoPagina`
- não deve participar da animação central do loader

Progresso:

- deve rastrear carregamento do DOM e recursos da página quando tecnicamente viável
- deve degradar de forma segura quando algum recurso não puder ser rastreado
- deve funcionar em conexões lentas e aparelhos fracos
- compatibilidade mínima: navegadores 2018+
- implementação deve permanecer leve, sem dependência externa quando solução local for suficiente

404:

- deve possuir fallback equivalente, local e mínimo
- não deve importar biblioteca externa apenas para o loader

---

[VALIDAÇÃO_VISUAL]

Verificar:

Modo claro:

- textos
- bordas
- ícones
- componentes

Modo escuro:

- textos
- bordas
- ícones
- componentes

Cores:

Adicionar comentários curtos de uso ao código.

---

[DEPENDÊNCIAS]

Ajustar quando necessário:

- package.json
- Gemfile

Respeitar:

GitHub Pages.

[DEPENDÊNCIAS_FRONTEND]

JavaScript novo:

Priorizar:

- TypeScript

Evitar:

- JavaScript puro quando TypeScript for compatível com o contexto

Requisitos:

- ambiente preparado para TypeScript
- toolchain compatível
- package.json compatível
- tipagem estrita quando aplicável

Objetivo:

- reduzir erros em tempo de execução
- aumentar rastreabilidade
- aumentar manutenibilidade

[COMPONENTIZAÇÃO]

Priorizar:

- componentes .tsx
- estilos .scss

Antes de adotar Vite:

Validar:

- compatibilidade com Jekyll
- compatibilidade com GitHub Pages
- compatibilidade com Minimal Mistakes
- custo operacional
- impacto no build

Se validado e vantajoso:

- padronizar Vite como solução oficial

Se não validado ou gerar complexidade desnecessária:

- utilizar alternativa mais simples
- manter compatibilidade integral

Decisão adotada:

- Vite não adotado nesta etapa
- TypeScript via `tsc`
- saída JavaScript estática compatível com Jekyll/GitHub Pages
- componentes do tema permanecem em Liquid/HTML e SCSS

Após nova validação definitiva:

Atualizar esta diretriz para refletir a decisão adotada pelo projeto.

---

[ARQUIVOS]

Ignorar:

`.gitignore`

Exceto:

- regra de negócio
- referência explícita

---

[404]

`404.html`:

- deve ficar no root, sem front matter, editável manualmente
- deve herdar `/assets/css/main.css`
- não deve duplicar CSS do tema
- CSS/JS local somente para conteúdo 404, terminal e fallbacks mínimos
- cabeçalho, `sobpostbar`, `noscript` e footer devem espelhar a origem do tema
- conteúdo, links, logotipo, ordem estrutural e classes visuais desses fragmentos devem corresponder à origem vigente do tema
- quando possível, hidratar fragmentos a partir da home
- a saída compilada deve sincronizar o `noscript` da 404 com o `noscript` renderizado da home
- sanitizar fragmentos importados para remover recursos pesados ou indevidos
- não importar switch de tema claro/escuro
- não importar Silktide, consent managers ou análogos
- não importar recurso dependente de cookie ou `localStorage`
- não expor controle visual de tema na 404
- tema deve seguir o padrão vigente; terminal permanece escuro
- terminal deve ser compacto, responsivo e com aparência Windows 11
- após o carregamento completo e a liberação do loader, carregar de forma assíncrona os seis posts mais recentes a partir de JSON/feed do próprio site
- publicações recentes não devem ser compiladas diretamente no HTML-fonte da 404
- a falha do JSON/feed não deve bloquear, ocultar nem invalidar o restante da 404
- cards assíncronos devem reutilizar a estrutura e o estilo visual dos cards de arquivo do blog
- montagem dos cards deve usar APIs de DOM e `textContent`, sem injetar HTML remoto
- o carregamento assíncrono não deve depender de cookies ou `localStorage`

Validação local:

- validar contra o servidor existente antes de iniciar outro
- não encerrar processo de servidor sem confirmação explícita

---

[NOSCRIPT]

Escopo:

- aplica-se ao fallback sem JavaScript embutido em todas as páginas, inclusive `404.html`

Paridade:

- deve espelhar cabeçalho, `sobpostbar`, conteúdo institucional e footer vigentes no blog
- deve preservar logotipo, textos, links, ordem estrutural e classes visuais da origem
- divergências só são permitidas quando o elemento depender tecnicamente de JavaScript, cookies ou armazenamento local
- controles de tema, busca, consentimento e menus dependentes de JavaScript não devem ser exibidos

Funcionamento:

- deve usar somente HTML e CSS
- deve permitir rolagem vertical nativa até o footer
- não deve criar overflow horizontal
- deve herdar o fundo e os tokens visuais do tema padrão
- o conteúdo deve permanecer legível, responsivo e integralmente acessível
- o loader JavaScript não deve ocultar ou bloquear o fallback
- a imagem destacada sem JavaScript usa o padrão wide do blog e fundo específico `#010203`

Manutenção:

- a fonte principal permanece em `_includes/jcem/noscript-content.html`
- o artefato compilado da 404 deve receber automaticamente o mesmo fragmento renderizado da home
- validação visual deve comparar home e 404 com JavaScript desativado

Canonical Path Redirect Script:

- Objetivo
  - Normalizar URLs recebidas para diretórios canônicos.
  - Redirecionar somente quando o diretório resultante corresponder ao mapa configurado.

- Configuração
  - O mapa possui formato:

    [
    [fromPathName, toPathName],
    ...
    ]

  - `fromPathName`
    - Sempre representa diretório.
    - Nunca contém arquivo.
    - Nunca contém extensão.

  - `toPathName`
    - Sempre representa diretório canônico.
    - Nunca contém arquivo terminal.

- Execução
  - Executa antes do DOM.
  - Não depende de eventos de carregamento.
  - Captura `location.pathname` imediatamente.
  - Processa comparação de forma assíncrona.
  - Bloqueia somente durante redirect confirmado.

- Normalização do pathname recebido
  - O pathname deve ser convertido para diretório canônico.

  - Aplicar:
    - decode URI quando possível.
    - normalização Unicode quando disponível.
    - lowercase.
    - remoção de espaços inconsistentes.
    - redução de barras duplicadas.
    - remoção de barra final.

  - Arquivo terminal sempre deve ser removido:
    - index
    - default
    - home
    - main

  - Extensões aceitas para remoção:
    - html
    - htm
    - php
    - asp
    - aspx
    - jsp
    - cgi

- Exemplos
  - Entrada:

    /produto/index.html?x=1

    Resultado:

    /produto/?x=1

  - Entrada:

    /Produto/

    Resultado:

    /produto

  - Entrada:

    /produto/default.php?a=b

    Resultado:

    /produto/?a=b

- Comparação
  - Comparar:

    # canonical(pathname recebido)

    canonical(fromPathName)

  - A comparação ignora:
    - caixa.
    - arquivo terminal.
    - extensão.
    - barra final.
    - espaços inválidos.

- Redirect
  - Em caso de match:
    - Substituir somente pathname.
    - Preservar:
      - protocolo.
      - domínio.
      - porta.
      - query string.
      - hash.

  - Usar substituição de histórico.

- Sem match
  - Nenhuma alteração.

- Garantias
  - Sem dependências.
  - Sem erro não tratado.
  - Sem bloqueio de renderização.
  - Compatível ES2020+.
  - Evitar conflito e evento circular com botão de voltar do navegador.

- Resultado
  - Toda rota equivalente converge para uma única representação sem arquivo terminal.

---

[FINAL]

Adicionar:

COMMIT_SUGERIDO:

Texto PT-BR.
Curto (máximo 256 chars).
Descritivo.

Indicar explicitamente se ainda há mais estapas ou pendencias a serem feitas, e quais.

---

[URLS]

Posts:

URL padrão:

/p/titulo

Requisitos:

- URLs curtas
- sem segmento indicando blog
- sem redundância de caminho
- compatível com mecanismos de busca

O prefixo:

p

é reservado para posts.

Taxonomias:

Quando suportado pelo Jekyll/tema:

Utilizar:

/{root}/{nome}

Onde:

root = primeira letra do tipo

Exemplos:

categoria:

/c/categorianome

tag:

/t/tagname

Demais tipos:

Seguir o mesmo padrão:

/{primeira_letra_do_tipo}/{nome}

Exceções:

- rotas já existentes
- rotas reservadas
- post (`p`)

Objetivo:

- URLs menores
- melhor indexação
- separação semântica por tipo
- evitar exposição da estrutura interna do blog

Paginação:

Quando suportado pelo Jekyll/tema:

Priorizar URLs curtas.

Evitar:

- segmentos contendo "blog"
- estruturas longas
- caminhos desnecessários

A implementação deve priorizar:

- compatibilidade com busca
- estabilidade de URL
- previsibilidade
- baixa complexidade

[SCHEDULED]

Criar:

./\_scheduled/

Finalidade:

Armazenar posts finalizados que aguardam publicação futura.

Diferença:

- `_drafts`: conteúdo em desenvolvimento
- `_scheduled`: conteúdo aprovado, pronto para publicação futura

Regras:

Posts em `_scheduled`:

- Não devem aparecer no build público padrão
- Não devem ser acessíveis por URL direta
- Devem retornar 404 antes da data prevista
- Devem permanecer isolados até a publicação efetiva

Formato:

O post deve ser precedido pela data futura de publicação.

A data determina:

- elegibilidade de publicação
- momento de migração para conteúdo público

---

[WORKFLOW_SCHEDULED]

Criar workflow específico `scheduled`.

Execução:

Diariamente:
00:01

Responsabilidade:

Verificar:

`./_scheduled/`

Identificar:

Arquivos ou diretórios cuja data de publicação seja igual à data atual.

Quando encontrado:

Executar:

- roda diretamente a partir do github Actions
- preparação do post
- compilação específica
- atualização do artefato
- publicação no GitHub Pages

Regra:

Nenhum conteúdo agendado pode ser exposto antes da data configurada.

---

[WORKFLOW_PUBLICAÇÃO]

Toda publicação efetiva de post deve acionar workflow de distribuição externa.

Aplica-se:

- publicação imediata
- publicação proveniente de `_scheduled`

Pré-condição obrigatória:

Executar somente após:

- compilação concluída
- publicação concluída
- validação de disponibilidade do post

Falha anterior:

Não iniciar distribuição externa.

---

---

[REDES_SOCIAIS]

Executado apenas se houver publicação de novas publicações (posts).
Plataformas obrigatórias:

- Facebook
- Instagram
- X (antigo Twitter)

Implementação:

Antes de criar integração própria:

Pesquisar e avaliar ferramentas, bibliotecas e automações open source existentes
que implementem o fluxo necessário.

Preferência:

Utilizar soluções maduras já existentes quando:

- cobrirem o requisito funcional
- possuírem manutenção ativa
- forem compatíveis com o ambiente
- permitirem automação via workflow

Evitar:

- reinventar integração já existente
- duplicar bibliotecas
- criar wrappers desnecessários

Cada rede social deve possuir workflow próprio.

Objetivo:

Publicar automaticamente informações relacionadas ao post:

- título
- resumo curto
- imagem destacada quando existir
- hashtags
- link

Cada workflow deve possuir tratamento específico para sua plataforma.

Requisitos:

- configuração própria
- tratamento de erros específico
- persistência de estado
- recuperação automática
- múltiplas tentativas
- fallback quando aplicável

Estratégia:

Priorizar:

1. solução open source existente validada
2. método oficial da plataforma
3. alternativas configuradas
4. fallback disponível

Falha:

Somente ocorrer após esgotar possibilidades previstas.

Não permitido:

- encerramento abrupto
- travamento indefinido
- interrupção externa sem tratamento

Cada workflow deve:

- finalizar por sucesso
- finalizar por esgotamento controlado
- registrar estado final

Encadeamento:

Workflows dependentes devem executar somente após conclusão do anterior.

O próximo workflow deve ser acionado apenas quando:

- estado final conhecido
- execução anterior concluída

---

[CONTEÚDO_EDITORIAL]

[AUTORES_DE_ARTIGO]

Metadados opcionais:

- posts podem declarar `article_authors` como lista ordenada
- cada autor exige `name` e `bio`
- `url` e `avatar` são opcionais
- entradas sem `name` ou `bio` não devem ser renderizadas
- o bloco inteiro não deve existir quando não houver autor válido
- avatar ausente deve usar ilustração local padrão
- o primeiro autor recebe destaque principal
- autores adicionais usam apresentação compacta e responsiva
- três ou mais autores devem usar composição mais densa para reduzir altura e poluição visual
- saída deve incluir semântica `Person` compatível com dados estruturados
- não alterar posts existentes apenas para forçar a exibição do componente

---

[COMPACTAÇÃO_HTML]

Objetivo:

- reduzir o HTML final sem comprometer JavaScript, CSS, Base64, Markdown renderizado ou legibilidade de diffs

Aplicação:

- executar somente no artefato HTML final de produção
- incluir páginas geradas pelo Jekyll e arquivos HTML estáticos copiados, inclusive `404.html`
- remover linhas vazias
- remover espaços e tabs no início e no fim de linhas comuns
- preservar integralmente o conteúdo interno de `script`, `style`, `pre`, `textarea` e `template`
- preservar quebras de linha entre linhas não vazias; não transformar o documento inteiro em uma linha
- não minificar JavaScript, CSS ou conteúdo Base64 como parte desta etapa
- não adicionar dependência externa quando o hook local cobrir o contrato com menor risco
- toda alteração do compactador exige teste de regressão com blocos sensíveis

---

[FORMATAÇÃO_DE_POSTS]

Aplica-se:

- exclusivamente ao conteúdo textual dos posts
- não se aplica a navegação, cabeçalho, footer, metadados, embeds ou componentes externos ao artigo

Parágrafos:

- cada parágrafo comum do post deve iniciar a primeira linha com indentação visual
- indentação padrão: `4em`
- aplicar preferencialmente por CSS/Sass no conteúdo renderizado do artigo
- não inserir espaços manuais no Markdown para simular indentação
- não aplicar indentação em títulos, listas, tabelas, imagens, legendas, footnotes, blockquotes ou painéis de citação

Blockquotes e painéis de citação:

- texto principal dentro de `blockquote` não deve ser itálico
- texto principal dentro do painel futurista usado como citação não deve ser itálico
- subcitação dentro de citação deve ser itálica quando aparecer entre aspas simples ou duplas
- não aplicar itálico automático ao bloco inteiro
- quando houver distinção real entre texto citado e referência, separar a referência em linha própria
- referência deve iniciar por `—`, não por `-`
- referência deve possuir fonte menor que o texto principal da citação
- quando a referência citar autor identificável, acrescentar contexto ultrassintético sobre quem era o autor à época da citação, quando houver base segura

Texto comum do artigo:

- texto comum do artigo não deve ser itálico por padrão
- citação inline mencionada diretamente no parágrafo, entre aspas simples ou duplas, deve ser itálica
- itálico semântico ou autoral já existente deve ser preservado quando não conflitar com estas regras

Footnotes:

- marcadores inline de footnotes devem permanecer compactos
- não deve haver espaçamento horizontal excessivo entre o texto e o marcador
- `sup` de footnotes deve manter proporção visual compatível com texto corrido

---

[CORREÇÕES_TEXTUAIS]

Ao alterar arquivos textuais autorizados para edição:

- corrigir erros ortográficos identificados
- corrigir erros gramaticais identificados
- corrigir erros de digitação identificados

Restrições:

- somente em arquivos efetivamente modificados
- somente dentro do escopo autorizado

Obrigatório:

Informar explicitamente ao final da atividade:

- quais arquivos receberam correções textuais
- se ocorreram correções exclusivamente ortográficas/gramaticais

---

[PRESERVAÇÃO_AUTORAL]

Quando solicitado:

- revisão
- reorganização
- melhoria textual
- ajuste semântico
- reescrita

Preservar obrigatoriamente:

- estilo do autor
- vocabulário do autor
- ritmo do texto
- forma de argumentação
- estrutura de raciocínio
- estilo de pontuação
- pausas intencionais
- características literárias
- características retóricas

Objetivo:

Melhorar o texto sem descaracterizar a autoria.

Proibido:

- padronizar artificialmente o estilo
- transformar todos os textos no mesmo padrão de escrita
- substituir a voz autoral pela voz da IA

Antes de sugerir alterações:

Analisar:

- parágrafo
- seção
- artigo completo
- contexto geral

Prioridade:

1. preservar identidade autoral
2. preservar intenção autoral
3. corrigir problemas reais
4. melhorar clareza

---

[CONTINUE_IA]

No root do repositório deve existir:

continue.ia

Se não existir:

Criar automaticamente.

Este arquivo deve ser lido antes de qualquer operação.

Finalidade:

Manter estado operacional entre execuções, chats ou solicitações diferentes.

O arquivo funciona como:

- checklist técnico
- memória operacional do projeto
- controle de pendências
- rastreamento de etapas

Requisitos:

Formato:

- texto simples
- legível por humanos
- otimizado para interpretação por IA
- baixa redundância
- alta densidade informacional

Registrar:

Registrar:

- tarefas recebidas ainda relevantes
- tarefas em andamento
- tarefas pendentes
- etapas iniciadas
- etapas aguardando continuidade
- processos que exigem múltiplos commits
- validações necessárias
- problemas de ambiente encontrados
- tentativas realizadas
- soluções aplicadas

Tarefas concluídas:

Manter somente quando:

- fazem parte de uma tarefa maior ainda em andamento
- são necessárias para continuidade do processo
- possuem impacto em decisões futuras

Remover quando:

- a demanda principal for concluída
- não houver dependência futura
- o registro não auxiliar continuidade

Objetivo:

Evitar crescimento indefinido do arquivo.

Problemas de ambiente:

Registrar:

- problema identificado
- causa provável ou confirmada
- tentativas executadas
- resultado
- próximo passo recomendado

Objetivo:

Evitar repetição de comandos conhecidos como falhos.

Problemas registrados não representam bloqueio:

A IA deve tentar resolver automaticamente quando possível.

Caso não seja possível:

- registrar impedimento
- evitar repetir tentativas sem alteração de estratégia

Organização:

Agrupar informações por contexto.

Cada demanda deve possuir categoria própria.

Categorias devem ser criadas, ajustadas ou mescladas conforme necessário para reduzir duplicidade e melhorar rastreabilidade.

Quando novos pedidos forem recebidos:

- identificar contexto
- associar ao grupo existente quando compatível
- criar novo grupo quando necessário
- reorganizar categorias quando a estrutura atual deixar de ser eficiente

Atualização:

Após cada alteração relevante:

Atualizar continue.ia.

Antes de iniciar nova alteração:

Consultar continue.ia.

---

[RASTREABILIDADE_DE_IA]

Objetivo:

Evitar que conteúdo processado por IA seja utilizado como fonte primária para identificação do estilo original do autor.

Todo trecho modificado semanticamente por IA deve receber marcação persistente.

Requisitos:

A marcação deve:

- permanecer no arquivo fonte
- sobreviver a rebuilds
- não ser exibida visualmente ao leitor
- não alterar o conteúdo renderizado
- ser legível por ferramentas automatizadas
- permitir identificação futura do trecho processado

Aplicação:

Obrigatória quando houver:

- reescrita
- reorganização textual
- expansão textual
- resumo
- simplificação
- ajuste semântico
- adaptação de estilo
- geração parcial
- geração integral

Não obrigatória para:

- correção ortográfica
- correção gramatical
- correção tipográfica
- correção de links
- correção de metadados

Quando apenas parte de um texto for modificada por IA:

- marcar a menor região possível
- evitar marcar o documento inteiro sem necessidade

Objetivo da marcação:

Permitir que futuras análises diferenciem:

- conteúdo originalmente produzido pelo autor
- conteúdo alterado por IA

---

[REFERÊNCIA_DE_ESTILO]

Ao utilizar textos do repositório como amostra de estilo:

- ignorar trechos marcados como processados por IA

Prioridade:

1. conteúdo original sem marcação de IA
2. `_drafts` sem marcação de IA
3. artigos publicados sem marcação de IA
4. conteúdo revisado apenas ortográfica ou gramaticalmente
5. conteúdo processado por IA

Objetivo:

Identificar:

- vocabulário recorrente
- estrutura recorrente
- estilo argumentativo
- estilo literário
- estilo técnico
- padrões de pontuação
- padrões de transição

Presumir:

Conteúdo originalmente produzido pelo autor possui prioridade sobre conteúdo potencialmente assistido por IA.

Trechos marcados por IA não devem ser considerados fonte primária de estilo autoral.

Podem ser utilizados apenas como contexto complementar.

---

[FORMATO_DA_MARCAÇÃO]

Preferência:

Utilizar comentários invisíveis compatíveis com:

- Markdown
- Jekyll
- GitHub Pages

Exemplo conceitual:

<!-- AI-PROCESSED -->

Ou formato equivalente definido pelo projeto.

A marcação deve ser:

- estável
- simples
- pesquisável
- facilmente identificável por automação

Evitar:

- formatos proprietários
- formatos dependentes de serviços externos
- formatos que alterem a renderização pública

---

[RIGOR_ACADÊMICO]

Exceto quando explicitamente classificado como:

- reflexão pessoal
- testemunho
- opinião
- narrativa literária
- poesia

Todo artigo deve buscar rigor documental e verificabilidade.

Objetivo:

Associar argumentos a fontes:

- válidas
- verificáveis
- confiáveis
- rastreáveis

Sempre que possível:

Adicionar referências para:

- afirmações factuais
- dados históricos
- estatísticas
- estudos
- argumentos técnicos
- citações

---

[CITAÇÕES_E_REFERÊNCIAS]

Artigos técnicos e artigos em formato de sermão devem seguir o princípio:

Afirmação → Referência imediata.

Preferência:

Inserir a referência imediatamente após o trecho referenciado.

Utilizar mecanismos compatíveis com:

- Jekyll
- Markdown
- Footnotes

Preferência visual:

Comportamento semelhante ao utilizado pela Wikipédia.

Evitar:

- referências concentradas apenas ao final do artigo
- afirmações relevantes sem fonte quando existir fonte verificável

---

[FOOTNOTES]

O projeto deve possuir suporte para notas de rodapé.

Preferência:

Utilizar mecanismo compatível com:

- Jekyll
- GitHub Pages
- Markdown

Evitar:

- implementação manual repetitiva
- soluções incompatíveis com GitHub Pages

Prioridade:

Utilizar mecanismo nativo ou amplamente adotado antes de criar implementação própria.

---

[FOOTNOTES_BIBLIOGRAFIA_E_REFERÊNCIAS]

Artigos com referências devem possuir suporte para:

- Referências
- Bibliografia

Sempre que possível:

Gerados automaticamente a partir dos footnotes e metadados utilizados no artigo.

Bibliografia:

- formato ABNT

Referências:

- devem apontar para os itens da bibliografia

Footnotes:

- identificadores discretos e de baixa interferência visual
- posicionados imediatamente após a ocorrência referenciada
- cada ocorrência deve apontar para sua referência correspondente
- cada referência deve permitir retorno ao ponto exato da citação
- ao passar o cursor, exibir resumo curto ou trecho da referência quando suportado pela tecnologia utilizada
- comportamento preferencialmente semelhante ao adotado pela Wikipédia

Prioridade:

Utilizar bibliotecas, plugins ou ferramentas compatíveis com:

- Jekyll
- GitHub Pages
- GitHub Actions

Preferencialmente:

- consolidadas
- amplamente utilizadas
- ativamente mantidas

---
