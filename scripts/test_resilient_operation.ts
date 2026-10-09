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
// Teste de isolamento e fallback: primeira estratégia falha, segunda é elegível e completa.
{
  const initial: JsonValue = { value: 1 };
  let secondExecuteReceived: JsonValue | null = null;
  let secondVerifyReceived: JsonValue | null = null;
  const strategies: Strategy[] = [{
    id: 'first', eligible: true, blocked: false,
    execute(state) {
      (state as { value: number }).value = 99;
      throw new Error('segredo-teste');
    },
    verify() {
      return false;
    }
  }, {
    id: 'second', eligible: true, blocked: false,
    execute(state) {
      secondExecuteReceived = JSON.parse(JSON.stringify(state)) as JsonValue;
      return { value: 2 };
    },
    verify(candidate) {
      secondVerifyReceived = JSON.parse(JSON.stringify(candidate)) as JsonValue;
      (candidate as { value: number }).value = 77;
      return true;
    }
  }];
  const result = api.executeResilientOperation(initial, strategies);
  assert.equal(result.status, 'completed');
  assert.deepEqual(result.state, { value: 2 });
  assert.equal(result.attempts.length, 2);
  assert.equal(result.attempts[0].outcome, 'failed');
  assert.equal(result.attempts[1].outcome, 'completed');
  assert.deepEqual(initial, { value: 1 });
  assert.ok(secondExecuteReceived);
  assert.deepEqual(secondExecuteReceived, { value: 1 });
  assert.ok(secondVerifyReceived);
  assert.deepEqual(secondVerifyReceived, { value: 2 });
  assert.ok(!JSON.stringify(result).includes('segredo-teste'));
  console.log('ISOLATION_TEST_OK');
}

console.log('RESILIENT_OPERATION_TERMINAL_TESTS_OK');

// FT-104: isolamento dos argumentos, snapshots independentes.

{
  const child = { value: 1 };
  const original = { left: child, right: child };
  const cloned = api.cloneJsonState(original) as { left: JsonValue; right: JsonValue };
  assert.deepEqual(cloned, original);
  assert.notStrictEqual(cloned.left, child);
  assert.notStrictEqual(cloned.right, child);
  assert.notStrictEqual(cloned.left, cloned.right);
  const invalid = { name: 'TypeError', code: 'INVALID_JSON_STATE' };
  const cycle: { self?: unknown } = {};
  cycle.self = cycle;
  assert.throws(() => api.cloneJsonState(cycle), invalid);
  let getterCalls = 0;
  const withGetter = Object.defineProperty({}, 'value', {
    enumerable: true, get() { getterCalls++; return 1; }
  });
  assert.throws(() => api.cloneJsonState(withGetter), invalid);
  assert.equal(getterCalls, 0);
  assert.throws(() => api.cloneJsonState(new Array(2)), invalid);
}
console.log('JSON_CLONE_TESTS_OK');

{
  const calls: string[] = [];
  const strategies: Strategy[] = ['skip', 'reject', 'success', 'unused'].map((id, index) => ({
    id,
    eligible: id !== 'skip',
    blocked: id === 'skip',
    execute(_state: JsonValue): JsonValue {
      calls.push(id + '.execute');
      return index;
    },
    verify(_candidate: JsonValue): boolean {
      calls.push(id + '.verify');
      return id !== 'reject';
    }
  }));
  const result = api.executeResilientOperation(0, strategies);
  assert.equal(result.status, 'completed');
  assert.equal(result.state, 2);
  assert.deepEqual(calls, ['reject.execute', 'reject.verify', 'success.execute', 'success.verify']);
  assert.deepEqual(result.attempts.map(attempt => attempt.id), ['skip', 'reject', 'success']);
  assert.deepEqual(result.attempts.map(attempt => attempt.order), [1, 2, 3]);
  assert.deepEqual(result.attempts.map(attempt => attempt.outcome), ['skipped', 'failed', 'completed']);
}
console.log('FINITE_ORDER_TEST_OK');
