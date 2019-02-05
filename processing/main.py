import imread
import pika
import os
import base64
import json
from processing.nets import ImageNetNetwork
from processing.determiner import combine_dictionaries, average
from keras import backend as K

K.set_session(K.tf.Session(config=K.tf.ConfigProto(intra_op_parallelism_threads=1, inter_op_parallelism_threads=1)))
os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'


networks = [('seresnet50', 224),('resnet101', 224), ('densenet169', 224), ('mobilenet', 224), ('resnet34', 224)]
image_networks = [ImageNetNetwork(*network) for network in networks]

connection = pika.BlockingConnection(pika.ConnectionParameters(host='127.0.0.1'))
channel = connection.channel()
channel.queue_declare(queue='task_queue', durable=True)
channel.queue_declare(queue='return_queue', durable=True)


def process(ch, method, properties, body):
    data = json.loads(body)
    image = base64.decodebytes(data['image'].encode('utf-8'))
    image = imread.imread_from_blob(image)

    list_predictions = []
    for network in image_networks:
        list_predictions.append(network.classify(image.copy()))
    predictions = average(combine_dictionaries(list_predictions))

    data = {
        'predictions': predictions,
        'idx': data['idx']
    }

    message = json.dumps(data)
    channel.basic_publish(exchange='',
                          routing_key='return_queue',
                          body=message,
                          properties=pika.BasicProperties(
                              delivery_mode=2,  # make message persistent
                          ))

    ch.basic_ack(delivery_tag=method.delivery_tag)


channel.basic_qos(prefetch_count=1)
channel.basic_consume(process, queue='task_queue')

print('===  Listening')

channel.start_consuming()