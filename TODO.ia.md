# RCF — Governança da TO-DO

Esta seção de governança DEVE permanecer no topo do arquivo, NÃO PODE ser removida nem editada e rege todas as TO-DOs posteriores até o marcador explícito de início das TO-DOs operacionais.

O arquivo TODO.ia.md não pode ser removido.

## 1. Estrutura normativa do arquivo

Este arquivo constitui uma lista normativa e operacional de TO-DOs convergentes.

Todo item de topo DEVE:

- iniciar exatamente com `- [ ]` ou `- [x]`;
- começar sem indentação;
- representar uma frente autônoma subordinada às normas deste RCF.

Todo conteúdo imediatamente posterior a um item de topo, enquanto não houver outro item iniciado sem indentação por `- [ ]` ou `- [x]`, DEVE ser interpretado como subordinado ao item de topo imediatamente anterior.

A forma interna dessa subordinação é livre: PODE conter subtítulos, subitens, regras em estilo RCF, ordens, critérios, listas de afazeres, etapas, notas ou estruturas equivalentes. A semântica hierárquica prevalece sobre a forma.

A formatação do arquivo DEVE preservar indentação visual coerente e inequívoca de todo conteúdo subordinado. Títulos, listas, blocos e demais conteúdos pertencentes a um item de topo DEVEM permanecer visualmente aninhados a ele.

## 2. Status, andamento e conclusão

A marcação `[x]` NÃO significa conclusão: indica apenas que o item foi lido, teve sua FT criada e encontra-se em andamento. Itens NÃO iniciados DEVEM permanecer como `[ ]`.

TO-DOs integralmente concluídas DEVEM ser removidas, mantendo o arquivo limpo.

## 3. Regra perene de convergência

- [ ] Equalizar e executar as TO-DOs como frentes convergentes de um único objetivo
  - Este item rege todas as demais TO-DOs. Cada uma DEVE ser tratada como frente complementar de uma única execução, conciliada com as demais e convergente ao objetivo principal do projeto.

  - Contradições aparentes DEVEM ser presumidas como imprecisão redacional e resolvidas por equalização, sem perda de intenção, requisito, restrição ou nuance. Havendo conflito material não solucionável pelas normas e pelo contexto, o desenvolvedor DEVE ser consultado.

  - Considerações, comparações ou solicitações PODEM não ser plenamente aderentes ao projeto, especialmente quando previamente processadas por IA. Salvo dúvida material, a IA DEVE interpretá-las conforme o contexto já normatizado no RCF e no `README.md`; persistindo ambiguidade ou incompatibilidade, DEVE consultar o desenvolvedor antes de prosseguir.

  - O `AGENTS.md` prevalece absolutamente; o RCF vigente prevalece sobre as demais fontes subordinadas. Toda alteração DEVE aprimorar o projeto, ampliar capacidades e recursos, preservar compatibilidade e força normativa e NÃO PODE introduzir regressão.

  - Antes de executar qualquer TO-DO, a IA DEVE:
    1. ler integralmente todas as TO-DOs e normas aplicáveis;
    2. equalizar objetivos, requisitos, dependências, precedências e terminologia;
    3. resolver incompatibilidades, ambiguidades, sobreposições e lacunas;
    4. adaptar, consolidar, desmembrar, reordenar ou eliminar itens somente quando isso aumentar a coerência sem reduzir o objetivo material.

  - Toda TO-DO DEVE ser separada em:
    - **Normatização (RCF):** atualização de RCFs, contratos, precedências e documentação normativa necessária;
    - **Implementação:** código, migrações, testes, validações e alterações funcionais.

  - Após a equalização, a IA DEVE iniciar e concluir imediatamente a **Normatização RCF de todas as TO-DOs**, mantendo rastreabilidade entre cada regra e sua implementação futura.

  - Concluída a normatização, a IA DEVE INTERROMPER antes de qualquer implementação e solicitar autorização expressa do desenvolvedor, informando sucintamente:
    - implementações pendentes;
    - dependências e ordem recomendada;
    - impedimentos materiais identificados.

  - Somente quando aplicável ao contexto do repositório, toda alteração que modifique o modo de codificar Markdown DEVE ser documentada no respectivo modo de uso.

  - Este item e toda a seção `# RCF — Governança da TO-DO` são perenes: NÃO PODEM ser marcados como concluídos, removidos ou alterados. Sua contabilização somente é necessária enquanto existir ao menos uma TO-DO por eles regida.

