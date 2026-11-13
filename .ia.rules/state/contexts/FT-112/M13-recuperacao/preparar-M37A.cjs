const fs=require('node:fs'),path=require('node:path');
const source=path.join(__dirname,'..','validar-citacoes-atual.py'),target=path.join(__dirname,'validar-citacoes-M37A.py');
if(fs.existsSync(target))throw Error('Adaptador já existe; não repetir preparação');
let s=fs.readFileSync(source,'utf8').replace(/\r\n/g,'\n');
function replace(a,b){if(s.split(a).length!==2)throw Error('Âncora divergente: '+a);s=s.replace(a,b);}
replace("here=Path(__file__).parent;repo=here.parents[3]", "here=Path(__file__).parent.parent;repo=here.parents[3]");
if(s.split("_drafts/carta-aberta-hierarquia-romanda-na-igreja").length!==3)throw Error('Esperados dois paths históricos');
s=s.split('_drafts/carta-aberta-hierarquia-romanda-na-igreja').join('_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md');
replace(".split('-->',1)[1]", ".split('---',2)[2]");
const start=s.indexOf('for m in re.finditer('),end=s.indexOf("result={'aprovadas':");
if(start<0||end<=start)throw Error('Laço inline não localizado');
s=s.slice(0,start)+s.slice(end);
replace("(here/'validacao-citacoes-atual.json')", "(Path(__file__).parent/'validacao-citacoes-M37A.json')");
replace("print(json.dumps(result,ensure_ascii=False,indent=2))", "result['escopo']='Somente blockquotes; inline e notas novas não incluídos.'\n(Path(__file__).parent/'validacao-citacoes-M37A.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')\nprint(json.dumps(result,ensure_ascii=False,indent=2))\nsys.exit(1 if issues else 0)");
fs.writeFileSync(target,s,'utf8');
console.log(JSON.stringify({unit:'M37A',adapter:'created',scope:'Somente blockquotes; fontes e comparador existentes.'}));
