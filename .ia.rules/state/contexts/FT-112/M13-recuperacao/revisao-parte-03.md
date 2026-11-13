# M13a — parte 3: resultado não aceito integralmente

Job b212e6dd-aac0-49ae-89cd-77186777c006 COMPLETED, mas com erros semânticos.

Aceito: identificação do fim da seção 6.2, da seção 6.3 (Bíblia) e do início da 6.4 (Blockquotes), instruções removidas do comentário histórico. 6.3 e 6.4 não pertencem à seção 6.2.
Rejeitado: numeração específica inventada; classificação de parágrafos de contexto sobre vitória/graça como removidos; interpretação de números dos hunks como linhas da evidência; conclusão sobre substituição de romanismo sem ver linha adicionada. O único hunk completo no fragmento, @@ -411,7 +277,6 @@, remove uma linha vazia.
A linha removida sobre romanismo está cortada de sua contraparte adicionada: aguardar par completo.

## Causa concreta na evidência
delta.txt contém “[... conteúdo truncado ...]”, herdado da saída do comando do primeiro Worker. O fracionamento preservou o texto capturado, mas não poderia recuperar o conteúdo já omitido. Partes 1 e 2 precedem truncamento e mantêm aceite; plano de apenas cinco partes deixa de garantir cobertura.
Recuperação determinística: mesma comparação Git capturada diretamente em bytes em delta-integral.patch, sem exibição volumosa. Prefixo anterior ao truncamento conferido idêntico. SHA256 7230f3d3f6ca7ceca8931970d8a303c796c97ac666b812a61313a7fa12ac6533, 41288 bytes. Não houve reanálise editorial pelo supervisor. delta.txt original preservado como evidência da falha.
Próximo: inventariar complemento do primeiro hunk, depois hunks completos do corpo. Nunca usar fragmentos truncados para afirmar cobertura total.

Git determinístico do job: dev ahead 4, zero commits do Worker, alterações herdadas; draft sem mudança registrada. Nenhuma edição autoral nesta unidade.
