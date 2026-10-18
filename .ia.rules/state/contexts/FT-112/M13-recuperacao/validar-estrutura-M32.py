"""Checagem lexical dirigida; não substitui validação Markdown/DOM da carta."""
from pathlib import Path
import json, re, hashlib
here = Path(__file__).resolve().parent
repo = here.parents[4]
draft = repo / '_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md'
s = draft.read_text(encoding='utf-8')
calls = re.findall(r'\[\^([^\]]+)\](?!:)', s)
defs = re.findall(r'^\[\^([^\]]+)\]:', s, re.M)
missing = sorted(set(calls) - set(defs))
unused = sorted(set(defs) - set(calls))
duplicates = sorted({i for i in defs if defs.count(i) > 1})
pending = [{'line': i, 'excerpt': l[:180]} for i, l in enumerate(s.splitlines(), 1) if re.search(r'<(?:adicion|repet|reforc|\*\*NOTA)', l, re.I)]
ok = not (missing or unused or duplicates or pending)
report = {'schema': 'ft112-lexical-notes/v1', 'status': 'passed' if ok else 'failed', 'draft_sha256': hashlib.sha256(draft.read_bytes()).hexdigest(), 'calls': len(calls), 'definitions': len(defs), 'missing': missing, 'unused': unused, 'duplicates': duplicates, 'remaining_instructions': pending, 'limit': 'Checagem lexical, sem comprovação de renderização, acessibilidade, exatidão das citações ou completude do pedido.'}
(here / 'validacao-estrutura-M32.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps(report, ensure_ascii=False))
raise SystemExit(0 if ok else 2)
