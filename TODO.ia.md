- ✅ Manter documentação de uso, referências normativas e metadados do projeto sincronizados com o estado real
  - ✅ Atualizar continuamente `README.md` sempre que modo de uso, configuração, comportamento ou recurso documentável for adicionado ou alterado.
    - ✅ Evitar concentrar documentação densa em uma única página: distribuir conteúdo por subpáginas `.md` por contexto/função.
    - ✅ Localizar toda documentação canônica de modo de uso obrigatoriamente em `./docs/`.
    - ✅ No `README.md`, indexar as subpáginas preferencialmente em tabela, com:
      - ✅ link direto;
      - ✅ descrição ultrassucinta, porém suficiente para identificar contexto, aplicação real, função e, quando relevante, horizonte de uso/oportunidades.
    - ✅ NÃO depender apenas do nome de um termo/recurso quando ele não for suficiente para explicar seu alcance ou aplicação.
  - ✅ Criar e manter uma única página `.md` de uso e configuração de `Cover`, ligada diretamente pelo `README.md` e pelo RCF aplicável.
    - ✅ Explicar, de forma sucinta e suficiente para humanos, os modos/estilos de `Cover`, formas de uso em artigos e configurações aplicáveis.
    - ✅ Incluir ao menos um exemplo prático, copiável, funcional sem erro e aplicável a um cenário real.
    - ✅ Incluir uma ilustração SVG simples para cada variação/modo de `Cover`.
      - ✅ Todos os SVGs DEVEM compartilhar padrão, estilo, dimensões/formato e linguagem visual, permitindo comparação direta entre modos.
      - ✅ Cada SVG DEVE expressar visualmente, de forma simples mas suficiente, o conceito e a diferença do respectivo modo.
      - ✅ Os SVGs DEVEM permanecer legíveis no GitHub em temas claro e escuro.
    - ✅ Atualizar a página e os SVGs sempre que um modo for criado/removido ou quando sua apresentação visual/semântica mudar.
  - ✅ Criar e manter uma única página `.md` de uso, configuração e estilos de `blockquote`, ligada diretamente pelo `README.md` e pelo RCF aplicável.
    - ✅ Documentar todos os modelos de `blockquote`, inclusive variantes implementadas por HTML derivado com tag/estrutura diferente da tag `<blockquote>`.
    - ✅ Para cada modelo, incluir representação visual fiel à aparência real, por SVG ou imagem adequada, legível no GitHub em temas claro e escuro.
    - ✅ Cada modelo DEVE ser representado pelo menos uma vez.
      - ✅ Quando um mesmo modelo admitir apenas variações de cor, NÃO é necessário ilustrar cada cor; dois exemplos com cores distintas são suficientes.
      - ✅ Quando um mesmo modelo admitir apenas variações de ícone, NÃO é necessário ilustrar cada ícone; dois exemplos com ícones distintos são suficientes.
      - ✅ Se as cores/ícones forem selecionados por nomes arbitrários, documentar todos os nomes disponíveis.
      - ✅ Se os ícones puderem ser informados a partir de links externos, fontes de ícones ou recursos internos, explicar o modo de uso de cada situação e, em caso de recursos internos, listar de forma sucinta, mas completa, todos os disponíveis.
      - ✅ Quando um nome representar combinação de múltiplas cores, inclusive tons distintos, exibir uma pequena paleta visual que mostre a combinação real correspondente.
    - ✅ Explicar, de forma sucinta e suficiente para humanos, sintaxe, estrutura, formas de uso e configurações aplicáveis.
    - ✅ Incluir ao menos um exemplo prático, copiável, funcional sem erro e aplicável a um cenário real.
    - ✅ Atualizar a página e suas ilustrações sempre que estilos, modelos, sintaxe, configuração ou aparência forem adicionados ou alterados.
  - ✅ Garantir que toda documentação de modo de uso contenha pelo menos um exemplo prático que:
    - ✅ simule uso real;
    - ✅ possa ser copiado sem alterações obrigatórias;
    - ✅ seja funcional e sem erro;
    - ✅ demonstre a aplicação concreta do recurso documentado.
  - ✅ Incorporar ao `AGENTS.local.md`, em rota/subarquivo específico, as regras deste TO-DO que constituam modus operandi permanente de codificação/desenvolvimento e atualização/criação do(s) .md.
    - ✅ Essas regras DEVEM ser carregadas sempre — e apenas — quando houver necessidade de:
      - ✅ alterar documentação `.md`;
      - ✅ adicionar/alterar recurso cuja forma de uso exija atualização documental;
      - ✅ atualizar documentação análoga afetada por mudança de comportamento, configuração ou interface de uso.
    - ✅ A regra operacional DEVE exigir que alterações na forma de uso impliquem atualização das páginas correspondentes e de seus exemplos/ilustrações aplicáveis.
  - ✅ Completar metadados de projeto em `package.json` e arquivos equivalentes, quando aplicável.
    - ✅ Informar a URL do repositório upstream.
    - ✅ Informar licença.
    - ✅ Informar autor principal (JeanCarloEM, www.jeancarloem.com).
    - ✅ Preservar/adicionar demais metadados equivalentes aplicáveis ao formato.
  - ✅ Adicionar ao `README.md` link explícito para o repositório upstream.

