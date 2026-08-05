- [ ] RCF — Biblioteca agnóstica para impressão Web em formato IEEE

## 1. Objetivo

Ao imprimir ou exportar para PDF, o site DEVE ocultar elementos alheios ao artigo e renderizar o conteúdo principal em paginação física, composição e estrutura tão aderentes ao formato IEEE quanto tecnicamente possível, ressalvadas exclusivamente as exceções deste RCF.

A implementação DEVE:

1. funcionar independentemente de o usuário iniciar a impressão por botão próprio, menu nativo, atalho de teclado, compartilhamento do sistema ou mecanismo equivalente;
2. NÃO bloquear, limitar, substituir nem tornar obrigatória uma forma específica de impressão;
3. NÃO corromper a página em tela, a visualização de impressão nem a saída final;
4. aplicar degradação progressiva: CSS/Sass puro primeiro; TypeScript ou motor externo somente quando indispensável;
5. ser construída desde a origem como biblioteca autônoma, ainda que inicialmente armazenada e consumida dentro do próprio site.

## 2. Natureza da biblioteca

1. A implementação DEVE ser concebida, estruturada, testada e importada como biblioteca isolada, não como conjunto de estilos ou scripts intrinsecamente pertencentes ao site hospedeiro.
2. Sua localização inicial dentro do repositório do site NÃO DEVE criar acoplamento arquitetural, semântico, estrutural ou operacional com ele.
3. A biblioteca DEVE ser:

   * agnóstica de site, tema, CMS, framework e gerador estático;
   * desacoplada da árvore de componentes, rotas, layouts e convenções internas do hospedeiro;
   * integrável a qualquer projeto Web baseado em Node.js;
   * potencialmente extraível, versionável, publicável e distribuível sem reescrita substancial.
4. A biblioteca NÃO DEVE importar diretamente arquivos privados, componentes, aliases, variáveis globais, helpers, templates ou estado do site inicial.
5. O site hospedeiro DEVE integrar a biblioteca por API, configuração, atributos, classes, adaptadores ou pontos de extensão documentados.
6. A biblioteca DEVE possuir fronteiras explícitas entre:

   * núcleo genérico;
   * adaptadores de integração;
   * configuração do consumidor;
   * sobreposições locais.
7. Código específico do primeiro site somente PODE existir em adaptador externo ao núcleo.
8. A remoção do adaptador inicial NÃO DEVE comprometer o funcionamento genérico da biblioteca.

## 3. Generalização obrigatória

1. Problemas encontrados durante a integração inicial DEVEM ser analisados como classes de problema, não como exceções exclusivas do site.
2. A correção DEVE resolver o padrão causal amplo, incluindo variações estruturalmente equivalentes, e não apenas o HTML, seletor, componente ou caso concreto observado.
3. É PROIBIDO introduzir correções rígidas baseadas exclusivamente em:

   * identificadores privados;
   * nomes de classes acidentais;
   * profundidade fixa de DOM;
   * ordem circunstancial de elementos;
   * caminho de arquivo específico;
   * conteúdo textual particular;
   * dependência implícita do tema inicial.
4. Exceções particulares somente PODEM ser tratadas por configuração ou adaptador, nunca incorporadas silenciosamente ao núcleo.
5. Toda generalização DEVE preservar determinismo e evitar heurísticas ambíguas.
6. Quando não houver identificação genérica confiável, a biblioteca DEVE exigir marcação, metadado ou configuração explícita.
7. A solução DEVE abranger elementos semanticamente equivalentes mesmo quando implementados por marcações, componentes ou frameworks distintos.
8. Cada correção relevante DEVE produzir teste genérico reutilizável e, quando aplicável, teste específico no adaptador consumidor.

## 4. Referência, precedência e determinismo

