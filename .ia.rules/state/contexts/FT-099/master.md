# Contexto mestre — FT-099

Estado: concluída tecnicamente; publicação registrada e aguardando aceite humano do TODO.

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

## Resultado

- O check oficial confirmou papel `consumer`, destino `jcempro/agents.md` e disponibilidade do repositório e do release.
- A proposta sanitizada foi publicada como `https://github.com/jcempro/agents.md/issues/14`.
- Hash da proposta: `19290e096835f50792134e9bc7bd012f3c31ea53cb59562b420759c0507dedd1`.
- Hash da evidência: `32b0b5c34415264ea5a66e5965e4004ec7bd8baaf8ee2411c69aeacf054af3c1`.
- A versão-fonte `revisao-editorial-portavel/v1` foi registrada pelo sanitizador como `revisao-editorial-portavel[PATH_REDACTED]`; ambos os valores permanecem explícitos no registro de publicação.
- A issue foi observada aberta, sem responsável e sem marco.
- O publicador inicial desta FT não atribuiu, rotulou, comentou, implementou, movimentou nem encerrou a issue.
- Por solicitação humana posterior explícita, a FT publicou um único anexo técnico sanitizado com norma, workflow, código e testes em `https://github.com/jcempro/agents.md/issues/14#issuecomment-5829303460`.
- Nenhuma atribuição, mudança de estado, implementação, movimentação ou encerramento foi realizado pela FT.
- Após a criação, `github-actions[bot]` aplicou o rótulo `agents:highly-recommended` e publicou um parecer automático do upstream. Esses efeitos não foram solicitados nem alterados por esta FT.
- A próxima revisão depende de nova solicitação e autorização humana.
