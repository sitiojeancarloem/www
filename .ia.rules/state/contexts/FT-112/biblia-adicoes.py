"""Captura delimitada dos capítulos novos, sem sobrescrever evidências anteriores."""
import urllib.request,re,html,json
from pathlib import Path
out=[]
for version,ref in [('ARA','2tm/1'),('ARA','ap/21'),('NVI','mt/23'),('NVI','1co/10'),('NTLH','mt/10'),('ACF','mt/25'),('ACF','at/26')]:
 url='https://www.bibliaonline.com.br/'+version.lower()+'/'+ref
 raw=urllib.request.urlopen(url,timeout=30).read().decode()
 verses={}
 for m in re.finditer(r'<span data-t="\d+"[^>]*>(.*?)</span>',raw,re.S):
  prev=list(re.finditer(r'data-v="\.(\d+)\."',raw[:m.start()]))
  if prev:verses[prev[-1][1]]=verses.get(prev[-1][1],'')+html.unescape(re.sub('<[^>]*>','',m[1]))
 if not verses:raise ValueError('Nenhum versículo extraído: '+ref)
 out.append({'version':version,'ref':ref,'url':url,'verses':verses})
 print(ref,len(verses),flush=True)
(Path(__file__).parent/'biblia-adicoes.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