1. O padrão IEEE vigente DEVE constituir a referência externa de geometria, composição, hierarquia e paginação; este RCF NÃO o redefine.
2. As exceções locais prevalecem somente quanto a:

   * fonte principal sem serifa;
   * chamadas referenciais em sobrescrito;
   * preservação controlada de tabelas, cores e avisos institucionais;
   * integração, portabilidade e extensibilidade Web.
3. Valores, medidas, tolerâncias, modelos ou comportamentos NÃO DEVEM ser imaginados, inferidos arbitrariamente ou adotados por mera semelhança visual.
4. Todo parâmetro DEVE ser derivado de fonte normativa, template IEEE de controle, medição reproduzível ou requisito explícito.
5. A conformidade DEVE ser aferida sobre impressão física ou PDF final, nunca apenas pela aparência em tela.

## 5. Arquitetura e isolamento

1. A impressão DEVE possuir camada própria e isolada, preferencialmente sob `@media print`.
2. A apresentação em tela NÃO DEVE ser alterada pela biblioteca.
3. O artigo DEVE ser identificado por contrato semântico configurável, preferencialmente atributo como `[data-print-article]`.
4. A camada de impressão DEVE:

   * ocultar elementos não pertinentes;
   * reexibir o artigo e os elementos institucionais autorizados;
   * neutralizar estilos de layout incompatíveis;
   * impedir que estilos globais, temas, frameworks ou componentes corrompam a impressão;
   * preservar conteúdo, semântica e acessibilidade.
5. `!important` PODE ser utilizado exclusivamente quando necessário para garantir isolamento determinístico na impressão.
6. Sass, TypeScript, Jekyll, geradores estáticos, frameworks ou bibliotecas PODEM integrar a solução, mas NÃO DEVEM constituir dependência conceitual obrigatória.
7. Estruturas existentes de duas ou mais colunas destinadas à exibição em tela DEVEM ser ignoradas na impressão; somente a composição de colunas definida para o artigo impresso DEVE prevalecer.
8. Seletores do núcleo DEVEM ser limitados ao escopo controlado da biblioteca.
9. A biblioteca NÃO DEVE aplicar reset global fora de seu contêiner ou contexto de impressão.
10. Colisões de nomes, variáveis, classes e estilos com o site hospedeiro DEVEM ser evitadas por namespace, encapsulamento ou estratégia equivalente.

## 6. Empacotamento e integração

1. A biblioteca DEVE poder ser consumida por importação explícita em ambiente Node.js.
2. Sua estrutura DEVE permitir, sem redesign:

   * uso interno por workspace ou pacote local;
   * publicação futura em registro de pacotes;
   * versionamento semântico;
   * geração de artefatos distribuíveis;
   * uso com ou sem bundler, conforme escopo declarado.
3. Entradas de CSS/Sass e TypeScript DEVEM ser independentes e importáveis separadamente quando possível.
4. Dependências opcionais NÃO DEVEM ser carregadas por consumidores que não utilizem seus recursos.
5. O núcleo DEVE evitar efeitos colaterais na importação.
6. Inicialização automática somente PODE ocorrer quando explicitamente habilitada.
7. A API pública DEVE ser mínima, estável, documentada e independente de detalhes internos.
8. Configurações DEVEM possuir valores padrão seguros, validação determinística e possibilidade de extensão.
9. A biblioteca DEVE aceitar integração declarativa, programática ou híbrida.
10. O consumidor DEVE conseguir:

    * identificar o artigo;
    * mapear metadados;
    * declarar elementos omitidos ou preservados;
    * registrar elementos de largura total;
    * ajustar parâmetros autorizados;
    * acionar ou consultar o estado de preparação.
11. APIs privadas NÃO DEVEM ser necessárias para integração normal.
12. Recursos específicos do build do primeiro site DEVEM ser implementados em plugin, adaptador ou configuração externa.

## 7. Impressão nativa e compatibilidade cross-browser

