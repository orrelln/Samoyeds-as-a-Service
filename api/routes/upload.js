const router = require('express').Router();
const image_handling = require('../utils/image_handling');
const {assertTaskChannel, putItemOnTaskQueue} = require('../utils/rabbitmq');
const {getApproxQueueTime, approxTimeToMsg} = require('../utils/approx_queue');

const {insertStatus} = require('../utils/postgres');

router.post('/', (req, res) => {
    image_handling.save(req, res, function (err) {
        if (err || !req.file) {
            res.status(422).json({
                status: 'error',
                code: '422',
                message: 'Request doesn\'t contain a valid png or jpeg'
            });
        }
        else {
            const id = req.file.filename.replace(/\.[^/.]+$/, "");
            try {
                assertTaskChannel();
                const approxTime = getApproxQueueTime();

                (async () => {
                    await Promise.all([insertStatus(id, approxTime),
                        putItemOnTaskQueue(id, req.file.path)])
                })().catch(err => console.log(err.stack));

                res.status(200).json({
                    status: 'success',
                    message: {
                        id: id,
                        processing_estimation: approxTimeToMsg(approxTime),
                        link: `/id/${id}`
                    }
                });

            } catch (err) {
                res.status(500).json({
                    status: 'error',
                    code: '500',
                    message: 'Internal Server Error, try again later.'
                });
            }
        }
    });
});

exports.router = router;