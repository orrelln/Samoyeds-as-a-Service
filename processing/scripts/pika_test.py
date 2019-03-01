import pika
import logging
import uuid
import json
import base64
import time
import imghdr
from os import walk
import os

images = []
for (dirpath, _, filenames) in walk('shibas/'):
    for filename in filenames:
        if imghdr.what(dirpath + filename) in ['jpeg', 'jpeg', None]:
            images.append('scripts/shibas/' + filename)

#images = ['samoyed.jpg']

MODE = os.getenv('MODE', 'local')

if MODE == 'production':
    HOST = 'rabbitmq-server'
elif MODE == 'testing':
    HOST = 'rabbitmq-server'
else:
    HOST = '127.0.0.1'

begin = time.process_time()



connection = pika.BlockingConnection(pika.ConnectionParameters(HOST))
channel = connection.channel()

channel.queue_declare(queue='task_queue', durable=True)

for image in images:
    data = {
        'path': image,
        'id': str(uuid.uuid4())
    }

    print("===  id: " + data['id'])
    message = json.dumps(data)

    channel.basic_publish(exchange='',
                          routing_key='task_queue',
                          body=message,
                          properties=pika.BasicProperties(
                              delivery_mode=2,  # make message persistent
                          ))
print("===  Sent images from images directory")

connection.close()

print(time.process_time() - begin)
