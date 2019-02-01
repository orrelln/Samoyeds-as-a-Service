import asyncio
from processing.nets import ImageNetNetwork, QueueItem
from skimage.transform import resize
import imread
import aio_pika

from keras import backend as K
K.set_session(K.tf.Session(config=K.tf.ConfigProto(intra_op_parallelism_threads=1, inter_op_parallelism_threads=1)))


#networks = ['seresnet34', 'seresnet18', 'resnet34', 'resnet18', 'mobilenet', 'mobilenetv2']
#networks = ['nasnetlarge']
networks = ['seresnet18','resnet18', 'mobilenet', 'mobilenetv2']

SIZE = 224


async def add_to_queue():
    connection = await aio_pika.connect_robust(
        "amqp://guest:guest@127.0.0.1/", loop=loop
    )

    async with connection:
        queue_name = "hello"

        # Creating channel
        channel = await connection.channel()  # type: aio_pika.Channel

        # Declaring queue
        queue = await channel.declare_queue(
            queue_name,
            auto_delete=False
        )  # type: aio_pika.Queue

        print('===  listening')
        async for message in queue:
            with message.process():
                image = imread.imread_from_blob(message.body)
                image = resize(image, (SIZE, SIZE)) * 255  # cast back to 0-255 range
                for idx, network in enumerate(image_networks):
                    item = QueueItem(image=image.copy(), idx=idx)
                    await network.feed_queue.put(item)


async def remove_from_queue():
    while True:
        processed = await return_queue.get()
        print(processed.predictions)
        lock.release()


loop = asyncio.get_event_loop()
return_queue = asyncio.Queue()
lock = asyncio.Lock()

image_networks = [ImageNetNetwork(network, return_queue, lock) for network in networks]

asyncio.gather(*[add_to_queue(), remove_from_queue()])
asyncio.gather(*[image_network.classify() for image_network in image_networks])

loop.run_forever()