1. A impressão nativa será o fluxo predominante e DEVE ser plenamente suportada.
2. Scripts ou motores auxiliares, quando necessários, DEVEM responder também a impressões iniciadas externamente à interface do site.
3. A implementação DEVE avaliar e combinar, conforme suporte efetivo:

   * `beforeprint`;
   * `afterprint`;
   * consultas `matchMedia("print")`;
   * preparação antecipada assíncrona;
   * fallback exclusivamente CSS.
4. A compatibilidade DEVE abranger, no mínimo, os navegadores e motores oficialmente suportados pela biblioteca.
5. A matriz de suporte DEVE pertencer à biblioteca, não ao primeiro site consumidor.
6. A ausência, falha, bloqueio ou carregamento incompleto de JavaScript NÃO DEVE produzir página vazia, conteúdo truncado nem impressão inutilizável.
7. Scripts auxiliares NÃO DEVEM cancelar, impedir ou sequestrar a impressão nativa.
8. Quando a preparação completa ainda não estiver disponível, a folha e a visualização de impressão DEVEM:

   * preservar o conteúdo legível;
   * indicar discretamente que recursos de impressão ainda estão sendo preparados;
   * evitar afirmar conformidade integral enquanto houver dependência pendente.
9. A mensagem de preparação NÃO DEVE aparecer após a conclusão bem-sucedida nem integrar permanentemente o artigo.
10. Diferenças entre navegadores DEVEM ser absorvidas pelo núcleo ou por adaptadores de motor, nunca por condicionais específicas do site.

## 8. Carregamento progressivo e custo de rede

1. Downloads, processamento e requisições adicionais exclusivos para impressão DEVEM ser minimizados.
2. Recursos essenciais já disponíveis na página DEVEM ser reutilizados.
3. Dependências adicionais somente PODEM ser carregadas quando tecnicamente justificadas.
4. O carregamento adicional DEVE ocorrer, preferencialmente:

   * de forma assíncrona;
   * após o carregamento integral do documento;
   * após imagens e recursos críticos da página;
   * em período ocioso ou alguns segundos depois;
   * sem bloquear interação, renderização ou navegação.
5. `requestIdleCallback` PODE ser usado com fallback temporal compatível.
6. O carregamento NÃO DEVE causar travamentos, mudanças visuais, reflow perceptível ou degradação relevante em conexões lentas.
7. Atalhos ou impressão antecipada DEVEM acionar preparação imediata somente quando possível sem quebrar o fluxo nativo.
8. Dispositivos móveis DEVEM possuir estratégia própria baseada em capacidade real, não apenas em identificação por agente de usuário.
9. O build DEVE avaliar suporte e comportamento de impressão nos navegadores móveis oficialmente abrangidos.
10. Recursos adicionais PODEM ser:

    * omitidos quando a impressão não estiver tecnicamente disponível;
    * carregados sob demanda quando houver sinal confiável de uso;
    * condicionados por capacidade, plataforma e custo estimado.
11. A solução NÃO DEVE introduzir requisições, atrasos ou processamento móvel sem benefício verificável.
12. Dependências opcionais DEVEM ser carregadas pela biblioteca por estratégia configurável e desacoplada do ciclo de carregamento do site.
13. O consumidor DEVE poder fornecer recursos já carregados, cacheados ou hospedados localmente sem duplicação.

## 9. Paginação e colunas

1. A saída DEVE utilizar CSS Paged Media, com `@page`, tamanho físico, margens e área útil explicitamente definidos conforme a referência IEEE adotada.
2. Cada folha DEVE constituir unidade de paginação independente.
3. O fluxo padrão em duas colunas DEVE ser fragmentado por página; é PROIBIDO tratar todo o documento como uma única região multicoluna contínua.
4. A implementação DEVE controlar:

   * largura e intervalo entre colunas;
   * quebras de página e coluna;
   * órfãs e viúvas;
   * títulos desacompanhados;
   * fragmentação de parágrafos;
   * figuras, tabelas, equações e legendas;
   * referências;
   * elementos que atravessem ambas as colunas;
   * balanceamento quando exigido pela referência.
