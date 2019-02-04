import pika
import logging

f = open("j.jpg", "rb")
i = f.read()

logging.basicConfig()
connection = pika.BlockingConnection(pika.ConnectionParameters('127.0.0.1'))
channel = connection.channel()

channel.queue_declare(queue='xhello')

x = 5

for _ in range(x):
    channel.basic_publish(exchange="", routing_key ='hello', body = i)
print("===  Sent {} copies of samoyed.jpg".format(x))
connection.close()
