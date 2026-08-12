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

- [x] RCF — Biblioteca agnóstica para impressão Web em formato IEEE

  ## 1. Objetivo

  Ao imprimir ou exportar para PDF, o site DEVE ocultar elementos alheios ao artigo e renderizar o conteúdo principal em paginação física, composição e estrutura tão aderentes ao formato IEEE quanto tecnicamente possível, ressalvadas exclusivamente as exceções deste RCF.

  A implementação DEVE:
  1. funcionar independentemente de o usuário iniciar a impressão por botão próprio, menu nativo, atalho de teclado, compartilhamento do sistema ou mecanismo equivalente;
  2. NÃO bloquear, limitar, substituir nem tornar obrigatória uma forma específica de impressão;
  3. NÃO corromper a página em tela, a visualização de impressão nem a saída final;
  4. aplicar degradação progressiva: CSS/Sass puro primeiro; TypeScript, Ruby, plugins, scripts de build ou motores externos somente quando tecnicamente necessários;
  5. ser construída desde a origem como biblioteca autônoma, ainda que inicialmente armazenada e consumida dentro do próprio site;
  6. integrar-se plenamente a Jekyll e a geradores, CMSs, frameworks e pipelines análogos, sem sacrificar sua independência tecnológica.
  7. Apenas páginas de artigo/article/post devem ter este recurso, portanto, página de listagem de multiplos post (como homepage), sem um conteúdo de artigo inteiro, página de 404, páginas de mapa, entre análogos, devem ser impressas naturalmente, sem se preocupar sem seguir o modelo IEEE.

  ## 2. Natureza da biblioteca
  1. A implementação DEVE ser concebida, estruturada, testada e importada como biblioteca isolada, não como conjunto de estilos ou scripts intrinsecamente pertencentes ao site hospedeiro.
  2. Sua localização inicial dentro do repositório do site NÃO DEVE criar acoplamento arquitetural, semântico, estrutural ou operacional com ele.
  3. A biblioteca DEVE ser:
  - agnóstica de site, tema, CMS, framework e gerador estático;
  - desacoplada da árvore de componentes, rotas, layouts e convenções internas do hospedeiro;
  - integrável a qualquer projeto Web baseado em Node.js;
  - plenamente integrável a Jekyll, inclusive por Ruby, Liquid, plugins, hooks e scripts de build;
  - adaptável a geradores estáticos e plataformas equivalentes;
  - potencialmente extraível, versionável, publicável e distribuível sem reescrita substancial.
  4. A biblioteca NÃO DEVE importar diretamente arquivos privados, componentes, aliases, variáveis globais, helpers, templates ou estado do site inicial.
  5. O site hospedeiro DEVE integrar a biblioteca por API, configuração, atributos, classes, adaptadores, plugins ou pontos de extensão documentados.
  6. A biblioteca DEVE possuir fronteiras explícitas entre:
  - núcleo genérico;
  - adaptadores de integração;
  - plugins de plataforma;
  - configuração do consumidor;
  - sobreposições locais.
  7. Código específico do primeiro site somente PODE existir em adaptador, plugin ou camada externa ao núcleo.
  8. A remoção do adaptador ou plugin inicial NÃO DEVE comprometer o funcionamento genérico da biblioteca.
  9. A agnosticidade NÃO DEVE ser interpretada como proibição ao uso de recursos nativos da plataforma hospedeira; tais recursos PODEM ser empregados em integrações externas quando necessários para garantir compatibilidade integral.

  ## 3. Compatibilidade com Jekyll e plataformas análogas
  1. A biblioteca DEVE alcançar funcionamento integral no Jekyll, incluindo seus modos de desenvolvimento, build, geração estática, temas e implantação suportados pelo projeto.
  2. Scripts Ruby, gems auxiliares, plugins Jekyll, hooks, filtros Liquid, tags Liquid, geradores, conversores, includes, layouts e tarefas de build PODEM e DEVEM ser criados quando necessários para garantir essa compatibilidade.
  3. A preferência por CSS/Sass e TypeScript NÃO DEVE impedir o uso de Ruby ou de mecanismos nativos do Jekyll quando estes forem a solução tecnicamente correta.
  4. Recursos específicos do Jekyll DEVEM permanecer em pacote, plugin ou adaptador próprio, separado do núcleo agnóstico.
  5. O núcleo NÃO DEVE depender de:
  - runtime Ruby;
  - Jekyll;
  - Liquid;
  - convenções de `_layouts`, `_includes`, `_plugins`, `_sass`, coleções ou front matter;
  - qualquer API exclusiva da integração inicial.
  6. O adaptador Jekyll PODE:
  - mapear front matter para o contrato genérico de metadados;
  - injetar marcações semânticas de impressão;
  - gerar referências, notas, datas e URL canônica;
  - classificar conteúdo editorial e institucional;
  - produzir CSS ou dados de configuração;
  - executar validações durante o build;
  - preparar conteúdo que não possa ser transformado de modo confiável no navegador;
  - emitir diagnósticos e impedir builds inválidos quando exigido pela configuração.
  7. Transformações realizadas no build DEVEM produzir HTML estático funcional sem exigir Ruby no navegador.
  8. Plugins ou scripts Ruby NÃO DEVEM duplicar regras centrais; DEVEM consumir contratos, schemas ou artefatos definidos pelo núcleo.
  9. O mesmo modelo DEVE admitir adaptadores equivalentes para outros ambientes, incluindo plugins, loaders, transforms, preprocessadores, hooks ou scripts escritos na linguagem nativa de cada plataforma.
  10. A ausência de um adaptador específico NÃO DEVE impedir o uso básico da biblioteca por HTML, CSS e JavaScript padronizados.
  11. Compatibilidade de 100% com uma plataforma DEVE significar cobertura integral dos fluxos oficialmente suportados e declarados, não promessa abstrata sobre versões, plugins ou ambientes desconhecidos.
  12. Versões e modos suportados de Jekyll, Ruby, Liquid e plataformas análogas DEVEM ser explicitamente definidos, testados e versionados.

  ## 4. Generalização obrigatória
  1. Problemas encontrados durante a integração inicial DEVEM ser analisados como classes de problema, não como exceções exclusivas do site.
  2. A correção DEVE resolver o padrão causal amplo, incluindo variações estruturalmente equivalentes, e não apenas o HTML, seletor, componente ou caso concreto observado.
  3. É PROIBIDO introduzir correções rígidas baseadas exclusivamente em:
  - identificadores privados;
  - nomes de classes acidentais;
  - profundidade fixa de DOM;
  - ordem circunstancial de elementos;
  - caminho de arquivo específico;
  - conteúdo textual particular;
  - dependência implícita do tema inicial.
  4. Exceções particulares somente PODEM ser tratadas por configuração, adaptador ou plugin, nunca incorporadas silenciosamente ao núcleo.
  5. Toda generalização DEVE preservar determinismo e evitar heurísticas ambíguas.
  6. Quando não houver identificação genérica confiável, a biblioteca DEVE exigir marcação, metadado ou configuração explícita.
  7. A solução DEVE abranger elementos semanticamente equivalentes mesmo quando implementados por marcações, componentes, geradores ou frameworks distintos.
  8. Cada correção relevante DEVE produzir:
  - teste genérico reutilizável no núcleo;
  - teste de contrato;
  - quando aplicável, teste específico do adaptador ou plugin consumidor.
  9. Soluções criadas originalmente em Ruby, TypeScript, Sass ou outra tecnologia DEVEM formalizar o comportamento em contrato independente da linguagem sempre que ele puder ser reutilizado por outras integrações.

  ## 5. Referência, precedência e determinismo
  1. O padrão IEEE vigente DEVE constituir a referência externa de geometria, composição, hierarquia e paginação; este RCF NÃO o redefine.
  2. As exceções locais prevalecem somente quanto a:
  - fonte principal sem serifa;
  - chamadas referenciais em sobrescrito;
  - preservação controlada de tabelas, cores e avisos institucionais;
  - integração, portabilidade e extensibilidade Web.
  3. Valores, medidas, tolerâncias, modelos ou comportamentos NÃO DEVEM ser imaginados, inferidos arbitrariamente ou adotados por mera semelhança visual.
  4. Todo parâmetro DEVE ser derivado de fonte normativa, template IEEE de controle, medição reproduzível ou requisito explícito.
  5. A conformidade DEVE ser aferida sobre impressão física ou PDF final, nunca apenas pela aparência em tela.
  6. Adaptações específicas de plataforma NÃO DEVEM alterar silenciosamente parâmetros ou invariantes do núcleo.

  ## 6. Arquitetura e isolamento
  1. A impressão DEVE possuir camada própria e isolada, preferencialmente sob `@media print`.
  2. A apresentação em tela NÃO DEVE ser alterada pela biblioteca.
  3. O artigo DEVE ser identificado por contrato semântico configurável, preferencialmente atributo como `[data-print-article]`.
  4. A camada de impressão DEVE:
  - ocultar elementos não pertinentes;
  - reexibir o artigo e os elementos institucionais autorizados;
  - neutralizar estilos de layout incompatíveis;
  - impedir que estilos globais, temas, frameworks ou componentes corrompam a impressão;
  - preservar conteúdo, semântica e acessibilidade.
  5. `!important` PODE ser utilizado exclusivamente quando necessário para garantir isolamento determinístico na impressão.
  6. Sass, TypeScript, Ruby, Jekyll, geradores estáticos, frameworks ou bibliotecas PODEM integrar a solução, mas NÃO DEVEM constituir dependência conceitual obrigatória do núcleo.
  7. Estruturas existentes de duas ou mais colunas destinadas à exibição em tela DEVEM ser ignoradas na impressão; somente a composição de colunas definida para o artigo impresso DEVE prevalecer.
  8. Seletores do núcleo DEVEM ser limitados ao escopo controlado da biblioteca.
  9. A biblioteca NÃO DEVE aplicar reset global fora de seu contêiner ou contexto de impressão.
  10. Colisões de nomes, variáveis, classes e estilos com o site hospedeiro DEVEM ser evitadas por namespace, encapsulamento ou estratégia equivalente.
  11. Artefatos gerados por Ruby, Node.js ou outro pipeline DEVEM respeitar os mesmos contratos semânticos e de escopo.

  ## 7. Empacotamento e integração
  1. A biblioteca DEVE poder ser consumida por importação explícita em ambiente Node.js.
  2. Sua estrutura DEVE permitir, sem redesign:
  - uso interno por workspace ou pacote local;
  - publicação futura em registro de pacotes;
  - versionamento semântico;
  - geração de artefatos distribuíveis;
  - uso com ou sem bundler, conforme escopo declarado;
  - integração por gem, plugin ou pacote auxiliar quando a plataforma assim exigir.
  3. Entradas de CSS/Sass, TypeScript e adaptadores de plataforma DEVEM ser independentes e importáveis separadamente quando possível.
  4. Dependências opcionais NÃO DEVEM ser carregadas por consumidores que não utilizem seus recursos.
  5. O núcleo DEVE evitar efeitos colaterais na importação.
  6. Inicialização automática somente PODE ocorrer quando explicitamente habilitada.
  7. A API pública DEVE ser mínima, estável, documentada e independente de detalhes internos.
  8. Configurações DEVEM possuir valores padrão seguros, validação determinística e possibilidade de extensão.
  9. A biblioteca DEVE aceitar integração declarativa, programática, por build ou híbrida.
  10. O consumidor DEVE conseguir:
      - identificar o artigo;
      - mapear metadados;
      - declarar elementos omitidos ou preservados;
      - registrar elementos de largura total;
      - ajustar parâmetros autorizados;
      - acionar ou consultar o estado de preparação;
      - fornecer transformações estáticas específicas da plataforma.

  11. APIs privadas NÃO DEVEM ser necessárias para integração normal.
  12. Recursos específicos do build do primeiro site DEVEM ser implementados em plugin, adaptador ou configuração externa.
  13. Plugins Ruby, pacotes Node.js e demais integrações DEVEM compartilhar, sempre que tecnicamente possível, schemas, fixtures, casos de teste e contratos de comportamento.
  14. O pacote principal NÃO DEVE obrigar consumidores Node.js a instalar Ruby, nem consumidores Jekyll a executar ferramentas Node.js no navegador; dependências de build DEVEM ser declaradas por integração.

  ## 8. Impressão nativa e compatibilidade cross-browser
  1. A impressão nativa será o fluxo predominante e DEVE ser plenamente suportada.
  2. Scripts ou motores auxiliares, quando necessários, DEVEM responder também a impressões iniciadas externamente à interface do site.
  3. A implementação DEVE avaliar e combinar, conforme suporte efetivo:
  - `beforeprint`;
  - `afterprint`;
  - consultas `matchMedia("print")`;
  - preparação antecipada assíncrona;
  - transformação estática no build;
  - fallback exclusivamente CSS.
  4. A compatibilidade DEVE abranger, no mínimo, os navegadores e motores oficialmente suportados pela biblioteca.
  5. A matriz de suporte DEVE pertencer à biblioteca, não ao primeiro site consumidor.
  6. A ausência, falha, bloqueio ou carregamento incompleto de JavaScript NÃO DEVE produzir página vazia, conteúdo truncado nem impressão inutilizável.
  7. Scripts auxiliares NÃO DEVEM cancelar, impedir ou sequestrar a impressão nativa.
  8. Quando a preparação completa ainda não estiver disponível, a folha e a visualização de impressão DEVEM:
  - preservar o conteúdo legível;
  - indicar discretamente que recursos de impressão ainda estão sendo preparados;
  - evitar afirmar conformidade integral enquanto houver dependência pendente.
  9. A mensagem de preparação NÃO DEVE aparecer após a conclusão bem-sucedida nem integrar permanentemente o artigo.
  10. Diferenças entre navegadores DEVEM ser absorvidas pelo núcleo ou por adaptadores de motor, nunca por condicionais específicas do site.
  11. Processamento realizado previamente por Ruby, Node.js ou outro build DEVE reduzir dependências de runtime quando isso ampliar robustez e compatibilidade.

  ## 9. Carregamento progressivo e custo de rede
  1. Downloads, processamento e requisições adicionais exclusivos para impressão DEVEM ser minimizados.
  2. Recursos essenciais já disponíveis na página DEVEM ser reutilizados.
  3. Dependências adicionais somente PODEM ser carregadas quando tecnicamente justificadas.
  4. O carregamento adicional DEVE ocorrer, preferencialmente:
  - de forma assíncrona;
  - após o carregamento integral do documento;
  - após imagens e recursos críticos da página;
  - em período ocioso ou alguns segundos depois;
  - sem bloquear interação, renderização ou navegação.
  5. `requestIdleCallback` PODE ser usado com fallback temporal compatível.
  6. O carregamento NÃO DEVE causar travamentos, mudanças visuais, reflow perceptível ou degradação relevante em conexões lentas.
  7. Atalhos ou impressão antecipada DEVEM acionar preparação imediata somente quando possível sem quebrar o fluxo nativo.
  8. Dispositivos móveis DEVEM possuir estratégia própria baseada em capacidade real, não apenas em identificação por agente de usuário.
  9. O build DEVE avaliar suporte e comportamento de impressão nos navegadores móveis oficialmente abrangidos.
  10. Recursos adicionais PODEM ser:
      - omitidos quando a impressão não estiver tecnicamente disponível;
      - carregados sob demanda quando houver sinal confiável de uso;
      - condicionados por capacidade, plataforma e custo estimado;
      - pré-processados estaticamente no build.

  11. A solução NÃO DEVE introduzir requisições, atrasos ou processamento móvel sem benefício verificável.
  12. Dependências opcionais DEVEM ser carregadas pela biblioteca por estratégia configurável e desacoplada do ciclo de carregamento do site.
  13. O consumidor DEVE poder fornecer recursos já carregados, cacheados, gerados ou hospedados localmente sem duplicação.
  14. Processamento estático por Ruby, Node.js ou tecnologia equivalente DEVE ser preferido quando eliminar custo de rede ou de runtime sem reduzir portabilidade.

  ## 10. Paginação e colunas
  1. A saída DEVE utilizar CSS Paged Media, com `@page`, tamanho físico, margens e área útil explicitamente definidos conforme a referência IEEE adotada.
  2. Cada folha DEVE constituir unidade de paginação independente.
  3. O fluxo padrão em duas colunas DEVE ser fragmentado por página; é PROIBIDO tratar todo o documento como uma única região multicoluna contínua.
  4. A implementação DEVE controlar:
  - largura e intervalo entre colunas;
  - quebras de página e coluna;
  - órfãs e viúvas;
  - títulos desacompanhados;
  - fragmentação de parágrafos;
  - figuras, tabelas, equações e legendas;
  - referências;
  - elementos que atravessem ambas as colunas;
  - balanceamento quando exigido pela referência.
  5. Elementos indivisíveis NÃO DEVEM ser fragmentados quando couberem integralmente na página seguinte.
  6. Quebras manuais DEVEM ser excepcionais, sem marcação vazia ou puramente visual.
  7. A escala final DEVE ser `100%`; ajustes automáticos do tipo “encaixar na página” NÃO DEVEM ser pressupostos.
  8. Cabeçalhos, rodapés, margens e metadados adicionados pelo navegador DEVEM ser desativados pelo usuário ou evitados quando houver controle técnico legítimo, sem bloquear a impressão.
  9. A lógica de paginação NÃO DEVE depender da estrutura particular de templates do consumidor.
  10. Marcações auxiliares de paginação PODEM ser geradas durante o build, desde que sejam semânticas, determinísticas e compatíveis com o fallback nativo.

  ## 11. Tipografia
  1. A família principal DEVE ser `Noto Sans`, com fallback sans-serif local metricamente adequado.
  2. A fonte PODE ser obtida do Google Fonts, desde que:
  - seja carregada antes da paginação final;
  - contenha somente pesos efetivamente utilizados;
  - seja incorporada ao PDF quando suportado;
  - possua fallback determinístico;
  - não torne a impressão dependente de conectividade tardia.
  3. Hospedagem local da fonte DEVE ser preferida quando reduzir risco, latência ou dependência externa.
  4. O tamanho nominal em `pt` NÃO DEVE ser presumido visualmente equivalente ao Times New Roman da referência IEEE.
  5. Corpo, títulos, resumo, legendas, notas e referências DEVEM ser calibrados pela saída física.
  6. A calibração DEVE considerar:
  - altura real das linhas;
  - caracteres médios por linha;
  - linhas por coluna;
  - densidade e ocupação vertical;
  - largura aparente;
  - quebras de página;
  - equivalência visual com o documento de controle.
  7. Geometria física DEVE usar unidades adequadas, preferencialmente `pt`, `in` ou `mm`; `px`, `rem` e unidades de viewport NÃO DEVEM governar dimensões impressas essenciais.
  8. O mecanismo tipográfico DEVE permanecer funcional quando a fonte remota não estiver disponível.
  9. Subconjuntos, arquivos e declarações de fonte PODEM ser preparados durante o build por Ruby, Node.js ou ferramenta equivalente, desde que preservem licenciamento, determinismo e fallback.

  ## 12. Referências, notas e metadados
  1. Chamadas bibliográficas e notas globais DEVEM ser exibidas como sobrescritos numerados, equivalentes a `<sup>[1]</sup>`.
  2. A numeração DEVE ser global, crescente, estável e independente de página, coluna ou seção.
  3. Cada chamada DEVE possuir associação semântica e, quando aplicável, vínculo navegável com a referência correspondente.
  4. Referências repetidas PODEM reutilizar a mesma numeração.
  5. URLs de links comuns NÃO DEVEM ser automaticamente anexadas ao texto impresso.
  6. A primeira página DEVE apresentar, de forma visível, discreta e coerente com o padrão IEEE:
  - URL canônica de obtenção;
  - data em que o conteúdo foi obtido ou impresso.
  7. Quando existentes, também DEVEM ser apresentados:
  - data original de publicação;
  - data da última atualização.
  8. Esses dados DEVEM integrar naturalmente a área de autoria, identificação, nota editorial ou região equivalente, sem aparência promocional ou chamativa.
  9. Autores, afiliações, contatos e metadados PODEM ser reorganizados especificamente para impressão, desde que nenhum dado relevante seja perdido ou falseado.
  10. A biblioteca DEVE receber metadados por contrato genérico e permitir mapeamento entre esquemas distintos.
  11. Nomes de campos próprios do primeiro site NÃO DEVEM integrar a API central.
  12. Adaptadores Jekyll PODEM extrair, validar, normalizar e injetar dados provenientes de front matter, `_config.yml`, collections, defaults, `site`, `page`, `layout` ou estruturas equivalentes.
  13. O mapeamento Jekyll DEVE permanecer configurável e não pressupor um schema único de front matter.

  ## 13. Conteúdo imprimível
  1. Navegação, menus, barras laterais, publicidade, comentários, compartilhamento, controles, formulários, tags sociais e elementos interativos alheios ao artigo DEVEM ser ocultados.
  2. Título, autoria, afiliações, resumo, palavras-chave, seções, figuras compatíveis, tabelas, equações, notas, referências e avisos essenciais DEVEM permanecer.
  3. Imagens DEVEM:
  - preservar proporção;
  - manter resolução suficiente;
  - respeitar limites de coluna ou página;
  - conservar suas cores.
  4. Cores de imagens NÃO DEVEM ser removidas, convertidas ou reduzidas arbitrariamente.
  5. Fundos decorativos, sombras, filtros, animações, transições e transparências não essenciais DEVEM ser removidos.
  6. Thumbnails e imagens de destaque DEVEM ser omitidos, salvo quando:
  - constituírem conteúdo editorial relevante; e
  - puderem ser inseridos de forma compatível com a composição IEEE.
  7. Conteúdo não imprimível DEVE poder ser declarado por classe, atributo, seletor, front matter, configuração ou callback.
  8. A classificação automática de conteúdo DEVE ser conservadora e nunca remover material editorial sem regra explícita ou semântica confiável.
  9. Adaptadores de build PODEM enriquecer a marcação quando a semântica necessária estiver disponível apenas nos dados-fonte.

  ## 14. Rodapé institucional e avisos
  1. O rodapé visual do site NÃO DEVE ser reproduzido integralmente.
  2. Elementos sociais, navegação, tags, widgets, fundos e decoração DEVEM ser removidos.
  3. Informações essenciais DEVEM ser preservadas e reorganizadas em bloco institucional discreto, incluindo, quando existentes:
  - site ou entidade publicadora;
  - disclaimer;
  - licença;
  - avisos legais;
  - atribuições obrigatórias;
  - demais informações cuja omissão altere o contexto jurídico ou editorial.
  4. Esse bloco PODE divergir do IEEE estrito, mas DEVE ser integrado da forma mais natural, compacta e aderente possível.
  5. Conteúdo institucional redundante NÃO DEVE ser repetido em todas as páginas, salvo exigência normativa ou legal.
  6. A biblioteca DEVE permitir que cada consumidor mapeie suas informações institucionais sem alterar o núcleo.
  7. No Jekyll, esse mapeamento PODE ser realizado por front matter, `_config.yml`, data files, includes, filtros, plugins ou adaptador equivalente.

  ## 15. Tabelas
  1. A estilização preexistente de tabelas DEVE ser tolerada sempre que permanecer legível, íntegra e compatível com a página impressa.
  2. A implementação NÃO DEVE impor aparência IEEE rígida às tabelas.
  3. Tabelas zebradas, cabeçalhos escuros com texto claro e primeira coluna destacada PODEM ser preservados.
  4. O sistema DEVE interferir somente para:
  - evitar estouro da área útil;
  - preservar legibilidade;
  - impedir cortes indevidos;
  - corrigir cores ou contrastes inadequados para impressão;
  - controlar fragmentação.
  5. Redefinições visuais NÃO essenciais são PROIBIDAS.
  6. Tabelas largas DEVEM adotar estratégia determinística, como redução controlada, orientação de página, largura total ou divisão semanticamente segura, conforme capacidade e referência aplicável.
  7. Estratégias de tratamento DEVEM ser selecionáveis por configuração genérica, não por classes particulares do primeiro site.
  8. Adaptadores de build PODEM classificar ou enriquecer tabelas quando a decisão depender de metadados indisponíveis no DOM final.

  ## 16. Citações em bloco e elementos equivalentes
  1. Todas as marcações destinadas semanticamente a citações em bloco DEVEM receber tratamento uniforme, ainda que implementadas por:
  - `<blockquote>`;
  - classes;
  - componentes;
  - elementos genéricos;
  - Markdown processado;
  - estruturas HTML equivalentes.
  2. Múltiplos estilos de citação somente PODEM permanecer quando compatíveis com o padrão impresso ou expressamente autorizados.
  3. Variações meramente visuais de tela DEVEM ser normalizadas na impressão.
  4. Blockquotes ou equivalentes designados para atravessar ambas as colunas DEVEM preservar essa intenção e ocupar a largura total da região paginada.
  5. A travessia de colunas DEVE ser explicitamente declarada por classe, atributo, metadado, front matter ou configuração; NÃO DEVE ser inferida por aparência.
  6. Citações comuns DEVEM permanecer no fluxo regular das colunas.
  7. O reconhecimento de elementos equivalentes DEVE ser extensível por adaptadores ou seletores fornecidos pelo consumidor.
  8. Filtros Liquid, plugins Ruby ou transformações de build PODEM converter marcações autorais em contratos semânticos padronizados da biblioteca.

  ## 17. Implementação progressiva
  1. CSS/Sass puro DEVE ser a primeira opção para recursos de apresentação e impressão.
  2. TypeScript somente DEVE ser introduzido para capacidades de runtime não executáveis com confiabilidade por CSS.
  3. Ruby ou outra linguagem de build PODE e DEVE ser utilizada quando a integração, transformação estática, validação ou compatibilidade da plataforma assim exigir.
  4. A progressividade tecnológica DEVE seguir, conforme o problema:
  5. HTML semântico;
  6. CSS/Sass;
  7. transformação estática no build;
  8. JavaScript/TypeScript de runtime;
  9. motor externo.

  10. A ordem anterior NÃO é absoluta quando outra camada oferecer solução comprovadamente mais simples, robusta, leve e determinística.
  11. Cada recurso programático DEVE ser isolado, opcional e progressivamente aprimorativo.
  12. Quando biblioteca externa for necessária, DEVE ser:
  - open source;
  - mantida;
  - estável;
  - leve;
  - modular;
  - compatível com os navegadores-alvo;
  - proporcional ao problema;
  - utilizável sem corromper a impressão nativa.
  8. **PubCSS** DEVE ser avaliado como base estrutural e referência inicial.
  9. **Vivliostyle** e **Paged.js** PODEM ser avaliados para paginação avançada.
  10. A escolha NÃO DEVE ser feita apenas por amplitude funcional; tamanho, custo de rede, tempo de inicialização, compatibilidade, manutenção e fallback DEVEM ser medidos.
  11. A impressão nativa com CSS DEVE permanecer funcional quando qualquer motor adicional estiver indisponível.
  12. Dependências externas DEVEM ser encapsuladas atrás de interfaces substituíveis.
  13. A API pública da biblioteca NÃO DEVE expor diretamente detalhes proprietários de motores externos.
  14. Trocar, remover ou atualizar um motor NÃO DEVE exigir alteração nos consumidores, salvo mudança formal de versão principal.
  15. Ferramentas Ruby ou específicas de Jekyll DEVEM ser encapsuladas em integração própria e NÃO DEVEM contaminar o pacote principal.

  ## 18. Extensibilidade
  1. A biblioteca DEVE possuir:
  - núcleo comum;
  - configuração por consumidor;
  - adaptadores opcionais;
  - plugins de plataforma;
  - sobreposições explicitamente delimitadas.
  2. Ajustes locais DEVEM ocorrer por:
  - propriedades customizadas CSS;
  - classes ou atributos documentados;
  - arquivo Sass/CSS posterior ao núcleo;
  - hooks opcionais de preparação e finalização;
  - mapeadores de metadados e seletores;
  - plugins ou transformações de build documentados.
  3. Overrides NÃO DEVEM redefinir silenciosamente invariantes do padrão.
  4. Cada exceção local DEVE ser pontual, rastreável, documentada e testável.
  5. A biblioteca NÃO DEVE depender da estrutura integral do tema, layout, framework ou gerador do site.
  6. Pontos de extensão DEVEM ser explícitos e restritos; monkey patches e alterações internas pelo consumidor são PROIBIDOS.
  7. A extensibilidade NÃO DEVE comprometer a saída padrão nem introduzir comportamento não determinístico.
  8. Integrações de plataforma DEVEM poder evoluir independentemente do núcleo, respeitando compatibilidade de API e versionamento.

  ## 19. Portabilidade e distribuição futura
  1. A biblioteca DEVE poder ser extraída do repositório inicial mantendo:
  - histórico compreensível;
  - testes;
  - documentação;
  - licença;
  - API pública;
  - build;
  - artefatos de distribuição;
  - adaptadores e plugins separáveis.
  2. Caminhos, aliases e infraestrutura do primeiro repositório NÃO DEVEM ser necessários após a extração.
  3. A biblioteca DEVE possuir licença open source compatível com suas dependências e finalidade de distribuição.
  4. Dependências e códigos derivados DEVEM preservar licenças, avisos e atribuições obrigatórias.
  5. O pacote futuro DEVE poder ser usado em múltiplos projetos sem duplicação ou fork.
  6. Personalizações por projeto DEVEM permanecer fora do pacote ou ser fornecidas como configuração e adaptadores reutilizáveis.
  7. A documentação DEVE distinguir claramente:
  - comportamento do núcleo;
  - integração mínima;
  - recursos opcionais;
  - adaptadores de plataforma;
  - limitações por navegador;
  - customização por consumidor.
  8. A distribuição PODE compreender múltiplos artefatos coordenados, como pacote Node.js, entrada Sass, plugin Jekyll ou gem auxiliar, desde que o núcleo e seus contratos permaneçam únicos e coerentes.
  9. A existência de integração Ruby NÃO DEVE impedir o uso independente em projetos exclusivamente Node.js, assim como a existência do pacote Node.js NÃO DEVE impedir integração estática eficiente com Jekyll.

  ## 20. Validação

  A implementação somente será considerada conforme quando:
  1. preservar integralmente a página em tela;
  2. funcionar por impressão nativa, atalho, menu, botão próprio e exportação suportada;
  3. continuar legível sem JavaScript ou motor externo;
  4. impedir interferência de estilos preexistentes;
  5. produzir páginas e colunas conforme a referência IEEE adotada;
  6. reiniciar corretamente a composição por página;
  7. usar Noto Sans calibrada fisicamente contra o documento de controle;
  8. apresentar referências como sobrescritos globais `[n]`;
  9. inserir URL, data de obtenção e metadados editoriais disponíveis de forma discreta;
  10. preservar cores das imagens;
  11. omitir thumbnails incompatíveis;
  12. preservar tabelas customizadas salvo necessidade técnica;
  13. normalizar blockquotes equivalentes e permitir travessia explícita de colunas;
  14. preservar avisos institucionais essenciais sem reproduzir o rodapé visual completo;
  15. não introduzir bloqueios, travamentos ou requisições desnecessárias;
  16. produzir resultado utilizável durante carregamento parcial;
  17. ser reproduzível nos navegadores e motores oficialmente suportados;
  18. passar por comparação visual e geométrica página a página;
  19. possuir regressão automatizada de layout, conteúdo e impressão;
  20. registrar motor, navegador, versão, papel, escala, fontes, dependências e parâmetros utilizados;
  21. ser importada pelo site inicial como módulo independente;
  22. não depender de arquivos, classes, componentes ou estado privados do consumidor;
  23. funcionar em projeto Node.js de referência distinto do site inicial;
  24. permitir extração para pacote separado sem reestruturação substancial;
  25. resolver casos de integração por mecanismos genéricos ou adaptadores, nunca por correções rígidas no núcleo;
  26. possuir testes unitários do núcleo, testes de contrato, testes de integração por adaptador e testes cross-browser;
  27. demonstrar ausência de efeitos colaterais fora do escopo da biblioteca;
  28. funcionar integralmente no Jekyll dentro da matriz declarada;
  29. validar builds com e sem JavaScript de runtime;
  30. testar plugin, filtros, hooks e transformações Ruby quando utilizados;
  31. demonstrar que o adaptador Jekyll pode ser removido sem afetar o núcleo;
  32. demonstrar que problemas específicos do site inicial foram resolvidos por contratos generalizáveis;
  33. validar que transformações realizadas por Ruby e Node.js produzem resultados semanticamente equivalentes quando aplicável.

  ## 21. Critério de fidelidade

  “Compatível com IEEE” DEVE significar equivalência física, estrutural e composicional mensurável na saída impressa, excetuadas somente as alterações expressamente autorizadas neste RCF.

  “Biblioteca agnóstica” DEVE significar que o núcleo opera por contratos públicos, não conhece detalhes privados do consumidor, resolve classes gerais de problemas e pode ser reutilizado, extraído e distribuído sem reimplementação substancial.

  “Compatibilidade integral com Jekyll” DEVE significar que a biblioteca pode empregar Ruby, Liquid, plugins, hooks, scripts e transformações de build em camada própria para cobrir plenamente os fluxos suportados, sem converter o Jekyll em dependência do núcleo nem reduzir a portabilidade para outras plataformas.

  Similaridade visual em tela, dependência exclusiva de um motor, funcionamento apenas por fluxo controlado, correções específicas do primeiro site, recusa injustificada ao uso de tecnologias nativas da plataforma ou mera separação física de arquivos NÃO constituem conformidade.

