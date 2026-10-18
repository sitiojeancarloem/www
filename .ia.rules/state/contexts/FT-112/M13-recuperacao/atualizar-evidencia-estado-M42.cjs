// Complemento declarativo, sem manutenção do núcleo: arquivo histórico M12 permanece preservado.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../../..'),file=path.join(root,'.ia.rules/state/continue.ia'),out=path.join(__dirname,'reconciliacao-evidencia-final-M42.json');
if(fs.existsSync(out))throw Error('Ajuste já registrado; não repetir');
let raw=fs.readFileSync(file,'utf8');const nl=raw.includes('\r\n')?'\r\n':'\n';
const starts=[...raw.matchAll(/^FT-112\|/gm)];if(starts.length!==1)throw Error('FT112 não unívoca');
const start=starts[0].index,next=raw.slice(start+1).search(/^FT-\d+\|/m),end=next<0?raw.length:start+1+next;
let lines=raw.slice(start,end).split(/\r?\n/);
if(!lines[0].includes('|status=concluida'))throw Error('Conclusão oficial ausente');
const fields={resultado:'Revisão integral e ampliações autorais executadas no draft .md atual, com firmeza preservada e correções factuais documentadas. Entrega 26d5a815cd; relatório M13-recuperacao/fechamento-M42.md. SHA final 549c46c77e77ad40e6817a4fd34f21a83854f9441cad957094c5b9d0352290c4.',verificacoes:'M40 render: 44 blocos, 200 chamadas, 160 notas, tabela acessível, zero avisos/destinos quebrados. M41: 25 blocos bíblicos numerados. M37: 44 blocos e 60 inline lexicais; M38/M38A preservação e ST. M42: YAML, imagem, corpo byte a byte preservado e diff_check exit0.',pendencias:'Sem pendência de execução editorial. Leitura/aceite autoral continuam humanos. Sem publicação/push; limites em fechamento-M42.md.'};
for(const [key,value]of Object.entries(fields)){if(lines.filter(s=>s.startsWith(key+'=')).length!==1)throw Error('Campo não unívoco: '+key);lines=lines.map(s=>s.startsWith(key+'=')?key+'='+value:s);}
const context='contexto=.ia.rules/state/contexts/FT-112/M13-recuperacao/checkpoint.md';
if(lines.some(s=>s.startsWith('contexto=')))lines=lines.map(s=>s.startsWith('contexto=')?context:s);else lines.splice(1,0,context);
const after=raw.slice(0,start)+lines.join(nl)+raw.slice(end);
fs.writeFileSync(file,after,'utf8');
const t=require(path.join(root,'.ia.rules/core/runtime/scripts/todo-intake.js'));
const sync=t.syncCanonicalProjections(root);
if(fs.readFileSync(path.join(root,'.ia.rules/continue.ia'),'utf8')!==after)throw Error('Projeção divergente');
const result={status:'passed',reason:'Ponto conclude preservou resultado/verificacoes do arquivo histórico M12 já existente; atualizar somente evidências declarativas da FT112 e sincronizar pelo ponto oficial.',fields:Object.keys(fields),context_restored:true,sync,canonical_sha256:crypto.createHash('sha256').update(after).digest('hex'),historical_M12_preserved:true};
fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