---

# TO-DOs

Este marcador encerra a seção de governança e inicia exclusivamente as TO-DOs operacionais. Todo item de topo abaixo dele está sujeito integralmente ao RCF acima.

---

- [ ] Equalizar TTS e TOC automático sem alterar o Markdown-fonte
  - INSPECIONE modos/nomenclaturas reais antes de editar; preserve contratos/FTs existentes e apenas especialize o comportamento abaixo.
  - **TOC**: gerar exclusivamente no build, sem modificar `.md`; inserir imediatamente após o **primeiro parágrafo real do corpo**, desconsiderando `blockquote` e estruturas HTML semanticamente equivalentes a citação. Esta posição vale para renderização geral, não apenas TTS.
  - TOC DEVE ser temático, responsivo, claro/escuro, retraível e **retraído por padrão**; visual acadêmico/elegante integrado ao tema atual, evitando aparência de banner/publicidade e consequente _banner blindness_. NÃO criar bloco visualmente concorrente com o artigo.
  - **TTS**:
    - somente o modo de leitura integral/completa DEVE ler o TOC;
    - o modo mais simples/fluido/contínuo NÃO DEVE verbalizar individualmente notas/referências no fluxo; ao fim de cada parágrafo, preserve o comportamento existente de informar sinteticamente a quantidade de referências citadas;
    - nos modos que verbalizam referências, NÃO leia somente o número (`"trinta e um"`): use marcador breve e semanticamente inequívoco, p.ex. `"referência trinta e um"`/equivalente ainda mais curto se comprovadamente claro, consistente com locale e natureza real da referência.
  - **Impressão**: TOC NÃO DEVE ser impresso por padrão. Somente o inclua se a norma IEEE efetivamente aplicável o comportar; nesse caso, reposicione/reestilize especificamente para impressão conforme RCF, sem herdar automaticamente a apresentação web.
  - Validar build, posição estrutural, conteúdo sem/ com `blockquote`, retração, claro/escuro, responsividade, teclado/acessibilidade, todos os modos TTS e impressão.

