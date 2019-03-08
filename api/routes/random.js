const router = require('express').Router();
const {selectRandom} = require('../utils/postgres');
const {sanitize} = require('../utils/sanitation');
const {rowsToSimple, rowsToRobust} = require('../utils/express_functions');


const limit = 10;

// Handles requests for random images
router.get('/', (req,res) => {
    (async () => {
        // Query DB for 'count' amount of dogs, up to 10
        const args = sanitize(req);

        if(args.count > limit) {
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
                let result = await selectRandom(args);
                res.status(200).json({
                    status: 'success',
                     message: args.robust ? rowsToRobust(result, req) : rowsToSimple(result, req)
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