const fs=require('node:fs'),path=require('node:path');
const source=path.join(__dirname,'..','validar-citacoes-atual.py'),target=path.join(__dirname,'validar-citacoes-M37B.py');
if(fs.existsSync(target))throw Error('Adaptador existente; não repetir');
let s=fs.readFileSync(source,'utf8').replace(/\r\n/g,'\n');
function replace(a,b){if(s.split(a).length!==2)throw Error('Âncora divergente: '+a);s=s.replace(a,b);}
replace('here=Path(__file__).parent;repo=here.parents[3]','here=Path(__file__).parent.parent;repo=here.parents[3]');
if(s.split('_drafts/carta-aberta-hierarquia-romanda-na-igreja').length!==3)throw Error('Paths históricos divergentes');
s=s.split('_drafts/carta-aberta-hierarquia-romanda-na-igreja').join('_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md');
replace(".split('-->',1)[1]", ".split('---',2)[2]");
replace('books={};issues=[];passed=[]', `
for cached in sorted(Path(__file__).parent.glob('biblia-M*.json')):
 data=json.loads(cached.read_text(encoding='utf-8'))
 if isinstance(data,dict) and data.get('status')=='captured': bib+=data.get('entries',[])
notes.update({'jo16811':['ARA','jo/16','João16'],'tcaminho22':['EGW','testemunhos-para-a-igreja-5','T5 p22'],'tcaminho23':['EGW','testemunhos-para-a-igreja-5','T5 p23'],'setemilelias':['ARA','1rs/19','1Rs19'],'prepararcaminho':['ARA','lc/3','Lc3'],'leitestemunho':['ARA','is/8','Is8'],'ap18prazo':['ARA','ap/18','Ap18'],'prester':['EGW','profetas-e-reis','PR393']})
books={};issues=[];passed=[];skipped=[]`);
const start=s.indexOf('for match in re.finditer('),end=s.indexOf('for m in re.finditer(');
if(start<0||end<=start)throw Error('Laços divergentes');
s=s.slice(0,start)+s.slice(end);
replace('\\s*\\[\\^([a-zA-Z0-9]+)\\]', '[ \\t]*\\[\\^([a-zA-Z0-9]+)\\](?!:)');
replace(' else:continue',' else:skipped.append(key);continue');
replace("(here/'validacao-citacoes-atual.json')", "(Path(__file__).parent/'validacao-citacoes-M37B.json')");
replace('print(json.dumps(result,ensure_ascii=False,indent=2))', "result['escopo']='Inline em itálico/aspas com chamada imediata na mesma linha; definições não são chamadas. Não cobre todas as citações nas próprias notas.'\nresult['nao_comparadas_url']=skipped\n(Path(__file__).parent/'validacao-citacoes-M37B.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')\nprint(json.dumps(result,ensure_ascii=False,indent=2))\nsys.exit(1 if issues else 0)");
fs.writeFileSync(target,s,'utf8');
console.log(JSON.stringify({unit:'M37B',adapter:'created',scope:'Somente inline com chamada imediata; sem capturar definição seguinte.'}));
