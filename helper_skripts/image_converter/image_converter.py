"""Erzeugt die Bilder für die Website aus den Originalfotos in input/.

Für jedes Foto <name>.<heic|jpg|png|…> entstehen in public/menu_pics/:
  <name>_small.webp  quadratisches Vorschaubild für die Menüliste
  <name>_large.webp  großes Bild für die Ansicht beim Antippen
Der Dateiname muss dem Menü-Schlüssel entsprechen (englischer Name, klein,
Leerzeichen -> "_"), damit menu_converter.py das Bild findet.

Außerdem entsteht public/og_image.jpg, das Vorschaubild beim Teilen eines
Links (WhatsApp, Instagram, Google …).

Aufruf aus dem Projektordner:
  pip install -r helper_skripts/image_converter/requirements.txt
  python3 helper_skripts/image_converter/image_converter.py          # nur neue/geänderte Fotos
  python3 helper_skripts/image_converter/image_converter.py --force  # alles neu
"""

import argparse
from pathlib import Path

from PIL import Image, ImageOps
from pillow_heif import register_heif_opener

register_heif_opener()

HERE = Path(__file__).resolve().parent
INPUT_DIR = HERE / "input"
PUBLIC_DIR = HERE.parent.parent / "public"
OUTPUT_DIR = PUBLIC_DIR / "menu_pics"

# Vorschaubild: in der Liste 48 CSS-Pixel groß, scharf bis zu 4-facher Pixeldichte.
THUMB_SIZE = 192
THUMB_QUALITY = 78
# Großes Bild: Dialog ist höchstens ~450 CSS-Pixel breit, scharf bis 2,5-fach.
LARGE_MAX_SIDE = 1200
LARGE_QUALITY = 80

# Link-Vorschau im empfohlenen Format 1200 x 630.
OG_SOURCE = "red_velvet.heic"
OG_SIZE = (1200, 630)
# Ausschnitt etwas oberhalb der Mitte, damit Benefi-Schild und Kuchen drauf sind.
OG_CENTERING = (0.5, 0.3)

EXTENSIONS = {".heic", ".heif", ".jpg", ".jpeg", ".png", ".webp"}


def open_photo(path):
    """Öffnet ein Foto richtig gedreht (Handy-Fotos speichern die Drehung nur in EXIF)."""
    img = ImageOps.exif_transpose(Image.open(path))
    return img.convert("RGB")


def save_webp(img, path, quality):
    # Ohne EXIF speichern: keine Kamera- oder GPS-Daten auf der Website.
    img.save(path, format="WEBP", quality=quality, method=6)


def convert_photo(path):
    img = open_photo(path)

    # Ausschnitt etwas unter der Mitte: auf Hochkant-Fotos steht das Getränk
    # oder der Teller meist im unteren Teil.
    thumb = ImageOps.fit(
        img, (THUMB_SIZE, THUMB_SIZE), Image.Resampling.LANCZOS, centering=(0.5, 0.55)
    )
    save_webp(thumb, OUTPUT_DIR / f"{path.stem}_small.webp", THUMB_QUALITY)

    large = img.copy()
    large.thumbnail((LARGE_MAX_SIDE, LARGE_MAX_SIDE), Image.Resampling.LANCZOS)
    save_webp(large, OUTPUT_DIR / f"{path.stem}_large.webp", LARGE_QUALITY)


def is_up_to_date(path):
    outputs = [OUTPUT_DIR / f"{path.stem}_{size}.webp" for size in ("small", "large")]
    return all(o.exists() and o.stat().st_mtime >= path.stat().st_mtime for o in outputs)


def build_og_image(force):
    source = INPUT_DIR / OG_SOURCE
    target = PUBLIC_DIR / "og_image.jpg"
    if not source.exists():
        print(f"Link-Vorschau übersprungen: {OG_SOURCE} fehlt in input/")
        return
    if not force and target.exists() and target.stat().st_mtime >= source.stat().st_mtime:
        return
    img = ImageOps.fit(open_photo(source), OG_SIZE, Image.Resampling.LANCZOS, centering=OG_CENTERING)
    img.save(target, format="JPEG", quality=82, optimize=True, progressive=True)
    print(f"Link-Vorschau: {target.relative_to(PUBLIC_DIR.parent)}")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--force", action="store_true", help="alle Bilder neu erzeugen")
    args = parser.parse_args()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    photos = sorted(p for p in INPUT_DIR.iterdir() if p.suffix.lower() in EXTENSIONS)
    seen = {}
    converted = skipped = 0
    for path in photos:
        if path.stem in seen:
            print(f"Achtung: {path.name} und {seen[path.stem]} ergeben denselben Namen – {path.name} übersprungen")
            continue
        seen[path.stem] = path.name

        if not args.force and is_up_to_date(path):
            skipped += 1
            continue
        try:
            convert_photo(path)
            converted += 1
            print(f"konvertiert: {path.name}")
        except Exception as error:  # ein kaputtes Foto soll den Rest nicht aufhalten
            print(f"Fehler bei {path.name}: {error}")

    build_og_image(args.force)
    print(f"{converted} konvertiert, {skipped} unverändert")


if __name__ == "__main__":
    main()
