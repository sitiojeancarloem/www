"""FT-112: compara texto citado com evidências; não decide interpretação teológica."""
import re,json,sys,importlib.util,unicodedata,hashlib
from pathlib import Path
here=Path(__file__).parent.parent;repo=here.parents[3];lib=Path(sys.argv[1])
spec=importlib.util.spec_from_file_location('egw',repo/'.ia.rules/local/skills/egw-source-verification/scripts/egw_source_verification.py');e=importlib.util.module_from_spec(spec);spec.loader.exec_module(e)
body=(repo/'_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md').read_text(encoding='utf-8').split('---',2)[2].replace(r'\[...\]', '[...]'); body=re.sub(r'<!--.*?-->', '', body, flags=re.S)
notes=json.loads((here/'notas.json').read_text(encoding='utf-8'))
notes.update({'ap915':['ARA','ap/9','Apocalipse 9:15'],'majvitoria':['EGW','mensagens-aos-jovens','MAJ 105,106'],'dtnvitoria':['EGW','o-desejado-de-todas-as-nacoes','DTN 213'],'dtnespirito':['EGW','o-desejado-de-todas-as-nacoes','DTN 475'],'oevitoria':['EGW','obreiros-evangelicos','OE 286'],'gcescolha':['EGW','o-grande-conflito','GC 543'],'pevisao':['EGW','primeiros-escritos','PE 15,16'],'mt2521':['ACF','mt/25','Mateus 25:21'],'stvitoria':['URL','','ST 26/8/1903 §2']})
bib=json.loads((here/'biblia-evidencias.json').read_text(encoding='utf-8'))
bib+=json.loads((here/'biblia-retomada.json').read_text(encoding='utf8')); bib+=json.loads((here/'biblia-adicoes.json').read_text(encoding='utf8'))
bib+=json.loads((here/'biblia-final.json').read_text(encoding='utf8'))
notes['jo811']=['ARA','jo/8','João 8:11']

for cached in sorted(Path(__file__).parent.glob('biblia-M*.json')):
 data=json.loads(cached.read_text(encoding='utf-8'))
 if isinstance(data,dict) and data.get('status')=='captured': bib+=data.get('entries',[])
notes.update({'jo16811':['ARA','jo/16','João16'],'tcaminho22':['EGW','testemunhos-para-a-igreja-5','T5 p22'],'tcaminho23':['EGW','testemunhos-para-a-igreja-5','T5 p23'],'setemilelias':['ARA','1rs/19','1Rs19'],'prepararcaminho':['ARA','lc/3','Lc3'],'leitestemunho':['ARA','is/8','Is8'],'ap18prazo':['ARA','ap/18','Ap18'],'prester':['EGW','profetas-e-reis','PR393']})
books={};issues=[];passed=[];skipped=[]
def norm(s):
 s=re.sub('<[^>]*>','',s);s=re.sub('[⁰¹²³⁴⁵⁶⁷⁸⁹]','',s)
 return ''.join(c for c in unicodedata.normalize('NFD',s).lower() if c.isalpha())
def corpus(folder):
 if folder not in books:
  p=next((lib/'pt-br/livros'/folder).glob('*.epub'));books[folder]=' '.join(t for _,t in e.epub_documents(p)[1])
 return re.sub(r'1Testemunhos Para a Igreja 4:232, 233 \(1876\)\.\s*2Testemunhos Para a Igreja 3:265, 266 \(1873\)\.\s*3Testemunhos Para a Igreja 3:324 \(1873\)\.\s*4Testemunhos Para a Igreja 3:269 \(1873\)\.\s*\[677\]', '', books[folder])
mapbooks={'Testemunhos para a Igreja, v. 5':'testemunhos-para-a-igreja-5','Primeiros Escritos':'primeiros-escritos','O Grande Conflito':'o-grande-conflito','Testemunhos Seletos, v. 2':'testemunhos-seletos-2','Educação':'educacao','Evangelismo':'evangelismo','Mensagens Escolhidas, v. 2':'mensagens-escolhidas-2'}
abbr={'Lucas':'lc','Efésios':'ef','Amós':'am','Hebreus':'hb','Salmos':'sl','Provérbios':'pv','Jeremias':'jr','Miquéias':'mq','Isaías':'is','2 Timóteo':'2tm','Apocalipse':'ap','Daniel':'dn','Mateus':'mt','1 Coríntios':'1co'}
def check(text,source,label):
 parts=re.split(r'\[\.\.\.\]|\.\.\.|…',text)
 failures=[p.strip() for p in parts if len(norm(p))>5 and norm(p) not in norm(source)]
 (issues if failures else passed).append({'ref':label,'trechos':failures} if failures else label)
for m in re.finditer(r'_[“"]([^”"\n]+?)[”"]_[.;,:]?[ \t]*\[\^([a-zA-Z0-9]+)\](?!:)',body.replace('**','')):
 text,key=m.groups()
 if key not in notes:issues.append({'ref':key,'erro':'nota nova requer mapa'});continue
 typ,loc,label=notes[key]
 if typ=='EGW':
  if loc.startswith('../devocionais/'):
   p=next((lib/'pt-br/devocionais'/loc.split('/')[-1]).glob('*.epub'));source=' '.join(t for _,t in e.epub_documents(p)[1])
  else:source=corpus(loc)
 elif typ!='URL':source=' '.join(next(x for x in bib if x.get('version')==typ and x.get('ref')==loc)['verses'].values())
 else:skipped.append(key);continue
 check(text,source,key)
result={'aprovadas':len(passed),'referencias_conferidas':passed,'divergencias':issues,'sha256_draft':hashlib.sha256((repo/'_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md').read_bytes()).hexdigest(),'criterio':'Correspondência lexical sem pontuação, espaços ou capitalização de ênfase; omissões explícitas segmentadas. Inspeção humana complementar obrigatória. ST inglês conferido separadamente na fonte pública.'}
(Path(__file__).parent/'validacao-citacoes-M37B.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
result['escopo']='Inline em itálico/aspas com chamada imediata na mesma linha; definições não são chamadas. Não cobre todas as citações nas próprias notas.'
result['nao_comparadas_url']=skipped
(Path(__file__).parent/'validacao-citacoes-M37B.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
sys.exit(1 if issues else 0)
