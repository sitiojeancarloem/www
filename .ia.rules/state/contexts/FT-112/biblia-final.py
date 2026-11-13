"""Captura única dos capítulos de apoio acrescentados; limite de quatro conexões."""
import urllib.request,re,html,json,hashlib
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
refs=['1jo/5','tg/2','mc/7','ez/29','mt/25','ap/20','ez/33','tg/4','na/1','lv/23','at/1','at/2','mt/13','jo/8','mt/5','1co/15','1ts/4','jo/16','rm/8','gl/5','ap/19','ap/12','ap/14','ex/20','ez/20','1jo/2']
def fetch(ref):
 url='https://www.bibliaonline.com.br/ara/'+ref
 raw=urllib.request.urlopen(url,timeout=40).read().decode();verses={}
 for m in re.finditer(r'<span data-t="\d+"[^>]*>(.*?)</span>',raw,re.S):
  prev=list(re.finditer(r'data-v="\.(\d+)\."',raw[:m.start()]))
  if prev:verses[prev[-1][1]]=verses.get(prev[-1][1],'')+html.unescape(re.sub('<[^>]*>','',m[1]))
 if not verses:raise ValueError('Sem versículos: '+ref)
 return {'version':'ARA','ref':ref,'url':url,'sha256_html':hashlib.sha256(raw.encode()).hexdigest(),'verses':verses}
with ThreadPoolExecutor(max_workers=4) as pool:out=list(pool.map(fetch,refs))
(Path(__file__).parent/'biblia-final.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
print('Capítulos capturados:',len(out))
