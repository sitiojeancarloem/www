// Staging restrito à seção FT112; outros deltas herdados permanecem fora do índice.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../../..'),git='C:/Program Files/Git/cmd/git.exe';
const run=(args,input)=>cp.execFileSync(git,args,{cwd:root,input,maxBuffer:2*1024*1024});
if(run(['diff','--cached','--name-only']).toString('utf8').trim())throw Error('Índice já contém alterações; não misturar');
const out=path.join(__dirname,'estado-final-index-M42.json');if(fs.existsSync(out))throw Error('Staging já registrado; conferir antes de repetir');
function range(s){const matches=[...s.matchAll(/^FT-112\|/gm)];if(matches.length!==1)throw Error('FT112 não unívoca');const start=matches[0].index,n=s.slice(start+1).search(/^FT-\d+\|/m);return[start,n<0?s.length:start+1+n];}
const rows=[];
for(const file of ['.ia.rules/state/continue.ia','.ia.rules/continue.ia']){
 const base=run(['show','HEAD:'+file]).toString('utf8'),current=fs.readFileSync(path.join(root,file),'utf8');
 const [start,end]=range(base),[a,b]=range(current),nl=base.includes('\r\n')?'\r\n':'\n';
 const section=current.slice(a,b).replace(/\r\n/g,'\n').replace(/\n/g,nl);
 if(!section.includes('|status=concluida')||!section.includes('549c46c77e77ad40'))throw Error('Estado final divergente');
 const staged=base.slice(0,start)+section+base.slice(end);
 const blob=run(['hash-object','-w','--stdin'],Buffer.from(staged,'utf8')).toString('utf8').trim();
 run(['update-index','--cacheinfo','100644',blob,file]);
 rows.push({file,blob,only_section:'FT-112',working_file_sha256:crypto.createHash('sha256').update(current).digest('hex'),staged_file_sha256:crypto.createHash('sha256').update(staged).digest('hex')});
}
fs.writeFileSync(out,JSON.stringify({status:'passed',staged:rows,limit:'Working tree continua com alterações herdadas fora de FT112; não declarar árvore limpa.'},null,2)+'\n');console.log(JSON.stringify({status:'passed',staged:rows.map(x=>x.file)}));
