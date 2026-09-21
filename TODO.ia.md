# RCF — Governança da TO-DO

- [ ] Equalizar e executar as TO-DOs como frentes convergentes de um único objetivo

Este arquivo preserva demandas do desenvolvedor. Estados operacionais seguem a governança canônica; aprovação humana efetiva remove integralmente a frente correspondente.

# TO-DOs

✅ Manter documentação de uso, referências normativas e metadados do projeto sincronizados com o estado real
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

✅ **Migrar TTS e edição redacional para a governança canônica de `agents.md`, preservando especializações locais**
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

✅ **Disponibilizar a impressão IEEE também em dispositivos móveis, preservando carregamento pós-crítico e desempenho**
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

✅ Ajustar a skill/subagent preexistente de edição, revisão autoral e pré-publicação para normatizar capitalização reverencial e preservação de ênfases autorais
  - A implementação DEVE primeiro inspecionar a skill/subagent, prompts, normas, RCFs e contratos efetivamente existentes e ajustar o ponto normativo correto, evitando duplicação, regras paralelas ou divergentes.

  - Fora de citações, toda referência **inequívoca ao Deus cristão — Pai/Deus, Jesus Cristo ou Espírito Santo — DEVE ser integralmente capitalizada** quando realizada por:
    - nome próprio;
    - nome, forma, variante ou transliteração inequivocamente utilizada como nome divino cristão;
    - designação/título inequivocamente referido ao Deus cristão no contexto;
    - pronome pessoal;
    - pronome demonstrativo;
    - contração;
    - outra forma pronominal/nominal cuja referência ao Ser divino cristão seja inequívoca pelo próprio texto ou contexto.

  - Isso inclui, sem se limitar a, nomes e variantes inequivocamente cristãs como:
    - `DEUS`;
    - `JESUS`;
    - `JESUS CRISTO`;
    - `CRISTO`;
    - `ESPÍRITO SANTO`;
    - `JEOVÁ`;
    - `JAVÉ`;
    - `YHWH`;
    - outras grafias, transliterações, variantes ou nomes próprios que, no contexto, sejam **inequivocamente destinados ao Deus cristão**.

  - Também podem ser abrangidas formas contextuais como `PAI`, `FILHO`, `SENHOR`, `ELE`, `AQUELE`, `DELE`, `NELE` e equivalentes, **somente quando sua referência ao Deus cristão for inequívoca**.

  - A enumeração acima é exemplificativa, NÃO exaustiva: a implementação NÃO DEVE limitar a regra a um dicionário fechado de `Deus`, `Jesus` e `Espírito Santo`.

  - Como o corpus pode conter **artigos teológicos, apologéticos, históricos ou comparativos**, menções a outras divindades, deuses, seres religiosos ou concepções de divindade PODEM ser frequentes e legítimas.

  - Portanto, a mera ocorrência lexical de `deus`, `senhor`, `pai`, `filho`, `espírito`, nomes divinos, títulos religiosos ou formas análogas **NÃO é suficiente** para aplicar a capitalização reverencial.

  - A skill/subagent DEVE determinar **a qual referente a expressão efetivamente se aplica** antes de capitalizá-la.

  - A capitalização reverencial aqui definida DEVE ser aplicada **exclusivamente quando o referente for inequivocamente o Deus cristão, Jesus Cristo ou o Espírito Santo**.

  - Quando `deus` ou expressão análoga se referir a:
    - outra divindade;
    - deus de outra religião;
    - divindade mitológica;
    - conceito genérico de divindade;
    - classe/categoria de deuses;
    - personagem tratado como deus;
    - referente cuja identidade religiosa seja ambígua;
    - qualquer outro ente que NÃO seja inequivocamente o Deus cristão;
      a capitalização reverencial desta norma **NÃO DEVE ser aplicada**.

  - Exemplos conceituais:
    - `o deus Baal` NÃO DEVE tornar-se `o DEUS Baal` por esta regra;
    - `os deuses gregos` NÃO DEVE tornar-se `os DEUSES gregos`;
    - `o deus daquela religião` NÃO DEVE ser capitalizado reverencialmente sem identificação inequívoca;
    - `Deus criou os céus e a terra`, quando o contexto identificar inequivocamente o Deus cristão, DEVE tornar-se `DEUS criou os céus e a terra`.

  - A existência de terminologia cristã nas proximidades NÃO autoriza, por si só, a inferência de que toda ocorrência de `deus` ou termo semelhante tenha o Deus cristão como referente.

  - Em construções comparativas — p.ex., entre o Deus cristão e outras divindades — cada ocorrência DEVE ser resolvida individualmente conforme seu referente real.

  - É PROIBIDO capitalizar com base em:
    - mera possibilidade;
    - frequência estatística do corpus;
    - assunto geral do artigo;
    - proximidade lexical;
    - interpretação teológica incerta;
    - antecedente ambíguo.

  - Na dúvida material sobre o referente, a forma existente DEVE ser preservada; a skill/subagent NÃO DEVE inventar certeza semântica.

  - Quando uma mesma ocorrência textual contiver múltiplas formas correferentes e uma delas identificar o referente de maneira mais estrita/explícita, **somente a forma mais estrita DEVE receber a capitalização reverencial adicional**.
    - Ex.: `então aquele Jesus que um dia foi pendurado no madeiro` → `então aquele JESUS que um dia foi pendurado no madeiro`.
    - Embora `aquele` tenha `Jesus` como referente, ele DEVE permanecer em minúsculo porque o próprio nome já realiza, na mesma construção, a identificação mais estrita.
    - Ex.: `aquele Espírito Santo que os discípulos receberam` → `aquele ESPÍRITO SANTO que os discípulos receberam`, e NÃO `AQUELE ESPÍRITO SANTO`.
    - Ex.: `o próprio Jeová declarou` → `o próprio JEOVÁ declarou`, sem capitalizar elementos correferenciais ou modificadores que não sejam necessários.
    - Se a forma explícita inexistir e o contexto tornar o demonstrativo/pronome inequívoco, a capitalização passa a aplicar-se a ele: `aquele` → `AQUELE`, `ele` → `ELE`, `dele` → `DELE`, etc.

  - Essa regra de especificidade DEVE impedir capitalização redundante de múltiplos elementos da mesma cadeia referencial sem necessidade, preservando naturalidade, legibilidade e intenção autoral.

  - **Citações são exceção à aplicação automática da capitalização reverencial.**
    - A regra NÃO DEVE alterar automaticamente referências divinas dentro de:
      - citações inline delimitadas por aspas;
      - `blockquote`;
      - demais estruturas que a norma existente reconheça inequivocamente como citação.

    - Portanto, uma ocorrência de `Deus`, `Jesus`, `Espírito Santo`, `Jeová`, `Javé` ou equivalente dentro de uma citação NÃO DEVE ser transformada automaticamente em caixa alta apenas por esta regra.
    - O texto citado DEVE preservar sua capitalização de origem/editorial, salvo outra correção explicitamente autorizada pelas normas aplicáveis.

  - Independentemente de ser texto autoral ou citação, **ênfases em maiúsculas intencionalmente introduzidas pelo autor/editor DEVEM ser preservadas**.
    - Se uma palavra ou expressão foi deliberadamente deixada em CAIXA ALTA, a revisão NÃO DEVE reduzir sua capitalização.
    - Se a IA/subagent reescrever o trecho, o equivalente semântico correspondente DEVE preservar essa ênfase em caixa alta.
    - Essa preservação aplica-se inclusive dentro de citações.
    - A capitalização autoral preexistente NÃO DEVE ser removida apenas porque a regra automática teria produzido outra forma.

  - Exceção: **frase ou sentença inteira em caixa alta DEVE ser presumida erro tipográfico/editorial, NÃO ênfase lexical**, e DEVE ser normalizada segundo a capitalização adequada ao texto, preservando apenas eventuais ênfases localizadas que possam ser inequivocamente determinadas.

  - A regra de sentença inteira em caixa alta NÃO DEVE ser usada para apagar, após a normalização:
    - capitalizações reverenciais aplicáveis;
    - nomes próprios;
    - siglas;
    - destaques pontuais legítimos;
    - outras capitalizações exigidas pelas normas editoriais.

  - A precedência normativa DEVE ser:
    1. identificar se o trecho é citação;
    2. identificar e preservar ênfases autorais/editoriais localizadas em caixa alta;
    3. normalizar frases/sentenças integralmente em caixa alta quando configurarem erro;
    4. fora de citações, resolver semanticamente o referente de cada expressão potencialmente divina;
    5. somente quando o referente for inequívoco, determinar se corresponde ao Deus cristão, Jesus Cristo ou Espírito Santo;
    6. aplicar a capitalização reverencial apenas às referências cristãs inequivocamente identificadas;
    7. entre referências correferentes concorrentes na mesma construção, capitalizar apenas a forma semanticamente mais estrita/explícita;
    8. preservar toda capitalização legítima já existente durante qualquer reescrita.

  - A implementação NÃO DEVE depender exclusivamente de substituições cegas, regex ou lista fechada de palavras:
    - DEVE considerar contexto, correferência e estrutura suficientes para distinguir, por exemplo, `deus`, `senhor`, `ele`, `aquele`, `dele`, `nele`, `pai`, `filho` ou `espírito` referentes ao Deus cristão daqueles referentes a outras divindades, seres humanos ou outros entes;
    - DEVE reconhecer nomes divinos cristãos inequívocos mesmo quando forem variantes não enumeradas explicitamente nesta TO-DO;
    - DEVE distinguir ocorrências diferentes da mesma palavra dentro de um mesmo artigo, parágrafo ou sentença quando seus referentes forem distintos;
    - PODE utilizar léxico/lista de nomes conhecidos como apoio, mas NÃO como único critério quando a decisão depender de contexto.

  - Caso a skill/subagent atual não possua contexto suficiente para determinar o referente com segurança, DEVE preservar a forma existente em vez de inventar certeza semântica.

  - As normas da skill/subagent DEVEM ser atualizadas (e senão existir, ser criadas), caso ainda não expressem integralmente essas regras, de forma centralizada e reutilizável para toda edição/revisão autoral e pré-publicação.

  - A validação DEVE cobrir, no mínimo:
    - `Deus` → `DEUS`, quando inequivocamente referido ao Deus cristão;
    - `Jesus` → `JESUS`;
    - `Jesus Cristo` → `JESUS CRISTO`;
    - `Cristo` → `CRISTO`;
    - `Espírito Santo` → `ESPÍRITO SANTO`;
    - `Jeová` → `JEOVÁ`;
    - `Javé` → `JAVÉ`;
    - outras variantes/transliterações inequivocamente cristãs;
    - `deus` usado genericamente ou para outra divindade, sem capitalização reverencial;
    - referências a Baal, divindades gregas e outras divindades, sem aplicação indevida da regra cristã;
    - coexistência, no mesmo trecho, de referência ao Deus cristão e a outra divindade, com resolução independente de cada ocorrência;
    - pronome divino cristão inequívoco sem nome explícito: `aquele` → `AQUELE`;
    - pronome + nome explícito: `aquele Jesus` → `aquele JESUS`;
    - `aquele Espírito Santo` → `aquele ESPÍRITO SANTO`;
    - pronomes/contrações divinos inequívocos, como `ele`, `dele`, `nele`;
    - títulos/designações contextuais cristãs e não cristãs, garantindo distinção correta;
    - ocorrências homógrafas referentes inequivocamente a seres humanos, outras divindades ou outros entes, que NÃO DEVEM ser capitalizadas;
    - referências ambíguas, que NÃO DEVEM ser presumidas cristãs;
    - citações inline e `blockquote`, que NÃO DEVEM receber capitalização reverencial automática;
    - preservação de palavras/expressões originalmente em CAIXA ALTA;
    - preservação dessa ênfase quando o trecho for reescrito;
    - correção de frase/sentença inteira indevidamente em CAIXA ALTA;
    - ausência de capitalização redundante em cadeias correferentes;
    - ausência de regressão nas demais regras editoriais e de pré-publicação.

