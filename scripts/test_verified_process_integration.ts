declare function require(id: string): any;
declare const process: { execPath: string; cwd(): string; exitCode?: number };
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { runLongProcess, resumeLongProcess } = require(path.resolve('.ia.rules/core/runtime/scripts/long-running.js'));
const { executeVerifiedProcess }: typeof import('../.ia.rules/local/runtime/verified-process') =
  require(path.resolve('.ia.rules/local/runtime/verified-process.js'));

(async () => {
  const root = fs.realpathSync(process.cwd());
  const tempRoot = path.join(root, 'tmp');
  fs.mkdirSync(tempRoot, { recursive: true });
  assert.ok(fs.realpathSync(tempRoot).startsWith(root + path.sep));
  const fixture = fs.mkdtempSync(path.join(tempRoot, 'verified-process-'));
  const statePath = path.join(fixture, 'state.json');
  const candidatePath = path.join(fixture, 'candidate.json');
  console.log('INTEGRATION_FIXTURE', fixture);
  const args = ['-e', "require('node:fs').writeFileSync(process.argv[1], '1')", candidatePath];
  const options = { cwd: root, timeoutMs: 10000, statePath };
  let reads = 0;
  const read = () => { reads++; return JSON.parse(fs.readFileSync(candidatePath, 'utf8')); };
  const initial = { value: 0 };
  const success = await executeVerifiedProcess(initial,
    () => runLongProcess(process.execPath, args, options), read, value => value === 1);
  assert.equal(success.status, 'completed');
  assert.equal(success.state, 1);
  assert.equal(reads, 1);
  assert.deepEqual(initial, { value: 0 });
  assert.equal(JSON.parse(fs.readFileSync(statePath, 'utf8')).status, 'completed');

  // Mudar candidato torna inválida a pós-condição, mesmo com processo previamente concluído.
  fs.writeFileSync(candidatePath, '2');
  let reused = false;
  const stale = await executeVerifiedProcess(initial, async () => {
    const result = await resumeLongProcess(process.execPath, args, options);
    reused = result.reused === true;
    return result;
  }, read, value => value === 1);
  assert.equal(reused, true);
  assert.equal(reads, 2);
  assert.equal(stale.status, 'exhausted');
  assert.deepEqual(stale.state, initial);
  assert.equal(fs.readFileSync(candidatePath, 'utf8'), '2'); // Sem reexecutar o comando.

  const failed = await executeVerifiedProcess(initial,
    () => runLongProcess(process.execPath, ['-e', 'process.exit(3)'], { cwd: root, timeoutMs: 10000 }),
    () => { reads++; return 1; }, () => true);
  assert.equal(failed.status, 'exhausted');
  assert.deepEqual(failed.state, initial);
  assert.equal(reads, 2);
  // Remover somente os dois arquivos conhecidos e diretório vazio desta fixture.
  assert.equal(path.dirname(fixture), fs.realpathSync(tempRoot));
  fs.unlinkSync(statePath);
  fs.unlinkSync(candidatePath);
  fs.rmdirSync(fixture);
  console.log('LONG_RUNNING_INTEGRATION_OK');
})().catch(error => { console.error(error); process.exitCode = 1; });
export {};
