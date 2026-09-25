<!-- AI-PROCESSED -->
# RCF-JCEM-REVISAO-IA-001

Status: vigente.

Escopo: preparação e execução automatizada de revisão assistida por IA para artigos alterados, com interfaces portáveis e sem mutação automática do corpus.

Dependências: [Operação especializada da IA](./operacao-da-ia.md), [Bate-papo](./bate-papo.md), [Carregamento progressivo](./carregamento-progressivo.md), [Publicação](./publicacao.md) e as sub-RCFs editoriais disparadas pelo conteúdo.

## Gatilhos e seleção

- O workflow DEVE operar em `pull_request` somente quando houver alteração material sob `_posts/`, `_drafts/` ou `_pages/`, e em `workflow_dispatch` para execução humana explícita. `push`, `schedule`, comentário, issue, publicação e evento vindo de fork com segredo não são gatilhos autorizados. [PENDENTE-CODIGO]
- A seleção DEVE comparar base e head informados pelo evento, aceitar somente Markdown regular existente dentro dos três roots editoriais e rejeitar path traversal, symlink, arquivo removido, binário, diretório, arquivo fora do escopo e entrada acima dos limites declarados. [PENDENTE-CODIGO]
- Renomeação é tratada como o novo path. Artigo não alterado não integra o pacote. Falha em determinar uma base confiável interrompe a revisão com diagnóstico; não autoriza varredura integral do corpus.
- Execução manual PODE receber base/head ou lista explícita, mas aplica os mesmos roots, limites e validações. O conjunto efetivo, exclusões e motivos DEVEM constar no manifesto de saída. [PENDENTE-CODIGO]

## Arquitetura e interfaces

- Um adaptador local determinístico prepara um pacote versionado composto por manifesto JSON, instrução de revisão e cópias dos artigos selecionados. Detecção Git, empacotamento, política editorial e provedor de IA permanecem módulos separados.
- O prompt de revisão referencia as fontes normativas por path e exige análise distinta para: preservação de voz em conteúdo humano; síntese conversacional; rigor acessível; referências e citações; e cover/OG/overlay somente quando o front matter ou assets correlatos forem materialmente afetados.
- A resposta esperada é somente parecer revisável, com arquivo, região, severidade, norma, explicação e sugestão. A IA NÃO PODE alterar artigo, asset, estado operacional, branch, commit, PR, issue ou publicação. [PENDENTE-CODIGO]
- O adaptador DEVE funcionar localmente sem provedor: nesse modo produz pacote completo e informa revisão pendente. Um provedor futuro entra por interface explícita de entrada/saída e NÃO PODE receber arquivos fora do manifesto. [PENDENTE-CODIGO]
- Contratos, prompt-base e exemplos genéricos DEVEM permanecer independentes de paths privados, proprietário do repositório, segredos e metadados de consumidor, permitindo reaproveitamento posterior sem tornar este repositório fonte do núcleo gerenciado. [PENDENTE-CODIGO]

## Privilégios e salvaguardas

- O workflow usa o menor privilégio: conteúdo somente leitura e nenhuma permissão de escrita, token persistido, credencial de publicação ou segredo disponibilizado a código de PR. Dependência externa de Action DEVE ser oficial, necessária e fixada por versão imutável compatível com a política do repositório. [PENDENTE-CODIGO]
- Logs e artefatos NÃO PODEM conter token, segredo, arquivo fora da seleção, conteúdo privado não requerido nem metadado operacional de outro repositório. O pacote limita cardinalidade e bytes por arquivo e no total; estouro falha antes de qualquer chamada externa. [PENDENTE-CODIGO]
- Resultado automatizado é diagnóstico auxiliar, nunca aprovação editorial, aceite humano, autorização de publicação nem fundamento isolado para remover ou enfraquecer conteúdo.
- Falha, indisponibilidade ou ausência de provedor não altera o corpus. O workflow conserva o pacote determinístico, registra o estado exato e termina segundo política explícita, sem fabricar parecer positivo.

## Portabilidade e fronteira upstream

- A implementação local DEVE gerar material de proposta sob `docs/propostas-upstream/`, contendo problema, contrato genérico, interfaces, trechos mínimos úteis, testes e limites. Paths e exemplos específicos deste produto devem ser parametrizados ou removidos quando não forem essenciais. [PENDENTE-CODIGO]
- O pacote de proposta NÃO PODE incluir segredos, URLs privadas, conteúdo de artigos, hashes de execução, identificadores de consumidor nem arquivos gerenciados integrais. A sanitização é validada automaticamente. [PENDENTE-CODIGO]
- É proibido abrir, publicar, comentar, rotular, atribuir, acompanhar ou implementar issue no upstream. Qualquer ação externa exige solicitação e autorização futuras próprias. [PENDENTE-CODIGO]

## Validação

- Testes DEVEM cobrir artigo alterado, não alterado, draft, página, renomeação, remoção, path traversal, symlink, excesso de arquivos/bytes, base inválida e execução sem provedor. [PENDENTE-CODIGO]
- A integração DEVE provar que apenas o conjunto selecionado entra no pacote; que o prompt roteia normas editoriais e visuais aplicáveis; e que nenhuma etapa modifica corpus, Git, upstream ou publicação. [PENDENTE-CODIGO]
- A sanitização DEVE rejeitar padrões de segredo, conteúdo editorial incorporado indevidamente, referência a root externo e metadado identificável de consumidor no material portável. [PENDENTE-CODIGO]
