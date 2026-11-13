"""Inspeção delimitada de páginas já localizadas; não executa nova busca."""
from pathlib import Path
import sys, json, hashlib
import pypdfium2 as pdfium

repo = Path(__file__).resolve().parents[5]
library = Path(sys.argv[1]).resolve()
pdf = library / "pt-br/livros/profetas-e-reis/per.pdf"
draft = repo / "_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md"
out = Path(__file__).with_name("egw-ester-identidade-paginas.json")
if out.exists():
    raise SystemExit("Relatório já existe; revisar antes de reexecutar.")
assert pdf.is_file() and draft.is_file()
digest = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
before = {"pdf": digest(pdf), "draft": digest(draft)}
doc = pdfium.PdfDocument(str(pdf))
pages = []
for index in (0, 1, 2, 396):
    assert index < len(doc)
    page = doc[index]
    textpage = page.get_textpage()
    text = textpage.get_text_range()
    pages.append({"physical_page": index + 1, "text": text})
    textpage.close()
    page.close()
metadata = doc.get_metadata_dict()
total = len(doc)
doc.close()
after = {"pdf": digest(pdf), "draft": digest(draft)}
assert before == after, "Fonte ou draft mudou durante inspeção."
result = {"schema": "ft112-egw-targeted-pages/v1", "source": "pt-br/livros/profetas-e-reis/per.pdf", "metadata": metadata, "total_pages": total, "pages": pages, "hashes_before": before, "hashes_after": after, "scope": "Somente frontispício e página física397 já localizada; não altera status do mecanismo oficial automaticamente."}
out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"report": out.name, "physical_pages": [p["physical_page"] for p in pages], "hashes_unchanged": before == after}, ensure_ascii=False))
