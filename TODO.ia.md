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

- [ ] Refinar controles e leitura de referências do TTS sem regressão
  - Conforme `.ia.rules\state\requests\evidencias\evidencia4.png` e `evidencia4b.png`, reduzir a barra/controles de TTS de `play`, `pause` e `stop`: DEVEM ser mais compactos e discretos, porém manter área de acionamento adequada a toque.
  - Substituir textos por ícones inequívocos de `play`, `pause` e `stop`; preservar acessibilidade/hints necessários.
  - Posicionar de forma facilmente encontrável, porém sem competir visualmente com o artigo. Aparência DEVE permanecer elegante, profissional, responsiva e coerente com o tema.
  - Reformular **cirurgicamente** a leitura TTS de referências:
    - adotar **modo contínuo como padrão**, privilegiando fluidez;
    - no fluxo normal, sinalizar ao final da frase, parágrafo ou sentença-chave pertinente que existem referências, sem narrar integralmente cada nota;
    - disponibilizar, sob demanda, modos **resumido** e **completo**;
    - preservar marcadores/notas como links semânticos e navegáveis;
    - desacoplar a leitura integral automática da referência do fluxo principal, mantendo a funcionalidade atualmente implementada e funcional, porém **desabilitada por padrão**, NÃO removida;
    - privilegiar referência falada reduzida, por exemplo `Gomes, 2015`, evitando autor, título, edição, editora, página e demais detalhes quando desnecessários ao modo corrente;
    - permitir acesso deliberado à nota/referência completa quando requerido.

  - NÃO regredir navegação das referências, acessibilidade, modos existentes, TTS já funcional ou conteúdo editorial visível.

- [ ] Corrigir posicionamento e dimensionamento responsivo das covers
  - Usar `.ia.rules\state\requests\evidencias\evidencia5.png`, `evidencia6.png`, `evidencia7.png` e `evidencia7b.png`.
  - `evidencia5.png`: corrigir a flag da cover que fica ocultada pela imagem no modo lado a lado; ela DEVE permanecer corretamente sobreposta/visível conforme comportamento normatizado.
  - `evidencia6.png`: restaurar o cumprimento da **altura mínima em `vh`**, usando o valor centralizado/configurável já normatizado; NÃO duplicar configuração nem fixar valor arbitrário.
  - `evidencia7.png`/`evidencia7b.png`: eliminar os vazios laterais indevidos entre cover e limites esquerdo/direito da zona do artigo.
  - Conciliar simultaneamente:
    - largura integral da zona destinada à cover;
    - proporção;
    - responsividade/orientação;
    - limites mínimo e máximo de altura já normatizados;
    - ausência de distorção;
    - ausência de crop destrutivo de conteúdo relevante.

  - NÃO solucionar largura violando limite de altura, nem solucionar altura introduzindo espaços laterais/desalinhamento.

- [ ] Normalizar covers ao padrão 1200×630 sem perda de conteúdo
  - Identificar covers fora do padrão, inclusive as existentes em `1920×1080`, e adequá-las ao formato **1200×630** quando esse for o contrato aplicável.
  - O redimensionamento NÃO PODE distorcer, amputar/cortar ou degradar conteúdo relevante.
  - Quando simples redimensionamento proporcional não puder produzir `1200×630` sem crop, PODE ser empregado preenchimento/extensão generativa por IA para completar áreas faltantes e preservar composição, continuidade e qualidade.
  - A IA NÃO PODE alterar semanticamente o conteúdo original, inventar elementos centrais nem modificar aquilo que já está corretamente representado; sua atuação deve limitar-se à extensão necessária para compatibilização de proporção.
  - Preservar originais e obedecer aos mecanismos já normatizados de processamento único/rastreável, evitando degradação cumulativa.

