import numpy as np
import base64
import io
from PIL import Image


def convert(base64string: str, size: int):
    image = base64.decodebytes(base64string.encode('utf-8'))
    try:
        image = Image.open(io.BytesIO(image))
    except IOError:
        return None
    if image.format not in ['JPEG', 'PNG', 'TIFF', 'BMP']:
        return None
    image = image.resize((size, size), Image.ANTIALIAS)
    return image.convert('RGB')