5. Elementos indivisíveis NÃO DEVEM ser fragmentados quando couberem integralmente na página seguinte.
6. Quebras manuais DEVEM ser excepcionais, sem marcação vazia ou puramente visual.
7. A escala final DEVE ser `100%`; ajustes automáticos do tipo “encaixar na página” NÃO DEVEM ser pressupostos.
8. Cabeçalhos, rodapés, margens e metadados adicionados pelo navegador DEVEM ser desativados pelo usuário ou evitados quando houver controle técnico legítimo, sem bloquear a impressão.
9. A lógica de paginação NÃO DEVE depender da estrutura particular de templates do consumidor.

## 10. Tipografia

1. A família principal DEVE ser `Noto Sans`, com fallback sans-serif local metricamente adequado.
2. A fonte PODE ser obtida do Google Fonts, desde que:

   * seja carregada antes da paginação final;
   * contenha somente pesos efetivamente utilizados;
   * seja incorporada ao PDF quando suportado;
   * possua fallback determinístico;
   * não torne a impressão dependente de conectividade tardia.
3. Hospedagem local da fonte DEVE ser preferida quando reduzir risco, latência ou dependência externa.
4. O tamanho nominal em `pt` NÃO DEVE ser presumido visualmente equivalente ao Times New Roman da referência IEEE.
5. Corpo, títulos, resumo, legendas, notas e referências DEVEM ser calibrados pela saída física.
6. A calibração DEVE considerar:

   * altura real das linhas;
   * caracteres médios por linha;
   * linhas por coluna;
   * densidade e ocupação vertical;
   * largura aparente;
   * quebras de página;
   * equivalência visual com o documento de controle.
7. Geometria física DEVE usar unidades adequadas, preferencialmente `pt`, `in` ou `mm`; `px`, `rem` e unidades de viewport NÃO DEVEM governar dimensões impressas essenciais.
8. O mecanismo tipográfico DEVE permanecer funcional quando a fonte remota não estiver disponível.

## 11. Referências, notas e metadados

1. Chamadas bibliográficas e notas globais DEVEM ser exibidas como sobrescritos numerados, equivalentes a `<sup>[1]</sup>`.
2. A numeração DEVE ser global, crescente, estável e independente de página, coluna ou seção.
3. Cada chamada DEVE possuir associação semântica e, quando aplicável, vínculo navegável com a referência correspondente.
4. Referências repetidas PODEM reutilizar a mesma numeração.
5. URLs de links comuns NÃO DEVEM ser automaticamente anexadas ao texto impresso.
6. A primeira página DEVE apresentar, de forma visível, discreta e coerente com o padrão IEEE:

   * URL canônica de obtenção;
   * data em que o conteúdo foi obtido ou impresso.
7. Quando existentes, também DEVEM ser apresentados:

   * data original de publicação;
   * data da última atualização.
8. Esses dados DEVEM integrar naturalmente a área de autoria, identificação, nota editorial ou região equivalente, sem aparência promocional ou chamativa.
9. Autores, afiliações, contatos e metadados PODEM ser reorganizados especificamente para impressão, desde que nenhum dado relevante seja perdido ou falseado.
10. A biblioteca DEVE receber metadados por contrato genérico e permitir mapeamento entre esquemas distintos.
11. Nomes de campos próprios do primeiro site NÃO DEVEM integrar a API central.

## 12. Conteúdo imprimível

1. Navegação, menus, barras laterais, publicidade, comentários, compartilhamento, controles, formulários, tags sociais e elementos interativos alheios ao artigo DEVEM ser ocultados.
2. Título, autoria, afiliações, resumo, palavras-chave, seções, figuras compatíveis, tabelas, equações, notas, referências e avisos essenciais DEVEM permanecer.
3. Imagens DEVEM:

   * preservar proporção;
   * manter resolução suficiente;
   * respeitar limites de coluna ou página;
   * conservar suas cores.