- [ ] Restaurar e ampliar o modo de cover wide contínua
  - Conforme `.ia.rules\state\requests\evidencias\evidencia6.png`, corrigir o modo em que uma única cover wide deve permanecer centralizada e preencher horizontalmente a janela com aparência contínua/infinita.

  - A cover DEVE:
    - permanecer centralizada;
    - preencher corretamente a faixa vertical;
    - variar responsivamente conforme dimensões/orientação;
    - respeitar simultaneamente os limites mínimo/máximo de altura normatizados;
    - manter continuidade horizontal sem falhas, desalinhamentos ou espaços indevidos.

  - Adicionar também um segundo modo de composição wide baseado em **três imagens**:
    - `central`: **1200×630**, elemento principal;
    - `left`: segmento destinado à repetição contínua para a esquerda;
    - `right`: segmento destinado à repetição contínua para a direita.

  - A imagem OG wide do artigo DEVE corresponder à imagem `central`.

  - `left`, `central` e `right` DEVEM compartilhar escala/altura compatíveis e responder conjuntamente ao redimensionamento.

  - As junções DEVEM ser visualmente perfeitas:
    - borda direita de `left` ↔ borda esquerda de `central`;
    - borda esquerda de `right` ↔ borda direita de `central`.

  - `left` e `right` DEVEM repetir-se em suas respectivas direções de modo contínuo, sem costuras, gaps, deslocamentos ou quebra de alinhamento.

  - O mecanismo para declarar/associar essas três imagens DEVE aderir aos contratos/front matter/estrutura existentes; NÃO inventar sintaxe paralela antes de inspecionar o estado real.

- [ ] Eliminar dependências editoriais de `web.archive.org`
  - Nenhum asset referenciado por draft ou publicação DEVE permanecer vinculado diretamente ao domínio `web.archive.org`.
  - Inspecionar todo conteúdo aplicável e relinkar para cópia local relativa correspondente.
  - Presumir inicialmente que os assets já foram baixados; quando não houver correspondência imediata, investigar divergências de nome/path antes de concluir ausência.
  - Somente se o asset realmente não estiver disponível localmente, baixá-lo novamente e incorporá-lo segundo os contratos vigentes.
  - Todo asset recuperado/reassociado DEVE obedecer às diretivas já normatizadas de original, processamento único, hash/estado/rastreabilidade e prevenção de recompressão/degradação cumulativa.
  - NÃO alterar conteúdo editorial ou substituir asset por aproximado sem evidência inequívoca de equivalência.

- [ ] Suportar imagens Open Graph wide e square por artigo, com geração/build e metadados adequados
  - Permitir que cada artigo/post declare, conforme mecanismos existentes ou extensão aderente deles:
    - imagem OG **wide**: `1200×630`;
    - imagem OG **square** opcional: `1:1`, referência alvo **400×400**.

  - Objetivo: disponibilizar proporção apropriada às plataformas sem crop lateral indesejado da imagem wide.
  - Considerar como intenção de distribuição:
    - **wide 1200×630:** Facebook e LinkedIn;
    - **square 1:1 / 400×400:** WhatsApp, Instagram em compartilhamentos/mensagens, X/Twitter quando utilizado `summary card`, Threads.

  - Implementar no `<head>` do Jekyll as meta tags Open Graph/social correspondentes e definir as variáveis de Front Matter necessárias no Markdown.
  - NÃO inventar capacidade inexistente de seleção por crawler: antes de codificar, verificar quais plataformas possuem metadados próprios e quais compartilham `og:image`; usar tags específicas onde tecnicamente suportadas e, onde múltiplas plataformas consumirem o mesmo contrato, estruturar a solução conforme comportamento real dos crawlers, preservando a intenção de oferecer a proporção mais adequada sem declarar suporte impossível.
  - Para X/Twitter, respeitar a semântica efetiva do tipo de card configurado e sua imagem correspondente; para Open Graph genérico, expor dimensões/tipo e demais metadados pertinentes conforme contratos suportados.
  - A ausência da imagem square NÃO PODE invalidar compartilhamento: aplicar fallback normatizado para a wide.
  - A imagem `central` do modo wide contínuo DEVE ser também a OG wide, evitando duplicação sem necessidade.
  - Geração/otimização DEVE ocorrer em build conforme normas vigentes, preservando original e escolhendo formato social compatível já normatizado (`PNG` ou `JPG/JPEG`, conforme melhor relação qualidade/tamanho).
  - Validar o HTML final gerado, URLs canônicas/absolutas exigidas pelos metadados, dimensões declaradas, fallback e ausência de regressão nas tags sociais já existentes.
