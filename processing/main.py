import asyncio
from processing.networks import InceptionNetwork, QueueItem
from quart import Quart


inception_network = InceptionNetwork()
asyncio.ensure_future(inception_network.classify())

feed_queue = inception_network.feed_queue
return_queue = inception_network.return_queue
event_loop = asyncio.get_event_loop()

#app = Quart(__name__)


#@app.route('/')
async def add_to_queue():
    await feed_queue.put(QueueItem(image_path='samoyed.jpg', idx=1, status=202))

    processed = await return_queue.get()

    print(processed.__dict__)

event_loop.run_until_complete(add_to_queue())
