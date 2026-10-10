const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../../..'),file=path.join(root,'_drafts/carta-aberta-hierarquia-romanda-na-igreja');
const {applyEditorialEdits}=require(path.join(root,'.ia.rules/core/runtime/scripts/editorial-authoring.js'));
const original=fs.readFileSync(file,'utf8'),edits=[],headerEnd=original.indexOf('-->')+3;
function exact(expected,replacement,kind='mechanical'){const start=original.indexOf(expected,headerEnd);if(start<0||original.indexOf(expected,start+1)>=0)throw Error('Não unívoco: '+expected);edits.push({start,end:start+expected.length,expected,replacement,kind,reason:'FT-112 M10: destaque seletivo ou reparo tipográfico'});}
for(const [from,to] of JSON.parse(fs.readFileSync(path.join(__dirname,'enfases-M10.json'),'utf8')))exact('**'+from+'**',to);
exact('um franzir de teste','um franzir de testa');
exact('**GRAÇA sois <u>salvos<u>**','**GRAÇA** sois **salvos**');
exact('(_emboram provavelmente os santos serão chamados de fanáticos_)','(_embora provavelmente os santos sejam chamados de fanáticos_)');
exact('auto destruição humana','autodestruição humana');
exact('Jesus está na iminência de vir a muito tempo','JESUS está na iminência de vir há muito tempo');
exact('termo comum no militar','termo empregado na estratégia militar');
exact('**quem permaneceu em CRISTO? Quem permaneceu fiel à VERDADE?**','quem **permaneceu em CRISTO**? Quem permaneceu **fiel à VERDADE**?');
// A entrada anterior já pertence ao mapa; remover a duplicata de intervalo.
const unique=edits.filter((e,i)=>edits.findIndex(x=>x.start===e.start)===i);
const result=applyEditorialEdits(original,unique);let output=result.markedOutput;
// Marcadores permanecem íntegros; separar de blocos e de definições de notas.
output=output.replace(/([^\n])?(<!-- AI-PROCESSED:(?:START|END) -->)([^\n])?/g,(_,before,tag,after)=>(before?before+'\n\n':'')+tag+(after?'\n\n'+after:''));
const key='Não basta proteger o nome, o cargo e o patrimônio enquanto se combate a mensagem que chama ao arrependimento:';
if(!output.includes(key))throw Error('Transição não encontrada');
const at=output.indexOf(key)+key.length;
const added=applyEditorialEdits(output,[{start:at,end:at,expected:'',replacement:' A fidelidade pede a entrega positiva da vida: **“nem todas edificam”**.[^1co1023]',kind:'editorial',reason:'FT-112 M10: reativar premissa além de não pecar'}]);
output=added.markedOutput;
if(output.slice(0,headerEnd)!==original.slice(0,headerEnd))throw Error('Cabeçalho alterado');
fs.writeFileSync(file,output);fs.writeFileSync(path.join(__dirname,'aplicacao-M10.json'),JSON.stringify({regions:result.regions,contextual:added.regions,headerPreserved:true,sha256:crypto.createHash('sha256').update(output).digest('hex')},null,2));console.log(unique.length+' intervenções tipográficas e uma retomada contextual.');