- [ ] Consolidar COVER como sistema responsivo, extensível e compatível com Hero, preservando integralmente recursos existentes
  - INSPECIONE RCF, implementação e FTs atuais; **equalize-as** com esta norma. Ela corrige/amplia COVER e NÃO autoriza remoção, regressão, simplificação ou redução de modo/feature existente.
  - Use `.\.ia.rules\state\requests\evidencias\projeto-cover.pdf` como evidência normativa complementar. **Somente textos, medidas, zonas, setas e determinações explicitamente apresentadas nele são normativas**: as screenshots retratam estado atual parcialmente defeituoso e NÃO são referência visual integral. A própria evidência registra, por exemplo, barras/flag defeituosas em exemplo de cover infinito. Capturas exclusivamente escuras NÃO dispensam claro/escuro. :contentReference[oaicite:0]{index=0}

  - **Geometria/base**
    - cover comum: proporção útil obrigatória **1,91:1**;
    - distinguir e nomear inequivocamente no RCF a **largura/zona do artigo** da **largura/zona da janela**; NÃO tratá-las como equivalentes. O cover comum deve ficar colinear às bordas da zona do artigo. :contentReference[oaicite:1]{index=1}
    - a região COVER NÃO DEVE possuir scroll próprio/horizontal.
    - OGs são independentes do cover: qualquer artigo DEVE poder informar opcionalmente OG `1,91:1` e OG `1:1` próprios, sem obrigá-las a reutilizar o cover - por padrão reutilizar se não informado a parte.

  - **Infinite — imagem única**
    - ocupa horizontalmente a zona total da janela;
    - conteúdo centralizado e overflow horizontal oculto;
    - altura determina a dimensão necessária; largura é automática, preservando a imagem e garantindo que sua **região central útil 1,91:1** ocupe integralmente a altura definida; excedente lateral fica oculto e produz continuidade horizontal. :contentReference[oaicite:2]{index=2}

  - **Infinite — “3 imagens”**
    - NÃO interpretar literalmente como três arquivos: composição = `pattern-left` + imagem central + `pattern-right`;
    - cada pattern PODE ser imagem, cor hexadecimal ou `linear-gradient`;
    - centro DEVE ser `1,91:1`, colinear à zona do artigo;
    - `pattern-left` ocupa da borda esquerda da janela/zona infinita até a borda esquerda do centro; `pattern-right`, simetricamente, do centro até a borda direita; junções DEVEM ser contínuas, sem gap/scroll/overflow visível. :contentReference[oaicite:3]{index=3}

  - **Barras/flag**
    - cover/z-index NÃO PODE ocultar a flag nem as barras de título.
    - As duas barras DEVEM aparentar uma estrutura única: inferior sólida; superior RGBA em degradê, do aspecto de vidro translúcido no topo até fusão visualmente perfeita/opaca com a inferior; a extremidade superior permanece minimamente perceptível para comunicar suporte à flag.
    - O triângulo esquerdo da flag DEVE manter a base/extremidade colinear à extremidade da barra superior conforme diagrama. :contentReference[oaicite:4]{index=4} :contentReference[oaicite:5]{index=5}

  - **Modos viewport/header**
    - `FullWindow`: ocupar a janela responsivamente usando **uma única dimensão como referência (`height-fit` XOR `width-fit`)**, calculando a outra automaticamente, preservando proporção e preenchimento; priorizar CSS puro. Header inicialmente RGBA translúcido, opacidade central configurável (**30% padrão conforme evidência**) e override opcional por página/post no `.md`; ao scroll, retornar ao comportamento normal com fundo sólido.
    - `windowHeight`: semântica de `FullWindow`, mas ajuste predeterminado pela altura. :contentReference[oaicite:6]{index=6}
    - `windowWidth`:semântica de `FullWindow`, mas ajuste predeterminado pela largura. confronte RCF/implementação, preserve o modo equivalente existente como canônico/alias e garanta a semântica descrita — ajuste pela largura sem jamais ultrapassar a altura da janela. :contentReference[oaicite:7]{index=7}
    - `innerFullWindow`: equivalente ao `FullWindow`, mas começa abaixo do header; área vertical = viewport menos **altura integral do header**; header NÃO usa opacidade/configuração específica desse modo. :contentReference[oaicite:8]{index=8}
    - `innerWindowHeight`: equivalente ao modo por altura, porém abaixo do header e calculado sobre viewport menos sua altura integral, igualmente sem comportamento/configuração de opacidade. :contentReference[oaicite:9]{index=9}
    - `innerWindowWidth`: equivalente ao modo WindowWidth, porém abaixo do header e calculado sobre viewport menos sua altura integral, igualmente sem comportamento/configuração de opacidade. :contentReference[oaicite:10]{index=10}
    - Para o correspondente interno do comportamento _fit-by-width_, reconcilie a inconsistência nominal do PDF pela semântica e aliases reais; NÃO invente modo redundante nem elimine equivalente existente.

  - **Hero Section — contrato comum a TODOS os covers**
    - Hero é uma camada de conteúdo **sobre a área útil do cover**, nunca sobre excedentes/patterns decorativos, header, barras/flag ou área externa.
    - Configuração DEVE ser declarativa no `.md` e permitir, separadamente: conteúdo textual Markdown (inclusive múltiplos parágrafos/inline Markdown), botão opcional (`label` + `link`) e posicionamento/alinhamento.
    - Disponibilizar obrigatoriamente 6 zonas-base:
      1. superior-esquerda;
      2. superior-direita;
      3. inferior-esquerda;
      4. inferior-direita;
      5. `center`: região central protegida por padding substancial;
      6. `full`: mesma área central útil, porém com padding periférico reduzido.
    - NÃO multiplique arbitrariamente presets para cobrir alinhamentos usuais: modele **zona + alinhamento horizontal/vertical + largura/limites de conteúdo** como propriedades ortogonais, quando isso atender melhor aos layouts existentes. Outras disposições usuais DEVEM ser expressáveis pelo `.md` sem CSS/HTML específico por artigo.
    - O Hero DEVE seguir práticas profissionais: hierarquia tipográfica clara, largura de leitura controlada, contraste real sobre fundos variáveis, CTA inequívoco sem aparência publicitária gratuita, espaçamento consistente, ausência de colisões/cortes, foco/teclado e semântica acessíveis, links distinguíveis, adaptação automática a viewport/DPR/orientação e preservação da área visual relevante do cover.
    - Contraste NÃO DEVE depender de uma imagem específica: disponibilize mecanismo temático/configurável de proteção de legibilidade (overlay/gradiente/text treatment ou equivalente), discreto e desacoplado da própria imagem.
    - Conteúdo Hero NÃO DEVE provocar scroll dentro do cover; em viewport insuficiente, adapte tipografia/espaçamento/layout de forma responsiva, sem ocultar conteúdo essencial nem sobrepor regiões vedadas.
    - **CSS-first obrigatório**: priorize layout, `object-fit`/`object-position`, Grid/Flex, custom properties, media/container queries e recursos nativos adequados. Biblioteca externa somente se mantida, open source, tecnicamente compatível e demonstradamente superior a solução nativa sem custo/desacoplamento desproporcional.

  - **RCF/configuração**
    - Centralize modelo, zonas, modos, aliases, defaults e precedências; NÃO espalhe regras equivalentes.
    - O schema do `.md` DEVE ser simples para uso comum, extensível para composição avançada e validável no build; propriedades ausentes preservam defaults vigentes.
    - Defina claramente precedência entre configuração global → modo → página/post, sem inferir valores inexistentes.
    - Preserve os contratos já vigentes que não conflitarem materialmente com esta especialização.

