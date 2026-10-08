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
            def count_chars(self): return len(self.text)
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

    with tempfile.TemporaryDirectory(prefix="egw-limit-") as temporary:
        limited_root = Path(temporary)
        oversized = limited_root / "oversized.epub"
        with zipfile.ZipFile(oversized, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            archive.writestr("oversized.xhtml", b"x" * (8 * 1024 * 1024 + 1))
        digest = __import__("hashlib").sha256(oversized.read_bytes()).hexdigest()
        code, result = invoke(limited_root, "texto", "--formats", "epub")
        assert code == 3 and result["status"] == "unavailable"
        assert "EPUB_LIMIT_EXCEEDED" in result["diagnostics"]["warnings"]
        assert digest == __import__("hashlib").sha256(oversized.read_bytes()).hexdigest()


    # Spine repetido: cada XHTML é lido uma vez, na primeira ordem declarada.
    import runpy
    from unittest.mock import patch
    extractor = runpy.run_path(str(Path(__file__).resolve().parents[1] / ".ia.rules/local/skills/egw-source-verification/scripts/egw_source_verification.py"))
    with tempfile.TemporaryDirectory(prefix="egw-spine-") as temporary:
        fixture = Path(temporary) / "repeated.epub"
        with zipfile.ZipFile(fixture, "w") as archive:
            archive.writestr("META-INF/container.xml", '<container><rootfiles><rootfile full-path="book.opf"/></rootfiles></container>')
            archive.writestr("book.opf", '<package><manifest><item id="a" href="a.xhtml"/><item id="b" href="b.xhtml"/></manifest><spine><itemref idref="b"/><itemref idref="a"/><itemref idref="b"/><itemref idref="a"/></spine></package>')
            archive.writestr("a.xhtml", "<p>Primeiro capítulo</p>")
            archive.writestr("b.xhtml", "<p>Segundo capítulo</p>")
        before = fixture.read_bytes()
        reads = []
        original_read = zipfile.ZipFile.read
        def counted_read(archive, name, *args, **kwargs):
            reads.append(name)
            return original_read(archive, name, *args, **kwargs)
        with patch.object(zipfile.ZipFile, "read", counted_read):
            _, documents = extractor["epub_documents"](fixture)
        assert documents == [("b.xhtml", "Segundo capítulo"), ("a.xhtml", "Primeiro capítulo")]
        assert [name for name in reads if name.endswith(".xhtml")] == ["b.xhtml", "a.xhtml"]
        assert fixture.read_bytes() == before


    # PDF acima do orçamento deve ser recusado antes de carregar o mecanismo.
    from types import SimpleNamespace
    oversized_pdf = SimpleNamespace(stat=lambda: SimpleNamespace(st_size=64 * 1024 * 1024 + 1))
    try:
        extractor["pdf_documents"](oversized_pdf)
    except extractor["PdfLimitError"] as error:
        assert str(error) == "PDF_LIMIT_EXCEEDED"
    else:
        raise AssertionError("PDF acima do limite foi aceito")


    # PDF com páginas excessivas é fechado sem extrair nenhuma página.
    from unittest.mock import MagicMock
    import sys
    limited_document = MagicMock()
    limited_document.__len__.return_value = 4097
    oversized_page_engine = SimpleNamespace(PdfDocument=lambda path: limited_document)
    with patch.dict(sys.modules, {"pypdfium2": oversized_page_engine}), patch.dict(os.environ, {"EGW_DISABLE_PDF_ENGINE": "0"}):
        try:
            extractor["pdf_documents"](SimpleNamespace(stat=lambda: SimpleNamespace(st_size=1), stem="fixture"))
        except extractor["PdfLimitError"]:
            pass
        else:
            raise AssertionError("PDF com páginas excessivas foi aceito")
    limited_document.__getitem__.assert_not_called()
    limited_document.close.assert_called_once()


    # Orçamento de texto: recusa antecipada e fronteira inclusiva.
    for char_count, page_count, rejected, reads_expected in [
        (1024 * 1024 + 1, 1, True, 0),
        (1024 * 1024, 9, True, 8),
        (1024 * 1024, 8, False, 8),
    ]:
        budget_text = MagicMock()
        budget_text.count_chars.return_value = char_count
        budget_text.get_text_range.return_value = "texto"
        budget_page = MagicMock()
        budget_page.get_textpage.return_value = budget_text
        budget_document = MagicMock()
        budget_document.__len__.return_value = page_count
        budget_document.__getitem__.return_value = budget_page
        budget_engine = SimpleNamespace(PdfDocument=lambda path: budget_document)
        caught = False
        with patch.dict(sys.modules, {"pypdfium2": budget_engine}), patch.dict(os.environ, {"EGW_DISABLE_PDF_ENGINE": "0"}):
            try:
                extractor["pdf_documents"](SimpleNamespace(stat=lambda: SimpleNamespace(st_size=1), stem="budget"))
            except extractor["PdfLimitError"]:
                caught = True
        assert caught == rejected
        assert budget_text.get_text_range.call_count == reads_expected
        assert budget_text.close.call_count == page_count
        assert budget_page.close.call_count == page_count
        budget_document.close.assert_called_once()

    # Orçamento de texto com count_chars=-1: recusa antecipada sem extração.
    negative_count = MagicMock()
    negative_count.count_chars.return_value = -1
    negative_page = MagicMock()
    negative_page.get_textpage.return_value = negative_count
    negative_document = MagicMock()
    negative_document.__len__.return_value = 1
    negative_document.__getitem__.return_value = negative_page
    negative_engine = SimpleNamespace(PdfDocument=lambda path: negative_document)
    with patch.dict(sys.modules, {"pypdfium2": negative_engine}), patch.dict(os.environ, {"EGW_DISABLE_PDF_ENGINE": "0"}):
        try:
            extractor["pdf_documents"](SimpleNamespace(stat=lambda: SimpleNamespace(st_size=1), stem="negative"))
        except extractor["PdfLimitError"]:
            pass
        else:
            raise AssertionError("PDF com count_chars negativo foi aceito")
    negative_count.count_chars.assert_called_once()
    negative_count.get_text_range.assert_not_called()
    negative_count.close.assert_called_once()
    negative_page.close.assert_called_once()
    negative_document.close.assert_called_once()

    # Orçamento de texto: recusa por limite de caracteres com count_chars positivo.
    limited_chars = MagicMock()
    limited_chars.count_chars.return_value = 1
    limited_chars.get_text_range.return_value = "abcdefghijk"
    limited_page = MagicMock()
    limited_page.get_textpage.return_value = limited_chars
    limited_document = MagicMock()
    limited_document.__len__.return_value = 1
    limited_document.__getitem__.return_value = limited_page
    limited_engine = SimpleNamespace(PdfDocument=lambda path: limited_document)
    with patch.dict(sys.modules, {"pypdfium2": limited_engine}), patch.dict(os.environ, {"EGW_DISABLE_PDF_ENGINE": "0"}), patch.dict(extractor["pdf_documents"].__globals__, {"PDF_MAX_PAGE_CHARS": 10}):
        try:
            extractor["pdf_documents"](SimpleNamespace(stat=lambda: SimpleNamespace(st_size=1), stem="limited_chars"))
        except extractor["PdfLimitError"]:
            pass
        else:
            raise AssertionError("PDF com count_chars=1 e PDF_MAX_PAGE_CHARS=10 foi aceito")
    limited_chars.count_chars.assert_called_once()
    limited_chars.get_text_range.assert_called_once()
    limited_chars.close.assert_called_once()
    limited_page.close.assert_called_once()
    limited_document.close.assert_called_once()

    print("EGW_SOURCE_VERIFICATION_OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
