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

- ⏳ Corrigir integralmente as não aderências da TO-DO de topo `- ✅ Consolidar COVER como sistema responsivo, extensível e compatível com Hero, preservando integralmente recursos existentes`

  Foram identificadas **não aderências, rejeições explícitas, irregularidades e ajustes obrigatórios**. Dois erros vêm sendo reiterados apesar das sucessivas explicações e evidências e **NÃO DEVEM voltar a ser interpretados da mesma forma**:
  1. **FLAG:** o posicionamento e, sobretudo, sua linha/eixo de ancoragem gravitacional simulada continuam sendo interpretados incorretamente.
  2. **Barra de título:** continua sendo ignorado que, embora visualmente pareça um único componente, ela possui **duas partes funcional e visualmente distintas — superior e inferior — deliberadamente definidas dessa forma**.

  ## Explicação necessária

  A pasta de evidências contém **dezenas de referências**, muitas manualmente editadas com setas, tracejados e textos explicativos, além de PDF legível sem OCR e outros recursos destinados precisamente a eliminar ambiguidade. Ainda assim, sucessivas implementações continuam reproduzindo interpretação visual incorreta.

  **Não é aceitável reiterar a mesma interpretação já rejeitada.** As explicações foram sucessivamente revistas, inclusive por múltiplas IAs, e acompanhadas de evidências específicas. Portanto, antes de codificar novamente, a IA DEVE confrontar **RCF + código real + conjunto das evidências**, identificar a causa da interpretação equivocada e implementar o comportamento solicitado; NÃO apenas produzir nova aproximação visual.

  ## Mero exemplo ≠ escopo restrito

  Para explicar o defeito foi escolhido apenas **um artigo**, demonstrando simultaneamente os problemas da barra de título e da FLAG. Isso **NÃO limita o escopo ao modo/tipo mostrado**.

  A regra aplica-se a **todos os modos/tipos de COVER de artigo em que título/FLAG devam aparecer sobre o COVER**.

  Quanto aos modos exatos, **NÃO presuma**: verifique no RCF e no código. Até onde o dev recorda, existe apenas um modo em que o título não permanece sobre o COVER, com nome equivalente a `fullwindow` (ou semelhante), incluindo suas variações, salvo quando alguma variação responsiva, determinada pelas regras/proporção da janela, assume aparência/comportamento equivalente a outro modelo. **Essa lembrança é contexto, não especificação definitiva**; confirme-a documentalmente e, se ainda necessário, com o dev.

  Já a regra de ancoragem da FLAG independe dessa classificação: **sempre que a FLAG for exibida em artigo, ela DEVE estar vinculada à barra de título principal**. Não extrapole esta regra para CARDs ou outros componentes.

  `evidencia18.png` é uma captura real do estado atual e demonstra simultaneamente os defeitos da FLAG e da barra de título.

  ## FLAG — linha de ancoragem gravitacional

  Em `D:\trampo\jeancarloem.com.blog\.ia.rules\state\requests\evidencias\`, `evidencia17.pdf` demonstra conceitualmente a composição visual da FLAG e distingue três linhas:
  1. linha de topo;
  2. linha de sustentação/ancoragem gravitacional simulada;
  3. linha de base.

  A FLAG usada como referência é `flagVermelho.svg`; salvo a cor, o mesmo conceito visual aplica-se a `flagCinza.svg`.

  `evidencia17.pdf` **NÃO descreve a estrutura técnica interna dos SVGs, sua montagem ou geometria real**. Seu objetivo é exclusivamente tornar inequívoca a distinção visual necessária para determinar o alinhamento correto.

  ### ERRO REITERADO — CORRIGIR

  **Alinhar a FLAG pela sua linha de topo, como ocorre em `evidencia18.png`, está ERRADO e já foi rejeitado.**

  A linha de referência correta é a **linha horizontal correspondente à base do triângulo traseiro da FLAG**, isto é, a base do elemento que simula a dobra traseira.

  Essa linha DEVE ficar **colinear à linha superior da barra de título**, de modo que a FLAG produza visualmente a impressão de estar **apoiada/sustentada/pendurada pela barra**, e NÃO simplesmente posicionada a partir do topo de sua caixa/imagem.

  **CORRIJA pela linha de sustentação gravitacional. NÃO reincida no alinhamento pela linha de topo.**

  ### SVG × CSS

  O projeto atualmente utiliza SVG pronto para a FLAG. Implementação equivalente em CSS **NÃO DEVE ser descartada**, mas somente é aceitável se cumulativamente:
  1. reproduzir visualmente o resultado dos SVGs;
  2. preservar exatamente o alinhamento, posicionamento e sustentação simulada pela **base horizontal do triângulo traseiro**;
  3. produzir custo total de tamanho inferior ao uso somado dos SVGs atuais;
  4. permitir que a **frente da FLAG** ajuste sua altura ao conteúdo sem deformar a proporção do triângulo inferior que compõe sua extremidade.

  > A frente da FLAG pode ser entendida, apenas para esta explicação, como a união visual de um retângulo superior com um triângulo inferior. É **esse triângulo inferior da frente** cuja proporção NÃO deve ser deformada pela variação de altura.

  Não substitua SVG por CSS apenas por preferência técnica; a alternativa DEVE demonstrar vantagem e equivalência - incluindo exatidão visual.

  ## Barra de título

  `como-deveria-ser` demonstra o resultado visual esperado para o mesmo artigo mostrado em `evidencia18.png`.

  A implementação atual também interpreta incorretamente a barra de título. **Embora visualmente as duas partes devam parecer uma única barra, elas possuem regiões superior e inferior distintas, e essa separação existe por propósito. NÃO a elimine por simplificação.**

  A implementação técnica PODE não utilizar literalmente dois componentes, caso exista solução melhor, **desde que reproduza integralmente o mesmo resultado visual e funcional**.

  O resultado DEVE garantir:
  - ✅ **efeito completo de vidro**, perceptivelmente fumê;
  - ✅ conteúdo localizado atrás da barra visivelmente desfocado, produzindo o efeito de vidro;
  - ✅ sombra projetada sobre o conteúdo **externo**, sem sombrear indevidamente o próprio COVER ou o conteúdo interno/atrás do vidro;
  - ✅ FLAG perfeitamente alinhada pela **base do triângulo traseiro** ao topo da barra, produzindo a impressão de sustentação;
  - ✅ título ocupando **somente a região inferior** da composição;
  - ✅ título no **amarelo do logotipo**, com `text-shadow`;
  - ✅ **nenhum** adereço indevido no título: sem `underline`, `borderline`, ícone de fonte ou equivalente comum à links (mesmo o título sendo um link);
  - ✅ as regiões superior e inferior visualmente integradas como uma única barra, sem perder suas funções distintas;
  - ✅ FLAG suficientemente afastada da extremidade esquerda para não parecer colada, mas sem deslocamento excessivo.

  ## Conteúdo interno da FLAG

  A FLAG DEVE permanecer legível e proporcional, porém **visualmente secundária**: ela NÃO deve competir com o título nem se tornar elemento dominante.

  O texto interno DEVE:
  - ✅ distribuir-se adequadamente nos eixos horizontal e vertical;
  - ✅ permanecer centralizado;
  - ✅ utilizar tamanho e `weight` adequados a cada linha conforme sua função/conteúdo;
  - ✅ preencher visualmente bem a área útil, sem parecer vazio;
  - ✅ não extrapolar nem pressionar os limites visuais da FLAG;
  - ✅ adaptar-se corretamente a conteúdos diferentes, preservando hierarquia e equilíbrio.

  ## Validação obrigatória

  A correção NÃO está concluída enquanto:
  - ✅ a FLAG deixou de ser posicionada pela linha de topo;
  - ✅ a base do triângulo traseiro está colinear à linha superior da barra;
  - ✅ a composição da barra preserva a distinção intencional entre região superior e inferior;
  - ✅ o título ocupa somente a região correta e não conserva os adereços rejeitados;
  - ✅ vidro, blur, sombra, cor, hierarquia e posicionamento convergem materialmente a `como-deveria-ser`;
  - ✅ a solução funciona no exemplo mostrado e nos demais modos de artigo aos quais a mesma regra se aplica;
  - ✅ não houve regressão de recurso existente nem alteração fora do necessário.

  **Inspecione primeiro; determine o comportamento real; corrija a causa, não o sintoma. Estas interpretações já foram reiteradamente explicadas e rejeitadas: NÃO repita novamente a implementação incorreta.**

- [ ] **Migrar TTS e edição redacional para a governança canônica de `agents.md`, preservando especializações locais**
  - **Objetivo**
    - A governança `agents.md` passou a incorporar grande parte, possivelmente a totalidade, das regras, diretrizes, capacidades e/ou scripts relacionados a **TTS** e **edição redacional/autoral**.
    - Este repositório DEVE passar a consumir **prioritariamente os mecanismos oficiais fornecidos por `agents.md`**, preservando apenas especializações realmente locais pelas vias oficiais de extensão.
    - É PROIBIDO manter implementação paralela, duplicada ou divergente quando a capacidade equivalente já existir canonicamente em `agents.md`.

  - **1. Inventário e comparação obrigatórios**
    - Antes de remover ou migrar qualquer coisa, identificar exatamente:
      - o que existe atualmente neste repositório;
      - o que já foi absorvido por `agents.md`;
      - o que foi absorvido parcialmente;
      - o que NÃO foi absorvido;
      - diferenças de comportamento, força normativa, escopo, validação e implementação.
    - Comparar normas, RCFs, scripts, Skills, SubAgents, Scenarios, hooks, testes e demais artefatos relacionados a TTS/edição.
    - NÃO presumir equivalência apenas por nome ou finalidade aparente.
    - Registrar uma matriz mínima:

      ```text
      capacidade local
      → equivalente em agents.md?
      → equivalência total/parcial/ausente
      → especialização local necessária?
      → destino final
      ```

  - **2. Precedência**
    - Quando `agents.md` já fornecer capacidade equivalente ou superior, sua implementação/norma DEVE ser tratada como **fonte canônica**.
    - Especializações deste repositório DEVEM apenas **estender**, nunca duplicar, substituir ou regredir a capacidade canônica.
    - É PROIBIDO preservar versão local apenas por compatibilidade histórica se ela já tiver sido absorvida adequadamente por `agents.md`.

  - **3. Extensões locais**
    - Tudo que continuar específico deste repositório DEVE ser migrado para os mecanismos oficiais autorizados, conforme a arquitetura real, como:
      - hooks;
      - `agents.local.md` / equivalente vigente;
      - Skills;
      - SubAgents;
      - Scenarios;
      - scripts/extensões oficialmente previstas.
    - Usar o **menor mecanismo suficiente**, sem criar fluxo paralelo.
    - A extensão DEVE:
      - depender da capacidade canônica, não copiá-la;
      - conter somente o delta/especialização local;
      - preservar compatibilidade futura;
      - permanecer claramente separada da norma base;
      - não sobrescrever evolução posterior de `agents.md` sem necessidade explícita.

  - **4. Regra absoluta de não regressão**
    - A migração NÃO PODE:
      - perder qualquer feature válida atualmente existente;
      - reduzir força, rigor ou escopo normativo;
      - eliminar especialização necessária;
      - substituir feature nova/superior de `agents.md` por implementação local antiga;
      - congelar comportamento do repositório em versão anterior;
      - duplicar regra base dentro da extensão local.
    - Quando `agents.md` trouxer capacidade superior à local, **preservar a superior** e adaptar apenas o delta local.

  - **5. Ordem obrigatória da migração**
    1. inventariar estado local;
    2. inventariar estado canônico de `agents.md`;
    3. classificar cada capacidade como:
       - absorvida integralmente;
       - absorvida parcialmente;
       - não absorvida;
    4. identificar especializações realmente locais;
    5. migrar essas especializações para hooks/extensões oficiais;
    6. validar equivalência funcional/normativa;
    7. somente então remover do repositório:
       - tudo que já foi absorvido integralmente por `agents.md`;
       - tudo que não havia sido absorvido, mas foi migrado com sucesso para extensão oficial;
       - duplicações, adapters temporários e artefatos obsoletos.

  - **6. Validação**
    - Antes da exclusão final, provar para cada capacidade:
      - fonte canônica atual;
      - extensão local, se existir;
      - equivalência ou superioridade funcional;
      - equivalência ou superioridade normativa;
      - testes correspondentes;
      - ausência de regressão.
    - Validar especialmente:
      - TTS;
      - edição redacional/autoral;
      - normalização;
      - hooks;
      - roteamento;
      - testes;
      - build;
      - comportamento sem extensão local;
      - comportamento com extensões locais habilitadas.

  - **7. Critério de aceite**
    - Somente concluir quando:
      1. toda capacidade local tiver sido classificada;
      2. `agents.md` for usado como fonte canônica sempre que aplicável;
      3. especializações restantes estiverem exclusivamente em mecanismos oficiais de extensão;
      4. nenhuma implementação paralela desnecessária permanecer;
      5. nenhuma feature local válida tiver sido perdida;
      6. nenhuma feature nova/superior de `agents.md` tiver sido regredida;
      7. artefatos obsoletos/duplicados tiverem sido removidos;
      8. testes comprovarem equivalência ou superioridade após a migração;
      9. o repositório estiver plenamente aderente à estratégia `agents.md + extensões/hooks locais`.

- [ ] **Disponibilizar a impressão IEEE também em dispositivos móveis, preservando carregamento pós-crítico e desempenho**
  - Verificar se existe regra, detecção de dispositivo, norma ou implementação que **impeça em mobile o download/inicialização da formatação de impressão IEEE**. Se existir, removê-la/adaptá-la para que o recurso funcione em dispositivos móveis **com equivalência funcional ao desktop**, considerando a compatibilidade atual entre navegadores móveis e impressoras.

  - O recurso IEEE DEVE:
    - estar disponível em **desktop e mobile**;
    - produzir, dentro das capacidades reais do navegador/impressora, o **mesmo layout, conteúdo, paginação e configuração de impressão**;
    - NÃO possuir exclusão baseada apenas em `mobile`, user-agent, largura de tela ou orientação;
    - preservar fallbacks somente quando houver limitação técnica comprovada.

  - **Carregamento pós-crítico obrigatório**
    - Como impressão IEEE NÃO integra o conteúdo necessário à visualização normal da página, seus recursos DEVEM permanecer fora do caminho crítico.
    - O download/inicialização DEVE ocorrer **somente após a conclusão do carregamento útil da página**, incluindo imagens e demais recursos relevantes, inclusive os não acompanhados diretamente pelos scripts atuais, utilizando mecanismo robusto de pós-carregamento/idle em vez de timeout arbitrário isolado.
    - Priorizar mecanismos adequados, conforme compatibilidade real, como:
      - `load`/estado completo do documento;
      - `requestIdleCallback` com fallback;
      - carregamento dinâmico tardio;
      - prioridade de rede baixa (`fetchpriority`, quando aplicável);
      - inicialização desacoplada da renderização/hidratação principal.
    - O processamento DEVE ser fracionado/assíncrono quando necessário para **não bloquear a main thread, não causar travamento, jank ou aumento relevante de interação/CPU**.

  - O recurso DEVE ser **disparado pela página, mas tratado como capacidade posterior e não crítica**, de modo que sua transferência/processamento tardios não atrasem a disponibilidade visual/interativa inicial.

  - NÃO utilizar ofuscação, ocultação ou técnicas destinadas a impedir artificialmente que PageSpeed/Lighthouse ou outras ferramentas de observabilidade detectem trabalho efetivamente executado. A otimização DEVE decorrer de **carregamento legitimamente tardio, baixa prioridade e ausência do caminho crítico**, e ser verificável por ferramentas de desempenho.

  - Antes de implementar:
    1. localizar a regra atual de desktop/mobile e sua justificativa;
    2. identificar todos os recursos IEEE, dependências e gatilhos;
    3. medir seu impacto atual em rede, CPU, main thread e métricas Web Vitals;
    4. escolher o mecanismo pós-crítico mais tardio que ainda garanta disponibilidade confiável para impressão.

  - Validar em desktop e mobile:
    - recurso IEEE disponível e funcional;
    - impressão equivalente;
    - resize/orientação sem regressão;
    - página utilizável antes da carga IEEE;
    - nenhum recurso IEEE bloqueando HTML/CSS/JS/imagens essenciais;
    - nenhuma regressão significativa em LCP, INP, CLS ou carregamento;
    - recurso carregado/inicializado posteriormente conforme projetado;
    - ausência de dependência de heurísticas frágeis de user-agent.

  - **Aceite:** mobile e desktop DEVEM possuir a mesma capacidade de impressão IEEE, carregada somente na fase pós-crítica/idle, sem bloquear a página, sem regressão funcional ou visual e sem mecanismos artificiais de evasão de métricas.

- [ ] **Criar templates visuais de `blockquote` a partir de `e1.png`–`e6.png`, com temas claro/escuro e aliases centralizados**
  - **Objetivo**
    - Na pasta de evidências, usar `e1.png` a `e6.png` como referência visual para criar novos estilos/templates de `blockquote`, preservando fidelidade visual, integração com os temas claro/escuro e precedência absoluta do estilo IEEE na impressão.
    - Antes de implementar, inspecionar templates, classes, aliases, configuração central, temas, pipeline de build e estilos de impressão existentes para evitar colisões, duplicação ou regressão.

  - **1. Templates derivados das evidências**
    - Criar **5 modelos distintos**:
      - `e1.png` + `e2.png` → **um único template**, pois representam o mesmo estilo com variação/customização de cor;
      - `e3.png` → template próprio;
      - `e4.png` → template próprio;
      - `e5.png` → template próprio;
      - `e6.png` → template próprio.
    - Gerar para cada modelo nome **semântico, estável e único**, sem colisão com templates/classes/aliases existentes e sem depender de `e1`, `e2` etc.
    - `e1/e2` DEVEM compartilhar a mesma estrutura e permitir parametrização de cor.
    - `e3` DEVE preservar seu **pequeno recuo à esquerda** em relação ao alinhamento normal dos parágrafos.
    - Em `e4` e `e5`, o fundo da screenshot DEVE ser **desconsiderado** como parte do template.
    - Em `e6`, cores, contraste, adornos e superfícies DEVEM ser **aderentes ao tema ativo**, sem assumir cor fixa incompatível com claro/escuro.

  - **2. Tema claro e escuro — obrigatório para todos**
    - **TODO template de `blockquote`, novo ou já existente, DEVE possuir apresentação válida, atraente e legível nos modos claro e escuro.**
    - Não basta inverter cores mecanicamente: cada modo DEVE preservar:
      - identidade visual do template;
      - contraste adequado;
      - hierarquia;
      - legibilidade;
      - beleza/atratividade;
      - coerência com o restante do tema;
      - distinção entre fundo, bordas, texto, destaques e adornos.
    - Cores fixas só PODEM existir quando permanecerem corretas nos dois modos; caso contrário, usar tokens/variáveis temáticas.
    - Em especial, o template derivado de `e6.png` DEVE ter sua paleta **semanticamente vinculada ao tema**, adaptando-se automaticamente ao claro/escuro.
    - Validar também templates preexistentes e, se algum estiver inadequado em um dos modos, corrigi-lo sem alterar sua identidade visual ou causar regressão.

  - **3. Tipografia e adornos**
    - Mesmo que as evidências usem outras fontes, os templates DEVEM utilizar a **font-family canônica já definida no projeto**.
    - Somente adornos estritamente decorativos PODEM usar tipografia/forma diferenciada quando necessária para reproduzir o modelo.
    - NÃO introduzir nova fonte global apenas para aproximar as screenshots.

  - **4. Exclusivamente visual para web**
    - Esses templates são **somente estilos de apresentação web**.
    - Em impressão, preview de impressão e saídas equivalentes, os estilos particulares de `blockquote` NÃO DEVEM prevalecer.
    - O estilo IEEE já normatizado DEVE ter **precedência absoluta**.
    - Nenhum template novo ou existente PODE contaminar a impressão IEEE com:
      - cor;
      - fundo;
      - borda;
      - margem;
      - adorno;
      - tipografia;
      - estrutura visual específica da web.

  - **5. Configuração centralizada**
    - Criar, se inexistente, ou ampliar o mecanismo canônico existente para definir centralmente:
      - **template primário**;
      - **template secundário/destaque**.
    - NÃO criar configuração paralela se já existir mecanismo equivalente.

    - Comportamento padrão:

      ```text
      blockquote comum        → template primário
      blockquote "destaque"   → template secundário configurado
      ```

    - Valores iniciais obrigatórios:
      - **primário** → template equivalente a `e6.png`;
      - **secundário / `destaque`** → `futuristic`.

  - **6. Aliases dinâmicos**
    - O primário e `destaque` DEVEM ser **aliases configuráveis**, não templates concretos congelados.

      ```text
      padrão    → configuração central → template concreto
      destaque  → configuração central → template concreto
      ```

    - Alterar qualquer alias central DEVE atualizar automaticamente todas as páginas dependentes após rebuild, sem editar conteúdo individual.
    - O conteúdo NÃO DEVE persistir o template concreto resultante do alias de forma que impeça futura alteração global.

  - **7. Uso explícito continua permitido**
    - A padronização NÃO DEVE impedir seleção direta de qualquer template concreto.
    - Precedência obrigatória:

      ```text
      template explícito
      >
      alias "destaque"
      >
      template primário
      ```

    - Portanto:
      - sem indicação → primário (`e6` por padrão inicial);
      - `destaque` → template atualmente apontado pelo secundário (`futuristic` inicialmente);
      - template nominal explícito → usar exatamente o template solicitado.

  - **8. Integração com build**
    - A resolução dos aliases DEVE ocorrer de forma compatível com o pipeline real e ser **detectável em build-time**.
    - Alterações na configuração central do primário/secundário DEVEM invalidar/regerar automaticamente as páginas dependentes.
    - A resolução DEVE continuar correta em:
      - tema claro;
      - tema escuro;
      - troca automática/manual de tema;
      - rebuild completo/incremental quando suportado.

  - **9. Implementação**
    - Reutilizar arquitetura, tokens temáticos, CSS, componentes e mecanismos existentes sempre que equivalentes.
    - Separar claramente:
      - estrutura comum;
      - template visual;
      - parâmetros/customizações;
      - tokens claro/escuro;
      - aliases/configuração;
      - overrides exclusivos de impressão IEEE.
    - Evitar:
      - CSS duplicado;
      - hardcode por artigo;
      - estilos inline;
      - seletores excessivamente específicos;
      - `!important` sem necessidade comprovada;
      - duplicação de lógica entre aliases/templates/temas.

  - **10. Validação obrigatória**
    - Comparar visualmente cada implementação com sua evidência correspondente.
    - Validar:
      - `e1/e2` como um único modelo parametrizável por cor;
      - fidelidade individual de `e3`, `e4`, `e5` e `e6`;
      - recuo específico de `e3`;
      - exclusão dos fundos externos de `e4/e5`;
      - adaptação temática de `e6`;
      - todos os templates em **claro e escuro**;
      - contraste, legibilidade e atratividade em ambos;
      - font-family canônica;
      - nomes sem colisão;
      - primário → `e6`;
      - `destaque` → `futuristic`;
      - troca dos aliases refletida globalmente após rebuild;
      - escolha explícita de templates funcionando;
      - impressão IEEE visualmente inalterada.

  - **Critério absoluto de aceite**
    - Concluir somente quando:
      1. existirem os **5 templates** derivados de `e1`–`e6`, sem colisão;
      2. `e1/e2` forem um único template com cor customizável;
      3. `e3` preservar seu recuo;
      4. fundos externos de `e4/e5` não integrarem os templates;
      5. `e6` possuir cores aderentes e responsivas ao tema;
      6. **todos os blockquotes** funcionarem e permanecerem visualmente atraentes nos modos claro e escuro;
      7. tipografia seguir o projeto, salvo adornos justificáveis;
      8. estilos web não afetarem IEEE;
      9. existir configuração central de primário e secundário/destaque;
      10. o primário apontar inicialmente para o template equivalente a `e6`;
      11. `destaque` apontar inicialmente para `futuristic`;
      12. ambos funcionarem como aliases dinâmicos resolvidos pelo build;
      13. alteração central regenerar automaticamente páginas dependentes;
      14. templates explícitos continuarem selecionáveis;
      15. nenhuma funcionalidade, tema, impressão ou estilo existente regredir.
