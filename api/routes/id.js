const router = require('express').Router();
const {selectId, selectIdProcessing} = require('../utils/postgres');
const {approxTimeToMsg} = require('../utils/approx_queue');
const {idToImgPath} = require('../utils/express_functions');
const re = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$');

router.get('/:id', (req, res) => {
    let id = req.params.id;

    if(!re.test(id)) {
        res.status(404).json({
            status: 'error',
            code: '404',
            message: 'Invalid id format'
        });
    }
    else {
        (async () => {
            try {
                let result = await selectId(id);
                if (result) {
                    res.status(200).json({
                        status: 'success',
                        message: {
                            image: idToImgPath(result.id, req),
                            breed: result.breed1,
                        }
                    });
                } else {
                    result = await selectIdProcessing(id);
                    if (result) {
                        const msg = _generateStatusMsg(result.status);
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

function _generateStatusMsg (status) {
    let msg;
     switch (status) {
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
         case 'completed':
             msg = {
                 processing_status: 'completed',
                 processing_message: 'Image was identified, try accessing this endpoint again'
             };
             break;
         default:
             msg = 'Please report this id if this message occurs'
     }
     return msg;
}


exports.router = router;