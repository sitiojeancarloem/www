const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../../../..'),file=path.join(root,'_drafts/carta-aberta-hierarquia-romanda-na-igreja');
const {applyEditorialEdits}=require(path.join(root,'.ia.rules/core/runtime/scripts/editorial-authoring.js'));
const source=fs.readFileSync(file,'utf8'),expected='<u>**insubordinação**</u>',start=source.indexOf(expected);
if(start<0||source.indexOf(expected,start+1)>=0)throw Error('Precondição: uma ocorrência');
const result=applyEditorialEdits(source,[{start,end:start+expected.length,expected,replacement:'**<u>insubordinação</u>**',kind:'mechanical',reason:'FT-112 M06: Kramdown não interpreta Markdown dentro de u; preservar negrito e sublinhado efetivos'}]);
fs.writeFileSync(file,result.markedOutput);
