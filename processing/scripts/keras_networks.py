import numpy as np
from skimage.io import imread
from skimage.transform import resize
from keras.applications.imagenet_utils import decode_predictions
from classification_models import Classifiers
from pprint import pprint

from classification_models.resnet import ResNet18, preprocess_input
import os
import time
from keras import backend as K

from tensorflow.python.client import device_lib
print(device_lib.list_local_devices())

#K.set_session(K.tf.Session(config=K.tf.ConfigProto(intra_op_parallelism_threads=1, inter_op_parallelism_threads=1)))


os.environ['KMP_DUPLICATE_LIB_OK']='True'

SIZE = 331
# read and prepare image


x = imread('samoyed.jpg')
x = resize(x, (SIZE, SIZE)) * 255    # cast back to 0-255 range

x = preprocess_input(x)
x = np.expand_dims(x, 0)

# load model
models = []
for name in ['nasnetlarge']:
    classifier, preprocess_input = Classifiers.get(name)
    model = classifier((SIZE, SIZE, 3), weights='imagenet')
    models.append(model)

# processing image
print('processing')
predictions = {}

for _ in range(1):
    y = model.predict(x)

    for model in models:
        begin = time.time()
        for _ in range(16):
            y = model.predict(x)
            results = decode_predictions(y)
        print(time.time() - begin)

        for _ in range(4):
            x = np.vstack((x, x))

        begin = time.time()
        y = model.predict_on_batch(x)
        results = decode_predictions(y)
        print(time.time() - begin)

        pprint(len(results))
#         for result in results:
#             predictions.setdefault(result[1], []).append(result[2])
#
# for k, v in predictions.items():
#     predictions[k] = sum(v) / len(v)
#
# print(predictions)
# print(sorted(predictions.items(), reverse=True, key=lambda x: x[1]))

