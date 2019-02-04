import uuid
import numpy as np


class QueueItem:
    def __init__(self, image: np.ndarray, idx: uuid.UUID):
        self.image = image
        self.idx = idx
        self.predictions = {}
