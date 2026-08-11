"""Gera variantes WebP determinísticas declaradas em config/responsive-images.json."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "config" / "responsive-images.json"
OUTPUT_ROOT = ROOT / "assets" / "images" / "responsive"
DATA_OUTPUT = ROOT / "_data" / "jcem_responsive_images.json"


def main() -> None:
    config = json.loads(CONFIG.read_text(encoding="utf-8"))
    quality = int(config["quality"])
    index: dict[str, dict[str, object]] = {}
    for definition in config["assets"]:
        source = ROOT / definition["source"]
        if not source.is_file():
            raise FileNotFoundError(source)
        target_dir = OUTPUT_ROOT / definition["id"]
        target_dir.mkdir(parents=True, exist_ok=True)
        variants = []
        with Image.open(source) as image:
            image.load()
            width, height = image.size
            for requested in config["widths"]:
                variant_width = min(int(requested), width)
                if any(item["width"] == variant_width for item in variants):
                    continue
                variant_height = round(height * variant_width / width)
                resized = image if variant_width == width else image.resize(
                    (variant_width, variant_height),
                    Image.Resampling.LANCZOS,
                )
                target = target_dir / f"{definition['id']}-{variant_width}w.webp"
                resized.save(
                    target,
                    "WEBP",
                    quality=quality,
                    method=6,
                    lossless=False,
                    exact=True,
                )
                variants.append(
                    {
                        "path": "/" + target.relative_to(ROOT).as_posix(),
                        "width": variant_width,
                        "height": variant_height,
                        "byte_size": target.stat().st_size,
                        "media_type": "image/webp",
                    }
                )
        index[definition["canonical"]] = {
            "source": definition["source"],
            "variants": sorted(variants, key=lambda item: item["width"]),
        }
    DATA_OUTPUT.write_text(
        json.dumps({"schema": 1, "assets": index}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"responsive_images=ok assets={len(index)}")


if __name__ == "__main__":
    main()
