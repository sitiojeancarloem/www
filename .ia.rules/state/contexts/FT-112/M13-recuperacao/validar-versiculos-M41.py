import re,json,hashlib,sys
from pathlib import Path
here=Path(__file__).resolve().parent;repo=here.parents[4]
target=here/'validacao-versiculos-M41.json'
if json.loads(target.read_text(encoding='utf-8'))['status']!='pending':raise SystemExit('Relatório já produzido')
source=(repo/'_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md').read_bytes()
sha=hashlib.sha256(source).hexdigest()
result={'status':'failed','sha256_draft':sha,'blocks':[],'issues':[],'limit':'Numeração/estrutura declarada, não novo confronto de literalidade, contexto teológico ou paginação.'}
try:
 if sha!='f35d26c8f4d684475924e735d6a572d92e3535d064238c78d53ac1b981116f5a':raise ValueError('Fonte mudou após M40')
 body=re.sub(r'<!--.*?-->','',source.decode('utf-8'),flags=re.S)
 matches=list(re.finditer(r'^> (.+)\n> — (.+)$',body,re.M))
 if len(matches)!=44:raise ValueError('Cobertura de blocos divergente do gate atual')
 translate=str.maketrans('⁰¹²³⁴⁵⁶⁷⁸⁹','0123456789')
 for index,m in enumerate(matches,1):
  text,ref=m.groups();row={'index':index,'reference':ref,'bible':ref.startswith('Bíblia')}
  if re.search(r'\[\^[^\]]+\]',text+ref):result['issues'].append({'index':index,'error':'Chamada de nota no bloco exige classificação contextual'})
  if row['bible']:
   numbers=[int(s.translate(translate)) for s in re.findall(r'[⁰¹²³⁴⁵⁶⁷⁸⁹]+',text)]
   matched=re.search(r'\b\d+:([\d,\s\-–]+)',ref)
   if not matched or ';' in ref:raise ValueError('Referência não analisável: '+ref)
   expected=[]
   for part in matched[1].replace('–','-').replace(' ','').split(','):
    if not part:continue
    bounds=[int(x) for x in part.split('-')]
    if len(bounds)==1:expected+=bounds
    elif len(bounds)==2 and bounds[0]<=bounds[1]:expected+=list(range(bounds[0],bounds[1]+1))
    else:raise ValueError('Intervalo não analisável: '+ref)
   row.update(actual=numbers,expected=expected)
   if numbers!=expected:result['issues'].append({'index':index,'reference':ref,'actual':numbers,'expected':expected})
  result['blocks'].append(row)
 result['bible_blocks']=sum(x['bible'] for x in result['blocks'])
 result['status']='passed' if not result['issues'] else 'needs_review'
except Exception as err:result['error']=str(err)
target.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in result.items() if k!='blocks'},ensure_ascii=False))
raise SystemExit(0 if result['status']=='passed' else 1)