4. Cores de imagens NÃO DEVEM ser removidas, convertidas ou reduzidas arbitrariamente.
5. Fundos decorativos, sombras, filtros, animações, transições e transparências não essenciais DEVEM ser removidos.
6. Thumbnails e imagens de destaque DEVEM ser omitidos, salvo quando:

   * constituírem conteúdo editorial relevante; e
   * puderem ser inseridos de forma compatível com a composição IEEE.
7. Conteúdo não imprimível DEVE poder ser declarado por classe, atributo, seletor ou callback configurável.
8. A classificação automática de conteúdo DEVE ser conservadora e nunca remover material editorial sem regra explícita ou semântica confiável.

## 13. Rodapé institucional e avisos

1. O rodapé visual do site NÃO DEVE ser reproduzido integralmente.
2. Elementos sociais, navegação, tags, widgets, fundos e decoração DEVEM ser removidos.
3. Informações essenciais DEVEM ser preservadas e reorganizadas em bloco institucional discreto, incluindo, quando existentes:

   * site ou entidade publicadora;
   * disclaimer;
   * licença;
   * avisos legais;
   * atribuições obrigatórias;
   * demais informações cuja omissão altere o contexto jurídico ou editorial.
4. Esse bloco PODE divergir do IEEE estrito, mas DEVE ser integrado da forma mais natural, compacta e aderente possível.
5. Conteúdo institucional redundante NÃO DEVE ser repetido em todas as páginas, salvo exigência normativa ou legal.
6. A biblioteca DEVE permitir que cada consumidor mapeie suas informações institucionais sem alterar o núcleo.

## 14. Tabelas

1. A estilização preexistente de tabelas DEVE ser tolerada sempre que permanecer legível, íntegra e compatível com a página impressa.
2. A implementação NÃO DEVE impor aparência IEEE rígida às tabelas.
3. Tabelas zebradas, cabeçalhos escuros com texto claro e primeira coluna destacada PODEM ser preservados.
4. O sistema DEVE interferir somente para:

   * evitar estouro da área útil;
   * preservar legibilidade;
   * impedir cortes indevidos;
   * corrigir cores ou contrastes inadequados para impressão;
   * controlar fragmentação.
5. Redefinições visuais NÃO essenciais são PROIBIDAS.
6. Tabelas largas DEVEM adotar estratégia determinística, como redução controlada, orientação de página, largura total ou divisão semanticamente segura, conforme capacidade e referência aplicável.
7. Estratégias de tratamento DEVEM ser selecionáveis por configuração genérica, não por classes particulares do primeiro site.

## 15. Citações em bloco e elementos equivalentes

1. Todas as marcações destinadas semanticamente a citações em bloco DEVEM receber tratamento uniforme, ainda que implementadas por:

   * `<blockquote>`;
   * classes;
   * componentes;
   * elementos genéricos;
   * Markdown processado;
   * estruturas HTML equivalentes.
2. Múltiplos estilos de citação somente PODEM permanecer quando compatíveis com o padrão impresso ou expressamente autorizados.
3. Variações meramente visuais de tela DEVEM ser normalizadas na impressão.
4. Blockquotes ou equivalentes designados para atravessar ambas as colunas DEVEM preservar essa intenção e ocupar a largura total da região paginada.
5. A travessia de colunas DEVE ser explicitamente declarada por classe, atributo, metadado ou configuração; NÃO DEVE ser inferida por aparência.
6. Citações comuns DEVEM permanecer no fluxo regular das colunas.
7. O reconhecimento de elementos equivalentes DEVE ser extensível por adaptadores ou seletores fornecidos pelo consumidor.

## 16. Implementação progressiva

