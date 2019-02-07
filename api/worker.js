const amqp = require('amqplib/callback_api');

module.exports = {
    startQueue: function () {
        amqp.connect('amqp://rabbitmq-server:5672', function (err, conn) {
            conn.createChannel(function (err, ch) {
                const q = 'return_queue';

                ch.assertQueue(q, {durable: true});
                ch.prefetch(1);
                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
                ch.consume(q, function (msg) {
                    console.log(" [x] Received %s", msg.content.toString());
                    ch.ack(msg);
                }, {noAck: false});
            });
        });
    }
};