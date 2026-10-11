from pathlib import Path
import sys,importlib.util,json,hashlib
h=Path(__file__).parent;r=h.parents[3];lib=Path(sys.argv[1]);p=next((lib/'pt-br/livros/o-grande-conflito').glob('*.epub'))
s=importlib.util.spec_from_file_location('egw',r/'.ia.rules/local/skills/egw-source-verification/scripts/egw_source_verification.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
before=hashlib.sha256(p.read_bytes()).hexdigest();hits=[]
for loc,t in e.epub_documents(p)[1]:
 for term in ['mulher virtuosa','igreja apóstata']:
  at=t.find(term)
  if at>=0:hits.append({'location':str(loc),'context':t[max(0,at-500):at+1100]})
assert hits and before==hashlib.sha256(p.read_bytes()).hexdigest()
(h/'evidencias-mulher-M11.json').write_text(json.dumps({'path':str(p.relative_to(lib)),'sha256':before,'hits':hits},ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(hits,ensure_ascii=False,indent=2))
