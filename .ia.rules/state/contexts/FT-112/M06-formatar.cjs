const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../../..'),file=path.join(root,'_drafts/carta-aberta-hierarquia-romanda-na-igreja');
const {applyEditorialEdits}=require(path.join(root,'.ia.rules/core/runtime/scripts/editorial-authoring.js'));
const original=fs.readFileSync(file,'utf8'),edits=[],headerEnd=original.indexOf('-->')+3;
function exact(expected,replacement){const start=original.indexOf(expected,headerEnd);if(start<0||original.indexOf(expected,start+1)>=0)throw Error('Não unívoco: '+expected);edits.push({start,end:start+expected.length,expected,replacement,kind:'mechanical',reason:'FT-112 M06: referência, itálico ou continuidade de parágrafo; sem mudança argumentativa'});}
exact('> Quanto, porém, aos **covardes**','> ⁸ Quanto, porém, aos **covardes**');
for(const [quote,note] of [
 ['Caímos repetidamente em pecado, e pensamos que isso deve ser sempre assim.','majvitoria'],
 ['mediante o poder que nos deu, é-nos possível resistir ao mundo, à carne e ao diabo','majvitoria'],
 ['Não há desculpas para pecar. Uma santa disposição, uma vida cristã, são acessíveis a todo filho de Deus, arrependido e crente.','dtnvitoria'],
 ['Cristo deu Seu Espírito como um poder divino para vencer toda tendência hereditária e cultivada para o mal, e gravar Seu próprio caráter em Sua igreja.','dtnespirito'],
 ['O destino dos ímpios se fixa por sua própria escolha.','gcescolha'],
 ['Bem está, servo bom e fiel. Sobre o pouco foste fiel, sobre muito te colocarei','mt2521'],
 ['Deve haver uma **obra ESPECIAL de PURIFICAÇÃO**','gc425']
]) {
 const q='“'+quote+'”',at=original.indexOf(q,headerEnd),tail=original.slice(at+q.length);
 exact(q,'_'+q+'_'+(/^[.;:]?\[\^/.test(tail)?'':'[^'+note+']'));
}
exact('“Cristo prometeu que o Espírito Santo habitaria naqueles que lutam pela vitória sobre o pecado”, concedendo poder sobrenatural ao instrumento humano.[^oevitoria]','_“Cristo prometeu que o Espírito Santo habitaria naqueles que lutam pela vitória sobre o pecado”_[^oevitoria], concedendo poder sobrenatural ao instrumento humano.');
exact('“the victory over sin” — **a vitória sobre o pecado**.[^stvitoria]','_“the victory over sin”_[^stvitoria] — **a vitória sobre o pecado**.');
exact('**“Minha graça vos basta”**. Então','_**“Minha graça vos basta”**_[^pevisao]. Então');
exact('pois “nem todas edificam”.[^1co1023]','pois _“nem todas edificam”_[^1co1023].');
exact('irrepreensíveis.\n\n<!-- AI-PROCESSED:START -->\n\n**Pelos frutos!**[^mt716]\n\n<!-- AI-PROCESSED:END -->\n\n Refiro-me','irrepreensíveis. <!-- AI-PROCESSED:START -->**Pelos frutos!**[^mt716]<!-- AI-PROCESSED:END --> Refiro-me');
exact('chama ao arrependimento:\n\n<!-- AI-PROCESSED:START -->\n\n A fidelidade pede a entrega positiva da vida: **“nem todas edificam”**.[^1co1023]\n\n<!-- AI-PROCESSED:END -->','chama ao arrependimento. <!-- AI-PROCESSED:START -->A fidelidade pede a entrega positiva da vida: _**“nem todas edificam”**_[^1co1023].<!-- AI-PROCESSED:END -->');
exact('permanecer ativa sob mãos infiéis.\n\n<!-- AI-PROCESSED:END -->\n\n','permanecer ativa sob mãos infiéis. <!-- AI-PROCESSED:END --> ');
let output=applyEditorialEdits(original,edits).markedOutput;
// Referências editoriais: versão identificada e livros distintos identificados separadamente.
const defs={
 agripa:['Bíblia, Atos','Bíblia, ACF. Atos'],
 tg217:['Bíblia, Tiago 2:17–18,26; cf. Efésios 2:8–10.','Bíblia, ARA. Tiago 2:17–18,26. Bíblia, ARA. Efésios 2:8–10.'],
 mc7:['Bíblia, Marcos','Bíblia, ARA. Marcos'],
 egitoroma:['Bíblia, Ezequiel','Bíblia, ARA. Ezequiel'],
 fogo:['Bíblia, Mateus 25:41 e Apocalipse 20:10,14–15.','Bíblia, ARA. Mateus 25:41. Bíblia, ARA. Apocalipse 20:10,14–15.'],
 gcescolha:['Cf. Bíblia, Tiago 4:17; Lucas 12:47–48.','Cf. Bíblia, ARA. Tiago 4:17. Bíblia, ARA. Lucas 12:47–48.'],
 naum:['Bíblia, Naum','Bíblia, ARA. Naum'],
 pentecostes:['Bíblia, Levítico 23:15–21; Atos 1:14; 2:1–4.','Bíblia, ARA. Levítico 23:15–21. Bíblia, ARA. Atos 1:14; 2:1–4.'],
 joio:['Bíblia, Mateus','Bíblia, ARA. Mateus'],
 jo811:['Bíblia, João','Bíblia, ARA. João'],
 mt541:['Bíblia, Mateus','Bíblia, ARA. Mateus'],
 transformacao:['Bíblia, 1 Coríntios 15:53–54 e 1 Tessalonicenses 4:16–18.','Bíblia, ARA. 1 Coríntios 15:53–54. Bíblia, ARA. 1 Tessalonicenses 4:16–18.']
};
for(const [key,[from,to]] of Object.entries(defs))output=output.replace(new RegExp('^\\[\\^'+key+'\\]:.*$','m'),line=>{if(!line.includes(from))throw Error(key);return line.replace(from,to);});
output=output.replace(/^(\[\^fogo\]:.*)Cf\. Ezequiel 33:11\./m,'$1Cf. Bíblia, ARA. Ezequiel 33:11.');
output=output.replace(/^(\[\^coerenciavitoria\]: )/m,'$1Referências bíblicas nesta nota: ARA. ');
output+='\n[^pevisao]: [Primeiros Escritos - Minha primeira visão, p. 15, 16](https://m.egwwritings.org/pt/book/1957.209). Ellen G. White. Paginação editorial do EPUB; p. 39, 40 impressas no PDF consultado.\n';
// Ordenar definições pela primeira chamada; preservar definições ainda sem chamada ao fim.
const definitions=new Map();output=output.replace(/^\[\^([a-zA-Z0-9]+)\]:.*$/gm,line=>{const key=line.match(/^\[\^([^\]]+)\]/)[1];if(definitions.has(key))throw Error('Nota duplicada '+key);definitions.set(key,line);return '';});
const order=[...new Set([...output.slice(headerEnd).matchAll(/\[\^([a-zA-Z0-9]+)\]/g)].map(m=>m[1]))];
for(const key of order)if(!definitions.has(key))throw Error('Nota ausente '+key);
output=output.trimEnd()+'\n\n'+[...order,...[...definitions.keys()].filter(k=>!order.includes(k))].map(k=>definitions.get(k)).join('\n\n')+'\n';
if(output.slice(0,headerEnd)!==original.slice(0,headerEnd))throw Error('Cabeçalho alterado');
fs.writeFileSync(file,output);fs.writeFileSync(path.join(__dirname,'aplicacao-M06.json'),JSON.stringify({mechanicalEdits:edits.length,definitions:definitions.size,unused:[...definitions.keys()].filter(k=>!order.includes(k)),headerPreserved:true,sha256:crypto.createHash('sha256').update(output).digest('hex')},null,2));
console.log('M06: '+edits.length+' reparos; '+definitions.size+' notas preservadas e ordenadas.');
