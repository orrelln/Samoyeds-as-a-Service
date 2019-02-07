import unittest
import numpy as np
from image import convert
import base64
from PIL import Image


class ImageTest(unittest.TestCase):
    IMAGE_SIZE = 224

    @staticmethod
    def path_to_base64(path):
        with open(path, 'rb') as f:
            i = f.read()
        return base64.b64encode(i).decode('utf-8')

    def verify_correct(self, image):
        self.assertIsNotNone(image)
        self.assertIsNone(image.verify())

        np_array = np.array(image)
        self.assertEqual(np_array.shape, (self.IMAGE_SIZE, self.IMAGE_SIZE, 3))

    def test_jpg(self):
        i = self.path_to_base64('samoyed.jpg')
        image = convert(i, self.IMAGE_SIZE)
        image.show()
        self.verify_correct(image)

    def test_png(self):
        i = self.path_to_base64('samoyed.png')
        image = convert(i, self.IMAGE_SIZE)
        image.show()
        self.verify_correct(image)

    def test_tiff(self):
        i = self.path_to_base64('samoyed.tiff')
        image = convert(i, self.IMAGE_SIZE)
        image.show()
        self.verify_correct(image)

    def test_bmp(self):
        i = self.path_to_base64('samoyed.bmp')
        image = convert(i, self.IMAGE_SIZE)
        image.show()
        self.verify_correct(image)

    def test_gif(self):
        i = self.path_to_base64('reject.gif')
        image = convert(i, self.IMAGE_SIZE)
        self.assertIsNone(image)

    def test_broken(self):
        i = self.path_to_base64('broken.jpg')
        image = convert(i, self.IMAGE_SIZE)
        self.assertIsNone(image)

