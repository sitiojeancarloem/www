#!/usr/bin/env python3
"""Localiza evidências EGW em EPUB/PDF sem modificar a biblioteca consultada."""

from __future__ import annotations

import argparse
import difflib
import html
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import sys
import unicodedata
import zipfile
import xml.etree.ElementTree as ET


EXIT_BY_STATUS = {"located": 0, "confirmed": 0, "divergent": 2, "ambiguous": 2, "absent": 2, "unavailable": 3}


EPUB_MAX_MEMBER_BYTES = 8 * 1024 * 1024
EPUB_MAX_TOTAL_BYTES = 64 * 1024 * 1024
EPUB_MAX_ENTRIES = 4096
PDF_MAX_FILE_BYTES = 64 * 1024 * 1024


class PdfLimitError(ValueError):
    """PDF ultrapassa orçamento de leitura."""



class EpubLimitError(ValueError):
    """EPUB ultrapassa orçamento de leitura descomprimida."""


class TextExtractor(HTMLParser):
    """Extrai texto visível de XHTML sem dependência externa."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.ignored = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() in {"script", "style", "svg"}:
            self.ignored += 1

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() in {"script", "style", "svg"} and self.ignored:
            self.ignored -= 1
        if tag.lower() in {"p", "div", "li", "br", "h1", "h2", "h3", "blockquote"}:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if not self.ignored:
            self.parts.append(data)

    def text(self) -> str:
        return clean_text("".join(self.parts))


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


def normalize(value: str) -> str:
    decomposed = unicodedata.normalize("NFKD", value)
    ascii_like = "".join(char for char in decomposed if not unicodedata.combining(char))
    return re.sub(r"[^\w]+", " ", ascii_like.casefold(), flags=re.UNICODE).strip()


def relative_path(path: Path, root: Path) -> str:
    return path.resolve().relative_to(root.resolve()).as_posix()


def extract_context(text: str, start: int, end: int, radius: int) -> str:
    return clean_text(text[max(0, start - radius): min(len(text), end + radius)])


def best_match(text: str, query: str, tolerance: float) -> tuple[int, int, float, str] | None:
    normalized_query = normalize(query)
    if not normalized_query:
        return None
    normalized_text = normalize(text)
    exact = normalized_text.find(normalized_query)
    if exact >= 0:
        # The normalized offset is sufficient for deterministic context discovery;
        # retain source text rather than presenting normalized evidence.
        ratio = len(text) / max(1, len(normalized_text))
        start = min(len(text), int(exact * ratio))
        end = min(len(text), max(start + 1, int((exact + len(normalized_query)) * ratio)))
        return start, end, 1.0, "normalized-exact"
    if tolerance <= 0:
        return None
    words = normalized_text.split()
    query_words = normalized_query.split()
    if not words or not query_words:
        return None
    threshold = 1.0 - tolerance
    best: tuple[float, str] | None = None
    window_size = len(query_words)
    for size in range(max(1, window_size - 2), window_size + 3):
        for index in range(0, max(0, len(words) - size + 1)):
            candidate = " ".join(words[index:index + size])
            score = difflib.SequenceMatcher(None, normalized_query, candidate).ratio()
            if score >= threshold and (best is None or score > best[0]):
                best = (score, candidate)
    if best is None:
        return None
    source_normalized = normalize(text)
    offset = source_normalized.find(best[1])
    ratio = len(text) / max(1, len(source_normalized))
    start = min(len(text), max(0, int(offset * ratio)))
    end = min(len(text), max(start + 1, int((offset + len(best[1])) * ratio)))
    return start, end, best[0], "fuzzy-window"


def epub_documents(path: Path) -> tuple[dict[str, str], list[tuple[str, str]]]:
    metadata = {"title": path.stem, "language": ""}
    with zipfile.ZipFile(path) as archive:
        entries = archive.infolist()
        if (len(entries) > EPUB_MAX_ENTRIES
                or any(entry.file_size > EPUB_MAX_MEMBER_BYTES for entry in entries)
                or sum(entry.file_size for entry in entries) > EPUB_MAX_TOTAL_BYTES):
            raise EpubLimitError("EPUB_LIMIT_EXCEEDED")
        names = set(archive.namelist())
        opf_path = ""
        if "META-INF/container.xml" in names:
            container = ET.fromstring(archive.read("META-INF/container.xml"))
            rootfile = container.find(".//{*}rootfile")
            if rootfile is not None:
                opf_path = rootfile.attrib.get("full-path", "")
        ordered: list[str] = []
        if opf_path and opf_path in names:
            opf = ET.fromstring(archive.read(opf_path))
            title = opf.find(".//{http://purl.org/dc/elements/1.1/}title")
            language = opf.find(".//{http://purl.org/dc/elements/1.1/}language")
            metadata["title"] = clean_text(title.text or "") if title is not None else path.stem
            metadata["language"] = clean_text(language.text or "") if language is not None else ""
            manifest = {item.attrib.get("id", ""): item.attrib.get("href", "") for item in opf.findall(".//{*}manifest/{*}item")}
            base = Path(opf_path).parent
            for itemref in opf.findall(".//{*}spine/{*}itemref"):
                href = manifest.get(itemref.attrib.get("idref", ""), "")
                if href:
                    ordered.append((base / href).as_posix())
        if not ordered:
            ordered = sorted(name for name in names if name.lower().endswith((".xhtml", ".html", ".htm")))
        documents: list[tuple[str, str]] = []
        for name in dict.fromkeys(ordered):
            if name not in names:
                continue
            parser = TextExtractor()
            parser.feed(archive.read(name).decode("utf-8", errors="replace"))
            extracted = parser.text()
            if extracted:
                documents.append((name, extracted))
        return metadata, documents


def pdf_documents(path: Path) -> tuple[dict[str, str], list[tuple[int, str]]]:
    if path.stat().st_size > PDF_MAX_FILE_BYTES:
        raise PdfLimitError("PDF_LIMIT_EXCEEDED")
    if os.environ.get("EGW_DISABLE_PDF_ENGINE") == "1":
        raise ModuleNotFoundError("pypdfium2 disabled for validation")
    import pypdfium2  # type: ignore[import-not-found]

    document = pypdfium2.PdfDocument(str(path))
    metadata: dict[str, str] = {"title": path.stem, "language": ""}
    try:
        get_metadata = getattr(document, "get_metadata", None)
        if get_metadata:
            meta = get_metadata()
            if isinstance(meta, dict):
                if "language" in meta and meta["language"]:
                    metadata["language"] = str(meta["language"])
                if "title" in meta and meta["title"]:
                    metadata["title"] = str(meta["title"])
        get_title = getattr(document, "get_title", None)
        if get_title:
            title = get_title()
            if title:
                metadata["title"] = str(title)
        pages: list[tuple[int, str]] = []
        for index in range(len(document)):
            page = document[index]
            text_page = page.get_textpage()
            try:
                text = clean_text(text_page.get_text_range())
            finally:
                close = getattr(text_page, "close", None)
                if close:
                    close()
                close = getattr(page, "close", None)
                if close:
                    close()
            pages.append((index + 1, text))
    finally:
        close = getattr(document, "close", None)
        if close:
            close()
    return metadata, pages


def book_key(path: Path) -> str:
    return normalize(re.sub(r"(?:[_\-. ](?:pt|en|es|fr|de|br)){1,2}$", "", path.stem, flags=re.IGNORECASE))


def matches_filters(path: Path, metadata: dict[str, str], language: str, title: str, acronym: str) -> bool:
    identity = normalize(" ".join([path.as_posix(), metadata.get("title", ""), metadata.get("language", "")]))
    return all(not value or normalize(value) in identity for value in (language, title, acronym))


def occurrence(path: Path, root: Path, fmt: str, location: str, text: str, query: str, tolerance: float, context: int, title: str, language: str) -> dict[str, object] | None:
    match = best_match(text, query, tolerance)
    if match is None:
        return None
    start, end, score, method = match
    result: dict[str, object] = {
        "format": fmt,
        "path": relative_path(path, root),
        "bookKey": book_key(path),
        "title": title or path.stem,
        "language": language,
        "location": location,
        "context": extract_context(text, start, end, context),
        "method": method,
        "score": round(score, 6),
    }
    if fmt == "pdf":
        result["page"] = int(location)
    return result


def run(args: argparse.Namespace) -> tuple[dict[str, object], int]:
    root = Path(args.library_root).expanduser()
    formats = tuple(item.strip().lower() for item in args.formats.split(",") if item.strip())
    diagnostics: dict[str, object] = {"formatsRequested": list(formats), "filesConsidered": 0, "filesRead": 0, "limits": {"files": args.max_files, "results": args.limit, "context": args.context}, "warnings": []}
    base: dict[str, object] = {"schema": "jcem-egw-source-verification/v1", "query": args.query, "filters": {"language": args.language, "title": args.title, "acronym": args.acronym, "tolerance": args.tolerance}, "status": "unavailable", "occurrences": [], "diagnostics": diagnostics}
    if not root.is_dir():
        diagnostics["warnings"].append("LIBRARY_ROOT_UNAVAILABLE")
        return base, EXIT_BY_STATUS["unavailable"]
    invalid = [fmt for fmt in formats if fmt not in {"epub", "pdf"}]
    if not formats or invalid:
        diagnostics["warnings"].append("FORMAT_UNSUPPORTED")
        return base, EXIT_BY_STATUS["unavailable"]
    files = sorted(path for path in root.rglob("*") if path.is_file() and path.suffix.lower().lstrip(".") in formats)
    diagnostics["filesConsidered"] = len(files)
    found: list[dict[str, object]] = []
    pdf_unavailable = False
    paired_pdf_keys: set[str] = set()
    read_pdf_keys: set[str] = set()
    pdf_metadata_by_key: dict[str, dict[str, str]] = {}
    for path in files:
        if int(diagnostics["filesRead"]) >= args.max_files:
            break
        fmt = path.suffix.lower().lstrip(".")
        metadata = {"title": path.stem, "language": ""}
        try:
            if fmt == "epub":
                metadata, documents = epub_documents(path)
                if not matches_filters(path, metadata, args.language, args.title, args.acronym):
                    continue
                diagnostics["filesRead"] = int(diagnostics["filesRead"]) + 1
                for location, text in documents:
                    item = occurrence(path, root, fmt, location, text, args.query, args.tolerance, args.context, metadata["title"], metadata["language"])
                    if item:
                        found.append(item)
            else:
                if not matches_filters(path, metadata, args.language, args.title, args.acronym):
                    continue
                paired_pdf_keys.add(book_key(path))
                pdf_metadata, pages = pdf_documents(path)
                read_pdf_keys.add(book_key(path))
                pdf_metadata_by_key[book_key(path)] = pdf_metadata
                diagnostics["filesRead"] = int(diagnostics["filesRead"]) + 1
                for page, text in pages:
                    item = occurrence(path, root, fmt, str(page), text, args.query, args.tolerance, args.context, pdf_metadata["title"], pdf_metadata["language"])
                    if item:
                        found.append(item)
        except EpubLimitError:
            diagnostics["warnings"].append("EPUB_LIMIT_EXCEEDED")
            return base, EXIT_BY_STATUS["unavailable"]
        except PdfLimitError:
            diagnostics["warnings"].append("PDF_LIMIT_EXCEEDED")
            return base, EXIT_BY_STATUS["unavailable"]
        except ModuleNotFoundError:
            pdf_unavailable = True
            diagnostics["warnings"].append("PDF_ENGINE_UNAVAILABLE")
        except (OSError, ValueError, zipfile.BadZipFile, ET.ParseError) as error:
            diagnostics["warnings"].append(f"SOURCE_UNREADABLE:{relative_path(path, root)}:{type(error).__name__}")
    found = sorted(found, key=lambda item: (-float(item["score"]), str(item["path"]), str(item["location"])))
    epub_keys = {str(item["bookKey"]) for item in found if item["format"] == "epub"}
    pdf_keys = {str(item["bookKey"]) for item in found if item["format"] == "pdf"}
    # confirmed exige identidade verificável: mesmo bookKey, language não vazio e título coincidente
    epub_items_by_key: dict[str, list[dict[str, object]]] = {}
    pdf_items_by_key: dict[str, list[dict[str, object]]] = {}
    for item in found:
        key = str(item["bookKey"])
        if item["format"] == "epub":
            epub_items_by_key.setdefault(key, []).append(item)
        else:
            pdf_items_by_key.setdefault(key, []).append(item)
    confirmed = []
    for key in epub_keys & pdf_keys:
        epub_candidates = epub_items_by_key.get(key, [])
        pdf_candidates = pdf_items_by_key.get(key, [])
        for epub_item in epub_candidates:
            epub_language = epub_item.get("language", "")
            epub_title = epub_item.get("title", "")
            for pdf_item in pdf_candidates:
                pdf_language = pdf_item.get("language", "")
                pdf_title = pdf_item.get("title", "")
                # identidade verificável: language não vazio no PDF e título coincidente
                if epub_item.get("method") != "fuzzy-window" and pdf_item.get("method") != "fuzzy-window" and epub_language and pdf_language and epub_language == pdf_language and epub_title and pdf_title and normalize(epub_title) == normalize(pdf_title):
                    if key not in confirmed:
                        confirmed.append(key)
                    break
            else:
                continue
            break
    confirmed = sorted(confirmed)
    selected: list[dict[str, object]] = []
    if args.cross_check:
        for key in confirmed:
            for fmt in ("epub", "pdf"):
                item = next((candidate for candidate in found if str(candidate["bookKey"]) == key and candidate["format"] == fmt), None)
                if item and item not in selected:
                    selected.append(item)
    selected.extend(item for item in found if item not in selected)
    base["occurrences"] = selected[:args.limit]
    cross = {"requested": bool(args.cross_check), "confirmedBookKeys": confirmed, "pdfPages": sorted({int(item["page"]) for item in found if item["format"] == "pdf" and str(item["bookKey"]) in confirmed})}
    base["crossCheck"] = cross
    if args.cross_check and pdf_unavailable and "pdf" in formats:
        status = "unavailable"
    elif confirmed and args.cross_check:
        status = "confirmed"
    elif args.cross_check and epub_keys & pdf_keys:
        status = "ambiguous"
    elif args.cross_check and epub_keys and any(key in read_pdf_keys or key in paired_pdf_keys for key in epub_keys):
        # Ausência textual só diverge de uma edição com identidade comprovada.
        verified_identity = any(
            item.get("language") and meta.get("language")
            and item["language"] == meta["language"]
            and item.get("title") and meta.get("title")
            and normalize(str(item["title"])) == normalize(str(meta["title"]))
            for key in epub_keys & read_pdf_keys
            for item in epub_items_by_key.get(key, [])
            for meta in [pdf_metadata_by_key.get(key, {})]
        )
        status = "divergent" if verified_identity else "ambiguous"
    elif len({str(item["bookKey"]) for item in found}) > 1 and len(found) > 1 and float(found[0]["score"]) == float(found[1]["score"]):
        status = "ambiguous"
    elif found:
        status = "located"
    elif pdf_unavailable and set(formats) == {"pdf"}:
        status = "unavailable"
    else:
        status = "absent"
    base["status"] = status
    diagnostics["warnings"] = sorted(set(diagnostics["warnings"]))
    return base, EXIT_BY_STATUS[status]


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--library-root", required=True)
    parser.add_argument("--query", required=True)
    parser.add_argument("--language", default="")
    parser.add_argument("--title", default="")
    parser.add_argument("--acronym", default="")
    parser.add_argument("--formats", default="epub,pdf")
    parser.add_argument("--cross-check", action="store_true")
    parser.add_argument("--tolerance", type=float, default=0.0)
    parser.add_argument("--context", type=int, default=180)
    parser.add_argument("--limit", type=int, default=10)
    parser.add_argument("--max-files", type=int, default=1000)
    parser.add_argument("--pretty", action="store_true")
    args = parser.parse_args(argv)
    if not 0 <= args.tolerance <= 0.35:
        parser.error("--tolerance deve estar entre 0 e 0.35")
    if args.context < 0 or args.limit < 1 or args.max_files < 1:
        parser.error("limites devem ser positivos")
    return args


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv if argv is not None else sys.argv[1:])
    result, exit_code = run(args)
    print(json.dumps(result, ensure_ascii=False, indent=2 if args.pretty else None, sort_keys=True))
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
