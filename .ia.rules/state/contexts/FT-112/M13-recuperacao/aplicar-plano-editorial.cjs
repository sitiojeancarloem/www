// Adaptador de checkpoint da FT-112; toda transformação usa o mecanismo editorial oficial.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const name=process.argv[2];if(!/^plano-M\d+-[a-z0-9-]+\.json$/.test(name||''))throw Error('Plano não autorizado.');
const root=path.resolve(__dirname,'../../../../..'),{applyEditorialEdits}=require(path.join(root,'.ia.rules/core/runtime/scripts/editorial-authoring.js'));
const plan=JSON.parse(fs.readFileSync(path.join(__dirname,name),'utf8'));
if(!/^aplicacao-M\d+-[a-z0-9-]+\.json$/.test(plan.receipt||''))throw Error('Recibo não autorizado.');
const receipt=path.join(__dirname,plan.receipt);if(fs.existsSync(receipt))throw Error('Recibo existente; não reaplicar.');
for(const f of plan.evidence||[]){if(!/^[a-zA-Z0-9_.-]+\.json$/.test(f))throw Error('Path de evidência inválido.');if(JSON.parse(fs.readFileSync(path.join(__dirname,f),'utf8')).status!=='captured')throw Error('Fonte incompleta.');}
const file=path.join(root,'_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md'),original=fs.readFileSync(file,'utf8'),hash=s=>crypto.createHash('sha256').update(s).digest('hex');
if(hash(original)!==plan.before)throw Error('Base autoral mudou.');
const edits=plan.edits.map(e=>{const start=e.before?original.indexOf(e.before):original.length;if(start<0||(e.before&&original.indexOf(e.before,start+1)>=0))throw Error('Âncora ausente/ambígua.');if(plan.use_existing_marks&&e.kind!=='mechanical'&&original.lastIndexOf('<!-- AI-PROCESSED:START -->',start)<original.lastIndexOf('<!-- AI-PROCESSED:END -->',start))throw Error('Marca existente não cobre região.');return{start,end:start+e.before.length,expected:e.before,replacement:e.after,kind:e.kind,reason:plan.scope};});
const result=applyEditorialEdits(original,edits),out=plan.use_existing_marks?result.output:result.markedOutput;
const ids=[...out.matchAll(/^\[\^([^\]]+)\]:/gm)].map(m=>m[1]);if(ids.length!==new Set(ids).size)throw Error('Definições duplicadas.');
fs.writeFileSync(file,out);fs.writeFileSync(receipt,JSON.stringify({schema:'ft112-editorial-plan-receipt/v1',before:hash(original),after:hash(out),regions:plan.edits,scope:plan.scope,mechanism:'applyEditorialEdits',marking:plan.use_existing_marks?'marca existente verificada':'markedOutput oficial',evidence:plan.evidence,unique_definitions:true},null,2)+'\n');
console.log(JSON.stringify({changed:true,edits:edits.length,after:hash(out),receipt:plan.receipt}));
