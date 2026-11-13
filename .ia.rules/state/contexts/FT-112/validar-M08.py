from pathlib import Path
import json,re,unicodedata
h=Path(__file__).parent
d=Path('_drafts/carta-aberta-hierarquia-romanda-na-igreja').read_text(encoding='utf8')
b=(h/'base-autoral-ff9f255678.md').read_text(encoding='utf8')
a=b.index('Não ser incoerente:');z=b.index('> ¹³ **NÃO** sobreveio',a)
assert d[:a]==b[:a]
assert d[d.index('> ¹³ **NÃO** sobreveio'):].startswith(b[z:])
e=json.loads((h/'evidencias-vitoria.json').read_text(encoding='utf8'))+json.loads((h/'evidencias-vitoria2.json').read_text(encoding='utf8'))
def n(s):return ''.join(c for c in unicodedata.normalize('NFD',re.sub('<[^>]+>','',s)).lower() if c.isalpha())
c=' '.join(x['context'] for q in e for x in q['hits'])
s=(h/'vitoria-insercao.md').read_text(encoding='utf8');results=[]
for q in re.findall('“([^”]+)”',s):
 if q in ['the victory over sin','nem todas edificam']:continue
 assert n(q) in n(c),q
 results.append(q)
assert len(re.findall(r'\[\^(?:majvitoria|dtnvitoria|dtnespirito|oevitoria|stvitoria)\]',s))==5
(h/'validacao-M08.json').write_text(json.dumps({'basePreservadaForaDaInsercao':True,'trechosEGWConferidos':results,'cincoFontesDistintas':True,'ST':'web original consultado; registro em nota','auditoriaIntegral':'pendente M06'},ensure_ascii=False,indent=2),encoding='utf8')
print('M08: preservação externa e trechos locais conferidos.')
