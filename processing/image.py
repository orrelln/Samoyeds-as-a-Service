from PIL import Image


def convert(path: str, size: int):
    try:
        image = Image.open(path)
    except IOError:
        return None
    if image.format not in ['JPEG', 'PNG', 'TIFF', 'BMP']:
        return None
    image = image.resize((size, size), Image.ANTIALIAS)
    return image.convert('RGB')
