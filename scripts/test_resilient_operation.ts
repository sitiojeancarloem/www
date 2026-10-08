// FT-104: testes dos tres estados terminais da operacao resiliente.
// Assinaturas CommonJS do carregador: o projeto nao instala @types/node.
declare function require(id: string): any;
declare const __dirname: string;
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
import ts = require('typescript');
import type { JsonValue, Strategy } from '../.ia.rules/local/runtime/resilient-operation';
const source = path.resolve(__dirname, '../.ia.rules/local/runtime/resilient-operation.ts');
const api = {} as typeof import('../.ia.rules/local/runtime/resilient-operation');
const compiled = ts.transpileModule(fs.readFileSync(source, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
new Function('exports', compiled)(api);

for (const expected of ['completed', 'exhausted', 'blocked'] as const) {
  const initial: JsonValue = { value: 1 };
  let executions = 0;
  let verifications = 0;
  const strategies: Strategy[] = [{
    id: expected, eligible: true, blocked: expected === 'blocked',
    execute(state) {
      executions++;
      assert.deepEqual(state, initial);
      assert.notStrictEqual(state, initial);
      return { value: 2 };
    },
    verify(candidate) {
      verifications++;
      assert.deepEqual(candidate, { value: 2 });
      return expected === 'completed';
    }
  }];
  const result = api.executeResilientOperation(initial, strategies);
  assert.equal(result.status, expected);
  assert.deepEqual(result.state, { value: expected === 'completed' ? 2 : 1 });
  assert.deepEqual(initial, { value: 1 });
  assert.notStrictEqual(result.state, initial);
  assert.equal(executions, expected === 'blocked' ? 0 : 1);
  assert.equal(verifications, expected === 'blocked' ? 0 : 1);
  assert.equal(result.attempts.length, 1);
  assert.equal(result.attempts[0].outcome, expected === 'exhausted' ? 'failed' : expected);
}
console.log('RESILIENT_OPERATION_TERMINAL_TESTS_OK');
