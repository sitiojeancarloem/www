<!-- AI-PROCESSED -->
# RCF-JCEM-DOCUMENTACAO-METADADOS-001

Status: vigente; implementação documental concluída na FT-063 e integração/validação concluída na FT-064, pendente de validação humana.

Escopo: documentação de uso, exemplos copiáveis, ilustrações comparativas, referências normativas e metadados públicos do projeto.

## Autoridade e fontes

- Documentação de uso DEVE descrever o estado material do produto sem criar configuração, comportamento, modelo, alias, asset ou garantia ausente das RCFs, schemas, registros e implementação vigentes. [a1378a6]
- Quando as fontes divergirem, RCF e schema ou registro canônico DEVEM prevalecer; a documentação subordinada DEVE ser corrigida no mesmo ciclo da mudança material. [a1378a6]
- Cada página de uso DEVE ligar a sub-RCF autoritativa e identificar as fontes executáveis das quais deriva inventários fechados, como `config/cover-system.json` e `config/editorial-quotes.json`. [a1378a6]
- Referência externa, evidência visual e nome histórico PODEM explicar origem ou intenção, mas NÃO DEVEM substituir o contrato local nem ser apresentados como capacidade implementada. [a1378a6]

## Arquitetura documental

- `README.md` DEVE permanecer porta de entrada compacta e indexar páginas de uso por contexto ou função em tabela com link direto e descrição ultrassucinta suficiente para indicar aplicação real, finalidade e horizonte relevante. [a1378a6]
- Toda documentação canônica de modo de uso DEVE residir obrigatoriamente sob `./docs/`; a raiz, `RCFs/`, fontes de pacote e demais diretórios NÃO DEVEM receber página concorrente de modo de uso. [a1378a6]
- Conteúdo denso, inventário de opções, matriz visual e exemplos extensos DEVEM residir na página temática correspondente, sem duplicação integral no `README.md`. [a1378a6]
- Cada domínio de uso DEVE possuir uma página canônica única; resumo em outro documento DEVE apontar para ela e NÃO PODE formar manual concorrente. [a1378a6]
- Link documental DEVE ser relativo, resolver no GitHub e no checkout local e preservar caixa e nome reais do arquivo. [a1378a6]
- Alteração em sintaxe de autoria, configuração, comportamento público, modelo ou aparência documentada DEVE atualizar no mesmo ciclo a página temática, seu exemplo, sua ilustração aplicável e o índice do `README.md` quando a descrição deixar de representar o estado real. [a1378a6]

## Exemplos e ilustrações

- Toda página de modo de uso DEVE conter ao menos um exemplo realista, copiável sem alteração obrigatória e aceito sem erro pelo parser, schema, registro e pipeline do repositório. [a1378a6]
- Exemplo que referencia asset local DEVE usar arquivo versionado existente; placeholder inexistente, segredo, URL volátil ou passo implícito obrigatório é proibido. [a1378a6]
- Ilustração comparativa DEVE representar a aparência e a semântica material do recurso, declarar alternativa textual útil e não PODE prometer detalhe ausente da renderização real. [a1378a6]
- SVGs de uma mesma família DEVEM compartilhar dimensões, `viewBox`, escala, tokens, tipografia segura e linguagem visual, permitindo comparação direta. [a1378a6]
- SVG documental DEVE permanecer legível no GitHub em temas claro e escuro, sem script, fonte remota, dependência de CSS externo ou contraste dependente de um único fundo. [a1378a6]
- Variação combinatória de alias, cor, ícone, fit ou propriedade ortogonal NÃO DEVE ser promovida a modelo autônomo; a página DEVE distinguir inventário canônico, alias e combinação configurável. [a1378a6]

## Metadados públicos