- [ ] Validar COVER/TOC/TTS visual, funcional e normativamente
  - Criar/expandir testes reais para todos os modos COVER, 1/3-part infinite, patterns imagem/cor/gradient, OG independente, Hero nas 6 zonas e combinações usuais de alinhamento, textos curtos/longos, com/sem CTA, claro/escuro, mobile/desktop, resize/orientation, header antes/depois de scroll e integração com barras/flag.
  - Validar geometricamente colinearidade artigo/cover, `1,91:1`, viewport × article zone, ausência de scroll/overflow/corte indevido e comportamento `inner*`; a evidência distingue expressamente zona do artigo da janela e define o infinite como full-width. :contentReference[oaicite:10]{index=10} :contentReference[oaicite:11]{index=11}
  - Fazer **verificação visual**, não apenas DOM/unit tests; comparar somente contra as determinações anotadas no PDF, jamais reproduzir defeitos incidentais das screenshots.
  - Validar Hero como composição editorial real — legibilidade, equilíbrio, hierarchy, responsive reflow, CTA, acessibilidade e ausência de aparência improvisada — e não apenas comprovar que campos foram renderizados.
  - Executar/regredir TTS, TOC, impressão, cover/header, layouts existentes e FTs correlatas. Aceite somente com **zero perda de feature, zero regressão e nenhuma redução/enfraquecimento normativo**.