✅ Implementar figuras de largura total no modo de impressão IEEE, com marcação explícita, inferência automática e normatização permanente
  - O modo de impressão IEEE DEVE permitir que determinadas imagens/figuras ocupem, excepcionalmente, **a largura útil das duas colunas**, sem romper, sobrepor, embaralhar ou prejudicar:
    - o fluxo natural do texto;
    - a ordem de leitura;
    - a continuidade das colunas;
    - a paginação;
    - as margens imprimíveis;
    - legendas, referências e demais elementos vinculados à figura.
  - Essa capacidade constitui **exceção deliberada ao modelo IEEE adotado pelo projeto** e DEVE ser formalmente normatizada, documentada, testada e preservada em refatorações/ajustes futuros.
  - A exceção aplica-se **exclusivamente ao modo de impressão IEEE**. A marcação, inferência ou metadado associado NÃO DEVE alterar aparência, dimensões, fluxo, layout ou comportamento da mesma imagem/figura na visualização web.

  - A implementação DEVE inspecionar previamente:
    - pipeline real de Markdown/HTML/build/impressão;
    - mecanismo atual de imagens, figuras, legendas e atributos customizados;
    - CSS/engine responsável pelo layout IEEE em colunas;
    - RCFs, `AGENTS.md`, `README.md`, documentação e demais normas aplicáveis;
    - bibliotecas/dependências já disponíveis que possam atender à análise automática.
  - NÃO DEVE ser criada solução paralela, markup incompatível, parser redundante ou mecanismo ad hoc quando já existir extensão, atributo, hook ou abstração adequada no projeto.

  - Devem existir **dois mecanismos complementares**:
    1. marcação explícita/manual da figura;
    2. inferência automática, em build, para automarcação de figuras inequivocamente adequadas.

  - ## Marcação explícita
    - DEVE existir um marcador/atributo customizado, semanticamente adequado à arquitetura existente, que identifique a imagem/figura como apta a ocupar a largura útil das duas colunas no modo IEEE.
    - A sintaxe concreta NÃO DEVE ser inventada antes de inspecionar os mecanismos de atributos/extensões já existentes; DEVE reutilizar a solução nativa/preexistente mais compatível.
    - Quando explicitamente marcado:
      - o elemento DEVE ocupar até toda a largura imprimível disponível entre as margens laterais;
      - sua altura DEVE ser ajustada proporcionalmente, preservando o aspect ratio;
      - NÃO DEVE haver distorção, crop arbitrário ou extrapolação das margens;
      - figura, imagem, legenda e elementos semanticamente vinculados DEVEM permanecer coerentes;
      - o texto anterior e posterior DEVE continuar no fluxo correto das colunas;
      - a marcação NÃO DEVE produzir qualquer alteração na versão web.
    - A marcação explícita DEVE ter precedência sobre a inferência automática: uma decisão manual válida NÃO DEVE ser removida ou contrariada pelo classificador automático.

  - ## Objetivo de uso
    - O recurso destina-se principalmente a imagens/figuras:
      - predominantemente horizontais;
      - de baixa altura relativa quando impressas em largura total;
      - que NÃO consumam parcela excessiva da página;
      - com alta densidade informacional;
      - contendo textos, rótulos, diagramas, esquemas, gráficos ou detalhes cuja redução à largura de uma única coluna comprometa legibilidade ou distinção.
    - O propósito é **aumentar tamanho físico e qualidade útil de leitura na impressão**, e NÃO simplesmente ampliar imagens decorativas ou de baixa densidade informacional.

  - ## Inferência automática / automarcação
    - O build DEVE possuir mecanismo de análise automática capaz de identificar, com forte preferência por **precisão e baixo falso positivo**, imagens/figuras adequadas ao modo de largura total.
    - A análise DEVE ocorrer em tempo de build quando uma imagem for **inserida ou alterada**, evitando reanálise desnecessária de arquivos inalterados sempre que a arquitetura permitir detecção determinística por hash, timestamp confiável, cache ou mecanismo equivalente já existente.
    - A inferência DEVE avaliar, no mínimo, as seguintes questões:
      1. **Geometria:** a imagem possui aspect ratio predominantemente horizontal e, quando ajustada à largura útil total de impressão, sua altura projetada permanece em até **35% da altura útil da página**, desconsideradas as margens superior e inferior?
      2. **Densidade textual/informacional:** há quantidade/densidade de informação — especialmente texto, rótulos, anotações ou elementos equivalentes — cuja redução à largura de uma coluna dificulte significativamente ou inviabilize leitura?
      3. **Densidade visual não textual:** há detalhes visuais relevantes — como gráficos, diagramas, linhas, símbolos, pequenos componentes ou estruturas — cuja redução à largura de uma coluna dificulte significativamente ou inviabilize distinção?
    - O critério geométrico da questão `1` DEVE ser obrigatório.
    - A automarcação DEVE ocorrer somente quando houver evidência inequívoca de necessidade de ampliação por densidade informacional, textual e/ou visual, conforme `2` e/ou `3`; em caso de incerteza, DEVE prevalecer **não automarcar**.
    - O limiar de `35%` refere-se à **altura útil da página impressa**, isto é, à altura disponível após descontar as margens superior e inferior definidas para o modo IEEE.
    - A decisão DEVE considerar a dimensão física/projetada no layout de impressão, e NÃO apenas dimensões em pixels isoladamente.
    - A automarcação NÃO DEVE modificar destrutivamente o arquivo-fonte da imagem.
    - O resultado da inferência DEVE ser determinístico para o mesmo conteúdo, configuração, versão do classificador e ambiente suportado.
    - Caso o projeto já possua mecanismo adequado de metadados gerados, cache de análise ou manifesto de build, DEVE ser reutilizado.
    - NÃO DEVE haver inferência baseada apenas no aspect ratio: ser horizontal e baixo, isoladamente, NÃO basta.
    - Imagens decorativas, fotografias simples, ilustrações de baixa densidade ou elementos que permaneçam claramente legíveis em uma coluna NÃO DEVEM ser automarcados.

  - ## Algoritmos, bibliotecas e dependências
    - Para análise de geometria, densidade textual e densidade visual, DEVEM ser priorizados **algoritmos consolidados e bibliotecas open source maduras, mantidas e adequadas ao problema**, em vez de reimplementações próprias.
    - Antes de implementar qualquer algoritmo, DEVE-SE verificar se a funcionalidade necessária:
      - já existe no projeto;
      - já é fornecida por dependência atual;
      - pode ser atendida por biblioteca consolidada e compatível.
    - É PROIBIDO reimplementar sem necessidade comprovada algo que já exista de forma madura, funcional e integrável.
    - Implementação própria somente PODE ocorrer quando:
      - não houver solução existente adequada;
      - houver limitação objetiva de integração/licenciamento/manutenção;
      - ou a solução externa introduzir custo/complexidade desproporcional.
    - Linguagens adicionais às já utilizadas pelo projeto PODEM ser empregadas **somente quando tecnicamente justificadas e integráveis aos pontos necessários do build**, sem criar pipeline frágil, dependência operacional desnecessária ou requisito de ambiente incompatível.
    - A escolha técnica DEVE privilegiar:
      - precisão;
      - baixo falso positivo;
      - determinismo;
      - manutenção;
      - integração simples;
      - custo de build aceitável;
      - compatibilidade com os ambientes já suportados.
    - NÃO DEVE haver improvisação, heurística arbitrária ou suposição sobre capacidades já existentes: o estado real DEVE ser inspecionado.

  - ## Layout e fluxo de impressão
    - A figura em largura total DEVE funcionar como um elemento de interrupção controlada do fluxo de duas colunas:
      - o conteúdo anterior DEVE encerrar-se corretamente;
      - a figura DEVE ocupar a largura útil total permitida;
      - o conteúdo posterior DEVE retomar corretamente o layout em duas colunas;
      - a ordem lógica do documento DEVE permanecer inalterada.
    - A solução DEVE utilizar, quando suportado e adequado ao pipeline real, os recursos padronizados do mecanismo de layout/impressão em vez de simulações frágeis por posicionamento absoluto ou deslocamentos manuais.
    - É PROIBIDO obter o efeito por:
      - sobreposição;
      - `position` absoluto usado como contorno do fluxo;
      - margens negativas arbitrárias;
      - duplicação da figura;
      - remoção/reinserção fora da ordem sem preservação semântica;
      - JavaScript de pós-layout quando houver mecanismo declarativo/CSS confiável que resolva corretamente.
    - A figura DEVE respeitar integralmente as margens laterais imprimíveis.
    - Sua altura DEVE permanecer proporcional à largura aplicada.
    - Caso, por características reais da página/figura, a expansão resulte em altura incompatível com o limite ou fluxo seguro, o sistema NÃO DEVE forçar largura total automaticamente.

  - ## Precedência e comportamento
    - Marcação manual válida DEVE prevalecer sobre inferência automática.
    - A inferência automática DEVE ser conservadora e NÃO DEVE remover uma marcação explícita.
    - A inferência automática NÃO DEVE produzir efeito na versão web.
    - Caso exista mecanismo de override/atributos já normatizado no projeto, DEVE ser reutilizado para permitir controle explícito, sem criação de sintaxe paralela.
    - A ausência de marcação manual e de inferência positiva DEVE preservar exatamente o comportamento IEEE atual da figura.
    - A nova exceção NÃO DEVE alterar o comportamento de imagens que não participem dela.

  - ## Normatização
    - O RCF aplicável DEVE ser atualizado para definir explicitamente:
      - a existência da exceção ao layout IEEE;
      - seu escopo exclusivo de impressão;
      - semântica do marcador manual;
      - precedência entre marcação manual e inferência;
      - critérios mínimos da automarcação;
      - limite de `35%` da altura útil;
      - preservação de margens e aspect ratio;
      - exigência de continuidade correta das colunas;
      - proibição de impacto na visualização web;
      - obrigação de preservação desse comportamento em mudanças futuras.
    - A norma NÃO DEVE ser alterada apenas para legitimar implementação divergente; a implementação DEVE seguir a norma consolidada.

  - ## Documentação de uso
    - DEVE ser criado um guia **claro, direto, curto e ilustrado** ensinando:
      - finalidade do recurso;
      - quando usá-lo;
      - quando NÃO usá-lo;
      - como aplicar a marcação manual;
      - como funciona a automarcação;
      - quais são seus critérios;
      - diferença entre web e impressão IEEE;
      - exemplos de figura normal versus figura em largura total;
      - comportamento esperado do fluxo de colunas.
    - O guia DEVE ficar na pasta apropriada de `docs/`, conforme a estrutura documental real do repositório.
    - O guia DEVE ser referenciado/linkado:
      - pelo RCF correspondente;
      - pelo `README.md` apropriado.
    - NÃO DEVE ser criada nova hierarquia documental arbitrária se já existir localização adequada.
    - As ilustrações/exemplos DEVEM ser suficientes para que um mantenedor ou autor compreenda o uso sem precisar inspecionar a implementação.

  - ## Validação obrigatória
    - Testar, no mínimo:
      - figura comum sem marcador, preservando o comportamento IEEE atual;
      - figura explicitamente marcada;
      - figura automarcada por alta densidade textual;
      - figura automarcada por alta densidade visual;
      - imagem horizontal que satisfaça geometria, mas NÃO densidade informacional, confirmando ausência de falso positivo;
      - fotografia/ilustração simples horizontal, confirmando ausência de automarcação indevida;
      - imagem cuja altura projetada seja exatamente próxima ao limite de `35%`;
      - imagem cuja altura projetada ultrapasse `35%`, confirmando ausência de automarcação;
      - preservação do aspect ratio;
      - respeito às margens laterais;
      - figura com legenda;
      - figura entre parágrafos;
      - figura próxima a quebra de página;
      - múltiplas figuras normais e de largura total no mesmo artigo;
      - retomada correta das duas colunas após a figura;
      - ausência de sobreposição, salto, duplicação ou troca de ordem do texto;
      - ausência de qualquer alteração visual/funcional na versão web;
      - reanálise em build após alteração da imagem;
      - ausência de reprocessamento desnecessário quando a imagem não mudar, se suportado pelo pipeline;
      - determinismo da decisão automática;
      - funcionamento em diferentes artigos, NÃO apenas no caso usado para desenvolvimento;
      - regressão visual do modo IEEE existente.

  - ## Critérios de aceite
    - A tarefa somente estará concluída quando:
      - houver uma forma explícita e normatizada de marcar figuras para largura total;
      - a figura marcada puder ocupar a largura útil das duas colunas sem romper o fluxo do documento;
      - a visualização web permanecer integralmente inalterada;
      - a imagem respeitar margens e aspect ratio;
      - existir inferência automática conservadora em tempo de build;
      - o classificador utilizar o critério geométrico e análise de densidade informacional relevante, evitando falsos positivos;
      - bibliotecas/algoritmos consolidados forem reutilizados sempre que adequados, sem reimplementação desnecessária;
      - a exceção estiver formalizada no RCF;
      - o guia ilustrado existir em `docs/` e estiver linkado pelo RCF e pelo `README.md`;
      - testes demonstrarem preservação do fluxo, da impressão IEEE, da web e da integridade visual em múltiplos artigos.
