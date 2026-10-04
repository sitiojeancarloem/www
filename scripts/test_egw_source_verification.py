#!/usr/bin/env python3
"""Testes focados da Skill de verificação EGW, sem dependências externas."""

from __future__ import annotations

import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import textwrap
import zipfile


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / ".ia.rules/local/skills/egw-source-verification/scripts/egw_source_verification.py"


def make_epub(path: Path, title: str, body: str) -> None:
    container = '<?xml version="1.0"?><container xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf"/></rootfiles></container>'
    opf = f'''<?xml version="1.0"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>{title}</dc:title><dc:language>pt</dc:language></metadata><manifest><item id="c1" href="c1.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="c1"/></spine></package>'''
    with zipfile.ZipFile(path, "w") as archive:
        archive.writestr("META-INF/container.xml", container)
        archive.writestr("OEBPS/content.opf", opf)
        archive.writestr("OEBPS/c1.xhtml", f"<html><body><p>{body}</p></body></html>")


def fake_pdf_engine(directory: Path) -> None:
    (directory / "pypdfium2.py").write_text(textwrap.dedent('''
        class TextPage:
            def __init__(self, text): self.text = text
            def get_text_range(self): return self.text
            def close(self): pass
        class Page:
            def __init__(self, text): self.text = text
            def get_textpage(self): return TextPage(self.text)
            def close(self): pass
        class PdfDocument:
            def __init__(self, path):
                self.pages = open(path, encoding="utf-8").read().split("\\f")
            def get_metadata(self):
                if __import__("os").environ.get("EGW_TEST_NO_METADATA") == "1":
                    return {}
                return {"title": "Caminho a Cristo", "language": "pt"}
            def __len__(self): return len(self.pages)
            def __getitem__(self, index): return Page(self.pages[index])
            def close(self): pass
    '''), encoding="utf-8")


def invoke(root: Path, query: str, *extra: str, env: dict[str, str] | None = None) -> tuple[int, dict]:
    command = [sys.executable, str(SCRIPT), "--library-root", str(root), "--query", query, *extra]
    child_env = dict(env or os.environ)
    child_env["PYTHONUTF8"] = "1"
    completed = subprocess.run(command, check=False, capture_output=True, text=True, encoding="utf-8", env=child_env)
    if not completed.stdout:
        raise AssertionError(completed.stderr)
    return completed.returncode, json.loads(completed.stdout)


def main() -> int:
    with tempfile.TemporaryDirectory(prefix="egw-skill-") as temporary:
        root = Path(temporary)
        make_epub(root / "caminho_a_cristo.epub", "Caminho a Cristo", "A fé vê além das dificuldades e conserva a esperança viva.")
        (root / "caminho_a_cristo.pdf").write_text("Prefácio sem ocorrência.\fA fe ve alem das dificuldades e conserva a esperanca viva.", encoding="utf-8")
        make_epub(root / "outra_obra.epub", "Outra Obra", "A fé vê além das dificuldades e conserva a esperança viva.")
        fake_modules = root / "modules"
        fake_modules.mkdir()
        fake_pdf_engine(fake_modules)
        env = os.environ.copy()
        env["PYTHONPATH"] = str(fake_modules)

        code, result = invoke(root, "A fé vê além das dificuldades", "--formats", "epub", "--title", "Caminho", "--context", "24")
        assert code == 0 and result["status"] == "located"
        assert result["occurrences"][0]["path"] == "caminho_a_cristo.epub"
        assert "esperança" in result["occurrences"][0]["context"]

        code, result = invoke(root, "A fé vê além das dificuldades", "--formats", "epub,pdf", "--title", "caminho", "--cross-check", env=env)
        assert code == 0 and result["status"] == "confirmed"
        assert result["crossCheck"]["pdfPages"] == [2]

        missing_metadata = env.copy()
        missing_metadata["EGW_TEST_NO_METADATA"] = "1"
        code, result = invoke(root, "A fé vê além das dificuldades", "--formats", "epub,pdf", "--title", "caminho", "--cross-check", env=missing_metadata)
        assert code == 2 and result["status"] == "ambiguous"
        assert result["crossCheck"]["confirmedBookKeys"] == []

        code, result = invoke(root, "A fé olha além das dificuldade", "--formats", "epub", "--title", "Caminho", "--tolerance", "0.25")
        assert code == 0 and result["occurrences"][0]["method"] == "fuzzy-window"

        # Aproximação isolada não comprova confirmação entre formatos.
        code, result = invoke(root, "A fé olha além das dificuldade", "--formats", "epub,pdf", "--title", "Caminho", "--tolerance", "0.25", "--cross-check", env=env)
        assert code == 2 and result["status"] == "ambiguous"
        assert result["crossCheck"]["confirmedBookKeys"] == []

        code, result = invoke(root, "texto inexistente", "--formats", "epub")
        assert code == 2 and result["status"] == "absent"

        code, result = invoke(root, "A fé vê além das dificuldades", "--formats", "epub", "--title", "Caminho", "--limit", "1")
        assert code == 0 and len(result["occurrences"]) == 1

        disabled = env.copy()
        disabled["EGW_DISABLE_PDF_ENGINE"] = "1"
        code, result = invoke(root, "A fé vê além das dificuldades", "--formats", "epub,pdf", "--title", "caminho", "--cross-check", env=disabled)
        assert code == 3 and result["status"] == "unavailable"
        assert "PDF_ENGINE_UNAVAILABLE" in result["diagnostics"]["warnings"]

        (root / "caminho_a_cristo.pdf").write_text("PDF correspondente sem o trecho procurado.", encoding="utf-8")
        code, result = invoke(root, "A fé vê além das dificuldades", "--formats", "epub,pdf", "--title", "caminho", "--cross-check", env=env)
        assert code == 2 and result["status"] == "divergent"

        # PDF sem trecho e sem identidade não prova divergência entre edições.
        code, result = invoke(root, "A fé vê além das dificuldades", "--formats", "epub,pdf", "--title", "caminho", "--cross-check", env=missing_metadata)
        assert code == 2 and result["status"] == "ambiguous"
        assert result["crossCheck"]["confirmedBookKeys"] == []

        code, result = invoke(root, "A fé vê além das dificuldades", "--formats", "epub")
        assert code == 2 and result["status"] == "ambiguous"

    print("EGW_SOURCE_VERIFICATION_OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
