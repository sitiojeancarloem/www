#!/usr/bin/env python3
"""Gera uma única derivação WebP por original raster versionado."""

from __future__ import annotations

import hashlib
import io
import json
from datetime import datetime, timezone
from pathlib import Path

try:
    from PIL import Image
except ImportError as error:
    raise SystemExit(
        "TRACKED_WEBP_PILLOW_AUSENTE: instale Pillow no ambiente Python antes da derivacao unica"
    ) from error


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "config" / "tracked-webp.json"
AUTHORIZED_SHARED_SOURCES = (
    Path("assets/jcem/img/e-o-fim-da-rosca-ccbysanc-jcem.png"),
    Path("assets/jcem/img/sem-motor-nao-vai-jcem-ccbysanc.png"),
)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def raster_sources() -> list[Path]:
    sources = [relative for relative in AUTHORIZED_SHARED_SOURCES if (ROOT / relative).is_file()]
    if len(sources) != len(AUTHORIZED_SHARED_SOURCES):
        raise SystemExit("TRACKED_WEBP_FONTE_COMPARTILHADA_AUSENTE")
    return list(AUTHORIZED_SHARED_SOURCES)


def load_manifest() -> dict:
    if not MANIFEST.is_file():
        return {"schema": 1, "encoder": {"name": "Pillow", "format": "WEBP", "quality": 82, "method": 6}, "assets": {}}
    return json.loads(MANIFEST.read_text(encoding="utf-8"))


def encoded_webp(source: Path) -> bytes:
    output = io.BytesIO()
    with Image.open(source) as image:
        if image.width > 16383 or image.height > 16383:
            raise ValueError("TRACKED_WEBP_DIMENSAO_NAO_SUPORTADA")
        image.save(output, "WEBP", quality=82, method=6, exact=True)
    return output.getvalue()


def main() -> None:
    manifest = load_manifest()
    assets = manifest["assets"]
    changed = 0
    for relative in raster_sources():
        source = ROOT / relative
        target_relative = relative.with_name(f"{relative.stem}.jcem.webp")
        target = ROOT / target_relative
        source_hash = digest(source)
        key = relative.as_posix()
        current = assets.get(key)
        if current:
            if current["sourceSha256"] != source_hash or current["sourceBytes"] != source.stat().st_size:
                raise SystemExit(f"TRACKED_WEBP_SOURCE_DIVERGENTE:{key}")
            if current.get("state") == "unsupported-dimensions":
                continue
            if not target.is_file() or digest(target) != current["targetSha256"]:
                raise SystemExit(f"TRACKED_WEBP_TARGET_DIVERGENTE:{target_relative.as_posix()}")
            continue
        if target.exists():
            raise SystemExit(f"TRACKED_WEBP_NAO_GERENCIADO:{target_relative.as_posix()}")
        try:
            encoded = encoded_webp(source)
        except ValueError as error:
            if str(error) == "TRACKED_WEBP_DIMENSAO_NAO_SUPORTADA":
                assets[key] = {
                    "sourceSha256": source_hash,
                    "sourceBytes": source.stat().st_size,
                    "sourceMtimeUtc": datetime.fromtimestamp(source.stat().st_mtime, timezone.utc).isoformat().replace("+00:00", "Z"),
                    "state": "unsupported-dimensions",
                }
                continue
            raise
        target.parent.mkdir(parents=True, exist_ok=True)
        if not target.exists():
            target.write_bytes(encoded)
        source_mtime = datetime.fromtimestamp(source.stat().st_mtime, timezone.utc).isoformat().replace("+00:00", "Z")
        assets[key] = {
            "sourceSha256": source_hash,
            "sourceBytes": source.stat().st_size,
            "sourceMtimeUtc": source_mtime,
            "target": target_relative.as_posix(),
            "targetSha256": digest(target),
            "targetBytes": target.stat().st_size,
            "generatedAtUtc": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        }
        changed += 1
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent="\t") + "\n", encoding="utf-8")
    print(f"tracked_webp=ok assets={len(assets)} changed={changed}")


if __name__ == "__main__":
    main()
