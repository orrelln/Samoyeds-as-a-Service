const router = require('express').Router();
const image_handling = require('../utils/image_handling');
const rabbitmq = require('../utils/rabbitmq');
const pg = require('../utils/postgres');

router.post('/', (req, res) => {
    image_handling.save(req, res, function (err) {
        if (err || !req.file) {
            res.status(400).json({
                error: "Request doesn't contain a valid png or jpeg."
            });
        }
        else {
            const id = req.file.filename.replace(/\.[^/.]+$/, "");
            let ch;
            try {
                ch = rabbitmq.getTaskChannel();
            } catch (err) {
                res.status(500).json({
                    error: "Internal Server Error"
                });
                ch = null;
            }

            if (ch) {
                (async () => {
                    await Promise.all([pg.insertStatus(id),
                        queueItem(id, ch, '/api/' + req.file.path)])
                })().catch(err => console.log(err.stack));

                const approxTime = rabbitmq.getApproxQueueTime();
                res.status(200).json({
                    _id: id,
                    processing_estimation: approxTime
                });
            }
        }
    });

});

async function queueItem(id, ch, path) {
    const msg = {
        id: id,
        path: path
    };

    try {
        ch.sendToQueue('task_queue',  Buffer.from(JSON.stringify(msg)), {persistent: true});
    } catch (err) {
        console.log(err);
    }
}

exports.router = router;