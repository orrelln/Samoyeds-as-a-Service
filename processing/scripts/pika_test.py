import pika
import logging
import uuid
import json
import base64
import imghdr
from os import walk

# images = []
# for (dirpath, _, filenames) in walk('images/'):
#     for filename in filenames:
#         if imghdr.what(dirpath + filename) in ['jpeg', 'jpeg', None]:
#             with open(dirpath + filename, 'rb') as f:
#                 image = f.read()
#                 images.append((base64.b64encode(image).decode('utf-8'), filename))


f = open("samoyed.jpg", "rb")
i = f.read()
images = [(base64.b64encode(i).decode('utf-8'), 'samoyed.jpg')]

logging.basicConfig()
connection = pika.BlockingConnection(pika.ConnectionParameters('127.0.0.1'))
channel = connection.channel()

print(channel.queue_declare(queue='task_queue', durable=True))

for image in images:
    data = {
        'image': image[0],
        'idx': str(uuid.uuid4())
    }
    message = json.dumps(data)

    channel.basic_publish(exchange='',
                          routing_key='task_queue',
                          body=message,
                          properties=pika.BasicProperties(
                              delivery_mode=2,  # make message persistent
                          ))
print("===  Sent images from images directory")

connection.close()
