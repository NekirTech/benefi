import os
from PIL import Image, ImageOps
from pillow_heif import register_heif_opener

register_heif_opener()



def convert_heic_to_webp(input_path, output_path, size=100):
    # Load HEIC file
    im = Image.open(input_path)  # do whatever need with a Pillow image
    #im = im.rotate(13)
    #im.save(f"rotated_image.webp", format="WEBP")
    # Set the DPI (PPI)

    im.thumbnail((size, size))
    im.save(output_path, format="WEBP")
    # Save as WEBP
    #im.save(output_path, format="WEBP")

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
            output_path = os.path.join(output_dir, os.path.splitext(filename)[0] + '.webp')
            convert_heic_to_webp(input_path, output_path, ppi)
            print(f"Converted {filename} to {output_path}")

# Example usage
input_directory = "/Users/felix/Local/benefi/helper_skripts/image_converter/input"
output_directory = locales="/Users/felix/Local/benefi/public/menu_pics"
convert_directory(input_directory, output_directory)