- Manifesto que identifica o projeto ou módulo distribuível DEVE declarar repositório upstream, licença e autoria quando o formato suportar esses campos; manifesto exclusivamente privado usado apenas como fronteira técnica PODE omiti-los quando não identificar produto publicável. [a1378a6]
- O upstream canônico deste produto DEVE ser `https://github.com/sitiojeancarloem/www`; a licença DEVE ser `MPL-2.0`; a autoria principal DEVE identificar `JeanCarloEM` e `https://www.jeancarloem.com`. [a1378a6]
- `README.md` DEVE expor link explícito para o upstream e não PODE inferi-lo apenas de badge, comando Git, arquivo de licença ou metadado de pacote. [a1378a6]
- Metadados equivalentes em manifestos distintos DEVEM convergir semanticamente, respeitando a forma própria de cada formato e sem alterar nome, versão, privacidade, empacotamento ou resolução de módulo. [a1378a6]

## Documentação de blockquote

- `MODO-DE-USO-BLOCKQUOTE.md` DEVE ser a página canônica única de uso, configuração e estilos de bloco de citação, ligada diretamente por `RCFs/citacoes.md` e pelo índice do `README.md`. [a1378a6]
  Página física: [`docs/MODO-DE-USO-BLOCKQUOTE.md`](../docs/MODO-DE-USO-BLOCKQUOTE.md).
- O inventário documental DEVE derivar de `config/editorial-quotes.json` e cobrir todo modelo registrado, inclusive renderer cuja saída não permaneça na tag `<blockquote>`; identificador ausente do registro NÃO PODE ser documentado como disponível. [a1378a6]
- Cada modelo registrado DEVE possuir ao menos uma representação visual fiel. Se um mesmo modelo oferecer somente variação de cor ou somente variação de ícone, duas amostras distintas bastam; combinação nomeada de múltiplas cores DEVE exibir paleta compacta com os tons reais. [a1378a6]
- A página DEVE documentar a sintaxe única por ocorrência, defaults e precedência, configuração global e de artigo, estrutura HTML equivalente, autoria, acessibilidade, impressão e fallback sem JavaScript. [a1378a6]
- Emoji ou texto curto, URL HTTPS e asset interno DEVEM ter usos explicados separadamente; nomes internos fechados DEVEM ser listados integralmente, enquanto entrada arbitrária DEVE ser descrita por formato e restrições sem inventário impossível. [a1378a6]
- Ao menos um exemplo completo DEVE ser copiável sem alteração obrigatória, usar somente modelo e asset existentes e atravessar sem erro a normalização Markdown, o registro e o build. [a1378a6]
- Adição, remoção ou alteração de modelo, sintaxe, nome, cor, ícone, estrutura ou precedência DEVE atualizar conjuntamente `RCFs/citacoes.md`, a página, as representações atingidas e a validação documental. [a1378a6]
- A página DEVE distinguir modelos concretos, aliases dinâmicos e tokens cromáticos; DEVE listar integralmente os aliases e cores nomeadas do registro, ilustrar cada modelo concreto ao menos uma vez e mostrar duas cores quando um único modelo for parametrizável apenas por cor. [PENDENTE-CODIGO]

## Projeção operacional e validação

- `agents.local.md` DEVE carregar esta rota sempre e somente quando houver alteração de documentação `.md`, de metadado público ou de recurso cuja interface de uso, exemplo ou ilustração seja afetada. [a1378a6]
- A projeção local DEVE exigir atualização conjunta das páginas, exemplos e ilustrações aplicáveis, permanecendo compacta e apontando para esta sub-RCF em vez de copiar suas regras. [a1378a6]
- Validação automatizada DEVE conferir links, unicidade das páginas canônicas, inventários contra schemas e registros, existência dos assets usados nos exemplos, cobertura das ilustrações e convergência dos metadados. [a1378a6]
- Validação visual DEVE inspecionar as famílias SVG em representações clara e escura e comprovar legibilidade, escala comum e distinção suficiente entre conceitos. [a1378a6]
- Build e gates documentais NÃO DEVEM alterar Markdown editorial nem incorporar `_site`; conclusão operacional permanece condicionada à validação humana prevista em `TODO.ia.md`. [a1378a6]
