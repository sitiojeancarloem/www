const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../../../../..'),at=n=>path.join(__dirname,n),report=at('validacao-preservacao-M38.json');
if(JSON.parse(fs.readFileSync(report,'utf8')).status!=='pending')throw Error('Relatório não pending; não repetir');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const relative='_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md';
const git=ref=>cp.execFileSync('C:/Program Files/Git/cmd/git.exe',['show',ref],{cwd:root,maxBuffer:2*1024*1024});
const result={status:'running',units:[],limit:'Reconstrução contábil não substitui julgamento de adequação editorial, literalidade tipográfica ou interpretação teológica.'};
try{
 const {applyEditorialEdits}=require(path.join(root,'.ia.rules/core/runtime/scripts/editorial-authoring.js'));
 let text=git('7d8ed85b3a^:'+relative).toString('utf8');
 result.base_sha256=hash(text);
 if(result.base_sha256!=='235e1a8a12939b4ea3833b14b95c1c2df841f4968c9543381d66895de55c61c1')throw Error('Base divergente');
 const names=['14-ester-metadados','15-caminho','16-abertura','17-abertura','18-autoexame','19-julgamento','21-acabe','24-elias','26-muitos-poucos','28-carteiro','31-parentese','32-notas','34-caption','35-enfase'];
 for(const name of names){
  const d=JSON.parse(fs.readFileSync(at('aplicacao-M'+name+'.json'),'utf8'));
  if(hash(text)!==d.before)throw Error('Cadeia divergente antes M'+name);
  const edits=d.regions.map(r=>{const start=r.before?text.indexOf(r.before):text.length;if(start<0||(r.before&&text.indexOf(r.before,start+1)>=0))throw Error('Âncora divergente M'+name);return {start,end:start+r.before.length,expected:r.before,replacement:r.after,kind:r.kind||'editorial',reason:d.scope||'Recibo M'+name};});
  const out=applyEditorialEdits(text,edits);
  const modes=[['output',out.output],['markedOutput',out.markedOutput]].filter(([_,s])=>hash(s)===d.after);
  if(!modes.length)throw Error('Reconstrução não reproduz after M'+name);
  text=modes[0][1];result.units.push({name,before:d.before,after:d.after,mode:modes[0][0],regions:edits.length});
 }
 const actual=fs.readFileSync(path.join(root,relative));
 result.current_sha256=hash(actual);result.reconstructed_sha256=hash(text);
 if(!actual.equals(Buffer.from(text,'utf8')))throw Error('Artigo contém diferença fora da reconstrução');
 const old=git('ff9f255678:_drafts/carta-aberta-hierarquia-romanda-na-igreja').toString('utf8');
 const extract=s=>{s=s.replace(/<!--[^]*?-->/g,'').replace(/\*\*/g,'');const matches=[...s.matchAll(/_[“"]([^”"\n]+?)[”"]_[.;,:]?[ \t]*\[\^stvitoria\](?!:)/g)];if(matches.length!==1)throw Error('Citação ST não unívoca');return matches[0][1];};
 result.st_unchanged_since_ff9f255678=extract(old)===extract(text);
 if(!result.st_unchanged_since_ff9f255678)throw Error('ST difere da versão com conferência histórica');
 result.status='passed';
}catch(e){result.status='failed';result.error=e.message;process.exitCode=1;}
fs.writeFileSync(report,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,units:result.units.map(x=>x.name)}));
