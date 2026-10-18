"""FT112: captura delimitada; reutiliza evidências bíblicas existentes e preserva resultados parciais."""
from pathlib import Path
import urllib.request, re, html, json, hashlib, sys
here = Path(__file__).resolve().parent
base = here.parent
repo = here.parents[4]
draft = repo / "_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md"
out = here / "biblia-M16-abertura.json"
prior = json.loads(out.read_text(encoding="utf-8"))
if prior.get("status") != "pending":
    raise SystemExit("Relatório não está pending; aproveitar resultado sem replay.")
digest = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
before = digest(draft)
cache = {}
for name in ("biblia-evidencias.json", "biblia-retomada.json", "biblia-adicoes.json", "biblia-final.json"):
    path = base / name
    if not path.exists(): continue
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list): continue
    for item in data:
        if isinstance(item, dict) and item.get("verses") and item.get("ref") and item.get("version"):
            cache[(item["version"].upper(), item["ref"])] = {**item, "evidence_origin": name}
refs = ("gl/2", "mt/18", "jo/16", "2sm/6", "1cr/13", "1cr/15", "1tm/5")
entries = []
for ref in refs:
    if ("ARA", ref) in cache:
        entries.append(cache[("ARA", ref)])
        continue
    url = "https://www.bibliaonline.com.br/ara/" + ref
    try:
        request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(request, timeout=30) as response:
            if response.geturl().split("/")[2] not in ("www.bibliaonline.com.br", "bibliaonline.com.br"):
                raise ValueError("Redirecionamento fora do domínio autorizado")
            raw = response.read(4*1024*1024 + 1)
            if len(raw) > 4*1024*1024: raise ValueError("Resposta excede limite")
        text = raw.decode("utf-8")
        verses = {}
        for match in re.finditer(r'<span data-t="\d+"[^>]*>(.*?)</span>', text, re.S):
            previous = list(re.finditer(r'data-v="\.(\d+)\."', text[:match.start()]))
            if previous:
                key = previous[-1][1]
                verses[key] = verses.get(key, "") + html.unescape(re.sub("<[^>]*>", "", match[1]))
        if not verses: raise ValueError("Nenhum versículo extraído")
        entries.append({"version": "ARA", "ref": ref, "url": url, "verses": verses, "response_sha256": hashlib.sha256(raw).hexdigest(), "evidence_origin": "network_this_unit"})
    except Exception as exc:
        entries.append({"version": "ARA", "ref": ref, "url": url, "error": str(exc)})
after = digest(draft)
assert before == after, "Draft mudou durante captura"
ok = all(e.get("verses") and not e.get("error") for e in entries)
result = {"schema": "ft112-bible-capture/v1", "status": "captured" if ok else "incomplete", "draft_before": before, "draft_after": after, "entries": entries, "scope": "Textos primários para cotejo; sem conclusão teológica automática"}
out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"status": result["status"], "chapters": [{"ref": e["ref"], "verses": len(e.get("verses", {})), "origin": e.get("evidence_origin"), "error": e.get("error")} for e in entries]}, ensure_ascii=False))
raise SystemExit(0 if ok else 2)
