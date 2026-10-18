# M32 — estrutura das notas após integração

Entrada: carta b7cfd38635374381cddd64f6e190582115e2771d9cdbf7f5f92a2a56a2455bd7; M31 aceita em72d77f634c. Sete edições mecânicas exatas pelo adaptador/editor oficial. Não reescrever corpo ou alterar hipótese Ap12/17.

1. Mover AI-PROCESSED do prefixo antes de [^ap1217]: para depois de dois-pontos: identificador fica no início da linha, conteúdo e marca intactos. Corrige reconhecimento da nota, não sua interpretação.
2. Reativar cesmith ao lado de smithparentese, preservando fonte/link já existente.
3. Unir chamadas baalprofetas/quatrocentos contíguas sem espaços de texto entre elas, mantendo ambas.
4. Migrar link contextual Ap8:1–6 para duracoesfuturas; remover definição ap81 que perdeu chamada.
5. Remover somente definições órfãs ap7 e ap915, da discussão substituída pelo autor, já preservadas em histórico e recibos. Nenhum argumento vigente eliminado.

Precondições: hash, âncoras únicas, recibo inexistente. Sequência: aplicar uma vez; validar-estrutura-M32.py; diff --check. Validador lexical exige chamadas/definições correspondentes sem duplicação ou órfãs e ausência dos padrões de instrução realmente usados no draft. Não confundir TODO com todos. Relatório pending rastreado, depois status passed e hash. Qualquer falha preserva aplicação/diagnóstico, sem replay da mutação.

Aceite supervisor dirigido ao recibo e à nota Ap12/17 preservada; commit imediato. Checagem lexical não prova HTML. Próxima M33: adaptar a validação renderizada antiga ao nome/front matter atuais, conferir footnotes/marcas e contrato real da tabela/legenda/TTS. Revisão global de preservação e de fontes ainda necessária; não alegar tarefa integral concluída.
