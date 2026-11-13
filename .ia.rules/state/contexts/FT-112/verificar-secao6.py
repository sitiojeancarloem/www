"""Consultas delimitadas por EPUB/PDF usando os extratores da Skill oficial."""
from pathlib import Path
import importlib.util,json,hashlib,sys
here=Path(__file__).parent; repo=here.parents[3];lib=Path(sys.argv[1])
spec=importlib.util.spec_from_file_location('egw',repo/'.ia.rules/local/skills/egw-source-verification/scripts/egw_source_verification.py'); e=importlib.util.module_from_spec(spec);spec.loader.exec_module(e)
queries={'mensagens-escolhidas-2':['nenhum tempo definido','igreja é Babilônia'], 'primeiros-escritos':['sete dias ascendendo'], 'o-grande-conflito':['cidades e vilas','Urias Smith']}
extra=len(sys.argv)>2 and sys.argv[2]=='complemento'
if extra:queries={'testemunhos-seletos-2':['igrejas adventistas do sétimo dia constituem Babilônia'], 'o-colportor-evangelista':['Há em O Desejado','Eles contêm exatamente'], 'mensagens-escolhidas-1':['tempo definido','baseada em tempo']}
vitoria=len(sys.argv)>2 and sys.argv[2]=='vitoria'
if vitoria:queries={'mensagens-aos-jovens':['Assumir a vitória','vitória sobre o pecado'], 'primeiros-escritos':['Todos os rostos empalideceram'], 'obreiros-evangelicos':['vitória sobre o pecado'], 'o-desejado-de-todas-as-nacoes':['vencer o pecado','vitória sobre o pecado'], 'a-ciencia-do-bom-viver':['vitória sobre o pecado']}
adicional=len(sys.argv)>2 and sys.argv[2]=='vitoria2'
if adicional:queries={'o-desejado-de-todas-as-nacoes':['O pecado só','Não há desculpa','Toda verdadeira obediência'], 'o-grande-conflito':['É impossível explicar','Não se levantará','Todos os que','modo de agir'], 'mensagens-aos-jovens':['Se um dia entrarmos']}
autoral=len(sys.argv)>2 and sys.argv[2]=='autoral'
if autoral:queries={'o-desejado-de-todas-as-nacoes':['Mediante o cativeiro'], 'o-grande-conflito':['ódio ao judaísmo','própria escolha','durante os mil anos','modo de agir']}
out=[]
for book,terms in queries.items():
 for p in (lib/'pt-br/livros'/book).iterdir():
  if p.suffix not in ('.epub','.pdf'):continue
  before=hashlib.sha256(p.read_bytes()).hexdigest()
  meta,parts=(e.epub_documents(p) if p.suffix=='.epub' else e.pdf_documents(p))
  for term in terms:
   hits=[]
   for loc,txt in parts:
    hit=e.occurrence(p,lib,p.suffix[1:],str(loc),txt,term,0,1800,meta.get('title',''),meta.get('language',''))
    if hit:hits.append(hit)
   out.append({'book':book,'query':term,'sha256':before,'hits':hits})
   print(book,p.suffix,term,len(hits))
  assert before==hashlib.sha256(p.read_bytes()).hexdigest()
(here/('evidencias-autoral.json' if autoral else 'evidencias-vitoria2.json' if adicional else 'evidencias-vitoria.json' if vitoria else 'evidencias-secao6-complemento.json' if extra else 'evidencias-secao6.json')).write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
