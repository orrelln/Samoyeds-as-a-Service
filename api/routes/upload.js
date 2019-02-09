const router = require('express').Router();
const image_handling = require('../utils/image_handling');
const rabbitmq = require('../utils/rabbitmq');
const fs = require('fs');
const pgPool = require('../utils/postgres');



router.post('/', (req, res) => {
    image_handling.save(req, res, function (err) {
        if (err) {
            res.status(400).json({
                error: "Request doesn't contain a valid png or jpeg."
            });
        }
        else {
            const id = req.file.filename.replace(/\.[^/.]+$/, "");

             (async () => {
                    await Promise.all([InsertStatus(id),
                        queueItem(id, '/api/' + req.file.path)])
             })().catch(err => console.log(err.stack));

            res.status(200).json({
                ID: id
            });
        }
    });

});

async function InsertStatus(id) {
    let now = new Date();
    now.setTime(now.getTime() + (7 * 24 * 60 * 60 * 1000));

    const client = await pgPool.connect();
    const query = {
        text: 'INSERT INTO processing_status(id, status, time_til_finish) VALUES($1, $2, $3)',
        values: [id, 'processing', now]
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

async function queueItem(id, path) {
    const msg = {
        id: id,
        path: path
    };

    try {
        rabbitmq.getReturnChannel().sendToQueue('task_queue',  Buffer.from(JSON.stringify(msg)), {persistent: true});
    } catch (err) {
        console.log(err);
    }
}

exports.router = router;