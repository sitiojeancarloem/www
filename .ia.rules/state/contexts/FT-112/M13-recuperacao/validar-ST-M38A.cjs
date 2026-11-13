const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const at=n=>path.join(__dirname,n),root=path.resolve(__dirname,'../../../../..'),report=at('validacao-ST-M38A.json');
if(JSON.parse(fs.readFileSync(report,'utf8')).status!=='pending')throw Error('Não repetir relatório concluído');
const result={status:'running',preservation_evidence:'validacao-preservacao-M38.json',historical_source_evidence:'../relatorio.md',historical_ref:'17f6c2c8c8',limit:'Identidade textual da citação ST e reaproveitamento de reconstrução anterior; não nova consulta pública nem aceite editorial integral.'};
try{
 const prior=JSON.parse(fs.readFileSync(at('validacao-preservacao-M38.json'),'utf8'));
 if(prior.status!=='failed'||prior.error!=='Citação ST não unívoca'||prior.units.length!==14||prior.current_sha256!==prior.reconstructed_sha256)throw Error('Evidência parcial M38 divergente');
 const current=fs.readFileSync(path.join(root,'_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md'));
 const hash=crypto.createHash('sha256').update(current).digest('hex');
 if(hash!==prior.current_sha256)throw Error('Artigo mudou após M38');
 const old=cp.execFileSync('C:/Program Files/Git/cmd/git.exe',['show','17f6c2c8c8:_drafts/carta-aberta-hierarquia-romanda-na-igreja'],{cwd:root,maxBuffer:2*1024*1024}).toString('utf8');
 const extract=s=>{s=s.replace(/<!--[^]*?-->/g,'').replace(/\*\*/g,'');const matches=[...s.matchAll(/_[“"]([^”"\n]+?)[”"]_[.;,:]?[ \t]*\[\^stvitoria\](?!:)/g)];if(matches.length!==1)throw Error('Citação ST não unívoca na baseline corrigida/atual');return matches[0][1];};
 result.st_identity=extract(old)===extract(current.toString('utf8'));
 if(!result.st_identity)throw Error('Citação ST modificada');
 result.sha256_draft=hash;result.preservation_units_verified=prior.units.length;result.status='passed';
}catch(e){result.status='failed';result.error=e.message;process.exitCode=1;}
fs.writeFileSync(report,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
