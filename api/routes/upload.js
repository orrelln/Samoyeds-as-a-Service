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
            try {
                const ch = rabbitmq.getTaskChannel();
                (async () => {
                    await Promise.all([pg.insertStatus(id),
                        queueItem(id, ch, req.file.path)])
                })().catch(err => console.log(err.stack));

                const approxTime = rabbitmq.getApproxQueueTime();

                res.status(200).json({
                    id: id,
                    processing_estimation: approxTime
                });
            } catch (err) {
                res.status(500).send();
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