1. CSS/Sass puro DEVE ser a primeira opção.
2. TypeScript somente DEVE ser introduzido para capacidades não executáveis com confiabilidade por CSS.
3. Cada recurso programático DEVE ser isolado, opcional e progressivamente aprimorativo.
4. Quando biblioteca externa for necessária, DEVE ser:

   * open source;
   * mantida;
   * estável;
   * leve;
   * modular;
   * compatível com os navegadores-alvo;
   * proporcional ao problema;
   * utilizável sem corromper a impressão nativa.
5. **PubCSS** DEVE ser avaliado como base estrutural e referência inicial.
6. **Vivliostyle** e **Paged.js** PODEM ser avaliados para paginação avançada.
7. A escolha NÃO DEVE ser feita apenas por amplitude funcional; tamanho, custo de rede, tempo de inicialização, compatibilidade, manutenção e fallback DEVEM ser medidos.
8. A impressão nativa com CSS DEVE permanecer funcional quando qualquer motor adicional estiver indisponível.
9. Dependências externas DEVEM ser encapsuladas atrás de interfaces substituíveis.
10. A API pública da biblioteca NÃO DEVE expor diretamente detalhes proprietários de motores externos.
11. Trocar, remover ou atualizar um motor NÃO DEVE exigir alteração nos consumidores, salvo mudança formal de versão principal.

## 17. Extensibilidade

1. A biblioteca DEVE possuir:

   * núcleo comum;
   * configuração por consumidor;
   * adaptadores opcionais;
   * sobreposições explicitamente delimitadas.
2. Ajustes locais DEVEM ocorrer por:

   * propriedades customizadas CSS;
   * classes ou atributos documentados;
   * arquivo Sass/CSS posterior ao núcleo;
   * hooks opcionais de preparação e finalização;
   * mapeadores de metadados e seletores.
3. Overrides NÃO DEVEM redefinir silenciosamente invariantes do padrão.
4. Cada exceção local DEVE ser pontual, rastreável, documentada e testável.
5. A biblioteca NÃO DEVE depender da estrutura integral do tema, layout, framework ou gerador do site.
6. Pontos de extensão DEVEM ser explícitos e restritos; monkey patches e alterações internas pelo consumidor são PROIBIDOS.
7. A extensibilidade NÃO DEVE comprometer a saída padrão nem introduzir comportamento não determinístico.

## 18. Portabilidade e distribuição futura

1. A biblioteca DEVE poder ser extraída do repositório inicial mantendo:

   * histórico compreensível;
   * testes;
   * documentação;
   * licença;
   * API pública;
   * build;
   * artefatos de distribuição.
2. Caminhos, aliases e infraestrutura do primeiro repositório NÃO DEVEM ser necessários após a extração.
3. A biblioteca DEVE possuir licença open source compatível com suas dependências e finalidade de distribuição.
4. Dependências e códigos derivados DEVEM preservar licenças, avisos e atribuições obrigatórias.
5. O pacote futuro DEVE poder ser usado em múltiplos projetos sem duplicação ou fork.
6. Personalizações por projeto DEVEM permanecer fora do pacote ou ser fornecidas como configuração e adaptadores reutilizáveis.
7. A documentação DEVE distinguir claramente:

   * comportamento do núcleo;
   * integração mínima;
   * recursos opcionais;
   * limitações por navegador;
   * customização por consumidor.

## 19. Validação

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
27. demonstrar ausência de efeitos colaterais fora do escopo da biblioteca.

## 20. Critério de fidelidade

“Compatível com IEEE” DEVE significar equivalência física, estrutural e composicional mensurável na saída impressa, excetuadas somente as alterações expressamente autorizadas neste RCF.

“Biblioteca agnóstica” DEVE significar que o núcleo opera por contratos públicos, não conhece detalhes privados do consumidor, resolve classes gerais de problemas e pode ser reutilizado, extraído e distribuído sem reimplementação substancial.

Similaridade visual em tela, dependência exclusiva de um motor, funcionamento apenas por fluxo controlado, correções específicas do primeiro site ou mera separação física de arquivos NÃO constituem conformidade.
