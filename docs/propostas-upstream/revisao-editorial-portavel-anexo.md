## Anexo técnico sanitizado

Para reduzir retrabalho na avaliação e eventual implementação, seguem trechos mínimos adaptados de uma implementação consumidora validada. Os exemplos são parametrizados e não incluem conteúdo editorial, segredos, caminhos privados ou identificadores do consumidor.

### 1. Norma de referência

```md
## Seleção e efeitos

- A revisão DEVE selecionar somente documentos materialmente alterados entre uma base e um head validados.
- A seleção DEVE aceitar apenas arquivos regulares dentro dos roots declarados e rejeitar traversal, symlink, remoção, extensão fora do escopo e estouro de limites.
- Falha ao determinar uma base confiável DEVE interromper a revisão; não autoriza varredura integral do corpus.
- A saída é parecer revisável com arquivo, região, severidade, norma, explicação e sugestão.
- A revisão NÃO PODE alterar corpus, Git, pull request, issue ou publicação.
- Ausência ou falha do provedor DEVE resultar em estado pendente, nunca em aprovação fabricada.

## Privilégios

- O workflow DEVE usar conteúdo somente leitura e checkout sem credencial persistida.
- Cardinalidade e bytes DEVEM ser limitados antes de qualquer chamada externa.
- Resultado automatizado é diagnóstico auxiliar e NÃO substitui aceite humano.
```

### 2. Workflow de referência

```yaml
name: Revisão assistida de documentos

on:
  pull_request:
    paths:
      - 'content/**/*.md'
  workflow_dispatch:
    inputs:
      base:
        required: true
        type: string
      head:
        required: true
        type: string

permissions:
  contents: read

jobs:
  prepare-review:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@<SHA_IMUTAVEL>
        with:
          fetch-depth: 0
          persist-credentials: false
      - name: Preparar pacote
        env:
          REVIEW_BASE: ${{ github.event.pull_request.base.sha || inputs.base }}
          REVIEW_HEAD: ${{ github.event.pull_request.head.sha || inputs.head }}
        run: node scripts/prepare-review.mjs --base "$REVIEW_BASE" --head "$REVIEW_HEAD"
      - uses: actions/upload-artifact@<SHA_IMUTAVEL>
        with:
          name: editorial-review
          path: .review-package/
          retention-days: 7
```

### 3. Seleção segura e pacote determinístico

```js
import { lstat, realpath } from 'node:fs/promises';
import path from 'node:path';

const within = (parent, target) => {
  const relative = path.relative(parent, target);
  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
};

export async function classifyPath(candidate, policy) {
  const normalized = String(candidate || '').replace(/^\.\//, '').replaceAll('\\', '/');
  if (!normalized || normalized.includes('\0') || path.isAbsolute(normalized) || normalized.split('/').includes('..')) {
    return { path: normalized, selected: false, reason: 'unsafe_path' };
  }
  const root = policy.roots.find((entry) => normalized.startsWith(`${entry}/`));
  if (!root || !policy.extensions.includes(path.extname(normalized).toLowerCase())) {
    return { path: normalized, selected: false, reason: 'out_of_scope' };
  }
  try {
    const absolute = path.resolve(policy.workspace, normalized);
    const metadata = await lstat(absolute);
    if (metadata.isSymbolicLink() || !metadata.isFile()) {
      return { path: normalized, selected: false, reason: 'not_regular' };
    }
    const resolved = await realpath(absolute);
    const resolvedRoot = await realpath(path.join(policy.workspace, root));
    if (!within(resolvedRoot, resolved)) return { path: normalized, selected: false, reason: 'root_escape' };
    if (metadata.size > policy.maxFileBytes) return { path: normalized, selected: false, reason: 'file_limit' };
    return { path: normalized, selected: true, bytes: metadata.size, absolute };
  } catch (error) {
    if (error.code === 'ENOENT') return { path: normalized, selected: false, reason: 'missing_or_removed' };
    throw error;
  }
}
```

O manifesto pode manter o provedor desacoplado e tornar a ausência explícita:

```js
const manifest = {
  schema: 1,
  base: comparison.base,
  head: comparison.head,
  provider: { status: 'pending', reason: 'provider_not_configured' },
  limits: policy.limits,
  selected: selected.map(({ path, bytes, sha256 }) => ({ path, bytes, sha256 })),
  excluded: excluded.map(({ path, reason }) => ({ path, reason })),
  totalBytes,
};
```

### 4. Testes mínimos de aceitação

```js
assert.equal((await classifyPath('../secret.md', policy)).reason, 'unsafe_path');
assert.equal((await classifyPath('outside.md', policy)).reason, 'out_of_scope');
assert.equal((await classifyPath('content/missing.md', policy)).reason, 'missing_or_removed');
assert.equal(prepared.manifest.provider.status, 'pending');
assert.equal(hash(await readFile(source)), before, 'preparation changed the corpus');
await assert.rejects(prepareReviewPackage(tooManyFiles), /FILE_COUNT_LIMIT/);
await assert.rejects(prepareReviewPackage(tooManyBytes), /TOTAL_BYTES_LIMIT/);
assert.match(workflow, /permissions:\s*\n\s*contents: read/);
assert.match(workflow, /persist-credentials: false/);
assert.doesNotMatch(workflow, /pull_request_target|secrets\.|contents: write|\bpush:/);
```

Matriz complementar: documento alterado/não alterado, draft, página, renomeação, remoção, traversal, symlink, base inválida, arquivo/lote excessivo, provedor ausente, pacote reproduzível, sanitização e corpus inalterado.
