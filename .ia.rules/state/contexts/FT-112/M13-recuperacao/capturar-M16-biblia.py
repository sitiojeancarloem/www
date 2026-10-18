"""FT112: captura delimitada; reutiliza evidências bíblicas existentes e preserva resultados parciais."""
from pathlib import Path
import urllib.request, re, html, json, hashlib, sys
here = Path(__file__).resolve().parent
base = here.parent
repo = here.parents[4]
draft = repo / "_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md"
profiles = {
    "M16": ("biblia-M16-abertura.json", ("gl/2", "mt/18", "jo/16", "2sm/6", "1cr/13", "1cr/15", "1tm/5")),
    "M17": ("biblia-M17-correcao.json", ("2tm/3", "2tm/4", "lv/19", "pv/27", "lc/17", "at/2")),
    "M18": ("biblia-M18-autoexame.json", ("gl/6", "1co/11", "2co/13", "lm/3", "sl/139", "jo/10")),
    "M19": ("biblia-M19-julgamento.json", ("pv/14", "mt/10", "jo/7", "1co/2", "1co/5", "1co/6", "mt/7", "lc/6", "rm/14", "1co/4", "tg/4")),
    "M20": ("biblia-M20-acabe.json", ("1rs/17", "1rs/18", "1rs/19", "1rs/22")),
    "M22": ("biblia-M22-missao-elias.json", ("ml/3", "ml/4", "lc/1", "lc/3", "mt/11", "mt/17", "at/22", "tt/1", "nm/23", "is/43")),
    "M25": ("biblia-M25-muitos-poucos.json", ("mt/7", "lc/13", "mt/22", "is/8", "ez/14", "gn/7", "gn/19", "2pe/2")),
    "M27": ("biblia-M27-carteiro.json", ("mt/21",)),
}
profile = sys.argv[1] if len(sys.argv) > 1 else "M16"
if profile not in profiles:
    raise SystemExit("Perfil não autorizado")
output_name, refs = profiles[profile]
out = here / output_name
prior = json.loads(out.read_text(encoding="utf-8"))
if prior.get("status") != "pending":
    raise SystemExit("Relatório não está pending; aproveitar resultado sem replay.")
digest = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
before = digest(draft)
cache = {}
cache_paths = [base / name for name in ("biblia-evidencias.json", "biblia-retomada.json", "biblia-adicoes.json", "biblia-final.json")]
cache_paths.extend(sorted(here.glob("biblia-M*.json")))
for path in cache_paths:
    if not path.exists(): continue
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict):
        data = data.get("entries", [])
    if not isinstance(data, list): continue
    for item in data:
        if isinstance(item, dict) and item.get("verses") and item.get("ref") and item.get("version"):
            cache[(item["version"].upper(), item["ref"])] = {**item, "evidence_origin": path.relative_to(base).as_posix()}
entries = []
for ref in refs:
    version = "NVI" if profile == "M25" and ref == "ez/14" else "ARA"
    if (version, ref) in cache:
        entries.append(cache[(version, ref)])
        continue
    url = "https://www.bibliaonline.com.br/" + version.lower() + "/" + ref
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
        entries.append({"version": version, "ref": ref, "url": url, "verses": verses, "response_sha256": hashlib.sha256(raw).hexdigest(), "evidence_origin": "network_this_unit"})
    except Exception as exc:
        entries.append({"version": version, "ref": ref, "url": url, "error": str(exc)})
after = digest(draft)
assert before == after, "Draft mudou durante captura"
ok = all(e.get("verses") and not e.get("error") for e in entries)
result = {"schema": "ft112-bible-capture/v1", "status": "captured" if ok else "incomplete", "draft_before": before, "draft_after": after, "entries": entries, "scope": "Textos primários para cotejo; sem conclusão teológica automática"}
out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"status": result["status"], "chapters": [{"ref": e["ref"], "verses": len(e.get("verses", {})), "origin": e.get("evidence_origin"), "error": e.get("error")} for e in entries]}, ensure_ascii=False))
raise SystemExit(0 if ok else 2)
