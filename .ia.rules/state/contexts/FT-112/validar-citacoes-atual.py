"""FT-112: compara texto citado com evidências; não decide interpretação teológica."""
import re,json,sys,importlib.util,unicodedata,hashlib
from pathlib import Path
here=Path(__file__).parent;repo=here.parents[3];lib=Path(sys.argv[1])
spec=importlib.util.spec_from_file_location('egw',repo/'.ia.rules/local/skills/egw-source-verification/scripts/egw_source_verification.py');e=importlib.util.module_from_spec(spec);spec.loader.exec_module(e)
body=(repo/'_drafts/carta-aberta-hierarquia-romanda-na-igreja').read_text(encoding='utf-8').split('-->',1)[1].replace(r'\[...\]', '[...]'); body=re.sub(r'<!--.*?-->', '', body, flags=re.S)
notes=json.loads((here/'notas.json').read_text(encoding='utf-8'))
notes.update({'ap915':['ARA','ap/9','Apocalipse 9:15'],'majvitoria':['EGW','mensagens-aos-jovens','MAJ 105,106'],'dtnvitoria':['EGW','o-desejado-de-todas-as-nacoes','DTN 213'],'dtnespirito':['EGW','o-desejado-de-todas-as-nacoes','DTN 475'],'oevitoria':['EGW','obreiros-evangelicos','OE 286'],'gcescolha':['EGW','o-grande-conflito','GC 543'],'pevisao':['EGW','primeiros-escritos','PE 15,16'],'mt2521':['ACF','mt/25','Mateus 25:21'],'stvitoria':['URL','','ST 26/8/1903 §2']})
bib=json.loads((here/'biblia-evidencias.json').read_text(encoding='utf-8'))
bib+=json.loads((here/'biblia-retomada.json').read_text(encoding='utf8')); bib+=json.loads((here/'biblia-adicoes.json').read_text(encoding='utf8'))
bib+=json.loads((here/'biblia-final.json').read_text(encoding='utf8'))
notes['jo811']=['ARA','jo/8','João 8:11']
books={};issues=[];passed=[]
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
for match in re.finditer(r'^> (.+)\n> — (.+)$',body,re.M):
 text,ref=match.groups()
 if ref.startswith('Bíblia'):
  m=re.match(r'Bíblia, (\w+)\. (.+) (\d+):',ref);v,b,c=m.groups();key=abbr[b]+'/'+c
  rec=next((x for x in bib if x.get('version')==v and x.get('ref')==key),None)
  if rec:check(text,' '.join(rec['verses'].values()),ref)
  else:issues.append({'ref':ref,'erro':'fonte ausente'})
 else:
  folder=next((v for k,v in mapbooks.items() if k in ref),None)
  if folder:check(text,corpus(folder),ref)
  else:issues.append({'ref':ref,'erro':'fonte não mapeada'})
for m in re.finditer(r'_[“"]([^”"\n]+?)[”"]_[.;,:]?\s*\[\^([a-zA-Z0-9]+)\]',body.replace('**','')):
 text,key=m.groups()
 if key not in notes:issues.append({'ref':key,'erro':'nota nova requer mapa'});continue
 typ,loc,label=notes[key]
 if typ=='EGW':
  if loc.startswith('../devocionais/'):
   p=next((lib/'pt-br/devocionais'/loc.split('/')[-1]).glob('*.epub'));source=' '.join(t for _,t in e.epub_documents(p)[1])
  else:source=corpus(loc)
 elif typ!='URL':source=' '.join(next(x for x in bib if x.get('version')==typ and x.get('ref')==loc)['verses'].values())
 else:continue
 check(text,source,key)
result={'aprovadas':len(passed),'referencias_conferidas':passed,'divergencias':issues,'sha256_draft':hashlib.sha256((repo/'_drafts/carta-aberta-hierarquia-romanda-na-igreja').read_bytes()).hexdigest(),'criterio':'Correspondência lexical sem pontuação, espaços ou capitalização de ênfase; omissões explícitas segmentadas. Inspeção humana complementar obrigatória. ST inglês conferido separadamente na fonte pública.'}
(here/'validacao-citacoes-atual.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
