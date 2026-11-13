declare function require(id: string): any;
const fs=require('node:fs'),ts=require('typescript'),assert=require('node:assert/strict');
const api={} as typeof import('../.ia.rules/local/runtime/process-outcome');
new Function('exports',ts.transpileModule(fs.readFileSync('.ia.rules/local/runtime/process-outcome.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(api);
const classify=api.classifyProcessOutcome;
assert.equal(typeof classify,'function');
for(const reused of [false,true])assert.equal(classify({status:'completed',exitCode:0,reused}),'verify');
for(const code of [1,-1,255])assert.equal(classify({status:'failed',exitCode:code}),'failed');
for(const value of [null,undefined,[],{},'completed',{status:'running',exitCode:0},{status:'timed_out',exitCode:1},{status:'cancelled',exitCode:1},{status:'unknown',exitCode:0},{status:'completed',exitCode:1},{status:'completed',exitCode:null},{status:'failed',exitCode:0},{status:'failed',exitCode:null},{status:'failed',exitCode:NaN},{status:'failed',exitCode:Infinity},{status:'failed',exitCode:1.5},{status:'failed',exitCode:'1'}])assert.equal(classify(value),'blocked');
const input=Object.freeze({status:'failed',exitCode:2,error:'PRIVATE_ERROR'});
assert.equal(classify(input),'failed');
console.log('PROCESS_OUTCOME_MATRIX_OK');

export {};
