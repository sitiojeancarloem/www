// Preparação de entrada e registro por microtarefa; aplicação pelo mecanismo oficial.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../../..');
const {applyEditorialEdits}=require(path.join(root,'.ia.rules/core/runtime/scripts/editorial-authoring.js'));
const task=process.argv[2];
const configs={M02b:{source:'corpo-retomada.md',start:'Quando eu entrei na igreja,',end:'## 1. O texto'},M03:{source:'grupos123-retomada.md',start:'## 1. O texto',end:'## 4. O texto'},M04:{source:'grupos45-retomada.md',start:'## 4. O texto',end:'## 6. Novo conceito'},M05:{source:'grupo6-retomada.md',start:'## 6. Novo conceito',end:'[^ap14]:'}};
const c=configs[task];if(!c)throw Error('Microtarefa desconhecida');
const receipt=path.join(__dirname,'aplicacao-'+task+'.json');
if(fs.existsSync(receipt))throw Error('Já aplicada; não repetir');
const file=path.join(root,'_drafts/carta-aberta-hierarquia-romanda-na-igreja');
const original=fs.readFileSync(file,'utf8');
const previous=fs.readFileSync(path.join(__dirname,'corpo-final.md'),'utf8').replace(/\r\n/g,'\n');
let replacement=fs.readFileSync(path.join(__dirname,c.source),'utf8');
if(replacement.includes('@@IGREJAABERTURA@@')){
 const a=previous.indexOf('Virou quase um tabu'),b=previous.indexOf('A distinção também pode ser expressa',a);
 if(a<0||b<0)throw Error('Igreja ausente');
 let block=previous.slice(a,b).replace('A organização serve à missão. Essa frase não é uma definição jurídica nem resolve, sozinha, toda questão sobre a natureza da Igreja; é compatível com a distinção entre o povo e os meios que utiliza.','A ordem importa: a Igreja é organizada **PARA SERVIR**. A organização serve à Igreja e à sua missão; não substitui aquilo que a Igreja é. Essa é a inferência defendida aqui, em harmonia com a definição bíblica do corpo de CRISTO.');
 replacement=replacement.replace('@@IGREJAABERTURA@@',block);
}
if(replacement.includes('@@ELIAS@@')){
 const a=previous.indexOf('Isso ajuda a compreender a expressão **Elias atuais**'),b=previous.indexOf('Na compreensão adventista, vivemos, desde 1844,',a);
 if(a<0||b<0)throw Error('Elias ausente');
 replacement=replacement.replace('@@ELIAS@@',previous.slice(a,b));
}
if(replacement.includes('@@RESPONSABILIDADE@@')){
 const a=previous.indexOf('**O pecado não é apenas individual quando alcança');
 const b=previous.indexOf('A reflexão alcança todos e, de modo',a);
 if(a<0||b<0)throw Error('Responsabilidade ausente');
 let block=previous.slice(a,b);
 block=block.replace('**omissão** importa. **DEVEMOS nos preocupar**, orar, **advertir** quando nos compete, agir dentro da ordem e buscar', '**omissão será cobrada por DEUS**. **Você e eu DEVEMOS nos preocupar**, DEVEMOS orar, **DEVEMOS advertir** quando nos compete advertir, DEVEMOS agir dentro da ordem e da responsabilidade que DEUS nos concedeu e DEVEMOS buscar');
 replacement=replacement.replace('@@RESPONSABILIDADE@@',block);
}
if(replacement.includes('@@ILUSTRACAO@@')){
 const a=previous.indexOf('*Considere esta ilustração, não o relato de um caso clínico:*');
 const b=previous.indexOf('É exatamente por isso que a questão da Igreja',a);
 if(a<0||b<0)throw Error('Ilustração ausente');
 replacement=replacement.replace('@@ILUSTRACAO@@',previous.slice(a,b));
}
if(replacement.includes('@@EXPIACAO@@')){
 const a=previous.indexOf('Na compreensão adventista, vivemos, desde 1844,');
 const b=previous.indexOf('Estamos sendo **insubordinados** ou submissos a DEUS?',a);
 if(a<0||b<0)throw Error('Expiação não localizada');
 let exp=previous.slice(a,b)+'Nós todos estamos sendo **insubordinados** ou subordinados **a DEUS**?\n';
 exp=exp.replace('**mais do que em qualquer outro tempo**','**MAIS do que em qualquer outro tempo**');
 exp=exp.replace('Fortalece a vigilância ou alimenta a distração? Aproxima de CRISTO','Contribui para a vigilância ou alimenta a distração? Fortalece a mente para as coisas eternas ou a embriaga com frivolidade? Aproxima de CRISTO');
 exp=exp.replace('Não abandones teus deveres: **santifica-os**. Não permitas que o trabalho necessário absorva a alma e apague a consciência da eternidade. Não abandones a vida: **vive-a à luz da redenção**. O chamado é à **consagração**, ao **arrependimento verdadeiro** e à **maior responsabilidade diante de maior luz**. Quem recebeu a luz do santuário não pode viver como se ela não criasse dever algum.', 'Não abandones teus deveres. **Santifica-os.** Não abandones o trabalho necessário. **Não permitas que ele absorva a alma a ponto de apagar a consciência da eternidade.** Não abandones a vida. **Vive-a como alguém que sabe em que momento da história da redenção se encontra.** Este não é um chamado à ociosidade. É um chamado à **consagração**. Não é um chamado ao fanatismo. É um chamado ao **arrependimento verdadeiro**. Não é uma nova lei. É **maior responsabilidade diante de maior luz**. Não é a negação de tudo o que era legítimo antes de 1844. É o reconhecimento de que **aquele que recebeu a luz do santuário não pode continuar vivendo como se essa luz não criasse dever algum**.');
 exp=exp.replace('no grande dia da expiação.”_[^gc490].','no grande dia da expiação.”_[^gc490]');
 replacement=replacement.replace('@@EXPIACAO@@',exp);
}
replacement=replacement.replace(/@@QUOTE:(.*?)@@/g,(_,prefix)=>{
 const blocks=previous.match(/^> .+\n> — .+(?:\n\n¹ [^\n]+)?/gm)||[];
 const matches=blocks.filter(b=>b.startsWith('> '+prefix));
 if(matches.length!==1)throw Error('Citação não unívoca: '+prefix);
 return matches[0];
});
if(replacement.includes('@@'))throw Error('Placeholder não resolvido');
const start=original.indexOf(c.start),end=original.indexOf(c.end,start+1);
if(start<0||end<start)throw Error('Fronteira ausente');
const result=applyEditorialEdits(original,[{start,end,expected:original.slice(start,end),replacement:'\n'+replacement+'\n',kind:'editorial',reason:'FT-112 '+task+': preservação autoral, fontes e integração'}]);
let output=result.markedOutput;
const defined=new Set([...output.matchAll(/^\[\^([^\]]+)\]:/gm)].map(m=>m[1]));
const used=new Set([...replacement.matchAll(/\[\^([^\]]+)\]/g)].map(m=>m[1]));
const extras=fs.existsSync(path.join(__dirname,'notas-retomada.md'))?fs.readFileSync(path.join(__dirname,'notas-retomada.md'),'utf8'):'';
const notes=(previous+'\n'+extras).split(/\r?\n/).filter(l=>/^\[\^/.test(l)&&used.has(l.match(/^\[\^([^\]]+)/)[1])&&!defined.has(l.match(/^\[\^([^\]]+)/)[1]));
output+='\n'+notes.join('\n')+'\n';
const missing=[...used].filter(k=>!new RegExp('^\\[\\^'+k+'\\]:','m').test(output));
if(missing.length)throw Error('Notas ausentes: '+missing);
fs.writeFileSync(file,output);
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
fs.writeFileSync(receipt,JSON.stringify({task,before:hash(original),after:hash(output),regions:result.regions,newNotes:notes.length},null,2)+'\n');
console.log(task+' aplicada: '+notes.length+' notas adicionais.');
