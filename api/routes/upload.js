const router = require('express').Router();
const image_handling = require('../utils/image_handling');
const {assertTaskChannel, putItemOnTaskQueue} = require('../utils/rabbitmq');
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
                (async () => {
                    await Promise.all([insertStatus(id, req.ip),
                        putItemOnTaskQueue(id, req.file.path)])
                })().catch(err => console.log(err.stack));

                res.status(202).json({
                    status: 'success',
                    message: {
                        link: `/processing/${id}`
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