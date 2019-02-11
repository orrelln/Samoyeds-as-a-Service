const amqp = require('amqplib/callback_api');
const pgPool = require('./postgres');
const assert = require('assert');

let _taskChannel = null;

// approxLoad {Testing: 0.315, Production: 1.94}
let _queueInfo = {
    approxCount: 0,
    approxLoad: 1.94,
    lastCheck: null,
    timeTilCheck: null,
    timeTilCheckLength: 5 * 60
};

function initTaskChannel() {
    amqp.connect('amqp://rabbitmq-server:5672', function (err, conn) {
        conn.createChannel(function (err, ch) {
            const q = 'task_queue';
            ch.assertQueue(q, {durable: true});
            _taskChannel = ch;
        });
    });
}

function getTaskChannel() {
    assert(_taskChannel, "Task queue channel not initialized, run initTaskChannel()");
    return _taskChannel;
}

function getApproxQueueTime() {
    const now = Date.now() / 1000;
    _queueInfo.approxCount += 1;

    if(!_queueInfo.lastCheck) {
        _queueInfo.lastCheck = Date.now() / 1000;
        _queueInfo.timeTilCheck = _queueInfo.lastCheck + _queueInfo.timeTilCheckLength;
    }

    const approxTime = Math.max((_queueInfo.approxCount *
        _queueInfo.approxLoad + (_queueInfo.lastCheck - now)), 0);

    if(now > _queueInfo.timeTilCheck) {
        _queueInfo.lastCheck = now;
        _queueInfo.approxCount = Math.max(
            0, Math.floor(approxTime / _queueInfo.approxLoad));
        _queueInfo.timeTilCheck = now + _queueInfo.timeTilCheckLength
    }

    console.log(approxTime, _queueInfo);

    return approxDuration(approxTime);

}

function approxDuration(duration) {
    let str;
    switch (true) {
        case (duration <= 5):
            str = 'Less than 5 seconds';
            break;
        case (duration <= 30):
            str = 'Less than 30 seconds';
            break;
        case (duration <= 60):
            str = 'Less than a minute';
            break;
        case (duration <= 5 * 60):
            str = 'Less than 5 minutes';
            break;
        case (duration <= 30 * 60):
            str = 'Less than 30 minutes';
            break;
        default:
            str = 'More than 30 minutes';
            break;
    }
    return str;
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
                    await Promise.all([_updateStatus(result),
                        result.error ? null : _insertRecord(result)]);
                })().catch(err => console.log(err.stack));

                console.log(" [x] Received %s", result.id);
                ch.ack(msg);

            }, {noAck: false});
        });
    });
}

async function _updateStatus(result) {
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

async function _insertRecord(result) {
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
    startReturnChannel,
    initTaskChannel,
    getTaskChannel,
    getApproxQueueTime
};