import sys,json,hashlib,subprocess,importlib.util
from pathlib import Path
here=Path(__file__).resolve().parent;repo=here.parents[4]
out=here/'egw-M39B-contexto.json'
if json.loads(out.read_text(encoding='utf-8'))['status']!='pending':raise SystemExit('Captura já existente')
library=Path(sys.argv[1]);book=library/'pt-br/livros/patriarcas-e-profetas'
draft=repo/'_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md'
digest=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
before={'epub':digest(book/'pep.epub'),'pdf':digest(book/'pep.pdf'),'draft':digest(draft)}
result={'status':'failed','before':before,'source_location':'OEBPS/content69.xhtml','query':'A sorte de Uzá'}
try:
 mechanism=repo/'.ia.rules/local/skills/egw-source-verification/scripts/egw_source_verification.py'
 spec=importlib.util.spec_from_file_location('egw',mechanism);e=importlib.util.module_from_spec(spec);spec.loader.exec_module(e)
 metadata,docs=e.epub_documents(book/'pep.epub')
 text=next(t for loc,t in docs if loc=='OEBPS/content69.xhtml')
 start=text.index('A sorte de Uzá')
 result.update(epub_metadata=metadata,epub_excerpt=text[max(0,start-180):start+5000])
 args=[sys.executable,'-X','utf8',str(mechanism),'--library-root',str(library),'--query','A sorte de Uzá','--language','pt','--title','Patriarcas e Profetas','--formats','pdf','--tolerance','0','--context','1200','--limit','2','--max-files','1000']
 p=subprocess.run(args,capture_output=True,text=True,encoding='utf-8',timeout=120)
 result.update(process_exit_code=p.returncode,pdf_result=json.loads(p.stdout),stderr=p.stderr)
 result['after']={'epub':digest(book/'pep.epub'),'pdf':digest(book/'pep.pdf'),'draft':digest(draft)}
 if before!=result['after']:raise ValueError('Fonte/artigo alterado')
 result['status']='captured' if p.returncode==0 else 'diagnostic'
except Exception as err:result['error']=str(err)
out.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'status':result['status'],'source_status':result.get('pdf_result',{}).get('status'),'process_exit_code':result.get('process_exit_code'),'preserved':before==result.get('after')},ensure_ascii=False))
raise SystemExit(0 if result['status']=='captured' else 1)
