const amqp = require('amqplib/callback_api');
const pgPool = require('./postgres');
const assert = require('assert');

let _channel = null;


function initReturnChannel() {
    amqp.connect('amqp://rabbitmq-server:5672', function (err, conn) {
        conn.createChannel(function (err, ch) {
            const q = 'work_queue';
            ch.assertQueue(q, {durable: true});
            _channel = ch
        });
    });
}

function getReturnChannel() {
    assert(_channel, "Return queue channel not initialized, run initReturnChannel()")
    return _channel
}

function startWorkQueue() {
    amqp.connect('amqp://rabbitmq-server:5672', function (err, conn) {
        conn.createChannel(function (err, ch) {
            const q = 'return_queue';

            ch.assertQueue(q, {durable: true});
            ch.prefetch(1);
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

            ch.consume(q, function (msg) {
                let result = JSON.parse(msg.content);

                (async () => {
                    await Promise.all([updateStatus(result),
                        result.error ? null : insertRecord(result)]);
                })().catch(err => console.log(err.stack));

                console.log(" [x] Received %s", result.id);
                ch.ack(msg);

            }, {noAck: false});
        });
    });
}

async function updateStatus(result) {
    const client = await pgPool.connect();
    const query = {
        text: 'UPDATE processing_status SET status = $1 WHERE id = $2',
        values: [result.error ? 'rejected' : 'approved', result.id]
    };
    try {
        const res = await client.query(query)
    } catch(err) {
        console.log(err.stack)
    }
    finally {
        client.release()
    }
}

async function insertRecord(result) {
    const client = await pgPool.connect();
    const query = {
        text: 'INSERT INTO image_data(id, path, breed1, percentage1, breed2, percentage2, ' +
        'breed3, percentage3, breed4, percentage4, breed5, percentage5) VALUES($1, $2, ' +
        '$3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
        values: [result.id, result.path, result.breed1, result.percentage1, result.breed2,
            result.percentage2, result.breed3, result.percentage3, result.breed4,
            result.percentage4, result.breed5, result.percentage5]
    };
    try {
        const res = await client.query(query)
    } catch(err) {
        console.log(err.stack)
    }
    finally {
        client.release()
    }
}

module.exports = {
    startWorkQueue,
    initReturnChannel,
    getReturnChannel
};