* [x] Issue 1 — RCF/FT: Normatizar e implementar citações inline em artigos/postagens

  ### Contexto

  O RCF deve distinguir semanticamente citações inseridas dentro de parágrafos de conteúdos que não constituam citações estruturais.

  Considera-se **citação inline** qualquer trecho de citação delimitado por `"` ou por `` ` `` inline, quando inserido dentro de um parágrafo que não seja, ele próprio, uma citação e que não esteja aninhado em uma citação estrutural ou em outra citação com subcitações.

  ### Requisitos
  - O RCF DEVE definir formalmente o conceito de **citação inline**.
  - A detecção DEVE ser semanticamente correta, não baseada apenas em correspondência textual ingênua.
  - Citações contidas em `blockquote` NÃO DEVEM ser tratadas como citações inline por esta regra.
  - Citações aninhadas em outra citação NÃO DEVEM ser classificadas como citações inline da regra externa.
  - Ao publicar/renderizar artigos e postagens, toda citação inline DEVE ser apresentada obrigatoriamente em **itálico**.
  - A transformação NÃO DEVE alterar o conteúdo semântico ou textual da citação.
  - A implementação DEVE preservar a estrutura e as demais estilizações já vigentes.
  - O comportamento DEVE ser compatível com tema claro/escuro e com os mecanismos existentes de renderização.

  ### FT

  Criar uma FT específica para implementar a detecção e a apresentação normativa de citações inline.

  A FT DEVE:
  1.  inspecionar previamente o pipeline real de Markdown/renderização/publicação;
  2.  identificar o ponto correto de aplicação da transformação;
  3.  implementar a regra sem depender de heurísticas frágeis quando houver estrutura semântica disponível;
  4.  cobrir aspas `"..."` e código inline `` `...` `` conforme a definição normativa;
  5.  excluir corretamente `blockquote`, citações aninhadas e demais contextos explicitamente excluídos pelo RCF;
  6.  preservar compatibilidade com as estilizações existentes;
  7.  incluir testes para casos positivos, negativos, aninhados e ambíguos.

  ### Critérios de aceite
  - Toda citação inline elegível é renderizada em itálico.
  - Citações dentro de `blockquote` não são indevidamente classificadas como inline.
  - Subcitações não são confundidas com citações inline externas.
  - Não há alteração indevida do conteúdo.
  - Testes demonstram comportamento correto nos diferentes contextos suportados.
  - A implementação permanece compatível com impressão e com a issue `RCF — Biblioteca agnóstica para impressão Web em formato IEEE`.

  ---

* [x] Issue 2 — RCF/FT: Normatizar subcitações e sua diferenciação visual dinâmica

  ### Contexto

  Uma citação pode conter outra citação em seu interior. Essa relação deve ser semanticamente preservada e visualmente distinguível, independentemente de a citação externa estar em parágrafo, `blockquote` ou outro modelo estrutural de citação suportado pelo projeto.

  ### Requisitos
  - O RCF DEVE definir formalmente **subcitação** como citação semanticamente aninhada em outra citação.
  - Toda subcitação DEVE possuir diferenciação visual própria em relação ao conteúdo circundante.
  - A diferenciação DEVE utilizar cor de fundo baseada em `rgba`, permitindo adaptação dinâmica a tema claro/escuro.
  - A estilização NÃO DEVE depender de uma cor fixa incompatível com o tema ativo.
  - A estilização DEVE adaptar-se dinamicamente ao contexto em que a subcitação estiver inserida.
  - A adaptação DEVE considerar:
  - parágrafo;
  - `blockquote`;
  - diferentes estilos de `blockquote`;
  - diferentes estruturas HTML utilizadas para representar `blockquote`;
  - demais estilizações vigentes aplicáveis ao contexto.
  - A diferenciação visual DEVE permanecer durante a impressão.
  - A regra DEVE ser compatível com a `RCF — Biblioteca agnóstica para impressão Web em formato IEEE`.
  - A implementação NÃO DEVE introduzir estilo visual que contradiga ou sobrescreva arbitrariamente estilos legítimos já definidos para o contexto.

  ### FT

  Criar FT específica para implementar a representação visual de subcitações.

  A FT DEVE:
  1.  inspecionar os modelos reais de citação existentes;
  2.  identificar como o sistema representa citações aninhadas;
  3.  implementar a diferenciação visual de forma contextual e agnóstica ao modelo estrutural;
  4.  utilizar `rgba` e mecanismos compatíveis com temas claro/escuro;
  5.  preservar a diferenciação durante impressão;
  6.  testar subcitações em todos os modelos de `blockquote` efetivamente existentes;
  7.  validar que a solução não depende exclusivamente da tag HTML `<blockquote>`.

  ### Critérios de aceite
  - Subcitações são semanticamente identificadas.
  - Subcitações possuem fundo visualmente distinguível.
  - O fundo adapta-se ao tema ativo.
  - A estilização adapta-se ao contexto estrutural e visual.
  - A diferenciação permanece na impressão.
  - Nenhum modelo de citação existente perde sua estilização.
  - Testes cobrem aninhamento, temas, modelos estruturais e impressão.

  ---

  # Issue 3 — RCF/FT: Unificar e normatizar `blockquote` como conceito semântico e permitir estilos/modelos por ocorrência

  ### Contexto

  O projeto utiliza múltiplas formas de representar visualmente citações. O termo `blockquote` deve representar o conceito semântico de bloco de citação, independentemente de sua implementação HTML.

  Além da tag HTML padrão `<blockquote>`, o projeto pode utilizar estruturas compostas por `table`, `div` ou elementos customizados para produzir o mesmo conceito visual/semântico (a definição é feita de forma global, no artigo com fallbvack para modelo padrão configurável, e pode ser sobrescrita para um blockquote especifico fica marcação invisível especifica e única cuja finalidade especifica é adicionar estilização e/ou alteração de estrutura).

  O RCF/Markdown já possui mecanismo para definir um estilo padrão de `blockquote` para o artigo, porém essa definição não deve impedir a especificação individual de estilo ou modelo para uma ocorrência específica.

  ### Requisitos
  - O RCF DEVE definir `blockquote` como conceito semântico de **bloco de citação**, e NÃO exclusivamente como a tag HTML `<blockquote>`.
  - O conceito DEVE abranger, quando utilizados com essa finalidade, elementos/estruturas como:
  - `<blockquote>`;
  - `<div>`;
  - `<table>`;
  - elementos customizados;
  - outras estruturas equivalentes comprovadamente utilizadas pelo projeto.
  - A equivalência DEVE ser determinada pela finalidade semântica/estrutural da implementação, não apenas pelo nome da tag.
  - O RCF DEVE reconhecer que existem múltiplos estilos de `blockquote`.
  - O RCF DEVE permitir que o Markdown especifique dinamicamente o estilo/modelo aplicável a uma ocorrência específica de `blockquote`.
  - A existência de um estilo/modelo padrão definido para o artigo NÃO DEVE obrigar todas as ocorrências a utilizá-lo.
  - Uma especificação explícita para uma ocorrência DEVE prevalecer sobre o padrão global aplicável àquela ocorrência.
  - A ausência de especificação específica DEVE permitir o uso do padrão global já definido.
  - A customização DEVE preservar compatibilidade com as estruturas HTML realmente utilizadas pelo projeto.
  - O mecanismo NÃO DEVE impor arbitrariamente um modelo ou estilo único.
  - A solução DEVE preservar extensibilidade para novos modelos de `blockquote`.

  ### Precedência normativa

  Para cada ocorrência:
  1.  especificação explícita da própria ocorrência;
  2.  configuração contextual aplicável;
  3.  padrão definido para o artigo;
  4.  padrão global do sistema/RCF.

  Nenhum nível inferior pode substituir uma configuração explicitamente definida em nível superior.

  ### FT

  Criar FT específica para:
  1.  inspecionar a implementação atual de `blockquote` no Markdown e no pipeline de renderização;
  2.  mapear os modelos estruturais existentes;
  3.  formalizar o conceito semântico de `blockquote`;
  4.  formalizar os estilos/modelos suportados;
  5.  permitir seleção/customização por ocorrência;
  6.  preservar o mecanismo existente de definição de padrão por artigo;
  7.  impedir que o padrão global sobrescreva uma configuração específica;
  8.  garantir compatibilidade com estruturas `<blockquote>`, `div`, `table` e customizadas quando efetivamente utilizadas - a mesma sintaxe de marcação que é capaz de atribuir estilo/estilização diferenciada é a mesma que é capaz de alterar a estrutura construtura, ou seja, um mesmo estilo de marcação inequivoco é auto interpretativo;
  9.  documentar a precedência entre configuração específica e padrões;
  10. adicionar testes para múltiplos estilos, múltiplos modelos estruturais e sobrescrita localizada.

  ### Critérios de aceite
  - `blockquote` é tratado pelo RCF como conceito semântico, não como sinônimo exclusivo de `<blockquote>`.
  - Todos os modelos efetivamente utilizados pelo projeto são contemplados.
  - O artigo pode possuir um estilo/modelo padrão.
  - Uma ocorrência específica pode sobrescrever esse padrão.
  - A customização específica não é perdida durante renderização/publicação.
  - Não há imposição arbitrária de estilo/modelo único.
  - Na ausência da especificação do modelo de blockquote, o modelo padrão é usado
  - uma marcação especifica para cada blockquote permite desde meramente aplicar tema/estilo ao blockquote até alterar a estrutura a sedr usada para a construção do mesmo - a sintaxe neste caso é padronizada e segue o mesmo modelo
  - A precedência entre configuração específica e padrões é determinística.
  - Novos modelos podem ser incorporados sem reestruturar a norma.
  - Testes comprovam os comportamentos acima.

  ---

  # Dependências e integração

  As três issues DEVEM ser implementadas de forma coordenada:
  1.  **Issue 3** estabelece o modelo semântico e estrutural de `blockquote`.
  2.  **Issue 1** utiliza essa definição para excluir corretamente citações pertencentes a contextos de citação.
  3.  **Issue 2** utiliza a mesma definição para identificar e estilizar subcitações independentemente do modelo estrutural.

  Todas as implementações DEVEM respeitar a `RCF — Biblioteca agnóstica para impressão Web em formato IEEE`, especialmente quanto à preservação das regras de apresentação durante impressão.

  Nenhuma FT DEVE assumir estrutura, arquivo, pipeline, biblioteca, hook ou mecanismo que não seja comprovado pela inspeção do estado real do projeto.

* [x] Consolidar namespaces editoriais, roteamento em sub-RCFs e publicação determinística
  - INSPECIONE integralmente o estado real do repositório, RCF principal, `AGENTS.md`, `agents.local.md` equivalente, configuração Jekyll/GitHub Pages, plugins, layouts, conteúdos e normas existentes antes de alterar qualquer artefato.
  - Toda edição normativa DEVE preservar integralmente regras, recursos, contratos, especializações e melhorias já existentes, inclusive não relacionadas diretamente a esta tarefa. É PROIBIDO enfraquecer, degradar ou remover gradualmente comportamento normatizado sob pretexto de reorganização.
  - Preserve e consolide a semântica já estabelecida de namespace: identificador de classe editorial anteposto ao título lógico, análogo aos namespaces da Wikipédia, sem equivalê-lo a diretório-fonte ou taxonomia ordinária. :contentReference[oaicite:0]{index=0}

  - **Namespaces de topo**
    - Todo namespace de topo DEVE terminar semanticamente em `:`.
    - `bate-papo:` permanece o namespace canônico das sínteses dessa classe.
    - O título público DEVE iniciar pela representação editorial correspondente, por exemplo `Bate-papo:`.
    - A URL pública canônica DEVE conservar literalmente o `:` no namespace quando suportado pela publicação, seguindo:
      ```text
      /p/<namespace>:<titulo-normalizado>/
      ```
    - `%3A`, substituição pública por `-` ou outras formas alternativas NÃO DEVEM tornar-se representação canônica.
    - No filesystem, use representação compatível com todos os sistemas operacionais, sem `:` quando incompatível.
    - Para `bate-papo:`, o prefixo físico correspondente permanece `bate-papo-`.
    - Namespace lógico, URL pública e nome físico DEVEM permanecer representações distintas e deterministicamente conversíveis.

  - **Subnamespaces**
    - Subnamespaces PODEM existir em quantidade e profundidade indeterminadas, porém:
      - DEVEM estar subordinados a um namespace de topo;
      - NÃO recebem `:` como substituto da semântica reservada ao namespace de topo;
      - DEVEM ser materializados como níveis aninhados de diretórios/rota.
    - O padrão público DEVE ser equivalente a:
      ```text
      /p/<namespace>:<sub-namespace-1-normalizado>/.../<sub-namespace-N-normalizado>/<titulo-normalizado>/
      ```
    - `N` é indeterminado; NÃO imponha profundidade artificial.
    - Múltiplos namespaces e subnamespaces DEVEM poder coexistir futuramente sem lógica específica por caso.
    - Toda normalização DEVE ser central, determinística, reutilizável e compatível entre Windows, Linux, ambiente de desenvolvimento, build e GitHub Pages.

  - **Autoridade de conversão**
    - Preserve `content_namespaces` como autoridade única do mapeamento entre representação física, namespace lógico, título e URL, se esse contrato estiver efetivamente vigente.
    - O mecanismo/plugin responsável DEVE derivar a URL a partir da configuração normativa, validar título/disclaimer/regras especializadas e produzir resultado idêntico em desenvolvimento, build e publicação.
    - NÃO utilizar `permalink` individual ou decisões ad hoc para contornar o roteamento central.
    - Em filesystem incompatível com `:`, somente a representação física muda; a URL canônica NÃO DEVE ser degradada para refletir limitação local.

  - **Sub-RCFs e roteamento normativo**
    - Reestruture o RCF segundo conceito equivalente ao roteamento já empregado por `AGENTS.md`: norma principal compacta + sub-RCFs especializadas carregadas somente quando pertinentes.
    - A finalidade é reduzir leitura/tokenização desnecessária, aumentar rastreabilidade, segregação temática, manutenção de microconceitos e precisão de escopo.
    - Todas as sub-RCFs DEVEM residir obrigatoriamente sob:
      ```text
      ./RCFs/
      ```
    - O RCF principal DEVE:
      - permanecer autoridade superior;
      - identificar claramente cada domínio especializado;
      - rotear para a sub-RCF aplicável;
      - usar links Markdown relativos reais;
      - estabelecer escopo e precedência;
      - NÃO repetir o conteúdo especializado.
    - Sub-RCF NÃO PODE redefinir normas gerais sem delegação explícita da RCF principal.
    - Antes de criar nova norma, procure regra equivalente e consolide-a; NÃO duplique contratos.

* [x] Instituir desempenho web ≥90 como requisito permanente e corrigir gargalos reais
  - Normatize explicitamente, de forma permanente, que implementação, manutenção, refatoração e evolução do site DEVEM buscar e manter **90%+ em todas as métricas/categorias aplicáveis do PageSpeed Insights**, tanto em mobile quanto desktop, para cada modalidade real de página publicada.
  - Abranja, no mínimo, layouts reais existentes como:
    - home;
    - posts/artigos;
    - índices/mapas;
    - about;
    - demais tipos efetivamente disponibilizados.
  - NÃO presuma layouts inexistentes; descubra-os no repositório.
  - Esta especialização NÃO se sobrepõe ao `AGENTS.md`; complementa suas regras de desempenho para o produto final.
  - Se necessário para torná-la perene e inequivocamente vinculante ao repositório, DEVE ser reforçada no `agents.local.md` equivalente sem duplicação prolixa.
  - A norma DEVE permanecer válida continuamente: nova feature, correção ou refatoração NÃO PODE deteriorar desempenho sem justificativa material e tratamento correspondente.

  - **Medição eficiente**
    - Automatize medições apenas quando pertinentes.
    - PODE utilizar API adequada para aferição local quando isso evitar penalizar o asset público do GitHub Pages e reduzir custo operacional.
    - Filtre/condense automaticamente os resultados antes de apresentá-los à IA sempre que isso reduzir tokens sem perder diagnóstico útil.
    - Preserve cache e resultados válidos.
    - Evite reexecução, releitura e recálculo quando estado relevante não mudou.
    - A validação DEVE ser representativa por tipo de layout, não simplesmente repetida indiscriminadamente para cada URL equivalente.

  - **Reflow forçado em resize/orientation**
    - Preserve a necessidade funcional real de reagir a:
      - mudança de orientação;
      - redimensionamento;
      - falta/sobra de espaço;
      - agrupamento da barra de ferramentas em menu;
      - desagrupamento quando espaço voltar a existir.
    - NÃO remover ou desabilitar esse comportamento.
    - Reimplemente/refine-o para minimizar drasticamente forced reflow/layout thrashing.
    - Audite:
      - leituras/escritas intercaladas de layout;
      - eventos de `resize`;
      - observers;
      - medições repetitivas;
      - recálculos síncronos;
      - mutações redundantes;
      - listeners duplicados;
      - reconstruções integrais desnecessárias.
    - Use estratégia proporcional e consolidada — batching, debounce/throttle, `ResizeObserver`, cache de dimensões ou equivalente — somente conforme o estado real justificar.
    - O comportamento DEVE permanecer responsivo visualmente sem ocasionar travamentos ocasionais perceptíveis em hardware contemporâneo.
    - Valide especificamente resize contínuo/orientation e impacto nas métricas de desempenho.

  - **Recursos de impressão IEEE**
    - Os downloads/recursos necessários exclusivamente à impressão IEEE DEVEM permanecer funcionalmente disponíveis, porém fortemente desacoplados do carregamento essencial da página.
    - NÃO carregar antecipadamente bibliotecas/assets pesados de impressão quando não forem necessários à experiência inicial.
    - Avalie carregamento tardio/lazy/on-demand ou postergação temporal suficientemente afastada da medição inicial, inclusive janela da ordem de segundos se tecnicamente adequada.
    - NÃO interprete isso como autorização para ocultar, remover ou desabilitar impressão.
    - Audite também:
      - tamanho dos assets;
      - compressão;
      - tree-shaking;
      - divisão de bundle;
      - bibliotecas terceiras;
      - alternativas menores igualmente compatíveis.
    - Substituição de dependência somente DEVE ocorrer se houver ganho comprovado sem regressão funcional ou normativa.

* [x] Corrigir controles visuais e implementar sistema responsivo de blockquotes tipados
  - **Switch claro/escuro**
    - Preserve integralmente aparência e aderência visual atuais.
    - Corrija exclusivamente a área interativa: clique/tap em qualquer ponto do switch inteiro DEVE alternar o estado/tema.
    - NÃO exigir clique preciso sobre o ícone interno.
    - Preserve acessibilidade, teclado, semântica e estado visual.

  - **Botão de menu**
    - O botão junto ao switch DEVE utilizar o ícone Font Awesome `bars`, código `f0c9`.
    - Remova o ícone incorreto somente no ponto correspondente, sem alterar indevidamente demais iconizações.

  - **Blockquotes tipados**
    - Implemente sistema totalmente responsivo, compatível com claro/escuro e integrado visualmente ao tema existente.
    - Use como referência visual/conceitual — com adaptações pontuais necessárias ao projeto — os modelos indicados:
      - `notice`: equivalente conceitual ao `Template:Unreferenced category/doc`;
      - `info`: equivalente ao `Template:GOCEinuse`;
      - `alerta1`: equivalente ao `Template:Recently revised`;
      - `alerta2`: equivalente ao `Template:Unreferenced category`.
    - Preserve semântica local; NÃO copie dependências ou estrutura da Wikipédia desnecessariamente.
    - O sistema DEVE admitir iconização opcional definida pelo editor:
      - emoji;
      - imagem;
      - URL/recurso equivalente suportado.
    - Quando nenhum ícone for informado, PODE existir padrão contextualmente coerente com o tipo.
    - Tema, ícone, borda, fundo, contraste, espaçamento e responsividade DEVEM funcionar corretamente nos dois modos.
    - Faça validação visual efetiva em múltiplos tamanhos de viewport.

  - **Disclaimer de `bate-papo`**
    - Todo disclaimer normativo do namespace `bate-papo:` DEVE utilizar o tipo/estilo:
      ```text
      alerta1
      ```
    - Normatize essa associação na sub-RCF de bate-papo.

* [x] Preservar otimização responsiva das imagens de cards e thumbnails
  - Localize a TO-DO/regra já existente sobre variantes responsivas de imagem.
  - Se realmente existir, **some este requisito à norma existente**, NÃO crie contrato paralelo.
  - Cards, thumbnails e demais consumidores DEVEM carregar somente a menor imagem que satisfaça a resolução real necessária no contexto corrente.
  - Preserve os contratos já estabelecidos sobre:
    - variantes;
    - DPR;
    - viewport;
    - proporção;
    - custo em bytes;
    - seleção responsiva;
    - índice de medidas/proporções.
  - NÃO regredir para download da maior imagem por conveniência.

* [x] Criar e aplicar sub-RCF especializada para sínteses `bate-papo`
  - Criar sub-RCF compacta, autossuficiente em seu domínio e subordinada à RCF principal.
  - A RCF principal DEVE obrigatoriamente roteá-la e referenciá-la por link relativo real sob `./RCFs/`.
  - A norma especializada DEVE generalizar a classe editorial, NÃO um artigo particular.

  - **Natureza editorial**
    - Todo `bate-papo:` DEVE ser síntese temática, NÃO transcrição, ata, reconstrução cronológica nem artigo autoral independente.
    - A organização temática DEVE preservar cronologia quando material à compreensão.
    - O resultado DEVE permanecer íntegro, fiel, legível, fluido e agradável.
    - Preserve proporcionalmente:
      - ideias;
      - argumentos;
      - filosofias;
      - conceitos;
      - divergências;
      - hipóteses;
      - raciocínios intermediários;
      - hesitações;
      - condicionais;
      - mudanças de posição;
      - qualificações;
      - contexto necessário.
    - Densidade informacional NÃO autoriza reducionismo.
    - Elimine repetição, redundância e prolixidade sem reduzir substância.
    - Use linguagem acessível a diferentes níveis de formação, mantendo tecnicidade quando necessária.
    - NÃO mencionar áudio, ferramenta/processo de transcrição ou timestamps salvo indispensabilidade material.
    - Formulações discretas como “o participante argumenta” ou “o instrutor observa” PODEM preservar origem intelectual.
    - NÃO converter conteúdo dos participantes em autoria própria do redator.

  - **Fidelidade**
    - NÃO inventar, completar ou atribuir posição, intenção, objeção, conclusão, concordância, rejeição ou aprovação não demonstrada.
    - Silêncio NÃO significa concordância.
    - NÃO inferir consenso.
    - “O grupo concluiu” e equivalentes somente PODEM ser usados se caráter coletivo estiver demonstrado.
    - Preserve incerteza quando ela existir.
    - Corrija linguagem editorial que induza unanimidade inexistente.

  - **Participantes**
    - Usar nomes fictícios por padrão, salvo identificação inequívoca contrária ou ID previamente normatizado.
    - Papéis funcionais PODEM ser utilizados quando efetivamente demonstrados.
    - NÃO converter papel editorial observado em autoridade/título não comprovado.
    - Particularidades de um bate-papo NÃO DEVEM virar regra geral.

  - **Disclaimer**
    - Todo conteúdo `bate-papo:` DEVE iniciar com disclaimer padronizado, visível, semanticamente completo e ultrassucinto.
    - Deve informar, sem prolixidade:
      - natureza de síntese editorial;
      - inexistência de garantia de concordância coletiva;
      - silêncio/ausência de manifestação não implica unanimidade;
      - possibilidade de ponderação/discordância/não manifestação;
      - processamento automatizado, inclusive com IA;
      - possibilidade de erro, imprecisão ou interpretação inadequada.
    - NÃO reiterar no corpo ressalvas já suficientemente cobertas pelo disclaimer.

  - **Citações**
    - Preserve integralmente todas as citações e referências existentes.
    - Toda citação textual DEVE aparecer integralmente em sua primeira ocorrência explícita, com referência.
    - Repetições posteriores NÃO DEVEM reproduzi-la integralmente sem necessidade.
    - Confirme equivalência antes de deduplicar.
    - NÃO invente trechos ausentes.
    - Referência bibliográfica NÃO equivale a citação textual.
    - Citação integral da obra PODE ser acrescentada em nota adicional para contexto/fluidez quando materialmente útil.

  - **Complementação editorial**
    - Quando um participante fizer referência inequívoca a fonte/citação omitida, cortada ou não localizada, PODE — e preferencialmente DEVE quando melhorar exatidão/compreensão — localizar e acrescentar pontualmente a referência/citação.
    - O acréscimo DEVE ser explicitamente identificado como nota adicional/editorial.
    - NÃO expandir livremente o argumento.
    - Exceção de complemento externo DEVE ser pequena, tecnicamente justificada e orientada exclusivamente à continuidade lógica, exatidão ou fluidez.

  - **Referências**
    - Utilizar exclusivamente:
      ```markdown
      [^nomeado]
      ```
    - Respeitar o sistema já definido pela RCF principal.
    - NÃO criar numeração concorrente ou sistema paralelo.
    - Reutilizar referências semanticamente equivalentes.

  - **Subnamespace de obra-base**
    - Quando for inequívoco que o bate-papo inicia ou continua estudo/leitura de **uma obra-base principal**, crie/vincule um único subnamespace correspondente ao nome normalizado dessa obra.
    - Outras obras citadas durante a discussão NÃO DEVEM gerar automaticamente subnamespaces concorrentes.
    - A decisão DEVE decorrer do papel estrutural da obra no bate-papo, não da mera quantidade de citações.

  - **Estrutura/estilo**
    - Normatize, conforme aplicável:
      - títulos/subtítulos;
      - autoria/origem de falas;
      - citações;
      - referências;
      - `blockquote`;
      - subcitações;
      - Markdown;
      - intervenções editoriais;
      - separação entre original e complemento;
      - publicação.
    - NÃO introduzir ornamentação por preferência estética.

  - **Renomeação física**
    - Ao concluir a transformação da transcrição/origem para `.md`, o arquivo final DEVE ser renomeado adequadamente conforme:
      - namespace;
      - subnamespace;
      - tema/título efetivo;
      - normalização prevista no RCF.
    - A regra vale independentemente do nome temporário ou pasta original, respeitando casos em que diretório próprio do artigo seja parte do contrato.

  - **Aplicação imediata**
    - Após criar a sub-RCF, aplique-a ao conteúdo `bate-papo` já existente que esteja dentro do escopo legítimo.
    - NÃO limite a normalização ao `_draft` atual.
    - Preserve integralmente citações, referências, detalhes, nuances e autoria intelectual.

  - **Validação e aceite**
    - Validar:
      - RCF principal → sub-RCF;
      - links relativos;
      - ausência de duplicação normativa relevante;
      - namespace físico/lógico/público;
      - subnamespaces;
      - disclaimer;
      - estilo `disclaimer`;
      - síntese temática;
      - fluidez;
      - fidelidade individual;
      - ausência de consenso inferido;
      - divergências/incertezas;
      - participantes;
      - primeira ocorrência integral das citações;
      - deduplicação;
      - referências `[^nomeado]`;
      - notas editoriais;
      - autoria intelectual;
      - nomes físicos finais;
      - estrutura/estilo;
      - build;
      - desenvolvimento local;
      - publicação GitHub Pages;
      - testes/validadores aplicáveis.
    - O aceite exige comportamento uniforme, determinístico e verificável para conteúdos atuais e futuros, sem perda de regra, feature, citação, referência, detalhe, nuance ou especialização preexistente.

* [ ] Criar, conforme já definido no RCF, a `síntese fiel` em .md, da transcrição do bate-papo salvo em `_drafts\bate-papo\eventos-finais\` salvando-o devidamente para .md, já devidamente nomeado e aninhado.
  - preservar todo detalhe e nuance importante para correta compreensão;
  - citações e referenciasa não podem ser perdidas em devem ser localizadas e preenchidas casos não estejam plenamente compreendias;
  - Considerar que por boa parte do tempo inicial, cerca de 30 minutos, o assunto não hava iniciado, embora eventualmente tocado em assuntos importantes, o papo ficou em cumprimentos e em grande parte em assuntos não teológicos que devem ser ignorados.
  - realizar commit após completo.

* [ ] corrigir o nome do outro \_draft de bate papo para subnamespacesob `eventos-finais`.

* [ ] Publicar ambos os bate-papos.

* [ ] Converter imagens raster para WebP com processamento único e rastreável
  - Sem regredir ajustes, recursos ou qualidade já consolidados, converter todo `.jpg`/`.jpeg`/`.png` para `.webp`, inclusive conteúdo editorial, usando otimização open source análoga à já definida em `Preservar otimização responsiva das imagens de cards e thumbnails`; NÃO aplicar a SVG ou formatos não abrangidos.
  - Preservar obrigatoriamente o original. Manter manifesto/estado rastreável contendo ao menos hash e timestamp/estado da origem; gerar/reprocessar WebP SOMENTE na criação ou alteração efetiva do original, vedando recompressão cumulativa e degradação progressiva.
  - Substitui automaticamente a ligação nos artigos/códigos originais para os novos webp, sempre que houver efetiva necessidade.

* [ ] Corrigir regressões dos cards conforme `.ia.rules\state\requests\evidencias\evidencia1.png`, `evidencia1a.png` e `evidencia1b.png`
  - Aplicar correções cirúrgicas, preservando toda evolução válida existente.
  - Cards: máximo absoluto de **3 colunas**; restaurar a regressão que permite 4.
  - Flag de data: eliminar crop/corte; restaurar ancoragem vertical para que sua pequena base lateral encoste corretamente na borda do card/thumbnail.
  - Remover a data redundante abaixo do título: publicação/modificação DEVE permanecer exclusivamente na flag já normatizada.
  - Dark mode: aumentar legibilidade do texto de cards já visitados/clicados, sem descaracterizar o estado `visited`.
  - Responsividade da flag: tamanho da flag e tipografia DEVEM variar coerentemente entre si, preservando proporção, posicionamento e estabilidade visual. A flag PODE reduzir conforme a thumbnail, mas o texto NÃO PODE reduzir a ponto de comprometer legibilidade e qualquer data válida DEVE caber integralmente em sua margem visual.

* [ ] Corrigir semântica visual de botões e impressão conforme evidências
  - Em `.ia.rules\state\requests\evidencias\evidencia2.png`, remover o ícone indicativo de link da paginação, inclusive `Anterior`/`Próximo`; nenhum elemento semanticamente/visualmente equivalente a botão DEVE exibir indicador próprio de hyperlink.
  - Em `evidencia3.png`, preservar links no conteúdo, mas tornar OBRIGATÓRIA na impressão a materialização de sua URL em nota de rodapé final. O marcador `<sup>` PODE existir no HTML permanentemente invisível na web e tornar-se visível apenas na impressão. Cada URL impressa DEVE permanecer inequivocamente vinculada ao respectivo link.
  - Em `evidencia4.png` e `evidencia4a.png`, restaurar o rodapé normatizado em **todas as páginas impressas**, contendo ao menos: link da licença, disclaimer/equivalente, data da impressão, publicador e URL canônica.

* [ ] Restaurar limite responsivo da imagem de destaque conforme `.ia.rules\state\requests\evidencias\evidencia5.png`
  - A imagem de destaque JAMAIS PODE exceder a altura disponível da viewport nem, com scroll totalmente no topo, ultrapassar visualmente sua borda inferior.
  - Corrigir somente dimensionamento/layout necessário, preservando responsividade, proporção, qualidade e demais comportamentos válidos existentes.
