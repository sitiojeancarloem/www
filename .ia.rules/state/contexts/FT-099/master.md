# Contexto mestre — FT-099

Estado: implementação autorizada; publicação ainda não executada.

## Objetivo

Publicar no upstream configurado a proposta sanitizada de revisão editorial portável já produzida pelas FTs 096 a 098, usando somente o mecanismo oficial e registrando evidência suficiente para auditoria.

## Dependências satisfeitas

- FT-096 consolidou o contrato e a fronteira de portabilidade.
- FT-097 produziu a implementação local e o material sanitizado.
- FT-098 validou seleção, salvaguardas, integração e ausência de efeitos externos.
- `docs/propostas-upstream/revisao-editorial-portavel.md` contém a proposta local revisável.

## Operação autorizada

1. Verificar identidade, destino e disponibilidade com `agent:upstream:check`.
2. Converter a proposta local em evidência estruturada e sanitizá-la com `agent:upstream:prepare`.
3. Verificar duplicidade e criar uma única issue com `agent:upstream:publish --authorize`.
4. Registrar número, URL, data, versão/hash, cenário, FT, destino e estado no repositório consumidor.

## Limites

- Não publicar conteúdo editorial, segredo, path privado nem metadado identificador do consumidor.
- Não atribuir, rotular, comentar, implementar, movimentar ou encerrar a issue criada.
- Não atuar fisicamente no repositório upstream nem alterar a implementação local já concluída.
- Falha de autenticação, permissão, destino, sanitização ou duplicidade interrompe a publicação sem contorno alternativo.
