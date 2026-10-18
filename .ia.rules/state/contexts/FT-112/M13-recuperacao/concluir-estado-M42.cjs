// Encerramento declarativo pelo ponto oficial; nenhum efeito no artigo ou no índice Git.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../../..'),canon=path.join(root,'.ia.rules/state/continue.ia'),report=path.join(__dirname,'reconciliacao-final-M42.json');
if(fs.existsSync(report))throw Error('Recibo de encerramento existente; reconciliar sem repetir');
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const sections=s=>{s=s.replace(/\r\n/g,'\n');const matches=[...s.matchAll(/^FT-\d+\|/gm)];return new Map(matches.map((m,i)=>[m[0].slice(0,-1),s.slice(m.index,i+1<matches.length?matches[i+1].index:s.length).trim()]));};
const before=fs.readFileSync(canon,'utf8'),blocks=sections(before);
if(!blocks.get('FT-112')?.includes('|status=em_andamento'))throw Error('Pré-condição FT-112 divergente');
const result={status:'failed',before_sha256:digest(before)};
try{
 const t=require(path.join(root,'.ia.rules/core/runtime/scripts/todo-intake.js'));
 result.official=t.concludeFeatureState(root,['FT-112'],{authorization:'human',developerValidated:false,evidence:{'FT-112':{result:'Revisão integral e ampliações autorais executadas no draft .md atual, preservando firmeza e registrando correções factuais. Entrega 26d5a815cd; relatório M13-recuperacao/fechamento-M42.md. SHA final 549c46c77e77ad40e6817a4fd34f21a83854f9441cad957094c5b9d0352290c4.',verification:'M40 render: 44 blocos, 200 chamadas, 160 notas, tabela acessível e zero avisos/destinos quebrados. M41: 25 blocos bíblicos numerados. M37: 44 blocos e 60 inline lexicais; M38/M38A preservação e ST. M42: YAML/imagem/corpo inalterado, diff_check exit0.',pending:'Sem pendência de execução editorial. Leitura e aceite autoral permanecem humanos; sem publicação/push. Limites em fechamento-M42.md.'}}});
 const after=fs.readFileSync(canon,'utf8'),afterBlocks=sections(after);
 result.unrelated_sections_changed=[...blocks].filter(([id,s])=>id!=='FT-112'&&afterBlocks.get(id)!==s).map(([id])=>id);
 if(result.unrelated_sections_changed.length)throw Error('Seções de outras FTs alteradas pelo encerramento');
 if(!afterBlocks.get('FT-112')?.includes('|status=concluida'))throw Error('FT-112 não concluída');
 const projection=fs.readFileSync(path.join(root,'.ia.rules/continue.ia'),'utf8');
 if(projection!==after)throw Error('Projeção não sincronizada');
 result.after_sha256=digest(after);result.projections_equal=true;result.status='passed';
}catch(e){result.error=e.message;process.exitCode=1;}
fs.writeFileSync(report,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
