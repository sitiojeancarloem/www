# Correção delimitada de execução — EGW/Ester

Job b7d348a6-e601-4eb4-850d-aa1272aa9d00: FAILED, error_kind persistido WORKER_INCOMPLETE. Causa técnica concreta: UnicodeEncodeError na linha408 ao imprimir JSON ensure_ascii=False por stdout cp1252; caractere U+FFFE não representável. A busca chegou à serialização, mas stdout vazio não permite recuperar ocorrências. Não houve evidência primária aproveitável nem implementação.

Novo job: mesmo mecanismo oficial/consulta delimitada, com opção nativa Python -X utf8 antes do script. Mudança material restrita à codificação de I/O desta execução; sem edição de runtime/Worker/biblioteca. Reexecução somente leitura necessária para recuperar resultado não emitido, não repetição de análise já obtida. Não fazer retry adicional sem causa nova.

Git determinístico do job: dev ahead6, alterações herdadas de contexto/outros trabalhos/_site, draft sem modificação registrada; nenhum commit do Worker. Inventário anterior preservado. Próximo: aceitar apenas estado real da fonte, conferir literalidade/paginação e registrar antes de aplicação.
