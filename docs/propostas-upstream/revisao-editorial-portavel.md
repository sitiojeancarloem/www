# Proposta local: revisão editorial portável

Status: publicado como [jcempro/agents.md#14](https://github.com/jcempro/agents.md/issues/14) em 2026-09-25; acompanhamento depende de nova solicitação e autorização.

## Problema genérico

Repositórios editoriais precisam revisar somente documentos materialmente alterados, aplicar políticas distintas a texto humano e síntese conversacional e produzir parecer auditável sem conceder escrita automática ao corpus.

## Contrato sugerido

- Entrada: base/head Git ou lista explícita, roots e limites declarados.
- Seleção: Markdown regular existente, sem symlink, traversal, remoção ou arquivo fora dos roots.
- Pacote: manifesto versionado, prompt normativo e cópias somente dos documentos selecionados.
- Provedor: interface opcional posterior; a preparação funciona sem credencial e informa estado pendente.
- Saída: achados com arquivo, região, severidade, norma, explicação e sugestão.
- Efeitos proibidos: alteração de corpus, commit, PR, issue, publicação ou atuação em outro repositório.

## Interfaces reutilizáveis

```text
changedPaths(base, head) -> Change[]
classifyPath(path, policy) -> Selected | Excluded
prepareReviewPackage(selection, limits) -> Manifest + Prompt + Files
review(package, provider?) -> Findings | Pending
```

O manifesto registra hashes e bytes, mas o material portável não incorpora conteúdo editorial, segredo, URL privada, identificador de consumidor ou metadado de execução. Roots, limites, rotas normativas e provedor são parâmetros do consumidor.

## Salvaguardas mínimas

Permissões somente leitura; checkout sem credencial persistida; cardinalidade e bytes limitados antes de chamada externa; seleção baseada em diff validado; nenhuma interpretação positiva diante de provedor ausente; artifact de curta retenção e revisão humana obrigatória.

## Testes sugeridos

Cobrir alteração, não alteração, draft, página, renomeação, remoção, traversal, symlink, arquivo e lote excessivos, base inválida, ausência de provedor, corpus inalterado e sanitização do material portável.

## Registro de publicação

- Destino: `jcempro/agents.md`.
- Issue: [#14 — Revisão editorial portável para documentos alterados](https://github.com/jcempro/agents.md/issues/14).
- FT: `FT-099`.
- Cenário: `scenario.governance.upstream-sharing`.
- Estado observado: aberta, sem responsável e sem marco.
- Efeitos desta FT: verificação de duplicidade e criação da issue pelo publicador oficial.
- Complemento autorizado: [anexo técnico com norma, workflow, código e testes](https://github.com/jcempro/agents.md/issues/14#issuecomment-5829303460).
- Efeitos do upstream: `github-actions[bot]` aplicou `agents:highly-recommended` e publicou um parecer automático; a FT não solicitou, alterou nem removeu esses efeitos.
- Próxima revisão: somente mediante nova solicitação e autorização humana.
