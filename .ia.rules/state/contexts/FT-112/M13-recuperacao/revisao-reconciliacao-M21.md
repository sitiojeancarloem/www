# Estado de continuidade — FT-112 reaberta

Fonte canônica corrigida apenas na seção FT-112; sync oficial retornou STATE_PROJECTIONS_SYNCED, projeções idênticas. Histórico M12 preservado; a ampliação está em andamento. Autorização humana posterior do localWorker prevalece sobre a vedação anterior deste chat.

O primeiro staging parcial não aplicou por diferença CRLF nos blobs HEAD: não houve efeito nas duas entradas do índice. O commit 4176744199 contém somente o recibo/plano da reconciliação, não a mudança de estado. Uma correção objetiva preservou CRLF no patch; git apply --cached --check e aplicação passaram. O commit 1d04bbbc24 efetivamente versiona somente a seção FT-112 nos dois arquivos. Outros deltas herdados, inclusive FT-105, continuam fora do commit e preservados no working tree.

Não reaplicar o patch. O state-manager reconcile não reabre FTs (aceita somente concluídas); foi usado o ponto oficial sync após a atualização declarativa da fonte canônica. Nenhum mecanismo do núcleo foi modificado. Próxima unidade M22 de captura bíblica, com plano e artefato pending próprios.
