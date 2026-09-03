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

- [ ] AJustar o TTS:
  - somente em modo completo DEVE ler o sumário/TOC.
  - a referência, atualmene simplesmente lê o número, por mero exemplo, "vinte", ou "trinta e trêz". Mas isso pode gerar confusão quando na frase/parágrafo houver números, portanto, é importante que, embora seja breve e suscinto como está, exista alguma forma de dizer que o numero se refere a citação, sugiro algo como "citação trinta e um", "refeência trinta e um", "nota trinta e um" ou algo equivalente que seja melhor e mais suscinto.

  - O modo "resumido" ou o "contínuo", aquele que for o modo mais simpples, que equivalha ao mais fluido, não deve ler notas/rteferências citadas, apenas ao final do parágrafo deve citar, como já ocorre, de mencionar que foram citados x números de referências.

  - o sumário/TOC deve existir apenas após o primeiro parágrafo, desconsiderando-se blockquotes, e isso, se aplica NÃO APENAS a TTS.

- TOC/SUMÁRIO gerado automáticamente
  - em tempo de compilação, um TOC/sunário, temátizado e com;átivel com o switch de modo claro/esculo, atranete, bonito e agradável, deve ser gerado, e DEVE estar localizado imediatamente após o primeiro parágrafo do texto, ignorando blockquotes.
  - Não DEVE impactar ou alterar o conteúdo do .md origem;
  - DEVE ser retrel, por padrão retratído, de tal forma a não atrapalhar ou distratir o usuário/leitor.
  - TTS: não deve ser lido, exceto em modo completo ou o que vier a substituí-lo no futuro.
  - Aparência: evitar apareência que sugira propagando ou a o problema de "cegueira de faixa" (https://en.wikipedia.org/wiki/Banner_blindness), independente se retraído ou não; usar melhores práticas para sites acadêmico, entretanto, considere o estilo e tematização arrojada atual.
  - impressão, o TOC/simário NÃO DEVE ser impresso, exceto se for compatível com as regras do IEEE, e se for, a localização e estilização DEVEM ser devidamente ajustadas no momento da impressão em pdf ou nativa, conforme diretivas RCF e agents.md.

- [ ] COVERs: implementação e definição completa a ser integrada com a definição atualmente definida no RCF.
  - As diretrizes aqui visam corrigir, aprimorar e incrementar o recurso de COVER e NÃO regredir nem eliminar recurso.
  - toda cover DEVE seguir a proporção 1,91:1.
  - excetua-se da proporção 1,91:1 imagens cover:
    - cuja largura seja extrema, objetivando simular horizonte infinito, neste caso, apenas a região central,na proporção de 1,91:1 é que DEVE ser considerada útil, com base na altera da própria imagem.
    - cover de horizonte infinito formado por 3 imagens, onde a central, obrigatoriamente DEVE seguir a proporção 1,91:1.
  - as correção/FTs atualmente em andamento devem ser equalizadas e ajustadas para convergir com este.
  - em qualquer artigo, DEVE ser possível informar separadamene, e opcionalmente, as imagens OG 1,91:1 e 1:1, de forma separada do cover, ou seja, DEVE ser possível especificar imagens OGs diferentes das que serão cover.
  - cover formado por 3 imagens:
    - o uso da expressão "3 imagens" DEVE ser entendido de forma "não arbitrária". Na realidade, a central, é de fato uma imagem, entretanto, as outras duas, se referem a pattern, que podem ser imagem, ou cor (hex ou linear-gradient).
