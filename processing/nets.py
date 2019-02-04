import asyncio
from keras.applications.imagenet_utils import decode_predictions
from classification_models import Classifiers
import numpy as np
import time


class ImageNetNetwork:
    def __init__(self, name: str, return_queue: asyncio.Queue, lock: asyncio.Lock):
        classifier, preprocess_input = Classifiers.get(name)
        if name == 'nasnetlarge':
            self.model = classifier((331, 331, 3), weights='imagenet')
        else:
            self.model = classifier((224, 224, 3), weights='imagenet')
        self.preprocess_input = preprocess_input

        self.feed_queue = asyncio.Queue()
        self.return_queue = return_queue
        self.lock = lock

    async def classify(self):
        while True:
            qitem = await self.feed_queue.get()
            await self.lock.acquire()
            image = self.preprocess_input(qitem.image)
            image = np.expand_dims(image, 0)
            begin = time.time()
            results = decode_predictions(self.model.predict(image))[0]
            print(time.time() - begin)
            for result in results:
                qitem.predictions[result[1]] = result[2]

            await self.return_queue.put(qitem)
            await asyncio.sleep(0)
