const router = require('express').Router();
const {selectStatus, selectRecentStatus} = require('../utils/postgres');
const {approxTimeToMsg} = require('../utils/approx_queue');
const {parse} = require('../utils/args_parser');

router.get('/:id', (req, res) => {
    let args = parse(req);

    if(!args.id) {
        res.status(404).json({
            status: 'error',
            code: '404',
            message: 'Invalid id format'
        });
    }
    else {
        (async () => {
            try {
                let results = await Promise.all([selectStatus(args), selectRecentStatus()]);
                if (results[0]) {
                    const msg = generateStatusMsg(results);
                    res.status(200).json({
                        status: 'success',
                        message: msg
                    });
                } else {
                    res.status(404).json({
                        status: 'error',
                        code: '404',
                        message: 'Id not found'
                    });
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json({
                    status: 'error',
                    code: '500',
                    message: 'Internal Server Error, try again later.'
                });
            }
        })();
    }
});

function generateStatusMsg(results) {
    let msg;
    switch (results[0].status) {
        case 'processing':
            msg = {
                processing_status: 'processing',
                processing_estimation: approxTimeToMsg(results[0].queue_number, results[1].queue_number),
                id: results[0].id
            };
            break;
        case 'rejected':
            msg = {
                processing_status: 'rejected',
                processing_message: 'Image was not identified to be that of a dog or supported dog breed',
                id: results[0].id
            };
            break;
        case 'approved':
            msg = {
                processing_status: 'approved',
                id: results[0].id,
                link: `/id/${results[0].id}`
            };
            break;
        default:
            msg = 'Please report this id if this message occurs'
    }
    return msg;
}

exports.router = router;