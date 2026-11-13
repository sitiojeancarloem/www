const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../../../..'),file=path.join(root,'_drafts/carta-aberta-hierarquia-romanda-na-igreja');
const {applyEditorialEdits}=require(path.join(root,'.ia.rules/core/runtime/scripts/editorial-authoring.js'));
const original=fs.readFileSync(file,'utf8'),start=original.indexOf('-->')+3;
let body=original.slice(start).replace(/(?<!\\)\[\.\.\.\]/g,'\\[...]').replace('> — 1 Coríntios 10:13 | NVI','> — Bíblia, NVI. 1 Coríntios 10:13');
body=body.replace(/([^\n])?(<!-- AI-PROCESSED:(?:START|END) -->)([^\n])?/g,(_,before,tag,after)=>(before?before+'\n\n':'')+tag+(after?'\n\n'+after:''));
body=body.replace(/[ \t]+$/gm,'');
const result=applyEditorialEdits(original,[{start,end:original.length,expected:original.slice(start),replacement:body,kind:'mechanical',reason:'FT-112 M10: escapes de omissão e separação de marcadores'}]);
fs.writeFileSync(file,result.markedOutput);
