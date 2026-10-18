import sys,json,hashlib,subprocess
from pathlib import Path
here=Path(__file__).resolve().parent
repo=here.parents[4]
out=here/'egw-M39A-uza.json'
if json.loads(out.read_text(encoding='utf-8'))['status']!='pending': raise SystemExit('Captura já existe; não repetir')
library=Path(sys.argv[1]); epub=library/'pt-br/livros/patriarcas-e-profetas/pep.epub'
draft=repo/'_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md'
digest=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
before={'epub':digest(epub),'draft':digest(draft)}
args=[sys.executable,'-X','utf8',str(repo/'.ia.rules/local/skills/egw-source-verification/scripts/egw_source_verification.py'),'--library-root',str(library),'--query','Uzá','--language','pt','--title','Patriarcas e Profetas','--formats','epub','--tolerance','0','--context','800','--limit','4','--max-files','1000']
result={'status':'failed','query':'Uzá','format':'epub','mechanism':'egw_source_verification.py','before':before}
try:
 p=subprocess.run(args,capture_output=True,text=True,encoding='utf-8',timeout=120)
 result.update(process_exit_code=p.returncode,source_result=json.loads(p.stdout),stderr=p.stderr)
 result['after']={'epub':digest(epub),'draft':digest(draft)}
 if result['after']!=before: raise ValueError('Fonte ou artigo alterado durante captura')
 result['status']='captured' if p.returncode==0 else 'diagnostic'
except Exception as e:
 result['error']=str(e)
out.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'status':result['status'],'source_status':result.get('source_result',{}).get('status'),'process_exit_code':result.get('process_exit_code'),'preserved':result.get('before')==result.get('after')},ensure_ascii=False))
raise SystemExit(0 if result['status']=='captured' else 1)
