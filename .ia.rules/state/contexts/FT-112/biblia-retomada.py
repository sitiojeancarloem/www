"""Captura delimitada dos capítulos novos, sem sobrescrever evidências anteriores."""
import urllib.request,re,html,json
from pathlib import Path
out=[]
for ref in ['ap/7','ap/8','ap/9','ap/17','dn/12','nm/6']:
 url='https://www.bibliaonline.com.br/ara/'+ref
 raw=urllib.request.urlopen(url,timeout=30).read().decode()
 verses={}
 for m in re.finditer(r'<span data-t="\d+"[^>]*>(.*?)</span>',raw,re.S):
  prev=list(re.finditer(r'data-v="\.(\d+)\."',raw[:m.start()]))
  if prev:verses[prev[-1][1]]=verses.get(prev[-1][1],'')+html.unescape(re.sub('<[^>]*>','',m[1]))
 if not verses:raise ValueError('Nenhum versículo extraído: '+ref)
 out.append({'version':'ARA','ref':ref,'url':url,'verses':verses})
 print(ref,len(verses),flush=True)
(Path(__file__).parent/'biblia-retomada.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
