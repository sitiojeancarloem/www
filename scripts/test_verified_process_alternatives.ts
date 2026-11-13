declare function require(id: string): any;
declare const process: { execPath: string; cwd(): string; exitCode?: number };
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { runLongProcess } = require(path.resolve('.ia.rules/core/runtime/scripts/long-running.js'));
const { executeVerifiedProcess }: typeof import('../.ia.rules/local/runtime/verified-process') =
  require(path.resolve('.ia.rules/local/runtime/verified-process.js'));

// FT-105: composição explícita de duas estratégias autorizadas, sem retry automático.
(async () => {
  const root = fs.realpathSync(process.cwd());
  const initial = { value: 0 };
  let reads = 0, runs = 0;
  const order: string[] = [];
  const failed = await executeVerifiedProcess(initial,
    () => { runs++; order.push('first'); return runLongProcess(process.execPath, ['-e', 'process.exit(3)'], { cwd: root, timeoutMs: 10000 }); },
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
  if (failed.status !== 'exhausted') throw new Error('ALTERNATIVE_NOT_AUTHORIZED');
  const tempRoot = path.join(root, 'tmp');
  fs.mkdirSync(tempRoot, { recursive: true });
  assert.ok(fs.realpathSync(tempRoot).startsWith(root + path.sep));
  const fixture = fs.mkdtempSync(path.join(tempRoot, 'verified-process-'));
  const statePath = path.join(fixture, 'state.json');
  const candidatePath = path.join(fixture, 'candidate.json');
  console.log('INTEGRATION_FIXTURE', fixture);
  const args = ['-e', "require('node:fs').writeFileSync(process.argv[1], '1')", candidatePath];
  const options = { cwd: root, timeoutMs: 10000, statePath };
  const read = () => { reads++; return JSON.parse(fs.readFileSync(candidatePath, 'utf8')); };
  const success = await executeVerifiedProcess(initial,
    () => { runs++; order.push('second'); return runLongProcess(process.execPath, args, options); }, read, value => value === 1);
  assert.equal(success.status, 'completed');
  assert.equal(success.state, 1);
  assert.equal(reads, 1);
  assert.deepEqual(initial, { value: 0 });
  assert.equal(JSON.parse(fs.readFileSync(statePath, 'utf8')).status, 'completed');

  assert.equal(runs, 2);
  assert.deepEqual(order, ['first', 'second']);
  assert.equal(failed.attempts[0].errorCode, 'EXECUTE_RESILIENT_FAILED');
  assert.deepEqual(failed.state, initial);
  assert.equal(path.dirname(fixture), fs.realpathSync(tempRoot));
  fs.unlinkSync(statePath);
  fs.unlinkSync(candidatePath);
  fs.rmdirSync(fixture);
  console.log('PROCESS_ALTERNATIVE_SUCCESS_OK');
  // Duas alternativas previamente autorizadas, ambas falhas; limite fechado.
  {
    let exhaustedRuns = 0, exhaustedReads = 0;
    const results: Awaited<ReturnType<typeof executeVerifiedProcess>>[] = [];
    const exitCodes = [3, 4] as const;
    for (const exitCode of exitCodes) {
      if (results.length > 0 && results[results.length - 1].status !== 'exhausted') break;
      const result = await executeVerifiedProcess(initial,
        () => { exhaustedRuns++; return runLongProcess(process.execPath,
          ['-e', 'process.exit(' + exitCode + ')'], { cwd: root, timeoutMs: 10000 }); },
        () => { exhaustedReads++; return 99; }, () => true);
      results.push(result);
    }
    assert.equal(exhaustedRuns, 2);
    assert.equal(exhaustedReads, 0);
    assert.equal(results.length, 2);
    for (const result of results) {
      assert.equal(result.status, 'exhausted');
      assert.deepEqual(result.state, { value: 0 });
      assert.equal(result.attempts.length, 1);
      assert.equal(result.attempts[0].outcome, 'failed');
      assert.equal(result.attempts[0].errorCode, 'EXECUTE_RESILIENT_FAILED');
    }
    assert.deepEqual(initial, { value: 0 });
    console.log('PROCESS_ALTERNATIVES_EXHAUSTED_OK');
  }



  // Timeout é bloqueio: não autoriza iniciar outra estratégia.
  {
    let blockedRuns = 0, blockedReads = 0, forbiddenRuns = 0;
    let timedOutEvidence = false;
    const blocked = await executeVerifiedProcess(initial,
      async () => {
        blockedRuns++;
        try {
          return await runLongProcess(process.execPath,
            ['-e', 'setTimeout(() => {}, 2000)'], { cwd: root, timeoutMs: 100 });
        } catch (error) {
          timedOutEvidence = (error as { result?: { status?: string } }).result?.status === 'timed_out';
          throw error;
        }
      },
      () => { blockedReads++; return 99; }, () => true);
    if (blocked.status === 'exhausted') {
      await executeVerifiedProcess(initial,
        () => { forbiddenRuns++; return runLongProcess(process.execPath,
          ['-e', 'process.exit(0)'], { cwd: root, timeoutMs: 10000 }); },
        () => 1, value => value === 1);
    }
    assert.equal(timedOutEvidence, true);
    assert.equal(blocked.status, 'blocked');
    assert.equal(blockedRuns, 1);
    assert.equal(blockedReads, 0);
    assert.equal(forbiddenRuns, 0);
    assert.equal(blocked.attempts.length, 1);
    assert.equal(blocked.attempts[0].outcome, 'blocked');
    assert.deepEqual(blocked.state, { value: 0 });
    assert.deepEqual(initial, { value: 0 });
    console.log('PROCESS_TIMEOUT_BLOCKS_ALTERNATIVE_OK');
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
export {};
