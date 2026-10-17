declare function require(id: string): any;
declare const process: { execPath: string; cwd(): string; exitCode?: number };
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { runLongProcess, resumeLongProcess } = require(path.resolve('.ia.rules/core/runtime/scripts/long-running.js'));
const { executeVerifiedProcess }: typeof import('../.ia.rules/local/runtime/verified-process') =
  require(path.resolve('.ia.rules/local/runtime/verified-process.js'));

// FT-105: primeira tentativa real falha; composição posterior em unidade separada.
(async () => {
  const root = process.cwd();
  const initial = { value: 0 };
  let reads = 0, runs = 0;
  const failed = await executeVerifiedProcess(initial,
    () => { runs++; return runLongProcess(process.execPath, ['-e', 'process.exit(3)'], { cwd: root, timeoutMs: 10000 }); },
    () => { reads++; return 1; }, () => true);
  assert.equal(failed.status, 'exhausted');
  assert.deepEqual(failed.state, initial);
  assert.equal(reads, 0);
  assert.equal(runs, 1);
  assert.deepEqual(initial, { value: 0 });
  assert.equal(failed.attempts.length, 1);
  assert.equal(failed.attempts[0].outcome, 'failed');
  assert.equal(failed.attempts[0].errorCode, 'EXECUTE_RESILIENT_FAILED');
  console.log('PROCESS_FIRST_FAILURE_OK');
})().catch(error => { console.error(error); process.exitCode = 1; });
export {};
