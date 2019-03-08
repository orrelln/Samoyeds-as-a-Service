const router = require('express').Router();
const {selectId, selectStatus} = require('../utils/postgres');
const {approxTimeToMsg} = require('../utils/approx_queue');
const {rowsToSimple, rowsToRobust} = require('../utils/express_functions');
const {sanitize} = require('../utils/sanitation');

router.get('/:id', (req, res) => {
    let args = sanitize(req);

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
                let result = await selectId(args);
                if (result) {
                    res.status(200).json({
                        status: 'success',
                        message:  args.robust ? rowsToRobust(result, req) : rowsToSimple(result, req)
                    });
                } else {
                    result = await selectStatus(args);
                    if (result) {
                        const msg = _generateStatusMsg(result);
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

function _generateStatusMsg(result) {
    let msg;
    switch (result.status) {
        case 'processing':
            const now = Date.now();
            const timeRemaining = Math.max(result.time_til_finish - now, 0);
            msg = {
                processing_status: 'processing',
                processing_estimation: approxTimeToMsg(timeRemaining / 1000)
            };
            break;
        case 'rejected':
            msg = {
                processing_status: 'rejected',
                processing_message: 'Image was not identified to be that of a dog or supported dog breed'
            };
            break;
        case 'approved':
            msg = {
                processing_status: 'approved',
                processing_message: 'Image was identified, try accessing this endpoint again'
            };
            break;
        default:
            msg = 'Please report this id if this message occurs'
    }
    return msg;
}


exports.router = router;