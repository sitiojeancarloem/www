"""Invariantes documentais atuais; não substitui juízo editorial do supervisor."""
from pathlib import Path
import hashlib,json,re,difflib
h=Path(__file__).parent; repo=h.parents[3]
p=repo/'_drafts/carta-aberta-hierarquia-romanda-na-igreja';raw=p.read_bytes();t=raw.decode('utf8')
b=(h/'base-autoral-ff9f255678.md').read_text(encoding='utf8')
assert t.split('-->',1)[0]==b.split('-->',1)[0], 'Cabeçalho diferente'
body=re.sub(r'<!--.*?-->','',t,flags=re.S);prose=body.split('\n[^',1)[0]
defs=re.findall(r'^\[\^([a-zA-Z0-9]+)\]:',body,re.M)
calls=re.findall(r'\[\^([a-zA-Z0-9]+)\]',prose)
assert len(defs)==len(set(defs))
assert set(defs)==set(calls)
assert defs==list(dict.fromkeys(calls)), 'Ordem das notas'
assert body.count('<u>')==body.count('</u>')
assert all(len(re.sub('<[^>]+>','',x).split())<=8 for x in re.findall(r'\*\*(.+?)\*\*',prose))
checks={
 'vitoria': ['vitória sobre o pecado','NÃO pressupõe pós-lapsarianismo','Essa cronologia não está em julgamento aqui.'],
 'visao':['Todos os rostos **empalideceram**','Estão as minhas vestes sem mancha?','cessaram de cantar','terrível silêncio','mãos limpas e coração puro','Minha graça vos basta','alegria','tornaram a cantar'],
 'hipotese':['AINDA QUE, <u>HIPOTETICAMENTE</u>','AINDA nesse cenário HIPOTÉTICO','não estou provando nem refutando a hipótese','antes da transformação e do arrebatamento'],
 'continuidade':['nem todas edificam','segunda milha','Dia da Expiação'],
 'argumentos':['Acã','Acabe','bombeiro','hemorragia','CNPJ','Babilônia','sete dias','doze meses','Daniel 12','3ª Guerra'],
 'subcitacoes':['Carta 184, 1901','Testemunhos Para a Igreja 3:257 (1873).','The S.D.A. Bible Commentary 4:1161']
}
for group,terms in checks.items():
 for term in terms:assert term.casefold() in body.casefold(),group+': '+term
assert not re.search(r'\[TODO\]|\b(?:PLACEHOLDER|INSERIR REFERÊNCIA)\b',body)
sha=hashlib.sha256(raw).hexdigest()
for name in ['validacao-render.json','validacao-citacoes-atual.json']:
 data=json.loads((h/name).read_text(encoding='utf8'));assert data['sha256_draft']==sha,name+' desatualizado'
assert not json.loads((h/'validacao-citacoes-atual.json').read_text(encoding='utf8'))['divergencias']
baseprose=re.sub(r'<!--.*?-->','',b,flags=re.S).split('\n[^',1)[0]
baseparagraphs=[x.strip() for x in baseprose.split('\n\n') if x.strip()]
result={'sha256_draft':sha,'base_autoral':'ff9f255678','cabecalho_preservado':True,'notas':len(defs),'chamadas':len(calls),'notas_sem_chamada':0,'ordem_primeira_chamada':True,'grupos_documentais':checks,'paragrafos_base_exatos_conservados':sum(x in prose for x in baseparagraphs),'paragrafos_base':len(baseparagraphs),'criterio':'Asserções de presença e estrutura não provam equivalência semântica. Cobertura editorial e correções descritas em historico-retomada.md e relatorio.md; base atual prevalece sobre versões anteriores.','testes_existentes':{'scripts/test_footnotes.rb':'footnotes=ok; exit 0','scripts/test_quote_semantics.rb':'quote_semantics=ok; exit 0'}}
(h/'auditoria-final.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({k:v for k,v in result.items() if k not in ['grupos_documentais','criterio']},ensure_ascii=False))
