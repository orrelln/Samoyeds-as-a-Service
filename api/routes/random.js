const router = require('express').Router();
const {selectRandom} = require('../utils/postgres');
const {idToImgPath} = require('../utils/express_functions');

const limit = 10;

// Handles requests for random images
router.get('/', (req,res) => {
    (async () => {
        // Query DB for 'count' amount of dogs, up to 10
        let count = isNaN(req.query.count) ? 1 : req.query.count;

        if(count > limit) {
            res.status(403).json({
                status: 'error',
                code: '403',
                message: {
                    info: "Too many images requested",
                    limit: limit
                }
            });
        }
        else {
            try {
                let result = await selectRandom(count);
                res.status(200).json({
                    status: 'success',
                    message: idToImgPath(result, req)
                });
            }
            catch (err) {
                res.status(500).json({
                    status: 'error',
                    code: '500',
                    message: 'Internal Server Error, try again later.'
                });
            }
        }
    })();
});

exports.router = router;