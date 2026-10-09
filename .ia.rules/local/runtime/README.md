# Executor local de operação resiliente — FT-104

Fonte: `resilient-operation.ts`; artefato gerado: `resilient-operation.js`.
O JavaScript usa CommonJS, conforme `../../package.json`. Edite a fonte e regenere o build.

## Contrato

`executeResilientOperation(initialState, strategies)` retorna `{ status, state, attempts }`.
Cada Strategy possui `id`, `eligible`, `blocked?`, `execute(state)` e `verify(candidate)`.
A lista é finita, com 1 a 64 estratégias e IDs únicos; sua ordem é preservada.
Estratégias inelegíveis são ignoradas, inclusive quando possuem `blocked: true`.
Uma estratégia elegível bloqueada encerra a operação. Cada estratégia é tentada no máximo uma vez.
Somente `verify(candidate) === true` conclui com sucesso; não há chamadas posteriores ao sucesso.

- `completed`: retorna o candidato validado.
- `exhausted`: nenhuma alternativa concluiu; retorna clone do estado inicial.
- `blocked`: interrompida por estratégia elegível bloqueada; retorna clone do estado inicial.

Cada execução recebe um clone independente do estado inicial. A verificação recebe outro clone do candidato.
Mutações na verificação não alteram o candidato retornado.
As tentativas registram ID, ordem iniciada em 1, horários ISO, outcome e código fixo em falhas.
Falhas de execução/verificação usam `EXECUTE_RESILIENT_FAILED`, sem expor a mensagem da exceção.
Entradas inválidas são rejeitadas antes dos callbacks com `INVALID_STRATEGIES` ou `INVALID_JSON_STATE`.

O estado aceita JSON: null, booleanos, strings, números finitos, arrays densos e objetos simples.
Ciclos, accessors, símbolos, estruturas exóticas e propriedades não suportadas são rejeitados.
O clone impõe limites de profundidade 100 e 10000 nós; referências compartilhadas são copiadas separadamente.
Callbacks devem ser síncronos e sem efeitos externos: preservar JSON não desfaz IO, arquivos ou processos.
O executor não implementa timeout, cancelamento nem execução de processos.

## Uso e manutenção

Execute os comandos na raiz do repositório, com dependências locais instaladas.

```powershell
node -e "const api=require('./.ia.rules/local/runtime/resilient-operation.js'); console.log(api.executeResilientOperation(0,[{id:'one',eligible:true,execute:()=>1,verify:x=>x===1}]));"
node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --module commonjs scripts/test_resilient_operation.ts
node -e "const fs=require('node:fs'),ts=require('typescript');const src='.ia.rules/local/runtime/resilient-operation.ts';fs.writeFileSync(src.replace(/\.ts$/,'.js'),ts.transpileModule(fs.readFileSync(src,'utf8'),{fileName:src,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText);"
node -e "const fs=require('node:fs'),p=require('node:path'),ts=require('typescript');const js=ts.transpileModule(fs.readFileSync('scripts/test_resilient_operation.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','exports','__dirname',js)(require,{},p.resolve('scripts'));"
```

A checagem de tipos deve passar antes da geração; transpileModule sozinho não faz análise semântica.
Os testes permanentes exercitam a fonte; o build recebeu validação separada de paridade e carregamento por require/import.
Evidência atual: Node 22.21.0, testes e carregamento aprovados até o commit 5d2a6df661.
A composição de execução única e o baseline Node24 foram validados; detalhes e limites abaixo.
Este documento não declara a FT-104 concluída.

## Composição com processos

`executeVerifiedProcess(initialState, run, readCandidate, verify): Promise<Result>` está em `verified-process.js`.
Importe-o por `require`; injete `run` como closure de `runLongProcess(command, args, options)` ou `resumeLongProcess(command, args, options)`, exportados por `../../core/runtime/scripts/long-running.js`.
O chamador deve autorizar comando, argumentos, diretório e efeitos. O adaptador não cria permissões nem gerencia processos por conta própria.

A entrada JSON e os callbacks são validados antes de chamar o runner uma única vez. O adaptador aguarda sua Promise.
`completed` com código zero permite ler o candidato e exigir `verify === true`; `reused` também exige nova verificação.
Saída inteira não zero com `failed` resulta em `exhausted`, preservando o snapshot inicial.
Processo ativo, timeout, cancelamento, erro desconhecido ou evidência inválida resultam em `blocked`.
Não há execução automática de outra alternativa. Clones preservam JSON, não desfazem efeitos externos; timeout/cancelamento não comprovam que o processo físico terminou.
O classificador `process-outcome` retorna somente `verify`, `failed` ou `blocked`, sem expor mensagens brutas.
O núcleo gerenciado permanece intacto.

Para os três módulos, repetir a geração TypeScript acima com fontes `resilient-operation.ts`, `process-outcome.ts` e `verified-process.ts`, sempre CommonJS.
Suítes permanentes: `scripts/test_resilient_operation.ts`, `scripts/test_process_outcome.ts`, `scripts/test_verified_process.ts` e `scripts/test_verified_process_integration.ts`.
O mesmo comando de checagem de tipos e loader acima pode receber cada caminho de teste; o de integração usa builds JS existentes e dois processos Node curtos.
A integração cria fixture exclusiva sob `tmp`, limpa somente seus arquivos após sucesso e informa o caminho para diagnóstico em falha.

Baseline comprovado em 2026-10-09: Node 24.19.0; checagem estrita e quatro suítes exit0 no job `88ae962c-9fc0-41a5-9bf0-dcc6797c6604`.
A integração real também passou em Node 22.21.0 (commit `090649d1f5`): sucesso, saída3 e reuse com candidato invalidado.
Regressão de alternativas entre múltiplos processos e gates de governança/rastreabilidade permanecem pendentes; esta evidência não conclui as FTs.
