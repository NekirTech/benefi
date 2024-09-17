import os
from PIL import Image, ImageOps
from pillow_heif import register_heif_opener

register_heif_opener()



def convert_heic_to_webp_thumbnai(input_path, output_path, size=100):
    # Load HEIC file
    im = Image.open(input_path)  # do whatever need with a Pillow image
    #im = im.rotate(13)
    #im.save(f"rotated_image.webp", format="WEBP")
    # Set the DPI (PPI)

    im.thumbnail((size, size))
    im.save(output_path, format="WEBP")
    # Save as WEBP
    #im.save(output_path, format="WEBP")

def resize_and_convert_to_webp(input_path, output_path, max_pixels):
    # Öffne das Bild
    with Image.open(input_path) as img:
        # Ursprüngliche Breite und Höhe
        width, height = img.size
        aspect_ratio = width / height

        # Berechne die neuen Dimensionen unter Beibehaltung des Seitenverhältnisses
        if width > height:
            new_width = max_pixels
            new_height = int(max_pixels / aspect_ratio)
        else:
            new_height = max_pixels
            new_width = int(max_pixels * aspect_ratio)

        # Ändere die Größe des Bildes
        img_resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

        # Speichere das Bild im WEBP-Format
        img_resized.save(output_path, format="WEBP")
        print(f"Bild erfolgreich nach {output_path} konvertiert.")


def convert_directory(input_dir, output_dir, ppi=72):
    # Ensure output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Iterate over files in the input directory
    for filename in os.listdir(input_dir):
        if filename == ".DS_Store":
            print("skipped DS_Store")
            continue
        if True: #filename.lower().endswith(".heic"):
            input_path = os.path.join(input_dir, filename)
            output_path_small = os.path.join(output_dir, os.path.splitext(filename)[0] + '_small.webp')
            output_path_large = os.path.join(output_dir, os.path.splitext(filename)[0] + '_large.webp')
            convert_heic_to_webp_thumbnai(input_path, output_path_small, ppi)
            resize_and_convert_to_webp(input_path, output_path_large, ppi*4)
            print(f"Converted {filename} to {output_path_large}")

# Example usage
input_directory = "/Users/felix/Local/benefi/helper_skripts/image_converter/input"
output_directory = locales="/Users/felix/Local/benefi/public/menu_pics"
convert_directory(input_directory, output_directory)
