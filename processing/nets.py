from keras.applications.imagenet_utils import decode_predictions
from classification_models import Classifiers
import numpy as np


class ImageNetNetwork:
    def __init__(self, name: str, size: int):
        classifier, preprocess_input = Classifiers.get(name)
        self.model = classifier((size, size, 3), weights='imagenet')
        self.preprocess_input = preprocess_input
        self.size = size

    def classify(self, image: np.ndarray):
        image = self.preprocess_input(image)
        image = np.expand_dims(image, 0)
        results = decode_predictions(self.model.predict(image))[0]
        return {result[1]: result[2] for result in results}
