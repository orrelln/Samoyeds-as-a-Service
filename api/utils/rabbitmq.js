const amqp = require('amqplib/callback_api');
const {updateStatus, insertRecord} = require('./postgres');
const assert = require('assert');
const {moveFile} = require('./image_handling');

let _taskChannel = null;

function initTaskChannel() {
    amqp.connect('amqp://rabbitmq-server:5672', function (err, conn) {
        conn.createChannel(function (err, ch) {
            const q = 'task_queue';
            ch.assertQueue(q, {durable: true});
            _taskChannel = ch;
        });
    });
}

function assertTaskChannel() {
    assert(_taskChannel, "Task queue channel not initialized, run initTaskChannel()");
}

async function putItemOnTaskQueue(id, path) {
    const msg = {
        id: id,
        path: path
    };

    try {
        _taskChannel.sendToQueue('task_queue',  Buffer.from(JSON.stringify(msg)), {persistent: true});
    } catch (err) {
        console.log(err);
    }
}

function startReturnChannel() {
    amqp.connect('amqp://rabbitmq-server:5672', function (err, conn) {
        conn.createChannel(function (err, ch) {
            const q = 'return_queue';

            ch.assertQueue(q, {durable: true});
            ch.prefetch(1);
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

            ch.consume(q, function (msg) {
                let result = JSON.parse(msg.content);

                (async () => {
                    if (!result.reject) {
                        try {
                            await moveFile(result.path, result.path.replace('temp', 'images'));
                            await Promise.all([updateStatus(result), insertRecord(result)]);
                        } catch (e) {
                            console.log(e)
                        }
                    }
                    else {
                        updateStatus(result);
                    }
                })().catch(err => console.log(err.stack));

                console.log(" [x] Received %s", result.id);
                ch.ack(msg);

            }, {noAck: false});
        });
    });
}


module.exports = {
    startReturnChannel,
    initTaskChannel,
    assertTaskChannel,
    putItemOnTaskQueue
};