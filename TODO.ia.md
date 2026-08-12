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

- [ ] Corrigir regressão visual exclusiva da página 404
  - Conforme `.ia.rules\state\requests\evidencias\evidencia1.png`, somente a página 404 deixou de reproduzir corretamente o comportamento já existente do logotipo, que DEVE extrapolar suavemente os limites da barra em vez de permanecer cropado/confinado dentro dela.
  - Identificar e corrigir cirurgicamente a causa específica da divergência da 404, preservando o comportamento correto das demais páginas e SEM alterar desnecessariamente estilos, estrutura ou contratos compartilhados.
  - NÃO regredir responsividade, posicionamento, sobreposição, clipping, navegação ou qualquer recurso já consolidado.

- [ ] Harmonizar tabelas com o modo escuro
  - Conforme `.ia.rules\state\requests\evidencias\evidencia2.png`, corrigir a tematização das tabelas em dark mode para assegurar contraste, legibilidade e coerência visual equivalentes ao modo claro.
  - A correção DEVE abranger somente os aspectos necessários dos elementos efetivamente componentes da tabela e respectivos estados, respeitando a tematização e normas existentes.
  - NÃO introduzir paleta arbitrária, alterar sem necessidade o modo claro nem regredir acessibilidade, hierarquia visual ou estilos válidos já implementados.

- [ ] Disponibilizar visualização ampliada de toda imagem de conteúdo
  - Conforme `.ia.rules\state\requests\evidencias\evidencia3.png`, toda imagem exibida ao usuário, independentemente do dispositivo, DEVE disponibilizar controle para visualização maximizada/em tela cheia.
  - O controle DEVE ser sutil, preferencialmente iconográfico, claramente acionável e posicionado sem encobrir conteúdo relevante, prejudicar a imagem, quebrar o layout ou interferir no fluxo textual.
  - Sua área acionável DEVE ser adequada tanto a mouse quanto a toque, sem pressupor mecanismo, biblioteca ou implementação inexistente.
  - Para preservar a visualização integral da imagem, o controle PODE permanecer oculto por padrão e tornar-se visível quando necessário: em dispositivos com mecanismo de apontamento compatível, mediante `hover`; e, em interfaces por toque/clique, a partir da primeira interação com a imagem. A implementação DEVE também contemplar interação por teclado quando aplicável.
  - A aparição do controle NÃO DEVE deslocar conteúdo, alterar dimensões da imagem, provocar reflow relevante nem ocultar região significativa da imagem. Seu estado de visibilidade e interação DEVE ser previsível e compatível com os diferentes métodos de entrada, sem depender exclusivamente de `hover`.
  - A ampliação DEVE preservar proporção e qualidade disponível da imagem e permitir retorno inequívoco ao contexto anterior.
  - A implementação DEVE respeitar responsividade, acessibilidade e comportamentos existentes, reutilizando mecanismos já presentes somente se comprovadamente adequados.
  - Inspecionar previamente o estado real e aplicar a solução de modo geral às imagens pertinentes, SEM criar exceções arbitrárias por página, formato ou dispositivo e SEM interferir em imagens cujo comportamento normativo específico exija tratamento distinto.