- ✅ Consolidar COVER como sistema responsivo, extensível e compatível com Hero, preservando integralmente recursos existentes
  - ✅ INSPECIONE RCF, implementação e FTs atuais; **equalize-as** com esta norma. Ela corrige/amplia COVER e NÃO autoriza remoção, regressão, simplificação ou redução de modo/feature existente.
  - ✅ Use `.\.ia.rules\state\requests\evidencias\projeto-cover.pdf` como evidência normativa complementar. **Somente textos, medidas, zonas, setas e determinações explicitamente apresentadas nele são normativas**: as screenshots retratam estado atual parcialmente defeituoso e NÃO são referência visual integral. A própria evidência registra, por exemplo, barras/flag defeituosas em exemplo de cover infinito. Capturas exclusivamente escuras NÃO dispensam claro/escuro. :contentReference[oaicite:0]{index=0}

  - ✅ **Geometria/base**
    - ✅ cover comum: proporção útil obrigatória **1,91:1**;
    - ✅ distinguir e nomear inequivocamente no RCF a **largura/zona do artigo** da **largura/zona da janela**; NÃO tratá-las como equivalentes. O cover comum deve ficar colinear às bordas da zona do artigo. :contentReference[oaicite:1]{index=1}
    - ✅ a região COVER NÃO DEVE possuir scroll próprio/horizontal.
    - ✅ OGs são independentes do cover: qualquer artigo DEVE poder informar opcionalmente OG `1,91:1` e OG `1:1` próprios, sem obrigá-las a reutilizar o cover - por padrão reutilizar se não informado a parte.

  - ✅ **Infinite — imagem única**
    - ✅ ocupa horizontalmente a zona total da janela;
    - ✅ conteúdo centralizado e overflow horizontal oculto;
    - ✅ altura determina a dimensão necessária; largura é automática, preservando a imagem e garantindo que sua **região central útil 1,91:1** ocupe integralmente a altura definida; excedente lateral fica oculto e produz continuidade horizontal. :contentReference[oaicite:2]{index=2}

  - ✅ **Infinite — “3 imagens”**
    - ✅ NÃO interpretar literalmente como três arquivos: composição = `pattern-left` + imagem central + `pattern-right`;
    - ✅ cada pattern PODE ser imagem, cor hexadecimal ou `linear-gradient`;
    - ✅ centro DEVE ser `1,91:1`, colinear à zona do artigo;
    - ✅ `pattern-left` ocupa da borda esquerda da janela/zona infinita até a borda esquerda do centro; `pattern-right`, simetricamente, do centro até a borda direita; junções DEVEM ser contínuas, sem gap/scroll/overflow visível. :contentReference[oaicite:3]{index=3}

  - ✅ **Barras/flag**
    - ✅ cover/z-index NÃO PODE ocultar a flag nem as barras de título.
    - ✅ As duas barras DEVEM aparentar uma estrutura única: inferior sólida; superior RGBA em degradê, do aspecto de vidro translúcido no topo até fusão visualmente perfeita/opaca com a inferior; a extremidade superior permanece minimamente perceptível para comunicar suporte à flag.
    - ✅ O triângulo esquerdo da flag DEVE manter a base/extremidade colinear à extremidade da barra superior conforme diagrama. :contentReference[oaicite:4]{index=4} :contentReference[oaicite:5]{index=5}

  - ✅ **Modos viewport/header**
    - ✅ `FullWindow`: ocupar a janela responsivamente usando **uma única dimensão como referência (`height-fit` XOR `width-fit`)**, calculando a outra automaticamente, preservando proporção e preenchimento; priorizar CSS puro. Header inicialmente RGBA translúcido, opacidade central configurável (**30% padrão conforme evidência**) e override opcional por página/post no `.md`; ao scroll, retornar ao comportamento normal com fundo sólido.
    - ✅ `windowHeight`: semântica de `FullWindow`, mas ajuste predeterminado pela altura. :contentReference[oaicite:6]{index=6}
    - ✅ `windowWidth`:semântica de `FullWindow`, mas ajuste predeterminado pela largura. confronte RCF/implementação, preserve o modo equivalente existente como canônico/alias e garanta a semântica descrita — ajuste pela largura sem jamais ultrapassar a altura da janela. :contentReference[oaicite:7]{index=7}
    - ✅ `innerFullWindow`: equivalente ao `FullWindow`, mas começa abaixo do header; área vertical = viewport menos **altura integral do header**; header NÃO usa opacidade/configuração específica desse modo. :contentReference[oaicite:8]{index=8}
    - ✅ `innerWindowHeight`: equivalente ao modo por altura, porém abaixo do header e calculado sobre viewport menos sua altura integral, igualmente sem comportamento/configuração de opacidade. :contentReference[oaicite:9]{index=9}
    - ✅ `innerWindowWidth`: equivalente ao modo WindowWidth, porém abaixo do header e calculado sobre viewport menos sua altura integral, igualmente sem comportamento/configuração de opacidade. :contentReference[oaicite:10]{index=10}
    - ✅ Para o correspondente interno do comportamento _fit-by-width_, reconcilie a inconsistência nominal do PDF pela semântica e aliases reais; NÃO invente modo redundante nem elimine equivalente existente.

  - ✅ **Hero Section — contrato comum a TODOS os covers**
    - ✅ Hero é uma camada de conteúdo **sobre a área útil do cover**, nunca sobre excedentes/patterns decorativos, header, barras/flag ou área externa.
    - ✅ Configuração DEVE ser declarativa no `.md` e permitir, separadamente: conteúdo textual Markdown (inclusive múltiplos parágrafos/inline Markdown), botão opcional (`label` + `link`) e posicionamento/alinhamento.
    - ✅ Disponibilizar obrigatoriamente 6 zonas-base:
      1. ✅ superior-esquerda;
      2. ✅ superior-direita;
      3. ✅ inferior-esquerda;
      4. ✅ inferior-direita;
      5. ✅ `center`: região central protegida por padding substancial;
      6. ✅ `full`: mesma área central útil, porém com padding periférico reduzido.
    - ✅ NÃO multiplique arbitrariamente presets para cobrir alinhamentos usuais: modele **zona + alinhamento horizontal/vertical + largura/limites de conteúdo** como propriedades ortogonais, quando isso atender melhor aos layouts existentes. Outras disposições usuais DEVEM ser expressáveis pelo `.md` sem CSS/HTML específico por artigo.
    - ✅ O Hero DEVE seguir práticas profissionais: hierarquia tipográfica clara, largura de leitura controlada, contraste real sobre fundos variáveis, CTA inequívoco sem aparência publicitária gratuita, espaçamento consistente, ausência de colisões/cortes, foco/teclado e semântica acessíveis, links distinguíveis, adaptação automática a viewport/DPR/orientação e preservação da área visual relevante do cover.
    - ✅ Contraste NÃO DEVE depender de uma imagem específica: disponibilize mecanismo temático/configurável de proteção de legibilidade (overlay/gradiente/text treatment ou equivalente), discreto e desacoplado da própria imagem.
    - ✅ Conteúdo Hero NÃO DEVE provocar scroll dentro do cover; em viewport insuficiente, adapte tipografia/espaçamento/layout de forma responsiva, sem ocultar conteúdo essencial nem sobrepor regiões vedadas.
    - ✅ **CSS-first obrigatório**: priorize layout, `object-fit`/`object-position`, Grid/Flex, custom properties, media/container queries e recursos nativos adequados. Biblioteca externa somente se mantida, open source, tecnicamente compatível e demonstradamente superior a solução nativa sem custo/desacoplamento desproporcional.

  - ✅ **RCF/configuração**
    - ✅ Centralize modelo, zonas, modos, aliases, defaults e precedências; NÃO espalhe regras equivalentes.
    - ✅ O schema do `.md` DEVE ser simples para uso comum, extensível para composição avançada e validável no build; propriedades ausentes preservam defaults vigentes.
    - ✅ Defina claramente precedência entre configuração global → modo → página/post, sem inferir valores inexistentes.
    - ✅ Preserve os contratos já vigentes que não conflitarem materialmente com esta especialização.
